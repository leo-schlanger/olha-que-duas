import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, Loader2, Share2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import { Button } from "@/components/ui/button";
import { StoryRow } from "@/components/exclusivo/StoryRow";
import { formatVinagreDate } from "@/lib/vinagreDate";
import { VinagrePortrait } from "@/components/exclusivo/VinagrePortrait";
import { useVinagrePost, useVinagrePosts } from "@/hooks/useVinagrePosts";
import { getPageBreadcrumbJsonLd, useMetaTags } from "@/hooks/useMetaTags";
import { articleShareImage, readingMinutes, sanitizeArticleHtml } from "@/lib/articleHtml";
import { VINAGRE_COLUMN } from "@/types/vinagre";

export default function ExclusivoPost() {
  const { slug = "" } = useParams();
  const { data: post, isLoading, isError } = useVinagrePost(slug);
  const { data: posts } = useVinagrePosts();
  const others = (posts ?? []).filter((item) => item.slug !== slug).slice(0, 3);
  const pageUrl = `https://www.olhaqueduas.com/exclusivo/${slug}`;
  const shareImage = post ? articleShareImage(post) : undefined;

  useMetaTags({
    title: post?.title ?? VINAGRE_COLUMN.navLabel,
    description: post?.excerpt || post?.title || VINAGRE_COLUMN.navLabel,
    url: pageUrl,
    image: shareImage,
    imageAlt: post?.title ?? VINAGRE_COLUMN.navLabel,
    imageWidth: 1200,
    imageHeight: 630,
    type: "article",
    publishedTime: post?.published_at ?? undefined,
    modifiedTime: post?.updated_at ?? undefined,
    author: VINAGRE_COLUMN.author,
    section: VINAGRE_COLUMN.navLabel,
    jsonLd: post
      ? [
          {
            "@context": "https://schema.org",
            "@type": "NewsArticle",
            headline: post.title,
            description: post.excerpt || post.title,
            image: [articleShareImage(post)],
            datePublished: post.published_at ?? undefined,
            dateModified: post.updated_at,
            inLanguage: "pt-PT",
            articleSection: VINAGRE_COLUMN.navLabel,
            author: { "@type": "Person", name: VINAGRE_COLUMN.author },
            publisher: {
              "@type": "Organization",
              name: "Olha que Duas",
              logo: {
                "@type": "ImageObject",
                url: "https://www.olhaqueduas.com/og-image.jpg",
              },
            },
            mainEntityOfPage: pageUrl,
          },
          getPageBreadcrumbJsonLd(post.title, pageUrl, [
            { name: VINAGRE_COLUMN.navLabel, url: "https://www.olhaqueduas.com/exclusivo" },
          ]),
        ]
      : undefined,
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
    <div className="min-h-screen bg-[#f6f1e8]">
      <Header />
      <main id="main-content" className="pt-24 md:pt-28">
        <article className="container mx-auto px-4 pb-20 sm:px-6">
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
              <div className="px-6 py-16 text-center">
                <p className="font-display text-3xl text-[#1c0a10]">Esta notícia não está disponível.</p>
                <Button asChild className="mt-6 bg-[#1c0a10] text-[#f6efe4] hover:bg-[#1c0a10]/90">
                  <Link to="/exclusivo">Ver as notícias</Link>
                </Button>
              </div>
            )}

            {post && (
              <>
                <h1 className="font-display text-4xl leading-[1.08] text-[#1c0a10] md:text-6xl">
                  {post.title}
                </h1>
                {post.excerpt && (
                  <p className="mt-5 max-w-2xl text-xl leading-relaxed text-[#1c0a10]/75">
                    {post.excerpt}
                  </p>
                )}

                <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-y border-[#1c0a10]/10 py-4">
                  <div className="flex items-center gap-3">
                    <VinagrePortrait size="sm" />
                    <div>
                      <p className="font-medium text-[#1c0a10]">{VINAGRE_COLUMN.author}</p>
                      <p className="text-sm text-[#7a5b16]">{VINAGRE_COLUMN.title}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    {post.published_at && (
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar className="h-4 w-4" />
                        <time dateTime={post.published_at}>{formatVinagreDate(post.published_at)}</time>
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
                    className="mt-8 h-auto w-full max-w-full rounded-2xl bg-[#1c0a10] object-contain"
                  />
                )}

                <div
                  className="vinagre-article mt-12"
                  dangerouslySetInnerHTML={{ __html: sanitizeArticleHtml(post.content) }}
                />

                {others.length > 0 && (
                  <div className="mt-16 border-t border-[#1c0a10]/10 pt-8">
                    <h2 className="font-display text-3xl text-[#1c0a10]">Nesta coluna</h2>
                    {others.map((item) => (
                      <StoryRow key={item.id} post={item} />
                    ))}
                  </div>
                )}
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
