import type { GameWorldId } from "../content/gameWorlds";

export type AudioCategory = "ui" | "ambient" | "music";
export type UiSoundId = "click" | "open" | "close" | "page" | "success" | "collect" | "switch" | "theme";
export type AudioSceneId =
  | "spring-day"
  | "summer-day"
  | "autumn-day"
  | "winter-day"
  | "spring-night"
  | "rain"
  | "ocean"
  | "fireplace";

export interface AudioSettings {
  masterVolume: number;
  uiEnabled: boolean;
  uiVolume: number;
  ambientEnabled: boolean;
  ambientVolume: number;
  musicEnabled: boolean;
  musicVolume: number;
  muted: boolean;
  scene: AudioSceneId;
}

export interface AudioSnapshot {
  settings: AudioSettings;
  worldId: GameWorldId;
  ambientAvailable: boolean;
  musicAvailable: boolean;
}

export interface SceneProfile {
  label: string;
  description: string;
  color: string;
}
