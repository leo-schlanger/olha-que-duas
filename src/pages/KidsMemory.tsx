import { useCallback, useEffect, useRef, useState } from 'react';
import { BookOpen, Mic2, Radio, RotateCcw, Star } from 'lucide-react';
import { useMetaTags, getPageBreadcrumbJsonLd } from '@/hooks/useMetaTags';
import KidsGameShell from '@/components/kids/games/KidsGameShell';
import GameOverlay from '@/components/kids/games/GameOverlay';
import MoreGames from '@/components/kids/games/MoreGames';
import { kidsSfx } from '@/components/kids/games/gameSounds';
import alexandraCartoon from '@/assets/kids/alexandra-cartoon.webp';
import marluceCartoon from '@/assets/kids/marluce-cartoon.webp';
import leoCartoon from '@/assets/kids/leo-cartoon.webp';
import logoKids from '@/assets/kids/logo-kids.webp';

type Difficulty = 'easy' | 'normal';

type Face =
  | { kind: 'photo'; src: string; label: string }
  | { kind: 'icon'; key: 'radio' | 'mic' | 'book' | 'star'; label: string };

interface Card {
  id: number;
  face: Face;
  matchKey: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const FACES: { face: Face; key: string }[] = [
  { key: 'alexandra', face: { kind: 'photo', src: alexandraCartoon, label: 'Alexandra' } },
  { key: 'marluce', face: { kind: 'photo', src: marluceCartoon, label: 'Marluce' } },
  { key: 'leo', face: { kind: 'photo', src: leoCartoon, label: 'Leo' } },
  { key: 'micro', face: { kind: 'photo', src: logoKids, label: 'Micro' } },
  { key: 'radio', face: { kind: 'icon', key: 'radio', label: 'Rádio' } },
  { key: 'mic', face: { kind: 'icon', key: 'mic', label: 'Microfone' } },
  { key: 'book', face: { kind: 'icon', key: 'book', label: 'História' } },
  { key: 'star', face: { kind: 'icon', key: 'star', label: 'Estrela' } },
];

const DIFFICULTY: Record<Difficulty, { cols: number; pairs: number; label: string }> = {
  easy: { cols: 4, pairs: 6, label: 'Fácil' },
  normal: { cols: 4, pairs: 8, label: 'Normal' },
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildDeck(pairs: number): Card[] {
  const picked = FACES.slice(0, pairs);
  const doubled = [...picked, ...picked];
  return shuffle(doubled).map((item, i) => ({
    id: i,
    face: item.face,
    matchKey: item.key,
    isFlipped: false,
    isMatched: false,
  }));
}

function FaceArt({ face }: { face: Face }) {
  if (face.kind === 'photo') {
    return (
      <img
        src={face.src}
        alt={face.label}
        className="h-[86%] w-[86%] object-cover object-[center_8%] pointer-events-none rounded-xl"
      />
    );
  }
  const cls = 'w-10 h-10 sm:w-12 sm:h-12 text-pink-600';
  if (face.key === 'radio') return <Radio className={cls} />;
  if (face.key === 'mic') return <Mic2 className={cls} />;
  if (face.key === 'book') return <BookOpen className={cls} />;
  return <Star className={`${cls} fill-yellow-300 text-yellow-500`} />;
}

const FLIP_STYLES = `
.perspective-card { perspective: 700px; }
.card-inner { position: relative; width: 100%; height: 100%; transition: transform 0.5s cubic-bezier(.4,.2,.2,1); transform-style: preserve-3d; }
.card-inner.flipped { transform: rotateY(180deg); }
.card-face { position: absolute; inset: 0; backface-visibility: hidden; -webkit-backface-visibility: hidden; display: flex; align-items: center; justify-content: center; border-radius: 1rem; }
.card-front { transform: rotateY(180deg); }
@media (prefers-reduced-motion: reduce) {
  .card-inner { transition: none; }
}
`;

const memoryJsonLd = [
  getPageBreadcrumbJsonLd('Memória das Duas', 'https://www.olhaqueduas.com/kids/jogos/memoria', [
    { name: 'Kids', url: 'https://www.olhaqueduas.com/kids' },
    { name: 'Jogos', url: 'https://www.olhaqueduas.com/kids/jogos' },
  ]),
  {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Memória das Duas — Olha que Duas Kids',
    url: 'https://www.olhaqueduas.com/kids/jogos/memoria',
    applicationCategory: 'GameApplication',
    operatingSystem: 'Web',
    inLanguage: 'pt-PT',
    description:
      'Jogo da memória com a Alexandra, a Marluce, o Leo e o Micro, o mascote da rádio Olha que Duas Kids.',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
  },
];

const KidsMemory = () => {
  useMetaTags({
    title: 'Memória das Duas — Encontra os pares do Cantinho',
    description:
      'Encontra os pares da Alexandra, da Marluce, do Leo e do Micro no jogo da memória do Olha que Duas Kids.',
    image: 'https://www.olhaqueduas.com/og-kids.jpg',
    imageAlt: 'Memória das Duas — Olha que Duas Kids',
    url: 'https://www.olhaqueduas.com/kids/jogos/memoria',
    tags: ['jogo da memória', 'olha que duas kids', 'cantinho da pequenada'],
    jsonLd: memoryJsonLd,
  });

  const [difficulty, setDifficulty] = useState<Difficulty>('normal');
  const [cards, setCards] = useState<Card[]>(() => buildDeck(DIFFICULTY.normal.pairs));
  const [flippedIds, setFlippedIds] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [locked, setLocked] = useState(false);
  const [won, setWon] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startNewGame = useCallback((diff: Difficulty) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setDifficulty(diff);
    setCards(buildDeck(DIFFICULTY[diff].pairs));
    setFlippedIds([]);
    setMoves(0);
    setLocked(false);
    setWon(false);
    kidsSfx.tap();
  }, []);

  useEffect(() => {
    if (cards.length > 0 && cards.every((c) => c.isMatched)) {
      setWon(true);
      kidsSfx.win();
    }
  }, [cards]);

  useEffect(() => () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  const handleCardClick = useCallback(
    (id: number) => {
      if (locked) return;
      const card = cards[id];
      if (!card || card.isFlipped || card.isMatched) return;

      kidsSfx.flip();
      const updated = cards.map((c) => (c.id === id ? { ...c, isFlipped: true } : c));
      const newFlipped = [...flippedIds, id];
      setCards(updated);
      setFlippedIds(newFlipped);

      if (newFlipped.length === 2) {
        setMoves((m) => m + 1);
        setLocked(true);
        const [first, second] = newFlipped;
        if (updated[first].matchKey === updated[second].matchKey) {
          kidsSfx.match();
          setCards((prev) =>
            prev.map((c) => (c.id === first || c.id === second ? { ...c, isMatched: true } : c)),
          );
          setFlippedIds([]);
          setLocked(false);
        } else {
          kidsSfx.mismatch();
          timeoutRef.current = setTimeout(() => {
            setCards((prev) =>
              prev.map((c) =>
                c.id === first || c.id === second ? { ...c, isFlipped: false } : c,
              ),
            );
            setFlippedIds([]);
            setLocked(false);
          }, 900);
        }
      }
    },
    [cards, flippedIds, locked],
  );

  return (
    <KidsGameShell
      title="Memória das Duas"
      subtitle="Encontra os pares da família do Cantinho!"
      hud={
        <div className="flex flex-wrap items-center justify-center gap-3">
          {(Object.keys(DIFFICULTY) as Difficulty[]).map((diff) => {
            const active = difficulty === diff && !won;
            return (
              <button
                key={diff}
                type="button"
                onClick={() => startNewGame(diff)}
                className={`min-h-12 px-5 rounded-full font-extrabold text-sm border-4 cursor-pointer shadow-[0_4px_0_rgba(0,0,0,0.12)] hover:translate-y-0.5 transition-all ${
                  active
                    ? 'bg-pink-500 text-white border-white'
                    : 'bg-white text-pink-600 border-white'
                }`}
              >
                {DIFFICULTY[diff].label}
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => startNewGame(difficulty)}
            className="min-h-12 px-5 rounded-full font-extrabold text-sm border-4 border-white bg-sky-100 text-sky-800 cursor-pointer inline-flex items-center gap-2 shadow-[0_4px_0_rgba(0,0,0,0.1)]"
          >
            <RotateCcw className="w-4 h-4" />
            Reiniciar
          </button>
          <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-yellow-100 border-2 border-yellow-300 font-extrabold text-yellow-800">
            {moves} {moves === 1 ? 'jogada' : 'jogadas'}
          </span>
        </div>
      }
    >
      <style>{FLIP_STYLES}</style>
      <div className="flex justify-center">
        <div
          className="grid grid-cols-4 gap-2.5 sm:gap-3 w-full"
          style={{ maxWidth: '440px' }}
        >
          {cards.map((card) => (
            <button
              key={card.id}
              type="button"
              aria-label={
                card.isFlipped || card.isMatched
                  ? card.face.label
                  : 'Carta virada. Toca para revelar.'
              }
              className="perspective-card aspect-square cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-yellow-300 rounded-2xl"
              onClick={() => handleCardClick(card.id)}
            >
              <div
                className={`card-inner ${card.isFlipped || card.isMatched ? 'flipped' : ''}`}
              >
                <div
                  className="card-face border-4 border-white shadow-[0_6px_0_rgba(190,24,93,0.2)]"
                  style={{
                    background: 'linear-gradient(135deg, #ec4899 0%, #f59e0b 50%, #38bdf8 100%)',
                  }}
                >
                  <img src={logoKids} alt="" className="h-10 w-10 sm:h-12 sm:w-12 object-contain" />
                </div>
                <div
                  className={`card-face card-front border-4 flex-col gap-1 ${
                    card.isMatched
                      ? 'border-emerald-400 bg-emerald-50'
                      : 'border-yellow-300 bg-white'
                  }`}
                >
                  <FaceArt face={card.face} />
                  <span className="text-[10px] sm:text-xs font-extrabold text-sky-900/80">
                    {card.face.label}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {won && (
        <div className="fixed inset-0 z-50">
          <GameOverlay
            variant="win"
            title="Parabéns!"
            message="Encontraste todos os pares do Cantinho!"
            scoreLabel={`${moves} ${moves === 1 ? 'jogada' : 'jogadas'}`}
            primaryLabel="Jogar outra vez"
            onPrimary={() => startNewGame(difficulty)}
          />
        </div>
      )}

      <div className="max-w-2xl mx-auto">
        <MoreGames />
      </div>
    </KidsGameShell>
  );
};

export default KidsMemory;
