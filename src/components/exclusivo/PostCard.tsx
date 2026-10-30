import { Link } from "react-router-dom";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { exclusivoPostPath } from "@/lib/exclusivoPaths";
import { programTheme } from "@/lib/exclusivoTheme";
import { formatVinagreDate } from "@/lib/vinagreDate";
import type { VinagrePost } from "@/types/vinagre";

export function ProgramChip({ slug, className }: { slug?: string; className?: string }) {
  const theme = programTheme(slug);
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold uppercase leading-none tracking-[0.12em]",
        className,
      )}
      style={{ backgroundColor: theme.accent, color: theme.onAccent }}
    >
      {theme.label}
    </span>
  );
}

const pathOf = (post: VinagrePost) => exclusivoPostPath(post.program?.slug ?? "", post.slug);
const focusRing = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary";

/** Capa 16:10. As capas antigas noutro formato ficam inteiras (object-contain). */
export function PostCardCover({ post, eager = false }: { post: VinagrePost; eager?: boolean }) {
  return (
    <Link to={pathOf(post)} tabIndex={-1} aria-hidden className={cn("group block", focusRing)}>
      <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-[#1c0a10]">
        {post.cover_url ? (
          <img
            src={post.cover_url}
            alt=""
            loading={eager ? "eager" : "lazy"}
            className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : null}
        {post.video_url ? (
          <span className="absolute bottom-2 left-2 inline-flex items-center gap-1.5 rounded-full bg-black/70 px-2.5 py-1 text-xs font-semibold text-white">
            <Play className="h-3.5 w-3.5 fill-current" aria-hidden />
            Vídeo
          </span>
        ) : null}
      </div>
    </Link>
  );
}

export function PostCardText({
  post,
  size = "lg",
  showProgram = true,
}: {
  post: VinagrePost;
  size?: "md" | "lg";
  showProgram?: boolean;
}) {
  const Heading = size === "lg" ? "h2" : "h3";
  return (
    <Link to={pathOf(post)} className={cn("group block min-w-0", focusRing)}>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        {showProgram && <ProgramChip slug={post.program?.slug} />}
        {post.published_at && (
          <time dateTime={post.published_at} className="text-sm text-[#7a5b16]">
            {formatVinagreDate(post.published_at)}
          </time>
        )}
      </div>
      <Heading
        className={cn(
          "mt-3 font-display leading-[1.1] text-[#1c0a10] transition-colors duration-200 group-hover:text-primary",
          size === "lg" ? "text-3xl md:text-5xl" : "line-clamp-3 text-2xl",
        )}
      >
        {post.title}
      </Heading>
      {post.excerpt && (
        <p
          className={cn(
            "mt-3 leading-relaxed text-[#1c0a10]/70",
            size === "lg" ? "text-lg" : "line-clamp-2 text-[15px]",
          )}
        >
          {post.excerpt}
        </p>
      )}
      {size === "lg" && <p className="mt-5 text-sm font-semibold text-[#a31f17]">Ler a peça</p>}
    </Link>
  );
}

/** Cartão de grelha: capa, etiqueta do programa, data, título e resumo. */
export function PostCard({ post, showProgram = true }: { post: VinagrePost; showProgram?: boolean }) {
  return (
    <article className="flex min-w-0 flex-col gap-4">
      <PostCardCover post={post} />
      <PostCardText post={post} size="md" showProgram={showProgram} />
    </article>
  );
}
