import type { GameWorldId } from "../../content/gameWorlds";
import type { AudioSceneId, UiSoundId } from "../audioTypes";
import type { AudioTheme } from "./stardew";

const sharedUi: Partial<Record<UiSoundId, UiSoundId>> = {
  click: "click",
  open: "open",
  close: "close",
  page: "page",
  success: "success",
  collect: "collect",
  switch: "switch",
  theme: "theme"
};

export const celesteAudioTheme: AudioTheme = {
  worldId: "celeste" as GameWorldId,
  ui: sharedUi,
  defaultScene: "winter-day",
  ambientScenes: ["winter-day", "rain", "fireplace"]
};

export const hollowKnightAudioTheme: AudioTheme = {
  worldId: "hollow" as GameWorldId,
  ui: sharedUi,
  defaultScene: "spring-night" as AudioSceneId,
  ambientScenes: ["spring-night", "rain", "fireplace", "ocean"]
};
