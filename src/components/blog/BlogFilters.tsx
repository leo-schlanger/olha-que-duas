import { Search, Filter, X, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CATEGORY_LABELS, REGION_LABELS } from '@/types/blog';
import type { BlogFilters as BlogFiltersType } from '@/types/blog';

interface BlogFiltersProps {
  filters: BlogFiltersType;
  onFiltersChange: (filters: BlogFiltersType) => void;
  categories: string[];
  regions: string[];
}

export function BlogFilters({
  filters,
  onFiltersChange,
  categories,
  regions,
}: BlogFiltersProps) {
  const hasActiveFilters = filters.category || filters.region || filters.search;

  const clearFilters = () => {
    onFiltersChange({});
  };

  return (
    <div className="relative rounded-2xl bg-card/80 backdrop-blur-sm border border-border/50 p-4 md:p-6 mb-8 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4 pb-4 border-b border-border/50">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <SlidersHorizontal className="w-4 h-4 text-primary" />
        </div>
        <span className="text-sm font-medium text-foreground">Filtrar Notícias</span>
        {hasActiveFilters && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-vermelho/10 text-vermelho font-medium ml-auto">
            Filtros ativos
          </span>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Pesquisar notícias..."
            value={filters.search || ''}
            onChange={(e) =>
              onFiltersChange({ ...filters, search: e.target.value || undefined })
            }
            className="pl-10 h-11 rounded-xl bg-background/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all"
          />
        </div>

        {/* Category Filter */}
        <Select
          value={filters.category || 'all'}
          onValueChange={(value) =>
            onFiltersChange({
              ...filters,
              category: value === 'all' ? undefined : value,
            })
          }
        >
          <SelectTrigger className="w-full md:w-[200px] h-11 rounded-xl bg-background/50 border-border/50 focus:border-primary/50 focus:ring-primary/20">
            <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-border/50">
            <SelectItem value="all" className="rounded-lg">
              Todas as categorias
            </SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat} className="rounded-lg">
                {CATEGORY_LABELS[cat] || cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Region Filter */}
        <Select
          value={filters.region || 'all'}
          onValueChange={(value) =>
            onFiltersChange({
              ...filters,
              region: value === 'all' ? undefined : value,
            })
          }
        >
          <SelectTrigger className="w-full md:w-[180px] h-11 rounded-xl bg-background/50 border-border/50 focus:border-primary/50 focus:ring-primary/20">
            <SelectValue placeholder="Região" />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-border/50">
            <SelectItem value="all" className="rounded-lg">
              Todas as regiões
            </SelectItem>
            {regions.map((region) => (
              <SelectItem key={region} value={region} className="rounded-lg">
                {REGION_LABELS[region] || region}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="outline"
            onClick={clearFilters}
            className="h-11 px-4 rounded-xl border-border/50 hover:bg-vermelho/5 hover:border-vermelho/30 hover:text-vermelho transition-all"
          >
            <X className="w-4 h-4 mr-2" />
            Limpar
          </Button>
        )}
      </div>
    </div>
  );
}
