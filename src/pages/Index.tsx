import Header from "@/components/Header";
import Hero from "@/components/Hero";
import VideoShowcase from "@/components/VideoShowcase";
import SobreNos from "@/components/SobreNos";
import Podcast from "@/components/Podcast";
import RadioPlayer from "@/components/RadioPlayer";
import AppDownload from "@/components/AppDownload";
import Parceiros from "@/components/Parceiros";
import Contacto from "@/components/Contacto";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import { useHashScroll } from "@/hooks/useHashScroll";

const Index = () => {
  // Scroll automático para secções quando URL tem hash (ex: /#sobre)
  useHashScroll();

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
        <RadioPlayer />

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
