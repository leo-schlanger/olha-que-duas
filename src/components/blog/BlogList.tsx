import { useState, useEffect } from 'react';
import { Loader2, Newspaper, AlertCircle, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BlogCard } from './BlogCard';
import { BlogFilters } from './BlogFilters';
import { useBlogPosts, useBlogCategories, useBlogRegions } from '@/hooks/useBlogPosts';
import { isSupabaseConfigured } from '@/lib/supabase';
import { Animated, AnimatedGrid } from '@/components/ui/animated';
import type { BlogFilters as BlogFiltersType } from '@/types/blog';

export function BlogList() {
  const [filters, setFilters] = useState<BlogFiltersType>({});
  const [currentPage, setCurrentPage] = useState(1);

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const { data, isLoading, error, refetch } = useBlogPosts(filters, currentPage, 12);
  const posts = data?.posts || [];
  const totalPages = data?.totalPages || 0;

  const { data: categories = [] } = useBlogCategories();
  const { data: regions = [] } = useBlogRegions();

  if (!isSupabaseConfigured()) {
    return (
      <Animated animation="fade-up" className="text-center py-20">
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-muted/50 flex items-center justify-center">
            <AlertCircle className="w-10 h-10 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-display font-semibold text-foreground mb-3">
            Blog não configurado
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            As credenciais do Supabase não estão configuradas.
            Configure as variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.
          </p>
        </div>
      </Animated>
    );
  }

  if (error) {
    return (
      <Animated animation="fade-up" className="text-center py-20">
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-red-500/10 flex items-center justify-center">
            <AlertCircle className="w-10 h-10 text-red-500" />
          </div>
          <h3 className="text-xl font-display font-semibold text-foreground mb-3">
            Erro ao carregar notícias
          </h3>
          <p className="text-muted-foreground mb-6">
            Ocorreu um erro ao carregar as notícias. Tente novamente.
          </p>
          <Button
            onClick={() => refetch()}
            variant="outline"
            className="gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Tentar novamente
          </Button>
        </div>
      </Animated>
    );
  }

  return (
    <div>
      {/* Filters */}
      <Animated animation="fade-up">
        <BlogFilters
          filters={filters}
          onFiltersChange={setFilters}
          categories={categories}
          regions={regions}
        />
      </Animated>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 rounded-2xl bg-vermelho/10 flex items-center justify-center mb-4">
            <Loader2 className="w-8 h-8 animate-spin text-vermelho" />
          </div>
          <p className="text-muted-foreground">A carregar notícias...</p>
        </div>
      ) : posts && posts.length > 0 ? (
        <>
          {/* Posts Grid with staggered animation */}
          <AnimatedGrid
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
            staggerDelay={100}
            animation="fade-up"
          >
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </AnimatedGrid>

          {/* Pagination */}
          {totalPages > 1 && (
            <Animated animation="fade-up" delay={400}>
              <div className="flex items-center justify-center gap-2 mt-12 pt-8 border-t border-border/50">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    setCurrentPage(p => Math.max(1, p - 1));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  disabled={currentPage === 1}
                  className="h-10 w-10 rounded-xl hover:bg-primary/5 hover:border-primary/30 transition-all disabled:opacity-50"
                >
                  <span className="sr-only">Anterior</span>
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <div className="hidden sm:flex items-center gap-2">
                  {Array.from({ length: totalPages }).map((_, i) => {
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
                          className={`h-10 w-10 rounded-xl transition-all ${
                            currentPage === i + 1
                              ? 'bg-vermelho hover:bg-vermelho/90 text-white shadow-lg shadow-vermelho/20'
                              : 'hover:bg-primary/5 hover:border-primary/30'
                          }`}
                        >
                          {i + 1}
                        </Button>
                      );
                    } else if (
                      (i === 1 && currentPage > 3) ||
                      (i === totalPages - 2 && currentPage < totalPages - 2)
                    ) {
                      return (
                        <span key={i} className="text-muted-foreground px-1">
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}
                </div>

                <div className="flex sm:hidden items-center gap-2 px-4">
                  <span className="text-sm text-muted-foreground">
                    Página <span className="font-semibold text-foreground">{currentPage}</span> de{' '}
                    <span className="font-semibold text-foreground">{totalPages}</span>
                  </span>
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    setCurrentPage(p => Math.min(totalPages, p + 1));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  disabled={currentPage === totalPages}
                  className="h-10 w-10 rounded-xl hover:bg-primary/5 hover:border-primary/30 transition-all disabled:opacity-50"
                >
                  <span className="sr-only">Próxima</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </Animated>
          )}
        </>
      ) : (
        <Animated animation="fade-up" className="text-center py-20">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-muted/50 flex items-center justify-center">
              <Newspaper className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-display font-semibold text-foreground mb-3">
              Nenhuma notícia encontrada
            </h3>
            <p className="text-muted-foreground">
              {filters.category || filters.region || filters.search
                ? 'Não há notícias com os filtros selecionados.'
                : 'Ainda não há notícias publicadas.'}
            </p>
            {(filters.category || filters.region || filters.search) && (
              <Button
                variant="outline"
                className="mt-6"
                onClick={() => setFilters({})}
              >
                Limpar filtros
              </Button>
            )}
          </div>
        </Animated>
      )}
    </div>
  );
}
