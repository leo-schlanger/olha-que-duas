import { isHalloweenActive } from "./halloween/isHalloweenActive";
import { isNatalActive } from "./natal/isNatalActive";

export type Season = "halloween" | "natal";

/** The season whose window contains `now` (windows never overlap), or null. */
export function activeSeason(now: Date = new Date()): Season | null {
  if (isHalloweenActive(now)) return "halloween";
  if (isNatalActive(now)) return "natal";
  return null;
}
