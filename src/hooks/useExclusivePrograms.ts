import { useQuery } from "@tanstack/react-query";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { parseExclusiveProgram, type ExclusiveProgram } from "@/types/exclusivo";
import { programsWithLivePosts } from "@/lib/exclusivoListing";
import { liveFilter } from "@/hooks/useVinagrePosts";
import type { SupabaseClient } from "@supabase/supabase-js";

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
    queryFn: async (): Promise<ExclusiveProgram[]> => {
      const supabase = getSupabase();
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
      return programsWithLivePosts(programs, live);
    },
    enabled: isSupabaseConfigured(),
    staleTime: 60_000,
  });
}

export function useExclusiveProgram(slug: string) {
  return useQuery({
    queryKey: ["exclusive-program", slug],
    queryFn: async (): Promise<ExclusiveProgram | null> => {
      const supabase = getSupabase();
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
      return programsWithLivePosts([program], await livePostPrograms(supabase, program.id))[0] ?? null;
    },
    enabled: isSupabaseConfigured() && slug.length > 0,
    staleTime: 60_000,
  });
}
