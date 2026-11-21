import { describe, expect, it } from "vitest";
import { siteConfig } from "@/config/site";
import { seasonalHeroImage } from "@/components/seasonal";
import { NATAL_HERO_IMAGE } from "@/components/seasonal/natal";
import { HERO_SIZES, heroPreloadScript, regularHrefFromFiles, seasonalSrcSetFromFiles } from "./heroPreload";

const FILES = [
  "assets/index-AbCd1234.js",
  "assets/hero-natal-800-DOD_cyAn.webp",
  "assets/hero-natal-320-x1y2z3w4.webp",
  "assets/hero-natal-1149-Q-9_aZ01.webp",
  "assets/hero-natal-800-JpgHash1.jpg",
  "assets/olha-que-duas-foto-Ff00ee11.jpg",
];

type Link = { rel?: string; as?: string; type?: string; href?: string; attrs: Record<string, string> };

/** Runs the inline script with a fake clock, URL and <head>; returns the link it added. */
function run(script: string, now: number, pathname = "/"): Link | null {
  const added: Link[] = [];
  const document = {
    createElement: () => {
      const link: Link = { attrs: {} };
      return Object.assign(link, { setAttribute: (k: string, v: string) => (link.attrs[k] = v) });
    },
    head: { appendChild: (link: Link) => added.push(link) },
  };
  const FakeDate = { now: () => now };
  new Function("location", "document", "Date", script)({ pathname }, document, FakeDate);
  return added[0] ?? null;
}

const input = {
  seasonalSrcSet: seasonalSrcSetFromFiles(FILES),
  start: siteConfig.natal.start,
  end: siteConfig.natal.end,
  enabled: siteConfig.natal.enabled,
  regularHref: regularHrefFromFiles(FILES)!,
};
const start = Date.parse(siteConfig.natal.start);
const end = Date.parse(siteConfig.natal.end);

describe("hero preload (index.html)", () => {
  it("builds the WebP ladder from the bundle, narrowest first, and finds the regular photo", () => {
    expect(input.seasonalSrcSet).toBe(
      "/assets/hero-natal-320-x1y2z3w4.webp 320w, /assets/hero-natal-800-DOD_cyAn.webp 800w, /assets/hero-natal-1149-Q-9_aZ01.webp 1149w",
    );
    expect(input.regularHref).toBe("/assets/olha-que-duas-foto-Ff00ee11.jpg");
  });

  it("preloads the same photo the Hero shows, at every edge of the window", () => {
    const script = heroPreloadScript(input);
    const day = 86_400_000;
    for (const t of [start - day, start - 1, start, start + 1, (start + end) / 2, end - 1, end, end + day]) {
      const link = run(script, t)!;
      expect(link.rel).toBe("preload");
      expect(link.as).toBe("image");
      expect(link.attrs.fetchpriority).toBe("high");
      const seasonal = seasonalHeroImage(new Date(t)) !== null;
      if (seasonal) {
        expect(link.attrs.imagesrcset).toBe(input.seasonalSrcSet);
        expect(link.attrs.imagesizes).toBe(HERO_SIZES);
        expect(link.type).toBe("image/webp");
        expect(link.href).toBeUndefined();
      } else {
        expect(link.href).toBe(input.regularHref);
        expect(link.attrs.imagesrcset).toBeUndefined();
      }
    }
  });

  it("keeps the Natal srcset in the same width order as the Hero's <source>", () => {
    const widths = (set: string) => set.split(", ").map((entry) => entry.split(" ")[1]);
    expect(widths(NATAL_HERO_IMAGE.webpSrcSet)).toEqual(["320w", "480w", "640w", "800w", "960w", "1149w"]);
    const all = ["320", "480", "640", "800", "960", "1149"].map((w) => `assets/hero-natal-${w}-hash${w}.webp`);
    expect(widths(seasonalSrcSetFromFiles(all))).toEqual(widths(NATAL_HERO_IMAGE.webpSrcSet));
  });

  it("does nothing off the home page", () => {
    const script = heroPreloadScript(input);
    for (const pathname of ["/programas", "/programas/curtas-biografias/kina", "/kids", "/servicos"]) {
      expect(run(script, start + 1, pathname)).toBeNull();
    }
  });

  it("only preloads the regular photo when the season is switched off", () => {
    const script = heroPreloadScript({ ...input, enabled: false });
    expect(run(script, start + 1)!.href).toBe(input.regularHref);
  });
});
