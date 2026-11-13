import type { GameWorldId } from "../../content/gameWorlds";
import type { AudioSceneId, UiSoundId } from "../audioTypes";

export interface AudioTheme {
  worldId: GameWorldId;
  ui: Partial<Record<UiSoundId, UiSoundId>>;
  defaultScene: AudioSceneId;
  ambientScenes: AudioSceneId[];
}

export const stardewAudioTheme: AudioTheme = {
  worldId: "stardew",
  ui: {
    click: "click",
    open: "open",
    close: "close",
    page: "page",
    success: "success",
    collect: "collect",
    switch: "switch",
    theme: "theme"
  },
  defaultScene: "spring-day",
  ambientScenes: ["spring-day", "summer-day", "autumn-day", "winter-day", "spring-night", "rain", "ocean", "fireplace"]
};
