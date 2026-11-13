import { celesteAudioTheme } from "./celeste";
import { hollowKnightAudioTheme } from "./celeste";
import { stardewAudioTheme } from "./stardew";

export const audioThemes = {
  stardew: stardewAudioTheme,
  celeste: celesteAudioTheme,
  hollow: hollowKnightAudioTheme
} as const;
