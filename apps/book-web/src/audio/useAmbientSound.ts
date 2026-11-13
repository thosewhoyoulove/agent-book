import { useEffect } from "react";
import { audioManager } from "./AudioManager";
import type { AudioSceneId } from "./audioTypes";

export function useAmbientSound(scene: AudioSceneId) {
  useEffect(() => {
    audioManager.setScene(scene);
  }, [scene]);

  return {
    setScene: (nextScene: AudioSceneId) => audioManager.setScene(nextScene)
  };
}
