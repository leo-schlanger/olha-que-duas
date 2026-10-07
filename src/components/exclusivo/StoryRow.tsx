import { Link } from "react-router-dom";
import { formatVinagreDate } from "@/lib/vinagreDate";
import type { VinagrePost } from "@/types/vinagre";

function Cover({ url }: { url: string }) {
  if (!url) {
    return <div className="h-full w-full bg-[#2a1018]" />;
  }
  return <img src={url} alt="" className="h-full w-full object-contain" />;
}

/** Notícia seguinte na coluna. A foto fica inteira, mesmo quando é quadrada. */
export function StoryRow({ post }: { post: VinagrePost }) {
  return (
    <Link
      to={`/exclusivo/${post.slug}`}
      className="group grid grid-cols-[5.5rem_minmax(0,1fr)] items-center gap-4 border-b border-[#1c0a10]/10 py-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:grid-cols-[11rem_minmax(0,1fr)] sm:gap-6 sm:py-6"
    >
      <div className="aspect-square overflow-hidden rounded-xl bg-[#1c0a10] sm:aspect-[16/10]">
        <Cover url={post.cover_url} />
      </div>
      <div className="min-w-0">
        {post.published_at && (
          <time dateTime={post.published_at} className="text-sm text-[#7a5b16]">
            {formatVinagreDate(post.published_at)}
          </time>
        )}
        <h3 className="mt-1 font-display text-2xl leading-tight text-[#1c0a10] transition-colors duration-200 group-hover:text-primary sm:text-3xl">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[#1c0a10]/70 sm:text-base">
            {post.excerpt}
          </p>
        )}
      </div>
    </Link>
  );
}
