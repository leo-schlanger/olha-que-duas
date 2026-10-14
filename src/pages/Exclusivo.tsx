import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import { CoverFrame } from "@/components/exclusivo/CoverFrame";
import { ProgramPortrait } from "@/components/exclusivo/VinagrePortrait";
import { useExclusivePrograms } from "@/hooks/useExclusivePrograms";
import { useMetaTags, getPageBreadcrumbJsonLd } from "@/hooks/useMetaTags";
import { exclusivoProgramPath } from "@/lib/exclusivoPaths";
import { EXCLUSIVO_HUB } from "@/types/exclusivo";

const HUB_IMAGE = "https://www.olhaqueduas.com/exclusivo/curtas-biografias-og.jpg";

export default function Exclusivo() {
  const { data: programs, isLoading, isError } = useExclusivePrograms();

  useMetaTags({
    title: EXCLUSIVO_HUB.label,
    description: EXCLUSIVO_HUB.description,
    url: EXCLUSIVO_HUB.url,
    image: HUB_IMAGE,
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

  return (
    <div className="min-h-screen bg-[#f6f1e8]">
      <Header />
      <main id="main-content" className="pt-24 md:pt-28">
        <section className="container mx-auto overflow-x-clip px-4 pb-20 sm:px-6">
          <header className="border-b border-[#1c0a10]/10 pb-8">
            <h1 className="font-display text-4xl leading-none text-[#1c0a10] md:text-6xl">
              {EXCLUSIVO_HUB.label}
            </h1>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-[#1c0a10]/75 md:text-lg">
              Os programas que só saem aqui. Escolhe um e lê as peças.
            </p>
          </header>

          {isLoading && (
            <div className="flex justify-center py-24 text-[#7a5b16]">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="sr-only">A carregar programas</span>
            </div>
          )}

          {isError && (
            <p className="py-16 text-center text-[#1c0a10]/70">
              Não foi possível carregar os programas. Tenta outra vez daqui a pouco.
            </p>
          )}

          {!isLoading && !isError && (programs?.length ?? 0) === 0 && (
            <p className="py-16 text-center text-[#1c0a10]/70">
              Os programas estão a caminho.
            </p>
          )}

          <div className="mt-10 grid max-w-3xl gap-12 sm:grid-cols-2 sm:gap-10">
            {(programs ?? []).map((program) => (
              <Link
                key={program.id}
                to={exclusivoProgramPath(program.slug)}
                className="group flex min-w-0 flex-col gap-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                {program.cover_url ? (
                  <CoverFrame src={program.cover_url} className="w-full max-w-xs" />
                ) : (
                  <div className="flex aspect-[3/4] w-full max-w-xs items-center justify-center rounded-2xl bg-[#2a1018]">
                    <ProgramPortrait
                      src={program.portrait_url}
                      alt=""
                      focus={program.portrait_focus}
                      size="lg"
                    />
                  </div>
                )}
                <div>
                  <p className="text-sm text-[#7a5b16]">{program.author}</p>
                  <h2 className="mt-2 font-display text-4xl leading-[1.08] text-[#1c0a10] transition-colors duration-200 group-hover:text-primary">
                    {program.title}
                  </h2>
                  {program.description && (
                    <p className="mt-3 text-base leading-relaxed text-[#1c0a10]/75">
                      {program.description}
                    </p>
                  )}
                  <p className="mt-4 text-sm font-semibold text-primary">Ver o programa</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}
