import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Radio } from "lucide-react";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { formatBroadcast, nextBroadcast, weeklyPattern, type DatedSlot, type WeeklySlot } from "@/lib/radioSchedule";

interface RadioEvent {
  is_active: boolean;
  schedule: WeeklySlot[];
  schedule_dates: DatedSlot[];
}

/** The linked event's slots (public read on events/schedule/schedule_dates). */
export function useProgramRadio(eventId: string | null | undefined) {
  return useQuery({
    queryKey: ["program-radio", eventId],
    enabled: Boolean(eventId) && isSupabaseConfigured(),
    staleTime: 5 * 60_000,
    queryFn: async (): Promise<RadioEvent | null> => {
      const supabase = getSupabase();
      if (!supabase || !eventId) return null;
      const { data, error } = await supabase
        .from("events")
        .select("is_active, schedule(day_of_week,time,is_active), schedule_dates(event_date,time,is_active)")
        .eq("id", eventId)
        .maybeSingle();
      if (error) throw error;
      return (data as RadioEvent | null) ?? null;
    },
  });
}

/**
 * «Na rádio» on a program page (plan §1.4): weekly pattern + next broadcast in
 * Lisbon time + «Ouvir em direto». Hidden without an active event or slots.
 */
export function RadioBox({ eventId, accent, kidsLink = false }: { eventId?: string | null; accent: string; kidsLink?: boolean }) {
  const { data } = useProgramRadio(eventId);
  if (!data?.is_active) return null;
  const pattern = weeklyPattern(data.schedule ?? []);
  const next = nextBroadcast(data.schedule ?? [], data.schedule_dates ?? []);
  if (!pattern && !next) return null;
  return (
    <section aria-labelledby="na-radio" className="mt-6 rounded-2xl border border-[#1c0a10]/10 bg-white p-5 sm:p-6">
      <h2 id="na-radio" className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em]" style={{ color: accent }}>
        <Radio className="h-4 w-4" aria-hidden="true" /> Na rádio
      </h2>
      {pattern && <p className="mt-2 font-display text-2xl text-[#1c0a10] first-letter:uppercase">{pattern}</p>}
      {next && (
        <p className="mt-1 text-base text-[#1c0a10]/75">
          Próxima emissão: <strong className="font-semibold text-[#1c0a10]">{formatBroadcast(next)}</strong> (hora de Lisboa)
        </p>
      )}
      <div className="mt-4 flex flex-wrap gap-3">
        <Link
          to="/#radio"
          onClick={() => {
            window.__oqdPlayPending = Date.now();
          }}
          className="inline-flex h-12 items-center rounded-full bg-vermelho-forte px-6 text-base font-bold text-white hover:bg-vermelho-forte/90"
        >
          Ouvir em direto
        </Link>
        {kidsLink && (
          <Link to="/kids" className="inline-flex h-12 items-center rounded-full border-2 border-[#1c0a10]/20 px-6 text-base font-bold text-[#1c0a10]">
            Ir à área Kids
          </Link>
        )}
      </div>
    </section>
  );
}
