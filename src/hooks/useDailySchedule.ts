import { useQuery } from '@tanstack/react-query';
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase';

export interface DailySlot {
  time: string;
  name: string;
  genres?: string;
  duration?: string;
  iconUrl?: string;
  isAllDay?: boolean;
}

export interface DailyPeriod {
  period: string;
  label: string;
  range: string;
  slots: DailySlot[];
}

/**
 * Parse "07H - 12H" → { start: 420, end: 720 } (minutos desde a meia-noite).
 * Devolve null se a string não bater com o formato esperado.
 */
export function parsePeriodRange(range: string): { start: number; end: number } | null {
  const match = range.match(/^\s*(\d{1,2})\s*[Hh]\s*-\s*(\d{1,2})\s*[Hh]\s*$/);
  if (!match) return null;
  const start = parseInt(match[1], 10) * 60;
  let end = parseInt(match[2], 10) * 60;
  // 00H no fim significa fim do dia (1440), não 0
  if (end === 0) end = 24 * 60;
  return { start, end };
}

/**
 * Devolve a key do período actual com base no `time_range` de cada período.
 * Se nenhum período match, devolve o primeiro período disponível (fallback).
 * Lida com períodos que cruzam a meia-noite (ex: madrugada 00H-07H — start 0).
 */
export function getCurrentPeriodFromSchedule(
  periods: DailyPeriod[] | undefined,
  now: Date = new Date(),
): string {
  if (!periods || periods.length === 0) return 'manha';
  const minutesNow = now.getHours() * 60 + now.getMinutes();
  for (const p of periods) {
    const range = parsePeriodRange(p.range);
    if (!range) continue;
    if (minutesNow >= range.start && minutesNow < range.end) return p.period;
  }
  return periods[0].period;
}

/**
 * Devolve as fronteiras de início de cada período (em minutos desde
 * meia-noite). Útil para `useClockTick` agendar re-renders nas viragens.
 */
export function getPeriodBoundaries(periods: DailyPeriod[] | undefined): number[] {
  if (!periods || periods.length === 0) return [];
  const out: number[] = [];
  for (const p of periods) {
    const range = parsePeriodRange(p.range);
    if (range) out.push(range.start);
  }
  return out;
}

/** Parse "07h" → 420, "10h30" → 630 (minutes from midnight) */
export function parseSlotTime(t: string): number {
  const match = t.match(/^(\d{1,2})h(\d{2})?$/);
  if (!match) return 0;
  return parseInt(match[1]) * 60 + (match[2] ? parseInt(match[2]) : 0);
}

/** Format a duration in minutes as e.g. "2h", "1h30" */
export function formatDuration(minutes: number): string {
  if (minutes <= 0) return '';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}min`;
  return m > 0 ? `${h}h${String(m).padStart(2, '0')}` : `${h}h`;
}

/** Calculate duration for each slot based on the next slot or period end time */
export function addDurations(periods: DailyPeriod[]): DailyPeriod[] {
  return periods.map((period) => {
    const range = parsePeriodRange(period.range);
    const rangeEnd = range ? range.end : 24 * 60;
    const slots = period.slots.map((slot, i) => {
      const start = parseSlotTime(slot.time);
      let end: number;
      if (i < period.slots.length - 1) {
        end = parseSlotTime(period.slots[i + 1].time);
      } else {
        end = rangeEnd;
      }
      // Handle wrap around midnight (e.g. 22h → 00h)
      let diff = end - start;
      if (diff <= 0) diff += 24 * 60;
      return { ...slot, duration: formatDuration(diff) };
    });
    return { ...period, slots };
  });
}

// Fallback data when Supabase is not configured
const fallbackSchedule: DailyPeriod[] = addDurations([
  {
    period: 'manha', label: 'Manhã', range: '07H - 12H',
    slots: [
      { time: '07h', name: 'Wake Up Mix', genres: 'Pop, Rock, K-Pop, Eletrónica, Lusófona' },
      { time: '09h', name: 'Hits da Manhã', genres: 'Pop, K-Pop, Lusófona' },
      { time: '10h30', name: 'Mini Break', genres: 'Pop, Indie, Lusófona' },
    ],
  },
  {
    period: 'tarde', label: 'Tarde', range: '12H - 18H',
    slots: [
      { time: '12h', name: 'Lunch Beats', genres: 'Pop, Indie, Lusófona' },
      { time: '14h', name: 'Playlist Chill & Work', genres: 'Indie, Eletrónica, Lusófona' },
      { time: '16h', name: 'Power Hour', genres: 'Pop, Rock, K-Pop, Eletrónica' },
    ],
  },
  {
    period: 'noite', label: 'Noite', range: '18H - 00H',
    slots: [
      { time: '18h', name: 'Sunset Mix', genres: 'Pop, Indie, Eletrónica, Lusófona' },
      { time: '20h', name: 'Especial do Dia', genres: 'TODOS os géneros' },
      { time: '21h', name: 'Canal Infantil', genres: 'Músicas infantis e brincadeiras' },
      { time: '22h', name: 'Night Flow', genres: 'Indie, Eletrónica, Lusófona' },
    ],
  },
  {
    period: 'madrugada', label: 'Madrugada', range: '00H - 07H',
    slots: [
      { time: '00h', name: 'Midnight Session', genres: 'Eletrónica, Indie, Lusófona' },
      { time: '03h', name: 'Relax Mode', genres: 'Eletrónica, Indie, Lusófona' },
    ],
  },
]);

const PERIOD_ORDER = ['manha', 'tarde', 'noite', 'madrugada'];

export function useDailySchedule() {
  return useQuery({
    queryKey: ['daily-schedule'],
    queryFn: async (): Promise<DailyPeriod[]> => {
      const supabase = getSupabase();
      if (!isSupabaseConfigured() || !supabase) {
        return fallbackSchedule;
      }

      const { data, error } = await supabase
        .from('daily_schedule')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      if (!data || data.length === 0) return fallbackSchedule;

      // Group by period
      const grouped = new Map<string, DailyPeriod>();

      for (const row of data) {
        if (!grouped.has(row.period)) {
          grouped.set(row.period, {
            period: row.period,
            label: row.period_label,
            range: row.time_range,
            slots: [],
          });
        }
        grouped.get(row.period)!.slots.push({
          time: row.slot_time,
          name: row.slot_name,
          genres: row.genres || undefined,
        });
      }

      // Sort by predefined period order and compute durations
      const periods = PERIOD_ORDER
        .filter((p) => grouped.has(p))
        .map((p) => grouped.get(p)!);

      return addDurations(periods);
    },
    enabled: true,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
}

