import { lazy, Suspense } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ProgramasDestaque from "@/components/ProgramasDestaque";
import SobreNos from "@/components/SobreNos";
import DedicatoriasRadio from "@/components/DedicatoriasRadio";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import { useHashScroll } from "@/hooks/useHashScroll";
import { useMetaTags } from "@/hooks/useMetaTags";
import { useAfterLoad } from "@/hooks/useAfterLoad";

// Lazy: RadioPlayer puxa Slider/Card Radix, vários ícones Lucide, o leitor
// Icecast, o «Hoje na rádio» e os seus ícones. Só monta depois do load (idle),
// para não disputar a rede com a foto do Hero (LCP); antes se houver clique em
// «Ouvir» ou se o URL apontar para #radio/#app (perf, 21/11/2026).
const RadioPlayer = lazy(() => import("@/components/RadioPlayer"));
// Contacto traz zod, o Select Radix e o sonner: fora do chunk de entrada, e
// também só monta depois do load (ou com #contacto no URL); fallback = altura
// medida a 21/11 (1170/1146/822 px a 390/768/≥1024).
const Contacto = lazy(() => import("@/components/Contacto"));

const PLAYER_EVENTS = ["oqd:play", "hashchange"] as const;

const radioFallback = (
  <div id="radio" className="bg-beige-dark min-h-[1200px] md:min-h-[1255px] lg:min-h-[795px]" aria-hidden="true" />
);

const contactFallback = (
  <section id="contacto" className="min-h-[1170px] bg-background md:min-h-[1146px] lg:min-h-[822px]" aria-hidden="true" />
);

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

  const hash = window.location.hash;
  const playerReady = useAfterLoad(hash === "#radio" || hash === "#app", PLAYER_EVENTS);
  const contactReady = useAfterLoad(hash === "#contacto", PLAYER_EVENTS);

  return (
    <div className="min-h-screen">
      <Header />
      <main id="main-content">
        {/* Home enxuta (20/11/2026): rádio, programas, quem somos, dedicatórias, contacto */}
        <Hero />

        {/* Player + «Hoje na rádio» + app (#radio, #app). Fallback ~ real height: no CLS */}
        <Suspense fallback={radioFallback}>{playerReady ? <RadioPlayer /> : radioFallback}</Suspense>

        <ProgramasDestaque />

        <SobreNos />

        <DedicatoriasRadio />

        <Suspense fallback={contactFallback}>{contactReady ? <Contacto /> : contactFallback}</Suspense>
      </main>
      <Footer />

      {/* Back to top button */}
      <BackToTop />
    </div>
  );
};

export default Index;
