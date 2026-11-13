/**
 * Seasonal theme gate: Natal / Boas Festas.
 * Outside siteConfig.natal's window these slots render null, the lazy chunks
 * (art, snow, decorations) are never requested and <html data-season> is not
 * set, so season.css (token overrides, scoped to that attribute) stays inert.
 * To remove the theme: delete this folder, src/assets/seasonal/natal/,
 * siteConfig.natal and its lines in ../index.tsx and ../kids.tsx.
 */
import { lazy, Suspense, useLayoutEffect, useState } from "react";
import { siteConfig } from "@/config/site";
import { isNatalActive, NATAL_BANNER_DISMISS_KEY } from "./isNatalActive";
import "./season.css";
// Wreath logo (client art, 13/11): circular cut with alpha, one file per size.
import logo64 from "@/assets/seasonal/natal/logo-natal-64.webp";
import logo96 from "@/assets/seasonal/natal/logo-natal-96.webp";
import logo128 from "@/assets/seasonal/natal/logo-natal-128.webp";
import logo192 from "@/assets/seasonal/natal/logo-natal-192.webp";
import logo256 from "@/assets/seasonal/natal/logo-natal-256.webp";
import logo288 from "@/assets/seasonal/natal/logo-natal-288.webp";
import logoPng128 from "@/assets/seasonal/natal/logo-natal-128.png";
import logoPng256 from "@/assets/seasonal/natal/logo-natal-256.png";
import logoKidsNatal from "@/assets/seasonal/natal/logo-kids-natal.webp";
// Compact wreath for the header (48–80 px): the full wreath makes «DUAS» illegible there.
import compact48 from "@/assets/seasonal/natal/logo-natal-compacto-48.webp";
import compact64 from "@/assets/seasonal/natal/logo-natal-compacto-64.webp";
import compact96 from "@/assets/seasonal/natal/logo-natal-compacto-96.webp";
import compact128 from "@/assets/seasonal/natal/logo-natal-compacto-128.webp";
import compact192 from "@/assets/seasonal/natal/logo-natal-compacto-192.webp";
import compactPng128 from "@/assets/seasonal/natal/logo-natal-compacto-128.png";

const Banner = lazy(() => import("./NatalBanner"));
const Overlay = lazy(() => import("./NatalOverlay"));
const HeaderLights = lazy(() => import("./NatalHeaderLights"));
const HeroScene = lazy(() => import("./NatalHeroScene"));
const FooterScene = lazy(() => import("./NatalFooterScene"));
const KidsAccent = lazy(() => import("./NatalKidsAccent"));

export { NATAL_BANNER_DISMISS_KEY };

// Set the season attribute before the first render (no flash of the normal
// palette) and drop it at the end of the window if the tab stays open.
if (typeof document !== "undefined" && isNatalActive(new Date())) {
  const root = document.documentElement;
  root.dataset.season = "natal";
  const msLeft = Date.parse(siteConfig.natal.end) - Date.now();
  if (msLeft > 0 && msLeft < 2 ** 31 - 1) {
    window.setTimeout(() => {
      if (root.dataset.season === "natal") delete root.dataset.season;
    }, msLeft);
  }
}

function useActive() {
  const [active] = useState(() => isNatalActive(new Date()));
  return active;
}

/** Logo files for the shared hooks in ../index.tsx (imports are just URLs). */
export const NATAL_LOGOS = {
  single: logo288,
  kids: logoKidsNatal,
  set: {
    src: logoPng128,
    srcSet: `${logoPng128} 128w, ${logoPng256} 256w`,
    webpSrcSet: `${logo64} 64w, ${logo96} 96w, ${logo128} 128w, ${logo192} 192w, ${logo256} 256w, ${logo288} 288w`,
  },
  compact: {
    src: compactPng128,
    srcSet: `${compactPng128} 128w`,
    webpSrcSet: `${compact48} 48w, ${compact64} 64w, ${compact96} 96w, ${compact128} 128w, ${compact192} 192w`,
  },
};

function readSession(key: string) {
  try {
    return sessionStorage.getItem(key) === "1";
  } catch {
    return false;
  }
}

/** Strip height (h-10). Published as --seasonal-bar-h so page offsets clear it. */
export const NATAL_BAR_H = "2.5rem";

/**
 * Boas Festas strip inside the fixed Header (same contract as the Halloween
 * one: publishes --seasonal-bar-h while it shows, 0 when closed).
 */
export function NatalBannerSlot() {
  const active = useActive();
  const [open, setOpen] = useState(() => !readSession(NATAL_BANNER_DISMISS_KEY));
  const show = active && open;
  useLayoutEffect(() => {
    if (!show) return;
    const root = document.documentElement;
    root.style.setProperty("--seasonal-bar-h", NATAL_BAR_H);
    return () => {
      root.style.removeProperty("--seasonal-bar-h");
    };
  }, [show]);
  if (!show) return null;
  return (
    <Suspense fallback={<div className="h-10 bg-[#7a1226]" aria-hidden="true" />}>
      <Banner onClose={() => setOpen(false)} />
    </Suspense>
  );
}

function lazySlot(Component: React.ComponentType) {
  return function Slot() {
    const active = useActive();
    if (!active) return null;
    return (
      <Suspense fallback={null}>
        <Component />
      </Suspense>
    );
  };
}

/** Snowfall over the whole site (App). */
export const NatalOverlaySlot = lazySlot(Overlay);
/** String of lights under the fixed Header. Header must be positioned. */
export const NatalHeaderSlot = lazySlot(HeaderLights);
/** Christmas night behind the home Hero. Parent must be `relative`. */
export const NatalHeroSlot = lazySlot(HeroScene);
/** Lights, holly, stars and snowy pines in the Footer. Parent must be `relative`. */
export const NatalFooterSlot = lazySlot(FooterScene);

/** Kids: "patch" = gift pile easter egg on the /kids hill; "sky" = smiling star. */
export function NatalKidsSlot({ variant }: { variant: "patch" | "sky" }) {
  const active = useActive();
  if (!active) return null;
  return (
    <Suspense fallback={null}>
      <KidsAccent variant={variant} />
    </Suspense>
  );
}
