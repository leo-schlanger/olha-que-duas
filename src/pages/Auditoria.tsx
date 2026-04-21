import { useState, useEffect } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Gift,
  Loader2,
  Megaphone,
  Mic,
  Monitor,
  Radio,
  Rocket,
  Send,
  Shield,
  Sparkles,
  TrendingUp,
  Video,
  Zap,
  Play,
  Volume2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import BackToTop from "@/components/BackToTop";
import logo from "@/assets/logo-olha-que-duas.webp";
import { Animated } from "@/components/ui/animated";
import { useMetaTags, getPageBreadcrumbJsonLd } from "@/hooks/useMetaTags";
import { siteConfig } from "@/config/site";

const FORM_SUBMIT_TIMEOUT_MS = 10_000;
const PAGE_URL = "https://www.olhaqueduas.com/auditoria-gratuita";

/** Animated sound wave bars — purely decorative */
function SoundWave({ className = "", bars = 5 }: { className?: string; bars?: number }) {
  return (
    <div className={`flex items-end gap-[3px] h-6 sm:h-8 ${className}`} aria-hidden="true">
      {Array.from({ length: bars }).map((_, i) => (
        <div
          key={i}
          className="w-[3px] rounded-full bg-current"
          style={{
            animation: `equalizer ${0.8 + i * 0.15}s ease-in-out infinite alternate`,
            animationDelay: `${i * 0.1}s`,
            height: "100%",
          }}
        />
      ))}
    </div>
  );
}

/** Floating musical notes — decorative, hidden on mobile for perf */
function FloatingNotes() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden hidden sm:block" aria-hidden="true">
      {["♪", "♫", "♩", "♬", "♪"].map((note, i) => (
        <span
          key={i}
          className="absolute text-cream/10 font-display select-none"
          style={{
            fontSize: `${20 + i * 8}px`,
            left: `${10 + i * 18}%`,
            top: `${20 + (i % 3) * 25}%`,
            animation: `float ${5 + i * 1.5}s ease-in-out infinite`,
            animationDelay: `${i * 0.8}s`,
          }}
        >
          {note}
        </span>
      ))}
    </div>
  );
}

const Auditoria = () => {
  useMetaTags({
    title: "Auditoria Gratuita de Comunicação",
    description:
      "Descubra em 15 minutos o que está a travar o crescimento da sua marca — e como resolvê-lo. Análise gratuita de presença digital, redes sociais e estratégia de comunicação. Sem compromisso.",
    image: "https://www.olhaqueduas.com/og-auditoria.jpg",
    imageAlt: "Olha que Duas — Auditoria Gratuita de Comunicação: A sua marca tem potencial, falta-lhe voz.",
    url: PAGE_URL,
    type: "website",
    jsonLd: [
      getPageBreadcrumbJsonLd("Auditoria Gratuita", PAGE_URL),
      {
        "@context": "https://schema.org",
        "@type": "Service",
        "@id": `${PAGE_URL}#service`,
        name: "Auditoria Gratuita de Comunicação",
        description:
          "Análise personalizada de 15 minutos sobre presença digital, impacto da comunicação, oportunidades de crescimento e plano de acção para a sua marca.",
        provider: {
          "@type": "Organization",
          "@id": "https://www.olhaqueduas.com/#organization",
          name: "Olha que Duas",
          url: "https://www.olhaqueduas.com",
          logo: "https://www.olhaqueduas.com/og-image.jpg",
        },
        areaServed: { "@type": "Country", name: "Portugal" },
        serviceType: "Consultoria de Comunicação",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "EUR",
          availability: "https://schema.org/InStock",
          description: "Auditoria gratuita de comunicação — sem compromisso",
        },
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "O que inclui a auditoria gratuita de comunicação?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Inclui análise de presença digital, impacto da comunicação actual, identificação de oportunidades de crescimento, estratégia de voz mediática e um mini-relatório com recomendações práticas.",
            },
          },
          {
            "@type": "Question",
            name: "Quanto tempo demora a auditoria?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "A auditoria demora cerca de 15 minutos, realizada por chamada ou videochamada. Após o preenchimento do formulário, a equipa entra em contacto em menos de 24 horas.",
            },
          },
          {
            "@type": "Question",
            name: "A auditoria é mesmo gratuita?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Sim, a auditoria é 100% gratuita e sem compromisso de compra. Não enviamos spam nem partilhamos dados. O objectivo é oferecer valor real à sua marca.",
            },
          },
        ],
      },
    ],
  });

  const [formData, setFormData] = useState({
    nome: "",
    empresa: "",
    email: "",
    telefone: "",
    redes: "",
    mensagem: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isHeroLoaded, setIsHeroLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsHeroLoaded(true), 150);
    window.scrollTo(0, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), FORM_SUBMIT_TIMEOUT_MS);

      const response = await fetch(
        `https://formsubmit.co/ajax/${siteConfig.contact.email}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          signal: controller.signal,
          body: JSON.stringify({
            Nome: formData.nome,
            Empresa: formData.empresa,
            Email: formData.email,
            Telefone: formData.telefone,
            "Redes Sociais": formData.redes || "(não indicado)",
            "O que gostaria de melhorar": formData.mensagem,
            _subject: `[Auditoria Gratuita] ${formData.empresa} - ${formData.nome}`,
            _replyto: formData.email,
            _template: "table",
            _captcha: "false",
          }),
        }
      );
      clearTimeout(timeout);

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      toast.success("Pedido enviado com sucesso!", {
        description: "Entraremos em contacto em menos de 24h.",
      });
      setFormData({ nome: "", empresa: "", email: "", telefone: "", redes: "", mensagem: "" });
    } catch (error) {
      const isAbort = error instanceof DOMException && error.name === "AbortError";
      toast.error("Erro ao enviar", {
        description: isAbort
          ? "Tempo limite excedido. Verifica a tua ligação."
          : "Tenta novamente ou contacta-nos diretamente.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToForm = () => {
    document.getElementById("formulario")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen">
      {/* Mini-header — só logo + CTA, sem navegação */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-charcoal/80 backdrop-blur-md border-b border-cream/5">
        <div className="container mx-auto px-4 sm:px-6 flex items-center justify-between h-14 sm:h-16">
          <a href="/" aria-label="Olha que Duas — Página principal">
            <img src={logo} alt="Olha que Duas" className="h-8 sm:h-10 w-auto" />
          </a>
          <Button
            onClick={scrollToForm}
            size="sm"
            className="btn-primary-glow font-medium rounded-xl text-xs sm:text-sm h-9 sm:h-10 px-3 sm:px-5 border-none"
          >
            <span className="hidden xs:inline">Auditoria </span>Gratuita
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </div>
      </header>

      <main id="main-content">
        {/* ═══════════════════════════════════════════
            HERO
        ═══════════════════════════════════════════ */}
        <section className="relative min-h-dvh overflow-hidden flex items-center justify-center bg-gradient-to-br from-charcoal via-[hsl(28_20%_18%)] to-charcoal">
          {/* Video background — muted ambient loop */}
          <video
            className="absolute inset-0 w-full h-full object-cover opacity-20"
            src="/landing-video.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal/60 via-transparent to-charcoal/90" />

          <FloatingNotes />

          {/* Animated gradient orbs */}
          <div className="absolute inset-0 pointer-events-none">
            <div
              className="absolute top-1/4 right-[5%] w-48 sm:w-64 md:w-[450px] h-48 sm:h-64 md:h-[450px] rounded-full blur-[80px] md:blur-[100px]"
              style={{
                background: "radial-gradient(circle, rgba(180,41,43,0.25) 0%, transparent 70%)",
                animation: "scalePulse 6s ease-in-out infinite",
              }}
            />
            <div
              className="absolute bottom-1/4 left-[5%] w-32 sm:w-48 md:w-80 h-32 sm:h-48 md:h-80 rounded-full blur-[60px] md:blur-[80px]"
              style={{
                background: "radial-gradient(circle, rgba(255,215,0,0.15) 0%, transparent 70%)",
                animation: "scalePulse 8s ease-in-out infinite 2s",
              }}
            />
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-vermelho/60 to-transparent animate-shimmer" />
          </div>

          {/* Content */}
          <div className="container mx-auto px-4 sm:px-6 relative z-10 pt-24 pb-20 sm:py-32 md:py-40">
            <div className="max-w-4xl mx-auto text-center text-cream">
              {/* Badge — hide SoundWaves on mobile to avoid overflow */}
              <div
                className={`inline-flex items-center gap-2 sm:gap-3 px-3 sm:px-5 py-2 sm:py-2.5 rounded-full glass-dark mb-6 sm:mb-8 transition-all duration-700 ${
                  isHeroLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              >
                <SoundWave className="text-vermelho-soft hidden sm:flex" bars={4} />
                <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-cream/80">
                  Dá voz à tua marca
                </span>
                <SoundWave className="text-amarelo hidden sm:flex" bars={4} />
              </div>

              {/* Main headline */}
              <h1
                className={`text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-display font-semibold leading-[1.1] sm:leading-[1.05] mb-6 sm:mb-8 transition-all duration-700 delay-200 ${
                  isHeroLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
              >
                Quer pôr a sua marca{" "}
                <span className="relative inline-block">
                  <span className="text-gradient-brand">no mapa</span>
                  <Sparkles className="absolute -top-2 -right-4 sm:-top-3 sm:-right-5 w-4 h-4 sm:w-5 sm:h-5 text-amarelo animate-pulse" />
                </span>
                ?
                <br className="hidden md:block" />
                <span className="block mt-2 text-2xl sm:text-3xl md:text-4xl lg:text-6xl text-cream/90">
                  Comece com uma{" "}
                  <span className="text-amarelo relative">
                    Auditoria Gratuita
                    <span className="absolute inset-x-0 -bottom-0.5 sm:-bottom-1 h-1.5 sm:h-2 bg-amarelo/20 -skew-x-3 rounded" />
                  </span>
                </span>
              </h1>

              {/* Subtitle */}
              <p
                className={`text-base sm:text-lg md:text-xl lg:text-2xl text-cream/60 max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed font-light transition-all duration-700 delay-400 ${
                  isHeroLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
              >
                Descubra em <strong className="text-cream/90 font-medium">15 minutos</strong> o que está a travar
                o crescimento da sua marca — e como resolvê-lo.
              </p>

              {/* CTA */}
              <div
                className={`flex flex-col items-center gap-3 sm:gap-4 transition-all duration-700 delay-[600ms] ${
                  isHeroLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
              >
                <Button
                  onClick={scrollToForm}
                  size="lg"
                  className="btn-primary-glow btn-shine btn-magnetic font-semibold h-13 sm:h-14 md:h-16 px-6 sm:px-8 md:px-10 text-sm sm:text-base md:text-lg border-none rounded-xl sm:rounded-2xl group shadow-2xl shadow-vermelho/30 w-full sm:w-auto"
                >
                  <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-2 shrink-0" fill="currentColor" />
                  <span>Quero a minha auditoria gratuita</span>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 shrink-0 transition-transform group-hover:translate-x-1" />
                </Button>

                <div className="flex items-center gap-2 text-cream/40 text-xs sm:text-sm">
                  <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>Gratuito &bull; Sem compromisso</span>
                </div>
              </div>

              {/* Trust indicators */}
              <div
                className={`mt-10 sm:mt-14 grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-center gap-3 sm:gap-6 md:gap-10 transition-all duration-700 delay-[800ms] ${
                  isHeroLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              >
                <div className="flex items-center justify-center gap-2 text-cream/50">
                  <Radio className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-vermelho-soft" />
                  <span className="text-xs sm:text-sm">Rádio 24/7</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-cream/50">
                  <Mic className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amarelo" />
                  <span className="text-xs sm:text-sm">Imprensa</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-cream/50">
                  <Video className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-vermelho-soft" />
                  <span className="text-xs sm:text-sm">Conteúdos</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-cream/50">
                  <Monitor className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amarelo" />
                  <span className="text-xs sm:text-sm">Digital</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom gradient fade */}
          <div className="absolute bottom-0 left-0 right-0 h-24 sm:h-32 bg-gradient-to-t from-background to-transparent" />

          {/* Scroll indicator — hide on mobile */}
          <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-10 hidden sm:block">
            <a href="#video-section" className="group flex flex-col items-center gap-2 text-cream/30 hover:text-cream/60 transition-colors">
              <span className="text-[10px] uppercase tracking-widest font-medium">Explorar</span>
              <div className="w-7 h-11 rounded-full border-2 border-current flex items-start justify-center p-2 group-hover:border-amarelo/50 transition-colors">
                <div className="w-1.5 h-3 bg-current rounded-full animate-bounce group-hover:bg-amarelo" style={{ animationDuration: "1.5s" }} />
              </div>
            </a>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            VÍDEO
        ═══════════════════════════════════════════ */}
        <section id="video-section" className="py-12 sm:py-16 md:py-24 bg-charcoal relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-vermelho/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amarelo/15 to-transparent" />
          </div>

          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <Animated>
              <div className="max-w-2xl mx-auto text-center mb-6 sm:mb-10">
                <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-cream/5 border border-cream/10 mb-4 sm:mb-5">
                  <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-vermelho-soft" />
                  <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-widest text-cream/70">
                    Conheça-nos
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-semibold text-cream leading-tight mb-3 sm:mb-4">
                  Veja quem <span className="text-amarelo">somos</span>
                </h2>
                <p className="text-sm sm:text-base md:text-lg text-cream/50">
                  Descubra o nosso propósito e como podemos dar voz à sua marca.
                </p>
              </div>
            </Animated>

            <Animated delay={200}>
              <div className="max-w-4xl mx-auto">
                <div className="relative rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl shadow-black/40 border border-cream/10">
                  <video
                    className="w-full aspect-video bg-black"
                    src="/landing-video.mp4"
                    controls
                    playsInline
                    preload="metadata"
                    poster="/og-auditoria.jpg"
                  >
                    O seu navegador não suporta vídeo HTML5.
                  </video>
                </div>
              </div>
            </Animated>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            O QUE VAI RECEBER
        ═══════════════════════════════════════════ */}
        <section id="beneficios" className="py-14 sm:py-20 md:py-32 bg-background relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-64 sm:w-[500px] h-64 sm:h-[500px] bg-primary/[0.02] rounded-full blur-[80px] sm:blur-[120px]" />
          </div>

          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <Animated>
              <div className="max-w-3xl mx-auto text-center mb-10 sm:mb-14 md:mb-20">
                <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-primary/5 border border-primary/10 mb-4 sm:mb-6">
                  <Gift className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-primary" />
                  <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-widest text-primary">
                    100% Gratuito
                  </span>
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-semibold text-foreground mb-4 sm:mb-6 leading-[1.1]">
                  O que vai <span className="text-gradient-brand">receber</span>
                </h2>
                <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed">
                  Uma análise clara, direta e personalizada sobre a sua marca.
                  Sem compromisso. Sem vendas agressivas. <strong>Só valor real.</strong>
                </p>
              </div>
            </Animated>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 max-w-5xl mx-auto">
              {[
                { icon: Monitor, title: "Presença Digital", desc: "A força da sua presença online e onde está a perder oportunidades", color: "from-blue-500/10 to-indigo-500/10" },
                { icon: Megaphone, title: "Impacto da Comunicação", desc: "O que está a funcionar — e o que está a sabotar o crescimento", color: "from-vermelho/10 to-orange-500/10" },
                { icon: TrendingUp, title: "Oportunidades Imediatas", desc: "Caminhos concretos para expandir e escalar a sua marca", color: "from-green-500/10 to-emerald-500/10" },
                { icon: Zap, title: "Sugestões Práticas", desc: "Ações que pode implementar imediatamente, sem investimento", color: "from-amarelo/10 to-yellow-500/10" },
                { icon: Volume2, title: "Estratégia de Voz", desc: "Como dar personalidade sonora e mediática à sua marca", color: "from-purple-500/10 to-pink-500/10" },
                { icon: Rocket, title: "Plano de Acção", desc: "Roteiro claro do primeiro passo ao crescimento sustentável", color: "from-vermelho/10 to-vermelho-soft/10" },
              ].map((item, i) => (
                <Animated key={item.title} delay={i * 100}>
                  <Card className="border-border/30 bg-card/80 backdrop-blur-sm h-full group hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300">
                    <CardContent className="p-5 sm:p-6 md:p-7">
                      <div className={`w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br ${item.color} rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-5 group-hover:scale-110 transition-transform duration-300`}>
                        <item.icon className="w-6 h-6 sm:w-7 sm:h-7 text-foreground/80" />
                      </div>
                      <h3 className="font-display text-lg sm:text-xl md:text-2xl font-semibold text-foreground mb-1.5 sm:mb-2">{item.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                    </CardContent>
                  </Card>
                </Animated>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            QUEM SOMOS
        ═══════════════════════════════════════════ */}
        <section className="py-14 sm:py-20 md:py-32 bg-gradient-to-br from-beige-dark via-[hsl(28_20%_25%)] to-charcoal text-cream relative overflow-hidden">
          <FloatingNotes />
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-vermelho/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amarelo/20 to-transparent" />
          </div>

          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-20 items-center max-w-6xl mx-auto">
              {/* Text */}
              <Animated animation="fade-up">
                <div className="text-center lg:text-left">
                  <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-cream/5 border border-cream/10 mb-4 sm:mb-6">
                    <SoundWave className="text-amarelo" bars={3} />
                    <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.15em] text-cream/70">
                      Quem Somos
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-semibold leading-[1.1] mb-4 sm:mb-6">
                    Olha que Duas
                    <span className="block text-xl sm:text-2xl md:text-3xl lg:text-4xl text-amarelo mt-1 sm:mt-2">
                      Comunicação, Rádio, Imprensa e Digital
                    </span>
                  </h2>
                  <p className="text-base sm:text-lg text-cream/60 leading-relaxed mb-3 sm:mb-4">
                    Somos a agência que transforma marcas em protagonistas — da imprensa à rádio,
                    do digital ao palco.
                  </p>
                  <p className="text-sm sm:text-base text-cream/50 leading-relaxed">
                    Damos voz, presença e personalidade a empresas que querem crescer com impacto.
                    Se a sua marca precisa de visibilidade, estratégia e criatividade… está no sítio certo.
                  </p>
                </div>
              </Animated>

              {/* Services grid — explicit color classes (Tailwind can't purge dynamic classes) */}
              <Animated animation="fade-up" delay={200}>
                <div className="grid grid-cols-1 xs:grid-cols-2 gap-3">
                  {[
                    { icon: Radio, label: "Rádio e Publicidade", iconClass: "text-vermelho-soft", bgClass: "bg-vermelho-soft/20" },
                    { icon: Mic, label: "Assessoria de Imprensa", iconClass: "text-amarelo", bgClass: "bg-amarelo/20" },
                    { icon: Monitor, label: "Gestão de Redes Sociais", iconClass: "text-vermelho-soft", bgClass: "bg-vermelho-soft/20" },
                    { icon: Monitor, label: "Criação de Sites", iconClass: "text-amarelo", bgClass: "bg-amarelo/20" },
                    { icon: Rocket, label: "Expansão de Marcas", iconClass: "text-vermelho-soft", bgClass: "bg-vermelho-soft/20" },
                    { icon: Video, label: "Produção de Conteúdos", iconClass: "text-amarelo", bgClass: "bg-amarelo/20" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center gap-3 bg-cream/[0.04] border border-cream/[0.08] rounded-xl px-3 sm:px-4 py-3 sm:py-4 hover:bg-cream/[0.08] hover:border-cream/[0.15] transition-all duration-300 group"
                    >
                      <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg ${item.bgClass} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                        <item.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${item.iconClass}`} />
                      </div>
                      <span className="text-xs sm:text-sm font-medium text-cream/80 leading-tight">{item.label}</span>
                    </div>
                  ))}
                </div>
              </Animated>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            PORQUÊ
        ═══════════════════════════════════════════ */}
        <section className="py-14 sm:py-20 md:py-32 bg-background relative overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6">
            <Animated>
              <div className="max-w-3xl mx-auto text-center mb-8 sm:mb-14">
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-semibold text-foreground mb-4 sm:mb-6 leading-[1.1]">
                  Porquê fazer esta{" "}
                  <span className="text-gradient-brand">auditoria</span>?
                </h2>
                <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed">
                  A maioria das marcas comunica às cegas. Nós mostramos-lhe onde está,
                  para onde pode ir e como chegar lá.
                </p>
              </div>
            </Animated>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-5 max-w-3xl mx-auto">
              {[
                { text: "Mais visibilidade", sub: "Apareça onde o seu público está" },
                { text: "Mais clientes", sub: "Converta atenção em resultados" },
                { text: "Mais autoridade", sub: "Posicione-se como referência" },
                { text: "Mais confiança", sub: "Comunique com clareza e impacto" },
                { text: "Mais impacto digital", sub: "Domine as plataformas certas" },
                { text: "Mais presença mediática", sub: "Da rádio à imprensa, com estratégia" },
              ].map((item, i) => (
                <Animated key={item.text} delay={i * 80}>
                  <div className="flex items-start gap-3 sm:gap-4 bg-card border border-border/50 rounded-xl sm:rounded-2xl p-4 sm:p-5 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-500/10 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                    </div>
                    <div>
                      <span className="text-sm sm:text-base font-semibold text-foreground block">{item.text}</span>
                      <span className="text-xs sm:text-sm text-muted-foreground">{item.sub}</span>
                    </div>
                  </div>
                </Animated>
              ))}
            </div>

            {/* Mid-section CTA */}
            <Animated delay={500}>
              <div className="text-center mt-8 sm:mt-12">
                <Button
                  onClick={scrollToForm}
                  size="lg"
                  className="btn-primary-glow btn-shine btn-magnetic font-medium h-12 sm:h-14 px-5 sm:px-8 text-sm sm:text-base border-none rounded-xl group w-full sm:w-auto"
                >
                  Descobrir o potencial da minha marca
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 shrink-0 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            </Animated>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            COMO FUNCIONA
        ═══════════════════════════════════════════ */}
        <section className="py-14 sm:py-20 md:py-32 bg-beige relative overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <Animated>
              <div className="max-w-2xl mx-auto text-center mb-10 sm:mb-14 md:mb-20">
                <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-primary/5 border border-primary/10 mb-4 sm:mb-6">
                  <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-primary" />
                  <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-widest text-primary">
                    4 passos simples
                  </span>
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-semibold text-foreground leading-[1.1]">
                  Como <span className="text-gradient-brand">funciona</span>?
                </h2>
              </div>
            </Animated>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 max-w-5xl mx-auto">
              {[
                { step: "1", title: "Preenche o formulário", desc: "30 segundos.", icon: Send },
                { step: "2", title: "Contacto em 24h", desc: "Entramos em acção.", icon: Zap },
                { step: "3", title: "Auditoria ao vivo", desc: "15 min por chamada.", icon: Video },
                { step: "4", title: "Mini-relatório", desc: "Recomendações práticas.", icon: Rocket },
              ].map((item, i) => (
                <Animated key={item.step} delay={i * 150}>
                  <div className="text-center group">
                    <div className="relative w-14 h-14 sm:w-18 sm:h-18 md:w-20 md:h-20 mx-auto mb-3 sm:mb-6">
                      <div className="absolute inset-0 rounded-full bg-vermelho/20 animate-pulse" style={{ animationDuration: "3s", animationDelay: `${i * 0.5}s` }} />
                      <div className="relative w-14 h-14 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-vermelho to-vermelho-soft text-cream flex items-center justify-center shadow-xl shadow-vermelho/20 group-hover:scale-110 transition-transform duration-300">
                        <item.icon className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" />
                      </div>
                    </div>
                    <div className="text-[10px] sm:text-xs font-bold text-vermelho uppercase tracking-widest mb-1 sm:mb-2">Passo {item.step}</div>
                    <h3 className="font-display text-sm sm:text-lg md:text-xl font-semibold text-foreground mb-1 sm:mb-2 leading-tight">{item.title}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </Animated>
              ))}
            </div>

            <Animated delay={700}>
              <p className="text-center mt-8 sm:mt-14 text-lg sm:text-xl md:text-2xl font-display font-semibold text-foreground">
                Simples, rápido e <span className="text-gradient-brand">transformador</span>.
              </p>
            </Animated>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            FORMULÁRIO
        ═══════════════════════════════════════════ */}
        <section id="formulario" className="py-14 sm:py-20 md:py-32 bg-background relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute bottom-0 right-0 w-64 sm:w-[400px] h-64 sm:h-[400px] bg-primary/[0.03] rounded-full blur-[80px] sm:blur-[100px]" />
          </div>

          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <Animated>
              <div className="max-w-2xl mx-auto text-center mb-8 sm:mb-10 md:mb-12">
                <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-primary/5 border border-primary/10 mb-4 sm:mb-6">
                  <Send className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-primary" />
                  <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-widest text-primary">
                    Inscrição gratuita
                  </span>
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-semibold text-foreground mb-3 sm:mb-4 leading-[1.1]">
                  Garanta a sua{" "}
                  <span className="text-gradient-brand">Auditoria Gratuita</span>
                </h2>
                <p className="text-sm sm:text-base md:text-lg text-muted-foreground">
                  Preencha o formulário e receba contacto em menos de 24 horas.
                </p>
              </div>
            </Animated>

            <Animated delay={200}>
              <Card className="max-w-2xl mx-auto border-border/30 bg-card/90 backdrop-blur-sm shadow-2xl shadow-primary/5 rounded-2xl sm:rounded-3xl overflow-hidden">
                <div className="h-1 sm:h-1.5 bg-gradient-to-r from-vermelho via-vermelho-soft to-amarelo" />
                <CardContent className="p-5 sm:p-6 md:p-10">
                  <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div className="space-y-1.5 sm:space-y-2">
                        <Label htmlFor="nome" className="text-sm font-medium">Nome *</Label>
                        <Input
                          id="nome"
                          name="nome"
                          value={formData.nome}
                          onChange={handleChange}
                          placeholder="O seu nome"
                          required
                          className="h-11 sm:h-12 rounded-lg sm:rounded-xl border-border/50 focus:border-primary/50"
                          disabled={isSubmitting}
                        />
                      </div>
                      <div className="space-y-1.5 sm:space-y-2">
                        <Label htmlFor="empresa" className="text-sm font-medium">Empresa *</Label>
                        <Input
                          id="empresa"
                          name="empresa"
                          value={formData.empresa}
                          onChange={handleChange}
                          placeholder="Nome da empresa"
                          required
                          className="h-11 sm:h-12 rounded-lg sm:rounded-xl border-border/50 focus:border-primary/50"
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div className="space-y-1.5 sm:space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium">Email *</Label>
                        <Input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="o.seu@email.com"
                          required
                          className="h-11 sm:h-12 rounded-lg sm:rounded-xl border-border/50 focus:border-primary/50"
                          disabled={isSubmitting}
                        />
                      </div>
                      <div className="space-y-1.5 sm:space-y-2">
                        <Label htmlFor="telefone" className="text-sm font-medium">Telefone *</Label>
                        <Input
                          type="tel"
                          id="telefone"
                          name="telefone"
                          value={formData.telefone}
                          onChange={handleChange}
                          placeholder="+351 900 000 000"
                          required
                          className="h-11 sm:h-12 rounded-lg sm:rounded-xl border-border/50 focus:border-primary/50"
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5 sm:space-y-2">
                      <Label htmlFor="redes" className="text-sm font-medium">Link das redes sociais <span className="text-muted-foreground">(opcional)</span></Label>
                      <Input
                        id="redes"
                        name="redes"
                        value={formData.redes}
                        onChange={handleChange}
                        placeholder="instagram.com/suamarca"
                        className="h-11 sm:h-12 rounded-lg sm:rounded-xl border-border/50 focus:border-primary/50"
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="space-y-1.5 sm:space-y-2">
                      <Label htmlFor="mensagem" className="text-sm font-medium">O que gostaria de melhorar? *</Label>
                      <Textarea
                        id="mensagem"
                        name="mensagem"
                        value={formData.mensagem}
                        onChange={handleChange}
                        placeholder="Conte-nos sobre os desafios da sua marca..."
                        rows={4}
                        required
                        className="resize-none rounded-lg sm:rounded-xl border-border/50 focus:border-primary/50"
                        disabled={isSubmitting}
                      />
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full btn-primary-glow btn-shine font-semibold h-12 sm:h-14 text-sm sm:text-base border-none rounded-xl mt-1 sm:mt-2"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin" />
                          A enviar...
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-2 shrink-0" fill="currentColor" />
                          Quero a minha auditoria gratuita
                          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 shrink-0" />
                        </>
                      )}
                    </Button>

                    <p className="text-center text-[10px] sm:text-xs text-muted-foreground mt-2 sm:mt-3">
                      <Shield className="w-3 h-3 inline mr-1" />
                      Os seus dados estão seguros. Não enviamos spam.
                    </p>
                  </form>
                </CardContent>
              </Card>
            </Animated>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            BÓNUS
        ═══════════════════════════════════════════ */}
        <section className="py-12 sm:py-16 md:py-24 bg-gradient-to-br from-amarelo via-amarelo to-amarelo-soft relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 sm:w-60 h-40 sm:h-60 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-28 sm:w-40 h-28 sm:h-40 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/3" />

          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <Animated>
              <div className="max-w-3xl mx-auto text-center">
                <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-charcoal/10 border border-charcoal/10 mb-4 sm:mb-6">
                  <Gift className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-charcoal" />
                  <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-charcoal">
                    Bónus Exclusivo
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-semibold text-charcoal mb-6 sm:mb-10 leading-tight">
                  Bónus para quem se inscrever hoje
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-5 max-w-3xl mx-auto">
                  {[
                    { icon: Radio, title: "Spot de Rádio", desc: "20% de desconto no primeiro spot" },
                    { icon: Monitor, title: "Diagnóstico Completo", desc: "Análise aprofundada das redes" },
                    { icon: Clock, title: "Prioridade", desc: "Lugar garantido na agenda" },
                  ].map((item) => (
                    <div
                      key={item.title}
                      className="bg-white/50 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/40 shadow-lg shadow-charcoal/5"
                    >
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-charcoal/10 rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                        <item.icon className="w-5 h-5 sm:w-6 sm:h-6 text-charcoal" />
                      </div>
                      <h3 className="font-display text-base sm:text-lg font-semibold text-charcoal mb-1">{item.title}</h3>
                      <p className="text-xs sm:text-sm text-charcoal/70 leading-snug">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Animated>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            GARANTIA
        ═══════════════════════════════════════════ */}
        <section className="py-12 sm:py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4 sm:px-6">
            <Animated>
              <div className="max-w-2xl mx-auto text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-500/10 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
                </div>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-display font-semibold text-foreground mb-5 sm:mb-8">
                  Garantia de Confiança
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 max-w-md mx-auto text-left">
                  {[
                    "Não enviamos spam.",
                    "Não partilhamos dados.",
                    "Não há compromisso de compra.",
                    "Só valor real para marcas que querem crescer.",
                  ].map((text) => (
                    <div key={text} className="flex items-start gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-green-500/5">
                      <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mt-0.5 shrink-0" />
                      <span className="text-xs sm:text-sm font-medium text-foreground">{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Animated>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            FECHO
        ═══════════════════════════════════════════ */}
        <section className="py-16 sm:py-24 md:py-36 bg-gradient-to-br from-charcoal via-[hsl(28_20%_20%)] to-charcoal text-cream relative overflow-hidden">
          <FloatingNotes />
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 sm:w-[500px] h-72 sm:h-[500px] bg-vermelho/10 rounded-full blur-[100px] sm:blur-[150px]" />
          </div>

          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <Animated animation="zoom-in">
              <div className="max-w-3xl mx-auto text-center">
                <SoundWave className="text-amarelo/50 mx-auto mb-5 sm:mb-8" bars={7} />

                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-display font-semibold leading-[1.1] sm:leading-[1.05] mb-4 sm:mb-6">
                  A sua marca tem potencial.
                  <br />
                  <span className="text-amarelo">Falta-lhe voz.</span>
                </h2>
                <p className="text-base sm:text-xl md:text-2xl text-cream/60 mb-8 sm:mb-12 font-light">
                  Deixe-nos mostrar-lhe como amplificá-la.
                </p>
                <Button
                  onClick={scrollToForm}
                  size="lg"
                  className="btn-primary-glow btn-shine btn-magnetic font-semibold h-13 sm:h-14 md:h-16 px-6 sm:px-8 md:px-12 text-sm sm:text-base md:text-lg border-none rounded-xl sm:rounded-2xl group shadow-2xl shadow-vermelho/30 w-full sm:w-auto"
                >
                  <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-2 shrink-0" fill="currentColor" />
                  Quero a minha auditoria gratuita
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 shrink-0 transition-transform group-hover:translate-x-1" />
                </Button>

                <div className="mt-5 sm:mt-8 flex items-center justify-center gap-2 text-cream/30 text-xs sm:text-sm">
                  <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>Gratuito &bull; Sem compromisso &bull; Resultados reais</span>
                </div>
              </div>
            </Animated>
          </div>
        </section>
      </main>

      {/* Mini-footer */}
      <footer className="bg-charcoal text-cream/30 py-5 sm:py-6 border-t border-cream/5">
        <div className="container mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-3 text-[10px] sm:text-xs">
          <span>&copy; {new Date().getFullYear()} {siteConfig.info.name}. Todos os direitos reservados.</span>
          <div className="flex items-center gap-4">
            <a href="/privacidade" className="hover:text-cream/60 transition-colors">Política de Privacidade</a>
            <a href="/termos" className="hover:text-cream/60 transition-colors">Termos</a>
          </div>
        </div>
      </footer>
      <BackToTop />
    </div>
  );
};

export default Auditoria;
