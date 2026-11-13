const bundledImages = import.meta.glob("./assets/**/*.{png,jpg,jpeg,webp}", {
  eager: true,
  import: "default"
});

/** Every image Vite emits for this app, including worlds that are not on screen yet. */
export const imageUrls = [...new Set(Object.values(bundledImages) as string[])];

/**
 * Start fetching every UI image as soon as the page script runs.
 * Off-screen worlds and chapter rows then read from cache instead of
 * waiting for the first time they are painted.
 */
export function preloadAppImages(urls: readonly string[] = imageUrls) {
  if (typeof window === "undefined" || urls.length === 0) return;

  for (const src of urls) {
    const img = new Image();
    img.decoding = "async";
    img.fetchPriority = src.includes("hero-") ? "high" : "auto";
    img.src = src;
  }
}
