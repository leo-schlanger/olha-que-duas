import Header from "@/components/Header";
import Hero from "@/components/Hero";
import VideoShowcase from "@/components/VideoShowcase";
import SobreNos from "@/components/SobreNos";
import Servicos from "@/components/Servicos";
import Podcast from "@/components/Podcast";
import RadioPlayer from "@/components/RadioPlayer";
import Parceiros from "@/components/Parceiros";
import NewsletterSection from "@/components/NewsletterSection";
import Contacto from "@/components/Contacto";
import Footer from "@/components/Footer";
import { useHashScroll } from "@/hooks/useHashScroll";

const Index = () => {
  // Scroll automático para secções quando URL tem hash (ex: /#sobre)
  useHashScroll();

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <VideoShowcase />
        <SobreNos />
        <Servicos />
        <RadioPlayer />
        <Podcast />
        <Parceiros />
        <NewsletterSection />
        <Contacto />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
