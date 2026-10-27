import { useState } from "react";
import { isHalloweenActive } from "../isHalloweenActive";

/** Same gate as the site theme, read once per mount (no flicker on re-render). */
export function useKidsHalloween(): boolean {
  const [active] = useState(() => isHalloweenActive(new Date()));
  return active;
}

/**
 * Props for the `.kids-scope` wrapper. The data attribute is what
 * kids-halloween.css keys on, so nothing changes outside the window.
 */
export function kidsScopeProps(active: boolean) {
  return active ? { "data-kids-season": "halloween" } : {};
}
