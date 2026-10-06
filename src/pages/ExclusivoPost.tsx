import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, Loader2, Share2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import { Button } from "@/components/ui/button";
import { VinagrePortrait } from "@/components/exclusivo/VinagrePortrait";
import { useVinagrePost } from "@/hooks/useVinagrePosts";
import { useMetaTags } from "@/hooks/useMetaTags";
import { absoluteMediaUrl, readingMinutes, sanitizeArticleHtml } from "@/lib/articleHtml";
import { VINAGRE_COLUMN } from "@/types/vinagre";

function formatDate(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("pt-PT", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function ExclusivoPost() {
  const { slug = "" } = useParams();
  const { data: post, isLoading, isError } = useVinagrePost(slug);
  const pageUrl = `https://www.olhaqueduas.com/exclusivo/${slug}`;

  useMetaTags({
    title: post?.title ?? VINAGRE_COLUMN.navLabel,
    description: post?.excerpt || post?.title || VINAGRE_COLUMN.navLabel,
    url: pageUrl,
    image: absoluteMediaUrl(post?.cover_url ?? ""),
    type: "article",
    publishedTime: post?.published_at ?? undefined,
    author: VINAGRE_COLUMN.author,
    section: VINAGRE_COLUMN.navLabel,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  const share = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: post?.title, url });
        return;
      } catch {
        return;
      }
    }
    await navigator.clipboard.writeText(url);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main id="main-content" className="pt-24 md:pt-28">
        <article className="container mx-auto px-4 sm:px-6 pb-16">
          <div className="mx-auto max-w-3xl">
            <Link
              to="/exclusivo"
              className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-[#7a5b16] hover:text-[#5c4310]"
            >
              <ArrowLeft className="h-4 w-4" />
              Exclusivo Olha que Duas
            </Link>

            {isLoading && (
              <div className="flex justify-center py-24">
                <Loader2 className="h-6 w-6 animate-spin text-[#7a5b16]" />
                <span className="sr-only">A carregar notícia</span>
              </div>
            )}

            {(isError || (!isLoading && !post)) && (
              <div className="rounded-3xl border border-border bg-cream px-6 py-16 text-center">
                <p className="font-display text-3xl text-charcoal">Esta notícia não está disponível.</p>
                <Button asChild className="mt-6 bg-[#1c0a10] text-[#f6efe4] hover:bg-[#1c0a10]/90">
                  <Link to="/exclusivo">Ver as notícias</Link>
                </Button>
              </div>
            )}

            {post && (
              <>
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#7a5b16]">
                  Exclusivo
                </p>
                <h1 className="mt-3 font-display text-4xl leading-tight text-charcoal md:text-5xl">
                  {post.title}
                </h1>
                {post.excerpt && (
                  <p className="mt-5 max-w-2xl text-xl leading-relaxed text-charcoal/80">
                    {post.excerpt}
                  </p>
                )}

                <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-y border-[#e4c56a]/40 py-4">
                  <div className="flex items-center gap-3">
                    <VinagrePortrait size="sm" />
                    <div>
                      <p className="font-medium text-charcoal">{VINAGRE_COLUMN.author}</p>
                      <p className="text-xs uppercase tracking-[0.16em] text-[#7a5b16]">
                        {VINAGRE_COLUMN.navLabel}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    {post.published_at && (
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar className="h-4 w-4" />
                        <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="h-4 w-4" />
                      {readingMinutes(post.content)} min
                    </span>
                    <Button type="button" variant="outline" size="sm" onClick={share} className="gap-2">
                      <Share2 className="h-4 w-4" />
                      Partilhar
                    </Button>
                  </div>
                </div>

                {post.cover_url && (
                  <img
                    src={post.cover_url}
                    alt={post.title}
                    className="mt-8 w-full rounded-3xl object-cover"
                  />
                )}

                <div
                  className="vinagre-article mt-12"
                  dangerouslySetInnerHTML={{ __html: sanitizeArticleHtml(post.content) }}
                />
              </>
            )}
          </div>
        </article>
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}
