import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import { StoryRow } from "@/components/exclusivo/StoryRow";
import { formatVinagreDate } from "@/lib/vinagreDate";
import { VinagrePortrait } from "@/components/exclusivo/VinagrePortrait";
import { useVinagrePosts } from "@/hooks/useVinagrePosts";
import { useMetaTags, getPageBreadcrumbJsonLd } from "@/hooks/useMetaTags";
import { articleShareImage } from "@/lib/articleHtml";
import { VINAGRE_COLUMN } from "@/types/vinagre";

const COLUMN_DESCRIPTION =
  "A coluna exclusiva de Eduardo Vinagre no Olha que Duas. Notícias, bastidores e o que não sai no resto da imprensa.";
const COLUMN_URL = "https://www.olhaqueduas.com/exclusivo";

export default function Exclusivo() {
  const { data: posts, isLoading, isError } = useVinagrePosts();
  const lead = posts?.[0];
  const rest = posts?.slice(1) ?? [];
  const shareImage = lead
    ? articleShareImage(lead)
    : "https://www.olhaqueduas.com/exclusivo/abel-dias-betty-og.jpg";

  useMetaTags({
    title: VINAGRE_COLUMN.navLabel,
    description: lead?.excerpt || COLUMN_DESCRIPTION,
    url: COLUMN_URL,
    image: shareImage,
    imageAlt: lead?.title || VINAGRE_COLUMN.navLabel,
    imageWidth: 1200,
    imageHeight: 630,
    jsonLd: [
      getPageBreadcrumbJsonLd(VINAGRE_COLUMN.navLabel, COLUMN_URL),
      {
        "@context": "https://schema.org",
        "@type": "Blog",
        name: VINAGRE_COLUMN.navLabel,
        description: COLUMN_DESCRIPTION,
        url: COLUMN_URL,
        image: shareImage,
        inLanguage: "pt-PT",
        author: { "@type": "Person", name: VINAGRE_COLUMN.author },
        publisher: { "@id": "https://www.olhaqueduas.com/#organization" },
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
          <header className="flex flex-col gap-4 border-b border-[#1c0a10]/10 pb-8 sm:flex-row sm:items-center sm:gap-6">
            <VinagrePortrait size="md" />
            <div>
              <h1 className="font-display text-4xl leading-none text-[#1c0a10] md:text-6xl">
                {VINAGRE_COLUMN.title}
              </h1>
              <p className="mt-3 max-w-xl text-base leading-relaxed text-[#1c0a10]/75 md:text-lg">
                {VINAGRE_COLUMN.author}. O que ele ouve, vê e escreve para o Olha que Duas.
              </p>
            </div>
          </header>

          {isLoading && (
            <div className="flex justify-center py-24 text-[#7a5b16]">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="sr-only">A carregar notícias</span>
            </div>
          )}

          {isError && (
            <p className="py-16 text-center text-[#1c0a10]/70">
              Não foi possível carregar as notícias. Tenta outra vez daqui a pouco.
            </p>
          )}

          {!isLoading && !isError && !lead && (
            <p className="py-16 text-center text-[#1c0a10]/70">
              A primeira notícia está a caminho.
            </p>
          )}

          {lead && (
            <Link
              to={`/exclusivo/${lead.slug}`}
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
                  <p className="mt-4 max-w-xl text-lg leading-relaxed text-[#1c0a10]/75">
                    {lead.excerpt}
                  </p>
                )}
                <p className="mt-6 text-sm font-semibold text-primary">Ler a notícia</p>
              </div>
            </Link>
          )}

          {rest.length > 0 && (
            <div className="mt-12 border-t border-[#1c0a10]/10 md:mt-16">
              {rest.map((post) => (
                <StoryRow key={post.id} post={post} />
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
