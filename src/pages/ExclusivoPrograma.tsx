import { useEffect } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import { StoryRow } from "@/components/exclusivo/StoryRow";
import { ProgramPortrait } from "@/components/exclusivo/VinagrePortrait";
import { useExclusiveProgram } from "@/hooks/useExclusivePrograms";
import { useProgramPosts, useVinagrePost } from "@/hooks/useVinagrePosts";
import { useMetaTags, getPageBreadcrumbJsonLd } from "@/hooks/useMetaTags";
import { articleShareImage } from "@/lib/articleHtml";
import { exclusivoPostPath, exclusivoProgramPath, VINAGRE_PROGRAM_SLUG } from "@/lib/exclusivoPaths";
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
  const lead = posts?.[0];
  const rest = posts?.slice(1) ?? [];
  const pageUrl = `https://www.olhaqueduas.com${exclusivoProgramPath(programSlug)}`;
  const shareImage = lead
    ? articleShareImage(lead)
    : program?.cover_url || "https://www.olhaqueduas.com/exclusivo/curtas-biografias-og.jpg";

  useMetaTags({
    title: program ? `${program.title} — ${program.author}` : EXCLUSIVO_HUB.label,
    description: lead?.excerpt || program?.description || EXCLUSIVO_HUB.description,
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
    const target = legacyQuery.data.program?.slug || VINAGRE_PROGRAM_SLUG;
    return <Navigate to={exclusivoPostPath(target, legacyQuery.data.slug)} replace />;
  }

  const loading = programQuery.isLoading || (Boolean(program) && postsQuery.isLoading) || legacyQuery.isLoading;
  const missing = programQuery.isSuccess && !program && legacyQuery.isSuccess && !legacyQuery.data;

  return (
    <div className="min-h-screen bg-[#f6f1e8]">
      <Header />
      <main id="main-content" className="pt-24 md:pt-28">
        <section className="container mx-auto overflow-x-clip px-4 pb-20 sm:px-6">
          <Link
            to={EXCLUSIVO_HUB.path}
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-[#7a5b16] hover:text-[#5c4310]"
          >
            <ArrowLeft className="h-4 w-4" />
            {EXCLUSIVO_HUB.label}
          </Link>

          {program && (
            <header className="flex flex-col gap-4 border-b border-[#1c0a10]/10 pb-8 sm:flex-row sm:items-center sm:gap-6">
              <ProgramPortrait
                src={program.portrait_url}
                alt={program.author}
                focus={program.portrait_focus}
                size="md"
              />
              <div>
                <h1 className="font-display text-4xl leading-none text-[#1c0a10] md:text-6xl">
                  {program.title}
                </h1>
                <p className="mt-3 max-w-xl text-base leading-relaxed text-[#1c0a10]/75 md:text-lg">
                  {program.author}
                  {program.tagline ? `. ${program.tagline}` : ""}
                </p>
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
            <Link
              to={exclusivoPostPath(program.slug, lead.slug)}
              className="group mt-8 grid min-w-0 grid-cols-[minmax(0,1fr)] items-start gap-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary md:mt-10 md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] md:gap-12"
            >
              <div className="min-w-0 overflow-hidden rounded-2xl bg-[#1c0a10]">
                {lead.cover_url ? (
                  <img src={lead.cover_url} alt="" className="block h-auto w-full" />
                ) : (
                  <div className="aspect-[16/10] w-full bg-[#2a1018]" />
                )}
              </div>
              <div className="md:pt-2">
                {lead.published_at && (
                  <time dateTime={lead.published_at} className="text-sm text-[#7a5b16]">
                    {formatVinagreDate(lead.published_at)}
                  </time>
                )}
                <h2 className="mt-3 font-display text-4xl leading-[1.08] text-[#1c0a10] transition-colors duration-200 group-hover:text-primary md:text-5xl">
                  {lead.title}
                </h2>
                {lead.excerpt && (
                  <p className="mt-4 max-w-xl text-lg leading-relaxed text-[#1c0a10]/75">{lead.excerpt}</p>
                )}
                <p className="mt-6 text-sm font-semibold text-primary">Ler a notícia</p>
              </div>
            </Link>
          )}

          {program && rest.length > 0 && (
            <div className="mt-12 border-t border-[#1c0a10]/10 md:mt-16">
              {rest.map((post) => (
                <StoryRow key={post.id} post={post} programSlug={program.slug} />
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}
