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
          <path d="M2.5 4.2 L6 8.2 L9.5 4.2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        ) : (
          <path d="M4.2 2.5 L8.2 6 L4.2 9.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        )}
      </svg>
    );
  }

  if (worldId === "celeste") {
    return (
      <svg className={className} width={size} height={size} viewBox="0 0 12 12" fill="none" aria-hidden="true">
        {open ? (
          <path d="M2.2 4.4 L6 8.4 L9.8 4.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        ) : (
          <path d="M4.4 2.2 L8.4 6 L4.4 9.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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
        <path d="M3 6h6M6.5 3.5 9 6 6.5 8.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (worldId === "celeste") {
    return (
      <svg className="nav-section-arrow" width={size} height={size} viewBox="0 0 12 12" fill="none" aria-hidden="true">
        <path d="M2.5 6.5 6 3l3.5 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6 3v7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
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

/** Large part / volume badge — intentionally bigger than chapter marks. */
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
        <rect x="1" y="1" width="22" height="22" fill="currentColor" opacity="0.12" />
        <rect x="1" y="1" width="22" height="22" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.45" />
        {variant === 0 && (
          <>
            <rect x="10" y="5" width="4" height="10" fill="currentColor" />
            <rect x="6" y="11" width="12" height="4" fill="currentColor" />
            <rect x="9" y="16" width="6" height="3" fill="currentColor" />
          </>
        )}
        {variant === 1 && (
          <>
            <rect x="11" y="4" width="2" height="12" fill="currentColor" />
            <path d="M5 10h14l-3 5H8L5 10Z" fill="currentColor" />
            <rect x="10" y="17" width="4" height="3" fill="currentColor" />
          </>
        )}
        {variant === 2 && (
          <>
            <rect x="5" y="7" width="14" height="10" fill="currentColor" />
            <rect x="7" y="9" width="4" height="3" fill="#fff8e8" opacity="0.85" />
            <rect x="13" y="9" width="4" height="3" fill="#fff8e8" opacity="0.85" />
            <rect x="8" y="14" width="8" height="2" fill="#fff8e8" opacity="0.7" />
          </>
        )}
      </svg>
    );
  }

  if (worldId === "celeste") {
    return (
      <svg className="part-mark part-mark--celeste" width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
        <rect x="1.5" y="1.5" width="21" height="21" rx="6" fill="currentColor" opacity="0.1" />
        <rect x="1.5" y="1.5" width="21" height="21" rx="6" stroke="currentColor" strokeWidth="1.4" fill="none" opacity="0.35" />
        {variant === 0 && <path d="M12 3.8 18.2 12 12 20.2 5.8 12 12 3.8Z" fill="currentColor" />}
        {variant === 1 && (
          <path d="M12 19.4c-4-2.5-6.1-5-6.1-7.6A3.7 3.7 0 0 1 12 8.2a3.7 3.7 0 0 1 6.1 3.6c0 2.6-2.1 5.1-6.1 7.6Z" fill="currentColor" />
        )}
        {variant === 2 && (
          <>
            <path
              d="M7 15c1.8-3.2 3.4-5.6 5-8.4 1.6 2.8 3.2 5.2 5 8.4"
              stroke="currentColor"
              strokeWidth="1.6"
              fill="none"
              strokeLinecap="round"
            />
            <circle cx="12" cy="16.5" r="1.6" fill="currentColor" />
          </>
        )}
      </svg>
    );
  }

  return (
    <svg className="part-mark part-mark--hollow" width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" stroke="currentColor" strokeWidth="1" opacity="0.28" />
      {variant === 0 && (
        <>
          <path d="M8 5.5h8v8.2c0 2.8-1.8 4.8-4 4.8s-4-2-4-4.8V5.5Z" stroke="currentColor" strokeWidth="1.4" />
          <circle cx="10.2" cy="11" r="1" fill="currentColor" />
          <circle cx="13.8" cy="11" r="1" fill="currentColor" />
        </>
      )}
      {variant === 1 && (
        <path d="M12 4.4c3.6 0 6.2 2 6.2 5S15.4 15 12 18.2C8.6 15 5.8 12.4 5.8 9.4s2.6-5 6.2-5Z" stroke="currentColor" strokeWidth="1.4" />
      )}
      {variant === 2 && (
        <>
          <circle cx="12" cy="12" r="5.8" stroke="currentColor" strokeWidth="1.4" />
          <circle cx="12" cy="12" r="2" fill="currentColor" />
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
  const variant = index % 3;

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
        <rect x="1" y="1" width="14" height="14" fill="currentColor" opacity="0.1" />
        {variant === 0 && (
          <>
            <rect x="7" y="3" width="2" height="8" fill="currentColor" />
            <rect x="4" y="7" width="8" height="2" fill="currentColor" />
            <rect x="6" y="11" width="4" height="2" fill="currentColor" />
          </>
        )}
        {variant === 1 && <path d="M8 2.5 9.4 6.2h3.8L10.4 8.5l1.1 3.5L8 10.2 4.5 12l1.1-3.5L3 6.2h3.8L8 2.5Z" fill="currentColor" />}
        {variant === 2 && (
          <>
            <rect x="4" y="5" width="8" height="6" fill="currentColor" />
            <rect x="5" y="6" width="2" height="2" fill="#fff8e8" opacity="0.85" />
            <rect x="9" y="6" width="2" height="2" fill="#fff8e8" opacity="0.85" />
          </>
        )}
      </svg>
    );
  }

  if (worldId === "celeste") {
    return (
      <svg
        className={`chapter-mark chapter-mark--celeste ${tone}`}
        width={size}
        height={size}
        viewBox="0 0 16 16"
        aria-hidden="true"
      >
        <rect x="1" y="1" width="14" height="14" rx="4" fill="currentColor" opacity="0.08" />
        {variant === 0 && <path d="M8 2.6 12.4 8 8 13.4 3.6 8 8 2.6Z" fill="currentColor" />}
        {variant === 1 && (
          <path
            d="M8 13c-2.8-1.8-4.3-3.5-4.3-5.3A2.7 2.7 0 0 1 8 5.2a2.7 2.7 0 0 1 4.3 2.5C12.3 9.5 10.8 11.2 8 13Z"
            fill="currentColor"
          />
        )}
        {variant === 2 && (
          <>
            <path d="M5 10c1.2-2.2 2.3-3.8 3-5.6.7 1.8 1.8 3.4 3 5.6" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" />
            <circle cx="8" cy="11.2" r="1.2" fill="currentColor" />
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
          <path d="M5.2 3.6h5.6v5.2c0 1.9-1.2 3.3-2.8 3.3S5.2 10.7 5.2 8.8V3.6Z" stroke="currentColor" strokeWidth="1.3" />
          <circle cx="6.8" cy="7" r="0.7" fill="currentColor" />
          <circle cx="9.2" cy="7" r="0.7" fill="currentColor" />
        </>
      )}
      {variant === 1 && (
        <path d="M8 2.8c2.7 0 4.7 1.5 4.7 3.8S10.6 10.7 8 12.8C5.4 10.7 3.3 8.9 3.3 6.6S5.3 2.8 8 2.8Z" stroke="currentColor" strokeWidth="1.3" />
      )}
      {variant === 2 && (
        <>
          <circle cx="8" cy="8" r="4.1" stroke="currentColor" strokeWidth="1.3" />
          <circle cx="8" cy="8" r="1.3" fill="currentColor" />
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
        <path d="M10.2 5.4c.8.7.8 2.5 0 3.2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M11.8 3.8c1.7 1.4 1.7 5 0 6.4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M2.5 6.2h2.2L8 3.6v8.8L4.7 9.8H2.5V6.2Z" fill="currentColor" />
      <path d="M10.2 5.2 13.4 10M13.4 5.2 10.2 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
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
        strokeLinecap="round"
      />
      <path d="M6.2 10.6V3.4l6.2-1.2v7.4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12.4 11.4a1.8 1.8 0 1 1-1.8-1.8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      {!enabled ? (
        <path d="M2.2 3.2 13.8 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      ) : null}
    </svg>
  );
}
