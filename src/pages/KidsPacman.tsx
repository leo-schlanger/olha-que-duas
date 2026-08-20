import { useCallback, useEffect, useRef, useState } from 'react';
import { Pause } from 'lucide-react';
import { useMetaTags, getPageBreadcrumbJsonLd } from '@/hooks/useMetaTags';
import KidsGameShell from '@/components/kids/games/KidsGameShell';
import GameDPad from '@/components/kids/games/GameDPad';
import GameOverlay from '@/components/kids/games/GameOverlay';
import MoreGames from '@/components/kids/games/MoreGames';
import { kidsSfx } from '@/components/kids/games/gameSounds';
import { useSwipe, type Cardinal } from '@/components/kids/games/useSwipe';

type Direction = Cardinal;
type Phase = 'start' | 'playing' | 'paused' | 'won' | 'lost' | 'hit';

interface Entity {
  x: number;
  y: number;
  fx: number;
  fy: number;
  dir: Direction;
  moving: boolean;
  remain: number;
}

interface Cloud extends Entity {
  color: string;
}

const MAZE: number[][] = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,0,1,0,0,0,0,0,0,1],
  [1,0,1,1,0,1,0,1,0,1,0,1,1,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,1,0,1,1,0,1,0,1,1,0,1,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,1,1,0,1,0,1,1,1,0,1,0,1,1,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,1,1,0,1,0,1,1,1,0,1,0,1,1,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,1,0,1,1,0,1,0,1,1,0,1,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,1,1,0,1,0,1,0,1,0,1,1,0,1],
  [1,0,0,0,0,0,0,1,0,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];

const COLS = MAZE[0].length;
const ROWS = MAZE.length;
const PLAYER_START = { x: 1, y: 1 };
const CLOUD_STARTS: { x: number; y: number; dir: Direction; color: string }[] = [
  { x: 13, y: 1, dir: 'left', color: '#94a3b8' },
  { x: 1, y: 13, dir: 'right', color: '#64748b' },
  { x: 13, y: 13, dir: 'up', color: '#7c8aa0' },
];
const TOTAL_LIVES = 3;
const PLAYER_MS = 160;
const CLOUD_MS = 240;

function buildNotes(): Set<string> {
  const notes = new Set<string>();
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (MAZE[r][c] !== 0) continue;
      const isStart =
        (c === PLAYER_START.x && r === PLAYER_START.y) ||
        CLOUD_STARTS.some((cl) => cl.x === c && cl.y === r);
      if (!isStart) notes.add(`${c},${r}`);
    }
  }
  return notes;
}

function canMove(x: number, y: number) {
  return x >= 0 && x < COLS && y >= 0 && y < ROWS && MAZE[y][x] === 0;
}

function step(x: number, y: number, dir: Direction) {
  if (dir === 'up') return { x, y: y - 1 };
  if (dir === 'down') return { x, y: y + 1 };
  if (dir === 'left') return { x: x - 1, y };
  return { x: x + 1, y };
}

function opposite(d: Direction): Direction {
  if (d === 'up') return 'down';
  if (d === 'down') return 'up';
  if (d === 'left') return 'right';
  return 'left';
}

function makePlayer(): Entity {
  return {
    x: PLAYER_START.x,
    y: PLAYER_START.y,
    fx: PLAYER_START.x,
    fy: PLAYER_START.y,
    dir: 'right',
    moving: false,
    remain: 0,
  };
}

function makeClouds(): Cloud[] {
  return CLOUD_STARTS.map((c) => ({
    x: c.x,
    y: c.y,
    fx: c.x,
    fy: c.y,
    dir: c.dir,
    moving: false,
    remain: 0,
    color: c.color,
  }));
}

function drawMic(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number,
  dir: Direction,
  t: number,
) {
  const bounce = Math.sin(t * 8) * size * 0.04;
  ctx.save();
  ctx.translate(cx, cy + bounce);
  const rot = dir === 'right' ? 0 : dir === 'left' ? Math.PI : dir === 'down' ? Math.PI / 2 : -Math.PI / 2;
  ctx.rotate(rot * 0.08);

  ctx.fillStyle = '#facc15';
  ctx.beginPath();
  ctx.roundRect(-size * 0.32, -size * 0.28, size * 0.64, size * 0.78, size * 0.28);
  ctx.fill();

  ctx.fillStyle = '#2563eb';
  ctx.beginPath();
  ctx.roundRect(-size * 0.36, -size * 0.52, size * 0.72, size * 0.28, size * 0.1);
  ctx.fill();
  ctx.fillStyle = '#1d4ed8';
  ctx.beginPath();
  ctx.roundRect(-size * 0.42, -size * 0.58, size * 0.84, size * 0.12, size * 0.06);
  ctx.fill();

  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.arc(-size * 0.12, -size * 0.02, size * 0.07, 0, Math.PI * 2);
  ctx.arc(size * 0.12, -size * 0.02, size * 0.07, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(-size * 0.1, -size * 0.04, size * 0.025, 0, Math.PI * 2);
  ctx.arc(size * 0.14, -size * 0.04, size * 0.025, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#ec4899';
  ctx.lineWidth = size * 0.06;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(0, size * 0.14, size * 0.14, 0.15, Math.PI - 0.15);
  ctx.stroke();

  ctx.fillStyle = '#f59e0b';
  ctx.beginPath();
  ctx.arc(0, size * 0.42, size * 0.1, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawSleepyCloud(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number,
  color: string,
  t: number,
) {
  const bob = Math.sin(t * 3) * size * 0.05;
  ctx.save();
  ctx.translate(cx, cy + bob);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(-size * 0.22, size * 0.06, size * 0.28, 0, Math.PI * 2);
  ctx.arc(size * 0.22, size * 0.08, size * 0.26, 0, Math.PI * 2);
  ctx.arc(0, -size * 0.1, size * 0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = size * 0.05;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(-size * 0.14, -size * 0.02, size * 0.08, Math.PI, 0);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(size * 0.14, -size * 0.02, size * 0.08, Math.PI, 0);
  ctx.stroke();
  ctx.fillStyle = '#64748b';
  ctx.font = `bold ${Math.max(10, size * 0.28)}px "Baloo 2", sans-serif`;
  ctx.fillText('z', size * 0.28, -size * 0.28);
  ctx.restore();
}

function drawNote(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number) {
  ctx.fillStyle = '#ec4899';
  ctx.beginPath();
  ctx.ellipse(cx - size * 0.08, cy + size * 0.12, size * 0.16, size * 0.12, -0.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#ec4899';
  ctx.lineWidth = size * 0.08;
  ctx.beginPath();
  ctx.moveTo(cx + size * 0.05, cy + size * 0.1);
  ctx.lineTo(cx + size * 0.05, cy - size * 0.28);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx + size * 0.05, cy - size * 0.28);
  ctx.quadraticCurveTo(cx + size * 0.32, cy - size * 0.12, cx + size * 0.05, cy - size * 0.02);
  ctx.fill();
}

const jsonLd = [
  getPageBreadcrumbJsonLd('Micro no Cantinho', 'https://www.olhaqueduas.com/kids/jogos/pacman', [
    { name: 'Kids', url: 'https://www.olhaqueduas.com/kids' },
    { name: 'Jogos', url: 'https://www.olhaqueduas.com/kids/jogos' },
  ]),
  {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Micro no Cantinho — Olha que Duas Kids',
    url: 'https://www.olhaqueduas.com/kids/jogos/pacman',
    applicationCategory: 'GameApplication',
    operatingSystem: 'Web',
    inLanguage: 'pt-PT',
    description:
      'Ajuda o Micro, mascote da rádio Olha que Duas Kids, a apanhar notas musicais no Cantinho e a fugir das nuvens do Silêncio.',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
  },
];

const KidsPacman = () => {
  useMetaTags({
    title: 'Micro no Cantinho — Aventura musical da rádio Kids',
    description:
      'Ajuda o Micro, o mascote do Olha que Duas Kids, a recolher as notas do Cantinho e a fugir do Silêncio. Jogo grátis e seguro.',
    image: 'https://www.olhaqueduas.com/og-kids.jpg',
    imageAlt: 'Micro no Cantinho — Olha que Duas Kids',
    url: 'https://www.olhaqueduas.com/kids/jogos/pacman',
    tags: ['olha que duas kids', 'jogo rádio', 'cantinho da pequenada', 'jogo musical infantil'],
    jsonLd,
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const playerRef = useRef<Entity>(makePlayer());
  const cloudsRef = useRef<Cloud[]>(makeClouds());
  const notesRef = useRef<Set<string>>(buildNotes());
  const nextDirRef = useRef<Direction>('right');
  const scoreRef = useRef(0);
  const livesRef = useRef(TOTAL_LIVES);
  const phaseRef = useRef<Phase>('start');
  const hitTimerRef = useRef(0);
  const lastTsRef = useRef(0);
  const timeRef = useRef(0);
  const animRef = useRef(0);

  const [uiScore, setUiScore] = useState(0);
  const [uiLives, setUiLives] = useState(TOTAL_LIVES);
  const [uiPhase, setUiPhase] = useState<Phase>('start');

  const setPhase = (p: Phase) => {
    phaseRef.current = p;
    setUiPhase(p);
  };

  const resetGame = useCallback(() => {
    playerRef.current = makePlayer();
    cloudsRef.current = makeClouds();
    notesRef.current = buildNotes();
    nextDirRef.current = 'right';
    scoreRef.current = 0;
    livesRef.current = TOTAL_LIVES;
    hitTimerRef.current = 0;
    setUiScore(0);
    setUiLives(TOTAL_LIVES);
    setPhase('playing');
    kidsSfx.tap();
  }, []);

  const setDirection = useCallback((dir: Direction) => {
    nextDirRef.current = dir;
  }, []);

  const swipe = useSwipe(setDirection);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const map: Record<string, Direction> = {
        ArrowUp: 'up',
        w: 'up',
        W: 'up',
        ArrowDown: 'down',
        s: 'down',
        S: 'down',
        ArrowLeft: 'left',
        a: 'left',
        A: 'left',
        ArrowRight: 'right',
        d: 'right',
        D: 'right',
      };
      if (map[e.key]) {
        e.preventDefault();
        setDirection(map[e.key]);
      }
      if (e.key === ' ' || e.key === 'Escape') {
        e.preventDefault();
        if (phaseRef.current === 'playing') setPhase('paused');
        else if (phaseRef.current === 'paused') setPhase('playing');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [setDirection]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const tryStartMove = (ent: Entity, preferred: Direction, duration: number) => {
      const first = step(ent.x, ent.y, preferred);
      if (canMove(first.x, first.y)) {
        ent.dir = preferred;
        ent.moving = true;
        ent.remain = duration;
        return;
      }
      const second = step(ent.x, ent.y, ent.dir);
      if (canMove(second.x, second.y)) {
        ent.moving = true;
        ent.remain = duration;
      }
    };

    const advance = (ent: Entity, dt: number, duration: number) => {
      if (!ent.moving) return;
      ent.remain -= dt;
      const dest = step(ent.x, ent.y, ent.dir);
      const t = 1 - Math.max(0, ent.remain) / duration;
      ent.fx = ent.x + (dest.x - ent.x) * t;
      ent.fy = ent.y + (dest.y - ent.y) * t;
      if (ent.remain <= 0) {
        ent.x = dest.x;
        ent.y = dest.y;
        ent.fx = dest.x;
        ent.fy = dest.y;
        ent.moving = false;
        ent.remain = 0;
      }
    };

    const tick = (ts: number) => {
      const dt = lastTsRef.current ? Math.min(50, ts - lastTsRef.current) : 16;
      lastTsRef.current = ts;
      timeRef.current += dt / 1000;
      const t = timeRef.current;

      const dpr = window.devicePixelRatio || 1;
      const cssSize = Math.min(520, canvas.parentElement?.clientWidth ?? 520);
      if (canvas.width !== cssSize * dpr || canvas.height !== cssSize * dpr) {
        canvas.width = cssSize * dpr;
        canvas.height = cssSize * dpr;
        canvas.style.width = `${cssSize}px`;
        canvas.style.height = `${cssSize}px`;
      }
      const cell = (cssSize * dpr) / COLS;

      const gs = phaseRef.current;
      if (gs === 'playing') {
        const player = playerRef.current;
        if (!player.moving) tryStartMove(player, nextDirRef.current, PLAYER_MS);
        advance(player, dt, PLAYER_MS);

        if (!player.moving) {
          const key = `${player.x},${player.y}`;
          if (notesRef.current.has(key)) {
            notesRef.current.delete(key);
            scoreRef.current += 10;
            setUiScore(scoreRef.current);
            kidsSfx.collect();
            if (notesRef.current.size === 0) {
              kidsSfx.win();
              setPhase('won');
            }
          }
        }

        for (const cloud of cloudsRef.current) {
          if (!cloud.moving) {
            const dirs = (['up', 'down', 'left', 'right'] as Direction[]).filter(
              (d) => d !== opposite(cloud.dir) && canMove(step(cloud.x, cloud.y, d).x, step(cloud.x, cloud.y, d).y),
            );
            const pick = dirs.length ? dirs[Math.floor(Math.random() * dirs.length)] : opposite(cloud.dir);
            tryStartMove(cloud, pick, CLOUD_MS);
          }
          advance(cloud, dt, CLOUD_MS);
        }

        for (const cloud of cloudsRef.current) {
          if (Math.abs(cloud.fx - player.fx) < 0.45 && Math.abs(cloud.fy - player.fy) < 0.45) {
            livesRef.current -= 1;
            setUiLives(livesRef.current);
            kidsSfx.hit();
            if (livesRef.current <= 0) {
              kidsSfx.lose();
              setPhase('lost');
            } else {
              setPhase('hit');
              hitTimerRef.current = 900;
            }
            break;
          }
        }
      } else if (gs === 'hit') {
        hitTimerRef.current -= dt;
        if (hitTimerRef.current <= 0) {
          playerRef.current = makePlayer();
          cloudsRef.current = makeClouds();
          nextDirRef.current = 'right';
          setPhase('playing');
        }
      }

      ctx.fillStyle = '#e0f2fe';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          if (MAZE[r][c] !== 1) continue;
          const x = c * cell;
          const y = r * cell;
          ctx.fillStyle = '#e11d48';
          ctx.beginPath();
          ctx.roundRect(x + cell * 0.06, y + cell * 0.06, cell * 0.88, cell * 0.88, cell * 0.18);
          ctx.fill();
          ctx.fillStyle = '#fb7185';
          ctx.beginPath();
          ctx.roundRect(x + cell * 0.16, y + cell * 0.16, cell * 0.68, cell * 0.4, cell * 0.12);
          ctx.fill();
          ctx.fillStyle = '#fff7ed';
          ctx.beginPath();
          ctx.arc(x + cell * 0.5, y + cell * 0.55, cell * 0.12, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      for (const key of notesRef.current) {
        const [cx, cy] = key.split(',').map(Number);
        drawNote(ctx, cx * cell + cell / 2, cy * cell + cell / 2, cell * 0.42);
      }

      for (const cloud of cloudsRef.current) {
        drawSleepyCloud(ctx, cloud.fx * cell + cell / 2, cloud.fy * cell + cell / 2, cell * 0.85, cloud.color, t);
      }

      const player = playerRef.current;
      drawMic(ctx, player.fx * cell + cell / 2, player.fy * cell + cell / 2, cell * 0.9, player.dir, t);

      if (gs === 'hit') {
        ctx.fillStyle = 'rgba(15,23,42,0.35)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'center';
        ctx.font = `800 ${cell * 0.7}px "Baloo 2", sans-serif`;
        ctx.fillText('O Silêncio apanhou-te!', canvas.width / 2, canvas.height / 2);
        ctx.font = `700 ${cell * 0.45}px "Baloo 2", sans-serif`;
        ctx.fillText('A voltar ao estúdio…', canvas.width / 2, canvas.height / 2 + cell);
      }

      animRef.current = requestAnimationFrame(tick);
    };

    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  const overlay =
    uiPhase === 'start' || uiPhase === 'won' || uiPhase === 'lost' || uiPhase === 'paused'
      ? uiPhase
      : null;

  return (
    <KidsGameShell
      title="Micro no Cantinho"
      subtitle="Apanha as notas da rádio. Foge das nuvens do Silêncio!"
      hud={
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <span className="px-4 py-2 rounded-full bg-yellow-100 border-2 border-yellow-300 font-extrabold text-yellow-800">
            Notas: {uiScore}
          </span>
          <span className="px-4 py-2 rounded-full bg-pink-100 border-2 border-pink-300 font-extrabold text-pink-700">
            Vidas: {Array.from({ length: uiLives }).map((_, i) => (
              <span key={i} className="inline-block w-3 h-3 ml-1 rounded-full bg-pink-500 align-middle" />
            ))}
          </span>
          {uiPhase === 'playing' && (
            <button
              type="button"
              onClick={() => setPhase('paused')}
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
          <GameDPad onDir={setDirection} />
          <p className="text-center text-sm font-bold text-sky-950/70 max-w-md mx-auto">
            Setas, WASD, desliza no ecrã ou usa os botões. Espaço para pausar.
          </p>
        </div>
      }
    >
      <div className="relative mx-auto" style={{ maxWidth: 520 }}>
        <canvas
          ref={canvasRef}
          className="w-full rounded-[1.5rem] border-4 border-white shadow-[0_12px_0_rgba(190,24,93,0.2)] bg-sky-100 touch-none"
          style={{ aspectRatio: '1 / 1', overscrollBehavior: 'contain' }}
          {...swipe}
        />
        {overlay === 'start' && (
          <GameOverlay
            variant="start"
            title="Micro no Cantinho"
            message="O mascote da rádio precisa de ti!"
            howTo={[
              'Apanha todas as notas rosa.',
              'Foge das nuvens do Silêncio.',
              'Tens 3 vidas — como 3 músicas extra.',
            ]}
            primaryLabel="Começar"
            onPrimary={resetGame}
          />
        )}
        {overlay === 'paused' && (
          <GameOverlay
            variant="pause"
            title="Pausa"
            message="O Micro está a descansar a voz."
            primaryLabel="Continuar"
            onPrimary={() => setPhase('playing')}
            secondaryLabel="Recomeçar"
            onSecondary={resetGame}
          />
        )}
        {overlay === 'won' && (
          <GameOverlay
            variant="win"
            title="Parabéns!"
            message="O Cantinho está cheio de música outra vez!"
            scoreLabel={`${uiScore} notas`}
            primaryLabel="Jogar outra vez"
            onPrimary={resetGame}
          />
        )}
        {overlay === 'lost' && (
          <GameOverlay
            variant="lose"
            title="Oh não!"
            message="O Silêncio ganhou desta vez. Tenta outra vez!"
            scoreLabel={`${uiScore} notas`}
            primaryLabel="Jogar outra vez"
            onPrimary={resetGame}
          />
        )}
      </div>
      <div className="max-w-2xl mx-auto">
        <MoreGames />
      </div>
    </KidsGameShell>
  );
};

export default KidsPacman;
