import { useState } from "react";
import { Play } from "lucide-react";
import { siteConfig } from "@/config/site";
import alexandraImg from "@/assets/alexandra.jpg";
import marluceImg from "@/assets/marluce.jpg";
import leoImg from "@/assets/leo.png";

// Home «Quem somos» (20/11/2026): short line per person, full bio in «Ler mais»
// (still in the HTML), the presentation video and the partner logos.
const people = [
  {
    name: "Alexandra Serra",
    image: alexandraImg,
    role: "Fundadora · Diretora",
    short: "Marketing, comunicação e redes sociais; curadora de eventos culturais.",
    description:
      "Especialista em marketing e comunicação, com sólida experiência na gestão de redes sociais, equipas e projetos de grande impacto. Atuou como colaboradora e diretora de meios de comunicação. Curadora de eventos culturais, integrando criatividade e estratégia na construção de marcas e narrativas. Alia visão empreendedora à capacidade de impulsionar negócios e desenvolver soluções inovadoras em gestão e comunicação social.",
    position: "50% 25%",
  },
  {
    name: "Marluce Revoredo",
    image: marluceImg,
    role: "Fundadora · Diretora",
    short: "Relações públicas e imagem; produtora de eventos e fashion advisor.",
    description:
      "Empresária de relações públicas com uma carreira marcada por parcerias com alguns dos nomes mais influentes da publicidade em Portugal. Com forte ligação aos meios de comunicação social, construiu uma reputação sólida na gestão de imagem, networking estratégico e comunicação de alto impacto. Com experiência no universo da moda como fashion advisor, destacou-se também na produção de eventos e no lançamento de novos talentos através da Marluce Produções, onde impulsiona carreiras e cria projetos que unem criatividade, visibilidade e estratégia.",
    position: "50% 50%",
  },
  {
    name: "Leo Schlanger",
    image: leoImg,
    role: "Diretor/CTO · Presença digital",
    short: "Tecnologia, segurança e tudo o que põe a rádio e o site no ar.",
    description:
      "Desenvolvedor de software sénior com expertise em cibersegurança e infraestrutura. Apaixonado por automações e tecnologias Web3, é o responsável por toda a vertente tecnológica do projeto, garantindo soluções robustas, seguras e inovadoras que sustentam a presença digital do Olha que Duas.",
    position: "50% 50%",
  },
];

function PresentationVideo() {
  const [playing, setPlaying] = useState(false);
  const { youtubeId, title } = siteConfig.video;
  return (
    <div className="relative aspect-video overflow-hidden rounded-2xl bg-charcoal shadow-lg">
      {playing ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0&modestbranding=1&autoplay=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          className="group absolute inset-0 h-full w-full"
          aria-label="Ver a nossa apresentação em vídeo"
        >
          <img
            src={`https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`}
            alt=""
            width={480}
            height={360}
            loading="lazy"
            className="h-full w-full object-cover"
          />
          <span className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-vermelho-forte text-white shadow-xl transition-transform group-hover:scale-110">
            <Play className="ml-1 h-7 w-7" fill="currentColor" />
          </span>
          <span className="absolute bottom-3 left-4 text-base font-semibold text-white">Veja a nossa apresentação</span>
        </button>
      )}
    </div>
  );
}

const SobreNos = () => (
  <section id="sobre" className="bg-background py-16 md:py-24">
    <div className="container mx-auto px-4 sm:px-6">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="min-w-0 lg:col-span-7">
          <p className="text-sm font-bold uppercase tracking-widest text-vermelho-forte">Quem somos</p>
          <h2 className="mt-2 font-display text-3xl font-semibold leading-tight text-foreground sm:text-4xl md:text-5xl">
            Somos duas, mas multiplicamos
          </h2>
          <p className="mt-4 max-w-xl text-base text-muted-foreground md:text-lg">
            Duas comunicadoras luso-brasileiras que juntaram a rádio, a escrita e a estratégia de marca num só
            projeto, com quem as ajuda a pô-lo no ar.
          </p>

          <ul className="mt-8 space-y-4">
            {people.map((p) => (
              <li key={p.name} className="flex gap-4 rounded-2xl border border-border/50 bg-background p-4 shadow-sm md:p-5">
                <img
                  src={p.image}
                  alt={p.name}
                  width={72}
                  height={72}
                  loading="lazy"
                  className="h-16 w-16 shrink-0 rounded-full object-cover md:h-[72px] md:w-[72px]"
                  style={{ objectPosition: p.position }}
                />
                <div className="min-w-0">
                  <h3 className="font-display text-xl font-semibold text-foreground">{p.name}</h3>
                  <p className="text-sm font-bold text-vermelho-forte">{p.role}</p>
                  <details className="group mt-1">
                    <summary className="cursor-pointer list-none text-base text-muted-foreground [&::-webkit-details-marker]:hidden">
                      {p.short}{" "}
                      <span className="font-semibold text-vermelho-forte underline underline-offset-2 group-open:hidden">Ler mais</span>
                    </summary>
                    <p className="mt-2 text-base leading-relaxed text-muted-foreground">{p.description}</p>
                  </details>
                </div>
              </li>
            ))}
          </ul>

          <blockquote className="mt-8 border-l-4 border-amarelo pl-5 font-display text-xl italic leading-relaxed text-foreground md:text-2xl">
            «Onde a força é propósito, a comunicação é ponte e o afeto é estratégia.»
          </blockquote>
        </div>

        <div className="min-w-0 lg:col-span-5">
          <PresentationVideo />
          <h3 className="mt-8 text-sm font-bold uppercase tracking-widest text-muted-foreground">Quem caminha connosco</h3>
          <ul className="mt-4 flex flex-wrap gap-3">
            {siteConfig.partners.map((partner) => {
              const logo = (
                <img
                  src={partner.logo}
                  alt={partner.name}
                  width={64}
                  height={64}
                  loading="lazy"
                  className="h-16 w-16 rounded-lg object-contain"
                />
              );
              const box = "block rounded-xl bg-white p-1 shadow-sm ring-1 ring-black/5";
              return (
                <li key={partner.name}>
                  {partner.url && partner.url !== "#" ? (
                    <a href={partner.url} target="_blank" rel="noopener noreferrer" title={partner.name} className={`${box} transition-transform hover:scale-105`}>
                      {logo}
                    </a>
                  ) : (
                    <span title={partner.name} className={box}>{logo}</span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  </section>
);

export default SobreNos;
