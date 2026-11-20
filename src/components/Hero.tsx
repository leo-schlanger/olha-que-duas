import { Link } from "react-router-dom";
import { Play } from "lucide-react";
import fotoJuntas from "@/assets/olha-que-duas-foto.jpg";
import { SeasonalHeroSlot, useSeasonalHeroImage } from "@/components/seasonal";
import { EXCLUSIVO_HUB } from "@/types/exclusivo";

const HERO_ALT = "Alexandra Serra e Marluce Revorêdo, as vozes do Olha que Duas";
// Rendered width of the photo box: full column on phones (max-w-md from sm), half the grid from lg.
const HERO_SIZES = "(min-width: 1280px) 560px, (min-width: 1024px) 45vw, (min-width: 640px) 448px, calc(100vw - 2rem)";

/**
 * «Ouvir a rádio agora»: scroll to the player and ask it to play in the same
 * click (user gesture, so the browser allows audio). The request is also left
 * pending (`window.__oqdPlayPending`, a timestamp) so a player whose lazy chunk
 * arrives after the click still starts (qa 20/11: the event was lost at 1 s).
 */
export function listenNow(event?: { preventDefault(): void }) {
  event?.preventDefault();
  window.__oqdPlayPending = Date.now();
  document.getElementById("radio")?.scrollIntoView({ behavior: "smooth", block: "start" });
  window.dispatchEvent(new CustomEvent("oqd:play"));
}

/**
 * Home hero (20/11/2026): says what OQD is (an online radio), one main action
 * (listen now) and one secondary link (the Programas). Text first on phones,
 * photo below. `.hero-inner` is the hook the seasonal themes use (season.css).
 */
const Hero = () => {
  const seasonalPhoto = useSeasonalHeroImage();

  return (
    <section id="inicio" className="relative overflow-hidden bg-hero-gradient">
      {/* Seasonal scene (Natal: night, snowy hill), self-expiring */}
      <SeasonalHeroSlot />

      <div className="container relative z-10 mx-auto px-4 sm:px-6">
        <div className="hero-inner mx-auto grid max-w-6xl grid-cols-1 items-start gap-10 pb-14 pt-28 md:pb-20 md:pt-36 lg:grid-cols-2 lg:gap-16 lg:pt-40">
          {/* items-start: the web-font swap re-wraps the H1; centred, the whole column jumped (CLS) */}
          <div className="min-w-0 text-charcoal lg:pt-6">
            <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-vermelho-forte">
              <span className="h-2.5 w-2.5 rounded-full bg-green-600" aria-hidden="true" />
              Ao vivo agora
            </p>
            <h1 className="mt-4 font-display text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
              <span className="text-vermelho-forte">Olha que Duas,</span> rádio online 24 horas com música, programas e
              histórias
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-charcoal/85">
              Música, conversas e programas feitos com afeto, de Portugal para o mundo. Carregue no play e ouça já, sem
              registo.
            </p>

            <a
              href="#radio"
              onClick={listenNow}
              className="hero-listen group mt-7 flex w-full max-w-md items-center gap-4 rounded-3xl bg-white p-3 pr-5 text-left shadow-lg ring-1 ring-black/5 transition-shadow hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vermelho-forte"
            >
              <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-vermelho-forte text-white transition-transform group-hover:scale-105">
                <Play className="ml-1 h-7 w-7" fill="currentColor" aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-bold uppercase tracking-wider text-[#166534]">No ar · 24 horas</span>
                <span className="block text-xl font-bold text-[#2b1a12]">Ouvir a rádio agora</span>
                <span className="block text-base text-[#5c4f45]">Música, programas e histórias</span>
              </span>
            </a>

            <Link
              to={EXCLUSIVO_HUB.path}
              className="mt-5 inline-block text-lg font-semibold text-vermelho-forte underline underline-offset-4 hover:no-underline"
            >
              Ou veja os nossos programas →
            </Link>
          </div>

          <div className="mx-auto w-full min-w-0 max-w-md lg:max-w-none">
            <div className="overflow-hidden rounded-3xl shadow-2xl shadow-black/20">
              {seasonalPhoto ? (
                <picture>
                  <source type="image/webp" srcSet={seasonalPhoto.webpSrcSet} sizes={HERO_SIZES} />
                  <img
                    src={seasonalPhoto.src}
                    alt={HERO_ALT}
                    width={seasonalPhoto.width}
                    height={seasonalPhoto.height}
                    className="aspect-[5/4] w-full object-cover lg:aspect-[4/5]"
                    style={{ objectPosition: seasonalPhoto.objectPosition }}
                    loading="eager"
                    fetchPriority="high"
                  />
                </picture>
              ) : (
                <img
                  src={fotoJuntas}
                  alt={HERO_ALT}
                  width={1024}
                  height={1536}
                  className="aspect-[5/4] w-full object-cover object-[50%_30%] lg:aspect-[4/5]"
                  loading="eager"
                  fetchPriority="high"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
