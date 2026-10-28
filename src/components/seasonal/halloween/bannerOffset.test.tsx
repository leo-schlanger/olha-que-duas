import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { HalloweenBannerSlot, BANNER_DISMISS_KEY, SEASONAL_BAR_H } from "./index";

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
