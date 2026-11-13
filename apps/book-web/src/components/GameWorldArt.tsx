import type { AvailableChapterId, GameWorldId } from "../content/gameWorlds";
import stardewIcon from "../assets/world-icons/stardew.png";
import celesteIcon from "../assets/world-icons/celeste.png";
import hollowIcon from "../assets/world-icons/hollow.png";
import stardewHero from "../assets/world-art/hero-stardew.jpg";
import celesteHero from "../assets/world-art/hero-celeste.jpg";
import hollowHero from "../assets/world-art/hero-hollow.jpg";
import stardewCollectible from "../assets/nav-sprites/stardew/collectible.png";
import celesteCollectible from "../assets/nav-sprites/celeste/collectible.png";
import hollowCollectible from "../assets/nav-sprites/hollow/collectible.png";

const worldIconSrc: Record<GameWorldId, string> = {
  stardew: stardewIcon,
  celeste: celesteIcon,
  hollow: hollowIcon
};

const collectibleSrc: Record<GameWorldId, string> = {
  stardew: stardewCollectible,
  celeste: celesteCollectible,
  hollow: hollowCollectible
};

const worldIconAlt: Record<GameWorldId, string> = {
  stardew: "Stardew Valley",
  celeste: "Celeste",
  hollow: "Hollow Knight"
};

const heroSceneSrc: Record<GameWorldId, string> = {
  stardew: stardewHero,
  celeste: celesteHero,
  hollow: hollowHero
};

const heroSceneAlt: Record<GameWorldId, string> = {
  stardew: "Stardew Valley 官方场景",
  celeste: "Celeste 官方场景",
  hollow: "Hollow Knight 官方场景"
};

/** Official Steam client icons (ConcernedApe / EXOK / Team Cherry). */
export function WorldEmblemIcon({ worldId, size = 18 }: { worldId: GameWorldId; size?: number }) {
  const pixelated = worldId === "stardew" || worldId === "celeste";
  return (
    <img
      className={`world-emblem-icon world-emblem-icon--${worldId}${pixelated ? " is-pixel" : ""}`}
      src={worldIconSrc[worldId]}
      alt={worldIconAlt[worldId]}
      width={size}
      height={size}
      style={{ width: size, height: size }}
      draggable={false}
      decoding="async"
    />
  );
}

/**
 * Theme collectible marks for sidebar/home slots — in-game / official sprites.
 * Transparent PNGs + opacity/grayscale keep locked slots readable (no black boxes).
 */
export function CollectibleSprite({
  worldId,
  unlocked,
  size = 16
}: {
  worldId: GameWorldId;
  unlocked: boolean;
  size?: number;
}) {
  const pixelated = worldId === "stardew" || worldId === "celeste";
  const className = `collectible-sprite collectible-sprite--${worldId}${
    unlocked ? " is-unlocked" : " is-locked"
  }${pixelated ? " is-pixel" : ""}`;

  return (
    <img
      className={className}
      src={collectibleSrc[worldId]}
      alt=""
      width={size}
      height={size}
      style={{ width: size, height: size }}
      draggable={false}
      decoding="async"
      aria-hidden="true"
    />
  );
}

export function HeroWorldScene({
  worldId,
  onSelectChapter
}: {
  worldId: GameWorldId;
  onSelectChapter: (chapterId: AvailableChapterId) => void;
}) {
  const pins =
    worldId === "stardew"
      ? {
          start: { label: "CH.01", title: "农舍开荒", tip: "前往第 01 章：爷爷的农舍木屋" },
          peak: { label: "CH.05 ★", title: "祝尼魔温室", tip: "前往第 05 章：祝尼魔温室核心实验" }
        }
      : worldId === "celeste"
        ? {
            start: { label: "400M · CP01", title: "山脚断桥", tip: "前往第 01 章：海拔 400m 山脚营地" },
            peak: { label: "2200M · CP05", title: "峰顶机关台", tip: "前往第 05 章：海拔 2200m 核心机关" }
          }
        : {
            start: { label: "BENCH · 01", title: "小镇长椅", tip: "前往第 01 章：德特茅斯长椅" },
            peak: { label: "SANCTUM · 05", title: "灵魂圣所", tip: "前往第 05 章：灵魂圣所高塔" }
          };

  return (
    <div className={`hero-diorama hero-diorama--${worldId} hero-diorama--photo`}>
      <button
        type="button"
        className="diorama-pin diorama-pin--start"
        onClick={() => onSelectChapter("chapter-1")}
        title={pins.start.tip}
      >
        <span>{pins.start.label}</span>
        <strong>{pins.start.title}</strong>
      </button>
      <button
        type="button"
        className="diorama-pin diorama-pin--peak"
        onClick={() => onSelectChapter("chapter-5")}
        title={pins.peak.tip}
      >
        <span>{pins.peak.label}</span>
        <strong>{pins.peak.title}</strong>
      </button>

      <img
        className="hero-scene-photo"
        src={heroSceneSrc[worldId]}
        alt={heroSceneAlt[worldId]}
        draggable={false}
        decoding="async"
      />
      <div className="hero-scene-vignette" aria-hidden="true" />
    </div>
  );
}
