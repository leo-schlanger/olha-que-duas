import { isProgramVisible, type DatedSlot, type WeeklySlot } from "./radioSchedule";

/** Columns of a program's linked event (site, sitemap, middleware). */
export const EVENT_SELECT = "id,is_active,schedule(day_of_week,time,is_active),schedule_dates(event_date,time,is_active)";

export interface ProgramEvent {
  id: string;
  is_active: boolean;
  schedule?: WeeklySlot[] | null;
  schedule_dates?: DatedSlot[] | null;
}

/** Radio-only rule (plan §2.4): active event with an active weekly slot or a future date. */
export function eventKeepsProgram(event: ProgramEvent | undefined, now: Date = new Date()): boolean {
  if (!event) return false;
  return isProgramVisible({
    livePieces: 0,
    eventActive: event.is_active,
    weekly: event.schedule ?? [],
    dated: event.schedule_dates ?? [],
    now,
  });
}

/**
 * Programs to show, in their order: those with a live piece, plus those kept
 * by their radio event. One function for the hub, the sitemap and the middleware.
 */
export function visiblePrograms<T extends { id: string; event_id?: string | null }>(
  programs: T[],
  livePostProgramIds: Iterable<unknown>,
  events: ProgramEvent[],
  now: Date = new Date(),
): T[] {
  const live = new Set([...livePostProgramIds].filter((id): id is string => typeof id === "string"));
  const byId = new Map(events.map((e) => [e.id, e]));
  return programs.filter((p) => live.has(p.id) || (p.event_id ? eventKeepsProgram(byId.get(p.event_id), now) : false));
}
