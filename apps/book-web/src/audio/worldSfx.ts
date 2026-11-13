import { audioManager } from "./AudioManager";
import type { GameWorldId } from "../content/gameWorlds";
import type { UiSoundId } from "./audioTypes";

type SfxKind = "switch" | "collect" | "expand" | "click" | "theme" | "surprise";

const soundMap: Record<SfxKind, UiSoundId> = {
  switch: "switch",
  collect: "collect",
  expand: "open",
  click: "click",
  theme: "theme",
  surprise: "success"
};

/** 兼容旧调用点的 UI 音效外观；实际播放由 AudioManager 统一管理。 */
class WorldSfxEngine {
  isEnabled() {
    return audioManager.getSettings().uiEnabled;
  }

  subscribe(listener: (enabled: boolean) => void) {
    return audioManager.subscribe(() => listener(this.isEnabled()));
  }

  setEnabled(next: boolean) {
    audioManager.updateSettings({ uiEnabled: next });
  }

  toggle() {
    this.setEnabled(!this.isEnabled());
  }

  play(kind: SfxKind, _worldId: GameWorldId = "stardew") {
    audioManager.playUi(soundMap[kind]);
  }
}

export const worldSfx = new WorldSfxEngine();
