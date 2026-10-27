/**
 * Kids area Halloween slots. Outside siteConfig.halloween's window they render
 * null and the art chunk (SVG + kids-halloween.css) is never requested.
 * Pages wrap themselves in `.kids-scope` with kidsScopeProps(active) and add
 * kh-* hook classes; kids-halloween.css does the recolouring.
 */
import { lazy, Suspense } from "react";
import { useKidsHalloween } from "./useKidsHalloween";
import type { KidsHalloweenPiece } from "./KidsHalloweenArt";

const Art = lazy(() => import("./KidsHalloweenArt"));

export function KidsHalloweenSlot(props: KidsHalloweenPiece) {
  const active = useKidsHalloween();
  if (!active) return null;
  return (
    <Suspense fallback={null}>
      <Art {...props} />
    </Suspense>
  );
}
