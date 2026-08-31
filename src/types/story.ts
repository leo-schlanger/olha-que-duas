export type StoryStatus = 'em_curso' | 'concluida' | 'pausada';

export interface Story {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  synopsis: string;
  cover_url: string;
  genre: string;
  tags: string[];
  status: StoryStatus;
  planned_episodes: number;
  total_views: number;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Episode {
  id: string;
  story_id: string;
  number: number;
  title: string;
  content: string;
  excerpt: string;
  cliffhanger: string;
  cover_url: string;
  reading_minutes: number;
  views: number;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

/** Episódio já carregado com o mínimo da história a que pertence. */
export interface EpisodeWithStory extends Episode {
  story: Pick<Story, 'id' | 'slug' | 'title' | 'planned_episodes' | 'status'>;
}

export const STORY_STATUS_LABELS: Record<StoryStatus, string> = {
  em_curso: 'Em curso',
  concluida: 'História completa',
  pausada: 'Em pausa',
};
