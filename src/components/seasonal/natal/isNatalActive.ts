import { siteConfig } from "@/config/site";

type NatalWindow = {
  enabled: boolean;
  start: string;
  end: string;
  christmas: string;
};

const DAY = 86_400_000;

/**
 * True while the Christmas theme should render. Window is [start, end).
 * Pure: takes the clock and the config so it can be tested without mocks.
 */
export function isNatalActive(now: Date = new Date(), config: NatalWindow = siteConfig.natal): boolean {
  if (!config.enabled) return false;
  const t = now.getTime();
  const start = Date.parse(config.start);
  const end = Date.parse(config.end);
  if (Number.isNaN(start) || Number.isNaN(end)) return false;
  return t >= start && t < end;
}

export type NatalPhase = "countdown" | "consoada" | "natal" | "boasFestas";

/** Lisbon days: before 24 Dec, 24 Dec (Consoada), 25 Dec, from 26 Dec on. */
export function getNatalPhase(now: Date = new Date(), config: NatalWindow = siteConfig.natal): NatalPhase {
  const t = now.getTime();
  const xmas = Date.parse(config.christmas);
  if (t < xmas - DAY) return "countdown";
  if (t < xmas) return "consoada";
  if (t < xmas + DAY) return "natal";
  return "boasFestas";
}

/** Whole Lisbon days left until 25 Dec 00:00 (42 on 13 Nov). */
export function daysToChristmas(now: Date = new Date(), config: NatalWindow = siteConfig.natal): number {
  return Math.max(0, Math.ceil((Date.parse(config.christmas) - now.getTime()) / DAY));
}

export const NATAL_BANNER_DISMISS_KEY = "nt-banner-dismissed";
