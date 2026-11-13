import type { GameWorldId } from "../content/gameWorlds";

/**
 * Sidebar visual system tokens.
 * Runtime values live as CSS custom properties on :root[data-world],
 * so shared markup can stay theme-agnostic.
 */
export type SidebarThemeTokens = {
  colors: {
    background: string;
    panel: string;
    text: string;
    textMuted: string;
    accent: string;
    accentSoft: string;
    border: string;
    activeBackground: string;
  };
  typography: {
    headingWeight: number;
    bodyWeight: number;
    letterSpacing: string;
  };
  radius: {
    card: string;
    item: string;
  };
  effects: {
    shadow: string;
    glow: string;
    texture: string;
  };
};

/** Documented token map — mirrors CSS vars in styles.css. */
export const sidebarThemeTokens: Record<GameWorldId, SidebarThemeTokens> = {
  stardew: {
    colors: {
      background: "warm wood charcoal",
      panel: "dark timber notice board",
      text: "cream",
      textMuted: "dusty wheat",
      accent: "pumpkin orange",
      accentSoft: "faded harvest wash",
      border: "worn plank edge",
      activeBackground: "ember wash"
    },
    typography: {
      headingWeight: 800,
      bodyWeight: 600,
      letterSpacing: "0.04em"
    },
    radius: {
      card: "2px",
      item: "0px"
    },
    effects: {
      shadow: "hard pixel offset",
      glow: "none",
      texture: "soft plank + pixel grid"
    }
  },
  celeste: {
    colors: {
      background: "midnight navy",
      panel: "blue-black climb log",
      text: "ice white",
      textMuted: "steel blue",
      accent: "coral pink",
      accentSoft: "rose mist",
      border: "icy slate",
      activeBackground: "aurora wash"
    },
    typography: {
      headingWeight: 700,
      bodyWeight: 500,
      letterSpacing: "0.08em"
    },
    radius: {
      card: "10px",
      item: "8px"
    },
    effects: {
      shadow: "soft altitude lift",
      glow: "pink / cyan rim",
      texture: "stars + distant ridge"
    }
  },
  hollow: {
    colors: {
      background: "near-black cavern",
      panel: "relic plaque",
      text: "ash white",
      textMuted: "fog blue",
      accent: "pale soul cyan",
      accentSoft: "soul bloom",
      border: "cold silver hairline",
      activeBackground: "void bloom"
    },
    typography: {
      headingWeight: 600,
      bodyWeight: 500,
      letterSpacing: "0.14em"
    },
    radius: {
      card: "0px",
      item: "0px"
    },
    effects: {
      shadow: "deep sink",
      glow: "soul cyan halo",
      texture: "mist + faint ruin lines"
    }
  }
};
