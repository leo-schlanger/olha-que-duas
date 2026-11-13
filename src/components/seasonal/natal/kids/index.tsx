/**
 * Kids area Christmas slots. Outside siteConfig.natal's window they render
 * null and the art chunk (SVG + kids-natal.css) is never requested.
 * Pages add kh-* hook classes; kids-natal.css keys on data-kids-season="natal".
 */
import { lazy, Suspense, useState } from "react";
import { isNatalActive } from "../isNatalActive";
import type { KidsNatalPiece } from "./KidsNatalArt";

const Art = lazy(() => import("./KidsNatalArt"));

export function KidsNatalSlot(props: KidsNatalPiece) {
  const [active] = useState(() => isNatalActive(new Date()));
  if (!active) return null;
  return (
    <Suspense fallback={null}>
      <Art {...props} />
    </Suspense>
  );
}
