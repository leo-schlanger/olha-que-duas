import { useQuery } from '@tanstack/react-query';
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase';
import type { BlogPost, BlogFilters } from '@/types/blog';

export function useBlogPosts(filters: BlogFilters = {}, limit = 20) {
  return useQuery({
    queryKey: ['blog-posts', filters, limit],
    queryFn: async (): Promise<BlogPost[]> => {
      const supabase = getSupabase();
      if (!isSupabaseConfigured() || !supabase) {
        return [];
      }

      let query = supabase
        .from('blog_posts')
        .select('*')
        .eq('is_published', true)
        .order('published_at', { ascending: false })
        .limit(limit);

      if (filters.category) {
        query = query.eq('category', filters.category);
      }

      if (filters.region) {
        query = query.eq('region', filters.region);
      }

      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,summary.ilike.%${filters.search}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching blog posts:', error);
        throw error;
      }

      return data || [];
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
        console.error('Error fetching blog post:', error);
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
        console.error('Error fetching categories:', error);
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
        console.error('Error fetching regions:', error);
        throw error;
      }

      const regions = [...new Set(data?.map(d => d.region) || [])];
      return regions.filter(Boolean);
    },
    enabled: isSupabaseConfigured(),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}
