import type { GameWorldId } from "../content/gameWorlds";

const sfxStorageKey = "agent-book-sfx-enabled";

type SfxKind = "switch" | "collect" | "expand" | "click" | "theme" | "surprise";

function loadEnabled(): boolean {
  if (typeof window === "undefined") return true;
  const saved = window.localStorage.getItem(sfxStorageKey);
  if (saved === null) return true;
  return saved === "1";
}

function clamp(n: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, n));
}

/** Lightweight procedural SFX — no binary samples, theme-colored by world. */
class WorldSfxEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private enabled = loadEnabled();
  private listeners = new Set<(enabled: boolean) => void>();

  isEnabled() {
    return this.enabled;
  }

  subscribe(listener: (enabled: boolean) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  setEnabled(next: boolean) {
    this.enabled = next;
    if (typeof window !== "undefined") {
      window.localStorage.setItem(sfxStorageKey, next ? "1" : "0");
    }
    this.listeners.forEach((listener) => listener(next));
    if (next) this.play("click");
  }

  toggle() {
    this.setEnabled(!this.enabled);
  }

  private ensure() {
    if (typeof window === "undefined") return null;
    const AudioCtx = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return null;
    if (!this.ctx) {
      this.ctx = new AudioCtx();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.22;
      this.master.connect(this.ctx.destination);
    }
    if (this.ctx.state === "suspended") {
      void this.ctx.resume();
    }
    return this.ctx;
  }

  private tone(
    freq: number,
    start: number,
    dur: number,
    type: OscillatorType,
    gain = 0.18,
    slideTo?: number
  ) {
    const ctx = this.ensure();
    if (!ctx || !this.master) return;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, start);
    if (slideTo != null) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(40, slideTo), start + dur);
    }
    g.gain.setValueAtTime(0.0001, start);
    g.gain.exponentialRampToValueAtTime(clamp(gain), start + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
    osc.connect(g);
    g.connect(this.master);
    osc.start(start);
    osc.stop(start + dur + 0.02);
  }

  private noiseBurst(start: number, dur: number, gain = 0.05, band = 1200) {
    const ctx = this.ensure();
    if (!ctx || !this.master) return;
    const frames = Math.max(1, Math.floor(ctx.sampleRate * dur));
    const buffer = ctx.createBuffer(1, frames, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < frames; i += 1) data[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = band;
    filter.Q.value = 0.8;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, start);
    g.gain.exponentialRampToValueAtTime(clamp(gain), start + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
    src.connect(filter);
    filter.connect(g);
    g.connect(this.master);
    src.start(start);
    src.stop(start + dur + 0.02);
  }

  play(kind: SfxKind, worldId: GameWorldId = "stardew") {
    if (!this.enabled) return;
    const ctx = this.ensure();
    if (!ctx) return;
    const t0 = ctx.currentTime + 0.01;

    if (kind === "click" || kind === "expand") {
      this.tone(kind === "expand" ? 520 : 660, t0, 0.07, "triangle", 0.08);
      this.tone(kind === "expand" ? 780 : 990, t0 + 0.03, 0.06, "sine", 0.05);
      return;
    }

    if (kind === "theme") {
      this.tone(440, t0, 0.08, "sine", 0.07);
      this.tone(330, t0 + 0.05, 0.1, "triangle", 0.06);
      return;
    }

    if (kind === "surprise") {
      [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => {
        this.tone(f, t0 + i * 0.07, 0.16, "sine", 0.1 - i * 0.015);
      });
      this.noiseBurst(t0 + 0.22, 0.12, 0.04, 2400);
      return;
    }

    if (kind === "switch") {
      if (worldId === "stardew") {
        // soft farm harp
        [392, 493.88, 587.33].forEach((f, i) => this.tone(f, t0 + i * 0.08, 0.22, "triangle", 0.12));
        this.tone(784, t0 + 0.28, 0.18, "sine", 0.07);
      } else if (worldId === "celeste") {
        // crystal dash shimmer
        this.noiseBurst(t0, 0.08, 0.05, 2800);
        this.tone(880, t0, 0.12, "square", 0.05, 1320);
        this.tone(1174.7, t0 + 0.08, 0.16, "sine", 0.09);
        this.tone(1568, t0 + 0.16, 0.14, "triangle", 0.06);
      } else {
        // hollow soul echo
        this.tone(196, t0, 0.28, "sine", 0.1);
        this.tone(293.66, t0 + 0.06, 0.32, "triangle", 0.08);
        this.tone(440, t0 + 0.18, 0.36, "sine", 0.06, 220);
        this.noiseBurst(t0 + 0.1, 0.2, 0.025, 700);
      }
      return;
    }

    // collect chapter
    if (worldId === "stardew") {
      [523.25, 659.25, 783.99, 987.77].forEach((f, i) => {
        this.tone(f, t0 + i * 0.09, 0.24, "triangle", 0.12);
      });
      this.tone(1174.7, t0 + 0.4, 0.3, "sine", 0.08);
    } else if (worldId === "celeste") {
      this.noiseBurst(t0, 0.1, 0.06, 3200);
      [1046.5, 1318.5, 1568, 2093].forEach((f, i) => {
        this.tone(f, t0 + 0.05 + i * 0.06, 0.14, "square", 0.045);
      });
      this.tone(2489, t0 + 0.32, 0.22, "sine", 0.07);
    } else {
      [220, 277.18, 329.63, 440, 554.37].forEach((f, i) => {
        this.tone(f, t0 + i * 0.1, 0.34, "sine", 0.09);
      });
      this.noiseBurst(t0 + 0.35, 0.25, 0.03, 900);
    }
  }
}

export const worldSfx = new WorldSfxEngine();
