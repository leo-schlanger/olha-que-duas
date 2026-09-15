import { useQuery } from '@tanstack/react-query';
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase';

interface ScheduleEvent {
  id: string;
  name: string;
  description: string | null;
  icon_url: string;
}

export interface ScheduleItemRaw {
  id: string;
  event_id: string;
  day_of_week: number;
  time: string;
  end_time: string | null;
  is_all_day: boolean;
  event: ScheduleEvent | ScheduleEvent[] | null;
}

export interface GroupedSchedule {
  day: string;
  dayNumber: number;
  show: string;
  times: string[];
  endTimes: (string | null)[];
  isAllDay: boolean;
  iconUrl: string;
}

const DAYS_MAP: Record<number, string> = {
  0: 'Domingo',
  1: 'Segunda',
  2: 'Terça',
  3: 'Quarta',
  4: 'Quinta',
  5: 'Sexta',
  6: 'Sábado',
};

interface ScheduleDateRaw {
  id: string;
  event_id: string;
  event_date: string; // YYYY-MM-DD (Lisboa)
  time: string;
  end_time: string | null;
  is_all_day: boolean;
  event: ScheduleEvent | ScheduleEvent[] | null;
}

/** Data de hoje em Lisboa, "YYYY-MM-DD". */
export function lisbonToday(now: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Lisbon",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

export function addDays(date: string, days: number): string {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d + days)).toISOString().slice(0, 10);
}

/**
 * Eventos com data (emissões únicas) dos próximos 7 dias passam a linhas da
 * grelha semanal, no dia da semana em que calham. Função pura — exposta para
 * testes.
 */
export function datedRowsToWeekly(rows: ScheduleDateRaw[], today: string): ScheduleItemRaw[] {
  const end = addDays(today, 6);
  return rows
    .filter((r) => r.event_date >= today && r.event_date <= end)
    .map((r) => {
      const [y, m, d] = r.event_date.split("-").map(Number);
      return {
        id: r.id,
        event_id: r.event_id,
        day_of_week: new Date(Date.UTC(y, m - 1, d)).getUTCDay(),
        time: r.time,
        end_time: r.end_time,
        is_all_day: r.is_all_day,
        event: r.event,
      };
    });
}

// Fallback schedule for when Supabase is not configured
const fallbackSchedule: GroupedSchedule[] = [
  { day: 'Segunda', dayNumber: 1, show: 'Nutrição', times: ['12:00', '19:00'], endTimes: [null, null], isAllDay: false, iconUrl: '' },
  { day: 'Terça', dayNumber: 2, show: 'Motivar', times: ['12:00', '19:00'], endTimes: [null, null], isAllDay: false, iconUrl: '' },
  { day: 'Quarta', dayNumber: 3, show: 'Prazer Feminino', times: ['21:00', '00:00'], endTimes: [null, null], isAllDay: false, iconUrl: '' },
  { day: 'Quinta', dayNumber: 4, show: 'Companheiros de Caminhada', times: ['12:00', '19:00'], endTimes: [null, null], isAllDay: false, iconUrl: '' },
  { day: 'Sexta', dayNumber: 5, show: 'Dizem que...', times: ['12:00', '19:00'], endTimes: [null, null], isAllDay: false, iconUrl: '' },
  { day: 'Sábado', dayNumber: 6, show: 'Olha que Duas!', times: ['11:00', '19:00', '00:00'], endTimes: [null, null, null], isAllDay: false, iconUrl: '' },
];

/**
 * Agrupa as linhas raw de `schedule` por (dia, programa), juntando os
 * múltiplos horários do mesmo programa no mesmo dia. Função pura — exposta
 * para testes.
 */
export function groupScheduleRows(rows: ScheduleItemRaw[]): GroupedSchedule[] {
  const grouped = new Map<string, GroupedSchedule>();

  for (const item of rows) {
    const event = Array.isArray(item.event) ? item.event[0] : item.event;
    if (!event) continue;

    const key = `${item.day_of_week}-${event.name}`;
    const isAllDay = item.is_all_day ?? false;
    const time = item.time.slice(0, 5); // HH:mm
    const endTime = item.end_time ? item.end_time.slice(0, 5) : null;

    if (grouped.has(key)) {
      // Evento semanal e evento com data à mesma hora: mostrar uma só vez
      if (!isAllDay && !grouped.get(key)!.times.includes(time)) {
        grouped.get(key)!.times.push(time);
        grouped.get(key)!.endTimes.push(endTime);
      }
    } else {
      grouped.set(key, {
        day: DAYS_MAP[item.day_of_week],
        dayNumber: item.day_of_week,
        show: event.name,
        times: isAllDay ? [] : [time],
        endTimes: isAllDay ? [] : [endTime],
        isAllDay,
        iconUrl: event.icon_url,
      });
    }
  }

  return Array.from(grouped.values()).sort((a, b) => a.dayNumber - b.dayNumber);
}

export function useSchedule() {
  const query = useQuery({
    queryKey: ['weekly-schedule'],
    queryFn: async (): Promise<GroupedSchedule[]> => {
      if (!isSupabaseConfigured()) return fallbackSchedule;
      const supabase = getSupabase();
      if (!supabase) return fallbackSchedule;

      const today = lisbonToday();
      const datedQuery = supabase
        .from('schedule_dates')
        .select(`
          id,
          event_id,
          event_date,
          time,
          end_time,
          is_all_day,
          event:events!inner(id, name, description, icon_url, is_active)
        `)
        .eq('is_active', true)
        .eq('events.is_active', true)
        .gte('event_date', today)
        .lte('event_date', addDays(today, 6));

      const { data, error: fetchError } = await supabase
        .from('schedule')
        .select(`
          id,
          event_id,
          day_of_week,
          time,
          end_time,
          is_all_day,
          event:events!inner(id, name, description, icon_url, is_active)
        `)
        .eq('is_active', true)
        .eq('events.is_active', true)
        .order('day_of_week', { ascending: true })
        .order('time', { ascending: true });

      if (fetchError) throw fetchError;

      // Os eventos com data são um extra: se falharem, a grelha semanal aparece na mesma
      const { data: datedData, error: datedError } = await datedQuery;
      if (datedError) console.warn('schedule_dates:', datedError.message);
      const dated = datedRowsToWeekly((datedData ?? []) as ScheduleDateRaw[], today);

      const rows = [...((data ?? []) as ScheduleItemRaw[]), ...dated];
      if (rows.length === 0) return fallbackSchedule;

      return groupScheduleRows(rows);
    },
    staleTime: 1000 * 60 * 30, // 30 minutos — programação raramente muda
    placeholderData: fallbackSchedule,
  });

  return {
    schedule: query.data ?? fallbackSchedule,
    loading: query.isLoading,
    error: query.error instanceof Error ? query.error.message : null,
  };
}
