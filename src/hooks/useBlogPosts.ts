import { useQuery } from '@tanstack/react-query';
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase';
import type { BlogPost, BlogFilters } from '@/types/blog';

export function useBlogPosts(filters: BlogFilters = {}, page = 1, limit = 12) {
  return useQuery({
    queryKey: ['blog-posts', filters, page, limit],
    queryFn: async (): Promise<{ posts: BlogPost[], totalPages: number }> => {
      const supabase = getSupabase();
      if (!isSupabaseConfigured() || !supabase) {
        return { posts: [], totalPages: 0 };
      }

      // Obter o count total para a paginação
      let countQuery = supabase
        .from('blog_posts')
        .select('*', { count: 'exact', head: true })
        .eq('is_published', true);

      if (filters.category) {
        countQuery = countQuery.eq('category', filters.category);
      }
      if (filters.region) {
        countQuery = countQuery.ilike('region', filters.region);
      }
      if (filters.search) {
        countQuery = countQuery.or(`title.ilike.%${filters.search}%,summary.ilike.%${filters.search}%`);
      }

      const { count, error: countError } = await countQuery;

      if (countError) {

        throw countError;
      }

      const totalItems = count || 0;
      const totalPages = Math.ceil(totalItems / limit);

      // Calcular o range
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      // Obter os dados paginados
      let query = supabase
        .from('blog_posts')
        .select('*')
        .eq('is_published', true)
        .order('published_at', { ascending: false })
        .range(from, to);

      if (filters.category) {
        query = query.eq('category', filters.category);
      }

      if (filters.region) {
        query = query.ilike('region', filters.region);
      }

      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,summary.ilike.%${filters.search}%`);
      }

      const { data, error } = await query;

      if (error) {

        throw error;
      }

      return {
        posts: data as BlogPost[],
        totalPages,
      };
    },
    enabled: isSupabaseConfigured(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useBlogPost(slug: string) {
  return useQuery({
    queryKey: ['blog-post', slug],
    queryFn: async (): Promise<BlogPost | null> => {
      const supabase = getSupabase();
      if (!isSupabaseConfigured() || !supabase) {
        return null;
      }

      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // Not found
        }

        throw error;
      }

      return data;
    },
    enabled: isSupabaseConfigured() && !!slug,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useBlogCategories() {
  return useQuery({
    queryKey: ['blog-categories'],
    queryFn: async (): Promise<string[]> => {
      const supabase = getSupabase();
      if (!isSupabaseConfigured() || !supabase) {
        return [];
      }

      const { data, error } = await supabase
        .from('blog_posts')
        .select('category')
        .eq('is_published', true);

      if (error) {

        throw error;
      }

      const categories = [...new Set(data?.map(d => d.category) || [])];
      return categories.filter(Boolean);
    },
    enabled: isSupabaseConfigured(),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

export function useBlogRegions() {
  return useQuery({
    queryKey: ['blog-regions'],
    queryFn: async (): Promise<string[]> => {
      const supabase = getSupabase();
      if (!isSupabaseConfigured() || !supabase) {
        return [];
      }

      const { data, error } = await supabase
        .from('blog_posts')
        .select('region')
        .eq('is_published', true);

      if (error) {

        throw error;
      }

      const rawRegions = data?.map(d => d.region?.trim()).filter(Boolean) || [];
      const normalizedMap = new Map<string, string>();

      rawRegions.forEach(region => {
        const lower = region.toLowerCase();
        if (!normalizedMap.has(lower)) {
          // Capitalize first letter for display
          const display = region.charAt(0).toUpperCase() + lower.slice(1);
          normalizedMap.set(lower, display);
        }
      });

      return Array.from(normalizedMap.values()).sort();
    },
    enabled: isSupabaseConfigured(),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}
