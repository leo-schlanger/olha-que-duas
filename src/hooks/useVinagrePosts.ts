import { useQuery } from "@tanstack/react-query";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { parseVinagrePost, type VinagrePost } from "@/types/vinagre";

const liveFilter = () =>
  `published_at.is.null,published_at.lte.${new Date().toISOString()}`;

export function useVinagrePosts() {
  return useQuery({
    queryKey: ["vinagre-posts"],
    queryFn: async (): Promise<VinagrePost[]> => {
      const supabase = getSupabase();
      if (!supabase) return [];
      const { data, error } = await supabase
        .from("vinagre_posts")
        .select("*")
        .eq("is_published", true)
        .or(liveFilter())
        .order("published_at", { ascending: false });
      if (error) throw error;
      return (data ?? [])
        .map(parseVinagrePost)
        .filter((post): post is VinagrePost => post !== null);
    },
    enabled: isSupabaseConfigured(),
    staleTime: 60_000,
  });
}

export function useVinagrePost(slug: string) {
  return useQuery({
    queryKey: ["vinagre-post", slug],
    queryFn: async (): Promise<VinagrePost | null> => {
      const supabase = getSupabase();
      if (!supabase || !slug) return null;
      const { data, error } = await supabase
        .from("vinagre_posts")
        .select("*")
        .eq("slug", slug)
        .eq("is_published", true)
        .or(liveFilter())
        .maybeSingle();
      if (error) throw error;
      return parseVinagrePost(data);
    },
    enabled: isSupabaseConfigured() && slug.length > 0,
    staleTime: 60_000,
  });
}
