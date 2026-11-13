import { afterEach, describe, expect, it, vi } from "vitest";
import { imageUrls, preloadAppImages } from "../src/preloadImages";

describe("preloadAppImages", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("requests every bundled image as soon as the page script runs", () => {
    const requested: { src: string; priority: string }[] = [];
    vi.stubGlobal("window", globalThis);
    vi.stubGlobal(
      "Image",
      class {
        decoding = "";
        fetchPriority = "auto";
        set src(value: string) {
          requested.push({ src: value, priority: this.fetchPriority });
        }
      }
    );

    preloadAppImages();

    expect(imageUrls.length).toBeGreaterThanOrEqual(20);
    expect(requested.map((item) => item.src).sort()).toEqual([...imageUrls].sort());
    expect(requested.filter((item) => item.src.includes("hero-")).every((item) => item.priority === "high")).toBe(
      true
    );
    expect(requested.some((item) => item.priority === "auto")).toBe(true);
  });
});