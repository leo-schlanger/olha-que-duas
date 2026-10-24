import { useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import { PostCard, PostCardCover, PostCardText } from "@/components/exclusivo/PostCard";
import { ProgramTabs } from "@/components/exclusivo/ProgramTabs";
import { programTheme } from "@/lib/exclusivoTheme";
import { ProgramPortrait } from "@/components/exclusivo/VinagrePortrait";
import { useExclusiveProgram } from "@/hooks/useExclusivePrograms";
import { useProgramPosts, useVinagrePost } from "@/hooks/useVinagrePosts";
import { useMetaTags, getPageBreadcrumbJsonLd } from "@/hooks/useMetaTags";
import { articleShareImage } from "@/lib/articleHtml";
import { exclusivoPostPath, exclusivoProgramPath, LEGACY_PROGRAM_SLUG } from "@/lib/exclusivoPaths";
import { EXCLUSIVO_HUB } from "@/types/exclusivo";
import { formatVinagreDate } from "@/lib/vinagreDate";

export default function ExclusivoPrograma() {
  const { programSlug = "" } = useParams();
  const programQuery = useExclusiveProgram(programSlug);
  const program = programQuery.data;
  const postsQuery = useProgramPosts(program?.id);
  const legacySlug = programQuery.isSuccess && !program ? programSlug : "";
  const legacyQuery = useVinagrePost(legacySlug);

  const posts = postsQuery.data;
  const theme = programTheme(program?.slug ?? programSlug);
  const lead = posts?.[0];
  const rest = posts?.slice(1) ?? [];
  const pageUrl = `https://www.olhaqueduas.com${exclusivoProgramPath(programSlug)}`;
  const shareImage = lead
    ? articleShareImage(lead)
    : program?.cover_url || "https://www.olhaqueduas.com/exclusivo/curtas-biografias-og.jpg";

  const missing = programQuery.isSuccess && !program && legacyQuery.isSuccess && !legacyQuery.data;

  useMetaTags({
    title: program
      ? program.title.includes(program.author)
        ? program.title
        : `${program.title} — ${program.author}`
      : EXCLUSIVO_HUB.label,
    description: program?.description || program?.tagline || EXCLUSIVO_HUB.description,
    noindex: missing,
    url: pageUrl,
    image: shareImage,
    imageAlt: lead?.title || program?.title || EXCLUSIVO_HUB.label,
    imageWidth: 1200,
    imageHeight: 630,
    jsonLd: program
      ? [
          getPageBreadcrumbJsonLd(program.title, pageUrl, [
            { name: EXCLUSIVO_HUB.label, url: EXCLUSIVO_HUB.url },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "Blog",
            name: program.title,
            description: program.description,
            url: pageUrl,
            image: shareImage,
            inLanguage: "pt-PT",
            author: { "@type": "Person", name: program.author },
            publisher: { "@id": "https://www.olhaqueduas.com/#organization" },
          },
        ]
      : undefined,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [programSlug]);

  if (legacyQuery.data) {
    const target = legacyQuery.data.program?.slug || LEGACY_PROGRAM_SLUG;
    return <Navigate to={exclusivoPostPath(target, legacyQuery.data.slug)} replace />;
  }

  const loading = programQuery.isLoading || (Boolean(program) && postsQuery.isLoading) || legacyQuery.isLoading;

  return (
    <div className="min-h-screen bg-[#f6f1e8]">
      <Header />
      <main id="main-content" className="pt-24 md:pt-28">
        <section className="container mx-auto overflow-x-clip px-4 pb-20 sm:px-6">
          <ProgramTabs active={program?.slug ?? programSlug} />

          {program && (
            <header
              className="mt-6 flex flex-col gap-5 rounded-2xl p-5 sm:flex-row sm:items-center sm:gap-7 sm:p-7"
              style={{ backgroundColor: theme.soft, borderLeft: `6px solid ${theme.accent}` }}
            >
              <ProgramPortrait
                src={program.portrait_url}
                alt={program.author}
                focus={program.portrait_focus}
                size="md"
              />
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: theme.accent }}>
                  {program.author}
                </p>
                <h1 className="mt-2 font-display text-4xl leading-none text-[#1c0a10] md:text-6xl">
                  {program.title}
                </h1>
                {program.tagline && (
                  <p className="mt-3 text-lg leading-relaxed text-[#1c0a10]/80">{program.tagline}</p>
                )}
                {program.description && program.description !== program.tagline && (
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#1c0a10]/65">{program.description}</p>
                )}
                {posts && posts.length > 0 && (
                  <p className="mt-3 text-sm text-[#7a5b16]">
                    {posts.length} {posts.length === 1 ? "peça" : "peças"} · a mais recente a {formatVinagreDate(lead?.published_at ?? null)}
                  </p>
                )}
              </div>
            </header>
          )}

          {loading && (
            <div className="flex justify-center py-24 text-[#7a5b16]">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="sr-only">A carregar notícias</span>
            </div>
          )}

          {(programQuery.isError || postsQuery.isError) && (
            <p className="py-16 text-center text-[#1c0a10]/70">
              Não foi possível carregar as notícias. Tenta outra vez daqui a pouco.
            </p>
          )}

          {missing && (
            <p className="py-16 text-center text-[#1c0a10]/70">Este programa não está disponível.</p>
          )}

          {program && !postsQuery.isLoading && !postsQuery.isError && !lead && (
            <p className="py-16 text-center text-[#1c0a10]/70">A primeira notícia está a caminho.</p>
          )}

          {program && lead && (
            <div className="mt-10 grid gap-6 md:mt-12 md:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] md:items-center md:gap-10">
              <PostCardCover post={lead} eager />
              <PostCardText post={lead} showProgram={false} />
            </div>
          )}

          {program && rest.length > 0 && (
            <section className="mt-14 md:mt-16" aria-labelledby="programa-mais">
              <h2 id="programa-mais" className="border-b border-[#1c0a10]/10 pb-3 font-display text-3xl text-[#1c0a10]">
                Mais de {program.title}
              </h2>
              <div className="mt-8 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((post) => (
                  <PostCard key={post.id} post={post} showProgram={false} />
                ))}
              </div>
            </section>
          )}
        </section>
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}
