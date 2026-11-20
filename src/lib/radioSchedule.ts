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

/** Weekly pattern: long «terça, 11:00 e 17:00» or short «Ter 11h e 17h». */
export function weeklyPattern(weekly: WeeklySlot[], short = false): string {
  const byDay = new Map<number, string[]>();
  for (const s of weekly.filter((x) => x.is_active !== false).sort((a, b) => a.time.localeCompare(b.time))) {
    const t = short ? hhmm(s.time).replace(/^0?(\d+):00$/, "$1h").replace(/^0?(\d+):(\d\d)$/, "$1h$2") : hhmm(s.time);
    byDay.set(s.day_of_week, [...(byDay.get(s.day_of_week) ?? []), t]);
  }
  const order = [1, 2, 3, 4, 5, 6, 0].filter((d) => byDay.has(d));
  const join = (xs: string[]) => (xs.length > 1 ? `${xs.slice(0, -1).join(", ")} e ${xs[xs.length - 1]}` : xs[0]);
  return order.map((d) => `${short ? DAYS_SHORT[d] : DAYS[d]}${short ? " " : ", "}${join(byDay.get(d)!)}`).join(short ? " · " : "; ");
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
