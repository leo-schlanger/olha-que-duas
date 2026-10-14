import { useQuery } from "@tanstack/react-query";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { parseExclusiveProgram, type ExclusiveProgram } from "@/types/exclusivo";

export function useExclusivePrograms() {
  return useQuery({
    queryKey: ["exclusive-programs"],
    queryFn: async (): Promise<ExclusiveProgram[]> => {
      const supabase = getSupabase();
      if (!supabase) return [];
      const { data, error } = await supabase
        .from("exclusive_programs")
        .select("*")
        .eq("is_published", true)
        .order("sort_order", { ascending: true })
        .order("title", { ascending: true });
      if (error) throw error;
      return (data ?? [])
        .map(parseExclusiveProgram)
        .filter((program): program is ExclusiveProgram => program !== null);
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
      return parseExclusiveProgram(data);
    },
    enabled: isSupabaseConfigured() && slug.length > 0,
    staleTime: 60_000,
  });
}
