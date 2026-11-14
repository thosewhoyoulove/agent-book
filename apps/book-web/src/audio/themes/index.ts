import { celesteAudioTheme } from "./celeste";
import { hollowKnightAudioTheme } from "./hollowKnight";
import { stardewAudioTheme } from "./stardew";

export const audioThemes = {
  stardew: stardewAudioTheme,
  celeste: celesteAudioTheme,
  hollow: hollowKnightAudioTheme
} as const;
