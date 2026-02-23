export interface BlogPost {
  id: number;
  news_id: number;
  title: string;
  slug: string;
  content: string;
  summary: string;
  image_url: string | null;
  source_url: string;
  source_name: string;
  category: string;
  region: string;
  tags: string | null;
  priority_score: number;
  status: string;
  is_published: boolean;
  published_at: string;
  created_at: string;
  updated_at: string;
  meta_description: string | null;
}

export interface BlogFilters {
  category?: string;
  region?: string;
  search?: string;
}

export const CATEGORY_LABELS: Record<string, string> = {
  politics_pt: 'Política Portugal',
  politics_br: 'Política Brasil',
  politics_world: 'Política Internacional',
  controversies: 'Controvérsias',
  conflicts: 'Conflitos',
  disasters: 'Desastres',
};

export const CATEGORY_COLORS: Record<string, string> = {
  politics_pt: 'bg-green-600',
  politics_br: 'bg-emerald-600',
  politics_world: 'bg-blue-600',
  controversies: 'bg-orange-500',
  conflicts: 'bg-red-600',
  disasters: 'bg-red-800',
};

export const REGION_LABELS: Record<string, string> = {
  Portugal: 'Portugal',
  Brasil: 'Brasil',
  Internacional: 'Internacional',
};
