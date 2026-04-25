import { useEffect, useState } from 'react';
import { useClockTick } from './useClockTick';

/** Each slot defines the days of the week (0=Sun..6=Sat) and the
 *  start/end in minutes from midnight. */
interface ScheduleSlot {
  days: number[];
  startMin: number;
  endMin: number;
}

const CANTINHO_SLOTS: ScheduleSlot[] = [
  { days: [0, 1, 2, 3, 4, 5], startMin: 1110, endMin: 1170 }, // Sun-Fri 18:30-19:30
  { days: [6], startMin: 660, endMin: 780 },                   // Sat 11:00-13:00
  { days: [6], startMin: 1110, endMin: 1170 },                 // Sat 18:30-19:30
];

/** All unique boundaries where the live state can change. */
const BOUNDARIES = [660, 780, 1110, 1170];

const DAY_NAMES = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

function formatSlotTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h${String(m).padStart(2, '0')}` : `${h}h`;
}

function isLiveNow(day: number, minutesNow: number): boolean {
  return CANTINHO_SLOTS.some(
    (slot) => slot.days.includes(day) && minutesNow >= slot.startMin && minutesNow < slot.endMin,
  );
}

interface NextSlot {
  deltaMinutes: number;
  label: string;
}

function findNextSlot(day: number, minutesNow: number): NextSlot {
  for (let offset = 0; offset < 7; offset++) {
    const checkDay = (day + offset) % 7;
    const slots = CANTINHO_SLOTS.filter((s) => s.days.includes(checkDay));

    for (const slot of slots.sort((a, b) => a.startMin - b.startMin)) {
      // On the current day, only consider future slots
      if (offset === 0 && slot.startMin <= minutesNow) continue;

      const deltaMinutes = offset * 24 * 60 + (slot.startMin - minutesNow);

      let dayLabel: string;
      if (offset === 0) dayLabel = 'Hoje';
      else if (offset === 1) dayLabel = 'Amanhã';
      else dayLabel = DAY_NAMES[checkDay];

      return {
        deltaMinutes,
        label: `${dayLabel}, ${formatSlotTime(slot.startMin)}`,
      };
    }
  }

  // Fallback (should never happen with a 7-day schedule)
  return { deltaMinutes: 0, label: '' };
}

export interface UseKidsScheduleReturn {
  isLive: boolean;
  countdown: { hours: number; minutes: number } | null;
  nextSlotLabel: string;
}

export function useKidsSchedule(): UseKidsScheduleReturn {
  // Re-render at schedule boundaries (efficient, no polling)
  useClockTick(BOUNDARIES);

  const now = new Date();
  const day = now.getDay();
  const minutesNow = now.getHours() * 60 + now.getMinutes();
  const live = isLiveNow(day, minutesNow);

  // Countdown state — only ticks when off-air
  const [countdownTick, setCountdownTick] = useState(0);

  useEffect(() => {
    if (live) return;
    const id = setInterval(() => setCountdownTick((t) => t + 1), 60_000);
    return () => clearInterval(id);
  }, [live]);

  // Recalculate on tick or live change
  void countdownTick; // consumed to trigger recalc

  if (live) {
    return { isLive: true, countdown: null, nextSlotLabel: '' };
  }

  const next = findNextSlot(day, minutesNow);
  const hours = Math.floor(next.deltaMinutes / 60);
  const minutes = next.deltaMinutes % 60;

  return {
    isLive: false,
    countdown: { hours, minutes },
    nextSlotLabel: next.label,
  };
}
