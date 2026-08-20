import { Link, useLocation } from 'react-router-dom';
import { Fish, Gamepad2, Music, Puzzle } from 'lucide-react';

const GAMES = [
  { to: '/kids/jogos/quiz', label: 'Quiz', icon: Puzzle },
  { to: '/kids/jogos/memoria', label: 'Memória', icon: Gamepad2 },
  { to: '/kids/jogos/pacman', label: 'Baby Shark', icon: Fish },
  { to: '/kids/jogos/snake', label: 'Cobra', icon: Music },
];

export default function MoreGames() {
  const { pathname } = useLocation();
  const others = GAMES.filter((g) => g.to !== pathname);
  if (others.length === 0) return null;

  return (
    <nav aria-label="Outros jogos" className="mt-10">
      <p className="text-center font-kids font-bold text-sky-900/70 mb-3">Queres outro jogo?</p>
      <div className="flex flex-wrap justify-center gap-3">
        {others.map((g) => (
          <Link
            key={g.to}
            to={g.to}
            className="inline-flex items-center gap-2 min-h-12 px-4 rounded-full bg-white border-4 border-white shadow-[0_5px_0_rgba(3,105,161,0.25)] hover:-translate-y-0.5 transition-transform font-kids font-extrabold text-pink-600 cursor-pointer"
          >
            <g.icon className="w-4 h-4" />
            {g.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
