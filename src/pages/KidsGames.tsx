import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Sparkles,
  Star,
  Gamepad2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import { Animated } from '@/components/ui/animated';
import { useMetaTags } from '@/hooks/useMetaTags';

const games = [
  {
    emoji: '🧠',
    title: 'Quiz',
    description: 'Testa os teus conhecimentos com perguntas divertidas!',
    color: 'from-pink-400 to-rose-500',
    shadowColor: 'rgba(190,24,93,0.6)',
    route: '/kids/jogos/quiz',
  },
  {
    emoji: '🃏',
    title: 'Memória',
    description: 'Encontra os pares escondidos e treina a tua memória!',
    color: 'from-amber-400 to-orange-500',
    shadowColor: 'rgba(217,119,6,0.6)',
    route: '/kids/jogos/memoria',
  },
  {
    emoji: '🦈',
    title: 'Baby Shark',
    description: 'Ajuda o Baby Shark a recolher notas musicais e fugir dos robôs!',
    color: 'from-sky-400 to-blue-500',
    shadowColor: 'rgba(37,99,235,0.6)',
    route: '/kids/jogos/pacman',
  },
  {
    emoji: '🐍',
    title: 'Cobrinha',
    description: 'Uma cobra colorida que come estrelas e cresce sem parar!',
    color: 'from-emerald-400 to-teal-500',
    shadowColor: 'rgba(13,148,136,0.6)',
    route: '/kids/jogos/snake',
  },
];

export default function KidsGames() {
  useMetaTags({
    title: 'Jogos Kids | Olha que Duas',
    description: 'Jogos divertidos para crianças: Quiz, Memória, Baby Shark Pacman e Snake Colorido. Diversão segura e gratuita!',
    url: 'https://www.olhaqueduas.com/kids/jogos',
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero */}
        <section
          className="relative overflow-hidden pt-28 md:pt-36 pb-20 md:pb-28"
          style={{
            background: 'linear-gradient(180deg, #38bdf8 0%, #7dd3fc 40%, #bae6fd 100%)',
          }}
        >
          {/* Sun */}
          <div className="absolute top-24 right-10 md:right-24 -z-0">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-yellow-300/60 blur-2xl scale-150 animate-pulse" />
              <div className="relative w-16 h-16 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-yellow-200 via-yellow-300 to-amber-400 shadow-[0_0_60px_rgba(253,224,71,0.7)]" />
            </div>
          </div>

          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            {/* Back button */}
            <Animated animation="fade-down">
              <Link to="/kids">
                <Button
                  variant="ghost"
                  className="mb-6 gap-2 text-white hover:bg-white/20 font-bold rounded-full border-2 border-white/40"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Voltar ao Kids
                </Button>
              </Link>
            </Animated>

            <Animated animation="fade-up" className="text-center">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/90 backdrop-blur-sm border-2 border-yellow-300 shadow-lg mb-6">
                <Gamepad2 className="w-4 h-4 text-pink-600" />
                <span className="text-xs md:text-sm font-extrabold uppercase tracking-widest text-pink-600">
                  Zona de Jogos
                </span>
                <Sparkles className="w-4 h-4 text-amber-500" />
              </div>
              <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-6xl text-white drop-shadow-md mb-4">
                Vamos <span style={{ color: '#fde047' }}>jogar!</span>
              </h1>
              <p className="text-lg md:text-xl text-white/90 max-w-xl mx-auto">
                Escolhe um jogo e diverte-te!
              </p>
            </Animated>
          </div>

          {/* Wavy bottom */}
          <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
            <svg viewBox="0 0 1440 120" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
              <path
                fill="hsl(var(--background))"
                d="M0 60 C360 120, 720 0, 1080 60 S1440 120, 1440 60 L1440 120 L0 120 Z"
              />
            </svg>
          </div>
        </section>

        {/* Games Grid */}
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 max-w-3xl mx-auto">
              {games.map((game, index) => (
                <Animated key={game.title} animation="fade-up" delay={index * 100}>
                  <Link to={game.route} className="group block">
                    <div
                      className="relative p-6 md:p-8 rounded-3xl bg-white border-4 border-white shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 text-center"
                      style={{
                        boxShadow: `0 10px 0 ${game.shadowColor}`,
                      }}
                    >
                      {/* Emoji */}
                      <div className="text-6xl md:text-7xl mb-4 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                        {game.emoji}
                      </div>

                      {/* Title */}
                      <h2 className="font-display font-bold text-2xl md:text-3xl text-charcoal mb-2">
                        {game.title}
                      </h2>

                      {/* Description */}
                      <p className="text-charcoal/70 text-sm md:text-base leading-relaxed mb-4">
                        {game.description}
                      </p>

                      {/* Play button */}
                      <div
                        className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r ${game.color} text-white font-bold shadow-lg group-hover:scale-105 transition-transform`}
                      >
                        <Star className="w-4 h-4 fill-white" />
                        Jogar
                      </div>
                    </div>
                  </Link>
                </Animated>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <BackToTop />
    </div>
  );
}
