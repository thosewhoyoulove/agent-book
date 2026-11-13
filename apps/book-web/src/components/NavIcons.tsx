import type { GameWorldId } from "../content/gameWorlds";

import stardewStardrop from "../assets/nav-sprites/stardew/stardrop.png";
import stardewPrismatic from "../assets/nav-sprites/stardew/prismatic-shard.png";
import stardewCandy from "../assets/nav-sprites/stardew/magic-rock-candy.png";

import celesteCrystal from "../assets/nav-sprites/celeste/crystal-heart.png";
import celesteFeather from "../assets/nav-sprites/celeste/feather.png";
import celesteGolden from "../assets/nav-sprites/celeste/golden-berry.png";

import hollowKingsBrand from "../assets/nav-sprites/hollow/kings-brand.png";
import hollowHuntersMark from "../assets/nav-sprites/hollow/hunters-mark.png";
import hollowRoyalScepter from "../assets/nav-sprites/hollow/royal-scepter.png";

/** Part / volume badges — rare / precious themed relics. */
const partSprites: Record<GameWorldId, string[]> = {
  stardew: [stardewStardrop, stardewPrismatic, stardewCandy],
  celeste: [celesteGolden, celesteCrystal, celesteFeather],
  hollow: [hollowKingsBrand, hollowHuntersMark, hollowRoyalScepter]
};

/** Chapter rows cycle the same precious trio the part badges use. */
const chapterSprites: Record<GameWorldId, string[]> = {
  stardew: [stardewStardrop, stardewPrismatic, stardewCandy],
  celeste: [celesteGolden, celesteCrystal, celesteFeather],
  hollow: [hollowKingsBrand, hollowHuntersMark, hollowRoyalScepter]
};

function NavSprite({
  src,
  size,
  className,
  pixelated = true
}: {
  src: string;
  size: number;
  className: string;
  pixelated?: boolean;
}) {
  return (
    <img
      className={`${className}${pixelated ? " is-pixel" : ""}`}
      src={src}
      alt=""
      width={size}
      height={size}
      draggable={false}
      decoding="async"
      aria-hidden="true"
    />
  );
}

/** Theme-aware caret used across the sidebar tree. */
export function ChevronIcon({
  worldId = "stardew",
  open = false,
  size = 12,
  dense = false
}: {
  worldId?: GameWorldId;
  open?: boolean;
  size?: number;
  dense?: boolean;
}) {
  const className = `nav-chevron-icon nav-chevron-icon--${worldId}${open ? " is-open" : ""}${
    dense ? " is-dense" : ""
  }`;

  if (worldId === "hollow") {
    return (
      <svg className={className} width={size} height={size} viewBox="0 0 12 12" fill="none" aria-hidden="true">
        {open ? (
          <path d="M2.5 4.2 L6 8.2 L9.5 4.2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="square" />
        ) : (
          <path d="M4.2 2.5 L8.2 6 L4.2 9.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="square" />
        )}
      </svg>
    );
  }

  if (worldId === "celeste") {
    return (
      <svg className={className} width={size} height={size} viewBox="0 0 12 12" fill="none" aria-hidden="true">
        {open ? (
          <path
            d="M2.2 4.4 L6 8.4 L9.8 4.4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="square"
            strokeLinejoin="miter"
          />
        ) : (
          <path
            d="M4.4 2.2 L8.4 6 L4.4 9.8"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="square"
            strokeLinejoin="miter"
          />
        )}
      </svg>
    );
  }

  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 12 12"
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      {open ? <path d="M2 4h8L6 9z" fill="currentColor" /> : <path d="M4 2v8l5-4z" fill="currentColor" />}
    </svg>
  );
}

export function SectionArrowIcon({
  worldId = "stardew",
  size = 10
}: {
  worldId?: GameWorldId;
  size?: number;
}) {
  if (worldId === "hollow") {
    return (
      <svg className="nav-section-arrow" width={size} height={size} viewBox="0 0 12 12" fill="none" aria-hidden="true">
        <path
          d="M3 6h6M6.5 3.5 9 6 6.5 8.5"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="square"
          strokeLinejoin="miter"
        />
      </svg>
    );
  }
  if (worldId === "celeste") {
    return (
      <svg className="nav-section-arrow" width={size} height={size} viewBox="0 0 12 12" fill="none" aria-hidden="true">
        <path d="M2.5 6.5 6 3l3.5 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="square" strokeLinejoin="miter" />
        <path d="M6 3v7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="square" />
      </svg>
    );
  }
  return (
    <svg
      className="nav-section-arrow"
      width={size}
      height={size}
      viewBox="0 0 12 12"
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      <path d="M3 2v8l6-4z" fill="currentColor" />
    </svg>
  );
}

/** Large part / volume badge — in-game / official sprite sheets. */
export function PartMarkIcon({
  worldId,
  partIndex = 0,
  size = 26
}: {
  worldId: GameWorldId;
  partIndex?: number;
  size?: number;
}) {
  const sprites = partSprites[worldId];
  const src = sprites[partIndex % sprites.length];
  return (
    <NavSprite
      className={`part-mark part-mark--${worldId}`}
      src={src}
      size={size}
      pixelated={worldId !== "hollow"}
    />
  );
}

/** Smaller chapter mark under the part badge. */
export function ChapterMarkIcon({
  worldId,
  index = 0,
  completed = false,
  size = 18
}: {
  worldId: GameWorldId;
  index?: number;
  completed?: boolean;
  size?: number;
}) {
  const tone = completed ? "is-done" : "is-todo";
  const sprites = chapterSprites[worldId];
  const src = sprites[index % sprites.length];
  return (
    <NavSprite
      className={`chapter-mark chapter-mark--${worldId} ${tone}`}
      src={src}
      size={size}
      pixelated={worldId !== "hollow"}
    />
  );
}

export function SfxToggleIcon({ enabled, size = 14 }: { enabled: boolean; size?: number }) {
  if (enabled) {
    return (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M2.5 6.2h2.2L8 3.6v8.8L4.7 9.8H2.5V6.2Z" fill="currentColor" />
        <path d="M10.2 5.4c.8.7.8 2.5 0 3.2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="square" />
        <path d="M11.8 3.8c1.7 1.4 1.7 5 0 6.4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="square" />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M2.5 6.2h2.2L8 3.6v8.8L4.7 9.8H2.5V6.2Z" fill="currentColor" />
      <path d="M10.2 5.2 13.4 10M13.4 5.2 10.2 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
    </svg>
  );
}

export function BgmToggleIcon({ enabled, size = 14 }: { enabled: boolean; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M6.2 12.4a1.8 1.8 0 1 1-1.8-1.8"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="square"
      />
      <path
        d="M6.2 10.6V3.4l6.2-1.2v7.4"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
      <path d="M12.4 11.4a1.8 1.8 0 1 1-1.8-1.8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="square" />
      {!enabled ? (
        <path d="M2.2 3.2 13.8 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
      ) : null}
    </svg>
  );
}
