import type { GameWorldId } from "../content/gameWorlds";

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

/** Large part / volume badge — SVG game symbols per world. */
export function PartMarkIcon({
  worldId,
  partIndex = 0,
  size = 26
}: {
  worldId: GameWorldId;
  partIndex?: number;
  size?: number;
}) {
  const variant = partIndex % 3;

  if (worldId === "stardew") {
    return (
      <svg
        className="part-mark part-mark--stardew"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        shapeRendering="crispEdges"
        aria-hidden="true"
      >
        <rect x="1" y="1" width="22" height="22" fill="currentColor" opacity="0.1" />
        <rect x="1" y="1" width="22" height="22" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.4" />
        {variant === 0 && (
          /* Hoe */
          <>
            <rect x="11" y="4" width="2" height="13" fill="currentColor" />
            <rect x="7" y="4" width="10" height="2" fill="currentColor" />
            <rect x="5" y="6" width="4" height="2" fill="currentColor" />
            <rect x="10" y="17" width="4" height="3" fill="currentColor" />
          </>
        )}
        {variant === 1 && (
          /* Sprinkler */
          <>
            <rect x="11" y="8" width="2" height="10" fill="currentColor" />
            <rect x="9" y="16" width="6" height="3" fill="currentColor" />
            <rect x="6" y="7" width="12" height="2" fill="currentColor" />
            <rect x="5" y="5" width="2" height="4" fill="currentColor" />
            <rect x="17" y="5" width="2" height="4" fill="currentColor" />
            <rect x="11" y="4" width="2" height="3" fill="currentColor" />
          </>
        )}
        {variant === 2 && (
          /* Keg */
          <>
            <rect x="7" y="5" width="10" height="14" fill="currentColor" />
            <rect x="9" y="3" width="6" height="2" fill="currentColor" />
            <rect x="9" y="8" width="6" height="2" fill="var(--canvas-elevated)" opacity="0.75" />
            <rect x="9" y="12" width="6" height="2" fill="var(--canvas-elevated)" opacity="0.55" />
            <rect x="6" y="18" width="12" height="2" fill="currentColor" />
          </>
        )}
      </svg>
    );
  }

  if (worldId === "celeste") {
    return (
      <svg className="part-mark part-mark--celeste" width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
        <rect x="1" y="1" width="22" height="22" fill="currentColor" opacity="0.08" />
        <rect x="1" y="1" width="22" height="22" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.4" />
        {variant === 0 && (
          /* Crystal */
          <path d="M12 3.5 17.5 9.5 12 20.5 6.5 9.5Z" fill="currentColor" />
        )}
        {variant === 1 && (
          /* Strawberry / winged berry silhouette */
          <>
            <path d="M12 5c1.2 1.5 2 2.3 2.8 2.3-.5 1.2-1.4 1.8-2.8 1.8S9.7 8.5 9.2 7.3C10 7.3 10.8 6.5 12 5Z" fill="currentColor" />
            <path d="M12 8.8c2.8 0 5 2.2 5 4.6 0 2.2-2 3.8-5 3.8s-5-1.6-5-3.8c0-2.4 2.2-4.6 5-4.6Z" fill="currentColor" />
            <circle cx="13.6" cy="12.2" r="0.7" fill="var(--canvas-elevated)" opacity="0.7" />
          </>
        )}
        {variant === 2 && (
          /* Mountain peak */
          <>
            <path d="M4 18h16L14 7l-3 5-2-3-5 9Z" fill="currentColor" />
            <path d="M14 7 16.5 11.5h-5L14 7Z" fill="var(--canvas-elevated)" opacity="0.55" />
          </>
        )}
      </svg>
    );
  }

  return (
    <svg className="part-mark part-mark--hollow" width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      {variant === 0 && (
        /* Knight mask / nail sheath */
        <>
          <path d="M8 5.2h8v8.4c0 2.9-1.8 5-4 5s-4-2.1-4-5V5.2Z" stroke="currentColor" strokeWidth="1.4" />
          <circle cx="10.2" cy="10.8" r="1" fill="currentColor" />
          <circle cx="13.8" cy="10.8" r="1" fill="currentColor" />
          <path d="M9.2 5 8.2 2.8M14.8 5 15.8 2.8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="square" />
        </>
      )}
      {variant === 1 && (
        /* Soul vessel */
        <>
          <path
            d="M12 4.2c3.8 0 6.4 2.1 6.4 5.2S15.6 15.2 12 18.6C8.4 15.2 5.6 12.5 5.6 9.4S8.2 4.2 12 4.2Z"
            stroke="currentColor"
            strokeWidth="1.4"
          />
          <circle cx="12" cy="10" r="1.6" fill="currentColor" />
        </>
      )}
      {variant === 2 && (
        /* Geo / charm ring */
        <>
          <circle cx="12" cy="12" r="6.2" stroke="currentColor" strokeWidth="1.4" />
          <circle cx="12" cy="12" r="2.2" fill="currentColor" />
          <path d="M12 4.8v2.2M12 17v2.2M4.8 12h2.2M17 12h2.2" stroke="currentColor" strokeWidth="1.2" />
        </>
      )}
    </svg>
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
  const variant = index % 4;

  if (worldId === "stardew") {
    return (
      <svg
        className={`chapter-mark chapter-mark--stardew ${tone}`}
        width={size}
        height={size}
        viewBox="0 0 16 16"
        shapeRendering="crispEdges"
        aria-hidden="true"
      >
        {variant === 0 && (
          /* Seed / sprout */
          <>
            <rect x="7" y="7" width="2" height="6" fill="currentColor" />
            <rect x="5" y="4" width="3" height="3" fill="currentColor" />
            <rect x="8" y="3" width="3" height="3" fill="currentColor" />
            <rect x="4" y="12" width="8" height="2" fill="currentColor" opacity="0.7" />
          </>
        )}
        {variant === 1 && (
          /* Stardrop */
          <path d="M8 1.5 9.2 5.5h4.2L10.2 8l1.3 4L8 9.8 4.5 12l1.3-4L2.6 5.5h4.2L8 1.5Z" fill="currentColor" />
        )}
        {variant === 2 && (
          /* Chest / crate */
          <>
            <rect x="3" y="5" width="10" height="8" fill="currentColor" />
            <rect x="3" y="5" width="10" height="2" fill="currentColor" />
            <rect x="7" y="7" width="2" height="3" fill="var(--canvas-elevated)" opacity="0.75" />
            <rect x="4" y="12" width="8" height="1" fill="var(--canvas-elevated)" opacity="0.35" />
          </>
        )}
        {variant === 3 && (
          /* Fish / hook bait */
          <>
            <rect x="3" y="7" width="8" height="3" fill="currentColor" />
            <rect x="10" y="6" width="3" height="5" fill="currentColor" />
            <rect x="4" y="8" width="2" height="1" fill="var(--canvas-elevated)" opacity="0.8" />
            <rect x="2" y="8" width="1" height="1" fill="currentColor" />
          </>
        )}
      </svg>
    );
  }

  if (worldId === "celeste") {
    return (
      <svg className={`chapter-mark chapter-mark--celeste ${tone}`} width={size} height={size} viewBox="0 0 16 16" aria-hidden="true">
        {variant === 0 && <path d="M8 2 12.2 7.2 8 14 3.8 7.2Z" fill="currentColor" />}
        {variant === 1 && (
          <path
            d="M8 13.2c-2.9-1.8-4.4-3.6-4.4-5.4A2.8 2.8 0 0 1 8 5a2.8 2.8 0 0 1 4.4 2.8c0 1.8-1.5 3.6-4.4 5.4Z"
            fill="currentColor"
          />
        )}
        {variant === 2 && (
          <>
            <path d="M2.5 12.5h11L9.2 5.2 7.2 8.4 5.6 6.2Z" fill="currentColor" />
            <path d="M9.2 5.2 10.8 8.2H7.6Z" fill="var(--canvas-elevated)" opacity="0.5" />
          </>
        )}
        {variant === 3 && (
          /* Dash feather */
          <>
            <path d="M4 11.5 8 3.5l4 8" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinejoin="miter" />
            <path d="M5.5 9h5" stroke="currentColor" strokeWidth="1.3" />
          </>
        )}
      </svg>
    );
  }

  return (
    <svg
      className={`chapter-mark chapter-mark--hollow ${tone}`}
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      {variant === 0 && (
        <>
          <path d="M5.2 3.4h5.6v5.4c0 2-1.2 3.4-2.8 3.4S5.2 10.8 5.2 8.8V3.4Z" stroke="currentColor" strokeWidth="1.3" />
          <circle cx="6.8" cy="7" r="0.7" fill="currentColor" />
          <circle cx="9.2" cy="7" r="0.7" fill="currentColor" />
        </>
      )}
      {variant === 1 && (
        <path
          d="M8 2.6c2.8 0 4.8 1.6 4.8 3.9S10.7 10.8 8 13C5.3 10.8 3.2 8.8 3.2 6.5S5.2 2.6 8 2.6Z"
          stroke="currentColor"
          strokeWidth="1.3"
        />
      )}
      {variant === 2 && (
        <>
          <circle cx="8" cy="8" r="4.2" stroke="currentColor" strokeWidth="1.3" />
          <circle cx="8" cy="8" r="1.4" fill="currentColor" />
        </>
      )}
      {variant === 3 && (
        /* Nail */
        <>
          <path d="M8 2.4v9.2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="square" />
          <path d="M5.5 5.2h5" stroke="currentColor" strokeWidth="1.3" />
          <path d="M6.2 13h3.6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="square" />
        </>
      )}
    </svg>
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
