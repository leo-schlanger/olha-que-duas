import { useState } from 'react';
import {
  Calendar, MapPin, Clock, Music, Train, Bus, Car, Ticket,
  ExternalLink, Globe, Radio, Headphones, Smartphone,
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

interface Artist { name: string; headliner?: boolean }
interface Stage { name: string; artists: Artist[] }
interface Day { date: string; weekday: string; label: string; accent: string; accentBg: string; stages: Stage[] }

const LINEUP: Day[] = [
  {
    date: '20 Junho', weekday: 'Sábado', label: 'Pop Day',
    accent: 'text-pink-400', accentBg: 'bg-pink-500/10 border-pink-500/20',
    stages: [
      { name: 'Palco Mundo', artists: [{ name: 'Katy Perry', headliner: true }, { name: 'Charlie Puth' }, { name: 'Alok' }, { name: 'Nena' }] },
      { name: 'Super Bock Stage', artists: [{ name: 'Bebe Rexha' }, { name: 'Pedro Sampaio' }, { name: 'Calema' }, { name: 'NAPA' }] },
      { name: 'Music Valley', artists: [{ name: 'Maninho' }, { name: 'Audrey Nuna' }, { name: 'Sofia Camara' }] },
    ],
  },
  {
    date: '21 Junho', weekday: 'Domingo', label: 'Rock Day',
    accent: 'text-red-400', accentBg: 'bg-red-500/10 border-red-500/20',
    stages: [
      { name: 'Palco Mundo', artists: [{ name: 'Linkin Park', headliner: true }, { name: 'Cypress Hill' }, { name: 'The Pretty Reckless' }, { name: 'Grandson' }] },
      { name: 'Music Valley', artists: [{ name: 'Kaiser Chiefs' }, { name: 'Hoobastank' }, { name: 'Blasted Mechanism' }] },
      { name: 'Super Bock Stage', artists: [{ name: 'Sepultura' }, { name: 'P.O.D.' }, { name: 'Tara Perdida' }] },
      { name: 'BacanaPlay Digital Stage', artists: [{ name: 'Sam the Kid' }, { name: 'Orelha Negra' }] },
    ],
  },
  {
    date: '27 Junho', weekday: 'Sábado', label: 'Legends Day',
    accent: 'text-amber-400', accentBg: 'bg-amber-500/10 border-amber-500/20',
    stages: [
      { name: 'Palco Mundo', artists: [{ name: 'Rod Stewart', headliner: true }, { name: 'Cyndi Lauper' }, { name: '4 Non Blondes' }, { name: 'Shaggy' }] },
      { name: 'Music Valley', artists: [{ name: 'Xutos & Pontapés' }, { name: 'GNR' }, { name: 'UHF' }, { name: 'Táxi' }, { name: 'Jafumega' }] },
      { name: 'Super Bock Stage', artists: [{ name: 'Joss Stone' }, { name: 'The Wailers' }, { name: 'Belo' }, { name: 'SYRO' }] },
    ],
  },
  {
    date: '28 Junho', weekday: 'Domingo', label: 'Urban Day',
    accent: 'text-violet-400', accentBg: 'bg-violet-500/10 border-violet-500/20',
    stages: [
      { name: 'Palco Mundo', artists: [{ name: '21 Savage', headliner: true }, { name: 'Central Cee' }, { name: 'Rema' }, { name: 'Matué' }] },
      { name: 'Music Valley', artists: [{ name: 'Filipe Ret' }, { name: 'DENNIS' }, { name: 'Carlão' }, { name: 'Irina Barros' }] },
      { name: 'Super Bock Stage', artists: [{ name: 'CeeLo Green' }, { name: 'Lola Indigo' }] },
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
  { icon: Bus, title: 'Shuttle CARRIS', detail: 'Gare do Oriente → Parque Tejo', schedule: 'Ida 12h–21h · Volta 23h–03h', price: '2€' },
  { icon: Train, title: 'Comboio CP', detail: 'Estação de Sacavém (mais próxima)', schedule: 'Tarifas promocionais nos dias do evento', price: '' },
  { icon: Train, title: 'Metro de Lisboa', detail: 'Estação Oriente — Linha Vermelha', schedule: 'Ligação direta ao shuttle CARRIS', price: '' },
  { icon: Car, title: 'TVDE / Uber', detail: 'Pontos dedicados junto ao recinto', schedule: 'Pick-up e drop-off organizados', price: '' },
  { icon: Navigation, title: 'Telpark Parking', detail: '13 parques estratégicos em Lisboa', schedule: 'Roma, Alameda, Sete Rios, Berna', price: '' },
];

/* ═══════════════════════════════════════════════════════════════════════════
   SEO
   ═══════════════════════════════════════════════════════════════════════════ */

const allPerformers = LINEUP.flatMap(d => d.stages.flatMap(s => s.artists)).map(a => ({
  '@type': 'MusicGroup' as const, name: a.name,
}));

const eventJsonLd = {
  '@context': 'https://schema.org', '@type': 'MusicEvent',
  '@id': 'https://www.olhaqueduas.com/rockinrio#event',
  name: 'Rock in Rio Lisboa 2026',
  description: 'O maior festival de música e entretenimento do mundo. Katy Perry, Linkin Park, Rod Stewart, 21 Savage e dezenas de artistas no Parque Tejo, Lisboa — 20, 21, 27 e 28 de Junho de 2026.',
  startDate: '2026-06-20T13:00:00+01:00', endDate: '2026-06-28T03:00:00+01:00',
  eventStatus: 'https://schema.org/EventScheduled',
  eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
  image: 'https://www.olhaqueduas.com/og-rockinrio.jpg',
  location: {
    '@type': 'Place', name: 'Parque Tejo',
    address: { '@type': 'PostalAddress', streetAddress: 'Passeio dos Heróis do Mar', addressLocality: 'Lisboa', postalCode: '1990-059', addressCountry: 'PT' },
    geo: { '@type': 'GeoCoordinates', latitude: 38.7688, longitude: -9.0935 },
    maximumAttendeeCapacity: 80000,
  },
  performer: allPerformers,
  organizer: { '@type': 'Organization', name: 'Rock in Rio', url: 'https://rockinriolisboa.pt/' },
  sponsor: { '@type': 'Organization', name: 'Olha que Duas', url: 'https://www.olhaqueduas.com' },
  offers: { '@type': 'Offer', url: 'https://worten.seetickets.com/event/rock-in-rio-lisboa-2026/parque-tejo/3430460', priceCurrency: 'EUR', availability: 'https://schema.org/InStock', validFrom: '2025-12-01' },
  inLanguage: 'pt', isAccessibleForFree: false,
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org', '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://www.olhaqueduas.com' },
    { '@type': 'ListItem', position: 2, name: 'Rock in Rio Lisboa 2026', item: 'https://www.olhaqueduas.com/rockinrio' },
  ],
};

const webPageJsonLd = {
  '@context': 'https://schema.org', '@type': 'WebPage',
  '@id': 'https://www.olhaqueduas.com/rockinrio#webpage',
  url: 'https://www.olhaqueduas.com/rockinrio',
  name: 'Rock in Rio Lisboa 2026 — Parceiro Oficial | Olha que Duas',
  description: 'Lineup completo, palcos, como chegar e bilhetes do Rock in Rio Lisboa 2026. A Olha que Duas é parceira oficial.',
  isPartOf: { '@id': 'https://www.olhaqueduas.com/#website' },
  about: { '@id': 'https://www.olhaqueduas.com/rockinrio#event' },
  primaryImageOfPage: { '@type': 'ImageObject', url: 'https://www.olhaqueduas.com/og-rockinrio.jpg', width: 1200, height: 630 },
  inLanguage: 'pt-PT', datePublished: '2026-05-16', dateModified: '2026-05-16',
  speakable: { '@type': 'SpeakableSpecification', cssSelector: ['h1', 'h2', '.hero-subtitle'] },
};

/* ═══════════════════════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════════════════════ */

const HERO_BG = 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=1920&q=80&auto=format';

const RockInRio = () => {
  const [activeDay, setActiveDay] = useState(0);

  useMetaTags({
    title: 'Rock in Rio Lisboa 2026 — Parceiro Oficial',
    description: 'A Olha que Duas é parceira oficial do Rock in Rio Lisboa 2026. Lineup completo dia a dia: Katy Perry, Linkin Park, Rod Stewart, 21 Savage e +40 artistas. Mapa do Parque Tejo, palcos, transportes e bilhetes. 20, 21, 27 e 28 de Junho.',
    image: 'https://www.olhaqueduas.com/og-rockinrio.jpg',
    imageAlt: 'Olha que Duas x Rock in Rio Lisboa 2026 — Parceiro Oficial',
    url: 'https://www.olhaqueduas.com/rockinrio',
    jsonLd: [eventJsonLd, breadcrumbJsonLd, webPageJsonLd],
  });

  const day = LINEUP[activeDay];

  return (
    <div className="min-h-screen bg-[#060610]">
      <Header />

      {/* ════════════════════════ HERO ════════════════════════════════ */}
      <section className="relative min-h-[100svh] flex flex-col justify-end overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <img src={HERO_BG} alt="" className="w-full h-full object-cover" loading="eager" aria-hidden="true" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(6,6,16,0.2) 0%, rgba(6,6,16,0.55) 40%, rgba(6,6,16,0.95) 70%, #060610 100%)' }} />
          <div className="absolute inset-0 mix-blend-color opacity-30" style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, transparent 60%, #991b1b 100%)' }} />
        </div>

        <div className="relative z-10 w-full">
          {/* Partner logos — centered, large, clean */}
          <Animated animation="fade-up" delay={150}>
            <div className="flex flex-col items-center pt-28 md:pt-36 pb-10 md:pb-14">
              <div className="flex items-center gap-5 sm:gap-8 md:gap-10">
                <img
                  src={siteConfig.rockInRio.partnerLogoWhite}
                  alt="Rock in Rio Lisboa"
                  className="w-28 sm:w-36 md:w-44 lg:w-48 rotate-90 drop-shadow-[0_4px_40px_rgba(255,255,255,0.15)]"
                />
                <div className="flex flex-col items-center gap-1.5 self-stretch justify-center">
                  <div className="flex-1 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent" />
                  <span className="text-white/20 text-lg font-light select-none">&times;</span>
                  <div className="flex-1 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent" />
                </div>
                <img
                  src="/icon-512x512.png"
                  alt="Olha que Duas"
                  className="w-24 sm:w-32 md:w-40 lg:w-44 rounded-full shadow-[0_4px_40px_rgba(180,40,40,0.2)]"
                />
              </div>
              <div className="mt-5 px-5 py-1.5 rounded-full bg-amber-400/[0.08] border border-amber-400/20">
                <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-[0.3em] text-amber-300/80">
                  <Star className="w-3 h-3 inline-block mr-1.5 -mt-0.5 text-amber-400" fill="currentColor" />
                  Parceiros Oficiais
                  <Star className="w-3 h-3 inline-block ml-1.5 -mt-0.5 text-amber-400" fill="currentColor" />
                </span>
              </div>
            </div>
          </Animated>

          {/* Title + info + CTA */}
          <div className="max-w-4xl mx-auto px-5 pb-20 md:pb-28 text-center">
            <Animated animation="fade-up" delay={300}>
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-black text-white leading-[0.9] tracking-[-0.03em] mb-4">
                Rock in Rio
                <br />
                <span className="bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
                  Lisboa 2026
                </span>
              </h1>
            </Animated>

            <Animated animation="fade-up" delay={420}>
              <p className="hero-subtitle text-base sm:text-lg md:text-xl text-white/40 max-w-xl mx-auto leading-relaxed mb-8">
                O maior festival de música e entretenimento do mundo.
                <br className="hidden sm:block" />
                4 dias, 5 palcos, <span className="text-white/60 font-semibold">80 000 pessoas por dia</span>.
              </p>
            </Animated>

            <Animated animation="fade-up" delay={520}>
              <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
                {[
                  { icon: Calendar, label: '20 · 21 · 27 · 28 Jun' },
                  { icon: MapPin, label: 'Parque Tejo, Lisboa' },
                  { icon: Clock, label: 'Portas 13h' },
                ].map((p, i) => (
                  <span key={i} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.05] border border-white/[0.07] text-xs sm:text-sm text-white/40 font-medium">
                    <p.icon className="w-3.5 h-3.5 text-amber-400/50" />
                    {p.label}
                  </span>
                ))}
              </div>
            </Animated>

            <Animated animation="fade-up" delay={620}>
              <div className="flex flex-wrap justify-center gap-3">
                <a
                  href="https://worten.seetickets.com/event/rock-in-rio-lisboa-2026/parque-tejo/3430460"
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full font-extrabold text-sm uppercase tracking-wider bg-gradient-to-r from-amber-400 to-yellow-500 text-black hover:from-amber-300 hover:to-yellow-400 transition-all shadow-[0_4px_24px_rgba(251,191,36,0.25)] hover:shadow-[0_4px_32px_rgba(251,191,36,0.4)]"
                >
                  <Ticket className="w-4 h-4" />
                  Comprar Bilhetes
                  <ExternalLink className="w-3.5 h-3.5 opacity-50" />
                </a>
                <a href="#lineup" className="inline-flex items-center gap-2 px-7 py-4 rounded-full font-bold text-sm text-white/60 border border-white/[0.12] hover:bg-white/[0.05] hover:text-white/80 transition-all">
                  Ver Lineup
                </a>
              </div>
            </Animated>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10">
          <div className="w-5 h-8 rounded-full border border-white/15 flex justify-center pt-1.5">
            <div className="w-0.5 h-2 rounded-full bg-white/30 animate-bounce" />
          </div>
        </div>
      </section>

      {/* ════════════════════════ HEADLINERS MARQUEE ══════════════════ */}
      <section className="py-5 border-y border-white/[0.04] overflow-hidden bg-[#060610]">
        <div className="animate-marquee flex items-center whitespace-nowrap gap-10 text-xl md:text-2xl font-black tracking-tight text-white/[0.06] uppercase select-none">
          {[...Array(3)].map((_, r) => (
            <span key={r} className="flex items-center gap-10">
              {['Katy Perry', 'Linkin Park', 'Rod Stewart', '21 Savage', 'Cyndi Lauper', 'Central Cee', 'Cypress Hill', 'Rema', 'Joss Stone', 'CeeLo Green'].map((n, i) => (
                <span key={i} className="flex items-center gap-10">{n}<span className="text-amber-400/15 text-xs">&#9830;</span></span>
              ))}
            </span>
          ))}
        </div>
      </section>

      {/* ════════════════════════ LINEUP ══════════════════════════════ */}
      <section id="lineup" className="py-24 md:py-32 px-5 bg-[#060610]">
        <div className="max-w-5xl mx-auto">
          <Animated animation="fade-up">
            <div className="text-center mb-16">
              <p className="text-[10px] uppercase tracking-[0.3em] text-amber-400/70 font-bold mb-4">Cartaz Completo</p>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight">Lineup 2026</h2>
            </div>
          </Animated>

          {/* Day selector — segmented control */}
          <Animated animation="fade-up" delay={100}>
            <div className="flex justify-center mb-14">
              <div className="inline-flex rounded-2xl bg-white/[0.03] border border-white/[0.06] p-1.5 gap-1.5">
                {LINEUP.map((d, i) => (
                  <button
                    key={i} onClick={() => setActiveDay(i)}
                    className={`px-4 sm:px-6 py-3 sm:py-3.5 rounded-xl font-bold transition-all duration-200 ${
                      activeDay === i
                        ? 'bg-white text-[#060610] shadow-lg shadow-white/10'
                        : 'text-white/35 hover:text-white/60 hover:bg-white/[0.04]'
                    }`}
                  >
                    <span className="block text-sm sm:text-base leading-tight">{d.date.split(' ')[0]}</span>
                    <span className={`block text-[9px] sm:text-[10px] mt-0.5 uppercase tracking-widest ${activeDay === i ? 'text-black/40' : 'opacity-50'}`}>
                      {d.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </Animated>

          {/* Day header */}
          <Animated animation="fade-up" delay={150}>
            <div className="flex items-center justify-between mb-8 px-1">
              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">{day.date}, 2026</h3>
                <p className="text-sm text-white/35 mt-1 font-medium">{day.weekday}</p>
              </div>
              <span className={`px-4 py-1.5 rounded-lg text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest border ${day.accentBg} ${day.accent}`}>
                {day.label}
              </span>
            </div>
          </Animated>

          {/* Lineup table — clean, professional */}
          <Animated animation="fade-up" delay={200}>
            <div className="rounded-2xl border border-white/[0.07] overflow-hidden shadow-xl shadow-black/20">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-white/[0.03]">
                    <th className="text-left px-6 py-4 text-[11px] uppercase tracking-[0.2em] text-white/25 font-bold border-b border-white/[0.06] w-[180px] md:w-[220px]">Palco</th>
                    <th className="text-left px-6 py-4 text-[11px] uppercase tracking-[0.2em] text-white/25 font-bold border-b border-white/[0.06]">Artistas</th>
                  </tr>
                </thead>
                <tbody>
                  {day.stages.map((stage, si) => (
                    <tr key={si} className="border-b border-white/[0.05] last:border-0 group hover:bg-white/[0.02] transition-colors duration-300">
                      <td className="px-6 py-5 align-top">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-amber-400/50 shrink-0 group-hover:bg-amber-400/80 transition-colors" />
                          <span className="text-xs font-extrabold text-white/50 uppercase tracking-wider leading-tight">{stage.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-2">
                          {stage.artists.map((artist, ai) => (
                            <span key={ai}>
                              <span className={artist.headliner
                                ? 'text-xl sm:text-2xl font-black text-white tracking-tight'
                                : 'text-sm sm:text-base font-semibold text-white/45'
                              }>
                                {artist.name}
                              </span>
                              {ai < stage.artists.length - 1 && (
                                <span className="text-white/10 mx-1.5 font-light">·</span>
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
      <section className="py-24 px-5 bg-[#08080f]">
        <div className="max-w-5xl mx-auto">
          <Animated animation="fade-up">
            <div className="text-center mb-14">
              <p className="text-[10px] uppercase tracking-[0.3em] text-amber-400/70 font-bold mb-4">5 Experiências Únicas</p>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight">Palcos</h2>
            </div>
          </Animated>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {STAGES_INFO.map((stage, i) => (
              <Animated key={i} animation="fade-up" delay={i * 80}>
                <div className="group rounded-2xl border border-white/[0.06] bg-white/[0.015] p-7 hover:border-amber-400/15 transition-all duration-500">
                  <div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mb-5 group-hover:border-amber-400/20 group-hover:bg-amber-400/[0.04] transition-all duration-500">
                    <stage.icon className="w-5 h-5 text-white/25 group-hover:text-amber-400/60 transition-colors duration-500" />
                  </div>
                  <h3 className="font-extrabold text-white text-base tracking-wide mb-2">{stage.name}</h3>
                  <p className="text-sm text-white/30 leading-relaxed">{stage.desc}</p>
                </div>
              </Animated>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════ COMO CHEGAR ═════════════════════════ */}
      <section className="py-24 px-5 bg-[#060610]">
        <div className="max-w-5xl mx-auto">
          <Animated animation="fade-up">
            <div className="text-center mb-14">
              <p className="text-[10px] uppercase tracking-[0.3em] text-amber-400/70 font-bold mb-4">Parque Tejo, Lisboa</p>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight mb-3">Como Chegar</h2>
              <p className="text-sm text-white/30 font-medium">Passeio dos Heróis do Mar, 1990-059 Lisboa</p>
            </div>
          </Animated>

          {/* Map */}
          <Animated animation="fade-up" delay={100}>
            <div className="rounded-2xl overflow-hidden border border-white/[0.07] mb-12 aspect-[2/1] md:aspect-[16/7] shadow-xl shadow-black/20">
              <iframe
                src="https://www.google.com/maps?q=38.776,-9.098&z=15&output=embed"
                width="100%" height="100%" style={{ border: 0 }}
                allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                title="Mapa — Parque Tejo, Lisboa"
              />
            </div>
          </Animated>

          {/* Transport table */}
          <Animated animation="fade-up" delay={200}>
            <div className="rounded-2xl border border-white/[0.07] overflow-hidden mb-6 shadow-xl shadow-black/20">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-white/[0.03]">
                    <th className="text-left px-6 py-4 text-[11px] uppercase tracking-[0.2em] text-white/25 font-bold border-b border-white/[0.06]">Transporte</th>
                    <th className="text-left px-6 py-4 text-[11px] uppercase tracking-[0.2em] text-white/25 font-bold border-b border-white/[0.06] hidden md:table-cell">Detalhes</th>
                    <th className="text-left px-6 py-4 text-[11px] uppercase tracking-[0.2em] text-white/25 font-bold border-b border-white/[0.06] hidden lg:table-cell">Horário</th>
                    <th className="text-right px-6 py-4 text-[11px] uppercase tracking-[0.2em] text-white/25 font-bold border-b border-white/[0.06]">Preço</th>
                  </tr>
                </thead>
                <tbody>
                  {TRANSPORT.map((t, i) => (
                    <tr key={i} className="border-b border-white/[0.05] last:border-0 hover:bg-white/[0.02] transition-colors duration-300">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3.5">
                          <div className="w-9 h-9 rounded-lg bg-amber-400/[0.06] border border-amber-400/15 flex items-center justify-center shrink-0">
                            <t.icon className="w-4 h-4 text-amber-400/60" />
                          </div>
                          <div>
                            <span className="text-sm font-bold text-white block">{t.title}</span>
                            <span className="text-xs text-white/30 md:hidden block mt-0.5">{t.detail}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 hidden md:table-cell">
                        <span className="text-sm text-white/45">{t.detail}</span>
                      </td>
                      <td className="px-6 py-5 hidden lg:table-cell">
                        <span className="text-sm text-white/30">{t.schedule}</span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <span className="text-sm font-bold text-amber-400/70">{t.price || '—'}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Animated>

          <Animated animation="fade-up" delay={300}>
            <div className="flex items-start gap-3.5 p-5 rounded-xl bg-red-500/[0.04] border border-red-500/10">
              <AlertTriangle className="w-4 h-4 text-red-400/60 shrink-0 mt-0.5" />
              <p className="text-sm text-red-300/50 leading-relaxed">
                <strong className="text-red-300/70 font-bold">Sem estacionamento</strong> junto ao recinto. Ruas envolventes de acesso exclusivo a moradores. Recomenda-se transportes públicos ou TVDE.
              </p>
            </div>
          </Animated>
        </div>
      </section>

      {/* ════════════════════════ CTA ═════════════════════════════════ */}
      <section className="py-24 px-5 bg-[#08080f]">
        <div className="max-w-4xl mx-auto">
          <Animated animation="fade-up">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-black/40">
              {/* BG */}
              <div className="absolute inset-0">
                <img src={HERO_BG} alt="" className="w-full h-full object-cover" aria-hidden="true" />
                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
                <div className="absolute inset-0 mix-blend-overlay opacity-40" style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, transparent 50%, #991b1b 100%)' }} />
              </div>

              <div className="relative z-10 p-10 sm:p-12 md:p-16 flex flex-col items-center gap-10">
                {/* Logos — centered, balanced */}
                <div className="flex items-center gap-6 sm:gap-8">
                  <img src={siteConfig.rockInRio.partnerLogo} alt="Rock in Rio Lisboa" className="w-36 sm:w-44 md:w-52 drop-shadow-2xl" />
                  <div className="flex flex-col items-center gap-1 self-stretch justify-center">
                    <div className="flex-1 w-px bg-gradient-to-b from-transparent via-white/15 to-transparent" />
                    <span className="text-white/15 text-sm select-none">&times;</span>
                    <div className="flex-1 w-px bg-gradient-to-b from-transparent via-white/15 to-transparent" />
                  </div>
                  <img src="/icon-512x512.png" alt="Olha que Duas" className="w-32 sm:w-40 md:w-44 rounded-full shadow-lg" />
                </div>

                {/* Text + CTA — centered */}
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-amber-400/10 border border-amber-400/20 mb-5">
                    <Users className="w-3 h-3 text-amber-400" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-300/80">A Olha que Duas vai estar lá</span>
                  </div>

                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-4">Garante o teu bilhete</h2>
                  <p className="text-sm sm:text-base text-white/40 mb-10 max-w-lg mx-auto leading-relaxed">
                    Junta-te a nós no maior festival do mundo. Bilhetes disponíveis na Worten e pontos de venda oficiais.
                  </p>

                  <div className="flex flex-wrap justify-center gap-3">
                    <a
                      href="https://worten.seetickets.com/event/rock-in-rio-lisboa-2026/parque-tejo/3430460"
                      target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-extrabold text-sm uppercase tracking-wider bg-gradient-to-r from-amber-400 to-yellow-500 text-black hover:from-amber-300 hover:to-yellow-400 transition-all shadow-lg shadow-amber-500/20"
                    >
                      <Ticket className="w-4 h-4" />
                      Comprar Bilhetes
                      <ExternalLink className="w-3.5 h-3.5 opacity-50" />
                    </a>
                    <a
                      href="https://rockinriolisboa.pt/" target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full font-bold text-sm text-white/50 border border-white/[0.12] hover:bg-white/[0.05] hover:text-white/70 transition-all"
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
