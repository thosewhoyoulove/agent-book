import type { GameWorldId } from "../content/gameWorlds";

export function ChevronIcon({ open = false, size = 14 }: { open?: boolean; size?: number }) {
  return (
    <svg
      className={`nav-chevron-icon${open ? " is-open" : ""}`}
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4.2 6.2 8 10l3.8-3.8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SectionArrowIcon({ size = 10 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path
        d="M3.5 2.5 7.5 6l-4 3.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Themed chapter mark replacing emoji glyphs in the sidebar. */
export function ChapterMarkIcon({
  worldId,
  index = 0,
  completed = false,
  size = 16
}: {
  worldId: GameWorldId;
  index?: number;
  completed?: boolean;
  size?: number;
}) {
  const tone = completed ? "is-done" : "is-todo";

  if (worldId === "stardew") {
    const variant = index % 3;
    return (
      <svg
        className={`chapter-mark chapter-mark--stardew ${tone}`}
        width={size}
        height={size}
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="8" cy="8" r="7" fill="currentColor" opacity="0.12" />
        {variant === 0 && (
          <>
            <path d="M8 3.2c1.8 1.4 2.6 3 2.6 4.8S9.4 12.2 8 12.2 5.4 9.8 5.4 8 6.2 4.6 8 3.2Z" fill="currentColor" />
            <path d="M8 6.2v5" stroke="#fff8e8" strokeWidth="1.2" strokeLinecap="round" />
          </>
        )}
        {variant === 1 && (
          <>
            <path d="M8 2.8 9.2 6.4h3.6L10 8.7l1.1 3.6L8 10.3l-3.1 2 1.1-3.6-2.8-2.3h3.6L8 2.8Z" fill="currentColor" />
          </>
        )}
        {variant === 2 && (
          <>
            <rect x="7.1" y="3" width="1.8" height="8.5" rx="0.6" fill="currentColor" />
            <path d="M4.4 7.2h7.2l-1.4 2.8H5.8L4.4 7.2Z" fill="currentColor" />
            <circle cx="8" cy="12.4" r="1.2" fill="currentColor" />
          </>
        )}
      </svg>
    );
  }

  if (worldId === "celeste") {
    const variant = index % 3;
    return (
      <svg
        className={`chapter-mark chapter-mark--celeste ${tone}`}
        width={size}
        height={size}
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="8" cy="8" r="7" fill="currentColor" opacity="0.12" />
        {variant === 0 && <path d="M8 2.6 12.4 8 8 13.4 3.6 8 8 2.6Z" fill="currentColor" />}
        {variant === 1 && (
          <path
            d="M8 13.2c-2.8-1.8-4.4-3.6-4.4-5.5A2.7 2.7 0 0 1 8 5.2a2.7 2.7 0 0 1 4.4 2.5c0 1.9-1.6 3.7-4.4 5.5Z"
            fill="currentColor"
          />
        )}
        {variant === 2 && (
          <>
            <path d="M8 3.1 9.5 6.4 13 6.8 10.4 9.2l.8 3.4L8 11l-3.2 1.6.8-3.4L3 6.8l3.5-.4L8 3.1Z" fill="currentColor" />
            <circle cx="8" cy="8" r="1.4" fill="#fff8f4" opacity="0.85" />
          </>
        )}
      </svg>
    );
  }

  const variant = index % 3;
  return (
    <svg
      className={`chapter-mark chapter-mark--hollow ${tone}`}
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="8" cy="8" r="7" fill="currentColor" opacity="0.12" />
      {variant === 0 && (
        <>
          <path d="M5.2 4.2h5.6v5.2c0 1.9-1.2 3.4-2.8 3.4S5.2 11.3 5.2 9.4V4.2Z" fill="currentColor" />
          <circle cx="6.7" cy="7.4" r="0.9" fill="#0b0d12" />
          <circle cx="9.3" cy="7.4" r="0.9" fill="#0b0d12" />
        </>
      )}
      {variant === 1 && (
        <path
          d="M8 2.8c2.8 0 4.8 1.5 4.8 3.8S10.4 11 8 13.2C5.6 11 3.2 8.9 3.2 6.6S5.2 2.8 8 2.8Z"
          fill="currentColor"
        />
      )}
      {variant === 2 && (
        <>
          <circle cx="8" cy="8" r="4.4" stroke="currentColor" strokeWidth="1.6" />
          <circle cx="8" cy="8" r="1.6" fill="currentColor" />
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
