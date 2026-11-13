/**
 * Seasonal themes: one entry point for the site. Each season lives in its own
 * folder and self-gates by date (siteConfig.<season>); these wrappers render
 * every season's slot, and only the active one paints anything. To remove a
 * season, delete its folder and its lines here and in ./kids.tsx.
 */
import { useState } from "react";
import { activeSeason, type Season } from "./activeSeason";
import {
  HalloweenBannerSlot,
  HalloweenFooterSlot,
  HalloweenHeroSlot,
  HalloweenKidsSlot,
  HalloweenOverlaySlot,
  HALLOWEEN_LOGOS,
} from "./halloween";
import {
  NatalBannerSlot,
  NatalFooterSlot,
  NatalHeaderSlot,
  NatalHeroSlot,
  NatalKidsSlot,
  NatalOverlaySlot,
  NATAL_HERO_IMAGE,
  NATAL_LOGOS,
} from "./natal";

export type { Season };
export type SeasonalLogoSet = { src: string; srcSet: string; webpSrcSet: string };

const LOGOS: Record<Season, { single: string; kids: string; set: SeasonalLogoSet; compact?: SeasonalLogoSet }> = {
  halloween: HALLOWEEN_LOGOS,
  natal: NATAL_LOGOS,
};

/** Active season, read once per mount (no flicker on re-render). */
export function useSeason(): Season | null {
  const [season] = useState(() => activeSeason(new Date()));
  return season;
}

/** Seasonal logo URL (Kids pages, single <img>); the fallback outside any season. */
export function useSeasonalLogo(fallback: string, kind: "site" | "kids" = "site") {
  const season = useSeason();
  if (!season) return fallback;
  return kind === "kids" ? LOGOS[season].kids : LOGOS[season].single;
}

/**
 * Responsive site logo for <picture> (WebP + PNG fallback); null outside a season.
 * "compact" (header, ≤ 80 px) falls back to the full art when a season has none.
 */
export function useSeasonalLogoSet(variant: "full" | "compact" = "full"): SeasonalLogoSet | null {
  const season = useSeason();
  if (!season) return null;
  const logos = LOGOS[season];
  return variant === "compact" ? (logos.compact ?? logos.set) : logos.set;
}

export type SeasonalHeroImage = {
  src: string;
  webpSrcSet: string;
  width: number;
  height: number;
  objectPosition: string;
};

// Seasons that swap the home hero photo (others keep the regular one).
const HERO_IMAGES: Partial<Record<Season, SeasonalHeroImage>> = {
  natal: NATAL_HERO_IMAGE,
};

/** Hero photo for `now`, or null (regular photo). Window = the season's own config. */
export function seasonalHeroImage(now: Date = new Date()): SeasonalHeroImage | null {
  const season = activeSeason(now);
  return (season && HERO_IMAGES[season]) || null;
}

/** Seasonal home hero photo, read once per mount; null outside a season. */
export function useSeasonalHeroImage(): SeasonalHeroImage | null {
  const season = useSeason();
  return (season && HERO_IMAGES[season]) || null;
}

/** Strip inside the fixed Header (publishes --seasonal-bar-h). */
export const SeasonalBannerSlot = () => (
  <>
    <HalloweenBannerSlot />
    <NatalBannerSlot />
  </>
);

/** Decoration hanging from the Header's bottom edge. */
export const SeasonalHeaderSlot = () => <NatalHeaderSlot />;

/** Global decorative layer (App). */
export const SeasonalOverlaySlot = () => (
  <>
    <HalloweenOverlaySlot />
    <NatalOverlaySlot />
  </>
);

/** Scene behind the home Hero. Parent must be `relative`. */
export const SeasonalHeroSlot = () => (
  <>
    <HalloweenHeroSlot />
    <NatalHeroSlot />
  </>
);

/** Scene in the Footer. Parent must be `relative`. */
export const SeasonalFooterSlot = () => (
  <>
    <HalloweenFooterSlot />
    <NatalFooterSlot />
  </>
);

/** Kids easter egg ("patch", on the /kids hill) and sky accent ("sky", games hub). */
export const SeasonalKidsAccentSlot = ({ variant }: { variant: "patch" | "sky" }) => (
  <>
    <HalloweenKidsSlot variant={variant} />
    <NatalKidsSlot variant={variant} />
  </>
);
