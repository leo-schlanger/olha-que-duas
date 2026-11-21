import { lazy, Suspense, useEffect } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ProgramasDestaque from "@/components/ProgramasDestaque";
import SobreNos from "@/components/SobreNos";
import DedicatoriasRadio from "@/components/DedicatoriasRadio";
import Contacto from "@/components/Contacto";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import { useHashScroll } from "@/hooks/useHashScroll";
import { useMetaTags } from "@/hooks/useMetaTags";

// Lazy: RadioPlayer puxa Slider/Card Radix, vários ícones Lucide e os 2
// painéis de schedule. Adiar reduz TBT/LCP do Hero. Pré-carregamos no idle
// para que o utilizador não veja o fallback durante o scroll.
const RadioPlayer = lazy(() => import("@/components/RadioPlayer"));

const Index = () => {
  // SEO — assegura que ao voltar à home por navegação interna os metas são
  // restaurados (sem isto ficavam os da última página visitada).
  useMetaTags({
    description:
      "Olha que Duas: rádio online 24 horas com música, programas e histórias, de Alexandra Serra e Marluce Revorêdo. Ouça em direto e peça a sua dedicatória.",
    url: "https://www.olhaqueduas.com/",
    type: "website",
  });

  // Scroll automático para secções quando URL tem hash (ex: /#sobre)
  useHashScroll();

  // Pré-carrega o chunk do RadioPlayer assim que o browser fica idle,
  // sem bloquear o critical path do Hero.
  useEffect(() => {
    const preload = () => { void import("@/components/RadioPlayer"); };
    type IdleWindow = Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
    };
    const w = window as IdleWindow;
    if (typeof w.requestIdleCallback === "function") {
      w.requestIdleCallback(preload, { timeout: 2000 });
    } else {
      setTimeout(preload, 1500);
    }
  }, []);

  return (
    <div className="min-h-screen">
      <Header />
      <main id="main-content">
        {/* Home enxuta (20/11/2026): rádio, programas, quem somos, dedicatórias, contacto */}
        <Hero />

        {/* Player + «Hoje na rádio» + app (#radio, #app). Fallback ~ real height: no CLS */}
        <Suspense
          fallback={
            <div id="radio" className="bg-beige-dark min-h-[1200px] md:min-h-[1255px] lg:min-h-[795px]" aria-hidden="true" />
          }
        >
          <RadioPlayer />
        </Suspense>

        <ProgramasDestaque />

        <SobreNos />

        <DedicatoriasRadio />

        <Contacto />
      </main>
      <Footer />

      {/* Back to top button */}
      <BackToTop />
    </div>
  );
};

export default Index;
