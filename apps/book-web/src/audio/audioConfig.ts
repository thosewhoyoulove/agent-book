import type { GameWorldId } from "../content/gameWorlds";
import type { AudioSceneId, SceneProfile, UiSoundId } from "./audioTypes";
import gameAudioFiles from "./gameAudioFiles.json";

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

export const localGameAudioEnabled = import.meta.env.DEV && import.meta.env.VITE_AGENT_BOOK_LOCAL_MUSIC === "true";
export const onlineGameAudioEnabled = import.meta.env.PROD;
export const localStardewMusicEnabled = localGameAudioEnabled;
export const localStardewAmbientEnabled = localGameAudioEnabled;

const audioFiles: Record<GameWorldId, {
  ui: Record<UiSoundId, string>;
  music: Partial<Record<AudioSceneId, string>>;
  ambient: Partial<Record<AudioSceneId, string>>;
}> = gameAudioFiles;

function gameAudioUrl(world: GameWorldId, category: "ui" | "ambient" | "music", fileName: string): string | null {
  if (onlineGameAudioEnabled) {
    const onlineName = fileName.replace(/\.(wav|mp3|ogg)$/i, ".ogg");
    return `${import.meta.env.BASE_URL}online-audio/${world}/${category}/${encodeURIComponent(onlineName)}`;
  }
  if (localGameAudioEnabled) {
    const directory = category === "music"
      ? (world === "stardew" ? "stardew-music" : `${world}/music`)
      : (world === "stardew" ? "stardew-audio" : `${world}/audio`);
    return `/__agent-book-local-audio/${directory}/${encodeURIComponent(fileName)}`;
  }
  return null;
}

export function getUiSoundAsset(worldId: GameWorldId, soundId: UiSoundId): string | null {
  return gameAudioUrl(worldId, "ui", audioFiles[worldId].ui[soundId]) ?? uiSoundAssets[soundId];
}

export function getAmbientAsset(worldId: GameWorldId, scene: AudioSceneId): string | null {
  const fileName = audioFiles[worldId].ambient[scene];
  return fileName ? gameAudioUrl(worldId, "ambient", fileName) : null;
}

export function getMusicAsset(worldId: GameWorldId, scene: AudioSceneId): string | null {
  const fileName = audioFiles[worldId].music[scene];
  return (fileName ? gameAudioUrl(worldId, "music", fileName) : null) ?? musicAssets[worldId];
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
