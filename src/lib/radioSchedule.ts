/**
 * Radio side of a program (20/11/2026): weekly slots (`schedule`) and one-off
 * dates (`schedule_dates`) of the linked event, always in Europe/Lisbon wall
 * time (the DB stores Lisbon times without zone; the middleware runs in UTC).
 */
export interface WeeklySlot {
  day_of_week: number; // 0 = domingo
  time: string; // "11:00:00"
  is_active?: boolean | null;
}
export interface DatedSlot {
  event_date: string; // "2026-12-16"
  time?: string | null;
  is_active?: boolean | null;
}
export interface Broadcast {
  date: string; // YYYY-MM-DD (Lisbon)
  time: string; // HH:MM
  dow: number;
}

const DAYS = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];
const DAYS_SHORT = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const MONTHS = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

const hhmm = (t: string) => t.slice(0, 5);

/** Lisbon wall clock for an instant. */
export function lisbonNow(now: Date): { date: string; minutes: number; dow: number } {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/Lisbon",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(now)
      .map((p) => [p.type, p.value]),
  );
  const date = `${parts.year}-${parts.month}-${parts.day}`;
  return { date, minutes: +parts.hour * 60 + +parts.minute, dow: new Date(`${date}T12:00:00Z`).getUTCDay() };
}

const addDays = (date: string, n: number) => {
  const d = new Date(`${date}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
};
const toMin = (t: string) => +t.slice(0, 2) * 60 + +t.slice(3, 5);

/** Next broadcast (weekly or dated), strictly after `now`, within 60 days. */
export function nextBroadcast(weekly: WeeklySlot[], dated: DatedSlot[], now: Date = new Date()): Broadcast | null {
  const { date: today, minutes } = lisbonNow(now);
  const cands: Broadcast[] = [];
  const active = weekly.filter((s) => s.is_active !== false);
  for (let i = 0; i < 8 && active.length; i++) {
    const date = addDays(today, i);
    const dow = new Date(`${date}T12:00:00Z`).getUTCDay();
    for (const s of active) {
      if (s.day_of_week !== dow) continue;
      if (i === 0 && toMin(s.time) <= minutes) continue;
      cands.push({ date, time: hhmm(s.time), dow });
    }
  }
  const limit = addDays(today, 60);
  for (const d of dated) {
    if (d.is_active === false || !d.time || d.event_date < today || d.event_date > limit) continue;
    if (d.event_date === today && toMin(d.time) <= minutes) continue;
    cands.push({ date: d.event_date, time: hhmm(d.time), dow: new Date(`${d.event_date}T12:00:00Z`).getUTCDay() });
  }
  cands.sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  return cands[0] ?? null;
}

/** «sexta, 27 nov, 20:00» */
export function formatBroadcast(b: Broadcast): string {
  const [, m, d] = b.date.split("-");
  return `${DAYS[b.dow]}, ${+d} ${MONTHS[+m - 1]}, ${b.time}`;
}

/**
 * Weekly pattern, grouped: days with the same times merge, runs become ranges.
 * Long «terça, 11:00 e 17:00» / «segunda a sábado, 18:30; sábado, 11:00»;
 * short «Ter, 11h e 17h» / «Seg a sáb, 18h30 · sáb, 11h».
 */
export function weeklyPattern(weekly: WeeklySlot[], short = false): string {
  const fmt = (t: string) =>
    short ? hhmm(t).replace(/^0?(\d+):00$/, "$1h").replace(/^0?(\d+):(\d\d)$/, "$1h$2") : hhmm(t);
  const order = [1, 2, 3, 4, 5, 6, 0];
  // time -> days
  const byTime = new Map<string, number[]>();
  for (const s of weekly.filter((x) => x.is_active !== false)) {
    const t = hhmm(s.time);
    byTime.set(t, [...new Set([...(byTime.get(t) ?? []), s.day_of_week])]);
  }
  // Two groupings: by time (days sharing a time) and by day (days sharing all times);
  // the one with fewer parts wins, by time on a tie (Cantinho «Seg a sáb, 18h30 · sáb, 11h»).
  const byTimeGroups = new Map<string, { days: number[]; times: string[] }>();
  for (const [t, days] of [...byTime].sort((a, b) => a[0].localeCompare(b[0]))) {
    const sorted = days.sort((a, b) => order.indexOf(a) - order.indexOf(b));
    const key = sorted.join(",");
    const g = byTimeGroups.get(key) ?? { days: sorted, times: [] };
    g.times.push(t);
    byTimeGroups.set(key, g);
  }
  const perDay = new Map<number, string[]>();
  for (const [t, days] of [...byTime].sort((a, b) => a[0].localeCompare(b[0]))) for (const d of days) perDay.set(d, [...(perDay.get(d) ?? []), t]);
  const byDayGroups = new Map<string, { days: number[]; times: string[] }>();
  for (const d of order.filter((x) => perDay.has(x))) {
    const key = perDay.get(d)!.join(",");
    const g = byDayGroups.get(key) ?? { days: [], times: perDay.get(d)! };
    g.days.push(d);
    byDayGroups.set(key, g);
  }
  const groups = byDayGroups.size < byTimeGroups.size ? byDayGroups : byTimeGroups;
  const names = short ? DAYS_SHORT.map((d) => d.toLowerCase()) : DAYS;
  const dayLabel = (days: number[]) => {
    const idx = days.map((d) => order.indexOf(d));
    const run = idx.every((v, i) => i === 0 || v === idx[i - 1] + 1);
    if (days.length > 2 && run) return `${names[days[0]]} a ${names[days[days.length - 1]]}`;
    return days.map((d) => names[d]).join(", ");
  };
  const join = (xs: string[]) => (xs.length > 1 ? `${xs.slice(0, -1).join(", ")} e ${xs[xs.length - 1]}` : xs[0]);
  const parts = [...groups.values()]
    .sort((a, b) => b.days.length - a.days.length || order.indexOf(a.days[0]) - order.indexOf(b.days[0]))
    .map((g) => `${dayLabel(g.days)}, ${join(g.times.map(fmt))}`);
  const out = parts.join(short ? " · " : "; ");
  return short && out ? out[0].toUpperCase() + out.slice(1) : out;
}

/**
 * Hub rule (plan §2.4): a published program shows if it has a live piece OR an
 * active linked event with an active weekly slot or a future active date.
 */
export function isProgramVisible(opts: {
  livePieces: number;
  eventActive?: boolean | null;
  weekly?: WeeklySlot[];
  dated?: DatedSlot[];
  now?: Date;
}): boolean {
  if (opts.livePieces > 0) return true;
  if (!opts.eventActive) return false;
  const today = lisbonNow(opts.now ?? new Date()).date;
  return (
    (opts.weekly ?? []).some((s) => s.is_active !== false) ||
    (opts.dated ?? []).some((d) => d.is_active !== false && d.event_date >= today)
  );
}
