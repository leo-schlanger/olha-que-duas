import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from 'lucide-react';

export type DPadDir = 'up' | 'down' | 'left' | 'right';

interface GameDPadProps {
  onDir: (dir: DPadDir) => void;
  className?: string;
}

const BTN =
  'w-16 h-16 md:w-[4.25rem] md:h-[4.25rem] rounded-2xl text-white flex items-center justify-center border-4 border-white cursor-pointer touch-manipulation select-none transition-transform duration-150 ease-out active:translate-y-1 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-yellow-300';

export default function GameDPad({ onDir, className = '' }: GameDPadProps) {
  const press = (dir: DPadDir) => (e: React.PointerEvent | React.KeyboardEvent) => {
    e.preventDefault();
    onDir(dir);
  };

  return (
    <div className={`flex flex-col items-center gap-2 select-none ${className}`} role="group" aria-label="Comandos de movimento">
      <button
        type="button"
        aria-label="Cima"
        className={`${BTN} bg-sky-400 shadow-[0_6px_0_#0284c7,inset_0_2px_0_rgba(255,255,255,0.45)]`}
        onPointerDown={press('up')}
      >
        <ChevronUp className="w-8 h-8" />
      </button>
      <div className="flex gap-2">
        <button
          type="button"
          aria-label="Esquerda"
          className={`${BTN} bg-pink-400 shadow-[0_6px_0_#be185d,inset_0_2px_0_rgba(255,255,255,0.45)]`}
          onPointerDown={press('left')}
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
        <button
          type="button"
          aria-label="Baixo"
          className={`${BTN} bg-yellow-400 shadow-[0_6px_0_#ca8a04,inset_0_2px_0_rgba(255,255,255,0.45)]`}
          onPointerDown={press('down')}
        >
          <ChevronDown className="w-8 h-8" />
        </button>
        <button
          type="button"
          aria-label="Direita"
          className={`${BTN} bg-emerald-400 shadow-[0_6px_0_#059669,inset_0_2px_0_rgba(255,255,255,0.45)]`}
          onPointerDown={press('right')}
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      </div>
    </div>
  );
}
