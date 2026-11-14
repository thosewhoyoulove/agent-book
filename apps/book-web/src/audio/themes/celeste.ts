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

export const celesteAudioTheme: AudioTheme = {
  worldId: "celeste" as GameWorldId,
  ui: sharedUi,
  defaultScene: "winter-day",
  ambientScenes: ["spring-day", "summer-day", "winter-day", "rain", "ocean", "fireplace"],
  sceneLabels: {
    "spring-day": "山脚 · 主场景",
    "summer-day": "山脊 · 强风",
    "winter-day": "冰雪空间 · 寒冷环境",
    rain: "风暴 · 强风环境",
    ocean: "湖面 · 水岸环境",
    fireplace: "营地 · 篝火"
  }
};
