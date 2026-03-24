import Header from "@/components/Header";
import Hero from "@/components/Hero";
import VideoShowcase from "@/components/VideoShowcase";
import SobreNos from "@/components/SobreNos";
import Servicos from "@/components/Servicos";
import Podcast from "@/components/Podcast";
import RadioPlayer from "@/components/RadioPlayer";
import Weather from "@/components/Weather";
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
      <main>
        {/* Hero - Apresentação principal */}
        <Hero />

        {/* Vídeo de apresentação */}
        <VideoShowcase />

        {/* Quem somos */}
        <SobreNos />

        {/* O que fazemos */}
        <Servicos />

        {/* Rádio ao vivo - Destaque principal */}
        <RadioPlayer />

        {/* Podcast - Conteúdo complementar */}
        <Podcast />

        {/* Widget de clima */}
        <Weather />

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
