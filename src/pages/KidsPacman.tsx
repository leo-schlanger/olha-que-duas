import { useRef, useEffect, useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowDown, ArrowRight, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import { useMetaTags, getPageBreadcrumbJsonLd } from '@/hooks/useMetaTags';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type Direction = 'up' | 'down' | 'left' | 'right';

interface Entity {
  x: number;
  y: number;
}

interface Robot extends Entity {
  dir: Direction;
  color: string;
  eyeColor: string;
}

/* ------------------------------------------------------------------ */
/*  Maze (15x15) — 1 = wall, 0 = path                                 */
/* ------------------------------------------------------------------ */

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

/* Starting positions (grid coords) */
const PLAYER_START: Entity = { x: 1, y: 1 };
const ROBOT_STARTS: Robot[] = [
  { x: 13, y: 1, dir: 'left', color: '#ef4444', eyeColor: '#fca5a5' },
  { x: 1, y: 13, dir: 'right', color: '#3b82f6', eyeColor: '#93c5fd' },
  { x: 13, y: 13, dir: 'up', color: '#22c55e', eyeColor: '#86efac' },
];

const TOTAL_LIVES = 3;

/* ------------------------------------------------------------------ */
/*  Helper: collect initial note positions (all path cells)            */
/* ------------------------------------------------------------------ */

function buildNotes(): Set<string> {
  const notes = new Set<string>();
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (MAZE[r][c] === 0) {
        // Skip player and robot start positions
        const isStart =
          (c === PLAYER_START.x && r === PLAYER_START.y) ||
          ROBOT_STARTS.some((rb) => rb.x === c && rb.y === r);
        if (!isStart) notes.add(`${c},${r}`);
      }
    }
  }
  return notes;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

const pacmanJsonLd = [
  // Breadcrumb
  getPageBreadcrumbJsonLd('Baby Shark Pacman', 'https://www.olhaqueduas.com/kids/jogos/pacman', [
    { name: 'Kids', url: 'https://www.olhaqueduas.com/kids' },
    { name: 'Jogos', url: 'https://www.olhaqueduas.com/kids/jogos' },
  ]),
  // WebApplication (Game)
  {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    '@id': 'https://www.olhaqueduas.com/kids/jogos/pacman#app',
    name: 'Baby Shark Pacman — Jogo Arcade Infantil',
    url: 'https://www.olhaqueduas.com/kids/jogos/pacman',
    applicationCategory: 'GameApplication',
    applicationSubCategory: 'Jogo Arcade',
    operatingSystem: 'Web',
    browserRequirements: 'Requires JavaScript',
    inLanguage: 'pt-PT',
    description:
      'Ajuda o Baby Shark a recolher notas musicais num labirinto e foge dos robôs! Jogo arcade estilo Pacman adaptado para crianças, com 3 vidas e controlo por teclado ou toque.',
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

const KidsPacman = () => {
  useMetaTags({
    title: 'Baby Shark Pacman — Jogo Arcade Infantil Online Grátis',
    description:
      'Ajuda o Baby Shark a recolher notas musicais e fugir dos robôs neste jogo arcade estilo Pacman! Labirinto divertido com 3 vidas, controlo por teclado ou toque — gratuito e seguro no espaço Kids do Olha que Duas para crianças dos 4 aos 12 anos.',
    image: 'https://www.olhaqueduas.com/og-kids.jpg',
    imageAlt: 'Olha que Duas Kids — Baby Shark Pacman jogo arcade infantil online',
    url: 'https://www.olhaqueduas.com/kids/jogos/pacman',
    tags: [
      'baby shark jogo',
      'pacman infantil',
      'jogo arcade crianças',
      'jogos online grátis',
      'jogo labirinto infantil',
      'baby shark pacman',
      'olha que duas kids',
      'jogos seguros crianças',
      'jogo de fuga',
      'arcade kids online',
    ],
    jsonLd: pacmanJsonLd,
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);

  /* Game state kept in refs so the game-loop closure always reads fresh values */
  const playerRef = useRef<Entity>({ ...PLAYER_START });
  const playerDirRef = useRef<Direction>('right');
  const nextDirRef = useRef<Direction>('right');
  const robotsRef = useRef<Robot[]>(ROBOT_STARTS.map((r) => ({ ...r })));
  const notesRef = useRef<Set<string>>(buildNotes());
  const scoreRef = useRef(0);
  const livesRef = useRef(TOTAL_LIVES);
  const mouthOpenRef = useRef(0); // 0-1 animation counter
  const moveTimerRef = useRef(0);
  const robotTimerRef = useRef(0);
  const gameStateRef = useRef<'playing' | 'won' | 'lost' | 'hit'>('playing');
  const hitTimerRef = useRef(0);

  /* React state for overlay UI only — updated from game loop */
  const [uiScore, setUiScore] = useState(0);
  const [uiLives, setUiLives] = useState(TOTAL_LIVES);
  const [uiState, setUiState] = useState<'playing' | 'won' | 'lost'>('playing');

  /* ---- Reset game ---- */
  const resetGame = useCallback(() => {
    playerRef.current = { ...PLAYER_START };
    playerDirRef.current = 'right';
    nextDirRef.current = 'right';
    robotsRef.current = ROBOT_STARTS.map((r) => ({ ...r }));
    notesRef.current = buildNotes();
    scoreRef.current = 0;
    livesRef.current = TOTAL_LIVES;
    moveTimerRef.current = 0;
    robotTimerRef.current = 0;
    gameStateRef.current = 'playing';
    hitTimerRef.current = 0;
    setUiScore(0);
    setUiLives(TOTAL_LIVES);
    setUiState('playing');
  }, []);

  /* ---- Direction input ---- */
  const setDirection = useCallback((dir: Direction) => {
    nextDirRef.current = dir;
  }, []);

  /* ---- Keyboard handler ---- */
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault();
          setDirection('up');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          setDirection('down');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          setDirection('left');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          setDirection('right');
          break;
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [setDirection]);

  /* ---- Main game loop ---- */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const MOVE_INTERVAL = 10; // frames between player moves (slow for kids)
    const ROBOT_INTERVAL = 14; // robots are slower

    function canMove(x: number, y: number): boolean {
      if (x < 0 || x >= COLS || y < 0 || y >= ROWS) return false;
      return MAZE[y][x] === 0;
    }

    function nextPos(e: Entity, dir: Direction): { x: number; y: number } {
      switch (dir) {
        case 'up': return { x: e.x, y: e.y - 1 };
        case 'down': return { x: e.x, y: e.y + 1 };
        case 'left': return { x: e.x - 1, y: e.y };
        case 'right': return { x: e.x + 1, y: e.y };
      }
    }

    function oppositeDir(d: Direction): Direction {
      switch (d) {
        case 'up': return 'down';
        case 'down': return 'up';
        case 'left': return 'right';
        case 'right': return 'left';
      }
    }

    function tick() {
      if (!ctx || !canvas) return;
      const gs = gameStateRef.current;

      /* Sizing */
      const dpr = window.devicePixelRatio || 1;
      const cssSize = Math.min(500, canvas.parentElement?.clientWidth ?? 500);
      if (canvas.width !== cssSize * dpr || canvas.height !== cssSize * dpr) {
        canvas.width = cssSize * dpr;
        canvas.height = cssSize * dpr;
        canvas.style.width = `${cssSize}px`;
        canvas.style.height = `${cssSize}px`;
      }
      const cellW = (cssSize * dpr) / COLS;
      const cellH = (cssSize * dpr) / ROWS;

      /* ---------- UPDATE ---------- */
      if (gs === 'playing') {
        // Mouth animation
        mouthOpenRef.current = (mouthOpenRef.current + 0.07) % 1;

        // Player move
        moveTimerRef.current++;
        if (moveTimerRef.current >= MOVE_INTERVAL) {
          moveTimerRef.current = 0;
          // Try next direction first, then current
          const nd = nextDirRef.current;
          const np = nextPos(playerRef.current, nd);
          if (canMove(np.x, np.y)) {
            playerRef.current = np;
            playerDirRef.current = nd;
          } else {
            const cp = nextPos(playerRef.current, playerDirRef.current);
            if (canMove(cp.x, cp.y)) {
              playerRef.current = cp;
            }
          }

          // Collect note
          const key = `${playerRef.current.x},${playerRef.current.y}`;
          if (notesRef.current.has(key)) {
            notesRef.current.delete(key);
            scoreRef.current += 10;
            setUiScore(scoreRef.current);
          }

          // Win check
          if (notesRef.current.size === 0) {
            gameStateRef.current = 'won';
            setUiState('won');
          }
        }

        // Robot move
        robotTimerRef.current++;
        if (robotTimerRef.current >= ROBOT_INTERVAL) {
          robotTimerRef.current = 0;
          for (const robot of robotsRef.current) {
            // Gather possible directions (not opposite, unless stuck)
            const dirs: Direction[] = (['up', 'down', 'left', 'right'] as Direction[]).filter(
              (d) => d !== oppositeDir(robot.dir) && canMove(nextPos(robot, d).x, nextPos(robot, d).y),
            );
            if (dirs.length > 0) {
              robot.dir = dirs[Math.floor(Math.random() * dirs.length)];
            } else {
              // Stuck: reverse
              const rev = oppositeDir(robot.dir);
              if (canMove(nextPos(robot, rev).x, nextPos(robot, rev).y)) {
                robot.dir = rev;
              }
            }
            const rp = nextPos(robot, robot.dir);
            if (canMove(rp.x, rp.y)) {
              robot.x = rp.x;
              robot.y = rp.y;
            }
          }

          // Collision check
          const px = playerRef.current.x;
          const py = playerRef.current.y;
          for (const robot of robotsRef.current) {
            if (robot.x === px && robot.y === py) {
              livesRef.current--;
              setUiLives(livesRef.current);
              if (livesRef.current <= 0) {
                gameStateRef.current = 'lost';
                setUiState('lost');
              } else {
                gameStateRef.current = 'hit';
                hitTimerRef.current = 90; // ~1.5s
              }
              break;
            }
          }
        }
      } else if (gs === 'hit') {
        hitTimerRef.current--;
        if (hitTimerRef.current <= 0) {
          // Respawn
          playerRef.current = { ...PLAYER_START };
          playerDirRef.current = 'right';
          nextDirRef.current = 'right';
          robotsRef.current = ROBOT_STARTS.map((r) => ({ ...r }));
          gameStateRef.current = 'playing';
        }
      }

      /* ---------- DRAW ---------- */
      // Background
      ctx.fillStyle = '#bae6fd'; // sky-200
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Walls
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          if (MAZE[r][c] === 1) {
            ctx.fillStyle = '#1e3a5f';
            ctx.fillRect(c * cellW, r * cellH, cellW, cellH);
            // Inner lighter border for depth
            ctx.fillStyle = '#2d5a8e';
            const inset = cellW * 0.08;
            ctx.fillRect(
              c * cellW + inset,
              r * cellH + inset,
              cellW - inset * 2,
              cellH - inset * 2,
            );
          }
        }
      }

      // Notes (pink dots with stem)
      ctx.fillStyle = '#f472b6'; // pink-400
      for (const key of notesRef.current) {
        const [cx, cy] = key.split(',').map(Number);
        const nx = cx * cellW + cellW / 2;
        const ny = cy * cellH + cellH / 2;
        const noteR = cellW * 0.16;
        // Note head
        ctx.beginPath();
        ctx.arc(nx, ny + noteR * 0.5, noteR, 0, Math.PI * 2);
        ctx.fill();
        // Stem
        ctx.strokeStyle = '#f472b6';
        ctx.lineWidth = cellW * 0.06;
        ctx.beginPath();
        ctx.moveTo(nx + noteR * 0.8, ny + noteR * 0.5);
        ctx.lineTo(nx + noteR * 0.8, ny - noteR * 1.4);
        ctx.stroke();
        // Flag
        ctx.beginPath();
        ctx.moveTo(nx + noteR * 0.8, ny - noteR * 1.4);
        ctx.quadraticCurveTo(
          nx + noteR * 2,
          ny - noteR * 0.8,
          nx + noteR * 0.8,
          ny - noteR * 0.2,
        );
        ctx.fill();
      }

      // Robots
      for (const robot of robotsRef.current) {
        const rx = robot.x * cellW;
        const ry = robot.y * cellH;
        const pad = cellW * 0.1;
        // Body
        ctx.fillStyle = robot.color;
        ctx.beginPath();
        ctx.roundRect(rx + pad, ry + pad, cellW - pad * 2, cellH - pad * 2, cellW * 0.15);
        ctx.fill();
        // Antenna
        ctx.strokeStyle = robot.color;
        ctx.lineWidth = cellW * 0.06;
        ctx.beginPath();
        ctx.moveTo(rx + cellW / 2, ry + pad);
        ctx.lineTo(rx + cellW / 2, ry);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(rx + cellW / 2, ry, cellW * 0.06, 0, Math.PI * 2);
        ctx.fill();
        // Eyes
        const eyeR = cellW * 0.1;
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(rx + cellW * 0.35, ry + cellH * 0.38, eyeR, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(rx + cellW * 0.65, ry + cellH * 0.38, eyeR, 0, Math.PI * 2);
        ctx.fill();
        // Pupils
        ctx.fillStyle = '#1e293b';
        const pupilR = eyeR * 0.55;
        ctx.beginPath();
        ctx.arc(rx + cellW * 0.35, ry + cellH * 0.4, pupilR, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(rx + cellW * 0.65, ry + cellH * 0.4, pupilR, 0, Math.PI * 2);
        ctx.fill();
        // Mouth (rectangle)
        ctx.fillStyle = robot.eyeColor;
        ctx.fillRect(
          rx + cellW * 0.3,
          ry + cellH * 0.58,
          cellW * 0.4,
          cellH * 0.12,
        );
        // Zigzag bottom
        ctx.fillStyle = robot.color;
        const zy = ry + cellH - pad;
        const zw = cellW * 0.15;
        ctx.beginPath();
        ctx.moveTo(rx + pad, zy);
        for (let i = 0; i < 4; i++) {
          ctx.lineTo(rx + pad + zw * (i + 0.5), zy + cellH * 0.1);
          ctx.lineTo(rx + pad + zw * (i + 1), zy);
        }
        ctx.fill();
      }

      // Player (Baby Shark — yellow pacman)
      {
        const px = playerRef.current.x * cellW + cellW / 2;
        const py = playerRef.current.y * cellH + cellH / 2;
        const radius = cellW * 0.4;
        const mouthAngle = Math.abs(Math.sin(mouthOpenRef.current * Math.PI * 2)) * 0.6 + 0.05;
        let startAngle = mouthAngle;
        let endAngle = Math.PI * 2 - mouthAngle;
        // Rotation based on direction
        let rotation = 0;
        switch (playerDirRef.current) {
          case 'right': rotation = 0; break;
          case 'down': rotation = Math.PI / 2; break;
          case 'left': rotation = Math.PI; break;
          case 'up': rotation = -Math.PI / 2; break;
        }
        startAngle += rotation;
        endAngle += rotation;

        // Body
        ctx.fillStyle = '#facc15'; // yellow-400
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.arc(px, py, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fill();

        // Eye
        const eyeOffX = Math.cos(rotation - 0.5) * radius * 0.35;
        const eyeOffY = Math.sin(rotation - 0.5) * radius * 0.35;
        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.arc(px + eyeOffX, py + eyeOffY, radius * 0.13, 0, Math.PI * 2);
        ctx.fill();

        // Tiny dorsal fin
        const finAngle = rotation - Math.PI / 2;
        const finX = px + Math.cos(finAngle) * radius * 0.65;
        const finY = py + Math.sin(finAngle) * radius * 0.65;
        ctx.fillStyle = '#eab308'; // yellow-500
        ctx.beginPath();
        ctx.moveTo(finX, finY);
        ctx.lineTo(
          finX + Math.cos(finAngle) * radius * 0.45,
          finY + Math.sin(finAngle) * radius * 0.45,
        );
        ctx.lineTo(
          finX + Math.cos(rotation) * radius * 0.3,
          finY + Math.sin(rotation) * radius * 0.3,
        );
        ctx.closePath();
        ctx.fill();
      }

      // Hit overlay
      if (gs === 'hit') {
        ctx.fillStyle = 'rgba(0,0,0,0.35)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.font = `bold ${cellW * 0.9}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('O robo apanhou-te!', canvas.width / 2, canvas.height / 2);
        ctx.font = `${cellW * 0.55}px sans-serif`;
        ctx.fillText('A voltar...', canvas.width / 2, canvas.height / 2 + cellW);
      }

      animFrameRef.current = requestAnimationFrame(tick);
    }

    animFrameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, []);

  /* ---- Touch button handler ---- */
  const handleTouch = useCallback(
    (dir: Direction) => (e: React.TouchEvent | React.MouseEvent) => {
      e.preventDefault();
      setDirection(dir);
    },
    [setDirection],
  );

  /* ---- Overlays ---- */
  const showOverlay = uiState === 'won' || uiState === 'lost';

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6">
          {/* Back button */}
          <div className="mb-6">
            <Button
              asChild
              variant="outline"
              className="rounded-full border-2 border-pink-300 text-pink-600 hover:bg-pink-50 font-bold"
            >
              <Link to="/kids/jogos" className="inline-flex items-center gap-2">
                <ArrowLeft className="w-5 h-5" />
                Voltar aos Jogos
              </Link>
            </Button>
          </div>

          {/* Title */}
          <h1 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-center mb-2">
            <span className="text-yellow-500">Baby Shark</span>{' '}
            <span className="text-pink-500">Pacman</span>
          </h1>
          <p className="text-center text-sky-700 font-bold mb-6 text-base md:text-lg">
            Ajuda o Baby Shark a recolher todas as notas musicais!
          </p>

          {/* Score & Lives */}
          <div className="flex items-center justify-center gap-6 mb-4">
            <div className="px-4 py-2 rounded-full bg-yellow-100 border-2 border-yellow-300 font-bold text-yellow-700 text-sm md:text-base">
              Pontos: {uiScore}
            </div>
            <div className="px-4 py-2 rounded-full bg-pink-100 border-2 border-pink-300 font-bold text-pink-700 text-sm md:text-base">
              Vidas: {Array.from({ length: uiLives }, () => '\u{1F988}').join(' ')}
            </div>
          </div>

          {/* Canvas + overlay wrapper */}
          <div className="relative mx-auto" style={{ maxWidth: 500 }}>
            <canvas
              ref={canvasRef}
              className="w-full rounded-2xl border-4 border-sky-300 shadow-xl bg-sky-200"
              style={{ aspectRatio: '1 / 1', touchAction: 'none' }}
            />

            {/* Win / Game Over overlay */}
            {showOverlay && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-2xl z-10">
                <div className="bg-white rounded-3xl p-8 md:p-10 text-center shadow-2xl border-4 border-pink-300 mx-4 max-w-sm">
                  {uiState === 'won' ? (
                    <>
                      <p className="text-4xl mb-3">&#x1F389;</p>
                      <h2 className="font-display font-bold text-2xl md:text-3xl text-pink-600 mb-3">
                        Parabens!
                      </h2>
                      <p className="text-charcoal/80 mb-2 text-lg">
                        Recolheste todas as notas!
                      </p>
                      <p className="font-bold text-yellow-600 text-xl mb-6">
                        Pontos: {uiScore}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-4xl mb-3">&#x1F622;</p>
                      <h2 className="font-display font-bold text-2xl md:text-3xl text-sky-600 mb-3">
                        Oh nao!
                      </h2>
                      <p className="text-charcoal/80 mb-2 text-lg">
                        Os robos ganharam desta vez!
                      </p>
                      <p className="text-charcoal/60 mb-6">
                        Tenta outra vez!
                      </p>
                    </>
                  )}
                  <Button
                    onClick={resetGame}
                    className="h-14 px-8 text-base font-extrabold rounded-full bg-pink-500 hover:bg-pink-600 text-white shadow-[0_8px_0_rgba(190,24,93,0.6)] hover:shadow-[0_4px_0_rgba(190,24,93,0.6)] hover:translate-y-1 transition-all border-4 border-white"
                  >
                    Jogar outra vez
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile controls */}
          <div className="mt-6 flex flex-col items-center gap-2 md:hidden select-none">
            <button
              onTouchStart={handleTouch('up')}
              onMouseDown={handleTouch('up')}
              className="w-16 h-16 rounded-2xl bg-sky-400 active:bg-sky-500 text-white shadow-[0_6px_0_rgba(2,132,199,0.7)] active:shadow-[0_2px_0_rgba(2,132,199,0.7)] active:translate-y-1 transition-all flex items-center justify-center border-4 border-white"
              aria-label="Cima"
            >
              <ChevronUp className="w-8 h-8" />
            </button>
            <div className="flex gap-2">
              <button
                onTouchStart={handleTouch('left')}
                onMouseDown={handleTouch('left')}
                className="w-16 h-16 rounded-2xl bg-pink-400 active:bg-pink-500 text-white shadow-[0_6px_0_rgba(190,24,93,0.7)] active:shadow-[0_2px_0_rgba(190,24,93,0.7)] active:translate-y-1 transition-all flex items-center justify-center border-4 border-white"
                aria-label="Esquerda"
              >
                <ArrowLeft className="w-8 h-8" />
              </button>
              <button
                onTouchStart={handleTouch('down')}
                onMouseDown={handleTouch('down')}
                className="w-16 h-16 rounded-2xl bg-yellow-400 active:bg-yellow-500 text-white shadow-[0_6px_0_rgba(202,138,4,0.7)] active:shadow-[0_2px_0_rgba(202,138,4,0.7)] active:translate-y-1 transition-all flex items-center justify-center border-4 border-white"
                aria-label="Baixo"
              >
                <ArrowDown className="w-8 h-8" />
              </button>
              <button
                onTouchStart={handleTouch('right')}
                onMouseDown={handleTouch('right')}
                className="w-16 h-16 rounded-2xl bg-emerald-400 active:bg-emerald-500 text-white shadow-[0_6px_0_rgba(5,150,105,0.7)] active:shadow-[0_2px_0_rgba(5,150,105,0.7)] active:translate-y-1 transition-all flex items-center justify-center border-4 border-white"
                aria-label="Direita"
              >
                <ArrowRight className="w-8 h-8" />
              </button>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-8 max-w-md mx-auto text-center space-y-2">
            <p className="text-sm text-charcoal/60 font-bold">
              Usa as setas do teclado ou os botoes no ecra para mover o Baby Shark.
            </p>
            <p className="text-sm text-charcoal/50">
              Recolhe todas as notas musicais{' '}
              <span className="text-pink-500">&#x266A;</span> e foge dos robos!
            </p>
          </div>
        </div>
      </main>

      <Footer />
      <BackToTop />
    </div>
  );
};

export default KidsPacman;
