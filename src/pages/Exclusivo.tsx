import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import { CoverFrame } from "@/components/exclusivo/CoverFrame";
import { ProgramPortrait } from "@/components/exclusivo/VinagrePortrait";
import { useExclusivePrograms } from "@/hooks/useExclusivePrograms";
import { useLatestExclusivePosts } from "@/hooks/useVinagrePosts";
import { PostCard, PostCardCover, PostCardText } from "@/components/exclusivo/PostCard";
import { ProgramTabs } from "@/components/exclusivo/ProgramTabs";
import { programTheme } from "@/lib/exclusivoTheme";
import { formatVinagreDate } from "@/lib/vinagreDate";
import { useMetaTags, getPageBreadcrumbJsonLd } from "@/hooks/useMetaTags";
import { exclusivoProgramPath } from "@/lib/exclusivoPaths";
import { EXCLUSIVO_HUB } from "@/types/exclusivo";

const HUB_IMAGE = "https://www.olhaqueduas.com/exclusivo/curtas-biografias-og.jpg";

export default function Exclusivo() {
  const { data: programs, isLoading, isError } = useExclusivePrograms();
  const latestQuery = useLatestExclusivePosts(13);
  const latest = latestQuery.data;
  const lead = latest?.[0];

  useMetaTags({
    title: EXCLUSIVO_HUB.label,
    description: EXCLUSIVO_HUB.description,
    url: EXCLUSIVO_HUB.url,
    image: lead?.og_image_url || HUB_IMAGE,
    imageAlt: EXCLUSIVO_HUB.label,
    imageWidth: 1200,
    imageHeight: 630,
    jsonLd: [
      getPageBreadcrumbJsonLd(EXCLUSIVO_HUB.label, EXCLUSIVO_HUB.url),
      {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: EXCLUSIVO_HUB.label,
        description: EXCLUSIVO_HUB.description,
        url: EXCLUSIVO_HUB.url,
        inLanguage: "pt-PT",
        publisher: { "@id": "https://www.olhaqueduas.com/#organization" },
        hasPart: (programs ?? []).map((program) => ({
          "@type": "Blog",
          name: program.title,
          url: `https://www.olhaqueduas.com${exclusivoProgramPath(program.slug)}`,
          author: { "@type": "Person", name: program.author },
        })),
      },
    ],
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const recent = latest?.slice(1, 7) ?? [];
  const lastByProgram = new Map<string, string>();
  for (const post of latest ?? []) {
    const slug = post.program?.slug;
    if (slug && post.published_at && !lastByProgram.has(slug)) lastByProgram.set(slug, post.published_at);
  }

  return (
    <div className="min-h-screen bg-[#f6f1e8]">
      <Header />
      <main id="main-content" className="pt-24 md:pt-28">
        <section className="container mx-auto overflow-x-clip px-4 pb-20 sm:px-6">
          <header className="pb-6">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#a31f17]">Só aqui</p>
            <h1 className="mt-2 font-display text-4xl leading-none text-[#1c0a10] md:text-6xl">
              {EXCLUSIVO_HUB.label}
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-[#1c0a10]/75 md:text-lg">
              Notícias, biografias, opinião e reflexão que não saem em mais lado nenhum.
            </p>
          </header>

          <ProgramTabs />

          {(isLoading || latestQuery.isLoading) && (
            <div className="flex justify-center py-24 text-[#7a5b16]">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="sr-only">A carregar os Especiais</span>
            </div>
          )}

          {(isError || latestQuery.isError) && (
            <p className="py-16 text-center text-[#1c0a10]/70">
              Não foi possível carregar os Especiais. Tenta outra vez daqui a pouco.
            </p>
          )}

          {lead && (
            <div className="mt-8 border-t border-[#1c0a10]/10 pt-8 md:mt-10">
              <h2 className="sr-only">Em destaque</h2>
              <div className="grid gap-6 md:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] md:items-center md:gap-10">
                <PostCardCover post={lead} eager />
                <div className="min-w-0">
                  <PostCardText post={lead} />
                </div>
              </div>
            </div>
          )}

          {recent.length > 0 && (
            <section className="mt-14 md:mt-16" aria-labelledby="exclusivo-ultimas">
              <div className="flex items-end justify-between gap-4 border-b border-[#1c0a10]/10 pb-3">
                <h2 id="exclusivo-ultimas" className="font-display text-3xl text-[#1c0a10] md:text-4xl">
                  Últimas
                </h2>
              </div>
              <div className="mt-8 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                {recent.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </section>
          )}

          {(programs?.length ?? 0) > 0 && (
            <section className="mt-16 md:mt-20" aria-labelledby="exclusivo-programas">
              <h2
                id="exclusivo-programas"
                className="border-b border-[#1c0a10]/10 pb-3 font-display text-3xl text-[#1c0a10] md:text-4xl"
              >
                Os programas
              </h2>
              <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {(programs ?? []).map((program) => {
                  const theme = programTheme(program.slug);
                  const last = lastByProgram.get(program.slug);
                  return (
                    <Link
                      key={program.id}
                      to={exclusivoProgramPath(program.slug)}
                      className="group flex min-w-0 gap-4 rounded-2xl border border-[#1c0a10]/10 bg-white/70 p-4 transition-shadow hover:shadow-[0_8px_30px_rgba(28,10,16,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      style={{ borderTop: `4px solid ${theme.accent}` }}
                    >
                      <div className="w-24 shrink-0 sm:w-28">
                        {program.cover_url ? (
                          <CoverFrame src={program.cover_url} className="w-full rounded-lg" />
                        ) : (
                          <ProgramPortrait src={program.portrait_url} alt="" focus={program.portrait_focus} size="md" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: theme.accent }}>
                          {program.author}
                        </p>
                        <h3 className="mt-1 font-display text-2xl leading-tight text-[#1c0a10] transition-colors group-hover:text-primary">
                          {program.title}
                        </h3>
                        {(program.tagline || program.description) && (
                          <p className="mt-1.5 line-clamp-3 text-sm leading-relaxed text-[#1c0a10]/70">
                            {program.tagline || program.description}
                          </p>
                        )}
                        {last && (
                          <p className="mt-2 text-xs text-[#7a5b16]">Última peça: {formatVinagreDate(last)}</p>
                        )}
                      </div>
                    </Link>
                  );
                })}
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
