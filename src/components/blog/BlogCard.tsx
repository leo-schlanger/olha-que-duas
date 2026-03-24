import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { Calendar, MapPin, ExternalLink, Newspaper, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { BlogPost } from '@/types/blog';
import { CATEGORY_LABELS, CATEGORY_COLORS } from '@/types/blog';

interface BlogCardProps {
  post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
  const categoryLabel = CATEGORY_LABELS[post.category] || post.category;
  const categoryColor = CATEGORY_COLORS[post.category] || 'bg-gray-500';

  const publishedDate = post.published_at
    ? format(new Date(post.published_at), "d 'de' MMMM, yyyy", { locale: pt })
    : null;

  return (
    <Link to={`/noticias/${post.slug}`} className="group block h-full">
      <article className="h-full rounded-2xl overflow-hidden transition-all duration-500 bg-card border border-border/50 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 card-3d">
        {/* Image container */}
        <div className="aspect-video w-full overflow-hidden relative">
          {post.image_url ? (
            <img
              src={post.image_url}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.parentElement?.classList.add('bg-gradient-to-br', 'from-beige-warm', 'to-beige-medium');
                const placeholder = document.createElement('div');
                placeholder.className = 'w-full h-full flex items-center justify-center';
                placeholder.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-charcoal/30"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6Z"/></svg>';
                target.parentElement?.appendChild(placeholder);
              }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-beige-warm to-beige-medium flex items-center justify-center">
              <Newspaper className="w-12 h-12 text-charcoal/30" />
            </div>
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Category badge - positioned on image */}
          <div className="absolute top-4 left-4">
            <Badge className={`${categoryColor} text-white text-xs shadow-lg`}>
              {categoryLabel}
            </Badge>
          </div>

          {/* Region badge */}
          {post.region && (
            <div className="absolute top-4 right-4">
              <Badge variant="secondary" className="text-xs flex items-center gap-1 bg-white/90 backdrop-blur-sm">
                <MapPin className="w-3 h-3" />
                {post.region}
              </Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 md:p-6 flex flex-col h-[calc(100%-56.25%)]">
          <h3 className="text-lg font-semibold text-foreground mb-3 line-clamp-2 font-display group-hover:text-primary transition-colors">
            {post.title}
          </h3>

          {post.summary && (
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-grow">
              {post.summary}
            </p>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t border-border/50 mt-auto">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>{publishedDate}</span>
              </div>
              {post.source_name && (
                <div className="flex items-center gap-1.5">
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span className="max-w-[100px] truncate">{post.source_name}</span>
                </div>
              )}
            </div>

            {/* Read more indicator */}
            <div className="flex items-center gap-1 text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
              <span>Ler</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>

        {/* Hover glow effect */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl bg-primary/10" />
      </article>
    </Link>
  );
}
