import { Link } from "react-router-dom";
import { useExclusivePrograms } from "@/hooks/useExclusivePrograms";
import { exclusivoProgramPath } from "@/lib/exclusivoPaths";
import { EXCLUSIVO_HUB } from "@/types/exclusivo";

// lg columns by card count, so the last row is never a lone card.
const LG_COLS: Record<number, string> = { 2: "lg:grid-cols-2", 4: "lg:grid-cols-4", 6: "lg:grid-cols-6" };

/** Even number of cards, at most 6 (two columns on phones, no orphan card). */
export function featuredCount(total: number): number {
  return Math.min(6, total - (total % 2));
}

/**
 * Home «Programas» (20/11/2026): up to six programs with a live piece (same
 * rule as /programas), cover 3:4 + title + author in text (SEO: the covers
 * carry the title only in the image). Hidden on error or with no programs.
 */
const ProgramasDestaque = () => {
  const { data, isLoading, isError } = useExclusivePrograms();
  const programs = (data ?? []).slice(0, featuredCount(data?.length ?? 0));
  if (isError || (!isLoading && programs.length === 0)) return null;
  const cols = LG_COLS[isLoading ? 6 : programs.length] ?? "lg:grid-cols-6";

  return (
    <section id="programas" aria-labelledby="programas-heading" className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-bold uppercase tracking-widest text-vermelho-forte">Programas</p>
          <h2 id="programas-heading" className="mt-2 font-display text-3xl font-semibold leading-tight text-[#2b1a12] sm:text-4xl md:text-5xl">
            Para ouvir, ler e ver quando quiser
          </h2>
          <p className="mt-3 max-w-xl text-base text-[#5c4f45] md:text-lg">
            Notícias, biografias, lendas e conversas, assinadas pela nossa equipa.
          </p>

          <ul className={`mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-5 ${cols}`}>
            {isLoading
              ? Array.from({ length: 6 }, (_, i) => (
                  <li key={i} aria-hidden="true">
                    <div className="aspect-[3/4] animate-pulse rounded-xl bg-[#efe7da]" />
                    <div className="mt-2 h-4 w-3/4 rounded bg-[#efe7da]" />
                  </li>
                ))
              : programs.map((program) => (
                  <li key={program.id} className="min-w-0">
                    <Link
                      to={exclusivoProgramPath(program.slug)}
                      className="group block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vermelho-forte"
                    >
                      <div className="aspect-[3/4] overflow-hidden rounded-xl bg-[#1c0a10] shadow-sm">
                        {program.cover_url && (
                          <img
                            src={program.cover_url}
                            alt=""
                            width={300}
                            height={400}
                            loading="lazy"
                            decoding="async"
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                          />
                        )}
                      </div>
                      <h3 className="mt-2 font-display text-lg font-semibold leading-snug text-[#2b1a12] group-hover:text-vermelho-forte">
                        {program.title}
                      </h3>
                      {program.author && <p className="text-sm text-[#5c4f45]">{program.author}</p>}
                    </Link>
                  </li>
                ))}
          </ul>

          <Link
            to={EXCLUSIVO_HUB.path}
            className="mt-8 inline-flex h-[52px] items-center justify-center rounded-full border-2 border-[#2b1a12]/20 px-7 text-lg font-bold text-[#2b1a12] transition-colors hover:border-vermelho-forte hover:text-vermelho-forte"
          >
            Ver todos os programas
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProgramasDestaque;
