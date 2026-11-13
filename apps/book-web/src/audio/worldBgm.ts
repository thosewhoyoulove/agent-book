import type { GameWorldId } from "../content/gameWorlds";

const bgmStorageKey = "agent-book-bgm-enabled";
const bgmVolumeKey = "agent-book-bgm-volume";

/** Auto-discover dropped theme tracks: stardew|celeste|hollow.(ogg|mp3|wav) */
const discovered = import.meta.glob("../assets/bgm/*.{ogg,mp3,wav}", {
  eager: true,
  import: "default"
}) as Record<string, string>;

function resolveTrackUrl(worldId: GameWorldId): string | null {
  const preferred = [`${worldId}.ogg`, `${worldId}.mp3`, `${worldId}.wav`];
  for (const name of preferred) {
    const hit = Object.entries(discovered).find(([path]) => path.endsWith(`/bgm/${name}`));
    if (hit) return hit[1];
  }
  return null;
}

export const bgmTrackAvailability: Record<GameWorldId, boolean> = {
  stardew: Boolean(resolveTrackUrl("stardew")),
  celeste: Boolean(resolveTrackUrl("celeste")),
  hollow: Boolean(resolveTrackUrl("hollow"))
};

function loadEnabled(): boolean {
  if (typeof window === "undefined") return true;
  const saved = window.localStorage.getItem(bgmStorageKey);
  if (saved === null) return true;
  return saved === "1";
}

function loadVolume(): number {
  if (typeof window === "undefined") return 0.35;
  const raw = Number(window.localStorage.getItem(bgmVolumeKey));
  if (!Number.isFinite(raw)) return 0.35;
  return Math.min(1, Math.max(0, raw));
}

/**
 * Per-world looping BGM with crossfade.
 * Drop files into src/assets/bgm/{worldId}.{ogg|mp3|wav} to enable tracks.
 */
class WorldBgmEngine {
  private enabled = loadEnabled();
  private volume = loadVolume();
  private currentWorld: GameWorldId | null = null;
  private current: HTMLAudioElement | null = null;
  private fading: number | null = null;
  private unlocked = false;
  private listeners = new Set<(enabled: boolean) => void>();

  isEnabled() {
    return this.enabled;
  }

  hasAnyTrack() {
    return Object.values(bgmTrackAvailability).some(Boolean);
  }

  hasTrack(worldId: GameWorldId) {
    return bgmTrackAvailability[worldId];
  }

  subscribe(listener: (enabled: boolean) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  setEnabled(next: boolean) {
    this.enabled = next;
    if (typeof window !== "undefined") {
      window.localStorage.setItem(bgmStorageKey, next ? "1" : "0");
    }
    this.listeners.forEach((listener) => listener(next));
    if (!next) {
      this.stop(180);
      return;
    }
    this.unlocked = true;
    if (this.currentWorld) this.play(this.currentWorld, true);
  }

  toggle() {
    this.setEnabled(!this.enabled);
  }

  setVolume(next: number) {
    this.volume = Math.min(1, Math.max(0, next));
    if (typeof window !== "undefined") {
      window.localStorage.setItem(bgmVolumeKey, String(this.volume));
    }
    if (this.current) this.current.volume = this.enabled ? this.volume : 0;
  }

  /** Call from a user gesture so autoplay policies allow music. */
  unlock() {
    this.unlocked = true;
    if (this.enabled && this.currentWorld) this.play(this.currentWorld, true);
  }

  play(worldId: GameWorldId, forceRestart = false) {
    this.currentWorld = worldId;
    if (!this.enabled || !this.unlocked) return;

    const url = resolveTrackUrl(worldId);
    if (!url) {
      this.stop(220);
      return;
    }

    if (!forceRestart && this.current && !this.current.paused && this.current.dataset.world === worldId) {
      return;
    }

    const next = new Audio(url);
    next.loop = true;
    next.preload = "auto";
    next.dataset.world = worldId;
    next.volume = 0;

    const start = () => {
      const prev = this.current;
      this.current = next;
      void next.play().catch(() => {
        // Autoplay blocked until unlock(); keep state for retry.
      });
      this.crossfade(prev, next, 700);
    };

    if (next.readyState >= 2) start();
    else next.addEventListener("canplay", start, { once: true });
  }

  stop(ms = 400) {
    const prev = this.current;
    this.current = null;
    if (!prev) return;
    this.fade(prev, prev.volume, 0, ms, () => {
      prev.pause();
      prev.src = "";
    });
  }

  private crossfade(prev: HTMLAudioElement | null, next: HTMLAudioElement, ms: number) {
    this.fade(next, 0, this.volume, ms);
    if (prev) {
      this.fade(prev, prev.volume, 0, ms, () => {
        prev.pause();
        prev.src = "";
      });
    }
  }

  private fade(
    audio: HTMLAudioElement,
    from: number,
    to: number,
    ms: number,
    onDone?: () => void
  ) {
    if (this.fading) window.clearInterval(this.fading);
    const steps = Math.max(1, Math.floor(ms / 32));
    let i = 0;
    audio.volume = from;
    this.fading = window.setInterval(() => {
      i += 1;
      const t = i / steps;
      audio.volume = from + (to - from) * t;
      if (i >= steps) {
        if (this.fading) window.clearInterval(this.fading);
        this.fading = null;
        audio.volume = to;
        onDone?.();
      }
    }, 32);
  }
}

export const worldBgm = new WorldBgmEngine();
