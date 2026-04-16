import { lazy, Suspense, useEffect } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import VideoShowcase from "@/components/VideoShowcase";
import SobreNos from "@/components/SobreNos";
import Podcast from "@/components/Podcast";
import AppDownload from "@/components/AppDownload";
import Parceiros from "@/components/Parceiros";
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
    title: "Olha que Duas | Podcast, Rádio e Comunicação em Portugal",
    description:
      "Somos comunicadoras com propósito. Podcast, Rádio 24h, Assessoria de Imprensa e Estratégia de Marca em Portugal.",
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
        {/* Hero - Apresentação principal */}
        <Hero />

        {/* Vídeo de apresentação */}
        <VideoShowcase />

        {/* Quem somos */}
        <SobreNos />

        {/* Rádio ao vivo - Destaque principal (inclui faixa de tempo no topo) */}
        <Suspense
          fallback={
            <div
              className="bg-beige-dark"
              style={{ minHeight: "800px" }}
              aria-hidden="true"
            />
          }
        >
          <RadioPlayer />
        </Suspense>

        {/* App móvel - Google Play (CTA logo após experiência da rádio) */}
        <AppDownload />

        {/* Podcast - Conteúdo complementar */}
        <Podcast />

        {/* Parceiros */}
        <Parceiros />

        {/* Contacto (já inclui newsletter) */}
        <Contacto />
      </main>
      <Footer />

      {/* Back to top button */}
      <BackToTop />
    </div>
  );
};

export default Index;
