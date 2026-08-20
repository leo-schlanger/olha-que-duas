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

interface Jelly extends Entity {
  color: string;
  eaten: number;
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
const JELLY_STARTS: { x: number; y: number; dir: Direction; color: string }[] = [
  { x: 13, y: 1, dir: 'left', color: '#f472b6' },
  { x: 1, y: 13, dir: 'right', color: '#a78bfa' },
  { x: 13, y: 13, dir: 'up', color: '#2dd4bf' },
];
const POWER = new Set(['1,3', '13,3', '1,11', '13,11']);
const TOTAL_LIVES = 3;
const PLAYER_MS = 150;
const JELLY_MS = 230;
const POWER_MS = 5200;

function buildBubbles(): Set<string> {
  const notes = new Set<string>();
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (MAZE[r][c] !== 0) continue;
      const isStart =
        (c === PLAYER_START.x && r === PLAYER_START.y) ||
        JELLY_STARTS.some((j) => j.x === c && j.y === r);
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

function dirAngle(dir: Direction) {
  if (dir === 'right') return 0;
  if (dir === 'down') return Math.PI / 2;
  if (dir === 'left') return Math.PI;
  return -Math.PI / 2;
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

function makeJellies(): Jelly[] {
  return JELLY_STARTS.map((j) => ({
    x: j.x,
    y: j.y,
    fx: j.x,
    fy: j.y,
    dir: j.dir,
    moving: false,
    remain: 0,
    color: j.color,
    eaten: 0,
  }));
}

function drawOcean(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
  const bg = ctx.createLinearGradient(0, 0, 0, h);
  bg.addColorStop(0, '#7dd3fc');
  bg.addColorStop(0.45, '#38bdf8');
  bg.addColorStop(1, '#0284c7');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  ctx.save();
  ctx.globalAlpha = 0.12;
  ctx.strokeStyle = '#e0f2fe';
  ctx.lineWidth = Math.max(2, w * 0.008);
  for (let i = 0; i < 6; i++) {
    ctx.beginPath();
    const y = ((t * 18 + i * 70) % (h + 40)) - 20;
    ctx.moveTo(0, y);
    for (let x = 0; x <= w; x += 16) {
      ctx.lineTo(x, y + Math.sin(x * 0.02 + t + i) * 10);
    }
    ctx.stroke();
  }
  ctx.restore();

  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  for (let i = 0; i < 18; i++) {
    const bx = ((i * 97) % w);
    const by = (h - ((t * 28 + i * 53) % (h + 30)));
    const r = 2 + (i % 4);
    ctx.beginPath();
    ctx.arc(bx, by, r, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawCoralWall(ctx: CanvasRenderingContext2D, x: number, y: number, cell: number, c: number, r: number) {
  const inset = cell * 0.05;
  const hue = (c * 17 + r * 11) % 40;
  ctx.fillStyle = hue < 20 ? '#fb7185' : '#f472b6';
  ctx.beginPath();
  ctx.roundRect(x + inset, y + inset, cell - inset * 2, cell - inset * 2, cell * 0.28);
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.28)';
  ctx.beginPath();
  ctx.roundRect(x + cell * 0.18, y + cell * 0.14, cell * 0.55, cell * 0.28, cell * 0.16);
  ctx.fill();
  ctx.fillStyle = '#fda4af';
  ctx.beginPath();
  ctx.arc(x + cell * 0.32, y + cell * 0.62, cell * 0.1, 0, Math.PI * 2);
  ctx.arc(x + cell * 0.62, y + cell * 0.7, cell * 0.08, 0, Math.PI * 2);
  ctx.fill();
}

function drawBubble(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number,
  t: number,
  power: boolean,
) {
  const pulse = 1 + Math.sin(t * 5 + cx) * 0.08;
  const r = size * (power ? 0.34 : 0.16) * pulse;
  ctx.save();
  ctx.globalAlpha = 0.95;
  ctx.fillStyle = power ? '#fde047' : 'rgba(255,255,255,0.85)';
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = power ? '#f59e0b' : '#38bdf8';
  ctx.lineWidth = Math.max(1.2, size * 0.05);
  ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  ctx.beginPath();
  ctx.arc(cx - r * 0.3, cy - r * 0.3, r * 0.28, 0, Math.PI * 2);
  ctx.fill();
  if (power) {
    ctx.fillStyle = '#ec4899';
    ctx.beginPath();
    ctx.ellipse(cx - r * 0.15, cy + r * 0.2, r * 0.28, r * 0.18, -0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ec4899';
    ctx.lineWidth = r * 0.16;
    ctx.beginPath();
    ctx.moveTo(cx + r * 0.08, cy + r * 0.15);
    ctx.lineTo(cx + r * 0.08, cy - r * 0.45);
    ctx.stroke();
  }
  ctx.restore();
}

function drawBabyShark(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number,
  dir: Direction,
  t: number,
) {
  const mouth = (Math.abs(Math.sin(t * 10)) * 0.55) + 0.08;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(dirAngle(dir));

  ctx.fillStyle = '#f59e0b';
  ctx.beginPath();
  ctx.moveTo(-size * 0.38, 0);
  ctx.lineTo(-size * 0.72, -size * 0.3);
  ctx.quadraticCurveTo(-size * 0.52, 0, -size * 0.72, size * 0.3);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#fbbf24';
  ctx.beginPath();
  ctx.moveTo(-size * 0.02, -size * 0.18);
  ctx.lineTo(size * 0.1, -size * 0.62);
  ctx.lineTo(size * 0.28, -size * 0.16);
  ctx.closePath();
  ctx.fill();

  const flap = Math.sin(t * 9) * size * 0.07;
  ctx.fillStyle = '#f59e0b';
  ctx.beginPath();
  ctx.ellipse(-size * 0.02, size * 0.28 + flap, size * 0.24, size * 0.11, 0.35, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#facc15';
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.arc(0, 0, size * 0.44, mouth, Math.PI * 2 - mouth);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = 'rgba(180,83,9,0.25)';
  ctx.lineWidth = size * 0.03;
  ctx.stroke();

  ctx.fillStyle = '#fffbeb';
  ctx.beginPath();
  ctx.ellipse(size * 0.04, size * 0.14, size * 0.22, size * 0.15, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#fda4af';
  ctx.beginPath();
  ctx.arc(size * 0.08, size * 0.02, size * 0.07, 0, Math.PI * 2);
  ctx.fill();

  const eyeX = size * 0.16;
  const eyeY = -size * 0.1;
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(eyeX, eyeY, size * 0.11, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.arc(eyeX + size * 0.03, eyeY, size * 0.055, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(eyeX + size * 0.05, eyeY - size * 0.03, size * 0.022, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawJelly(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number,
  color: string,
  t: number,
  frightened: boolean,
) {
  const bob = Math.sin(t * 4 + cx) * size * 0.07;
  ctx.save();
  ctx.translate(cx, cy + bob);
  const body = frightened ? '#93c5fd' : color;

  ctx.strokeStyle = frightened ? '#60a5fa' : body;
  ctx.lineWidth = size * 0.06;
  ctx.lineCap = 'round';
  for (let i = 0; i < 4; i++) {
    const sx = -size * 0.22 + i * size * 0.15;
    ctx.beginPath();
    ctx.moveTo(sx, size * 0.08);
    ctx.quadraticCurveTo(sx + Math.sin(t * 6 + i) * size * 0.1, size * 0.28, sx, size * 0.42);
    ctx.stroke();
  }

  ctx.fillStyle = body;
  ctx.beginPath();
  ctx.ellipse(0, 0, size * 0.34, size * 0.28, 0, Math.PI, 0);
  ctx.ellipse(0, 0.02 * size, size * 0.34, size * 0.12, 0, 0, Math.PI);
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  ctx.beginPath();
  ctx.ellipse(-size * 0.08, -size * 0.1, size * 0.14, size * 0.08, -0.3, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(-size * 0.1, -size * 0.02, size * 0.08, 0, Math.PI * 2);
  ctx.arc(size * 0.1, -size * 0.02, size * 0.08, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = frightened ? '#1d4ed8' : '#1e293b';
  ctx.beginPath();
  ctx.arc(-size * 0.08, 0, size * 0.04, 0, Math.PI * 2);
  ctx.arc(size * 0.12, 0, size * 0.04, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = frightened ? '#1d4ed8' : '#be185d';
  ctx.lineWidth = size * 0.04;
  ctx.beginPath();
  if (frightened) {
    ctx.arc(0, size * 0.1, size * 0.08, Math.PI, 0);
  } else {
    ctx.arc(0, size * 0.04, size * 0.08, 0.2, Math.PI - 0.2);
  }
  ctx.stroke();
  ctx.restore();
}

const jsonLd = [
  getPageBreadcrumbJsonLd('Baby Shark', 'https://www.olhaqueduas.com/kids/jogos/pacman', [
    { name: 'Kids', url: 'https://www.olhaqueduas.com/kids' },
    { name: 'Jogos', url: 'https://www.olhaqueduas.com/kids/jogos' },
  ]),
  {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Baby Shark — Jogo arcade infantil',
    url: 'https://www.olhaqueduas.com/kids/jogos/pacman',
    applicationCategory: 'GameApplication',
    operatingSystem: 'Web',
    inLanguage: 'pt-PT',
    description:
      'Ajuda o Baby Shark a apanhar bolhas musicais no oceano e a fugir das águas-vivas. Jogo estilo Pacman para o espaço Kids do Olha que Duas.',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
  },
];

const KidsPacman = () => {
  useMetaTags({
    title: 'Baby Shark — Jogo arcade infantil no Olha que Duas Kids',
    description:
      'Nada com o Baby Shark, apanha bolhas musicais e foge das águas-vivas. Jogo estilo Pacman, gratuito e seguro no espaço Kids.',
    image: 'https://www.olhaqueduas.com/og-kids.jpg',
    imageAlt: 'Baby Shark — Olha que Duas Kids',
    url: 'https://www.olhaqueduas.com/kids/jogos/pacman',
    tags: ['baby shark jogo', 'pacman infantil', 'olha que duas kids', 'jogo oceano crianças'],
    jsonLd,
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const playerRef = useRef<Entity>(makePlayer());
  const jelliesRef = useRef<Jelly[]>(makeJellies());
  const bubblesRef = useRef<Set<string>>(buildBubbles());
  const nextDirRef = useRef<Direction>('right');
  const scoreRef = useRef(0);
  const livesRef = useRef(TOTAL_LIVES);
  const phaseRef = useRef<Phase>('start');
  const hitTimerRef = useRef(0);
  const powerRef = useRef(0);
  const lastTsRef = useRef(0);
  const timeRef = useRef(0);
  const animRef = useRef(0);

  const [uiScore, setUiScore] = useState(0);
  const [uiLives, setUiLives] = useState(TOTAL_LIVES);
  const [uiPhase, setUiPhase] = useState<Phase>('start');
  const [uiPower, setUiPower] = useState(false);

  const setPhase = (p: Phase) => {
    phaseRef.current = p;
    setUiPhase(p);
  };

  const resetGame = useCallback(() => {
    playerRef.current = makePlayer();
    jelliesRef.current = makeJellies();
    bubblesRef.current = buildBubbles();
    nextDirRef.current = 'right';
    scoreRef.current = 0;
    livesRef.current = TOTAL_LIVES;
    hitTimerRef.current = 0;
    powerRef.current = 0;
    setUiScore(0);
    setUiLives(TOTAL_LIVES);
    setUiPower(false);
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
      const p = 1 - Math.max(0, ent.remain) / duration;
      ent.fx = ent.x + (dest.x - ent.x) * p;
      ent.fy = ent.y + (dest.y - ent.y) * p;
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
      if (powerRef.current > 0) {
        powerRef.current -= dt;
        if (powerRef.current <= 0) {
          powerRef.current = 0;
          setUiPower(false);
        }
      }
      const frightened = powerRef.current > 0;

      if (gs === 'playing') {
        const player = playerRef.current;
        if (!player.moving) tryStartMove(player, nextDirRef.current, PLAYER_MS);
        advance(player, dt, PLAYER_MS);

        if (!player.moving) {
          const key = `${player.x},${player.y}`;
          if (bubblesRef.current.has(key)) {
            bubblesRef.current.delete(key);
            const isPower = POWER.has(key);
            scoreRef.current += isPower ? 40 : 10;
            setUiScore(scoreRef.current);
            kidsSfx.collect();
            if (isPower) {
              powerRef.current = POWER_MS;
              setUiPower(true);
              kidsSfx.correct();
              for (const jelly of jelliesRef.current) {
                jelly.dir = opposite(jelly.dir);
              }
            }
            if (bubblesRef.current.size === 0) {
              kidsSfx.win();
              setPhase('won');
            }
          }
        }

        for (const jelly of jelliesRef.current) {
          if (jelly.eaten > 0) {
            jelly.eaten -= dt;
            continue;
          }
          if (!jelly.moving) {
            const options = (['up', 'down', 'left', 'right'] as Direction[]).filter(
              (d) => d !== opposite(jelly.dir) && canMove(step(jelly.x, jelly.y, d).x, step(jelly.x, jelly.y, d).y),
            );
            let pick: Direction;
            if (options.length === 0) {
              pick = opposite(jelly.dir);
            } else if (frightened) {
              pick = options.reduce((best, d) => {
                const a = step(jelly.x, jelly.y, d);
                const b = step(jelly.x, jelly.y, best);
                const da = Math.abs(a.x - player.x) + Math.abs(a.y - player.y);
                const db = Math.abs(b.x - player.x) + Math.abs(b.y - player.y);
                return da > db ? d : best;
              }, options[0]);
            } else {
              pick = options[Math.floor(Math.random() * options.length)];
            }
            tryStartMove(jelly, pick, frightened ? JELLY_MS + 80 : JELLY_MS);
          }
          advance(jelly, dt, frightened ? JELLY_MS + 80 : JELLY_MS);
        }

        for (const jelly of jelliesRef.current) {
          if (jelly.eaten > 0) continue;
          if (Math.abs(jelly.fx - player.fx) < 0.42 && Math.abs(jelly.fy - player.fy) < 0.42) {
            if (frightened) {
              jelly.eaten = 2200;
              jelly.x = JELLY_STARTS[0].x;
              jelly.y = JELLY_STARTS[0].y;
              jelly.fx = jelly.x;
              jelly.fy = jelly.y;
              jelly.moving = false;
              scoreRef.current += 80;
              setUiScore(scoreRef.current);
              kidsSfx.match();
            } else {
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
        }
      } else if (gs === 'hit') {
        hitTimerRef.current -= dt;
        if (hitTimerRef.current <= 0) {
          playerRef.current = makePlayer();
          jelliesRef.current = makeJellies();
          nextDirRef.current = 'right';
          powerRef.current = 0;
          setUiPower(false);
          setPhase('playing');
        }
      }

      drawOcean(ctx, canvas.width, canvas.height, t);

      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          if (MAZE[r][c] === 1) drawCoralWall(ctx, c * cell, r * cell, cell, c, r);
        }
      }

      for (const key of bubblesRef.current) {
        const [cx, cy] = key.split(',').map(Number);
        drawBubble(ctx, cx * cell + cell / 2, cy * cell + cell / 2, cell, t, POWER.has(key));
      }

      for (const jelly of jelliesRef.current) {
        if (jelly.eaten > 0) continue;
        drawJelly(
          ctx,
          jelly.fx * cell + cell / 2,
          jelly.fy * cell + cell / 2,
          cell * 0.95,
          jelly.color,
          t,
          frightened,
        );
      }

      const player = playerRef.current;
      drawBabyShark(ctx, player.fx * cell + cell / 2, player.fy * cell + cell / 2, cell * 0.95, player.dir, t);

      if (gs === 'hit') {
        ctx.fillStyle = 'rgba(8,47,73,0.4)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = `800 ${cell * 0.62}px "Baloo 2", sans-serif`;
        ctx.fillText('A água-viva apanhou-te!', canvas.width / 2, canvas.height / 2);
        ctx.font = `700 ${cell * 0.42}px "Baloo 2", sans-serif`;
        ctx.fillText('A voltar ao oceano…', canvas.width / 2, canvas.height / 2 + cell);
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
      title="Baby Shark"
      subtitle="Doo doo doo doo — apanha as bolhas e foge das águas-vivas!"
      hud={
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <span className="px-4 py-2 rounded-full bg-yellow-100 border-2 border-yellow-300 font-extrabold text-yellow-800">
            Bolhas: {uiScore}
          </span>
          <span className="px-4 py-2 rounded-full bg-sky-100 border-2 border-sky-300 font-extrabold text-sky-800 inline-flex items-center gap-1">
            Vidas
            {Array.from({ length: uiLives }).map((_, i) => (
              <span
                key={i}
                className="inline-block w-3.5 h-3.5 rounded-full bg-yellow-400 border-2 border-amber-500"
                aria-hidden
              />
            ))}
          </span>
          {uiPower && (
            <span className="px-4 py-2 rounded-full bg-amber-200 border-2 border-amber-400 font-extrabold text-amber-800 motion-safe:animate-pulse">
              Super Shark!
            </span>
          )}
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
            Setas, WASD ou desliza no ecrã. As bolhas douradas dão super-poder!
          </p>
        </div>
      }
    >
      <div className="relative mx-auto" style={{ maxWidth: 520 }}>
        <canvas
          ref={canvasRef}
          className="w-full rounded-[1.5rem] border-4 border-white shadow-[0_12px_0_rgba(2,132,199,0.35)] bg-sky-300 touch-none"
          style={{ aspectRatio: '1 / 1', overscrollBehavior: 'contain' }}
          {...swipe}
        />
        {overlay === 'start' && (
          <GameOverlay
            variant="start"
            title="Baby Shark"
            message="Doo doo doo doo doo doo!"
            howTo={[
              'Apanha todas as bolhas do oceano.',
              'Foge das águas-vivas… ou come as bolhas douradas e fica Super Shark!',
              'Tens 3 vidas para a família toda.',
            ]}
            primaryLabel="Começar"
            onPrimary={resetGame}
          />
        )}
        {overlay === 'paused' && (
          <GameOverlay
            variant="pause"
            title="Pausa"
            message="O Baby Shark está a apanhar ar."
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
            message="O oceano ficou cheio de música!"
            scoreLabel={`${uiScore} bolhas`}
            primaryLabel="Jogar outra vez"
            onPrimary={resetGame}
          />
        )}
        {overlay === 'lost' && (
          <GameOverlay
            variant="lose"
            title="Oh não!"
            message="As águas-vivas ganharam desta vez. Doo doo… tenta outra vez!"
            scoreLabel={`${uiScore} bolhas`}
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
