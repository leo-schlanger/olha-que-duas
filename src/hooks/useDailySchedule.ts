import { useQuery } from '@tanstack/react-query';
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase';

interface DailySlot {
  time: string;
  name: string;
  genres?: string;
  duration?: string;
}

interface DailyPeriod {
  period: string;
  label: string;
  range: string;
  slots: DailySlot[];
}

/** Parse "07h" → 420, "10h30" → 630 (minutes from midnight) */
function parseSlotTime(t: string): number {
  const match = t.match(/^(\d{1,2})h(\d{2})?$/);
  if (!match) return 0;
  return parseInt(match[1]) * 60 + (match[2] ? parseInt(match[2]) : 0);
}

/** Parse "12H" → 720 (minutes from midnight) */
function parseRangeHour(h: string): number {
  return parseInt(h) * 60;
}

/** Format a duration in minutes as e.g. "2h", "1h30" */
function formatDuration(minutes: number): string {
  if (minutes <= 0) return '';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}min`;
  return m > 0 ? `${h}h${String(m).padStart(2, '0')}` : `${h}h`;
}

/** Calculate duration for each slot based on the next slot or period end time */
function addDurations(periods: DailyPeriod[]): DailyPeriod[] {
  return periods.map((period) => {
    const rangeEnd = parseRangeHour(period.range.split('-')[1].trim().replace('H', ''));
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

export function getCurrentPeriod(): string {
  const hour = new Date().getHours();
  if (hour >= 7 && hour < 12) return 'manha';
  if (hour >= 12 && hour < 18) return 'tarde';
  if (hour >= 18) return 'noite';
  return 'madrugada';
}
