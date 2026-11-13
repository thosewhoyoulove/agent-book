import type { AvailableChapterId, GameWorldId } from "../content/gameWorlds";
import stardewIcon from "../assets/world-icons/stardew.png";
import celesteIcon from "../assets/world-icons/celeste.png";
import hollowIcon from "../assets/world-icons/hollow.png";
import stardewHero from "../assets/world-art/hero-stardew.jpg";
import celesteHero from "../assets/world-art/hero-celeste.jpg";
import hollowHero from "../assets/world-art/hero-hollow.jpg";

const worldIconSrc: Record<GameWorldId, string> = {
  stardew: stardewIcon,
  celeste: celesteIcon,
  hollow: hollowIcon
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
 * Theme collectible marks for sidebar/home slots.
 * SVG silhouettes stay distinct when locked (no black-boxed PNG + grayscale).
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
  const className = `collectible-svg collectible-svg--${worldId}${unlocked ? " is-unlocked" : " is-locked"}`;

  if (worldId === "celeste") {
    return (
      <svg
        key="celeste"
        className={className}
        width={size}
        height={size}
        viewBox="0 0 16 16"
        aria-hidden="true"
      >
        <path
          d="M8 2.2c1.1 1.4 1.8 2.2 2.6 2.2-.4 1.1-1.3 1.7-2.6 1.7S5.8 5.5 5.4 4.4C6.2 4.4 6.9 3.6 8 2.2Z"
          fill="currentColor"
        />
        <path
          d="M8 5.8c2.6 0 4.6 2.1 4.6 4.4 0 2.1-1.8 3.6-4.6 3.6S3.4 12.3 3.4 10.2C3.4 7.9 5.4 5.8 8 5.8Z"
          fill="currentColor"
        />
        <circle cx="9.6" cy="9.2" r="0.7" fill="var(--canvas-elevated)" opacity="0.7" />
        <circle cx="6.8" cy="10.6" r="0.55" fill="var(--canvas-elevated)" opacity="0.55" />
      </svg>
    );
  }

  if (worldId === "hollow") {
    return (
      <svg
        key="hollow"
        className={className}
        width={size}
        height={size}
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M5.1 4.2h5.8v5.4c0 2-1.2 3.4-2.9 3.4S5.1 11.6 5.1 9.6V4.2Z"
          stroke="currentColor"
          strokeWidth="1.35"
        />
        <path d="M6.2 4.1 5.2 1.8M9.8 4.1 10.8 1.8" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" />
        <circle cx="6.8" cy="7.4" r="0.85" fill="currentColor" />
        <circle cx="9.2" cy="7.4" r="0.85" fill="currentColor" />
      </svg>
    );
  }

  return (
    <svg
      key="stardew"
      className={className}
      width={size}
      height={size}
      viewBox="0 0 16 16"
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      <path d="M8 1.8 9.5 5.4h3.8L10.6 7.7l1.1 3.6L8 9.3 4.3 11.3l1.1-3.6L2.7 5.4h3.8L8 1.8Z" fill="currentColor" />
      <rect x="7" y="11.2" width="2" height="2.4" fill="currentColor" />
      <rect x="5.4" y="12.2" width="2" height="1.4" fill="currentColor" opacity="0.85" />
      <rect x="8.6" y="12.2" width="2" height="1.4" fill="currentColor" opacity="0.85" />
    </svg>
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
