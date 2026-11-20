import type { DailyPeriod, DailySlot } from "@/hooks/useDailySchedule";

/** "10h", "10h30", "10:30", "00h" -> minutes since midnight; null if unreadable. */
export function slotMinutes(time: string | undefined): number | null {
  const m = time?.trim().match(/^(\d{1,2})\s*[h:]\s*(\d{2})?$/i);
  if (!m) return null;
  const h = Number(m[1]);
  const min = m[2] ? Number(m[2]) : 0;
  if (h > 24 || min > 59) return null;
  return (h % 24) * 60 + min;
}

interface Timed {
  slot: DailySlot;
  start: number;
  end: number | null;
  depth: number;
}

function flatten(periods: DailyPeriod[]): Timed[] {
  const out: Timed[] = [];
  const add = (slot: DailySlot, depth: number) => {
    const start = slotMinutes(slot.time);
    if (slot.isAllDay || start === null) return;
    let end = slotMinutes(slot.endTime);
    if (end !== null && end <= start) end += 24 * 60; // "20h–00h" ends at midnight
    out.push({ slot, start, end, depth });
    slot.subPrograms?.forEach((sub) => add(sub, depth + 1));
  };
  periods.forEach((p) => p.slots.forEach((s) => add(s, 0)));
  // Same start: the nested special (deeper) wins over the block that holds it.
  out.sort((a, b) => a.start - b.start || b.depth - a.depth);
  // No end given: it runs until the next slot starts (or midnight).
  for (const t of out) {
    if (t.end === null) t.end = out.find((o) => o.start > t.start)?.start ?? 24 * 60;
  }
  return out;
}

/**
 * «Hoje na rádio»: what is on now and the next `count` slots of the day
 * (wrapping past midnight). Nested specials count as their own slots.
 */
export function radioUpNext(
  periods: DailyPeriod[] | undefined,
  now: Date = new Date(),
  count = 3,
): { current: DailySlot | null; next: DailySlot[] } {
  const items = flatten(periods ?? []);
  if (items.length === 0) return { current: null, next: [] };
  const mins = now.getHours() * 60 + now.getMinutes();
  const covers = (t: Timed, m: number) => t.start <= m && (t.end === null || m < t.end);
  // Latest-starting slot that covers now (the most specific one).
  let idx = -1;
  for (let i = 0; i < items.length; i++) {
    if (covers(items[i], mins) || covers(items[i], mins + 24 * 60)) idx = i;
  }
  if (idx === -1) {
    // Gap: the last one that started before now (or the last of the day, past midnight).
    for (let i = 0; i < items.length; i++) if (items[i].start <= mins) idx = i;
    if (idx === -1) idx = items.length - 1;
  }
  const next: DailySlot[] = [];
  for (let k = 1; k <= items.length - 1 && next.length < count; k++) {
    next.push(items[(idx + k) % items.length].slot);
  }
  return { current: items[idx].slot, next };
}
