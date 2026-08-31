import { useQuery } from '@tanstack/react-query';
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase';
import type { Episode, Story } from '@/types/story';

/**
 * Só é servido o que já está publicado e cuja data já chegou. O mesmo
 * filtro existe no RLS, mas repeti-lo aqui mantém a intenção visível e
 * evita depender de uma política poder mudar sem o site saber.
 *
 * O ramo `is.null` cobre linhas criadas à mão por SQL, onde a data pode
 * não ter sido preenchida — o painel preenche-a sempre.
 */
const liveFilter = () => `published_at.is.null,published_at.lte.${new Date().toISOString()}`;

/** Catálogo: todas as histórias visíveis, mais recente primeiro. */
export function useStories() {
  return useQuery({
    queryKey: ['stories'],
    queryFn: async (): Promise<Story[]> => {
      const supabase = getSupabase();
      if (!supabase) return [];

      const { data, error } = await supabase
        .from('stories')
        .select('*')
        .eq('is_published', true)
        .or(liveFilter())
        .order('published_at', { ascending: false });

      if (error) throw error;
      return (data || []) as Story[];
    },
    enabled: isSupabaseConfigured(),
    staleTime: 1000 * 60 * 10,
  });
}

/** Uma história com a lista dos episódios já disponíveis. */
export function useStory(slug: string) {
  return useQuery({
    queryKey: ['story', slug],
    queryFn: async (): Promise<{ story: Story; episodes: Episode[] } | null> => {
      const supabase = getSupabase();
      if (!supabase) return null;

      const { data: story, error: storyError } = await supabase
        .from('stories')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .or(liveFilter())
        .maybeSingle();

      if (storyError) throw storyError;
      if (!story) return null;

      const { data: episodes, error: episodesError } = await supabase
        .from('story_episodes')
        .select('*')
        .eq('story_id', story.id)
        .eq('is_published', true)
        .or(liveFilter())
        .order('number', { ascending: true });

      if (episodesError) throw episodesError;

      return {
        story: story as Story,
        episodes: (episodes || []) as Episode[],
      };
    },
    enabled: isSupabaseConfigured() && !!slug,
    staleTime: 1000 * 60 * 10,
  });
}

export interface EpisodeView {
  story: Story;
  episode: Episode;
  /** Números dos episódios já disponíveis, para a navegação. */
  available: number[];
}

/** Um episódio, com o que a página precisa para navegar. */
export function useEpisode(storySlug: string, number: number) {
  return useQuery({
    queryKey: ['episode', storySlug, number],
    queryFn: async (): Promise<EpisodeView | null> => {
      const supabase = getSupabase();
      if (!supabase) return null;

      const { data: story, error: storyError } = await supabase
        .from('stories')
        .select('*')
        .eq('slug', storySlug)
        .eq('is_published', true)
        .or(liveFilter())
        .maybeSingle();

      if (storyError) throw storyError;
      if (!story) return null;

      const { data: episodes, error: episodesError } = await supabase
        .from('story_episodes')
        .select('*')
        .eq('story_id', story.id)
        .eq('is_published', true)
        .or(liveFilter())
        .order('number', { ascending: true });

      if (episodesError) throw episodesError;

      const list = (episodes || []) as Episode[];
      const episode = list.find((e) => e.number === number);
      if (!episode) return null;

      return {
        story: story as Story,
        episode,
        available: list.map((e) => e.number),
      };
    },
    enabled: isSupabaseConfigured() && !!storySlug && number > 0,
    staleTime: 1000 * 60 * 10,
  });
}

/**
 * Regista a leitura. Falha em silêncio de propósito: um contador que
 * não grava não pode estragar a leitura de quem está na página.
 */
export async function registerEpisodeView(episodeId: string): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) return;
  try {
    await supabase.rpc('increment_episode_views', { episode_uuid: episodeId });
  } catch {
    /* contador é secundário */
  }
}
