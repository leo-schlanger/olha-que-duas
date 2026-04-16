import { useQuery } from '@tanstack/react-query';
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase';

interface ScheduleEvent {
  id: string;
  name: string;
  description: string | null;
  icon_url: string;
}

interface ScheduleItemRaw {
  id: string;
  event_id: string;
  day_of_week: number;
  time: string;
  event: ScheduleEvent | ScheduleEvent[] | null;
}

export interface GroupedSchedule {
  day: string;
  dayNumber: number;
  show: string;
  times: string[];
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

// Fallback schedule for when Supabase is not configured
const fallbackSchedule: GroupedSchedule[] = [
  { day: 'Segunda', dayNumber: 1, show: 'Nutrição', times: ['12:00', '19:00'], iconUrl: '' },
  { day: 'Terça', dayNumber: 2, show: 'Motivar', times: ['12:00', '19:00'], iconUrl: '' },
  { day: 'Quarta', dayNumber: 3, show: 'Prazer Feminino', times: ['21:00', '00:00'], iconUrl: '' },
  { day: 'Quinta', dayNumber: 4, show: 'Companheiros de Caminhada', times: ['12:00', '19:00'], iconUrl: '' },
  { day: 'Sexta', dayNumber: 5, show: 'Dizem que...', times: ['12:00', '19:00'], iconUrl: '' },
  { day: 'Sábado', dayNumber: 6, show: 'Olha que Duas!', times: ['11:00', '19:00', '00:00'], iconUrl: '' },
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
    const time = item.time.slice(0, 5); // HH:mm

    if (grouped.has(key)) {
      grouped.get(key)!.times.push(time);
    } else {
      grouped.set(key, {
        day: DAYS_MAP[item.day_of_week],
        dayNumber: item.day_of_week,
        show: event.name,
        times: [time],
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

      const { data, error: fetchError } = await supabase
        .from('schedule')
        .select(`
          id,
          event_id,
          day_of_week,
          time,
          event:events!inner(id, name, description, icon_url, is_active)
        `)
        .eq('is_active', true)
        .eq('events.is_active', true)
        .order('day_of_week', { ascending: true })
        .order('time', { ascending: true });

      if (fetchError) throw fetchError;
      if (!data || data.length === 0) return fallbackSchedule;

      return groupScheduleRows(data as ScheduleItemRaw[]);
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
