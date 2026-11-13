import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, renderHook, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { NatalBannerSlot, NATAL_BANNER_DISMISS_KEY, NATAL_BAR_H } from "./index";
import { natalCopy } from "./NatalBanner";
import { useSeasonalLogoSet, useSeasonalLogo } from "../index";
import type { NatalPhase } from "./isNatalActive";

const barVar = () => document.documentElement.style.getPropertyValue("--seasonal-bar-h");
const renderSlot = () =>
  render(
    <MemoryRouter>
      <NatalBannerSlot />
    </MemoryRouter>,
  );

describe("natalCopy", () => {
  const all = (phase: NatalPhase) =>
    (["site", "kids"] as const).flatMap((a) => Object.values(natalCopy(a, phase, 3))).join(" ");

  it("counts down with the right plural", () => {
    expect(natalCopy("site", "countdown", 42).long).toMatch(/^Faltam 42 dias para o Natal/);
    expect(natalCopy("site", "countdown", 1).short).toBe("Falta 1 dia");
    expect(natalCopy("kids", "countdown", 1).long).toBe("Falta 1 dia para o Pai Natal chegar!");
  });

  it("never says «falta» from 24 Dec on", () => {
    for (const phase of ["consoada", "natal", "boasFestas"] as const) {
      expect(all(phase)).not.toMatch(/falta/i);
    }
  });
});

describe("NatalBannerSlot offset var", () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ["Date"] });
    sessionStorage.clear();
  });
  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    document.documentElement.style.removeProperty("--seasonal-bar-h");
  });

  it("publishes the strip height while it shows and clears it on unmount", () => {
    vi.setSystemTime(new Date("2026-12-01T12:00:00Z"));
    const { unmount } = renderSlot();
    expect(barVar()).toBe(NATAL_BAR_H);
    unmount();
    expect(barVar()).toBe("");
  });

  it("stays closed for the session once dismissed", () => {
    vi.setSystemTime(new Date("2026-12-01T12:00:00Z"));
    sessionStorage.setItem(NATAL_BANNER_DISMISS_KEY, "1");
    renderSlot();
    expect(barVar()).toBe("");
  });

  it("is gone from 27 Dec", () => {
    vi.setSystemTime(new Date("2026-12-27T00:00:00Z"));
    renderSlot();
    expect(barVar()).toBe("");
  });
});

describe("seasonal logos in the Christmas window", () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2026-12-10T12:00:00Z"));
  });
  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it("header gets the compact wreath, footer the full one, Kids its own", () => {
    const compact = renderHook(() => useSeasonalLogoSet("compact")).result.current;
    const full = renderHook(() => useSeasonalLogoSet()).result.current;
    expect(compact?.webpSrcSet).toMatch(/compacto-48.*48w.*compacto-192.*192w/);
    expect(full?.webpSrcSet).toMatch(/logo-natal-64.*64w.*logo-natal-288.*288w/);
    expect(full?.srcSet).toMatch(/logo-natal-128\.png 128w.*logo-natal-256\.png 256w/);
    expect(renderHook(() => useSeasonalLogo("x.webp", "kids")).result.current).toMatch(/logo-kids-natal/);
  });

  it("falls back to the regular logo after the window", () => {
    vi.setSystemTime(new Date("2026-12-27T00:00:01Z"));
    expect(renderHook(() => useSeasonalLogoSet("compact")).result.current).toBeNull();
    expect(renderHook(() => useSeasonalLogo("x.webp", "kids")).result.current).toBe("x.webp");
  });
});
