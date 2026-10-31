import {
  parsePeriodRange,
  parseSlotTime,
  addDurations,
  formatDuration,
} from "@/hooks/useDailySchedule";
import type { DailyPeriod, DailySlot } from "@/hooks/useDailySchedule";
import type { GroupedSchedule } from "@/hooks/useSchedule";

const DAY_NAMES = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
const DAY_MINS = 24 * 60;

/** Format minutes-from-midnight as "12h" or "12h30" */
function formatMinsToSlotTime(totalMins: number): string {
  const h = Math.floor(totalMins / 60) % 24;
  const m = totalMins % 60;
  return m
    ? `${String(h).padStart(2, '0')}h${String(m).padStart(2, '0')}`
    : `${String(h).padStart(2, '0')}h`;
}

/**
 * Merge today's special programs (weekly `schedule` + dated `schedule_dates`)
 * into the daily periods. Specials are flagged `isSpecial` (highlighted in the
 * UI and used here to detect takeovers).
 *
 * Rules:
 * - End times are normalised past midnight ("20:00–00:00" = 240 min), so a
 *   special ending at midnight still contains what it overlaps.
 * - A special fully inside a longer one is nested under it (`subPrograms`).
 * - Routine slots starting inside a weekly special are hidden (takeover).
 * - Routine slots starting inside a dated event are nested under it: dated
 *   events are overlays on the radio (they play between the routine tracks).
 */
export function mergeTodayPrograms(
  periods: DailyPeriod[],
  weekly: GroupedSchedule[],
  now: Date = new Date(),
): DailyPeriod[] {
  const todayName = DAY_NAMES[now.getDay()];
  const todayPrograms = weekly.filter((p) => p.day === todayName);
  if (todayPrograms.length === 0) return periods;

  // Keep original periods for gap-filling (find what routine was playing at a given time)
  const originalPeriods = periods;

  // Clone periods and strip routine durations (recalculated by addDurations at end)
  const merged: DailyPeriod[] = periods.map((p) => ({
    ...p,
    slots: p.slots.map(({ duration: _duration, ...rest }) => rest),
  }));

  // Check if there's an all-day event today
  const allDayProg = todayPrograms.find((p) => p.isAllDay);

  // If all-day event exists, remove routine slots from all periods
  if (allDayProg) {
    const allDaySlot: DailySlot = {
      time: '—',
      name: allDayProg.show,
      iconUrl: allDayProg.iconUrl,
      isAllDay: true,
      isSpecial: true,
    };
    for (const period of merged) {
      // Takeover: keep only specials
      period.slots = period.slots.filter((s) => s.isSpecial);
      period.slots.unshift({ ...allDaySlot });
    }
  }

  // --- 1. Collect all specials with their time ranges ---
  interface SpecialEntry {
    prog: GroupedSchedule;
    mins: number;
    endMins: number | undefined;
    durationMins: number;
    formatted: string;
    formattedEnd: string | undefined;
    duration: string | undefined;
    periodIdx: number;
  }

  const specials: SpecialEntry[] = [];

  for (const prog of todayPrograms) {
    if (prog.isAllDay) continue;

    for (let i = 0; i < prog.times.length; i++) {
      const rawTime = prog.times[i];
      const rawEndTime = prog.endTimes?.[i] ?? null;

      const [h, m] = rawTime.split(':').map(Number);
      const mins = h * 60 + (m || 0);

      const periodIdx = merged.findIndex((p) => {
        const range = parsePeriodRange(p.range);
        return range ? mins >= range.start && mins < range.end : false;
      });
      if (periodIdx < 0) continue;

      let endMins: number | undefined;
      let durationMins = 0;
      let duration: string | undefined;
      let formattedEnd: string | undefined;
      if (rawEndTime) {
        const [eh, em] = rawEndTime.split(':').map(Number);
        endMins = eh * 60 + (em || 0);
        // Ends at/after midnight: keep it after the start (00:00 → 1440)
        if (endMins <= mins) endMins += DAY_MINS;
        durationMins = endMins - mins;
        const dh = Math.floor(durationMins / 60);
        const dm = durationMins % 60;
        duration = dh === 0 ? `${dm}min` : dm > 0 ? `${dh}h${String(dm).padStart(2, '0')}` : `${dh}h`;
        formattedEnd = formatMinsToSlotTime(endMins % DAY_MINS);
      }

      specials.push({
        prog, mins, endMins, durationMins, formatted: formatMinsToSlotTime(mins),
        formattedEnd, duration, periodIdx,
      });
    }
  }

  // --- 2. Detect parent-child (nested) relationships ---
  // Sort by duration descending so longer programs are checked as parents first
  const byDuration = [...specials].sort((a, b) => b.durationMins - a.durationMins);
  const childToParent = new Map<SpecialEntry, SpecialEntry>();

  for (let i = 0; i < byDuration.length; i++) {
    const candidate = byDuration[i];
    if (candidate.endMins === undefined) continue;
    for (let j = 0; j < i; j++) {
      const parent = byDuration[j];
      if (parent.endMins === undefined) continue;
      if (childToParent.has(parent)) continue; // skip if parent is itself a child
      if (candidate.mins >= parent.mins && candidate.endMins <= parent.endMins) {
        childToParent.set(candidate, parent);
        break;
      }
    }
  }

  const toSlot = (spec: SpecialEntry): DailySlot => ({
    time: spec.formatted,
    ...(spec.formattedEnd && { endTime: spec.formattedEnd }),
    name: spec.prog.show,
    iconUrl: spec.prog.iconUrl,
    isSpecial: true,
    ...(spec.duration && { duration: spec.duration }),
  });

  // --- 3. Insert parent specials with children nested ---
  const specialsWithEnd: {
    periodIdx: number;
    startMins: number;
    endMins: number;
    slot: DailySlot;
    isDated: boolean;
  }[] = [];

  for (const spec of specials) {
    if (childToParent.has(spec)) continue; // children are attached to parent

    const target = merged[spec.periodIdx];
    const specialSlot = toSlot(spec);

    // Attach children as sub-programs
    const children = specials.filter((s) => childToParent.get(s) === spec);
    if (children.length > 0) {
      specialSlot.subPrograms = children.map(toSlot);
    }

    const isDated = !!spec.prog.isDated && spec.endMins !== undefined;

    // Replace routine slot at the same time (a dated overlay nests it instead), or add new
    const existingIdx = target.slots.findIndex(
      (s) => !s.isAllDay && parseSlotTime(s.time) === spec.mins && !(isDated && !s.isSpecial),
    );
    if (existingIdx >= 0) {
      target.slots[existingIdx] = specialSlot;
    } else {
      target.slots.push(specialSlot);
    }

    if (spec.endMins !== undefined) {
      specialsWithEnd.push({
        periodIdx: spec.periodIdx, startMins: spec.mins, endMins: spec.endMins,
        slot: specialSlot, isDated,
      });
    }
  }

  // Routine slots starting inside a special: nested under a dated overlay, hidden otherwise
  for (const period of merged) {
    period.slots = period.slots.filter((slot) => {
      if (slot.isSpecial || slot.isAllDay) return true;
      const t = parseSlotTime(slot.time);
      const overlay = specialsWithEnd.find((r) => r.isDated && t >= r.startMins && t < r.endMins);
      if (overlay) {
        const sub: DailySlot = { ...slot };
        if (slot.endTime) {
          let end = parseSlotTime(slot.endTime);
          if (end <= t) end += DAY_MINS;
          sub.duration = formatDuration(end - t);
        }
        overlay.slot.subPrograms = [...(overlay.slot.subPrograms ?? []), sub];
        return false;
      }
      return !specialsWithEnd.some((r) => t > r.startMins && t < r.endMins);
    });
  }
  for (const { slot } of specialsWithEnd) {
    slot.subPrograms?.sort((a, b) => parseSlotTime(a.time) - parseSlotTime(b.time));
  }

  // Sort all periods
  for (const period of merged) {
    period.slots.sort((a, b) => {
      if (a.isAllDay) return -1;
      if (b.isAllDay) return 1;
      return parseSlotTime(a.time) - parseSlotTime(b.time);
    });
  }

  // Gap-fill: after each special with end_time, insert a "resume" slot if there's dead air
  for (const { periodIdx, endMins } of specialsWithEnd) {
    // Find the period where the special ENDS (may differ from where it starts)
    let targetIdx = periodIdx;
    const startRange = parsePeriodRange(merged[periodIdx].range);
    if (startRange && endMins >= startRange.end) {
      // Special crosses into the next period — find which one
      const crossIdx = merged.findIndex((p) => {
        const r = parsePeriodRange(p.range);
        return r ? endMins >= r.start && endMins < r.end : false;
      });
      if (crossIdx >= 0) targetIdx = crossIdx;
      else continue; // endMins doesn't fall in any period (e.g. ends at midnight)
    }

    const target = merged[targetIdx];
    const range = parsePeriodRange(target.range);
    if (!range) continue;

    // Check if there's already a slot at endMins
    const alreadyExists = target.slots.some((s) => !s.isAllDay && parseSlotTime(s.time) === endMins);
    if (alreadyExists) continue;

    // Find the next slot after endMins
    const nextSlot = target.slots.find((s) => !s.isAllDay && parseSlotTime(s.time) > endMins);
    const nextStart = nextSlot ? parseSlotTime(nextSlot.time) : range.end;

    // Only insert if there's actually a gap
    if (endMins >= nextStart) continue;

    // Determine what should resume
    let resumeSlot: DailySlot;
    if (allDayProg) {
      resumeSlot = {
        time: formatMinsToSlotTime(endMins),
        name: allDayProg.show,
        iconUrl: allDayProg.iconUrl,
        isSpecial: true,
      };
    } else {
      // Routine slot actually on air at `endMins`. Routine slots may cross
      // period boundaries (e.g. "Ritmo da Cidade" 17h-19h lives in Tarde), so
      // search ALL slots for an explicit interval covering `endMins`.
      const allSlots = originalPeriods.flatMap((p) => p.slots);
      const covers = (s: DailySlot): boolean => {
        if (!s.endTime) return false;
        const start = parseSlotTime(s.time);
        let end = parseSlotTime(s.endTime);
        if (end <= start) end += DAY_MINS; // ends at/after midnight (e.g. 23h-00h)
        return endMins >= start && endMins < end;
      };
      const origSlot =
        allSlots.find(covers) ??
        // Fallback (no explicit end): last slot starting up to `endMins`.
        [...allSlots]
          .filter((s) => parseSlotTime(s.time) <= endMins)
          .sort((a, b) => parseSlotTime(a.time) - parseSlotTime(b.time))
          .pop();

      resumeSlot = {
        time: formatMinsToSlotTime(endMins),
        name: origSlot?.name ?? 'Programação',
        ...(origSlot?.genres && { genres: origSlot.genres }),
        ...(origSlot?.iconUrl && { iconUrl: origSlot.iconUrl }),
      };
    }

    target.slots.push(resumeSlot);

    // Re-sort after insertion
    target.slots.sort((a, b) => {
      if (a.isAllDay) return -1;
      if (b.isAllDay) return 1;
      return parseSlotTime(a.time) - parseSlotTime(b.time);
    });
  }

  return addDurations(merged);
}
