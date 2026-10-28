import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, renderHook, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { HalloweenBannerSlot, BANNER_DISMISS_KEY, SEASONAL_BAR_H, useSeasonalLogoSet } from "./index";

const barVar = () => document.documentElement.style.getPropertyValue("--seasonal-bar-h");

const renderSlot = () =>
  render(
    <MemoryRouter>
      <HalloweenBannerSlot />
    </MemoryRouter>,
  );

describe("HalloweenBannerSlot offset var", () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ["Date"] });
    sessionStorage.clear();
  });
  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    document.documentElement.style.removeProperty("--seasonal-bar-h");
  });

  it("publishes the strip height while the banner shows and clears it on unmount", () => {
    vi.setSystemTime(new Date("2026-10-29T12:00:00Z"));
    const { unmount } = renderSlot();
    expect(barVar()).toBe(SEASONAL_BAR_H);
    unmount();
    expect(barVar()).toBe("");
  });

  it("leaves the offset at 0 when the banner was closed in this session", () => {
    vi.setSystemTime(new Date("2026-10-29T12:00:00Z"));
    sessionStorage.setItem(BANNER_DISMISS_KEY, "1");
    renderSlot();
    expect(barVar()).toBe("");
  });

  it("leaves the offset at 0 outside the season window", () => {
    vi.setSystemTime(new Date("2026-11-05T12:00:00Z"));
    renderSlot();
    expect(barVar()).toBe("");
  });
});

describe("useSeasonalLogoSet", () => {
  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it("serves the medallion as WebP sizes up to 3x plus a PNG fallback in season", () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2026-10-29T12:00:00Z"));
    const { result } = renderHook(() => useSeasonalLogoSet());
    expect(result.current?.webpSrcSet).toMatch(/192w.*288w/);
    expect(result.current?.srcSet).toMatch(/\.png 128w.*\.png 256w/);
  });

  it("returns null outside the window so the regular logo comes back", () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2026-11-02T00:00:01Z"));
    const { result } = renderHook(() => useSeasonalLogoSet());
    expect(result.current).toBeNull();
  });
});
