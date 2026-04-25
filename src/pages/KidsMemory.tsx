import { useState, useCallback, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, RotateCcw, Trophy, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';

/* ------------------------------------------------------------------ */
/*  Types & constants                                                  */
/* ------------------------------------------------------------------ */

type Difficulty = 'easy' | 'normal';

interface Card {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const ALL_EMOJIS = ['🐱', '🐶', '🦁', '🐸', '🦋', '🌈', '⭐', '🎵'];

const DIFFICULTY_CONFIG: Record<Difficulty, { cols: number; rows: number; pairs: number; label: string }> = {
  easy:   { cols: 4, rows: 3, pairs: 6, label: 'Facil' },
  normal: { cols: 4, rows: 4, pairs: 8, label: 'Normal' },
};

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildDeck(pairs: number): Card[] {
  const emojis = ALL_EMOJIS.slice(0, pairs);
  const doubled = [...emojis, ...emojis];
  return shuffle(doubled).map((emoji, i) => ({
    id: i,
    emoji,
    isFlipped: false,
    isMatched: false,
  }));
}

/* ------------------------------------------------------------------ */
/*  CSS for card flip (injected once)                                  */
/* ------------------------------------------------------------------ */

const FLIP_STYLES = `
.perspective-card {
  perspective: 600px;
}
.card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.5s cubic-bezier(.4,.2,.2,1);
  transform-style: preserve-3d;
}
.card-inner.flipped {
  transform: rotateY(180deg);
}
.card-face {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 1rem;
}
.card-front {
  transform: rotateY(180deg);
}
@keyframes match-bounce {
  0%   { transform: rotateY(180deg) scale(1); }
  40%  { transform: rotateY(180deg) scale(1.18); }
  70%  { transform: rotateY(180deg) scale(0.95); }
  100% { transform: rotateY(180deg) scale(1); }
}
.card-inner.matched .card-front {
  animation: match-bounce 0.5s ease-out;
}
@keyframes confetti-fall {
  0%   { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
  100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
}
.confetti-piece {
  position: absolute;
  width: 10px;
  height: 10px;
  border-radius: 2px;
  animation: confetti-fall linear forwards;
}
`;

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

const KidsMemory = () => {
  const [difficulty, setDifficulty] = useState<Difficulty>('normal');
  const [cards, setCards] = useState<Card[]>(() => buildDeck(DIFFICULTY_CONFIG.normal.pairs));
  const [flippedIds, setFlippedIds] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [locked, setLocked] = useState(false);
  const [won, setWon] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const config = DIFFICULTY_CONFIG[difficulty];

  /* -- New game ---------------------------------------------------- */
  const startNewGame = useCallback((diff: Difficulty) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setDifficulty(diff);
    setCards(buildDeck(DIFFICULTY_CONFIG[diff].pairs));
    setFlippedIds([]);
    setMoves(0);
    setLocked(false);
    setWon(false);
  }, []);

  /* -- Check for win ----------------------------------------------- */
  useEffect(() => {
    if (cards.length > 0 && cards.every((c) => c.isMatched)) {
      setWon(true);
    }
  }, [cards]);

  /* -- Card click -------------------------------------------------- */
  const handleCardClick = useCallback(
    (id: number) => {
      if (locked) return;

      const card = cards[id];
      if (!card || card.isFlipped || card.isMatched) return;

      // Flip this card
      const updated = cards.map((c) => (c.id === id ? { ...c, isFlipped: true } : c));
      const newFlipped = [...flippedIds, id];

      setCards(updated);
      setFlippedIds(newFlipped);

      if (newFlipped.length === 2) {
        setMoves((m) => m + 1);
        setLocked(true);

        const [first, second] = newFlipped;
        if (updated[first].emoji === updated[second].emoji) {
          // Match!
          setCards((prev) =>
            prev.map((c) =>
              c.id === first || c.id === second ? { ...c, isMatched: true } : c
            )
          );
          setFlippedIds([]);
          setLocked(false);
        } else {
          // No match — flip back after delay
          timeoutRef.current = setTimeout(() => {
            setCards((prev) =>
              prev.map((c) =>
                c.id === first || c.id === second ? { ...c, isFlipped: false } : c
              )
            );
            setFlippedIds([]);
            setLocked(false);
          }, 1000);
        }
      }
    },
    [cards, flippedIds, locked]
  );

  /* -- Cleanup timeout on unmount ---------------------------------- */
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  /* -- Grid columns class ------------------------------------------ */
  const gridClass = config.cols === 4 ? 'grid-cols-4' : 'grid-cols-3';

  return (
    <div className="min-h-screen bg-background">
      <style>{FLIP_STYLES}</style>
      <Header />

      <main className="pt-24 pb-16">
        {/* Back button */}
        <div className="container mx-auto px-4 sm:px-6 mb-6">
          <Button
            asChild
            variant="ghost"
            className="h-12 px-5 text-base font-extrabold rounded-full bg-pink-100 hover:bg-pink-200 text-pink-600 border-2 border-pink-300 shadow-[0_4px_0_rgba(190,24,93,0.25)] hover:shadow-[0_2px_0_rgba(190,24,93,0.25)] hover:translate-y-0.5 transition-all"
          >
            <Link to="/kids/jogos" className="inline-flex items-center gap-2">
              <ArrowLeft className="w-5 h-5" />
              Voltar aos Jogos
            </Link>
          </Button>
        </div>

        {/* Title */}
        <div className="container mx-auto px-4 sm:px-6 text-center mb-8">
          <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-6xl">
            <span
              style={{
                background: 'linear-gradient(135deg, #ec4899 0%, #fde047 50%, #38bdf8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 4px 0 rgba(0,0,0,0.10))',
              }}
            >
              Jogo da Memoria
            </span>
          </h1>
          <p className="mt-3 text-lg md:text-xl font-bold text-pink-600/80">
            Encontra todos os pares!
          </p>
        </div>

        {/* Difficulty selector + moves + restart */}
        <div className="container mx-auto px-4 sm:px-6 max-w-lg mb-8">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {/* Difficulty buttons */}
            {(Object.keys(DIFFICULTY_CONFIG) as Difficulty[]).map((diff) => {
              const cfg = DIFFICULTY_CONFIG[diff];
              const active = difficulty === diff && !won;
              return (
                <button
                  key={diff}
                  onClick={() => startNewGame(diff)}
                  className={`
                    px-5 py-2.5 rounded-full font-extrabold text-sm border-4 transition-all duration-200
                    shadow-[0_4px_0_rgba(0,0,0,0.15)] hover:shadow-[0_2px_0_rgba(0,0,0,0.15)] hover:translate-y-0.5
                    ${
                      active
                        ? 'bg-pink-500 text-white border-pink-300'
                        : 'bg-white text-pink-600 border-pink-200 hover:bg-pink-50'
                    }
                  `}
                >
                  {cfg.label} ({cfg.rows}x{cfg.cols})
                </button>
              );
            })}

            {/* Restart */}
            <button
              onClick={() => startNewGame(difficulty)}
              className="px-5 py-2.5 rounded-full font-extrabold text-sm border-4 border-sky-200 bg-sky-100 text-sky-700 hover:bg-sky-200 transition-all duration-200 shadow-[0_4px_0_rgba(0,0,0,0.1)] hover:shadow-[0_2px_0_rgba(0,0,0,0.1)] hover:translate-y-0.5 inline-flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reiniciar
            </button>
          </div>

          {/* Moves counter */}
          <div className="mt-5 text-center">
            <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-yellow-100 border-2 border-yellow-300 shadow-sm">
              <span className="text-2xl">🎯</span>
              <span className="font-extrabold text-yellow-800 text-lg">
                {moves} {moves === 1 ? 'jogada' : 'jogadas'}
              </span>
            </span>
          </div>
        </div>

        {/* Card grid */}
        <div className="container mx-auto px-4 sm:px-6 flex justify-center">
          <div
            className={`grid ${gridClass} gap-3 sm:gap-4 w-full`}
            style={{ maxWidth: config.cols === 4 ? '420px' : '340px' }}
          >
            {cards.map((card) => (
              <div
                key={card.id}
                className="perspective-card aspect-square cursor-pointer"
                onClick={() => handleCardClick(card.id)}
              >
                <div
                  className={`card-inner ${card.isFlipped || card.isMatched ? 'flipped' : ''} ${
                    card.isMatched ? 'matched' : ''
                  }`}
                >
                  {/* Back face (question mark) */}
                  <div
                    className="card-face card-back border-4 border-white shadow-[0_6px_0_rgba(0,0,0,0.12)] hover:shadow-[0_3px_0_rgba(0,0,0,0.12)] hover:translate-y-0.5 transition-all"
                    style={{
                      background: 'linear-gradient(135deg, #ec4899 0%, #a855f7 50%, #38bdf8 100%)',
                    }}
                  >
                    <span className="text-4xl sm:text-5xl font-extrabold text-white drop-shadow-md select-none">
                      ?
                    </span>
                    {/* Decorative dots */}
                    <span className="absolute top-2 left-2 w-2 h-2 rounded-full bg-white/40" />
                    <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-white/40" />
                    <span className="absolute bottom-2 left-2 w-2 h-2 rounded-full bg-white/40" />
                    <span className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-white/40" />
                  </div>

                  {/* Front face (emoji) */}
                  <div
                    className={`card-face card-front border-4 shadow-[0_6px_0_rgba(0,0,0,0.08)] ${
                      card.isMatched
                        ? 'border-emerald-400 bg-emerald-50'
                        : 'border-yellow-300 bg-white'
                    }`}
                  >
                    <span className="text-4xl sm:text-5xl select-none">{card.emoji}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Victory overlay */}
        {won && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            {/* Confetti */}
            <Confetti />

            <div
              className="relative mx-4 max-w-md w-full rounded-[2rem] p-10 text-center border-4 border-white shadow-2xl"
              style={{
                background: 'linear-gradient(135deg, #fde047 0%, #ec4899 50%, #38bdf8 100%)',
              }}
            >
              <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/20 rounded-full blur-2xl" />
              <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-white/20 rounded-full blur-2xl" />

              <Trophy className="w-16 h-16 text-yellow-200 mx-auto mb-4 drop-shadow-lg" />
              <h2 className="font-display font-bold text-5xl md:text-6xl text-white drop-shadow-md">
                Parabens!
              </h2>
              <p className="mt-4 text-xl text-white/95 font-bold">
                Encontraste todos os pares!
              </p>
              <div className="mt-3 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/30 backdrop-blur-sm">
                <span className="text-2xl">🎯</span>
                <span className="font-extrabold text-white text-lg">
                  {moves} {moves === 1 ? 'jogada' : 'jogadas'}
                </span>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={() => startNewGame(difficulty)}
                  size="lg"
                  className="h-14 px-8 text-base font-extrabold rounded-full bg-white hover:bg-yellow-100 text-pink-600 shadow-[0_8px_0_rgba(0,0,0,0.15)] hover:shadow-[0_4px_0_rgba(0,0,0,0.15)] hover:translate-y-1 transition-all border-4 border-yellow-300"
                >
                  <RotateCcw className="w-5 h-5 mr-2" />
                  Jogar outra vez
                </Button>
                <Button
                  asChild
                  size="lg"
                  className="h-14 px-8 text-base font-extrabold rounded-full bg-pink-500 hover:bg-pink-600 text-white shadow-[0_8px_0_rgba(190,24,93,0.6)] hover:shadow-[0_4px_0_rgba(190,24,93,0.6)] hover:translate-y-1 transition-all border-4 border-white"
                >
                  <Link to="/kids/jogos" className="inline-flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Mais Jogos
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
      <BackToTop />
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Confetti sub-component                                             */
/* ------------------------------------------------------------------ */

const CONFETTI_COLORS = ['#ec4899', '#fde047', '#38bdf8', '#a855f7', '#34d399', '#fb923c'];

const Confetti = () => {
  const pieces = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 2}s`,
    duration: `${2 + Math.random() * 2}s`,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    rotation: `${Math.random() * 360}deg`,
    size: 6 + Math.random() * 8,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {pieces.map((p) => (
        <span
          key={p.id}
          className="confetti-piece"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            animationDelay: p.delay,
            animationDuration: p.duration,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
          }}
        />
      ))}
    </div>
  );
};

export default KidsMemory;
