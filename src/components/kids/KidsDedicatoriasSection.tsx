import { Link } from "react-router-dom";
import {
  Mic,
  Heart,
  Music2,
  BookOpen,
  PartyPopper,
  Mail,
  Sparkles,
  Star,
  Gift,
  Send,
  Headphones,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Animated } from "@/components/ui/animated";
import { siteConfig } from "@/config/site";
import logoKids from "@/assets/kids/logo-kids.webp";

const kidsPillars = [
  {
    icon: Mic,
    title: "Com a Voz dos Papás",
    description:
      "Dedicatórias em áudio com a voz do papá, da mamã, dos avós ou padrinhos a mandar beijinhos no ar!",
    gradient: "from-pink-500 to-rose-500",
    border: "border-pink-200 hover:border-pink-400",
    bg: "bg-pink-50/70",
  },
  {
    icon: PartyPopper,
    title: "Parabéns & Conquistas",
    description:
      "Aniversários, primeiro dentinho, boas notas na escola ou momentos especiais celebrados com muita festa!",
    gradient: "from-amber-400 to-orange-500",
    border: "border-amber-200 hover:border-amber-400",
    bg: "bg-amber-50/70",
  },
  {
    icon: BookOpen,
    title: "Poemas & Histórias à Medida",
    description:
      "Leitura de mensagens carinhosas, poemas infantis ou pequenas histórias onde o seu filho é o herói.",
    gradient: "from-sky-400 to-blue-500",
    border: "border-sky-200 hover:border-sky-400",
    bg: "bg-sky-50/70",
  },
  {
    icon: Music2,
    title: "Música & Playlist Favorita",
    description:
      "A canção preferida da pequenada, uma música cantada em família ou uma playlist sob medida para o dia dele(a)!",
    gradient: "from-emerald-400 to-teal-500",
    border: "border-emerald-200 hover:border-emerald-400",
    bg: "bg-emerald-50/70",
  },
];

const parentSteps = [
  {
    step: "1",
    title: "Os Pais Escrevem-nos",
    text: "O papá, a mamã ou familiar envia-nos um email a contar quem é a criança e qual é a surpresa.",
    color: "bg-pink-500",
  },
  {
    step: "2",
    title: "Orçamento à Medida",
    text: "Respondemos com o orçamento personalizado e ajudamos a preparar o áudio, texto ou playlist.",
    color: "bg-amber-500",
  },
  {
    step: "3",
    title: "Sorrisos no Ar!",
    text: "Na hora combinada, sintonize a rádio em família e veja a alegria do seu pequeno ao ouvir o nome dele!",
    color: "bg-sky-500",
  },
];

export default function KidsDedicatoriasSection() {
  const emailSubject = encodeURIComponent(
    "Pedido de Orçamento — Dedicatória Kids na Rádio (Pedido dos Pais)"
  );
  const emailBody = encodeURIComponent(
    "Olá equipa Olha que Duas!\n\nSou pai/mãe/familiar e gostaria de pedir um orçamento para fazer uma dedicatória especial na rádio para o(a) nosso(a) pequeno(a):\n\n- Nome dos pais / familiar responsável:\n- Nome da criança:\n- Idade da criança:\n- Ocasião (Aniversário, Surpresa, Conquista, Música favorita, etc.):\n- Tipo de dedicatória (Áudio com a nossa voz / Leitura de mensagem ou história / Música ou Playlist):\n- A nossa ideia para a mensagem:\n\nObrigado(a)!"
  );
  const mailtoHref = `mailto:${siteConfig.contact.email}?subject=${emailSubject}&body=${emailBody}`;

  return (
    <section
      id="dedicatorias-kids"
      aria-labelledby="dedicatorias-kids-heading"
      className="relative py-20 md:py-28 overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, #fff9e6 0%, #fdf2f8 45%, #e0f2fe 85%, #fff9e6 100%)",
      }}
    >
      {/* Decorative floating elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute -top-16 -left-16 w-72 h-72 rounded-full bg-pink-300/25 blur-3xl" />
        <div className="absolute top-1/3 -right-20 w-80 h-80 rounded-full bg-yellow-300/30 blur-3xl" />
        <div className="absolute bottom-10 left-1/4 w-72 h-72 rounded-full bg-sky-300/25 blur-3xl" />

        <Star className="hidden md:block absolute top-14 left-[10%] w-7 h-7 text-yellow-400 fill-yellow-300 animate-twinkle-1" />
        <Heart className="hidden md:block absolute top-24 right-[12%] w-7 h-7 text-pink-400 fill-pink-300 animate-float-1" />
        <Sparkles className="hidden md:block absolute bottom-24 left-[8%] w-6 h-6 text-sky-400 animate-twinkle-2" />
        <Star className="hidden md:block absolute bottom-16 right-[10%] w-6 h-6 text-amber-400 fill-amber-300 animate-twinkle-3" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header — Speaking directly to Parents & Family */}
        <Animated animation="fade-up" className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg mb-6 border-4 border-white">
            <Gift className="w-4 h-4 animate-bounce" />
            <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider">
              Especial para Pais, Avós &amp; Família
            </span>
            <Heart className="w-4 h-4 fill-yellow-300 text-yellow-300" />
          </div>

          <h2
            id="dedicatorias-kids-heading"
            className="font-display font-bold text-4xl sm:text-5xl md:text-6xl text-charcoal leading-[1.05]"
          >
            A Voz da Família na{" "}
            <span className="text-pink-600">Nossa Rádio Kids!</span>
            <span className="block text-2xl sm:text-3xl md:text-4xl mt-3 text-sky-700">
              O carinho dos papás no tom certo ✨
            </span>
          </h2>

          <p className="mt-5 text-lg md:text-xl text-charcoal/80 leading-relaxed">
            Já imaginou a carinha de felicidade do seu filho(a) ao ouvir o próprio
            nome na rádio?{" "}
            <strong className="text-pink-600">
              Os pais (ou familiares) escrevem-nos o pedido
            </strong>{" "}
            e nós transformamos o vosso amor numa dedicatória mágica na programação da{" "}
            <span className="font-bold text-charcoal">Olha que Duas</span>!
          </p>
        </Animated>

        {/* Main Grid: Visual Kids Studio Card + 4 Kids Pillars */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10 max-w-6xl mx-auto items-stretch">
          {/* Left Column: Playful Kids version of the "A Sua Voz na Rádio" card */}
          <Animated animation="fade-right" className="lg:col-span-5 flex">
            <div className="relative w-full flex flex-col justify-between rounded-[2rem] p-6 sm:p-8 border-[6px] border-white shadow-2xl overflow-hidden bg-gradient-to-br from-pink-500 via-rose-500 to-amber-400 text-white">
              {/* Decorative circles inside poster card */}
              <div className="absolute -top-12 -right-12 w-44 h-44 bg-yellow-300/30 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-12 -left-12 w-44 h-44 bg-sky-300/30 rounded-full blur-2xl pointer-events-none" />

              {/* Top Header: Logo Kids + ON AIR Kids badge */}
              <div className="relative z-10 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-2xl bg-white/95 p-1.5 shadow-lg border-2 border-yellow-300 flex items-center justify-center">
                    <img
                      src={logoKids}
                      alt="Olha que Duas Kids"
                      className="w-full h-full object-contain"
                      loading="lazy"
                    />
                  </div>
                  <div>
                    <span className="block text-[11px] font-extrabold uppercase tracking-widest text-yellow-200">
                       Surpresa na Rádio
                    </span>
                    <span className="font-display font-bold text-xl leading-tight">
                      Dedicatórias Kids
                    </span>
                  </div>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white text-pink-600 font-extrabold text-xs uppercase tracking-wider shadow-md border-2 border-yellow-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  No Ar
                </div>
              </div>

              {/* Center Visual: Microphone + Soundwave with Hearts + Note from Parents */}
              <div className="relative z-10 my-7 text-center">
                <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-full bg-white text-pink-500 shadow-[0_10px_25px_rgba(0,0,0,0.2)] border-4 border-yellow-300 mb-4 animate-bob-medium">
                  <Mic className="w-11 h-11 text-pink-600" />
                  <Star className="absolute -top-2 -right-2 w-7 h-7 text-yellow-400 fill-yellow-300 animate-twinkle-1" />
                  <Heart className="absolute -bottom-1 -left-2 w-6 h-6 text-rose-500 fill-rose-500 animate-twinkle-2" />
                </div>

                <h3 className="font-display font-bold text-3xl sm:text-4xl text-white drop-shadow-md leading-tight">
                  “Um beijinho muito especial do Papá e da Mamã!”
                </h3>

                {/* Colorful Heart Soundwave SVG */}
                <div className="flex items-center justify-center my-4" aria-hidden="true">
                  <svg
                    viewBox="0 0 300 40"
                    className="w-56 sm:w-64 h-auto text-yellow-200"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8 20 H55 L62 10 L69 30 L76 6 L83 34 L90 12 L97 28 L104 20 H125"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M150 31 C150 31 134 20 134 12 C134 7.5 138 4.5 142.5 4.5 C146 4.5 148.5 6.5 150 9 C151.5 6.5 154 4.5 157.5 4.5 C162 4.5 166 7.5 166 12 C166 20 150 31 150 31 Z"
                      stroke="#fde047"
                      strokeWidth="2.5"
                      fill="#fde047"
                    />
                    <path
                      d="M175 20 H196 L203 12 L210 28 L217 6 L224 34 L231 10 L238 30 L245 20 H292"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                {/* Little Paper Note from Parents ("Cartinha dos Pais") */}
                <div className="mx-auto max-w-xs rotate-[-1.5deg] rounded-2xl bg-yellow-100 text-charcoal p-4 shadow-xl border-2 border-yellow-300 text-left">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-pink-600">
                      💌 Bilhete dos Papás
                    </span>
                    <Headphones className="w-4 h-4 text-pink-500" />
                  </div>
                  <p className="font-display font-bold text-base text-charcoal leading-snug">
                    “Para o nosso pequeno tesouro, com todo o orgulho do mundo! Feliz dia!”
                  </p>
                  <p className="text-xs text-charcoal/70 mt-1.5 font-semibold">
                    — Pedido enviado pelos pais para a rádio ♡
                  </p>
                </div>
              </div>

              {/* Bottom Note inside card */}
              <div className="relative z-10 rounded-2xl bg-white/20 backdrop-blur-sm border-2 border-white/40 p-3.5 text-center">
                <p className="text-xs sm:text-sm font-bold text-white">
                  👨‍👩‍👧‍👦 Nota importante: Os pedidos de dedicatória e orçamento são sempre feitos pelos{" "}
                  <span className="underline decoration-yellow-300 decoration-2">
                    pais ou adultos responsáveis
                  </span>
                  .
                </p>
              </div>
            </div>
          </Animated>

          {/* Right Column: 4 Kids Pillars + 3 Steps for Parents */}
          <Animated animation="fade-left" delay={150} className="lg:col-span-7 flex flex-col justify-between gap-6">
            {/* 4 Pillars Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {kidsPillars.map(({ icon: Icon, title, description, gradient, border, bg }) => (
                <div
                  key={title}
                  className={`group p-5 rounded-3xl bg-white border-2 ${border} shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}
                >
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`w-13 h-13 p-3 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-md flex-shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-transform`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-xl text-charcoal mb-1">
                        {title}
                      </h3>
                      <p className="text-sm text-charcoal/75 leading-relaxed">
                        {description}
                      </p>
                    </div>
                  </div>
                  <div className={`mt-3 h-1.5 w-16 rounded-full ${bg}`} />
                </div>
              ))}
            </div>

            {/* 3 Steps for Parents */}
            <div className="rounded-3xl bg-white border-4 border-sky-200 p-5 sm:p-6 shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-pink-500" />
                <h4 className="font-display font-bold text-xl sm:text-2xl text-charcoal">
                  Como os Pais podem pedir uma dedicatória?
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {parentSteps.map(({ step, title, text, color }) => (
                  <div
                    key={step}
                    className="relative rounded-2xl bg-sky-50/70 border border-sky-200/80 p-4"
                  >
                    <div className="flex items-center gap-2.5 mb-2">
                      <span
                        className={`w-7 h-7 rounded-full ${color} text-white font-extrabold text-xs flex items-center justify-center shadow`}
                      >
                        {step}
                      </span>
                      <span className="font-display font-bold text-base text-charcoal">
                        {title}
                      </span>
                    </div>
                    <p className="text-xs text-charcoal/75 leading-relaxed">{text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Big CTA Banner for Parents to Request a Quote */}
            <div className="relative rounded-3xl bg-gradient-to-r from-yellow-300 via-amber-300 to-yellow-400 border-4 border-white p-6 sm:p-7 shadow-xl overflow-hidden">
              <div className="relative z-10 flex flex-col gap-4">
                <div>
                  <span className="inline-block px-3 py-1 rounded-full bg-white/90 text-pink-600 font-extrabold text-[11px] uppercase tracking-wider mb-2 shadow-sm">
                    💌 Fale Connosco — Espaço dos Pais
                  </span>
                  <h3 className="font-display font-bold text-2xl sm:text-3xl text-charcoal leading-tight">
                    Papá ou Mamã: peça já o seu orçamento e surpreenda o seu pequeno!
                  </h3>
                  <p className="text-sm sm:text-base text-charcoal/85 mt-1.5">
                    Escreva para o nosso email com a mensagem ou homenagem que deseja fazer para o seu filho(a) na rádio.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-1">
                  <Button
                    asChild
                    size="lg"
                    className="h-14 px-7 text-sm sm:text-base font-extrabold rounded-full bg-pink-500 hover:bg-pink-600 text-white shadow-[0_8px_0_rgba(190,24,93,0.6)] hover:shadow-[0_5px_0_rgba(190,24,93,0.6)] hover:translate-y-0.5 transition-all border-4 border-white"
                  >
                    <a href={mailtoHref} className="inline-flex items-center justify-center gap-2">
                      <Mail className="w-5 h-5" />
                      Pedir Orçamento por Email
                    </a>
                  </Button>

                  <Button
                    asChild
                    size="lg"
                    className="h-14 px-7 text-sm sm:text-base font-extrabold rounded-full bg-white hover:bg-pink-50 text-pink-600 shadow-[0_8px_0_rgba(202,138,4,0.45)] hover:shadow-[0_5px_0_rgba(202,138,4,0.45)] hover:translate-y-0.5 transition-all border-4 border-pink-300"
                  >
                    <Link
                      to="/?assunto=dedicatorias-kids#contacto"
                      className="inline-flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      Usar Formulário do Site
                    </Link>
                  </Button>
                </div>

                {/* Visible email address for parents */}
                <div className="pt-3 border-t border-charcoal/10 flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm font-semibold text-charcoal/85">
                  <span className="inline-flex items-center gap-1.5">
                    <Mail className="w-4 h-4 text-pink-600" />
                    Email para orçamentos:{" "}
                    <a
                      href={mailtoHref}
                      className="font-extrabold text-pink-700 underline underline-offset-2 hover:text-pink-800"
                    >
                      {siteConfig.contact.email}
                    </a>
                  </span>
                  <span className="text-pink-700 font-bold">
                    ✨ Uma recordação para toda a família!
                  </span>
                </div>
              </div>
            </div>
          </Animated>
        </div>
      </div>
    </section>
  );
}
