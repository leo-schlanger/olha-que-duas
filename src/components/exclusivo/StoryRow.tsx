import { Link } from "react-router-dom";
import { CoverFrame } from "@/components/exclusivo/CoverFrame";
import { formatVinagreDate } from "@/lib/vinagreDate";
import { exclusivoPostPath } from "@/lib/exclusivoPaths";
import type { VinagrePost } from "@/types/vinagre";

/** Next piece in the column. The thumb uses the same 3:4 frame as the other covers. */
export function StoryRow({ post, programSlug }: { post: VinagrePost; programSlug: string }) {
  return (
    <Link
      to={exclusivoPostPath(programSlug, post.slug)}
      className="group grid grid-cols-[6.25rem_minmax(0,1fr)] items-center gap-4 border-b border-[#1c0a10]/10 py-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:grid-cols-[8.5rem_minmax(0,1fr)] sm:gap-6 sm:py-6"
    >
      <CoverFrame src={post.cover_url} className="rounded-xl" />
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
