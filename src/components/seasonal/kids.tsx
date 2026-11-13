/**
 * Kids area seasonal dress-up: one entry point for the pages. Pages wrap
 * themselves in `.kids-scope` with kidsScopeProps(season) and add kh-* hook
 * classes; each season's kids CSS (lazy, with its art chunk) keys on
 * `[data-kids-season="<season>"]`.
 */
import { KidsHalloweenSlot } from "./halloween/kids";
import { KidsNatalSlot } from "./natal/kids";
import type { Season } from "./activeSeason";

export { useSeason as useKidsSeason } from "./index";

export type KidsSeasonPiece =
  | { piece: "sky"; variant: "hero" | "shell" }
  | { piece: "hill"; variant: "hero" | "shell" }
  | { piece: "garland"; className?: string }
  | { piece: "treats" };

/** Props for the `.kids-scope` wrapper; nothing outside a season. */
export function kidsScopeProps(season: Season | null) {
  return season ? { "data-kids-season": season } : {};
}

/** Sky, hill, garland or treats for the active season. */
export const KidsSeasonSlot = (props: KidsSeasonPiece) => (
  <>
    <KidsHalloweenSlot {...props} />
    <KidsNatalSlot {...props} />
  </>
);
