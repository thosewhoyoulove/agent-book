import { audioManager } from "./AudioManager";
import { musicAssets } from "./audioConfig";
import type { GameWorldId } from "../content/gameWorlds";

/** 兼容旧调用点的音乐外观；播放、持久化和场景切换均由 AudioManager 负责。 */
class WorldBgmEngine {
  isEnabled() {
    return audioManager.getSettings().musicEnabled;
  }

  hasAnyTrack() {
    return Object.values(musicAssets).some(Boolean);
  }

  hasTrack(worldId: GameWorldId) {
    return Boolean(musicAssets[worldId]);
  }

  subscribe(listener: (enabled: boolean) => void) {
    return audioManager.subscribe(() => listener(this.isEnabled()));
  }

  setEnabled(next: boolean) {
    audioManager.updateSettings({ musicEnabled: next });
  }

  toggle() {
    this.setEnabled(!this.isEnabled());
  }

  setVolume(next: number) {
    audioManager.updateSettings({ musicVolume: next });
  }

  unlock() {
    audioManager.unlock();
  }

  play(worldId: GameWorldId) {
    audioManager.setWorld(worldId);
    audioManager.unlock();
  }

  stop() {
    audioManager.updateSettings({ musicEnabled: false });
  }
}

export const worldBgm = new WorldBgmEngine();
