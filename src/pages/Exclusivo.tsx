import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import { VinagrePortrait } from "@/components/exclusivo/VinagrePortrait";
import { useVinagrePosts } from "@/hooks/useVinagrePosts";
import { useMetaTags } from "@/hooks/useMetaTags";
import { VINAGRE_COLUMN } from "@/types/vinagre";

function formatDate(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("pt-PT", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function Exclusivo() {
  useMetaTags({
    title: `${VINAGRE_COLUMN.navLabel} | ${VINAGRE_COLUMN.author}`,
    description:
      "A coluna exclusiva de Eduardo Vinagre no Olha que Duas. Notícias, bastidores e o que não sai no resto da imprensa.",
    url: "https://www.olhaqueduas.com/exclusivo",
    image: "https://www.olhaqueduas.com/exclusivo/eduardo-vinagre.jpg",
    imageAlt: "Eduardo Vinagre",
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { data: posts, isLoading, isError } = useVinagrePosts();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main id="main-content" className="pt-24 md:pt-28">
        <section className="container mx-auto px-4 sm:px-6 pb-16">
          <div className="relative overflow-hidden rounded-[2rem] bg-[#1c0a10] text-[#f6efe4] px-6 py-14 md:px-12 md:py-16">
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.18]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(228,197,106,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(228,197,106,0.35) 1px, transparent 1px)",
                backgroundSize: "48px 48px",
              }}
            />
            <div className="pointer-events-none absolute -left-16 top-0 h-56 w-56 rounded-full bg-[#e4c56a]/15 blur-3xl" />
            <div className="pointer-events-none absolute -right-10 bottom-0 h-48 w-48 rounded-full bg-[#7a1d2e]/50 blur-3xl" />

            <div className="relative mx-auto flex max-w-3xl flex-col items-center text-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-[#e4c56a]">
                Olha que Duas
              </p>
              <VinagrePortrait className="mt-6" />
              <h1 className="mt-8 font-display text-5xl font-semibold leading-none text-[#f7f1e6] md:text-7xl">
                Olha que Duas{" "}
                <span className="text-[#e4c56a]">e Eu</span>
              </h1>
              <p className="mt-3 font-display text-3xl text-white md:text-4xl">
                Eduardo Vinagre
              </p>
              <p className="mt-6 max-w-xl text-sm leading-relaxed text-[#f6efe4]/75 md:text-base">
                Coluna exclusiva. O que o Eduardo Vinagre ouve, vê e escreve
                para o Olha que Duas.
              </p>
            </div>
          </div>

          <div className="mx-auto mt-12 max-w-5xl">
            <div className="mb-6 flex items-end justify-between gap-4">
              <h2 className="font-display text-3xl text-charcoal md:text-4xl">
                Notícias
              </h2>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7a5b16]">
                {VINAGRE_COLUMN.navLabel}
              </span>
            </div>

            {isLoading && (
              <div className="flex justify-center py-20 text-muted-foreground">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="sr-only">A carregar notícias</span>
              </div>
            )}

            {isError && (
              <p className="rounded-2xl border border-border bg-cream px-6 py-10 text-center text-muted-foreground">
                Não foi possível carregar as notícias. Tenta outra vez daqui a pouco.
              </p>
            )}

            {!isLoading && !isError && (posts?.length ?? 0) === 0 && (
              <p className="rounded-2xl border border-border bg-cream px-6 py-10 text-center text-muted-foreground">
                A primeira notícia está a caminho.
              </p>
            )}

            <div className="grid gap-6 md:grid-cols-2">
              {posts?.map((post) => (
                <Link
                  key={post.id}
                  to={`/exclusivo/${post.slug}`}
                  className="group overflow-hidden rounded-3xl border border-[#e4c56a]/25 bg-[#1c0a10] text-[#f6efe4] shadow-sm transition-transform duration-300 hover:-translate-y-0.5"
                >
                  {post.cover_url ? (
                    <img
                      src={post.cover_url}
                      alt=""
                      className="aspect-[16/9] w-full object-cover"
                    />
                  ) : (
                    <div className="aspect-[16/9] w-full bg-[#2a1018]" />
                  )}
                  <div className="space-y-3 p-5 md:p-6">
                    <div className="flex items-center justify-between gap-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#e4c56a]">
                      <span>Exclusivo</span>
                      <time dateTime={post.published_at ?? undefined}>
                        {formatDate(post.published_at)}
                      </time>
                    </div>
                    <h3 className="font-display text-2xl leading-tight text-white group-hover:text-[#e4c56a] md:text-3xl">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="line-clamp-3 text-sm leading-relaxed text-[#f6efe4]/75">
                        {post.excerpt}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}
