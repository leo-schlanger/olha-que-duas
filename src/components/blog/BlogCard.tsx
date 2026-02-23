import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { Calendar, MapPin, ExternalLink } from 'lucide-react';
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
        {post.image_url && (
          <div className="aspect-video w-full overflow-hidden">
            <img
              src={post.image_url}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        )}
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
