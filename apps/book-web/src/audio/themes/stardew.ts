import type { GameWorldId } from "../../content/gameWorlds";
import type { AudioSceneId, UiSoundId } from "../audioTypes";

export interface AudioTheme {
  worldId: GameWorldId;
  ui: Partial<Record<UiSoundId, UiSoundId>>;
  defaultScene: AudioSceneId;
  ambientScenes: AudioSceneId[];
  sceneLabels: Partial<Record<AudioSceneId, string>>;
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
  ambientScenes: ["spring-day", "summer-day", "autumn-day", "winter-day", "spring-night", "rain", "ocean", "fireplace"],
  sceneLabels: {
    "spring-day": "春日农场 · 鸟鸣",
    "summer-day": "夏日农场 · 蝉鸣",
    "autumn-day": "秋日林地 · 低风",
    "winter-day": "冬日雪原 · 寒风",
    "spring-night": "春夜农场 · 虫鸣",
    rain: "雨天农场 · 雨声",
    ocean: "海边 · 海浪",
    fireplace: "木屋 · 壁炉"
  }
};
