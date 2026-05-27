import { useRef, useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Play, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import { useMetaTags, getPageBreadcrumbJsonLd } from '@/hooks/useMetaTags';

/* ---------- Types & Constants ---------- */

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type GameState = 'idle' | 'playing' | 'gameover';

interface Point {
  x: number;
  y: number;
}

const GRID = 20;
const RAINBOW: string[] = [
  '#ef4444', // red
  '#f97316', // orange
  '#eab308', // yellow
  '#22c55e', // green
  '#3b82f6', // blue
  '#8b5cf6', // purple
  '#ec4899', // pink
];

const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 9, y: 10 },
  { x: 8, y: 10 },
];

const SPEED_START = 200;
const SPEED_MIN = 100;

/* ---------- Helpers ---------- */

function randomFood(snake: Point[]): Point {
  let p: Point;
  do {
    p = { x: Math.floor(Math.random() * GRID), y: Math.floor(Math.random() * GRID) };
  } while (snake.some((s) => s.x === p.x && s.y === p.y));
  return p;
}

function oppositeDir(a: Direction, b: Direction): boolean {
  return (
    (a === 'UP' && b === 'DOWN') ||
    (a === 'DOWN' && b === 'UP') ||
    (a === 'LEFT' && b === 'RIGHT') ||
    (a === 'RIGHT' && b === 'LEFT')
  );
}

/* ---------- Component ---------- */

const snakeJsonLd = [
  // Breadcrumb
  getPageBreadcrumbJsonLd('Cobrinha Arco-Íris', 'https://www.olhaqueduas.com/kids/jogos/snake', [
    { name: 'Kids', url: 'https://www.olhaqueduas.com/kids' },
    { name: 'Jogos', url: 'https://www.olhaqueduas.com/kids/jogos' },
  ]),
  // WebApplication (Game)
  {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    '@id': 'https://www.olhaqueduas.com/kids/jogos/snake#app',
    name: 'Cobrinha Arco-Íris — Jogo da Cobra Infantil',
    url: 'https://www.olhaqueduas.com/kids/jogos/snake',
    applicationCategory: 'GameApplication',
    applicationSubCategory: 'Jogo da Cobra',
    operatingSystem: 'Web',
    browserRequirements: 'Requires JavaScript',
    inLanguage: 'pt-PT',
    description:
      'Jogo da Cobrinha clássico com cores do arco-íris! Apanha estrelas, faz a cobra crescer e evita as paredes. Com registo de recorde e velocidade crescente — adaptado para crianças.',
    audience: {
      '@type': 'PeopleAudience',
      suggestedMinAge: 4,
      suggestedMaxAge: 12,
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
    },
    provider: {
      '@type': 'Organization',
      name: 'Olha que Duas',
      url: 'https://www.olhaqueduas.com',
    },
  },
];

const KidsSnake = () => {
  useMetaTags({
    title: 'Cobrinha Arco-Íris — Jogo da Cobra Infantil Online Grátis',
    description:
      'Joga a Cobrinha Arco-Íris no espaço Kids do Olha que Duas! Apanha estrelas, faz a cobra colorida crescer e evita as paredes. Jogo clássico Snake adaptado para crianças dos 4 aos 12 anos — gratuito, seguro, com registo de recorde e velocidade crescente.',
    image: 'https://www.olhaqueduas.com/og-kids.jpg',
    imageAlt: 'Olha que Duas Kids — Cobrinha Arco-Íris jogo da cobra infantil online',
    url: 'https://www.olhaqueduas.com/kids/jogos/snake',
    tags: [
      'jogo da cobrinha',
      'snake infantil online',
      'jogo cobra arco-íris',
      'jogos clássicos crianças',
      'snake game kids',
      'jogo apanhar estrelas',
      'olha que duas kids',
      'jogos online grátis',
      'jogo da cobra online',
      'jogos retro infantis',
    ],
    jsonLd: snakeJsonLd,
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Game state stored in refs for the game loop (avoids stale closures)
  const snakeRef = useRef<Point[]>([...INITIAL_SNAKE]);
  const dirRef = useRef<Direction>('RIGHT');
  const nextDirRef = useRef<Direction>('RIGHT');
  const foodRef = useRef<Point>(randomFood(INITIAL_SNAKE));
  const scoreRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // React state for UI rendering
  const [gameState, setGameState] = useState<GameState>('idle');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [canvasSize, setCanvasSize] = useState(400);

  /* ----- Responsive canvas size ----- */
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const w = containerRef.current.clientWidth;
        setCanvasSize(Math.min(w, 500));
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  /* ----- Drawing ----- */
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cell = canvas.width / GRID;

    // Background gradient
    const bg = ctx.createLinearGradient(0, 0, 0, canvas.height);
    bg.addColorStop(0, '#e0f2fe'); // sky-100
    bg.addColorStop(0.5, '#fef9c3'); // yellow-100
    bg.addColorStop(1, '#fce7f3'); // pink-100
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle grid
    ctx.strokeStyle = 'rgba(0,0,0,0.04)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= GRID; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cell, 0);
      ctx.lineTo(i * cell, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cell);
      ctx.lineTo(canvas.width, i * cell);
      ctx.stroke();
    }

    // Food — star with glow
    const food = foodRef.current;
    const fx = food.x * cell + cell / 2;
    const fy = food.y * cell + cell / 2;
    const starRadius = cell * 0.4;

    // Glow
    ctx.save();
    ctx.shadowColor = '#fbbf24';
    ctx.shadowBlur = 18;
    ctx.fillStyle = '#fbbf24';
    drawStar(ctx, fx, fy, 5, starRadius, starRadius * 0.45);
    ctx.fill();
    ctx.restore();

    // Star body
    ctx.fillStyle = '#fde047';
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1.5;
    drawStar(ctx, fx, fy, 5, starRadius, starRadius * 0.45);
    ctx.fill();
    ctx.stroke();

    // Snake segments
    const snake = snakeRef.current;
    for (let i = snake.length - 1; i >= 0; i--) {
      const seg = snake[i];
      const cx = seg.x * cell + cell / 2;
      const cy = seg.y * cell + cell / 2;
      const radius = cell * 0.42;

      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fillStyle = RAINBOW[i % RAINBOW.length];
      ctx.fill();

      // Slight outline
      ctx.strokeStyle = 'rgba(0,0,0,0.15)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Head: draw eyes
      if (i === 0) {
        const dir = dirRef.current;
        const eyeOff = radius * 0.35;
        let ex1: number, ey1: number, ex2: number, ey2: number;
        let px1: number, py1: number, px2: number, py2: number;
        const pupilOff = radius * 0.12;

        if (dir === 'RIGHT') {
          ex1 = cx + eyeOff * 0.5; ey1 = cy - eyeOff;
          ex2 = cx + eyeOff * 0.5; ey2 = cy + eyeOff;
          px1 = ex1 + pupilOff; py1 = ey1;
          px2 = ex2 + pupilOff; py2 = ey2;
        } else if (dir === 'LEFT') {
          ex1 = cx - eyeOff * 0.5; ey1 = cy - eyeOff;
          ex2 = cx - eyeOff * 0.5; ey2 = cy + eyeOff;
          px1 = ex1 - pupilOff; py1 = ey1;
          px2 = ex2 - pupilOff; py2 = ey2;
        } else if (dir === 'UP') {
          ex1 = cx - eyeOff; ey1 = cy - eyeOff * 0.5;
          ex2 = cx + eyeOff; ey2 = cy - eyeOff * 0.5;
          px1 = ex1; py1 = ey1 - pupilOff;
          px2 = ex2; py2 = ey2 - pupilOff;
        } else {
          ex1 = cx - eyeOff; ey1 = cy + eyeOff * 0.5;
          ex2 = cx + eyeOff; ey2 = cy + eyeOff * 0.5;
          px1 = ex1; py1 = ey1 + pupilOff;
          px2 = ex2; py2 = ey2 + pupilOff;
        }

        // Eye whites
        const eyeR = radius * 0.22;
        ctx.fillStyle = '#fff';
        ctx.beginPath(); ctx.arc(ex1, ey1, eyeR, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(ex2, ey2, eyeR, 0, Math.PI * 2); ctx.fill();

        // Pupils
        const pupR = eyeR * 0.55;
        ctx.fillStyle = '#1e293b';
        ctx.beginPath(); ctx.arc(px1, py1, pupR, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(px2, py2, pupR, 0, Math.PI * 2); ctx.fill();
      }
    }
  }, []);

  /* ----- Game tick ----- */
  const tick = useCallback(() => {
    const snake = snakeRef.current;
    dirRef.current = nextDirRef.current;
    const dir = dirRef.current;

    const head = { ...snake[0] };
    if (dir === 'UP') head.y -= 1;
    if (dir === 'DOWN') head.y += 1;
    if (dir === 'LEFT') head.x -= 1;
    if (dir === 'RIGHT') head.x += 1;

    // Wall collision
    if (head.x < 0 || head.x >= GRID || head.y < 0 || head.y >= GRID) {
      endGame();
      return;
    }

    // Self collision
    if (snake.some((s) => s.x === head.x && s.y === head.y)) {
      endGame();
      return;
    }

    const newSnake = [head, ...snake];

    // Eating food?
    if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
      scoreRef.current += 1;
      setScore(scoreRef.current);
      foodRef.current = randomFood(newSnake);

      // Speed up
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        const speed = Math.max(SPEED_MIN, SPEED_START - scoreRef.current * 5);
        intervalRef.current = setInterval(tick, speed);
      }
    } else {
      newSnake.pop();
    }

    snakeRef.current = newSnake;
    draw();
  }, [draw, endGame]);

  /* ----- Start / End / Reset ----- */
  const startGame = useCallback(() => {
    snakeRef.current = [...INITIAL_SNAKE];
    dirRef.current = 'RIGHT';
    nextDirRef.current = 'RIGHT';
    foodRef.current = randomFood(INITIAL_SNAKE);
    scoreRef.current = 0;
    setScore(0);
    setGameState('playing');
    draw();
    intervalRef.current = setInterval(tick, SPEED_START);
  }, [draw, tick]);

  const endGame = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setHighScore((prev) => Math.max(prev, scoreRef.current));
    setGameState('gameover');
  }, []);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Draw once on idle to show the initial state
  useEffect(() => {
    if (gameState === 'idle') {
      draw();
    }
  }, [gameState, draw, canvasSize]);

  /* ----- Keyboard controls ----- */
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (gameState !== 'playing') return;

      const map: Record<string, Direction> = {
        ArrowUp: 'UP',
        ArrowDown: 'DOWN',
        ArrowLeft: 'LEFT',
        ArrowRight: 'RIGHT',
      };

      const newDir = map[e.key];
      if (newDir && !oppositeDir(newDir, dirRef.current)) {
        e.preventDefault();
        nextDirRef.current = newDir;
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [gameState]);

  /* ----- Direction button handler ----- */
  const handleDir = (d: Direction) => {
    if (gameState !== 'playing') return;
    if (!oppositeDir(d, dirRef.current)) {
      nextDirRef.current = d;
    }
  };

  /* ----- Render ----- */
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 max-w-2xl">
          {/* Back button */}
          <Button
            asChild
            variant="ghost"
            className="mb-6 text-pink-600 hover:text-pink-700 hover:bg-pink-50 font-bold text-base gap-2"
          >
            <Link to="/kids/jogos">
              <ArrowLeft className="w-5 h-5" />
              Voltar aos Jogos
            </Link>
          </Button>

          {/* Title */}
          <h1 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-center mb-2">
            <span className="text-pink-500">Cobra </span>
            <span className="text-yellow-500">Arco-</span>
            <span className="text-sky-500">Iris</span>
            <span className="ml-2">🐍🌈</span>
          </h1>
          <p className="text-center text-charcoal/70 text-lg mb-6">
            Apanha as estrelas e faz a cobrinha crescer!
          </p>

          {/* Score bar */}
          <div className="flex items-center justify-center gap-6 mb-4 text-lg font-bold">
            <span className="px-4 py-1.5 rounded-full bg-yellow-100 border-2 border-yellow-300 text-yellow-700">
              Estrelas: {score}
            </span>
            <span className="px-4 py-1.5 rounded-full bg-pink-100 border-2 border-pink-300 text-pink-700">
              Recorde: {highScore}
            </span>
          </div>

          {/* Canvas wrapper */}
          <div
            ref={containerRef}
            className="relative mx-auto rounded-2xl border-4 border-pink-300 shadow-xl overflow-hidden bg-sky-50"
            style={{ width: '100%', maxWidth: 500 }}
          >
            <canvas
              ref={canvasRef}
              width={canvasSize}
              height={canvasSize}
              className="block w-full h-auto"
            />

            {/* Start overlay */}
            {gameState === 'idle' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 backdrop-blur-sm">
                <p className="font-display font-bold text-2xl sm:text-3xl text-pink-600 mb-6">
                  Toca para começar!
                </p>
                <button
                  onClick={startGame}
                  className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-400 via-yellow-400 to-sky-400 flex items-center justify-center shadow-[0_8px_0_rgba(0,0,0,0.15)] hover:shadow-[0_4px_0_rgba(0,0,0,0.15)] hover:translate-y-1 active:translate-y-2 active:shadow-none transition-all border-4 border-white"
                >
                  <Play className="w-10 h-10 text-white ml-1" />
                </button>
              </div>
            )}

            {/* Game over overlay */}
            {gameState === 'gameover' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
                <p className="font-display font-bold text-2xl sm:text-3xl text-pink-600 mb-2">
                  A cobrinha bateu! 🌈
                </p>
                <p className="text-xl font-bold text-yellow-600 mb-6">
                  Apanhaste {scoreRef.current} {scoreRef.current === 1 ? 'estrela' : 'estrelas'}!
                </p>
                <button
                  onClick={startGame}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-pink-400 via-yellow-400 to-sky-400 text-white font-extrabold text-lg shadow-[0_8px_0_rgba(0,0,0,0.15)] hover:shadow-[0_4px_0_rgba(0,0,0,0.15)] hover:translate-y-1 active:translate-y-2 active:shadow-none transition-all border-4 border-white"
                >
                  <RotateCcw className="w-5 h-5" />
                  Jogar outra vez
                </button>
              </div>
            )}
          </div>

          {/* Mobile direction buttons */}
          <div className="mt-6 flex flex-col items-center gap-2 select-none">
            <button
              onPointerDown={() => handleDir('UP')}
              className="w-16 h-16 rounded-2xl bg-gradient-to-b from-sky-300 to-sky-400 text-white shadow-[0_4px_0_rgba(0,0,0,0.15)] active:shadow-none active:translate-y-1 transition-all border-2 border-white flex items-center justify-center"
              aria-label="Cima"
            >
              <ChevronUp className="w-8 h-8" />
            </button>
            <div className="flex gap-2">
              <button
                onPointerDown={() => handleDir('LEFT')}
                className="w-16 h-16 rounded-2xl bg-gradient-to-r from-yellow-300 to-yellow-400 text-white shadow-[0_4px_0_rgba(0,0,0,0.15)] active:shadow-none active:translate-y-1 transition-all border-2 border-white flex items-center justify-center"
                aria-label="Esquerda"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              <div className="w-16 h-16" /> {/* spacer */}
              <button
                onPointerDown={() => handleDir('RIGHT')}
                className="w-16 h-16 rounded-2xl bg-gradient-to-l from-yellow-300 to-yellow-400 text-white shadow-[0_4px_0_rgba(0,0,0,0.15)] active:shadow-none active:translate-y-1 transition-all border-2 border-white flex items-center justify-center"
                aria-label="Direita"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </div>
            <button
              onPointerDown={() => handleDir('DOWN')}
              className="w-16 h-16 rounded-2xl bg-gradient-to-t from-pink-300 to-pink-400 text-white shadow-[0_4px_0_rgba(0,0,0,0.15)] active:shadow-none active:translate-y-1 transition-all border-2 border-white flex items-center justify-center"
              aria-label="Baixo"
            >
              <ChevronDown className="w-8 h-8" />
            </button>
          </div>

          {/* Instructions */}
          <div className="mt-8 text-center text-charcoal/60 text-sm space-y-1">
            <p>Usa as <strong>setas do teclado</strong> ou os <strong>botoes</strong> para controlar a cobra.</p>
            <p>Apanha as estrelas e nao batas nas paredes!</p>
          </div>
        </div>
      </main>

      <Footer />
      <BackToTop />
    </div>
  );
};

/* ---------- Star drawing helper ---------- */

function drawStar(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  spikes: number,
  outerRadius: number,
  innerRadius: number,
) {
  let rot = (Math.PI / 2) * 3;
  const step = Math.PI / spikes;

  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius);

  for (let i = 0; i < spikes; i++) {
    ctx.lineTo(cx + Math.cos(rot) * outerRadius, cy + Math.sin(rot) * outerRadius);
    rot += step;
    ctx.lineTo(cx + Math.cos(rot) * innerRadius, cy + Math.sin(rot) * innerRadius);
    rot += step;
  }

  ctx.lineTo(cx, cy - outerRadius);
  ctx.closePath();
}

export default KidsSnake;
