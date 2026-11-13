import { useSyncExternalStore } from "react";
import { audioManager } from "./AudioManager";
import { type AudioSettings, type UiSoundId } from "./audioTypes";

export function useAudio() {
  const snapshot = useSyncExternalStore(audioManager.subscribe, audioManager.getSnapshot, audioManager.getSnapshot);

  return {
    ...snapshot,
    settings: snapshot.settings,
    updateSettings: (patch: Partial<AudioSettings>) => audioManager.updateSettings(patch),
    resetSettings: () => audioManager.resetSettings(),
    playUi: (soundId: UiSoundId) => audioManager.playUi(soundId),
    setScene: (scene: Parameters<typeof audioManager.setScene>[0]) => audioManager.setScene(scene),
    setWorld: (worldId: Parameters<typeof audioManager.setWorld>[0]) => audioManager.setWorld(worldId),
    unlock: () => audioManager.unlock()
  };
}
