import { defaultSceneByWorld, getAmbientAsset, getMusicAsset, sceneProfiles, uiSoundAssets } from "./audioConfig";
import { audioThemes } from "./themes";
import type {
  AudioSceneId,
  AudioSettings,
  AudioSnapshot,
  UiSoundId
} from "./audioTypes";
import type { GameWorldId } from "../content/gameWorlds";

const storageKey = "agent-book-audio-settings";

export const defaultAudioSettings: AudioSettings = {
  masterVolume: 0.72,
  uiEnabled: true,
  uiVolume: 0.58,
  ambientEnabled: false,
  ambientVolume: 0.42,
  musicEnabled: false,
  musicVolume: 0.32,
  muted: false,
  scene: "spring-day"
};

type AudioContextWithWebkit = typeof window & {
  webkitAudioContext?: typeof AudioContext;
};

type AmbientLayer = {
  scene: AudioSceneId;
  gain: GainNode;
  nodes: Array<AudioScheduledSourceNode | OscillatorNode>;
  timers: number[];
  stop: () => void;
};

function clamp(value: number) {
  return Math.max(0, Math.min(1, value));
}

function readSettings(): AudioSettings {
  if (typeof window === "undefined") return { ...defaultAudioSettings };
  try {
    const saved = JSON.parse(window.localStorage.getItem(storageKey) ?? "null") as Partial<AudioSettings> | null;
    if (!saved || typeof saved !== "object") return { ...defaultAudioSettings };
    return {
      ...defaultAudioSettings,
      ...saved,
      masterVolume: clamp(Number(saved.masterVolume ?? defaultAudioSettings.masterVolume)),
      uiVolume: clamp(Number(saved.uiVolume ?? defaultAudioSettings.uiVolume)),
      ambientVolume: clamp(Number(saved.ambientVolume ?? defaultAudioSettings.ambientVolume)),
      musicVolume: clamp(Number(saved.musicVolume ?? defaultAudioSettings.musicVolume)),
      scene: saved.scene && saved.scene in sceneProfiles ? saved.scene : defaultAudioSettings.scene
    };
  } catch {
    return { ...defaultAudioSettings };
  }
}

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const AudioContextConstructor = window.AudioContext ?? (window as AudioContextWithWebkit).webkitAudioContext;
  return AudioContextConstructor ? new AudioContextConstructor() : null;
}

function createNoiseBuffer(context: AudioContext, seconds = 2) {
  const length = Math.floor(context.sampleRate * seconds);
  const buffer = context.createBuffer(1, length, context.sampleRate);
  const data = buffer.getChannelData(0);
  let previous = 0;
  for (let index = 0; index < length; index += 1) {
    previous = previous * 0.997 + (Math.random() * 2 - 1) * 0.025;
    data[index] = previous * 2.4;
  }
  return buffer;
}

function fadeGain(gain: GainNode, from: number, to: number, duration: number, context: AudioContext) {
  const now = context.currentTime;
  gain.gain.cancelScheduledValues(now);
  gain.gain.setValueAtTime(from, now);
  gain.gain.linearRampToValueAtTime(to, now + duration / 1000);
}

class AudioManager {
  private settings = readSettings();
  private worldId: GameWorldId = "stardew";
  private context: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private uiGain: GainNode | null = null;
  private ambientGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private noiseBuffer: AudioBuffer | null = null;
  private ambientLayer: AmbientLayer | null = null;
  private currentMusic: HTMLAudioElement | null = null;
  private currentMusicSource: MediaElementAudioSourceNode | null = null;
  private decodedBuffers = new Map<string, AudioBuffer>();
  private loadingBuffers = new Map<string, Promise<AudioBuffer | null>>();
  private lastPlayed = new Map<UiSoundId, number>();
  private activeSources = new Map<UiSoundId, Set<AudioBufferSourceNode>>();
  private listeners = new Set<() => void>();
  private snapshot: AudioSnapshot;

  constructor() {
    this.snapshot = this.createSnapshot();
    if (typeof document !== "undefined") {
      document.addEventListener("visibilitychange", this.handleVisibilityChange);
    }
  }

  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  getSnapshot = () => this.snapshot;

  getSettings() {
    return this.settings;
  }

  setWorld(worldId: GameWorldId) {
    if (this.worldId === worldId) return;
    this.worldId = worldId;
    this.stopAmbient(220);
    this.stopMusic(220);
    const theme = audioThemes[worldId];
    if (!theme.ambientScenes.includes(this.settings.scene)) {
      this.settings = { ...this.settings, scene: defaultSceneByWorld[worldId] };
      this.persist();
    }
    this.emit();
    this.startEnabledLayers();
  }

  setScene(scene: AudioSceneId) {
    if (!(scene in sceneProfiles) || this.settings.scene === scene) return;
    this.updateSettings({ scene });
  }

  updateSettings(patch: Partial<AudioSettings>) {
    const next = { ...this.settings, ...patch };
    this.settings = {
      ...next,
      masterVolume: clamp(next.masterVolume),
      uiVolume: clamp(next.uiVolume),
      ambientVolume: clamp(next.ambientVolume),
      musicVolume: clamp(next.musicVolume)
    };
    this.persist();
    this.applyVolumes();
    this.emit();
    this.startEnabledLayers();
    if (!this.settings.ambientEnabled || this.settings.muted) this.stopAmbient(180);
    if (!this.settings.musicEnabled || this.settings.muted) this.stopMusic(180);
  }

  resetSettings() {
    this.settings = {
      ...defaultAudioSettings,
      scene: defaultSceneByWorld[this.worldId]
    };
    this.stopAmbient(120);
    this.stopMusic(120);
    this.persist();
    this.applyVolumes();
    this.emit();
  }

  playUi(soundId: UiSoundId) {
    if (!this.settings.uiEnabled || this.settings.muted) return;
    const now = performance.now();
    const last = this.lastPlayed.get(soundId) ?? 0;
    if (now - last < (soundId === "click" ? 55 : 110)) return;
    this.lastPlayed.set(soundId, now);
    const url = uiSoundAssets[soundId];
    if (!url) return;
    const context = this.ensureContext();
    if (!context || !this.uiGain) return;
    void context.resume();
    void this.loadBuffer(url).then((buffer) => {
      if (!buffer || context.state === "closed") return;
      const sources = this.activeSources.get(soundId) ?? new Set<AudioBufferSourceNode>();
      if (sources.size >= (soundId === "click" ? 3 : 2)) return;
      const source = context.createBufferSource();
      source.buffer = buffer;
      const gain = context.createGain();
      gain.gain.value = soundId === "click" ? 0.68 : 0.88;
      source.connect(gain).connect(this.uiGain!);
      sources.add(source);
      this.activeSources.set(soundId, sources);
      source.addEventListener("ended", () => sources.delete(source), { once: true });
      source.start();
    });
  }

  unlock() {
    const context = this.ensureContext();
    if (context) void context.resume();
    this.startEnabledLayers();
  }

  private startEnabledLayers() {
    if (!this.settings.muted && this.settings.ambientEnabled) this.startAmbient();
    if (!this.settings.muted && this.settings.musicEnabled) this.startMusic();
  }

  private startAmbient() {
    const context = this.ensureContext();
    if (!context || !this.ambientGain || this.worldId !== "stardew") return;
    const theme = audioThemes[this.worldId];
    if (!theme.ambientScenes.includes(this.settings.scene)) return;
    void context.resume();
    if (this.ambientLayer?.scene === this.settings.scene) return;
    this.stopAmbient(420);

    const sceneId = this.settings.scene;
    const asset = getAmbientAsset(this.worldId, sceneId);
    if (asset) {
      void this.loadBuffer(asset).then((buffer) => {
        if (!buffer || context.state === "closed") return;
        if (
          !this.settings.ambientEnabled ||
          this.settings.muted ||
          this.worldId !== "stardew" ||
          this.settings.scene !== sceneId
        ) {
          return;
        }
        const scene = this.createAudioAmbientLayer(sceneId, context, buffer);
        this.ambientLayer = scene;
        fadeGain(scene.gain, 0, this.ambientLevel(), 0.65, context);
      });
      return;
    }

    const scene = this.createProceduralAmbientLayer(sceneId, context);
    this.ambientLayer = scene;
    fadeGain(scene.gain, 0, this.ambientLevel(), 0.65, context);
  }

  private stopAmbient(duration: number) {
    const layer = this.ambientLayer;
    const context = this.context;
    this.ambientLayer = null;
    if (!layer || !context) return;
    fadeGain(layer.gain, layer.gain.gain.value, 0, duration, context);
    window.setTimeout(layer.stop, duration + 40);
  }

  private createAudioAmbientLayer(scene: AudioSceneId, context: AudioContext, buffer: AudioBuffer): AmbientLayer {
    const source = context.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    const gain = context.createGain();
    gain.gain.value = 0;
    source.connect(gain).connect(this.ambientGain!);
    source.start();

    return {
      scene,
      gain,
      nodes: [source],
      timers: [],
      stop: () => {
        try {
          source.stop();
        } catch {
          // The source may already have stopped.
        }
        source.disconnect();
        gain.disconnect();
      }
    };
  }

  private createProceduralAmbientLayer(scene: AudioSceneId, context: AudioContext): AmbientLayer & { scene: AudioSceneId } {
    if (!this.noiseBuffer) this.noiseBuffer = createNoiseBuffer(context);
    const source = context.createBufferSource();
    source.buffer = this.noiseBuffer;
    source.loop = true;
    const filter = context.createBiquadFilter();
    filter.type = scene === "ocean" ? "lowpass" : scene === "rain" ? "bandpass" : "lowpass";
    filter.frequency.value = scene === "ocean" ? 620 : scene === "rain" ? 1600 : scene === "fireplace" ? 900 : 1100;
    const gain = context.createGain();
    gain.gain.value = 0;
    source.connect(filter).connect(gain).connect(this.ambientGain!);
    source.start();
    const nodes: Array<AudioScheduledSourceNode | OscillatorNode> = [source];
    const timers: number[] = [];

    const addTone = (frequency: number, volume: number, interval: number) => {
      const timer = window.setInterval(() => {
        if (context.state === "closed") return;
        const oscillator = context.createOscillator();
        const toneGain = context.createGain();
        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(frequency, context.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(frequency * 1.18, context.currentTime + 0.18);
        toneGain.gain.setValueAtTime(0.0001, context.currentTime);
        toneGain.gain.exponentialRampToValueAtTime(volume, context.currentTime + 0.025);
        toneGain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.22);
        oscillator.connect(toneGain).connect(gain);
        oscillator.start();
        oscillator.stop(context.currentTime + 0.24);
        nodes.push(oscillator);
      }, interval);
      timers.push(timer);
    };

    if (scene === "spring-day" || scene === "summer-day" || scene === "autumn-day") {
      addTone(scene === "summer-day" ? 1320 : 980, 0.06, scene === "summer-day" ? 3200 : 4700);
    } else if (scene === "spring-night") {
      addTone(430, 0.045, 1550);
    } else if (scene === "ocean") {
      addTone(210, 0.035, 4200);
    } else if (scene === "fireplace") {
      addTone(150, 0.03, 2100);
    }

    return {
      scene,
      gain,
      nodes,
      timers,
      stop: () => {
        timers.forEach((timer) => window.clearInterval(timer));
        nodes.forEach((node) => {
          try {
            node.stop();
          } catch {
            // An oscillator can already have ended.
          }
          node.disconnect();
        });
        gain.disconnect();
      }
    };
  }

  private startMusic() {
    const context = this.ensureContext();
    const url = getMusicAsset(this.worldId, this.settings.scene);
    if (!context || !this.musicGain || !url || this.currentMusic?.dataset.asset === url) return;
    void context.resume();
    const next = new Audio(url);
    next.loop = true;
    next.preload = "auto";
    next.dataset.asset = url;
    next.volume = 1;
    const source = context.createMediaElementSource(next);
    source.connect(this.musicGain);
    const previous = this.currentMusic;
    const previousSource = this.currentMusicSource;
    this.currentMusic = next;
    this.currentMusicSource = source;
    void next.play().catch(() => undefined);
    if (previous) {
      previous.pause();
      previous.src = "";
    }
    previousSource?.disconnect();
  }

  private stopMusic(_duration = 180) {
    if (!this.currentMusic) return;
    this.currentMusic.pause();
    this.currentMusic.src = "";
    this.currentMusic = null;
    this.currentMusicSource?.disconnect();
    this.currentMusicSource = null;
  }

  private ensureContext() {
    if (!this.context) {
      this.context = getAudioContext();
      if (!this.context) return null;
      this.masterGain = this.context.createGain();
      this.uiGain = this.context.createGain();
      this.ambientGain = this.context.createGain();
      this.musicGain = this.context.createGain();
      this.uiGain.connect(this.masterGain);
      this.ambientGain.connect(this.masterGain);
      this.musicGain.connect(this.masterGain);
      this.masterGain.connect(this.context.destination);
      this.applyVolumes();
    }
    return this.context;
  }

  private loadBuffer(url: string): Promise<AudioBuffer | null> {
    const cached = this.decodedBuffers.get(url);
    if (cached) return Promise.resolve(cached);
    const loading = this.loadingBuffers.get(url);
    if (loading) return loading;
    const promise = fetch(url)
      .then((response) => response.arrayBuffer())
      .then((data) => this.context?.decodeAudioData(data) ?? null)
      .then((buffer) => {
        if (buffer) this.decodedBuffers.set(url, buffer);
        return buffer;
      })
      .catch(() => null);
    this.loadingBuffers.set(url, promise);
    return promise;
  }

  private applyVolumes() {
    const master = this.settings.muted ? 0 : this.settings.masterVolume;
    if (this.masterGain) this.masterGain.gain.value = master;
    if (this.uiGain) this.uiGain.gain.value = this.settings.uiEnabled ? this.settings.uiVolume : 0;
    if (this.ambientGain) this.ambientGain.gain.value = this.settings.ambientEnabled ? this.settings.ambientVolume : 0;
    if (this.musicGain) this.musicGain.gain.value = this.settings.musicEnabled ? this.settings.musicVolume : 0;
    if (this.ambientLayer && this.context) {
      const target = this.settings.ambientEnabled && !this.settings.muted ? this.ambientLevel() : 0;
      fadeGain(this.ambientLayer.gain, this.ambientLayer.gain.gain.value, target, 100, this.context);
    }
  }

  private ambientLevel() {
    return 0.8;
  }

  private persist() {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(storageKey, JSON.stringify(this.settings));
    }
  }

  private createSnapshot(): AudioSnapshot {
    return {
      settings: this.settings,
      worldId: this.worldId,
      ambientAvailable: typeof window !== "undefined" && Boolean(window.AudioContext || (window as AudioContextWithWebkit).webkitAudioContext),
      musicAvailable: Boolean(getMusicAsset(this.worldId, this.settings.scene))
    };
  }

  private emit() {
    this.snapshot = this.createSnapshot();
    this.listeners.forEach((listener) => listener());
  }

  private handleVisibilityChange = () => {
    if (!this.context) return;
    if (document.hidden) {
      void this.context.suspend();
      return;
    }
    if (!this.settings.muted && (this.settings.uiEnabled || this.settings.ambientEnabled || this.settings.musicEnabled)) {
      void this.context.resume();
    }
  };
}

export const audioManager = new AudioManager();
