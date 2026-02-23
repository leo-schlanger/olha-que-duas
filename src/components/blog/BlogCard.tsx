import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { Calendar, MapPin, ExternalLink, Newspaper } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
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
    <Link to={`/noticias/${post.slug}`}>
      <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-white border-beige-medium">
        <div className="aspect-video w-full overflow-hidden">
          {post.image_url ? (
            <img
              src={post.image_url}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
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
        </div>
        <CardContent className="p-4 sm:p-5">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Badge className={`${categoryColor} text-white text-xs`}>
              {categoryLabel}
            </Badge>
            {post.region && (
              <Badge variant="outline" className="text-xs flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {post.region}
              </Badge>
            )}
          </div>

          <h3 className="text-lg font-semibold text-charcoal mb-2 line-clamp-2 font-display">
            {post.title}
          </h3>

          {post.summary && (
            <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
              {post.summary}
            </p>
          )}

          <div className="flex items-center justify-between text-xs text-muted-foreground mt-auto pt-3 border-t border-beige-light">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {publishedDate}
            </div>
            <div className="flex items-center gap-1">
              <ExternalLink className="w-3 h-3" />
              {post.source_name}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
