import { useEffect } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, Loader2, Share2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import { Button } from "@/components/ui/button";
import { StoryRow } from "@/components/exclusivo/StoryRow";
import { ProgramPortrait } from "@/components/exclusivo/VinagrePortrait";
import { useProgramPosts, useVinagrePost } from "@/hooks/useVinagrePosts";
import { getPageBreadcrumbJsonLd, useMetaTags } from "@/hooks/useMetaTags";
import { articleShareImage, readingMinutes, sanitizeArticleHtml } from "@/lib/articleHtml";
import { exclusivoPostPath, exclusivoProgramPath } from "@/lib/exclusivoPaths";
import { formatVinagreDate } from "@/lib/vinagreDate";
import { EXCLUSIVO_HUB } from "@/types/exclusivo";

export default function ExclusivoPost() {
  const { programSlug = "", postSlug = "" } = useParams();
  const { data: post, isLoading, isError } = useVinagrePost(postSlug);
  const program = post?.program ?? null;
  const { data: posts } = useProgramPosts(post?.program_id || undefined);
  const others = (posts ?? []).filter((item) => item.slug !== postSlug).slice(0, 3);
  const canonicalProgram = program?.slug || programSlug;
  const pageUrl = `https://www.olhaqueduas.com${exclusivoPostPath(canonicalProgram, postSlug)}`;
  const shareImage = post ? articleShareImage(post) : undefined;
  const section = program?.title || EXCLUSIVO_HUB.label;
  const author = program?.author || EXCLUSIVO_HUB.label;

  useMetaTags({
    title: post?.title ?? EXCLUSIVO_HUB.label,
    description: post?.excerpt || post?.title || EXCLUSIVO_HUB.label,
    url: pageUrl,
    image: shareImage,
    imageAlt: post?.title ?? EXCLUSIVO_HUB.label,
    imageWidth: 1200,
    imageHeight: 630,
    type: "article",
    publishedTime: post?.published_at ?? undefined,
    modifiedTime: post?.updated_at ?? undefined,
    author,
    section,
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
            articleSection: section,
            author: { "@type": "Person", name: author },
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
            { name: EXCLUSIVO_HUB.label, url: EXCLUSIVO_HUB.url },
            {
              name: section,
              url: `https://www.olhaqueduas.com${exclusivoProgramPath(canonicalProgram)}`,
            },
          ]),
        ]
      : undefined,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [programSlug, postSlug]);

  if (post && program && program.slug !== programSlug) {
    return <Navigate to={exclusivoPostPath(program.slug, post.slug)} replace />;
  }

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
              to={program ? exclusivoProgramPath(program.slug) : EXCLUSIVO_HUB.path}
              className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-[#7a5b16] hover:text-[#5c4310]"
            >
              <ArrowLeft className="h-4 w-4" />
              {program?.title || EXCLUSIVO_HUB.label}
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
                  <Link to={EXCLUSIVO_HUB.path}>Ver os programas</Link>
                </Button>
              </div>
            )}

            {post && program && (
              <>
                <h1 className="font-display text-4xl leading-[1.08] text-[#1c0a10] md:text-6xl">
                  {post.title}
                </h1>
                {post.excerpt && (
                  <p className="mt-5 max-w-2xl text-xl leading-relaxed text-[#1c0a10]/75">{post.excerpt}</p>
                )}

                <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-y border-[#1c0a10]/10 py-4">
                  <div className="flex items-center gap-3">
                    <ProgramPortrait
                      src={program.portrait_url}
                      alt=""
                      focus={program.portrait_focus}
                      size="sm"
                    />
                    <div>
                      <p className="font-medium text-[#1c0a10]">{program.author}</p>
                      <p className="text-sm text-[#7a5b16]">{program.title}</p>
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
                    <h2 className="font-display text-3xl text-[#1c0a10]">Neste programa</h2>
                    {others.map((item) => (
                      <StoryRow key={item.id} post={item} programSlug={program.slug} />
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
