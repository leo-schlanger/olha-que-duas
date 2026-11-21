import { useQuery } from "@tanstack/react-query";
import { loadSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { parseExclusiveProgram, type ExclusiveProgram } from "@/types/exclusivo";
import { EVENT_SELECT, visiblePrograms, type ProgramEvent } from "@/lib/programRadio";
import { liveFilter } from "@/hooks/useVinagrePosts";
import type { SupabaseClient } from "@supabase/supabase-js";

/** Linked radio events of these programs (public read). */
async function programEvents(supabase: SupabaseClient, programs: ExclusiveProgram[]): Promise<ProgramEvent[]> {
  const ids = [...new Set(programs.map((p) => p.event_id).filter((id): id is string => Boolean(id)))];
  if (ids.length === 0) return [];
  const { data, error } = await supabase.from("events").select(EVENT_SELECT).in("id", ids);
  if (error) return []; // radio side is a bonus: never hide the written programs
  return (data ?? []) as ProgramEvent[];
}

/** Program with what the hub cards show (pieces count, radio slots). */
export type HubProgram = ExclusiveProgram & { livePieces: number; radio?: ProgramEvent };

/** program_id of every live piece (published and already due). */
async function livePostPrograms(supabase: SupabaseClient, programId?: string) {
  let query = supabase.from("vinagre_posts").select("program_id").eq("is_published", true).or(liveFilter());
  if (programId) query = query.eq("program_id", programId).limit(1);
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as { program_id?: unknown }[];
}

export function useExclusivePrograms() {
  return useQuery({
    queryKey: ["exclusive-programs"],
    queryFn: async (): Promise<HubProgram[]> => {
      const supabase = await loadSupabase();
      if (!supabase) return [];
      const [{ data, error }, live] = await Promise.all([
        supabase
          .from("exclusive_programs")
          .select("*")
          .eq("is_published", true)
          .order("sort_order", { ascending: true })
          .order("title", { ascending: true }),
        livePostPrograms(supabase),
      ]);
      if (error) throw error;
      const programs = (data ?? [])
        .map(parseExclusiveProgram)
        .filter((program): program is ExclusiveProgram => program !== null);
      const events = await programEvents(supabase, programs);
      const ids = live.map((row) => row.program_id);
      const count = new Map<unknown, number>();
      for (const id of ids) count.set(id, (count.get(id) ?? 0) + 1);
      const byId = new Map(events.map((e) => [e.id, e]));
      // Visible = a live piece OR an active radio event (plan §2.4), same rule as sitemap/middleware.
      return visiblePrograms(programs, ids, events).map((p) => ({
        ...p,
        livePieces: count.get(p.id) ?? 0,
        radio: p.event_id ? byId.get(p.event_id) : undefined,
      }));
    },
    enabled: isSupabaseConfigured(),
    staleTime: 60_000,
  });
}

export function useExclusiveProgram(slug: string) {
  return useQuery({
    queryKey: ["exclusive-program", slug],
    queryFn: async (): Promise<ExclusiveProgram | null> => {
      const supabase = await loadSupabase();
      if (!supabase || !slug) return null;
      const { data, error } = await supabase
        .from("exclusive_programs")
        .select("*")
        .eq("slug", slug)
        .eq("is_published", true)
        .maybeSingle();
      if (error) throw error;
      const program = parseExclusiveProgram(data);
      if (!program) return null;
      // No live piece yet: the program page does not exist (noindex, «não encontrado»).
      const [live, events] = await Promise.all([livePostPrograms(supabase, program.id), programEvents(supabase, [program])]);
      return visiblePrograms([program], live.map((row) => row.program_id), events)[0] ?? null;
    },
    enabled: isSupabaseConfigured() && slug.length > 0,
    staleTime: 60_000,
  });
}
