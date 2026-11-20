import { routeMeta } from "@/lib/routeMeta";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Clapperboard, Handshake, Lightbulb, Mail, Mic, Newspaper, Radio, Share2, type LucideIcon } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import Contacto from "@/components/Contacto";
import { useMetaTags, getPageBreadcrumbJsonLd } from "@/hooks/useMetaTags";
import { useExclusivePrograms } from "@/hooks/useExclusivePrograms";
import { siteConfig } from "@/config/site";
import fotoJuntas from "@/assets/olha-que-duas-foto.jpg";
import alexandraImg from "@/assets/alexandra.jpg";
import marluceImg from "@/assets/marluce.jpg";
import leoImg from "@/assets/leo.png";

/*
 * /servicos (20/11/2026): designer proposal + marketing copy (rev. 2), approved
 * by Leo. No prices, packages or deadlines. Ids never repeat the home ones
 * (#radio, #podcast, #app, #dedicatorias, #inicio): the seasonal CSS paints them.
 */

const PAGE_URL = "https://www.olhaqueduas.com/servicos";

interface Service {
  id: string;
  subject: string;
  icon: LucideIcon;
  kind: string;
  title: string;
  text: string;
  items: string[];
  cta: string;
  schemaName: string;
}

// Single source for the cards, the hero index and the JSON-LD catalogue.
export const SERVICES: Service[] = [
  {
    id: "consultoria",
    subject: "consultoria",
    icon: Lightbulb,
    kind: "Consultoria de comunicação · Por onde começar",
    title: "«Não sei o que comunicar nem por onde começar.»",
    text: "Olhamos para o seu negócio, para o que já faz e para quem quer alcançar, e dizemos-lhe o que mudar primeiro.",
    items: [
      "Uma conversa sobre o seu negócio e os seus clientes",
      "Uma leitura das suas redes, do site e da imagem",
      "Recomendações práticas, por escrito",
      "Pode começar pela auditoria gratuita de 15 minutos",
    ],
    cta: "Pedir consultoria",
    schemaName: "Consultoria de comunicação",
  },
  {
    id: "redes",
    subject: "redes",
    icon: Share2,
    kind: "Gestão de redes e conteúdos",
    title: "«As minhas redes estão paradas.»",
    text: "Nós tratamos disso. Planeamos, escrevemos, desenhamos e publicamos, com o tom da sua marca.",
    items: [
      "Um plano do que vai ser publicado",
      "Publicações, stories e legendas feitos por nós",
      "Publicação agendada, sem ter de se lembrar",
    ],
    cta: "Quero ajuda com as redes",
    schemaName: "Gestão de redes sociais e conteúdos",
  },
  {
    id: "anuncio-radio",
    subject: "radio",
    icon: Radio,
    kind: "Anúncio na rádio",
    title: "«Quero que mais gente ouça falar de mim.»",
    text: "Escrevemos e gravamos o seu anúncio com as vozes da rádio, e pomo-lo a passar na nossa programação.",
    items: [
      "O texto do anúncio, escrito por nós",
      "A gravação com as vozes do Olha que Duas",
      "Passagens na rádio online 24 horas, no site e na app",
    ],
    cta: "Anunciar na rádio",
    schemaName: "Anúncios na rádio",
  },
  {
    id: "video",
    subject: "video",
    icon: Clapperboard,
    kind: "Vídeo e reels",
    title: "«Preciso de vídeos para as redes.»",
    text: "Transformamos as suas imagens em reels curtos, prontos a publicar.",
    items: [
      "Reels verticais editados a partir das suas imagens",
      "Legendas no ecrã, para quem vê sem som",
      "Música com licença",
      "Se for preciso filmar, falamos disso no orçamento",
    ],
    cta: "Pedir vídeo",
    schemaName: "Vídeo e reels",
  },
];

const EXTRAS = [
  { icon: Newspaper, title: "Assessoria de imprensa", text: "Notas de imprensa e contacto com jornalistas, pela Marluce Revorêdo." },
  { icon: Mic, title: "Podcast", text: "Participação no podcast Olha que Duas." },
  { icon: Handshake, title: "Representação de marcas", text: "Damos a cara por marcas alinhadas com os nossos valores." },
];

const STEPS = [
  { title: "Conversa", text: "Conte-nos o que faz, a quem vende e o que quer mudar." },
  { title: "Proposta à medida", text: "Dizemos o que faz sentido para si e quanto custa. Sem pacotes fechados." },
  { title: "Mãos à obra", text: "Tratamos de tudo e acertamos consigo pelo caminho." },
];

const TEAM = [
  { name: "Alexandra Serra", role: "Marketing, comunicação e redes sociais.", img: alexandraImg, pos: "50% 25%" },
  { name: "Marluce Revorêdo", role: "Relações públicas, imagem e imprensa.", img: marluceImg, pos: "50% 50%" },
  { name: "Leo Schlanger", role: "Tecnologia: põe a rádio e o site no ar.", img: leoImg, pos: "50% 50%" },
];

// Visible FAQ = FAQPage JSON-LD (same text).
export const FAQ = [
  { q: "Quanto custa?", a: "Depende do que precisa. Depois de uma conversa, enviamos um orçamento à medida, sem compromisso." },
  { q: "Por onde começo se não sei o que preciso?", a: "Pela consultoria ou pela auditoria gratuita de 15 minutos. Saímos de lá com o primeiro passo claro." },
  { q: "Têm de filmar no meu negócio para fazer reels?", a: "Não necessariamente. Trabalhamos com as imagens que já tem; se for preciso filmar, falamos disso no orçamento." },
  { q: "Quem grava o anúncio de rádio?", a: "As vozes do Olha que Duas." },
  { q: "Onde se ouve a rádio?", a: "Online, 24 horas por dia, no site olhaqueduas.com e na app Olha que Duas para Android." },
  { q: "Quem vai tratar da minha marca?", a: "A Alexandra Serra e a Marluce Revorêdo, com o Leo Schlanger na parte técnica." },
];

/** Card/CTA click: pre-select the form subject, then scroll to the form. */
export function askAbout(subject: string, event?: { preventDefault(): void }) {
  event?.preventDefault();
  window.dispatchEvent(new CustomEvent("select-contact-subject", { detail: subject }));
  document.getElementById("fale-connosco")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

const btn = "inline-flex h-[52px] items-center justify-center gap-2 rounded-full px-7 text-lg font-bold transition-colors";

function servicesJsonLd() {
  return [
    getPageBreadcrumbJsonLd("Serviços", PAGE_URL),
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${PAGE_URL}#webpage`,
      url: PAGE_URL,
      name: "Serviços de comunicação para negócios",
      inLanguage: "pt-PT",
      dateModified: "2026-11-20",
      isPartOf: { "@id": "https://www.olhaqueduas.com/#website" },
    },
    {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      "@id": `${PAGE_URL}#service`,
      name: "Olha que Duas — agência de comunicação",
      description:
        "Agência de comunicação com rádio própria: consultoria de comunicação, gestão de redes sociais, anúncios na rádio e vídeo para negócios.",
      url: PAGE_URL,
      email: siteConfig.contact.deliveryEmail,
      areaServed: { "@type": "Country", name: "Portugal" },
      sameAs: Object.values(siteConfig.social),
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Serviços de comunicação",
        itemListElement: SERVICES.map((s) => ({
          "@type": "Service",
          "@id": `${PAGE_URL}#${s.id}`,
          name: s.schemaName,
          description: s.text,
          provider: { "@id": "https://www.olhaqueduas.com/#organization" },
        })),
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQ.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];
}

const Servicos = () => {
  const { data: programs } = useExclusivePrograms();
  useMetaTags({
    ...routeMeta("/servicos"),
    jsonLd: servicesJsonLd(),
  });

  const [lead, ...rest] = SERVICES;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      {/* No top padding on main: the dark hero starts under the fixed header (its own pt) */}
      <main id="main-content">
        {/* 1 · Hero */}
        <section id="inicio-servicos" className="bg-tinta text-cream">
          <div className="container mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 pb-12 pt-32 sm:px-6 md:pb-16 md:pt-40 lg:grid-cols-12 lg:pb-20 lg:pt-44">
            <div className="min-w-0 lg:col-span-7">
              <p className="text-sm font-bold uppercase tracking-widest text-amarelo">Agência de comunicação com rádio própria</p>
              <h1 className="mt-3 font-display text-4xl font-semibold leading-[1.1] sm:text-5xl lg:text-6xl">
                Comunicação para o seu negócio: <span className="text-amarelo">consultoria, redes sociais, rádio e vídeo</span>
              </h1>
              <p className="mt-5 max-w-xl text-lg text-cream/85">
                Dizemos-lhe o que comunicar e tratamos de o pôr nas redes, no ar e em vídeo. Fale connosco e fazemos um orçamento à medida.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <a href="#fale-connosco" onClick={(e) => askAbout("consultoria", e)} className={`${btn} bg-amarelo text-tinta hover:bg-amarelo-soft`}>
                  Fale connosco
                </a>
                <Link to="/auditoria-gratuita" className={`${btn} border-2 border-cream/60 text-cream hover:bg-cream/10`}>
                  Auditoria gratuita de 15 min
                </Link>
              </div>
              <p className="mt-6 text-[15px] text-cream/85">Parceiros oficiais do Rock in Rio Lisboa 2026 · Rádio online 24 horas</p>
            </div>
            <nav aria-label="Em que podemos ajudar" className="hidden min-w-0 lg:col-span-5 lg:block">
              <div className="rounded-2xl border border-cream/15 bg-cream/5 p-5">
                <p className="text-sm font-bold uppercase tracking-widest text-amarelo">Em que podemos ajudar</p>
                <ul className="mt-3 divide-y divide-cream/10">
                  {SERVICES.map((s) => (
                    <li key={s.id}>
                      <a href={`#${s.id}`} className="flex items-center justify-between gap-3 py-3 text-base font-semibold text-cream hover:text-amarelo">
                        {s.schemaName}
                        <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </nav>
          </div>
        </section>

        {/* 2 · O que somos */}
        <section id="o-que-somos" className="py-14 md:py-20">
          <div className="container mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-4 sm:px-6 lg:grid-cols-2">
            <div className="min-w-0">
              <h2 className="font-display text-3xl font-semibold text-foreground md:text-5xl">Quem somos, em três frases</h2>
              <ol className="mt-6 space-y-4">
                {[
                  "O Olha que Duas é uma agência de comunicação e uma rádio online 24 horas, com programas próprios.",
                  "A Alexandra Serra trata da estratégia, das redes e dos conteúdos; a Marluce Revorêdo das relações públicas, da imagem e dos contactos com a imprensa.",
                  "Por isso, quando trabalhamos a sua marca, faz-se com as mesmas vozes e a mesma equipa que fazem a rádio.",
                ].map((t, i) => (
                  <li key={i} className="flex gap-4 text-lg text-foreground">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amarelo font-bold text-tinta">{i + 1}</span>
                    <span className="min-w-0">{t}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div className="mx-auto w-full min-w-0 max-w-md lg:max-w-none">
              <img
                src={fotoJuntas}
                alt="Alexandra Serra e Marluce Revorêdo"
                width={1024}
                height={1536}
                loading="lazy"
                className="aspect-square w-full rounded-3xl object-cover object-[50%_40%] shadow-lg lg:aspect-[5/6]"
              />
            </div>
          </div>
        </section>

        {/* 3 · Como podemos ajudar */}
        <section id="servicos" className="bg-muted/40 py-14 md:py-20">
          <div className="container mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="font-display text-3xl font-semibold text-foreground md:text-5xl">Diga-nos o que precisa</h2>
            <p className="mt-3 text-lg text-muted-foreground">Escolha o que mais se parece com o seu caso. Se não souber, comece pela consultoria.</p>

            {/* Lead card: consultoria */}
            <article id={lead.id} className="mt-8 scroll-mt-28 rounded-3xl bg-vermelho-forte p-6 text-white md:p-8">
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                <div className="min-w-0">
                  <lead.icon className="h-8 w-8" aria-hidden="true" />
                  <p className="mt-4 text-sm font-bold uppercase tracking-wider">{lead.kind}</p>
                  <h3 className="mt-2 font-display text-3xl font-semibold leading-tight md:text-4xl">{lead.title}</h3>
                  <p className="mt-3 text-lg">{lead.text}</p>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold uppercase tracking-wider">O que recebe</p>
                  <ul className="mt-3 space-y-2">
                    {lead.items.map((it) => (
                      <li key={it} className="flex gap-3 text-base">
                        <Check className="mt-1 h-4 w-4 shrink-0" aria-hidden="true" />
                        {it}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                    <a href="#fale-connosco" onClick={(e) => askAbout(lead.subject, e)} className={`${btn} bg-cream text-tinta hover:bg-white`}>
                      {lead.cta}
                    </a>
                    <Link to="/auditoria-gratuita" className="text-lg font-semibold underline underline-offset-4">
                      Ou faça a auditoria gratuita
                    </Link>
                  </div>
                </div>
              </div>
            </article>

            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {rest.map((s) => (
                <article key={s.id} id={s.id} className="flex min-w-0 scroll-mt-28 flex-col rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5">
                  <s.icon className="h-7 w-7 text-vermelho-forte" aria-hidden="true" />
                  <p className="mt-4 text-sm font-bold uppercase tracking-wider text-vermelho-forte">{s.kind}</p>
                  <h3 className="mt-2 font-display text-2xl font-semibold leading-tight text-[#2b1a12]">{s.title}</h3>
                  <p className="mt-3 text-base text-[#5c4f45]">{s.text}</p>
                  <p className="mt-5 text-sm font-bold uppercase tracking-wider text-[#5c4f45]">O que recebe</p>
                  <ul className="mb-6 mt-2 space-y-2">
                    {s.items.map((it) => (
                      <li key={it} className="flex gap-3 text-base text-[#2b1a12]">
                        <Check className="mt-1 h-4 w-4 shrink-0 text-vermelho-forte" aria-hidden="true" />
                        {it}
                      </li>
                    ))}
                  </ul>
                  <a
                    href="#fale-connosco"
                    onClick={(e) => askAbout(s.subject, e)}
                    className={`${btn} mt-auto w-full bg-vermelho-forte text-white hover:bg-vermelho-forte/90`}
                  >
                    {s.cta}
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* 4 · Também fazemos (Leo, 20/11: stays) */}
        <section id="tambem" className="py-14 md:py-20">
          <div className="container mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="font-display text-3xl font-semibold text-foreground md:text-5xl">E ainda</h2>
            <ul className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
              {EXTRAS.map((x) => (
                <li key={x.title} className="flex min-w-0 gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
                  <x.icon className="mt-1 h-6 w-6 shrink-0 text-vermelho-forte" aria-hidden="true" />
                  <span className="min-w-0">
                    <span className="block text-lg font-bold text-[#2b1a12]">{x.title}</span>
                    <span className="block text-base text-[#5c4f45]">{x.text}</span>
                  </span>
                </li>
              ))}
            </ul>
            <a href="#fale-connosco" onClick={(e) => askAbout("outro", e)} className="mt-6 inline-block text-lg font-semibold text-vermelho-forte underline underline-offset-4">
              Falar sobre outro assunto →
            </a>
          </div>
        </section>

        {/* 5 · Como trabalhamos */}
        <section id="como-trabalhamos" className="bg-muted/40 py-14 md:py-20">
          <div className="container mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="font-display text-3xl font-semibold text-foreground md:text-5xl">Como funciona</h2>
            <ol className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
              {STEPS.map((s, i) => (
                <li key={s.title} className="min-w-0">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-vermelho-forte font-display text-2xl font-semibold text-vermelho-forte">
                    {i + 1}
                  </span>
                  <h3 className="mt-3 font-display text-2xl font-semibold text-foreground">{s.title}</h3>
                  <p className="mt-1 text-base text-muted-foreground">{s.text}</p>
                </li>
              ))}
            </ol>
            <a href="#fale-connosco" onClick={(e) => askAbout("outro", e)} className={`${btn} mt-8 bg-vermelho-forte text-white hover:bg-vermelho-forte/90`}>
              Fale connosco
            </a>
          </div>
        </section>

        {/* 6 · Provas */}
        <section id="provas" className="py-14 md:py-20">
          <div className="container mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="font-display text-3xl font-semibold text-foreground md:text-5xl">O que já fazemos todos os dias</h2>
            <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
              Antes de tratar da sua marca, tratamos da nossa. Tudo o que vê aqui foi feito pela mesma equipa.
            </p>
            <dl className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {[
                ["24 h", "rádio online no ar, no site e na app"],
                // Live count (programs with a published piece); 6 on 20/11/2026.
                [String(programs?.length || 6), "programas próprios"],
                ["+50", "peças publicadas nos Programas"],
              ].map(([n, t]) => (
                <div key={t} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
                  <dt className="font-display text-5xl font-semibold text-[#2b1a12]">{n}</dt>
                  <dd className="mt-1 text-base text-[#5c4f45]">{t}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-lg font-semibold">
              <Link to="/programas" className="text-vermelho-forte underline underline-offset-4">Ver os Programas →</Link>
              <Link to="/galeria" className="text-vermelho-forte underline underline-offset-4">Ver a galeria →</Link>
            </p>

            <Link to="/rockinrio" className="mt-8 flex flex-col items-start gap-4 rounded-2xl bg-black p-5 text-white sm:flex-row sm:items-center md:p-6">
              <img
                src={siteConfig.rockInRio.partnerLetteringWhite}
                alt="Rock in Rio Lisboa"
                width={3508}
                height={2481}
                loading="lazy"
                className="h-20 w-auto md:h-24"
              />
              <span className="flex-1 text-lg font-semibold">Fomos parceiros oficiais do Rock in Rio Lisboa 2026.</span>
              <span className="text-lg font-semibold text-amarelo underline underline-offset-4">Ver como foi →</span>
            </Link>

            <h3 className="mt-10 font-display text-2xl font-semibold text-foreground md:text-3xl">Marcas que caminham connosco</h3>
            <ul className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-7">
              {siteConfig.partners.map((p) => (
                <li key={p.name} className="rounded-xl bg-white p-2 shadow-sm ring-1 ring-black/5">
                  <img src={p.logo} alt={p.name} width={96} height={96} loading="lazy" className="aspect-square w-full rounded-lg object-contain" />
                </li>
              ))}
            </ul>

            <h3 className="mt-10 font-display text-2xl font-semibold text-foreground md:text-3xl">Quem vai tratar de si</h3>
            <ul className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
              {TEAM.map((t) => (
                <li key={t.name} className="flex min-w-0 items-center gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5">
                  <img src={t.img} alt={t.name} width={64} height={64} loading="lazy" className="h-16 w-16 shrink-0 rounded-full object-cover" style={{ objectPosition: t.pos }} />
                  <span className="min-w-0">
                    <span className="block text-lg font-bold text-[#2b1a12]">{t.name}</span>
                    <span className="block text-base text-[#5c4f45]">{t.role}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 7 · Perguntas frequentes (native <details>: answers stay in the HTML for FAQPage) */}
        <section id="perguntas" className="bg-muted/40 py-14 md:py-20">
          <div className="container mx-auto max-w-3xl px-4 sm:px-6">
            <h2 className="font-display text-3xl font-semibold text-foreground md:text-5xl">Perguntas frequentes</h2>
            <div className="mt-6 divide-y divide-border">
              {FAQ.map((f, i) => (
                <details key={f.q} open={i === 0} className="group py-1">
                  <summary className="flex min-h-[60px] cursor-pointer list-none items-center justify-between gap-4 text-lg font-bold text-foreground [&::-webkit-details-marker]:hidden">
                    {f.q}
                    <span aria-hidden="true" className="text-2xl text-vermelho-forte group-open:rotate-45 transition-transform">+</span>
                  </summary>
                  <p className="pb-4 text-base text-muted-foreground">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* 8 · Fale connosco */}
        <section id="fale-connosco" className="scroll-mt-24 bg-tinta py-14 text-cream md:py-20">
          <div className="container mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 sm:px-6 lg:grid-cols-12">
            <div className="min-w-0 lg:col-span-7">
              <h2 className="font-display text-3xl font-semibold md:text-5xl">Fale connosco</h2>
              <p className="mt-3 text-lg text-cream/85">
                Diga-nos o que faz e o que precisa. Respondemos com um orçamento à medida, sem compromisso.
              </p>
              <div className="mt-6">
                <Contacto variant="servicos" />
              </div>
            </div>
            <aside className="min-w-0 space-y-4 lg:col-span-5 lg:pt-28">
              <a href={`mailto:${siteConfig.contact.email}`} className="flex gap-3 rounded-2xl border border-cream/15 p-5 hover:bg-cream/5">
                <Mail className="mt-1 h-5 w-5 shrink-0 text-amarelo" aria-hidden="true" />
                <span className="min-w-0">
                  <span className="block text-base text-cream/85">Prefere e-mail?</span>
                  <span className="block break-words text-lg font-semibold text-amarelo">
                    {siteConfig.contact.email.split("@")[0]}@<wbr />
                    {siteConfig.contact.email.split("@")[1]}
                  </span>
                </span>
              </a>
              <a href={siteConfig.social.instagram} target="_blank" rel="noopener noreferrer" className="block rounded-2xl border border-cream/15 p-5 hover:bg-cream/5">
                <span className="block text-base text-cream/85">Veja o nosso trabalho no Instagram</span>
                <span className="block text-lg font-semibold text-amarelo">@olhaqueduas2025</span>
              </a>
            </aside>
          </div>
        </section>
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
};

export default Servicos;
