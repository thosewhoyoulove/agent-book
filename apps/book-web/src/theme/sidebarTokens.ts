import type { GameWorldId } from "../content/gameWorlds";

/**
 * Sidebar visual system tokens.
 * Runtime values live as CSS custom properties on :root[data-world],
 * so shared markup can stay theme-agnostic.
 *
 * Pixel UI contract: hard edges (0 radius), offset shadows (no blur),
 * theme distinction via color / texture / clip-path — not soft glow SaaS chrome.
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
      card: "0px",
      item: "0px"
    },
    effects: {
      shadow: "hard pixel offset",
      glow: "none",
      texture: "plank grain + pixel grid"
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
      card: "0px",
      item: "0px"
    },
    effects: {
      shadow: "hard cyan/pink offset",
      glow: "none",
      texture: "stars + ridge silhouette"
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
      shadow: "deep hard sink",
      glow: "none",
      texture: "mist grid + ruin lines"
    }
  }
};
