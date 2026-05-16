import { useState } from 'react';
import {
  Calendar, MapPin, Clock, Music, Train, Bus, Car, Ticket,
  ExternalLink, Globe, Mic2, Radio, Headphones, Smartphone,
  Star, Users, Navigation, AlertTriangle,
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import { Animated } from '@/components/ui/animated';
import { useMetaTags } from '@/hooks/useMetaTags';
import { siteConfig } from '@/config/site';

/* ═══════════════════════════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════════════════════════ */

interface Artist {
  name: string;
  headliner?: boolean;
}

interface Stage {
  name: string;
  artists: Artist[];
}

interface Day {
  date: string;
  weekday: string;
  label: string;
  accent: string;
  accentBg: string;
  stages: Stage[];
}

const LINEUP: Day[] = [
  {
    date: '20 Junho',
    weekday: 'Sábado',
    label: 'Pop Day',
    accent: 'text-pink-400',
    accentBg: 'bg-pink-500/10 border-pink-500/20',
    stages: [
      { name: 'Palco Mundo', artists: [
        { name: 'Katy Perry', headliner: true }, { name: 'Charlie Puth' }, { name: 'Alok' }, { name: 'Nena' },
      ]},
      { name: 'Super Bock Stage', artists: [
        { name: 'Bebe Rexha' }, { name: 'Pedro Sampaio' }, { name: 'Calema' }, { name: 'NAPA' },
      ]},
      { name: 'Music Valley', artists: [
        { name: 'Maninho' }, { name: 'Audrey Nuna' }, { name: 'Sofia Camara' },
      ]},
    ],
  },
  {
    date: '21 Junho',
    weekday: 'Domingo',
    label: 'Rock Day',
    accent: 'text-red-400',
    accentBg: 'bg-red-500/10 border-red-500/20',
    stages: [
      { name: 'Palco Mundo', artists: [
        { name: 'Linkin Park', headliner: true }, { name: 'Cypress Hill' }, { name: 'The Pretty Reckless' }, { name: 'Grandson' },
      ]},
      { name: 'Music Valley', artists: [
        { name: 'Kaiser Chiefs' }, { name: 'Hoobastank' }, { name: 'Blasted Mechanism' },
      ]},
      { name: 'Super Bock Stage', artists: [
        { name: 'Sepultura' }, { name: 'P.O.D.' }, { name: 'Tara Perdida' },
      ]},
      { name: 'BacanaPlay Digital Stage', artists: [
        { name: 'Sam the Kid' }, { name: 'Orelha Negra' },
      ]},
    ],
  },
  {
    date: '27 Junho',
    weekday: 'Sábado',
    label: 'Legends Day',
    accent: 'text-amber-400',
    accentBg: 'bg-amber-500/10 border-amber-500/20',
    stages: [
      { name: 'Palco Mundo', artists: [
        { name: 'Rod Stewart', headliner: true }, { name: 'Cyndi Lauper' }, { name: '4 Non Blondes' }, { name: 'Shaggy' },
      ]},
      { name: 'Music Valley', artists: [
        { name: 'Xutos & Pontapés' }, { name: 'GNR' }, { name: 'UHF' }, { name: 'Táxi' }, { name: 'Jafumega' },
      ]},
      { name: 'Super Bock Stage', artists: [
        { name: 'Joss Stone' }, { name: 'The Wailers' }, { name: 'Belo' }, { name: 'SYRO' },
      ]},
    ],
  },
  {
    date: '28 Junho',
    weekday: 'Domingo',
    label: 'Urban Day',
    accent: 'text-violet-400',
    accentBg: 'bg-violet-500/10 border-violet-500/20',
    stages: [
      { name: 'Palco Mundo', artists: [
        { name: '21 Savage', headliner: true }, { name: 'Central Cee' }, { name: 'Rema' }, { name: 'Matué' },
      ]},
      { name: 'Music Valley', artists: [
        { name: 'Filipe Ret' }, { name: 'DENNIS' }, { name: 'Carlão' }, { name: 'Irina Barros' },
      ]},
      { name: 'Super Bock Stage', artists: [
        { name: 'CeeLo Green' }, { name: 'Lola Indigo' },
      ]},
    ],
  },
];

const STAGES_INFO = [
  { name: 'Palco Mundo', desc: 'O palco principal — os maiores nomes da música mundial', icon: Globe },
  { name: 'Music Valley', desc: 'Sons diversos, reuniões lendárias e artistas emergentes', icon: Music },
  { name: 'Super Bock Stage', desc: 'Rock, metal, alternativo e punk', icon: Radio },
  { name: 'Palco Galp', desc: 'Eletrónica, DJs e sets íntimos no Galp Garden', icon: Headphones },
  { name: 'BacanaPlay Digital Stage', desc: 'Entretenimento digital, humor e podcasters', icon: Smartphone },
];

const TRANSPORT = [
  { icon: Bus, title: 'Shuttle CARRIS', detail: 'Gare do Oriente → Parque Tejo', schedule: 'Ida 12h–21h · Volta 23h–03h', price: '2€ pré-venda' },
  { icon: Train, title: 'Comboio CP', detail: 'Estação de Sacavém (mais próxima)', schedule: 'Tarifas promocionais nos dias do evento', price: '' },
  { icon: Train, title: 'Metro de Lisboa', detail: 'Estação Oriente — Linha Vermelha', schedule: 'Ligação direta ao shuttle CARRIS', price: '' },
  { icon: Car, title: 'TVDE / Uber', detail: 'Pontos dedicados junto ao recinto', schedule: 'Pick-up e drop-off organizados', price: '' },
  { icon: Navigation, title: 'Telpark Parking', detail: '13 parques estratégicos em Lisboa', schedule: 'Roma, Alameda, Sete Rios, Berna', price: '' },
];

/* ═══════════════════════════════════════════════════════════════════════════
   SEO — JSON-LD enriquecido
   ═══════════════════════════════════════════════════════════════════════════ */

const allPerformers = LINEUP.flatMap(d => d.stages.flatMap(s => s.artists)).map(a => ({
  '@type': 'MusicGroup' as const,
  name: a.name,
}));

const eventJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'MusicEvent',
  '@id': 'https://www.olhaqueduas.com/rockinrio#event',
  name: 'Rock in Rio Lisboa 2026',
  description: 'O maior festival de música e entretenimento do mundo. Katy Perry, Linkin Park, Rod Stewart, 21 Savage e dezenas de artistas no Parque Tejo, Lisboa — 20, 21, 27 e 28 de Junho de 2026.',
  startDate: '2026-06-20T13:00:00+01:00',
  endDate: '2026-06-28T03:00:00+01:00',
  eventStatus: 'https://schema.org/EventScheduled',
  eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
  image: 'https://www.olhaqueduas.com/og-rockinrio.jpg',
  location: {
    '@type': 'Place',
    name: 'Parque Tejo',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Passeio dos Heróis do Mar',
      addressLocality: 'Lisboa',
      postalCode: '1990-059',
      addressCountry: 'PT',
    },
    geo: { '@type': 'GeoCoordinates', latitude: 38.7688, longitude: -9.0935 },
    maximumAttendeeCapacity: 80000,
  },
  performer: allPerformers,
  organizer: { '@type': 'Organization', name: 'Rock in Rio', url: 'https://rockinriolisboa.pt/' },
  sponsor: { '@type': 'Organization', name: 'Olha que Duas', url: 'https://www.olhaqueduas.com' },
  offers: {
    '@type': 'Offer',
    url: 'https://worten.seetickets.com/event/rock-in-rio-lisboa-2026/parque-tejo/3430460',
    priceCurrency: 'EUR',
    availability: 'https://schema.org/InStock',
    validFrom: '2025-12-01',
  },
  inLanguage: 'pt',
  isAccessibleForFree: false,
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://www.olhaqueduas.com' },
    { '@type': 'ListItem', position: 2, name: 'Rock in Rio Lisboa 2026', item: 'https://www.olhaqueduas.com/rockinrio' },
  ],
};

const webPageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': 'https://www.olhaqueduas.com/rockinrio#webpage',
  url: 'https://www.olhaqueduas.com/rockinrio',
  name: 'Rock in Rio Lisboa 2026 — Parceiro Oficial | Olha que Duas',
  description: 'Lineup completo, palcos, como chegar e bilhetes do Rock in Rio Lisboa 2026. A Olha que Duas é parceira oficial.',
  isPartOf: { '@id': 'https://www.olhaqueduas.com/#website' },
  about: { '@id': 'https://www.olhaqueduas.com/rockinrio#event' },
  primaryImageOfPage: {
    '@type': 'ImageObject',
    url: 'https://www.olhaqueduas.com/og-rockinrio.jpg',
    width: 1200,
    height: 630,
  },
  inLanguage: 'pt-PT',
  datePublished: '2026-05-16',
  dateModified: '2026-05-16',
  speakable: {
    '@type': 'SpeakableSpecification',
    cssSelector: ['h1', 'h2', '.hero-subtitle'],
  },
};

/* ═══════════════════════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════════════════════ */

const HERO_BG = 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=1920&q=80&auto=format';

const RockInRio = () => {
  const [activeDay, setActiveDay] = useState(0);

  useMetaTags({
    title: 'Rock in Rio Lisboa 2026 — Parceiro Oficial',
    description: 'A Olha que Duas é parceira oficial do Rock in Rio Lisboa 2026. Lineup completo dia a dia, mapa do Parque Tejo, palcos, transportes e bilhetes. Katy Perry, Linkin Park, Rod Stewart, 21 Savage — 20, 21, 27 e 28 de Junho.',
    image: 'https://www.olhaqueduas.com/og-rockinrio.jpg',
    imageAlt: 'Olha que Duas x Rock in Rio Lisboa 2026 — Parceiro Oficial',
    url: 'https://www.olhaqueduas.com/rockinrio',
    jsonLd: [eventJsonLd, breadcrumbJsonLd, webPageJsonLd],
  });

  const day = LINEUP[activeDay];

  return (
    <div className="min-h-screen bg-[#080810]">
      <Header />

      {/* ════════════════════════ HERO ════════════════════════════════ */}
      <section className="relative min-h-[100svh] flex items-end overflow-hidden">
        {/* Background image — concert stage */}
        <div className="absolute inset-0">
          <img
            src={HERO_BG}
            alt=""
            className="w-full h-full object-cover object-center"
            loading="eager"
            aria-hidden="true"
          />
          {/* Dark overlay — bottom-heavy gradient for text readability */}
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(to bottom, rgba(8,8,16,0.3) 0%, rgba(8,8,16,0.5) 40%, rgba(8,8,16,0.92) 75%, rgba(8,8,16,1) 100%)',
          }} />
          {/* Colour tint */}
          <div className="absolute inset-0 mix-blend-overlay opacity-40" style={{
            background: 'linear-gradient(135deg, hsl(217 85% 30%) 0%, transparent 50%, hsl(0 70% 30%) 100%)',
          }} />
        </div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-6xl mx-auto px-5 pb-16 pt-32 md:pb-24 md:pt-48">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-10 items-end">
            {/* Left: text */}
            <div>
              <Animated animation="fade-up" delay={100}>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/25 mb-6">
                  <Star className="w-3.5 h-3.5 text-amber-400" fill="currentColor" />
                  <span className="text-[11px] font-extrabold uppercase tracking-[0.25em] text-amber-300">
                    Parceiro Oficial
                  </span>
                </div>
              </Animated>

              <Animated animation="fade-up" delay={200}>
                <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white leading-[0.9] tracking-tighter mb-5">
                  Rock in Rio
                  <br />
                  <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500 bg-clip-text text-transparent">
                    Lisboa 2026
                  </span>
                </h1>
              </Animated>

              <Animated animation="fade-up" delay={350}>
                <p className="hero-subtitle text-base md:text-lg text-white/50 max-w-lg leading-relaxed mb-8 font-light">
                  O maior festival de música e entretenimento do mundo.
                  <br className="hidden md:block" />
                  4 dias, 5 palcos, <span className="text-white/70 font-medium">80 000 pessoas por dia</span>.
                </p>
              </Animated>

              <Animated animation="fade-up" delay={450}>
                <div className="flex flex-wrap gap-3 mb-8">
                  {[
                    { icon: Calendar, label: '20 · 21 · 27 · 28 Jun' },
                    { icon: MapPin, label: 'Parque Tejo, Lisboa' },
                    { icon: Clock, label: 'Portas 13h' },
                  ].map((p, i) => (
                    <span key={i} className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-white/[0.06] border border-white/[0.08] text-xs text-white/50 font-medium">
                      <p.icon className="w-3.5 h-3.5 text-white/30" />
                      {p.label}
                    </span>
                  ))}
                </div>
              </Animated>

              <Animated animation="fade-up" delay={550}>
                <div className="flex flex-wrap gap-3">
                  <a
                    href="https://worten.seetickets.com/event/rock-in-rio-lisboa-2026/parque-tejo/3430460"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg font-bold text-sm uppercase tracking-wider bg-amber-400 text-black hover:bg-amber-300 transition-colors shadow-lg shadow-amber-500/20"
                  >
                    <Ticket className="w-4 h-4" />
                    Bilhetes
                    <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                  </a>
                  <a
                    href="#lineup"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg font-semibold text-sm text-white/70 border border-white/15 hover:bg-white/[0.06] hover:text-white transition-colors"
                  >
                    Ver Lineup
                  </a>
                </div>
              </Animated>
            </div>

            {/* Right: logo */}
            <Animated animation="fade-up" delay={300}>
              <img
                src={siteConfig.rockInRio.partnerLogo}
                alt="Rock in Rio Lisboa"
                className="hidden lg:block w-56 xl:w-64 drop-shadow-[0_0_40px_rgba(30,100,220,0.25)]"
              />
            </Animated>
          </div>
        </div>
      </section>

      {/* ════════════════════════ HEADLINERS MARQUEE ══════════════════ */}
      <section className="py-6 border-y border-white/[0.04] overflow-hidden bg-[#080810]">
        <div className="animate-marquee flex items-center whitespace-nowrap gap-8 text-2xl md:text-3xl font-black tracking-tight text-white/[0.07] uppercase select-none">
          {[...Array(3)].map((_, r) => (
            <span key={r} className="flex items-center gap-8">
              {['Katy Perry', 'Linkin Park', 'Rod Stewart', '21 Savage', 'Cyndi Lauper', 'Central Cee', 'Cypress Hill', 'Rema', 'Joss Stone'].map((n, i) => (
                <span key={i} className="flex items-center gap-8">
                  {n}
                  <span className="text-amber-400/20 text-base">&#9830;</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </section>

      {/* ════════════════════════ LINEUP ══════════════════════════════ */}
      <section id="lineup" className="py-20 md:py-28 px-5 bg-[#080810]">
        <div className="max-w-5xl mx-auto">
          <Animated animation="fade-up">
            <div className="text-center mb-14">
              <p className="text-[10px] uppercase tracking-[0.3em] text-amber-400/80 font-bold mb-3">Cartaz Completo</p>
              <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                Lineup 2026
              </h2>
            </div>
          </Animated>

          {/* Day selector */}
          <Animated animation="fade-up" delay={100}>
            <div className="flex justify-center mb-12">
              <div className="inline-flex rounded-xl bg-white/[0.03] border border-white/[0.06] p-1 gap-1">
                {LINEUP.map((d, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveDay(i)}
                    className={`px-5 py-3 rounded-lg text-sm font-bold transition-all duration-200 ${
                      activeDay === i
                        ? 'bg-white text-black shadow-md'
                        : 'text-white/40 hover:text-white/70 hover:bg-white/[0.04]'
                    }`}
                  >
                    <span className="block leading-tight">{d.date.split(' ')[0]}</span>
                    <span className={`block text-[9px] mt-0.5 uppercase tracking-widest ${activeDay === i ? 'text-black/50' : 'opacity-50'}`}>
                      {d.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </Animated>

          {/* Day header */}
          <Animated animation="fade-up" delay={150}>
            <div className="flex items-center justify-between mb-6 px-1">
              <div>
                <h3 className="text-2xl font-black text-white tracking-tight">{day.date}, 2026</h3>
                <p className="text-sm text-white/40 mt-0.5">{day.weekday} — {day.label}</p>
              </div>
              <span className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest border ${day.accentBg} ${day.accent}`}>
                {day.label}
              </span>
            </div>
          </Animated>

          {/* Lineup table */}
          <Animated animation="fade-up" delay={200}>
            <div className="rounded-2xl border border-white/[0.06] overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                    <th className="text-left px-5 py-3.5 text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold">Palco</th>
                    <th className="text-left px-5 py-3.5 text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold">Artistas</th>
                  </tr>
                </thead>
                <tbody>
                  {day.stages.map((stage, si) => (
                    <tr key={si} className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.015] transition-colors">
                      <td className="px-5 py-4 align-top w-[160px] md:w-[200px]">
                        <div className="flex items-center gap-2.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-400/60 shrink-0" />
                          <span className="text-xs font-bold text-white/60 uppercase tracking-wide leading-tight">{stage.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                          {stage.artists.map((artist, ai) => (
                            <span key={ai}>
                              <span className={artist.headliner
                                ? 'text-lg md:text-xl font-black text-white'
                                : 'text-sm font-medium text-white/50'
                              }>
                                {artist.name}
                              </span>
                              {ai < stage.artists.length - 1 && (
                                <span className="text-white/15 mx-1">·</span>
                              )}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Animated>
        </div>
      </section>

      {/* ════════════════════════ PALCOS ══════════════════════════════ */}
      <section className="py-20 px-5 bg-[#0a0a14]">
        <div className="max-w-5xl mx-auto">
          <Animated animation="fade-up">
            <div className="text-center mb-12">
              <p className="text-[10px] uppercase tracking-[0.3em] text-amber-400/80 font-bold mb-3">5 Experiências Únicas</p>
              <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">Palcos</h2>
            </div>
          </Animated>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {STAGES_INFO.map((stage, i) => (
              <Animated key={i} animation="fade-up" delay={i * 80}>
                <div className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 hover:border-amber-400/20 transition-all duration-500">
                  <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mb-4 group-hover:border-amber-400/20 transition-colors">
                    <stage.icon className="w-5 h-5 text-white/30 group-hover:text-amber-400/60 transition-colors" />
                  </div>
                  <h3 className="font-bold text-white text-sm tracking-wide mb-1.5">{stage.name}</h3>
                  <p className="text-xs text-white/35 leading-relaxed">{stage.desc}</p>
                </div>
              </Animated>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════ COMO CHEGAR ═════════════════════════ */}
      <section className="py-20 px-5 bg-[#080810]">
        <div className="max-w-5xl mx-auto">
          <Animated animation="fade-up">
            <div className="text-center mb-14">
              <p className="text-[10px] uppercase tracking-[0.3em] text-amber-400/80 font-bold mb-3">Parque Tejo, Lisboa</p>
              <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-2">Como Chegar</h2>
              <p className="text-sm text-white/35">Passeio dos Heróis do Mar, 1990-059 Lisboa</p>
            </div>
          </Animated>

          {/* Map embed */}
          <Animated animation="fade-up" delay={100}>
            <div className="rounded-2xl overflow-hidden border border-white/[0.06] mb-10 aspect-[16/7]">
              <iframe
                src="https://maps.google.com/maps?q=Parque+Tejo,+Lisboa,+Portugal&t=&z=14&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Mapa — Parque Tejo, Lisboa"
              />
            </div>
          </Animated>

          {/* Transport table */}
          <Animated animation="fade-up" delay={200}>
            <div className="rounded-2xl border border-white/[0.06] overflow-hidden mb-6">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                    <th className="text-left px-5 py-3.5 text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold">Transporte</th>
                    <th className="text-left px-5 py-3.5 text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold hidden md:table-cell">Detalhes</th>
                    <th className="text-left px-5 py-3.5 text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold hidden md:table-cell">Horário</th>
                    <th className="text-right px-5 py-3.5 text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold">Preço</th>
                  </tr>
                </thead>
                <tbody>
                  {TRANSPORT.map((t, i) => (
                    <tr key={i} className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.015] transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <t.icon className="w-4 h-4 text-amber-400/60 shrink-0" />
                          <div>
                            <span className="text-sm font-bold text-white block">{t.title}</span>
                            <span className="text-xs text-white/35 md:hidden">{t.detail}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 hidden md:table-cell">
                        <span className="text-xs text-white/50">{t.detail}</span>
                      </td>
                      <td className="px-5 py-4 hidden md:table-cell">
                        <span className="text-xs text-white/35">{t.schedule}</span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <span className="text-xs font-bold text-amber-400/80">{t.price || '—'}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Animated>

          <Animated animation="fade-up" delay={300}>
            <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/[0.05] border border-red-500/15">
              <AlertTriangle className="w-4 h-4 text-red-400/70 shrink-0 mt-0.5" />
              <p className="text-xs text-red-300/60 leading-relaxed">
                <strong className="text-red-300/80">Sem estacionamento</strong> junto ao recinto. Ruas envolventes de acesso exclusivo a moradores. Recomenda-se transportes públicos ou TVDE.
              </p>
            </div>
          </Animated>
        </div>
      </section>

      {/* ════════════════════════ CTA ═════════════════════════════════ */}
      <section className="py-24 px-5 bg-[#0a0a14]">
        <div className="max-w-4xl mx-auto">
          <Animated animation="fade-up">
            <div className="relative rounded-3xl overflow-hidden">
              {/* BG — re-use hero image */}
              <div className="absolute inset-0">
                <img src={HERO_BG} alt="" className="w-full h-full object-cover" aria-hidden="true" />
                <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" />
                <div className="absolute inset-0 mix-blend-overlay opacity-50" style={{
                  background: 'linear-gradient(135deg, hsl(217 85% 30%) 0%, transparent 50%, hsl(0 70% 30%) 100%)',
                }} />
              </div>

              <div className="relative z-10 p-10 md:p-16 flex flex-col md:flex-row items-center gap-10">
                {/* Logo */}
                <img
                  src={siteConfig.rockInRio.partnerLogo}
                  alt="Rock in Rio Lisboa"
                  className="w-36 md:w-44 shrink-0 drop-shadow-2xl"
                />

                {/* Text + CTA */}
                <div className="text-center md:text-left flex-1">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-400/10 border border-amber-400/25 mb-4">
                    <Users className="w-3 h-3 text-amber-400" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-300">A Olha que Duas vai estar lá</span>
                  </div>

                  <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-3">
                    Garante o teu bilhete
                  </h2>
                  <p className="text-sm text-white/45 mb-8 max-w-md leading-relaxed">
                    Junta-te a nós no maior festival do mundo. Bilhetes disponíveis na Worten e pontos de venda oficiais.
                  </p>

                  <div className="flex flex-wrap justify-center md:justify-start gap-3">
                    <a
                      href="https://worten.seetickets.com/event/rock-in-rio-lisboa-2026/parque-tejo/3430460"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg font-bold text-sm uppercase tracking-wider bg-amber-400 text-black hover:bg-amber-300 transition-colors shadow-lg shadow-amber-500/20"
                    >
                      <Ticket className="w-4 h-4" />
                      Comprar Bilhetes
                      <ExternalLink className="w-3.5 h-3.5 opacity-50" />
                    </a>
                    <a
                      href="https://rockinriolisboa.pt/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg font-semibold text-sm text-white/60 border border-white/15 hover:bg-white/[0.06] hover:text-white transition-colors"
                    >
                      rockinriolisboa.pt
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </Animated>
        </div>
      </section>

      <Footer />
      <BackToTop />
    </div>
  );
};

export default RockInRio;
