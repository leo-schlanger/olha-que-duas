import { useState, useEffect } from 'react';
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

interface GroupedSchedule {
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

export function useSchedule() {
  const [schedule, setSchedule] = useState<GroupedSchedule[]>(fallbackSchedule);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSchedule() {
      if (!isSupabaseConfigured()) {
        setLoading(false);
        return;
      }

      const supabase = getSupabase();
      if (!supabase) {
        setLoading(false);
        return;
      }

      try {
        const { data, error: fetchError } = await supabase
          .from('schedule')
          .select(`
            id,
            event_id,
            day_of_week,
            time,
            event:events(id, name, description, icon_url)
          `)
          .eq('is_active', true)
          .order('day_of_week', { ascending: true })
          .order('time', { ascending: true });

        if (fetchError) throw fetchError;

        if (data && data.length > 0) {
          // Group by day and event
          const grouped = new Map<string, GroupedSchedule>();

          for (const item of data as ScheduleItemRaw[]) {
            // Handle event being array or object
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

          // Sort by day
          const sortedSchedule = Array.from(grouped.values()).sort(
            (a, b) => a.dayNumber - b.dayNumber
          );

          setSchedule(sortedSchedule);
        }
      } catch (err) {
        console.error('Error fetching schedule:', err);
        setError(err instanceof Error ? err.message : 'Error fetching schedule');
      } finally {
        setLoading(false);
      }
    }

    fetchSchedule();
  }, []);

  return { schedule, loading, error };
}
