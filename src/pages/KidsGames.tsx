import { Link } from 'react-router-dom';
import { Sparkles, Star } from 'lucide-react';
import { Animated } from '@/components/ui/animated';
import { useMetaTags, getPageBreadcrumbJsonLd } from '@/hooks/useMetaTags';
import KidsGameShell from '@/components/kids/games/KidsGameShell';
import { BabySharkArt, MemoryArt, QuizArt, SnakeArt } from '@/components/kids/games/GameArts';
import logoKids from '@/assets/kids/logo-kids.webp';
import alexandraCartoon from '@/assets/kids/alexandra-cartoon.webp';
import marluceCartoon from '@/assets/kids/marluce-cartoon.webp';
import leoCartoon from '@/assets/kids/leo-cartoon.webp';

const games = [
  {
    title: 'Quiz do Cantinho',
    description: 'Perguntas da rádio, das Duas e do Cantinho da Pequenada.',
    age: '3–8 anos',
    shadow: 'rgba(190,24,93,0.45)',
    accent: 'from-pink-400 to-rose-500',
    route: '/kids/jogos/quiz',
    Art: QuizArt,
    mascot: alexandraCartoon,
    mascotAlt: 'Alexandra',
  },
  {
    title: 'Memória das Duas',
    description: 'Encontra os pares da Alexandra, da Marluce, do Leo e do Micro.',
    age: '3–10 anos',
    shadow: 'rgba(217,119,6,0.45)',
    accent: 'from-amber-400 to-orange-500',
    route: '/kids/jogos/memoria',
    Art: MemoryArt,
    mascot: marluceCartoon,
    mascotAlt: 'Marluce',
  },
  {
    title: 'Baby Shark',
    description: 'Nada com o Baby Shark, apanha bolhas musicais e foge das águas-vivas!',
    age: '5–12 anos',
    shadow: 'rgba(37,99,235,0.45)',
    accent: 'from-sky-400 to-blue-500',
    route: '/kids/jogos/pacman',
    Art: BabySharkArt,
    mascot: logoKids,
    mascotAlt: 'Olha que Duas Kids',
  },
  {
    title: 'Cobra Arco-Íris',
    description: 'Uma cobrinha fofa e colorida. Apanha estrelas e cresce sem parar!',
    age: '5–12 anos',
    shadow: 'rgba(13,148,136,0.45)',
    accent: 'from-emerald-400 to-teal-500',
    route: '/kids/jogos/snake',
    Art: SnakeArt,
    mascot: leoCartoon,
    mascotAlt: 'Leo',
  },
];

const gamesJsonLd = [
  getPageBreadcrumbJsonLd('Jogos Infantis', 'https://www.olhaqueduas.com/kids/jogos', [
    { name: 'Kids', url: 'https://www.olhaqueduas.com/kids' },
  ]),
  {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': 'https://www.olhaqueduas.com/kids/jogos#webpage',
    url: 'https://www.olhaqueduas.com/kids/jogos',
    name: 'Jogos do Cantinho — Olha que Duas Kids',
    description:
      'Jogos do espaço Kids do Olha que Duas: Quiz do Cantinho, Memória das Duas, Baby Shark e Cobra Arco-Íris. Gratuitos, sem anúncios, pensados para a pequenada.',
    isPartOf: { '@id': 'https://www.olhaqueduas.com/kids#webpage' },
    inLanguage: 'pt-PT',
    dateModified: '2026-08-20',
    audience: {
      '@type': 'PeopleAudience',
      suggestedMinAge: 3,
      suggestedMaxAge: 12,
      audienceType: 'Crianças e Famílias',
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Jogos disponíveis no Olha que Duas Kids',
    numberOfItems: 4,
    itemListElement: games.map((game, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'WebApplication',
        name: game.title,
        url: `https://www.olhaqueduas.com${game.route}`,
        applicationCategory: 'GameApplication',
        operatingSystem: 'Web',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
      },
    })),
  },
];

export default function KidsGames() {
  useMetaTags({
    title: 'Jogos do Cantinho — Quiz, Memória, Baby Shark e Cobra Arco-Íris',
    description:
      'Entra no Cantinho da Pequenada e joga! Quiz da rádio, Memória das estrelas, Baby Shark e Cobra Arco-Íris. Jogos seguros, sem anúncios, para crianças dos 3 aos 12 anos.',
    image: 'https://www.olhaqueduas.com/og-kids.jpg',
    imageAlt: 'Olha que Duas Kids — Jogos do Cantinho da Pequenada',
    url: 'https://www.olhaqueduas.com/kids/jogos',
    tags: [
      'jogos infantis online',
      'olha que duas kids',
      'cantinho da pequenada',
      'quiz infantil',
      'jogo da memória',
      'jogos educativos portugal',
      'jogos sem anúncios',
    ],
    jsonLd: gamesJsonLd,
  });

  return (
    <KidsGameShell
      title="Jogos do Cantinho"
      backTo="/kids"
      backLabel="Voltar ao Kids"
      showMascots
      hero={
        <div className="text-center mb-8 md:mb-10">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/90 border-2 border-yellow-300 shadow-lg mb-5">
            <Sparkles className="w-4 h-4 text-pink-600" />
            <span className="text-xs md:text-sm font-extrabold uppercase tracking-widest text-pink-600">
              Zona de Jogos
            </span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <div className="relative flex items-end justify-center gap-0 max-w-lg mx-auto mb-4">
            <img
              src={alexandraCartoon}
              alt="Alexandra"
              className="h-24 sm:h-32 md:h-40 object-contain drop-shadow-lg motion-safe:animate-bob-slow"
            />
            <img
              src={logoKids}
              alt="Olha que Duas Kids"
              className="relative z-10 h-28 sm:h-36 md:h-44 w-auto object-contain drop-shadow-xl -mx-2 motion-safe:animate-bob-fast"
            />
            <img
              src={marluceCartoon}
              alt="Marluce"
              className="h-24 sm:h-28 md:h-36 object-contain drop-shadow-lg motion-safe:animate-bob-medium"
            />
          </div>
          <h1 className="font-kids font-extrabold text-4xl sm:text-5xl md:text-6xl text-white drop-shadow-[0_4px_0_rgba(3,105,161,0.35)]">
            Vamos <span className="text-yellow-200">jogar</span> no Cantinho!
          </h1>
          <p className="mt-3 text-lg md:text-xl font-bold text-white/95 max-w-xl mx-auto">
            Quatro brincadeiras com a Alexandra, a Marluce, o Leo e o Micro — o mascote da rádio.
          </p>
        </div>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-10 max-w-3xl mx-auto">
        {games.map((game, index) => (
          <Animated key={game.title} animation="fade-up" delay={index * 80}>
            <Link to={game.route} className="group block cursor-pointer">
              <article
                className="relative rounded-[1.75rem] bg-white border-4 border-white p-5 md:p-6 text-center transition-transform duration-200 group-hover:-translate-y-1.5"
                style={{ boxShadow: `0 12px 0 ${game.shadow}, inset 0 2px 0 rgba(255,255,255,0.8)` }}
              >
                <img
                  src={game.mascot}
                  alt=""
                  className="absolute -top-10 right-3 h-16 w-16 object-contain drop-shadow-md pointer-events-none group-hover:rotate-6 transition-transform"
                />
                <div
                  className={`mx-auto mb-4 h-28 md:h-32 rounded-2xl bg-gradient-to-br ${game.accent} p-2 overflow-hidden`}
                >
                  <game.Art />
                </div>
                <h2 className="font-kids font-extrabold text-2xl md:text-3xl text-sky-950 mb-1">
                  {game.title}
                </h2>
                <p className="text-sky-900/70 text-sm md:text-base font-semibold leading-relaxed mb-3 min-h-[3rem]">
                  {game.description}
                </p>
                <span className="inline-block mb-4 text-xs font-extrabold uppercase tracking-wide text-sky-700 bg-sky-100 border-2 border-sky-200 rounded-full px-3 py-1">
                  {game.age}
                </span>
                <div
                  className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r ${game.accent} text-white font-extrabold shadow-md group-hover:scale-105 transition-transform`}
                >
                  <Star className="w-4 h-4 fill-white" />
                  Jogar
                </div>
              </article>
            </Link>
          </Animated>
        ))}
      </div>
    </KidsGameShell>
  );
}
