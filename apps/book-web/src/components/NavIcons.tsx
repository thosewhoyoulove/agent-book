import type { GameWorldId } from "../content/gameWorlds";

/** Pixel-style filled caret used across the sidebar tree. */
export function ChevronIcon({
  open = false,
  size = 12,
  dense = false
}: {
  open?: boolean;
  size?: number;
  dense?: boolean;
}) {
  return (
    <svg
      className={`nav-chevron-icon${open ? " is-open" : ""}${dense ? " is-dense" : ""}`}
      width={size}
      height={size}
      viewBox="0 0 12 12"
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      {/* Closed: points right ▶ ; Open: points down ▼ */}
      {open ? (
        <path d="M2 4h8L6 9z" fill="currentColor" />
      ) : (
        <path d="M4 2v8l5-4z" fill="currentColor" />
      )}
    </svg>
  );
}

export function SectionArrowIcon({ size = 10 }: { size?: number }) {
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
      <svg className="part-mark part-mark--stardew" width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
        <rect x="1" y="1" width="22" height="22" rx="3" fill="currentColor" opacity="0.12" />
        <rect x="1" y="1" width="22" height="22" rx="3" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.35" />
        {variant === 0 && (
          <>
            <path d="M12 4c3 2.4 4.4 5 4.4 8S14.8 19 12 19 7.6 15 7.6 12 9 6.4 12 4Z" fill="currentColor" />
            <path d="M12 9v8" stroke="#fff8e8" strokeWidth="1.6" strokeLinecap="round" />
          </>
        )}
        {variant === 1 && (
          <path d="M12 4.2 14 9.6h5.4L15.2 13l1.7 5.2L12 15.4 7.1 18.2 8.8 13 4.6 9.6H10L12 4.2Z" fill="currentColor" />
        )}
        {variant === 2 && (
          <>
            <rect x="10.6" y="4.2" width="2.8" height="12.4" rx="1" fill="currentColor" />
            <path d="M6.2 11h11.6l-2.2 4.2H8.4L6.2 11Z" fill="currentColor" />
            <circle cx="12" cy="18.4" r="1.8" fill="currentColor" />
          </>
        )}
      </svg>
    );
  }

  if (worldId === "celeste") {
    return (
      <svg className="part-mark part-mark--celeste" width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
        <rect x="1" y="1" width="22" height="22" rx="3" fill="currentColor" opacity="0.12" />
        <rect x="1" y="1" width="22" height="22" rx="3" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.35" />
        {variant === 0 && <path d="M12 3.6 18.4 12 12 20.4 5.6 12 12 3.6Z" fill="currentColor" />}
        {variant === 1 && (
          <path d="M12 19.6c-4-2.6-6.2-5.1-6.2-7.8A3.8 3.8 0 0 1 12 8a3.8 3.8 0 0 1 6.2 3.8c0 2.7-2.2 5.2-6.2 7.8Z" fill="currentColor" />
        )}
        {variant === 2 && (
          <>
            <path d="M12 4 14.2 9.2 20 9.8 15.6 13.4l1.3 5.4L12 16.2 7.1 18.8l1.3-5.4L4 9.8l5.8-.6L12 4Z" fill="currentColor" />
            <circle cx="12" cy="12" r="2" fill="#fff8f4" opacity="0.9" />
          </>
        )}
      </svg>
    );
  }

  return (
    <svg className="part-mark part-mark--hollow" width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <rect x="1" y="1" width="22" height="22" rx="3" fill="currentColor" opacity="0.12" />
      <rect x="1" y="1" width="22" height="22" rx="3" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.35" />
      {variant === 0 && (
        <>
          <path d="M7.4 5.4h9.2v8c0 3-1.9 5.2-4.6 5.2S7.4 16.4 7.4 13.4v-8Z" fill="currentColor" />
          <circle cx="10" cy="11" r="1.3" fill="#0b0d12" />
          <circle cx="14" cy="11" r="1.3" fill="#0b0d12" />
        </>
      )}
      {variant === 1 && (
        <path d="M12 4c4 0 7 2.2 7 5.6S15.8 16 12 19.4C8.2 16 5 13 5 9.6S8 4 12 4Z" fill="currentColor" />
      )}
      {variant === 2 && (
        <>
          <circle cx="12" cy="12" r="6.4" stroke="currentColor" strokeWidth="2" fill="none" />
          <circle cx="12" cy="12" r="2.4" fill="currentColor" />
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
        aria-hidden="true"
      >
        <rect x="0.75" y="0.75" width="14.5" height="14.5" rx="2" fill="currentColor" opacity="0.1" />
        {variant === 0 && (
          <>
            <path d="M8 2.8c2 1.5 2.9 3.2 2.9 5.1S9.6 13 8 13 5.1 10 5.1 7.9 6 4.3 8 2.8Z" fill="currentColor" />
            <path d="M8 6v5.2" stroke="#fff8e8" strokeWidth="1.2" strokeLinecap="round" />
          </>
        )}
        {variant === 1 && (
          <path d="M8 2.6 9.3 6.2h3.7L10.2 8.5l1.1 3.5L8 10.2 4.7 12l1.1-3.5L3 6.2h3.7L8 2.6Z" fill="currentColor" />
        )}
        {variant === 2 && (
          <>
            <rect x="7.2" y="2.8" width="1.6" height="8.2" rx="0.5" fill="currentColor" />
            <path d="M4.2 7h7.6L10.4 10H5.6L4.2 7Z" fill="currentColor" />
            <circle cx="8" cy="12.2" r="1.1" fill="currentColor" />
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
        <rect x="0.75" y="0.75" width="14.5" height="14.5" rx="2" fill="currentColor" opacity="0.1" />
        {variant === 0 && <path d="M8 2.4 12.6 8 8 13.6 3.4 8 8 2.4Z" fill="currentColor" />}
        {variant === 1 && (
          <path
            d="M8 13.1c-2.9-1.8-4.5-3.6-4.5-5.5A2.8 2.8 0 0 1 8 5.1a2.8 2.8 0 0 1 4.5 2.5c0 1.9-1.6 3.7-4.5 5.5Z"
            fill="currentColor"
          />
        )}
        {variant === 2 && (
          <>
            <path d="M8 2.8 9.6 6.2l3.8.4-2.8 2.5.8 3.5L8 10.8 4.6 12.6l.8-3.5-2.8-2.5 3.8-.4L8 2.8Z" fill="currentColor" />
            <circle cx="8" cy="8" r="1.3" fill="#fff8f4" opacity="0.9" />
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
      aria-hidden="true"
    >
      <rect x="0.75" y="0.75" width="14.5" height="14.5" rx="2" fill="currentColor" opacity="0.1" />
      {variant === 0 && (
        <>
          <path d="M5.1 3.8h5.8v5.4c0 2-1.2 3.5-2.9 3.5S5.1 11.2 5.1 9.2V3.8Z" fill="currentColor" />
          <circle cx="6.7" cy="7.2" r="0.85" fill="#0b0d12" />
          <circle cx="9.3" cy="7.2" r="0.85" fill="#0b0d12" />
        </>
      )}
      {variant === 1 && (
        <path d="M8 2.6c2.9 0 5 1.6 5 4S10.6 11 8 13.2C5.4 11 3 8.9 3 6.6s2.1-4 5-4Z" fill="currentColor" />
      )}
      {variant === 2 && (
        <>
          <circle cx="8" cy="8" r="4.3" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <circle cx="8" cy="8" r="1.5" fill="currentColor" />
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
