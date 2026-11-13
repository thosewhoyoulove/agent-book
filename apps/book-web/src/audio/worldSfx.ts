import type { GameWorldId } from "../content/gameWorlds";
import stardewSwitch from "../assets/sfx/stardew-switch.wav";
import stardewCollect from "../assets/sfx/stardew-collect.wav";
import stardewSurprise from "../assets/sfx/stardew-surprise.wav";
import celesteSwitch from "../assets/sfx/celeste-switch.wav";
import celesteCollect from "../assets/sfx/celeste-collect.wav";
import celesteSurprise from "../assets/sfx/celeste-surprise.wav";
import hollowSwitch from "../assets/sfx/hollow-switch.wav";
import hollowCollect from "../assets/sfx/hollow-collect.wav";
import hollowSurprise from "../assets/sfx/hollow-surprise.wav";
import uiClick from "../assets/sfx/ui-click.wav";
import uiExpand from "../assets/sfx/ui-expand.wav";

const sfxStorageKey = "agent-book-sfx-enabled";

type SfxKind = "switch" | "collect" | "expand" | "click" | "theme" | "surprise";

const sampleUrl: Record<string, string> = {
  "stardew:switch": stardewSwitch,
  "stardew:collect": stardewCollect,
  "stardew:surprise": stardewSurprise,
  "celeste:switch": celesteSwitch,
  "celeste:collect": celesteCollect,
  "celeste:surprise": celesteSurprise,
  "hollow:switch": hollowSwitch,
  "hollow:collect": hollowCollect,
  "hollow:surprise": hollowSurprise,
  "ui:click": uiClick,
  "ui:expand": uiExpand,
  "ui:theme": uiClick
};

function loadEnabled(): boolean {
  if (typeof window === "undefined") return true;
  const saved = window.localStorage.getItem(sfxStorageKey);
  if (saved === null) return true;
  return saved === "1";
}

/**
 * Theme-colored adventure SFX.
 * Samples are original procedural patches inspired by each world's feel
 * (cozy harp / chiptune dash / soul echo) — not ripped from the games.
 */
class WorldSfxEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private buffers = new Map<string, AudioBuffer>();
  private loading: Promise<void> | null = null;
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
    const AudioCtx =
      window.AudioContext ||
      (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return null;
    if (!this.ctx) {
      this.ctx = new AudioCtx();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.55;
      this.master.connect(this.ctx.destination);
    }
    if (this.ctx.state === "suspended") void this.ctx.resume();
    return this.ctx;
  }

  private async preload() {
    const ctx = this.ensure();
    if (!ctx || this.loading) return this.loading;
    this.loading = (async () => {
      await Promise.all(
        Object.entries(sampleUrl).map(async ([key, url]) => {
          if (this.buffers.has(key)) return;
          const res = await fetch(url);
          const raw = await res.arrayBuffer();
          const buffer = await ctx.decodeAudioData(raw.slice(0));
          this.buffers.set(key, buffer);
        })
      );
    })();
    return this.loading;
  }

  private resolveKey(kind: SfxKind, worldId: GameWorldId) {
    if (kind === "click" || kind === "expand" || kind === "theme") return `ui:${kind === "theme" ? "theme" : kind}`;
    return `${worldId}:${kind === "surprise" ? "surprise" : kind}`;
  }

  play(kind: SfxKind, worldId: GameWorldId = "stardew") {
    if (!this.enabled) return;
    const ctx = this.ensure();
    if (!ctx || !this.master) return;
    const key = this.resolveKey(kind, worldId);

    const fire = (buffer: AudioBuffer) => {
      const src = ctx.createBufferSource();
      src.buffer = buffer;
      const g = ctx.createGain();
      g.gain.value = kind === "surprise" ? 0.9 : kind === "collect" ? 0.8 : 0.7;
      src.connect(g);
      g.connect(this.master!);
      src.start(0);
    };

    const cached = this.buffers.get(key);
    if (cached) {
      fire(cached);
      return;
    }

    void this.preload()?.then(() => {
      const buffer = this.buffers.get(key);
      if (buffer && this.enabled) fire(buffer);
    });
  }
}

export const worldSfx = new WorldSfxEngine();
