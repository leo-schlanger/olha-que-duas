import { useState } from 'react';
import { Loader2, Newspaper, AlertCircle } from 'lucide-react';
import { BlogCard } from './BlogCard';
import { BlogFilters } from './BlogFilters';
import { useBlogPosts, useBlogCategories, useBlogRegions } from '@/hooks/useBlogPosts';
import { isSupabaseConfigured } from '@/lib/supabase';
import type { BlogFilters as BlogFiltersType } from '@/types/blog';

export function BlogList() {
  const [filters, setFilters] = useState<BlogFiltersType>({});

  const { data: posts, isLoading, error } = useBlogPosts(filters, 50);
  const { data: categories = [] } = useBlogCategories();
  const { data: regions = [] } = useBlogRegions();

  if (!isSupabaseConfigured()) {
    return (
      <div className="text-center py-16">
        <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-charcoal mb-2">
          Blog não configurado
        </h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          As credenciais do Supabase não estão configuradas.
          Configure as variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-charcoal mb-2">
          Erro ao carregar notícias
        </h3>
        <p className="text-muted-foreground">
          Ocorreu um erro ao carregar as notícias. Tente novamente mais tarde.
        </p>
      </div>
    );
  }

  return (
    <div>
      <BlogFilters
        filters={filters}
        onFiltersChange={setFilters}
        categories={categories}
        regions={regions}
      />

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-vermelho" />
        </div>
      ) : posts && posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Newspaper className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-charcoal mb-2">
            Nenhuma notícia encontrada
          </h3>
          <p className="text-muted-foreground">
            {filters.category || filters.region || filters.search
              ? 'Não há notícias com os filtros selecionados.'
              : 'Ainda não há notícias publicadas.'}
          </p>
        </div>
      )}
    </div>
  );
}
