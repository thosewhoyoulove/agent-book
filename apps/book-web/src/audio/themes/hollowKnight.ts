import type { GameWorldId } from "../../content/gameWorlds";
import type { AudioTheme } from "./stardew";

const sharedUi = {
  click: "click",
  open: "open",
  close: "close",
  page: "page",
  success: "success",
  collect: "collect",
  switch: "switch",
  theme: "theme"
} as const;

export const hollowKnightAudioTheme: AudioTheme = {
  worldId: "hollow" as GameWorldId,
  ui: sharedUi,
  defaultScene: "spring-night",
  ambientScenes: ["spring-night", "autumn-day", "rain", "ocean", "fireplace"],
  sceneLabels: {
    "spring-night": "德特茅斯 · 小镇风声",
    "autumn-day": "圣巢洞穴 · 空旷回声",
    rain: "泪水之城 · 雨声",
    ocean: "水道 · 潮湿氛围",
    fireplace: "长椅灯火 · 火焰循环"
  }
};
