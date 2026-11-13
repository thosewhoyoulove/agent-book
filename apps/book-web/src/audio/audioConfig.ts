import type { GameWorldId } from "../content/gameWorlds";
import type { AudioSceneId, SceneProfile, UiSoundId } from "./audioTypes";

const sfxAssets = import.meta.glob("../assets/sfx/*.{wav,mp3,ogg}", {
  eager: true,
  import: "default"
}) as Record<string, string>;

const bgmAssets = import.meta.glob("../assets/bgm/*.{wav,mp3,ogg}", {
  eager: true,
  import: "default"
}) as Record<string, string>;

function assetByName(assets: Record<string, string>, name: string): string | null {
  const match = Object.entries(assets).find(([path]) => path.endsWith(`/${name}`));
  return match?.[1] ?? null;
}

export const uiSoundAssets: Record<UiSoundId, string | null> = {
  click: assetByName(sfxAssets, "ui-click.wav"),
  open: assetByName(sfxAssets, "ui-expand.wav"),
  close: assetByName(sfxAssets, "ui-click.wav"),
  page: assetByName(sfxAssets, "ui-expand.wav"),
  success: assetByName(sfxAssets, "stardew-surprise.wav"),
  collect: assetByName(sfxAssets, "stardew-collect.wav"),
  switch: assetByName(sfxAssets, "stardew-switch.wav"),
  theme: assetByName(sfxAssets, "stardew-switch.wav")
};

export const musicAssets: Record<GameWorldId, string | null> = {
  stardew: assetByName(bgmAssets, "stardew.ogg"),
  celeste: assetByName(bgmAssets, "celeste.ogg"),
  hollow: assetByName(bgmAssets, "hollow.ogg")
};

export const localStardewMusicEnabled = import.meta.env.VITE_AGENT_BOOK_LOCAL_MUSIC === "true";

export const localStardewAmbientEnabled = localStardewMusicEnabled;

function localAudioUrl(directory: "stardew-music" | "stardew-audio", fileName: string) {
  if (import.meta.env.DEV) return `/__agent-book-local-audio/${fileName}`;
  return `${import.meta.env.BASE_URL}private-audio/${directory}/${fileName}`;
}

const localStardewMusicByScene: Partial<Record<AudioSceneId, string>> =
  localStardewMusicEnabled
    ? {
        "spring-day": localAudioUrl("stardew-music", "spring1_pink_petals.wav"),
        "summer-day": localAudioUrl("stardew-music", "summer1_orange.wav"),
        "autumn-day": localAudioUrl("stardew-music", "fall1_majestic.wav"),
        "winter-day": localAudioUrl("stardew-music", "winter1_new_snow.wav"),
        "spring-night": localAudioUrl("stardew-music", "title_night.wav"),
        rain: localAudioUrl("stardew-music", "MainTheme.wav"),
        ocean: localAudioUrl("stardew-music", "IslandMusic.wav"),
        fireplace: localAudioUrl("stardew-music", "Saloon1.wav")
      }
    : {};

const localStardewAmbientByScene: Partial<Record<AudioSceneId, string>> =
  localStardewAmbientEnabled
    ? {
        "spring-day": localAudioUrl("stardew-audio", "spring_day_ambient.wav"),
        "spring-night": localAudioUrl("stardew-audio", "spring_night_ambient.wav"),
        rain: localAudioUrl("stardew-audio", "rain.wav"),
        ocean: localAudioUrl("stardew-audio", "ocean.wav"),
        fireplace: localAudioUrl("stardew-audio", "cracklingFire.wav")
      }
    : {};

export function getAmbientAsset(worldId: GameWorldId, scene: AudioSceneId): string | null {
  if (worldId !== "stardew") return null;
  return localStardewAmbientByScene[scene] ?? null;
}

export function getMusicAsset(worldId: GameWorldId, scene: AudioSceneId): string | null {
  if (worldId === "stardew") {
    return localStardewMusicByScene[scene] ?? musicAssets[worldId];
  }
  return musicAssets[worldId];
}

export const sceneProfiles: Record<AudioSceneId, SceneProfile> = {
  "spring-day": { label: "春季 · 晴昼", description: "鸟鸣、轻风与远处的溪流", color: "#6aa84f" },
  "summer-day": { label: "夏季 · 蝉鸣", description: "温暖空气与活跃的夏日虫声", color: "#d99b28" },
  "autumn-day": { label: "秋季 · 林间", description: "干燥树叶、低风与柔和鸟鸣", color: "#bb6b34" },
  "winter-day": { label: "冬季 · 雪原", description: "稀薄风声与清冷空间感", color: "#6e9bb8" },
  "spring-night": { label: "春夜 · 虫鸣", description: "夜虫、低风与远处蛙声", color: "#67528d" },
  rain: { label: "雨天 · 农场", description: "连续雨幕与低沉远雷", color: "#547b9d" },
  ocean: { label: "海边 · 潮汐", description: "规律海浪与开阔风声", color: "#3d8ca3" },
  fireplace: { label: "木屋 · 壁炉", description: "轻微火花与温暖低频", color: "#b96535" }
};

export const defaultSceneByWorld: Record<GameWorldId, AudioSceneId> = {
  stardew: "spring-day",
  celeste: "winter-day",
  hollow: "spring-night"
};

/**
 * 星露谷原版音效只在本地授权资源导入后使用。
 * 这些名称来自 Modding:Audio 的常见 Cue 名称，不能作为已提取资源的证明。
 */
export const localStardewCueMap = {
  smallSelect: "ui-small-select",
  bigSelect: "ui-big-select",
  bigDeSelect: "ui-big-deselect",
  bookRead: "book_read",
  questComplete: "questcomplete",
  achievement: "achievement",
  harvest: "harvest",
  springDayAmbient: "spring_day_ambient",
  springNightAmbient: "spring_night_ambient",
  rain: "rain",
  ocean: "ocean",
  cracklingFire: "cracklingFire"
} as const;
