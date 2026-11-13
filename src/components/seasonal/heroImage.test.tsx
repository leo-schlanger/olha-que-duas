import { describe, it, expect, vi, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { siteConfig } from "@/config/site";
import { seasonalHeroImage } from "./index";
import Hero from "@/components/Hero";

// Window comes from siteConfig.natal only (no dates duplicated here).
const start = Date.parse(siteConfig.natal.start);
const end = Date.parse(siteConfig.natal.end);
const ALT = "Alexandra e Marluce - Fundadoras do Olha que Duas";

describe("seasonalHeroImage", () => {
  it("uses the Natal photo inside the window [start, end)", () => {
    for (const t of [start, start + (end - start) / 2, end - 1]) {
      expect(seasonalHeroImage(new Date(t))?.src).toMatch(/hero-natal-800/);
    }
  });

  it("falls back to the regular photo outside the window", () => {
    expect(seasonalHeroImage(new Date(start - 1))).toBeNull();
    expect(seasonalHeroImage(new Date(end))).toBeNull();
  });
});

describe("Hero photo swap", () => {
  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  const renderAt = (t: number) => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(t);
    return render(<Hero />);
  };

  it("renders the Natal <picture> (WebP srcset + sizes) inside the window", () => {
    const { container, getByAltText } = renderAt(start + 1000);
    const source = container.querySelector('picture source[type="image/webp"]');
    expect(source?.getAttribute("srcset")).toMatch(/hero-natal-320.*320w.*hero-natal-1149.*1149w/);
    expect(source?.getAttribute("sizes")).toContain("320px");
    const img = getByAltText(ALT);
    expect(img.getAttribute("src")).toMatch(/hero-natal-800/);
    expect(img.getAttribute("fetchpriority")).toBe("high");
  });

  it("renders the regular photo after the window ends", () => {
    const { container, getByAltText } = renderAt(end);
    expect(container.querySelector("picture")).toBeNull();
    expect(getByAltText(ALT).getAttribute("src")).toMatch(/olha-que-duas-foto/);
  });
});
