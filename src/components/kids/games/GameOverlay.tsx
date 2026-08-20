import { Link } from 'react-router-dom';
import { Play, RotateCcw, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import logoKids from '@/assets/kids/logo-kids.webp';

interface GameOverlayProps {
  variant: 'start' | 'win' | 'lose' | 'pause';
  title: string;
  message?: string;
  scoreLabel?: string;
  primaryLabel: string;
  onPrimary: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
  howTo?: string[];
}

const CONFETTI = ['#ec4899', '#fde047', '#38bdf8', '#a855f7', '#34d399', '#fb923c'];

function Confetti() {
  const pieces = Array.from({ length: 36 }, (_, i) => ({
    id: i,
    left: `${(i * 2.8) % 100}%`,
    delay: `${(i % 8) * 0.12}s`,
    duration: `${2.2 + (i % 5) * 0.25}s`,
    color: CONFETTI[i % CONFETTI.length],
    size: 7 + (i % 5),
    round: i % 2 === 0,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {pieces.map((p) => (
        <span
          key={p.id}
          className="kids-confetti"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            animationDelay: p.delay,
            animationDuration: p.duration,
            borderRadius: p.round ? '50%' : '2px',
          }}
        />
      ))}
    </div>
  );
}

export default function GameOverlay({
  variant,
  title,
  message,
  scoreLabel,
  primaryLabel,
  onPrimary,
  secondaryLabel,
  onSecondary,
  howTo,
}: GameOverlayProps) {
  const showConfetti = variant === 'win';

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-sky-950/40 backdrop-blur-[3px] p-3">
      {showConfetti && <Confetti />}
      <div
        role="dialog"
        aria-labelledby="kids-game-overlay-title"
        className="relative mx-auto w-full max-w-sm rounded-[1.75rem] border-4 border-white bg-white p-6 md:p-8 text-center shadow-[0_14px_0_rgba(190,24,93,0.25)]"
      >
        <img
          src={logoKids}
          alt=""
          className="mx-auto mb-3 h-16 w-16 md:h-20 md:w-20 object-contain drop-shadow-md"
        />
        <h2
          id="kids-game-overlay-title"
          className="font-kids font-extrabold text-3xl md:text-4xl text-pink-600 leading-tight"
        >
          {title}
        </h2>
        {message && (
          <p className="mt-2 text-base md:text-lg font-semibold text-sky-900/80">{message}</p>
        )}
        {scoreLabel && (
          <p className="mt-3 inline-flex items-center rounded-full bg-yellow-100 border-2 border-yellow-300 px-4 py-1.5 font-kids font-bold text-yellow-800">
            {scoreLabel}
          </p>
        )}
        {howTo && howTo.length > 0 && (
          <ul className="mt-4 space-y-1.5 text-left text-sm font-semibold text-charcoal/70">
            {howTo.map((line) => (
              <li key={line} className="flex gap-2">
                <Sparkles className="w-4 h-4 text-pink-500 shrink-0 mt-0.5" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-6 flex flex-col gap-3">
          <Button
            type="button"
            onClick={onPrimary}
            className="h-14 px-6 text-base font-kids font-extrabold rounded-full bg-pink-500 hover:bg-pink-600 text-white shadow-[0_8px_0_rgba(190,24,93,0.6)] hover:shadow-[0_4px_0_rgba(190,24,93,0.6)] hover:translate-y-1 transition-all border-4 border-white cursor-pointer"
          >
            {variant === 'start' || variant === 'pause' ? (
              <Play className="w-5 h-5 mr-2 fill-white" />
            ) : (
              <RotateCcw className="w-5 h-5 mr-2" />
            )}
            {primaryLabel}
          </Button>
          {secondaryLabel && onSecondary && (
            <button
              type="button"
              onClick={onSecondary}
              className="h-12 px-6 rounded-full font-kids font-extrabold text-pink-600 bg-pink-50 hover:bg-pink-100 border-2 border-pink-200 cursor-pointer"
            >
              {secondaryLabel}
            </button>
          )}
          {variant !== 'pause' && (
            <Link
              to="/kids/jogos"
              className="text-sm font-bold text-sky-700 hover:text-sky-900 underline-offset-4 hover:underline"
            >
              Mais jogos do Cantinho
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
