import Header from "@/components/Header";
import Hero from "@/components/Hero";
import VideoShowcase from "@/components/VideoShowcase";
import SobreNos from "@/components/SobreNos";
import Servicos from "@/components/Servicos";
import Podcast from "@/components/Podcast";
import Contacto from "@/components/Contacto";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <VideoShowcase />
        <SobreNos />
        <Servicos />
        <Podcast />
        <Contacto />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
