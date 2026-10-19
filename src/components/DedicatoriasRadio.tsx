import {
  Mic,
  Heart,
  Music,
  Headphones,
  Mail,
  Sparkles,
  FileText,
  Send,
  Radio,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Animated } from "@/components/ui/animated";
import { siteConfig } from "@/config/site";
import campaignPoster from "@/assets/anuncio-a-sua-voz-na-radio.webp";

const pillars = [
  {
    icon: Mic,
    title: "Dedicatórias em Áudio",
    description: "Dedicatórias em áudio gravadas com a sua própria voz para emocionar quem mais ama.",
  },
  {
    icon: FileText,
    title: "Poemas & Mensagens",
    description: "Leitura de poemas e mensagens especiais na nossa emissão, com o carinho que o momento merece.",
  },
  {
    icon: Music,
    title: "Música Autoral ou Cover",
    description: "A sua música autoral ou cover a tocar na programação da nossa rádio.",
  },
  {
    icon: Headphones,
    title: "Playlists Sob Medida",
    description: "Playlists personalizadas e exclusivas pensadas para momentos marcantes.",
  },
];

const DedicatoriasRadio = () => {
  const emailSubject = encodeURIComponent(
    "Pedido de Orçamento — A Sua Voz na Nossa Rádio (Dedicatória)"
  );
  const emailBody = encodeURIComponent(
    "Olá equipa Olha que Duas!\n\nGostaria de pedir um orçamento para fazer uma dedicatória / homenagem especial na rádio:\n\n- O meu nome:\n- Para quem é a homenagem:\n- Tipo de homenagem (Áudio com a minha voz / Leitura de poema ou mensagem / Música autoral ou cover / Playlist sob medida):\n- Data ou ocasião especial:\n- Detalhes da minha ideia:\n\nFico a aguardar o vosso contacto. Obrigado(a)!"
  );
  const mailtoHref = `mailto:${siteConfig.contact.email}?subject=${emailSubject}&body=${emailBody}`;

  const handleOpenContactForm = () => {
    window.dispatchEvent(
      new CustomEvent("select-contact-subject", { detail: "dedicatorias" })
    );
  };

  return (
    <section
      id="dedicatorias"
      aria-labelledby="dedicatorias-heading"
      className="relative py-20 md:py-28 overflow-hidden bg-gradient-to-b from-[#2b090d] via-[#3a0d12] to-charcoal text-cream selection:bg-amarelo selection:text-charcoal"
    >
      {/* Ambient studio & romantic glow effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-24 left-1/4 w-[28rem] h-[28rem] rounded-full blur-3xl opacity-30"
          style={{
            background:
              "radial-gradient(circle, rgba(212, 56, 58, 0.55) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-10 right-10 w-[30rem] h-[30rem] rounded-full blur-3xl opacity-25"
          style={{
            background:
              "radial-gradient(circle, rgba(255, 200, 60, 0.45) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-64 opacity-10"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(255, 215, 0, 0.35) 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Top Badge & Section Header */}
        <Animated animation="fade-up" className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amarelo/15 border border-amarelo/30 backdrop-blur-sm mb-5">
            <Heart className="w-3.5 h-3.5 text-amarelo fill-amarelo animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-amarelo">
              Homenagens &amp; Dedicatórias na Rádio
            </span>
          </div>

          <h2
            id="dedicatorias-heading"
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-cream leading-[1.08]"
          >
            A sua voz na nossa rádio.{" "}
            <span className="block mt-2 italic font-normal text-amarelo drop-shadow-[0_2px_12px_rgba(255,200,60,0.3)]">
              O amor no tom certo.
            </span>
          </h2>

          {/* Decorative Golden Heart Soundwave SVG */}
          <div className="flex items-center justify-center my-6" aria-hidden="true">
            <svg
              viewBox="0 0 360 44"
              className="w-64 sm:w-80 h-auto text-amarelo/80"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 22 H70 L76 14 L82 30 L88 8 L94 36 L100 12 L106 32 L112 18 L118 26 L124 22 H152"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M180 33 C180 33 163 22 163 13 C163 8 167 5 172 5 C175.5 5 178.5 7 180 9.5 C181.5 7 184.5 5 188 5 C193 5 197 8 197 13 C197 22 180 33 180 33 Z"
                stroke="currentColor"
                strokeWidth="2"
                fill="rgba(255, 200, 60, 0.18)"
              />
              <path
                d="M208 22 H236 L242 18 L248 26 L254 12 L260 32 L266 8 L272 36 L278 14 L284 30 L290 22 H350"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <p className="text-base md:text-lg lg:text-xl text-cream/80 max-w-2xl mx-auto leading-relaxed">
            Declarações inesquecíveis, poemas, playlists exclusivas ou aquela música
            de sua autoria… Eternize o seu sentimento na programação da{" "}
            <span className="font-semibold text-amarelo">Olha que Duas</span>.
          </p>
        </Animated>

        {/* Main Content Grid: Campaign Poster + Pillars & CTA */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 max-w-6xl mx-auto items-center">
          {/* Left Column: Official Campaign Poster */}
          <Animated animation="fade-right" className="lg:col-span-5">
            <div className="relative mx-auto max-w-sm lg:max-w-none group">
              {/* Golden/Red Ambient Frame Glow */}
              <div
                className="absolute -inset-2.5 rounded-3xl blur-xl opacity-60 group-hover:opacity-90 transition-opacity duration-500"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255,200,60,0.5) 0%, rgba(180,41,43,0.6) 50%, rgba(255,200,60,0.4) 100%)",
                }}
              />
              <div className="relative rounded-2xl overflow-hidden border-2 border-amarelo/40 shadow-2xl bg-[#1e070a]">
                <img
                  src={campaignPoster}
                  alt="Campanha A sua voz na nossa rádio — O amor no tom certo. Dedicatórias em áudio, leitura de poemas, música autoral e playlists sob medida na Olha que Duas."
                  width={1024}
                  height={1536}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-auto object-cover group-hover:scale-[1.02] transition-transform duration-700"
                />
                {/* Subtle studio badge overlay on top-right */}
                <div className="absolute top-3 right-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/65 backdrop-blur-md border border-amarelo/40 text-[10px] font-bold uppercase tracking-wider text-amarelo">
                  <Radio className="w-3 h-3 text-vermelho animate-pulse" />
                  A Rádio que Fala de Amor
                </div>
              </div>
            </div>
          </Animated>

          {/* Right Column: 4 Pillars + Quote Callout */}
          <Animated animation="fade-left" delay={150} className="lg:col-span-7 flex flex-col gap-6">
            {/* 4 Pillars Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {pillars.map((pillar) => {
                const Icon = pillar.icon;
                return (
                  <div
                    key={pillar.title}
                    className="group p-5 rounded-2xl bg-white/[0.05] hover:bg-white/[0.09] border border-amarelo/20 hover:border-amarelo/50 backdrop-blur-sm transition-all duration-300 shadow-lg"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amarelo/25 to-vermelho/30 border border-amarelo/50 flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform duration-300">
                        <Icon className="w-5 h-5 text-amarelo" />
                      </div>
                      <div>
                        <h3 className="font-display font-bold text-lg text-cream mb-1 group-hover:text-amarelo transition-colors">
                          {pillar.title}
                        </h3>
                        <p className="text-sm text-cream/70 leading-relaxed">
                          {pillar.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Golden Callout Box — Orçamento */}
            <div className="relative rounded-2xl overflow-hidden border-2 border-amarelo/50 bg-gradient-to-br from-[#4a1219] via-[#330b10] to-[#1f070a] p-6 sm:p-8 shadow-2xl">
              <div className="absolute -top-12 -right-12 w-36 h-36 bg-amarelo/15 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-vermelho/20 rounded-full blur-2xl pointer-events-none" />

              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amarelo/20 border border-amarelo/40 text-amarelo text-xs font-semibold mb-4">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Homenagem Personalizada</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-display font-bold text-cream mb-2">
                  Quer surpreender alguém especial ou saber como funciona?
                </h3>

                <p className="text-cream/80 text-sm sm:text-base mb-6 leading-relaxed">
                  Entre em contacto com o nosso email para pedir o seu{" "}
                  <span className="text-amarelo font-semibold">orçamento personalizado</span>{" "}
                  e crie uma <span className="text-amarelo font-semibold">homenagem única</span>{" "}
                  connosco na programação da rádio.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                  <Button
                    asChild
                    size="lg"
                    className="h-13 px-6 text-sm sm:text-base font-bold rounded-xl bg-gradient-to-r from-amarelo via-amarelo to-amarelo-soft text-charcoal hover:opacity-95 shadow-lg shadow-amarelo/25 transition-all"
                  >
                    <a href={mailtoHref} className="inline-flex items-center justify-center gap-2">
                      <Mail className="w-5 h-5" />
                      Pedir Orçamento por Email
                    </a>
                  </Button>

                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    onClick={handleOpenContactForm}
                    className="h-13 px-6 text-sm sm:text-base font-semibold rounded-xl border-2 border-amarelo/50 bg-transparent text-cream hover:bg-amarelo/15 hover:text-amarelo hover:border-amarelo transition-all"
                  >
                    <a href="#contacto" className="inline-flex items-center justify-center gap-2">
                      <Send className="w-4 h-4" />
                      Usar Formulário de Contacto
                    </a>
                  </Button>
                </div>

                {/* Direct Email Display */}
                <div className="mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm text-cream/70">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-amarelo/15 border border-amarelo/30 flex items-center justify-center text-amarelo">
                      <Mail className="w-3.5 h-3.5" />
                    </span>
                    <span>Email direto para orçamentos:</span>
                    <a
                      href={mailtoHref}
                      className="font-semibold text-amarelo hover:underline underline-offset-4"
                    >
                      {siteConfig.contact.email}
                    </a>
                  </div>
                  <span className="italic font-display text-base text-amarelo/90">
                    A rádio que fala de amor ♡
                  </span>
                </div>
              </div>
            </div>
          </Animated>
        </div>
      </div>
    </section>
  );
};

export default DedicatoriasRadio;
