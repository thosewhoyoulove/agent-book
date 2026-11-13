import type { GameWorldId } from "../content/gameWorlds";

import stardewTea from "../assets/nav-sprites/stardew/stardrop-tea.png";
import stardewPrismatic from "../assets/nav-sprites/stardew/prismatic-shard.png";
import stardewCandy from "../assets/nav-sprites/stardew/magic-rock-candy.png";
import stardewParsnip from "../assets/nav-sprites/stardew/parsnip.png";
import stardewChest from "../assets/nav-sprites/stardew/chest.png";
import stardewFish from "../assets/nav-sprites/stardew/fish.png";
import stardewCan from "../assets/nav-sprites/stardew/watering-can.png";
import stardewHoe from "../assets/nav-sprites/stardew/hoe.png";
import stardewKeg from "../assets/nav-sprites/stardew/keg.png";
import stardewDinoEgg from "../assets/nav-sprites/stardew/dinosaur-egg.png";

import celesteCrystal from "../assets/nav-sprites/celeste/crystal-heart.png";
import celesteFeather from "../assets/nav-sprites/celeste/feather.png";
import celesteGolden from "../assets/nav-sprites/celeste/golden-berry.png";
import celesteGateway from "../assets/nav-sprites/celeste/gateway.png";
import celesteMachines from "../assets/nav-sprites/celeste/machines.png";
import celesteMirror from "../assets/nav-sprites/celeste/mirror-magic.png";
import celesteOneUp from "../assets/nav-sprites/celeste/one-up.png";
import celesteArchaeology from "../assets/nav-sprites/celeste/archaeology.png";
import celesteSkyline from "../assets/nav-sprites/celeste/skyline.png";
import celesteWow from "../assets/nav-sprites/celeste/wow.png";

import hollowKingsBrand from "../assets/nav-sprites/hollow/kings-brand.png";
import hollowHuntersMark from "../assets/nav-sprites/hollow/hunters-mark.png";
import hollowRoyalScepter from "../assets/nav-sprites/hollow/royal-scepter.png";
import hollowCartographer from "../assets/nav-sprites/hollow/cartographer.png";
import hollowGrubfriend from "../assets/nav-sprites/hollow/grubfriend.png";
import hollowPassingAge from "../assets/nav-sprites/hollow/passing-age.png";
import hollowFalsehood from "../assets/nav-sprites/hollow/falsehood.png";
import hollowRitual from "../assets/nav-sprites/hollow/ritual.png";
import hollowPerformance from "../assets/nav-sprites/hollow/grand-performance.png";
import hollowCouple from "../assets/nav-sprites/hollow/happy-couple.png";

/** First-level volume badges only. Stardrop stays on the right-side loot mark. */
const partSprites: Record<GameWorldId, string[]> = {
  stardew: [stardewTea, stardewPrismatic, stardewCandy],
  celeste: [celesteGolden, celesteCrystal, celesteFeather],
  hollow: [hollowKingsBrand, hollowHuntersMark, hollowRoyalScepter]
};

/** One distinct sprite per chapter row. Seven chapters, no cycling. */
const chapterSprites: Record<GameWorldId, string[]> = {
  stardew: [stardewParsnip, stardewChest, stardewFish, stardewCan, stardewHoe, stardewKeg, stardewDinoEgg],
  celeste: [
    celesteGateway,
    celesteMachines,
    celesteMirror,
    celesteOneUp,
    celesteArchaeology,
    celesteSkyline,
    celesteWow
  ],
  hollow: [
    hollowCartographer,
    hollowGrubfriend,
    hollowPassingAge,
    hollowFalsehood,
    hollowRitual,
    hollowPerformance,
    hollowCouple
  ]
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
