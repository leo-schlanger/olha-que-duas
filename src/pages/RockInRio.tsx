import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Clock, Music, Train, Bus, Car, Ticket, ExternalLink, ChevronRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import { Animated } from '@/components/ui/animated';
import { useMetaTags } from '@/hooks/useMetaTags';
import { siteConfig } from '@/config/site';

// ─── Data ────────────────────────────────────────────────────────────────────

const LINEUP = [
  {
    date: '20 Jun',
    weekday: 'Sábado',
    label: 'Pop Day',
    stages: [
      {
        name: 'Palco Mundo',
        artists: [
          { name: 'Katy Perry', headliner: true },
          { name: 'Charlie Puth', headliner: false },
          { name: 'Alok', headliner: false },
          { name: 'Nena', headliner: false },
        ],
      },
      {
        name: 'Super Bock Stage',
        artists: [
          { name: 'Bebe Rexha', headliner: false },
          { name: 'Pedro Sampaio', headliner: false },
          { name: 'Calema', headliner: false },
          { name: 'NAPA', headliner: false },
        ],
      },
    ],
  },
  {
    date: '21 Jun',
    weekday: 'Domingo',
    label: 'Rock Day',
    stages: [
      {
        name: 'Palco Mundo',
        artists: [
          { name: 'Linkin Park', headliner: true },
          { name: 'Cypress Hill', headliner: false },
          { name: 'The Pretty Reckless', headliner: false },
          { name: 'Grandson', headliner: false },
        ],
      },
      {
        name: 'Music Valley',
        artists: [
          { name: 'Kaiser Chiefs', headliner: false },
          { name: 'Hoobastank', headliner: false },
          { name: 'Blasted Mechanism', headliner: false },
        ],
      },
      {
        name: 'Super Bock Stage',
        artists: [
          { name: 'Sepultura', headliner: false },
          { name: 'P.O.D.', headliner: false },
          { name: 'Tara Perdida', headliner: false },
        ],
      },
    ],
  },
  {
    date: '27 Jun',
    weekday: 'Sábado',
    label: 'Legends Day',
    stages: [
      {
        name: 'Palco Mundo',
        artists: [
          { name: 'Rod Stewart', headliner: true },
          { name: 'Cyndi Lauper', headliner: false },
          { name: '4 Non Blondes', headliner: false },
          { name: 'Shaggy', headliner: false },
        ],
      },
      {
        name: 'Music Valley',
        artists: [
          { name: 'Xutos & Pontapés', headliner: false },
          { name: 'GNR', headliner: false },
          { name: 'UHF', headliner: false },
          { name: 'Táxi', headliner: false },
        ],
      },
      {
        name: 'Super Bock Stage',
        artists: [
          { name: 'Joss Stone', headliner: false },
          { name: 'The Wailers', headliner: false },
          { name: 'Belo', headliner: false },
        ],
      },
    ],
  },
  {
    date: '28 Jun',
    weekday: 'Domingo',
    label: 'Urban Day',
    stages: [
      {
        name: 'Palco Mundo',
        artists: [
          { name: '21 Savage', headliner: true },
          { name: 'Central Cee', headliner: false },
          { name: 'Rema', headliner: false },
          { name: 'Matué', headliner: false },
        ],
      },
      {
        name: 'Music Valley',
        artists: [
          { name: 'Filipe Ret', headliner: false },
          { name: 'DENNIS', headliner: false },
          { name: 'Carlão', headliner: false },
          { name: 'Irina Barros', headliner: false },
        ],
      },
      {
        name: 'Super Bock Stage',
        artists: [
          { name: 'CeeLo Green', headliner: false },
          { name: 'Lola Indigo', headliner: false },
        ],
      },
    ],
  },
];

const STAGES = [
  { name: 'Palco Mundo', description: 'O maior palco, os maiores headliners', icon: '🌍' },
  { name: 'Music Valley', description: 'Sons diversos, reuniões inesquecíveis', icon: '🎸' },
  { name: 'Super Bock Stage', description: 'Rock, metal e alternativo', icon: '🤘' },
  { name: 'Palco Galp', description: 'Eletrónica e sets íntimos', icon: '🎧' },
  { name: 'BacanaPlay Digital Stage', description: 'Entretenimento digital e humor', icon: '📱' },
];

const TRANSPORT = [
  { icon: Bus, title: 'Shuttle CARRIS', desc: 'Gare do Oriente → Parque Tejo. Ida: 12h–21h | Volta: 23h–03h. Bilhete: 2€ (pré-venda)' },
  { icon: Train, title: 'Comboio CP', desc: 'Estação de Sacavém (a mais próxima). Tarifas promocionais nos dias do evento' },
  { icon: Train, title: 'Metro', desc: 'Estação Oriente (Linha Vermelha). Ligação direta ao shuttle' },
  { icon: Car, title: 'TVDE / Uber', desc: 'Pontos dedicados de pick-up/drop-off junto ao recinto' },
  { icon: Car, title: 'Telpark Parking', desc: '13 parques estratégicos em Lisboa (Roma, Alameda, Sete Rios, Berna...)' },
];

// ─── SEO ─────────────────────────────────────────────────────────────────────

const eventJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'MusicEvent',
  name: 'Rock in Rio Lisboa 2026',
  description: 'O maior festival de música e entretenimento do mundo chega a Lisboa. 4 dias, 5 palcos, artistas mundiais.',
  startDate: '2026-06-20',
  endDate: '2026-06-28',
  eventStatus: 'https://schema.org/EventScheduled',
  eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
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
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 38.7688,
      longitude: -9.0935,
    },
  },
  performer: [
    { '@type': 'MusicGroup', name: 'Katy Perry' },
    { '@type': 'MusicGroup', name: 'Linkin Park' },
    { '@type': 'MusicGroup', name: 'Rod Stewart' },
    { '@type': 'MusicGroup', name: '21 Savage' },
    { '@type': 'MusicGroup', name: 'Charlie Puth' },
    { '@type': 'MusicGroup', name: 'Cyndi Lauper' },
    { '@type': 'MusicGroup', name: 'Central Cee' },
    { '@type': 'MusicGroup', name: 'Cypress Hill' },
  ],
  organizer: {
    '@type': 'Organization',
    name: 'Rock in Rio',
    url: 'https://rockinriolisboa.pt/',
  },
  offers: {
    '@type': 'Offer',
    url: 'https://worten.seetickets.com/event/rock-in-rio-lisboa-2026/parque-tejo/3430460',
    priceCurrency: 'EUR',
    availability: 'https://schema.org/InStock',
  },
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://www.olhaqueduas.com' },
    { '@type': 'ListItem', position: 2, name: 'Rock in Rio Lisboa 2026', item: 'https://www.olhaqueduas.com/rockinrio' },
  ],
};

// ─── Component ───────────────────────────────────────────────────────────────

const RockInRio = () => {
  const [activeDay, setActiveDay] = useState(0);

  useMetaTags({
    title: 'Rock in Rio Lisboa 2026 — Parceiro Oficial',
    description: 'A Olha que Duas é parceira oficial do Rock in Rio Lisboa 2026. Consulta o cartaz completo, lineup por dia, como chegar ao Parque Tejo e todas as informações do festival. 20, 21, 27 e 28 de Junho.',
    image: 'https://www.olhaqueduas.com/og-rockinrio.jpg',
    imageAlt: 'Olha que Duas x Rock in Rio Lisboa 2026 — Parceiro Oficial',
    url: 'https://www.olhaqueduas.com/rockinrio',
    jsonLd: [eventJsonLd, breadcrumbJsonLd],
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* ─── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden min-h-[85vh] flex items-center justify-center">
        {/* Background gradient */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, hsl(217 85% 12%) 0%, hsl(217 85% 25%) 30%, hsl(260 60% 20%) 60%, hsl(0 70% 20%) 100%)',
          }}
        />

        {/* Animated glow orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute top-1/4 -right-20 w-[500px] h-[500px] rounded-full blur-[120px] animate-rir-glow opacity-40"
            style={{ background: 'radial-gradient(circle, hsl(217 85% 55%) 0%, transparent 70%)' }}
          />
          <div
            className="absolute bottom-1/4 -left-20 w-[400px] h-[400px] rounded-full blur-[100px] animate-rir-glow opacity-30"
            style={{ background: 'radial-gradient(circle, hsl(0 80% 50%) 0%, transparent 70%)', animationDelay: '1.5s' }}
          />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[150px] animate-rir-glow opacity-20"
            style={{ background: 'radial-gradient(circle, hsl(260 60% 45%) 0%, transparent 70%)', animationDelay: '3s' }}
          />
        </div>

        {/* Floating music notes */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          {['♪', '♫', '♪', '♫', '♪', '♫'].map((note, i) => (
            <span
              key={i}
              className="absolute text-white/10 animate-music-float"
              style={{
                left: `${15 + i * 14}%`,
                bottom: '-5%',
                fontSize: `${1.5 + (i % 3) * 0.8}rem`,
                animationDelay: `${i * 2.5}s`,
                animationDuration: `${12 + i * 2}s`,
              }}
            >
              {note}
            </span>
          ))}
        </div>

        {/* Hero content */}
        <div className="relative z-10 text-center px-4 py-20 max-w-4xl mx-auto">
          <Animated animation="fade-up" delay={100}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm mb-8">
              <Music className="w-3.5 h-3.5 text-amber-300" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-amber-300">
                Parceiro Oficial
              </span>
            </div>
          </Animated>

          <Animated animation="fade-up" delay={200}>
            <img
              src={siteConfig.rockInRio.partnerLogoWhite}
              alt="Rock in Rio Lisboa"
              className="mx-auto h-32 md:h-44 lg:h-56 w-auto object-contain drop-shadow-2xl mb-8"
            />
          </Animated>

          <Animated animation="fade-up" delay={400}>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-4 tracking-tight">
              Rock in Rio Lisboa <span className="text-amber-300">2026</span>
            </h1>
          </Animated>

          <Animated animation="fade-up" delay={500}>
            <p className="text-lg md:text-xl text-white/70 mb-6 max-w-2xl mx-auto">
              O maior festival de música e entretenimento do mundo. 4 dias inesquecíveis no Parque Tejo, Lisboa.
            </p>
          </Animated>

          <Animated animation="fade-up" delay={600}>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-white/60">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-amber-300/80" />
                20, 21, 27 e 28 de Junho
              </span>
              <span className="hidden sm:inline text-white/30">|</span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-amber-300/80" />
                Parque Tejo, Lisboa
              </span>
              <span className="hidden sm:inline text-white/30">|</span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-300/80" />
                Portas: 13h
              </span>
            </div>
          </Animated>

          <Animated animation="fade-up" delay={750}>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="https://worten.seetickets.com/event/rock-in-rio-lisboa-2026/parque-tejo/3430460"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-bold text-sm uppercase tracking-wider bg-gradient-to-r from-amber-400 to-amber-500 text-black hover:from-amber-300 hover:to-amber-400 transition-all shadow-lg shadow-amber-500/25 hover:shadow-amber-400/40"
              >
                <Ticket className="w-4 h-4" />
                Comprar Bilhetes
              </a>
              <a
                href="#lineup"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm text-white/80 border border-white/20 hover:bg-white/10 hover:text-white transition-all"
              >
                Ver Lineup
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </Animated>
        </div>
      </section>

      {/* ─── Info Cards ───────────────────────────────────────────────── */}
      <section className="relative -mt-12 z-20 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: Calendar, title: 'Datas', value: '20, 21, 27 e 28 de Junho 2026', sub: '2 fins de semana' },
            { icon: MapPin, title: 'Local', value: 'Parque Tejo', sub: 'Lisboa, Portugal' },
            { icon: Clock, title: 'Horário', value: 'Portas: 13h', sub: 'Encerramento: 02h / 03h' },
          ].map((card, i) => (
            <Animated key={i} animation="fade-up" delay={100 + i * 100}>
              <div className="rounded-xl border border-white/10 bg-background/80 backdrop-blur-xl p-5 text-center shadow-xl">
                <card.icon className="w-6 h-6 mx-auto mb-2 text-amber-400" />
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">{card.title}</p>
                <p className="font-display font-bold text-lg text-foreground">{card.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{card.sub}</p>
              </div>
            </Animated>
          ))}
        </div>
      </section>

      {/* ─── Lineup ───────────────────────────────────────────────────── */}
      <section id="lineup" className="py-20 md:py-28 px-4">
        <div className="max-w-5xl mx-auto">
          <Animated animation="fade-up">
            <div className="text-center mb-12">
              <p className="text-xs uppercase tracking-[0.2em] text-amber-400 font-bold mb-2">Cartaz</p>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">
                Lineup <span className="text-amber-400">2026</span>
              </h2>
            </div>
          </Animated>

          {/* Day tabs */}
          <Animated animation="fade-up" delay={100}>
            <div className="flex flex-wrap justify-center gap-2 mb-10">
              {LINEUP.map((day, i) => (
                <button
                  key={i}
                  onClick={() => setActiveDay(i)}
                  className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                    activeDay === i
                      ? 'bg-gradient-to-r from-[hsl(217,85%,45%)] via-[hsl(260,60%,40%)] to-[hsl(0,70%,45%)] text-white shadow-lg'
                      : 'bg-white/5 border border-white/10 text-muted-foreground hover:bg-white/10 hover:text-foreground'
                  }`}
                >
                  <span className="block">{day.date}</span>
                  <span className="block text-[10px] opacity-70">{day.label}</span>
                </button>
              ))}
            </div>
          </Animated>

          {/* Active day content */}
          <div className="space-y-8">
            {LINEUP[activeDay].stages.map((stage, si) => (
              <Animated key={`${activeDay}-${si}`} animation="fade-up" delay={si * 100}>
                <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6">
                  <h3 className="text-sm uppercase tracking-widest text-amber-400 font-bold mb-4 flex items-center gap-2">
                    <Music className="w-4 h-4" />
                    {stage.name}
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {stage.artists.map((artist, ai) => (
                      <span
                        key={ai}
                        className={`px-4 py-2 rounded-lg border transition-all ${
                          artist.headliner
                            ? 'bg-gradient-to-r from-amber-400/20 to-amber-500/10 border-amber-400/40 text-amber-200 text-lg md:text-xl font-display font-bold'
                            : 'bg-white/5 border-white/10 text-foreground/80 text-sm font-medium'
                        }`}
                      >
                        {artist.name}
                      </span>
                    ))}
                  </div>
                </div>
              </Animated>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Palcos ───────────────────────────────────────────────────── */}
      <section className="py-16 px-4 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <Animated animation="fade-up">
            <div className="text-center mb-10">
              <p className="text-xs uppercase tracking-[0.2em] text-amber-400 font-bold mb-2">Espaços</p>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">Palcos</h2>
            </div>
          </Animated>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {STAGES.map((stage, i) => (
              <Animated key={i} animation="fade-up" delay={i * 80}>
                <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5 text-center hover:border-amber-400/30 transition-colors">
                  <span className="text-3xl mb-3 block">{stage.icon}</span>
                  <h3 className="font-bold text-foreground mb-1">{stage.name}</h3>
                  <p className="text-xs text-muted-foreground">{stage.description}</p>
                </div>
              </Animated>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Como Chegar ──────────────────────────────────────────────── */}
      <section className="py-20 px-4 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <Animated animation="fade-up">
            <div className="text-center mb-12">
              <p className="text-xs uppercase tracking-[0.2em] text-amber-400 font-bold mb-2">Localização</p>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">Como Chegar</h2>
              <p className="text-muted-foreground mt-2">Parque Tejo — Passeio dos Heróis do Mar, 1990-059 Lisboa</p>
            </div>
          </Animated>

          {/* Map */}
          <Animated animation="fade-up" delay={100}>
            <div className="rounded-xl overflow-hidden border border-white/10 mb-10 aspect-video max-h-[400px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3110.5!2d-9.0935!3d38.7688!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd1931ec1b3e7e9d%3A0x5b3c0dbf0e8f2f3a!2sParque%20Tejo!5e0!3m2!1spt-PT!2spt!4v1700000000000!5m2!1spt-PT!2spt"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Mapa - Parque Tejo, Lisboa"
              />
            </div>
          </Animated>

          {/* Transport options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {TRANSPORT.map((t, i) => (
              <Animated key={i} animation="fade-up" delay={150 + i * 80}>
                <div className="flex items-start gap-4 p-4 rounded-xl border border-white/10 bg-white/[0.02]">
                  <div className="shrink-0 w-10 h-10 rounded-lg bg-amber-400/10 border border-amber-400/20 flex items-center justify-center">
                    <t.icon className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-foreground">{t.title}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">{t.desc}</p>
                  </div>
                </div>
              </Animated>
            ))}
          </div>

          {/* Warning */}
          <Animated animation="fade-up" delay={600}>
            <div className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-center">
              <p className="text-sm text-red-300 font-medium">
                ⚠️ Não existe estacionamento junto ao recinto. As ruas envolventes são de acesso exclusivo a moradores.
              </p>
            </div>
          </Animated>
        </div>
      </section>

      {/* ─── CTA ──────────────────────────────────────────────────────── */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <Animated animation="fade-up">
            <div
              className="rounded-2xl overflow-hidden relative p-10 md:p-14"
              style={{
                background: 'linear-gradient(135deg, hsl(217 85% 25%) 0%, hsl(260 60% 30%) 50%, hsl(0 70% 35%) 100%)',
              }}
            >
              {/* Glow */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div
                  className="absolute top-0 right-0 w-64 h-64 rounded-full blur-[80px] animate-rir-glow opacity-30"
                  style={{ background: 'hsl(217 85% 55%)' }}
                />
              </div>

              <div className="relative z-10">
                <img
                  src={siteConfig.rockInRio.partnerLetteringWhite}
                  alt="Rock in Rio Lisboa"
                  className="mx-auto h-10 md:h-14 w-auto object-contain mb-6 opacity-90"
                />
                <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-3">
                  Garante o teu bilhete
                </h2>
                <p className="text-white/70 mb-2 max-w-lg mx-auto">
                  A <strong className="text-amber-300">Olha que Duas</strong> vai estar lá! Junta-te a nós no maior festival do mundo.
                </p>
                <p className="text-xs text-white/50 mb-8">Bilhetes disponíveis na Worten e pontos de venda oficiais</p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <a
                    href="https://worten.seetickets.com/event/rock-in-rio-lisboa-2026/parque-tejo/3430460"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-bold text-sm uppercase tracking-wider bg-gradient-to-r from-amber-400 to-amber-500 text-black hover:from-amber-300 hover:to-amber-400 transition-all shadow-lg shadow-amber-500/25"
                  >
                    <Ticket className="w-4 h-4" />
                    Comprar Bilhetes
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href="https://rockinriolisboa.pt/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm text-white/80 border border-white/20 hover:bg-white/10 hover:text-white transition-all"
                  >
                    Site Oficial
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
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
