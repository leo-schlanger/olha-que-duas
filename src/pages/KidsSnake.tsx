import { useCallback, useEffect, useRef, useState } from 'react';
import { Pause } from 'lucide-react';
import { useMetaTags, getPageBreadcrumbJsonLd } from '@/hooks/useMetaTags';
import KidsGameShell from '@/components/kids/games/KidsGameShell';
import GameDPad, { type DPadDir } from '@/components/kids/games/GameDPad';
import GameOverlay from '@/components/kids/games/GameOverlay';
import MoreGames from '@/components/kids/games/MoreGames';
import { kidsSfx } from '@/components/kids/games/gameSounds';
import { useHighScore } from '@/components/kids/games/useHighScore';
import { useSwipe, type Cardinal } from '@/components/kids/games/useSwipe';

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type Phase = 'idle' | 'playing' | 'paused' | 'gameover';

interface Point {
  x: number;
  y: number;
}

const GRID = 16;
const RAINBOW = ['#f472b6', '#fb7185', '#fb923c', '#facc15', '#4ade80', '#22d3ee', '#60a5fa', '#a78bfa'];
const INITIAL: Point[] = [
  { x: 7, y: 8 },
  { x: 6, y: 8 },
  { x: 5, y: 8 },
  { x: 4, y: 8 },
];
const SPEED_START = 220;
const SPEED_MIN = 105;

function randomFood(snake: Point[]): Point {
  let p: Point;
  do {
    p = { x: Math.floor(Math.random() * GRID), y: Math.floor(Math.random() * GRID) };
  } while (snake.some((s) => s.x === p.x && s.y === p.y));
  return p;
}

function opposite(a: Direction, b: Direction) {
  return (
    (a === 'UP' && b === 'DOWN') ||
    (a === 'DOWN' && b === 'UP') ||
    (a === 'LEFT' && b === 'RIGHT') ||
    (a === 'RIGHT' && b === 'LEFT')
  );
}

function toGameDir(d: Cardinal): Direction {
  if (d === 'up') return 'UP';
  if (d === 'down') return 'DOWN';
  if (d === 'left') return 'LEFT';
  return 'RIGHT';
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function drawStar(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  spikes: number,
  outer: number,
  inner: number,
) {
  let rot = (Math.PI / 2) * 3;
  const step = Math.PI / spikes;
  ctx.beginPath();
  ctx.moveTo(cx, cy - outer);
  for (let i = 0; i < spikes; i++) {
    ctx.lineTo(cx + Math.cos(rot) * outer, cy + Math.sin(rot) * outer);
    rot += step;
    ctx.lineTo(cx + Math.cos(rot) * inner, cy + Math.sin(rot) * inner);
    rot += step;
  }
  ctx.closePath();
}

function drawCandy(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number, t: number) {
  const bounce = Math.sin(t * 6) * size * 0.08;
  const spin = t * 1.4;
  ctx.save();
  ctx.translate(cx, cy + bounce);
  ctx.rotate(spin);
  ctx.shadowColor = '#fbbf24';
  ctx.shadowBlur = 16;
  ctx.fillStyle = '#fde047';
  drawStar(ctx, 0, 0, 5, size * 0.42, size * 0.18);
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#fb7185';
  ctx.beginPath();
  ctx.arc(0, 0, size * 0.16, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(-size * 0.04, -size * 0.04, size * 0.05, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawCuteSnake(
  ctx: CanvasRenderingContext2D,
  points: Point[],
  dir: Direction,
  t: number,
  cell: number,
) {
  for (let i = points.length - 1; i >= 0; i--) {
    const p = points[i];
    const wave = Math.sin(t * 7 + i * 0.55) * cell * 0.06;
    let ox = 0;
    let oy = 0;
    if (dir === 'LEFT' || dir === 'RIGHT') oy = wave;
    else ox = wave;
    const cx = p.x * cell + cell / 2 + ox;
    const cy = p.y * cell + cell / 2 + oy;
    const radius = cell * (i === 0 ? 0.48 : 0.4 - Math.min(i, 8) * 0.012);
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fillStyle = RAINBOW[i % RAINBOW.length];
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.beginPath();
    ctx.arc(cx - radius * 0.25, cy - radius * 0.3, radius * 0.38, 0, Math.PI * 2);
    ctx.fill();

    if (i === 0) {
      let fx = 0;
      let fy = 0;
      if (dir === 'RIGHT') fx = 1;
      else if (dir === 'LEFT') fx = -1;
      else if (dir === 'UP') fy = -1;
      else fy = 1;

      const ex = radius * 0.32;
      const ey = radius * 0.28;
      const e1x = cx + fx * ex - fy * ey;
      const e1y = cy + fy * ex + fx * ey;
      const e2x = cx + fx * ex + fy * ey;
      const e2y = cy + fy * ex - fx * ey;

      ctx.fillStyle = '#fda4af';
      ctx.beginPath();
      ctx.arc(cx - fy * radius * 0.42, cy + fx * radius * 0.42, radius * 0.14, 0, Math.PI * 2);
      ctx.arc(cx + fy * radius * 0.42, cy - fx * radius * 0.42, radius * 0.14, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(e1x, e1y, radius * 0.22, 0, Math.PI * 2);
      ctx.arc(e2x, e2y, radius * 0.22, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.arc(e1x + fx * radius * 0.06, e1y + fy * radius * 0.06, radius * 0.11, 0, Math.PI * 2);
      ctx.arc(e2x + fx * radius * 0.06, e2y + fy * radius * 0.06, radius * 0.11, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(e1x + fx * 1, e1y - 1, radius * 0.04, 0, Math.PI * 2);
      ctx.arc(e2x + fx * 1, e2y - 1, radius * 0.04, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#be185d';
      ctx.lineWidth = radius * 0.1;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(cx + fx * radius * 0.18, cy + fy * radius * 0.18, radius * 0.22, 0.3, Math.PI - 0.3);
      ctx.stroke();

      ctx.strokeStyle = '#f472b6';
      ctx.lineWidth = radius * 0.08;
      ctx.beginPath();
      ctx.moveTo(cx + fx * radius * 0.48, cy + fy * radius * 0.48);
      ctx.lineTo(cx + fx * radius * 0.72, cy + fy * radius * 0.55);
      ctx.stroke();
    }
  }
}

const jsonLd = [
  getPageBreadcrumbJsonLd('Cobra Arco-Íris', 'https://www.olhaqueduas.com/kids/jogos/snake', [
    { name: 'Kids', url: 'https://www.olhaqueduas.com/kids' },
    { name: 'Jogos', url: 'https://www.olhaqueduas.com/kids/jogos' },
  ]),
  {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Cobra Arco-Íris — Olha que Duas Kids',
    url: 'https://www.olhaqueduas.com/kids/jogos/snake',
    applicationCategory: 'GameApplication',
    operatingSystem: 'Web',
    inLanguage: 'pt-PT',
    description:
      'Cobrinha fofa e colorida do espaço Kids. Apanha estrelas, cresce e evita as paredes.',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
  },
];

const KidsSnake = () => {
  useMetaTags({
    title: 'Cobra Arco-Íris — Jogo da cobra fofo para crianças',
    description:
      'Apanha estrelas com a cobrinha mais colorida do Cantinho! Jogo clássico, fofo e gratuito no Olha que Duas Kids.',
    image: 'https://www.olhaqueduas.com/og-kids.jpg',
    imageAlt: 'Cobra Arco-Íris — Olha que Duas Kids',
    url: 'https://www.olhaqueduas.com/kids/jogos/snake',
    tags: ['cobra arco-íris', 'snake infantil', 'olha que duas kids', 'jogo da cobra'],
    jsonLd,
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const snakeRef = useRef<Point[]>([...INITIAL]);
  const prevRef = useRef<Point[]>([...INITIAL]);
  const dirRef = useRef<Direction>('RIGHT');
  const nextDirRef = useRef<Direction>('RIGHT');
  const foodRef = useRef<Point>(randomFood(INITIAL));
  const scoreRef = useRef(0);
  const phaseRef = useRef<Phase>('idle');
  const speedRef = useRef(SPEED_START);
  const accRef = useRef(0);
  const lastTsRef = useRef(0);
  const timeRef = useRef(0);
  const animRef = useRef(0);

  const [phase, setPhase] = useState<Phase>('idle');
  const [score, setScore] = useState(0);
  const [canvasSize, setCanvasSize] = useState(400);
  const { highScore, updateHighScore } = useHighScore('oqd-kids-snake-high');

  const syncPhase = (p: Phase) => {
    phaseRef.current = p;
    setPhase(p);
  };

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) setCanvasSize(Math.min(containerRef.current.clientWidth, 520));
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const startGame = useCallback(() => {
    snakeRef.current = INITIAL.map((p) => ({ ...p }));
    prevRef.current = INITIAL.map((p) => ({ ...p }));
    dirRef.current = 'RIGHT';
    nextDirRef.current = 'RIGHT';
    foodRef.current = randomFood(INITIAL);
    scoreRef.current = 0;
    speedRef.current = SPEED_START;
    accRef.current = 0;
    setScore(0);
    syncPhase('playing');
    kidsSfx.tap();
  }, []);

  const handleDir = useCallback((d: Direction) => {
    if (phaseRef.current !== 'playing') return;
    if (!opposite(d, dirRef.current)) nextDirRef.current = d;
  }, []);

  const swipe = useSwipe((d) => handleDir(toGameDir(d)));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const map: Record<string, Direction> = {
        ArrowUp: 'UP',
        w: 'UP',
        W: 'UP',
        ArrowDown: 'DOWN',
        s: 'DOWN',
        S: 'DOWN',
        ArrowLeft: 'LEFT',
        a: 'LEFT',
        A: 'LEFT',
        ArrowRight: 'RIGHT',
        d: 'RIGHT',
        D: 'RIGHT',
      };
      if (map[e.key]) {
        e.preventDefault();
        handleDir(map[e.key]);
      }
      if (e.key === ' ' || e.key === 'Escape') {
        e.preventDefault();
        if (phaseRef.current === 'playing') syncPhase('paused');
        else if (phaseRef.current === 'paused') syncPhase('playing');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleDir]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const stepGame = () => {
      const snake = snakeRef.current;
      dirRef.current = nextDirRef.current;
      const dir = dirRef.current;
      const head = { ...snake[0] };
      if (dir === 'UP') head.y -= 1;
      if (dir === 'DOWN') head.y += 1;
      if (dir === 'LEFT') head.x -= 1;
      if (dir === 'RIGHT') head.x += 1;

      if (
        head.x < 0 ||
        head.x >= GRID ||
        head.y < 0 ||
        head.y >= GRID ||
        snake.some((s) => s.x === head.x && s.y === head.y)
      ) {
        updateHighScore(scoreRef.current);
        kidsSfx.lose();
        syncPhase('gameover');
        return;
      }

      prevRef.current = snake.map((s) => ({ ...s }));
      const next = [head, ...snake];
      if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
        scoreRef.current += 1;
        setScore(scoreRef.current);
        foodRef.current = randomFood(next);
        kidsSfx.collect();
        speedRef.current = Math.max(SPEED_MIN, SPEED_START - scoreRef.current * 7);
      } else {
        next.pop();
      }
      snakeRef.current = next;
    };

    const loop = (ts: number) => {
      const dt = lastTsRef.current ? Math.min(40, ts - lastTsRef.current) : 16;
      lastTsRef.current = ts;
      timeRef.current += dt / 1000;
      const t = timeRef.current;

      const dpr = window.devicePixelRatio || 1;
      if (canvas.width !== canvasSize * dpr || canvas.height !== canvasSize * dpr) {
        canvas.width = canvasSize * dpr;
        canvas.height = canvasSize * dpr;
      }
      const cell = canvas.width / GRID;

      if (phaseRef.current === 'playing') {
        accRef.current += dt;
        if (accRef.current >= speedRef.current) {
          accRef.current %= speedRef.current;
          stepGame();
        }
      }

      const progress =
        phaseRef.current === 'playing' ? Math.min(1, accRef.current / speedRef.current) : 1;
      const ease = 1 - (1 - progress) * (1 - progress);
      const current = snakeRef.current;
      const prev = prevRef.current;
      const visual: Point[] = current.map((seg, i) => {
        const from = prev[Math.min(i, prev.length - 1)] ?? seg;
        return { x: lerp(from.x, seg.x, ease), y: lerp(from.y, seg.y, ease) };
      });

      const bg = ctx.createLinearGradient(0, 0, 0, canvas.height);
      bg.addColorStop(0, '#fce7f3');
      bg.addColorStop(0.4, '#fef9c3');
      bg.addColorStop(0.75, '#dbeafe');
      bg.addColorStop(1, '#d1fae5');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let r = 0; r < GRID; r++) {
        for (let c = 0; c < GRID; c++) {
          if ((r + c) % 2 === 0) {
            ctx.fillStyle = 'rgba(255,255,255,0.22)';
            ctx.beginPath();
            ctx.roundRect(c * cell + cell * 0.18, r * cell + cell * 0.18, cell * 0.64, cell * 0.64, cell * 0.2);
            ctx.fill();
          }
        }
      }

      const food = foodRef.current;
      drawCandy(ctx, food.x * cell + cell / 2, food.y * cell + cell / 2, cell, t);
      drawCuteSnake(ctx, visual, dirRef.current, t, cell);

      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animRef.current);
  }, [canvasSize, updateHighScore]);

  const onDPad = (d: DPadDir) => handleDir(toGameDir(d));

  return (
    <KidsGameShell
      title="Cobra Arco-Íris"
      subtitle="A cobrinha mais fofa e colorida do Cantinho."
      hud={
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <span className="px-4 py-2 rounded-full bg-yellow-100 border-2 border-yellow-300 font-extrabold text-yellow-800">
            Estrelas: {score}
          </span>
          <span className="px-4 py-2 rounded-full bg-pink-100 border-2 border-pink-300 font-extrabold text-pink-700">
            Recorde: {highScore}
          </span>
          {phase === 'playing' && (
            <button
              type="button"
              onClick={() => syncPhase('paused')}
              className="min-h-12 px-4 rounded-full bg-white border-4 border-white shadow-[0_4px_0_rgba(0,0,0,0.12)] font-extrabold text-sky-800 inline-flex items-center gap-1 cursor-pointer"
            >
              <Pause className="w-4 h-4" />
              Pausa
            </button>
          )}
        </div>
      }
      controls={
        <div className="space-y-3">
          <GameDPad onDir={onDPad} />
          <p className="text-center text-sm font-bold text-sky-950/70 max-w-md mx-auto">
            Setas, WASD ou desliza no ecrã. Apanha as estrelas e não bates nas paredes!
          </p>
        </div>
      }
    >
      <div
        ref={containerRef}
        className="relative mx-auto rounded-[1.5rem] border-4 border-white shadow-[0_12px_0_rgba(236,72,153,0.28)] overflow-hidden"
        style={{ width: '100%', maxWidth: 520 }}
      >
        <canvas
          ref={canvasRef}
          width={canvasSize}
          height={canvasSize}
          className="block w-full h-auto touch-none bg-pink-50"
          style={{ overscrollBehavior: 'contain' }}
          {...swipe}
        />
        {phase === 'idle' && (
          <GameOverlay
            variant="start"
            title="Cobra Arco-Íris"
            message="Uma cobrinha fofa que adora estrelas de açúcar."
            howTo={[
              'Apanha as estrelas para crescer e ficar ainda mais colorida.',
              'Não toques nas paredes nem na tua própria cauda.',
              'Quanto mais estrelas, mais ela dança!',
            ]}
            primaryLabel="Começar"
            onPrimary={startGame}
          />
        )}
        {phase === 'paused' && (
          <GameOverlay
            variant="pause"
            title="Pausa"
            message="A cobrinha ficou a descansar a barriga."
            primaryLabel="Continuar"
            onPrimary={() => syncPhase('playing')}
            secondaryLabel="Recomeçar"
            onSecondary={startGame}
          />
        )}
        {phase === 'gameover' && (
          <GameOverlay
            variant="lose"
            title="Ai, bateu!"
            message="A cobrinha precisa de um abraço. Tenta outra vez!"
            scoreLabel={`${scoreRef.current} ${scoreRef.current === 1 ? 'estrela' : 'estrelas'}`}
            primaryLabel="Jogar outra vez"
            onPrimary={startGame}
          />
        )}
      </div>
      <div className="max-w-2xl mx-auto">
        <MoreGames />
      </div>
    </KidsGameShell>
  );
};

export default KidsSnake;
