import { useState, useEffect } from 'react';
import { Loader2, Newspaper, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BlogCard } from './BlogCard';
import { BlogFilters } from './BlogFilters';
import { useBlogPosts, useBlogCategories, useBlogRegions } from '@/hooks/useBlogPosts';
import { isSupabaseConfigured } from '@/lib/supabase';
import type { BlogFilters as BlogFiltersType } from '@/types/blog';

export function BlogList() {
  const [filters, setFilters] = useState<BlogFiltersType>({});
  const [currentPage, setCurrentPage] = useState(1);

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const { data, isLoading, error } = useBlogPosts(filters, currentPage, 12);
  const posts = data?.posts || [];
  const totalPages = data?.totalPages || 0;

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
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  setCurrentPage(p => Math.max(1, p - 1));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                disabled={currentPage === 1}
              >
                <span className="sr-only">Anterior</span>
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <div className="flex items-center gap-2 hidden sm:flex">
                {Array.from({ length: totalPages }).map((_, i) => {
                  // Mostrar apenas páginas próximas à página atual
                  if (
                    totalPages <= 5 ||
                    i === 0 ||
                    i === totalPages - 1 ||
                    Math.abs(currentPage - 1 - i) <= 1
                  ) {
                    return (
                      <Button
                        key={i}
                        variant={currentPage === i + 1 ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          setCurrentPage(i + 1);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className={currentPage === i + 1 ? 'bg-vermelho hover:bg-vermelho/90 text-white' : ''}
                      >
                        {i + 1}
                      </Button>
                    );
                  } else if (
                    (i === 1 && currentPage > 3) ||
                    (i === totalPages - 2 && currentPage < totalPages - 2)
                  ) {
                    return <span key={i} className="text-muted-foreground">...</span>;
                  }
                  return null;
                })}
              </div>

              <div className="flex items-center gap-2 sm:hidden">
                <span className="text-sm text-muted-foreground mr-2">Pág {currentPage} de {totalPages}</span>
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  setCurrentPage(p => Math.min(totalPages, p + 1));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                disabled={currentPage === totalPages}
              >
                <span className="sr-only">Próxima</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
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
