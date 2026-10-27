import { siteConfig } from "@/config/site";

type HalloweenWindow = {
  enabled: boolean;
  start: string;
  end: string;
  paoPorDeus: string;
};

/**
 * True while the seasonal theme should render. Window is [start, end).
 * Pure: takes the clock and the config so it can be tested without mocks.
 */
export function isHalloweenActive(
  now: Date = new Date(),
  config: HalloweenWindow = siteConfig.halloween,
): boolean {
  if (!config.enabled) return false;
  const t = now.getTime();
  const start = Date.parse(config.start);
  const end = Date.parse(config.end);
  if (Number.isNaN(start) || Number.isNaN(end)) return false;
  return t >= start && t < end;
}

/** "paoPorDeus" from 1 Nov (Lisbon) until the end of the window. */
export function getHalloweenPhase(
  now: Date = new Date(),
  config: HalloweenWindow = siteConfig.halloween,
): "halloween" | "paoPorDeus" {
  return now.getTime() >= Date.parse(config.paoPorDeus) ? "paoPorDeus" : "halloween";
}

export const BANNER_DISMISS_KEY = "hw-banner-dismissed";
