/**
 * Seasonal theme gate: Halloween + Pão-por-Deus.
 * Outside siteConfig.halloween's window these slots render null, the lazy
 * chunks (art, decorations) are never requested and <html data-season> is not
 * set, so season.css (token overrides, scoped to that attribute) stays inert.
 * To remove the theme: delete this folder, the slot usages and siteConfig.halloween.
 */
import { lazy, Suspense, useLayoutEffect, useState } from "react";
import { siteConfig } from "@/config/site";
import { isHalloweenActive, BANNER_DISMISS_KEY } from "./isHalloweenActive";
import "./season.css";
import logoHalloween from "@/assets/seasonal/halloween/logo-halloween.webp";
import logoKidsHalloween from "@/assets/seasonal/halloween/logo-kids-halloween.webp";

const Banner = lazy(() => import("./HalloweenBanner"));
const Overlay = lazy(() => import("./HalloweenOverlay"));
const HeroScene = lazy(() => import("./HalloweenHeroScene"));
const FooterScene = lazy(() => import("./HalloweenFooterScene"));
const KidsAccent = lazy(() => import("./HalloweenKidsAccent"));

export { BANNER_DISMISS_KEY };

// Set the season attribute before the first render (no flash of the normal
// palette) and drop it at the end of the window if the tab stays open.
if (typeof document !== "undefined" && isHalloweenActive(new Date())) {
  const root = document.documentElement;
  root.dataset.season = "halloween";
  const msLeft = Date.parse(siteConfig.halloween.end) - Date.now();
  if (msLeft > 0 && msLeft < 2 ** 31 - 1) {
    window.setTimeout(() => {
      if (root.dataset.season === "halloween") delete root.dataset.season;
    }, msLeft);
  }
}

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

/** Strip height (h-10). Published as --seasonal-bar-h so page offsets clear it. */
export const SEASONAL_BAR_H = "2.5rem";

/**
 * Thin strip inside the fixed Header. Same-height fallback avoids layout shift.
 * While it shows, :root gets --seasonal-bar-h (body padding, sticky tops and
 * anchor scroll-padding add it in index.css); closing it resets the var to 0.
 */
export function HalloweenBannerSlot() {
  const active = useActive();
  const [open, setOpen] = useState(() => !readSession(BANNER_DISMISS_KEY));
  const show = active && open;
  useLayoutEffect(() => {
    if (!show) return;
    const root = document.documentElement;
    root.style.setProperty("--seasonal-bar-h", SEASONAL_BAR_H);
    return () => {
      root.style.removeProperty("--seasonal-bar-h");
    };
  }, [show]);
  if (!show) return null;
  return (
    <Suspense fallback={<div className="h-10 bg-[hsl(24_95%_56%)]" aria-hidden="true" />}>
      <Banner onClose={() => setOpen(false)} />
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

/** Night sky (moon, bats, pumpkin patch) behind the home Hero. Parent must be `relative`. */
export function HalloweenHeroSlot() {
  const active = useActive();
  if (!active) return null;
  return (
    <Suspense fallback={null}>
      <HeroScene />
    </Suspense>
  );
}

/** Moon, bats and pumpkins in the Footer. Parent must be `relative`. */
export function HalloweenFooterSlot() {
  const active = useActive();
  if (!active) return null;
  return (
    <Suspense fallback={null}>
      <FooterScene />
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
