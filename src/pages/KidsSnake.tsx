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

const GRID = 18;
const RAINBOW = ['#ec4899', '#f97316', '#eab308', '#22c55e', '#38bdf8', '#8b5cf6'];
const INITIAL: Point[] = [
  { x: 8, y: 9 },
  { x: 7, y: 9 },
  { x: 6, y: 9 },
];
const SPEED_START = 210;
const SPEED_MIN = 110;

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

function drawNote(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number) {
  ctx.save();
  ctx.shadowColor = '#f472b6';
  ctx.shadowBlur = 12;
  ctx.fillStyle = '#ec4899';
  ctx.beginPath();
  ctx.ellipse(cx - size * 0.1, cy + size * 0.12, size * 0.22, size * 0.16, -0.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#ec4899';
  ctx.lineWidth = size * 0.1;
  ctx.beginPath();
  ctx.moveTo(cx + size * 0.08, cy + size * 0.1);
  ctx.lineTo(cx + size * 0.08, cy - size * 0.32);
  ctx.stroke();
  ctx.restore();
}

const jsonLd = [
  getPageBreadcrumbJsonLd('Cobra Musical', 'https://www.olhaqueduas.com/kids/jogos/snake', [
    { name: 'Kids', url: 'https://www.olhaqueduas.com/kids' },
    { name: 'Jogos', url: 'https://www.olhaqueduas.com/kids/jogos' },
  ]),
  {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Cobra Musical — Olha que Duas Kids',
    url: 'https://www.olhaqueduas.com/kids/jogos/snake',
    applicationCategory: 'GameApplication',
    operatingSystem: 'Web',
    inLanguage: 'pt-PT',
    description:
      'A cobra da rádio Olha que Duas Kids apanha notas musicais e cresce. Jogo clássico com a cara do Cantinho da Pequenada.',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
  },
];

const KidsSnake = () => {
  useMetaTags({
    title: 'Cobra Musical — Jogo da rádio Olha que Duas Kids',
    description:
      'Apanha as notas da rádio e faz a cobra do Cantinho crescer. Jogo gratuito e seguro do Olha que Duas Kids.',
    image: 'https://www.olhaqueduas.com/og-kids.jpg',
    imageAlt: 'Cobra Musical — Olha que Duas Kids',
    url: 'https://www.olhaqueduas.com/kids/jogos/snake',
    tags: ['cobra musical', 'snake infantil', 'olha que duas kids', 'cantinho da pequenada'],
    jsonLd,
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const snakeRef = useRef<Point[]>([...INITIAL]);
  const dirRef = useRef<Direction>('RIGHT');
  const nextDirRef = useRef<Direction>('RIGHT');
  const foodRef = useRef<Point>(randomFood(INITIAL));
  const scoreRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const phaseRef = useRef<Phase>('idle');

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

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const cell = canvas.width / GRID;

    const bg = ctx.createLinearGradient(0, 0, 0, canvas.height);
    bg.addColorStop(0, '#e0f2fe');
    bg.addColorStop(0.55, '#fef9c3');
    bg.addColorStop(1, '#fce7f3');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = 'rgba(14,116,144,0.08)';
    ctx.lineWidth = 1;
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

    const food = foodRef.current;
    drawNote(ctx, food.x * cell + cell / 2, food.y * cell + cell / 2, cell * 0.7);

    const snake = snakeRef.current;
    for (let i = snake.length - 1; i >= 0; i--) {
      const seg = snake[i];
      const cx = seg.x * cell + cell / 2;
      const cy = seg.y * cell + cell / 2;
      const radius = cell * (i === 0 ? 0.46 : 0.4);
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fillStyle = RAINBOW[i % RAINBOW.length];
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.45)';
      ctx.lineWidth = 2;
      ctx.stroke();

      if (i === 0) {
        const dir = dirRef.current;
        const eyeOff = radius * 0.32;
        let ex1 = cx;
        let ey1 = cy;
        let ex2 = cx;
        let ey2 = cy;
        if (dir === 'RIGHT') {
          ex1 = cx + eyeOff * 0.4;
          ey1 = cy - eyeOff;
          ex2 = cx + eyeOff * 0.4;
          ey2 = cy + eyeOff;
        } else if (dir === 'LEFT') {
          ex1 = cx - eyeOff * 0.4;
          ey1 = cy - eyeOff;
          ex2 = cx - eyeOff * 0.4;
          ey2 = cy + eyeOff;
        } else if (dir === 'UP') {
          ex1 = cx - eyeOff;
          ey1 = cy - eyeOff * 0.4;
          ex2 = cx + eyeOff;
          ey2 = cy - eyeOff * 0.4;
        } else {
          ex1 = cx - eyeOff;
          ey1 = cy + eyeOff * 0.4;
          ex2 = cx + eyeOff;
          ey2 = cy + eyeOff * 0.4;
        }
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(ex1, ey1, radius * 0.22, 0, Math.PI * 2);
        ctx.arc(ex2, ey2, radius * 0.22, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.arc(ex1, ey1, radius * 0.12, 0, Math.PI * 2);
        ctx.arc(ex2, ey2, radius * 0.12, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }, []);

  const stopLoop = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const tick = useCallback(() => {
    const snake = snakeRef.current;
    dirRef.current = nextDirRef.current;
    const dir = dirRef.current;
    const head = { ...snake[0] };
    if (dir === 'UP') head.y -= 1;
    if (dir === 'DOWN') head.y += 1;
    if (dir === 'LEFT') head.x -= 1;
    if (dir === 'RIGHT') head.x += 1;

    if (head.x < 0 || head.x >= GRID || head.y < 0 || head.y >= GRID || snake.some((s) => s.x === head.x && s.y === head.y)) {
      stopLoop();
      updateHighScore(scoreRef.current);
      kidsSfx.lose();
      syncPhase('gameover');
      return;
    }

    const next = [head, ...snake];
    if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
      scoreRef.current += 1;
      setScore(scoreRef.current);
      foodRef.current = randomFood(next);
      kidsSfx.collect();
      stopLoop();
      const speed = Math.max(SPEED_MIN, SPEED_START - scoreRef.current * 6);
      intervalRef.current = setInterval(tick, speed);
    } else {
      next.pop();
    }
    snakeRef.current = next;
    draw();
  }, [draw, updateHighScore]);

  const startGame = useCallback(() => {
    stopLoop();
    snakeRef.current = [...INITIAL];
    dirRef.current = 'RIGHT';
    nextDirRef.current = 'RIGHT';
    foodRef.current = randomFood(INITIAL);
    scoreRef.current = 0;
    setScore(0);
    syncPhase('playing');
    draw();
    intervalRef.current = setInterval(tick, SPEED_START);
    kidsSfx.tap();
  }, [draw, tick]);

  useEffect(() => () => stopLoop(), []);

  useEffect(() => {
    if (phase === 'idle') draw();
  }, [phase, draw, canvasSize]);

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
        if (phaseRef.current === 'playing') {
          stopLoop();
          syncPhase('paused');
        } else if (phaseRef.current === 'paused') {
          syncPhase('playing');
          const speed = Math.max(SPEED_MIN, SPEED_START - scoreRef.current * 6);
          intervalRef.current = setInterval(tick, speed);
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleDir, tick]);

  const onDPad = (d: DPadDir) => handleDir(toGameDir(d));

  return (
    <KidsGameShell
      title="Cobra Musical"
      subtitle="A cobra da rádio cresce a cada nota do Cantinho."
      hud={
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <span className="px-4 py-2 rounded-full bg-yellow-100 border-2 border-yellow-300 font-extrabold text-yellow-800">
            Notas: {score}
          </span>
          <span className="px-4 py-2 rounded-full bg-pink-100 border-2 border-pink-300 font-extrabold text-pink-700">
            Recorde: {highScore}
          </span>
          {phase === 'playing' && (
            <button
              type="button"
              onClick={() => {
                stopLoop();
                syncPhase('paused');
              }}
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
            Setas, WASD, desliza no ecrã ou usa os botões. Não bates nas paredes!
          </p>
        </div>
      }
    >
      <div
        ref={containerRef}
        className="relative mx-auto rounded-[1.5rem] border-4 border-white shadow-[0_12px_0_rgba(190,24,93,0.2)] overflow-hidden bg-sky-50"
        style={{ width: '100%', maxWidth: 520 }}
      >
        <canvas
          ref={canvasRef}
          width={canvasSize}
          height={canvasSize}
          className="block w-full h-auto touch-none"
          style={{ overscrollBehavior: 'contain' }}
          {...swipe}
        />
        {phase === 'idle' && (
          <GameOverlay
            variant="start"
            title="Cobra Musical"
            message="A cobra do Cantinho adora as notas da rádio."
            howTo={[
              'Apanha as notas rosa para crescer.',
              'Não toques nas paredes nem em ti.',
              'Quanto mais notas, mais depressa ela dança!',
            ]}
            primaryLabel="Começar"
            onPrimary={startGame}
          />
        )}
        {phase === 'paused' && (
          <GameOverlay
            variant="pause"
            title="Pausa"
            message="A cobra ficou quietinha."
            primaryLabel="Continuar"
            onPrimary={() => {
              syncPhase('playing');
              const speed = Math.max(SPEED_MIN, SPEED_START - scoreRef.current * 6);
              intervalRef.current = setInterval(tick, speed);
            }}
            secondaryLabel="Recomeçar"
            onSecondary={startGame}
          />
        )}
        {phase === 'gameover' && (
          <GameOverlay
            variant="lose"
            title="A cobra bateu!"
            message="A música parou por um instante."
            scoreLabel={`${scoreRef.current} ${scoreRef.current === 1 ? 'nota' : 'notas'}`}
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
