import type { GameWorldId } from "../content/gameWorlds";

type SfxKind = "switch" | "collect" | "expand" | "click" | "theme" | "surprise";

/**
 * SFX engine is intentionally muted.
 * Harsh sample playback and full-pack decode were blocking theme switches.
 */
class WorldSfxEngine {
  isEnabled() {
    return false;
  }

  subscribe(_listener: (enabled: boolean) => void) {
    return () => undefined;
  }

  setEnabled(_next: boolean) {
    // no-op
  }

  toggle() {
    // no-op
  }

  play(_kind: SfxKind, _worldId: GameWorldId = "stardew") {
    // no-op
  }
}

export const worldSfx = new WorldSfxEngine();
