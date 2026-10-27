/**
 * Seasonal theme gate: Halloween + Pão-por-Deus.
 * Outside siteConfig.halloween's window these slots render null and the
 * lazy chunks (art, CSS) are never requested. To remove the theme for good,
 * delete this folder, the four slot usages and siteConfig.halloween.
 */
import { lazy, Suspense, useState } from "react";
import { isHalloweenActive, BANNER_DISMISS_KEY } from "./isHalloweenActive";
import logoHalloween from "@/assets/seasonal/halloween/logo-halloween.webp";
import logoKidsHalloween from "@/assets/seasonal/halloween/logo-kids-halloween.webp";

const Banner = lazy(() => import("./HalloweenBanner"));
const Overlay = lazy(() => import("./HalloweenOverlay"));
const HeroAccent = lazy(() => import("./HalloweenHeroAccent"));
const KidsAccent = lazy(() => import("./HalloweenKidsAccent"));

export { BANNER_DISMISS_KEY };

function useActive() {
  const [active] = useState(() => isHalloweenActive(new Date()));
  return active;
}

/**
 * Seasonal logo swap. Imports are just URLs: the files are only fetched while
 * the window is active. Both keep the proportions of the regular logos (no CLS).
 */
export function useSeasonalLogo(fallback: string, kind: "site" | "kids" = "site") {
  const active = useActive();
  if (!active) return fallback;
  return kind === "kids" ? logoKidsHalloween : logoHalloween;
}

function readSession(key: string) {
  try {
    return sessionStorage.getItem(key) === "1";
  } catch {
    return false;
  }
}

/** Thin strip inside the fixed Header. Same-height fallback avoids layout shift. */
export function HalloweenBannerSlot() {
  const active = useActive();
  const [dismissed] = useState(() => readSession(BANNER_DISMISS_KEY));
  if (!active || dismissed) return null;
  return (
    <Suspense fallback={<div className="h-10 bg-[hsl(25_30%_14%)]" aria-hidden="true" />}>
      <Banner />
    </Suspense>
  );
}

/** Global decorative layer (App). */
export function HalloweenOverlaySlot() {
  const active = useActive();
  if (!active) return null;
  return (
    <Suspense fallback={null}>
      <Overlay />
    </Suspense>
  );
}

/** Pumpkins + ghost resting on the home Hero. Parent must be `relative`. */
export function HalloweenHeroSlot() {
  const active = useActive();
  if (!active) return null;
  return (
    <Suspense fallback={null}>
      <HeroAccent />
    </Suspense>
  );
}

/** Kids: "patch" = pumpkin patch with easter egg on the /kids hill; "sky" = ghost by the sun. */
export function HalloweenKidsSlot({ variant }: { variant: "patch" | "sky" }) {
  const active = useActive();
  if (!active) return null;
  return (
    <Suspense fallback={null}>
      <KidsAccent variant={variant} />
    </Suspense>
  );
}
