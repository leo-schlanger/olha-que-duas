import { Link } from 'react-router-dom';
import { ArrowLeft, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import { useGamesMute } from './useGamesMute';
import logoKids from '@/assets/kids/logo-kids.webp';
import leoCartoon from '@/assets/kids/leo-cartoon.webp';
import alexandraCartoon from '@/assets/kids/alexandra-cartoon.webp';
import marluceCartoon from '@/assets/kids/marluce-cartoon.webp';

interface KidsGameShellProps {
  title: string;
  subtitle?: string;
  backTo?: string;
  backLabel?: string;
  hud?: React.ReactNode;
  controls?: React.ReactNode;
  children: React.ReactNode;
  showMascots?: boolean;
  hero?: React.ReactNode;
}

function Cloud({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 120"
      xmlns="http://www.w3.org/2000/svg"
      className={`absolute pointer-events-none drop-shadow-md ${className}`}
      aria-hidden
    >
      <g fill="white">
        <ellipse cx="60" cy="70" rx="40" ry="30" />
        <ellipse cx="100" cy="55" rx="45" ry="35" />
        <ellipse cx="140" cy="70" rx="38" ry="28" />
        <ellipse cx="100" cy="85" rx="60" ry="20" />
      </g>
    </svg>
  );
}

export default function KidsGameShell({
  title,
  subtitle,
  backTo = '/kids/jogos',
  backLabel = 'Voltar aos Jogos',
  hud,
  controls,
  children,
  showMascots = false,
  hero,
}: KidsGameShellProps) {
  const { muted, toggle } = useGamesMute();

  return (
    <div className="min-h-screen bg-[#bae6fd] overflow-x-hidden">
      <Header />
      <main className="relative font-kids">
        <div
          className="absolute inset-0 -z-10"
          style={{
            background: 'linear-gradient(180deg, #38bdf8 0%, #7dd3fc 38%, #bae6fd 72%, #e0f2fe 100%)',
          }}
        />

        <div className="absolute top-24 right-8 md:right-24 -z-0 pointer-events-none" aria-hidden>
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-yellow-300/60 blur-2xl scale-150 motion-safe:animate-pulse" />
            <div className="relative w-16 h-16 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-yellow-200 via-yellow-300 to-amber-400 shadow-[0_0_60px_rgba(253,224,71,0.7)]" />
          </div>
        </div>

        <Cloud className="top-20 left-[4%] w-24 md:w-36 opacity-90 motion-safe:animate-cloud-slow" />
        <Cloud className="top-36 right-[6%] w-20 md:w-32 opacity-85 motion-safe:animate-cloud-medium" />
        <Cloud className="top-[58%] left-[10%] w-16 md:w-28 opacity-70 motion-safe:animate-cloud-fast hidden sm:block" />

        {showMascots && (
          <>
            <img
              src={alexandraCartoon}
              alt=""
              className="hidden lg:block pointer-events-none absolute left-0 bottom-28 h-56 xl:h-72 object-contain drop-shadow-xl z-[1]"
            />
            <img
              src={marluceCartoon}
              alt=""
              className="hidden lg:block pointer-events-none absolute right-0 bottom-28 h-52 xl:h-64 object-contain drop-shadow-xl z-[1]"
            />
            <img
              src={leoCartoon}
              alt=""
              className="hidden md:block pointer-events-none absolute left-4 md:left-8 bottom-16 h-32 md:h-40 object-contain drop-shadow-lg z-[1] lg:hidden"
            />
          </>
        )}

        <div className="container mx-auto px-4 sm:px-6 pt-24 md:pt-28 pb-28 relative z-10">
          <div className="flex items-center justify-between gap-3 mb-5">
            <Button
              asChild
              className="h-12 px-5 text-sm font-kids font-extrabold rounded-full bg-white/95 hover:bg-white text-pink-600 shadow-[0_6px_0_rgba(190,24,93,0.25)] hover:shadow-[0_3px_0_rgba(190,24,93,0.25)] hover:translate-y-0.5 transition-all border-4 border-white cursor-pointer"
            >
              <Link to={backTo} className="inline-flex items-center gap-2">
                <ArrowLeft className="w-5 h-5" />
                {backLabel}
              </Link>
            </Button>
            <button
              type="button"
              onClick={toggle}
              aria-pressed={muted}
              aria-label={muted ? 'Ligar som' : 'Desligar som'}
              className="h-12 w-12 rounded-full bg-white/95 border-4 border-white shadow-[0_5px_0_rgba(3,105,161,0.25)] text-sky-700 flex items-center justify-center cursor-pointer hover:translate-y-0.5 transition-transform"
            >
              {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
          </div>

          {hero ?? (
            <div className="text-center mb-6">
              <img
                src={logoKids}
                alt="Olha que Duas Kids"
                className="mx-auto mb-3 h-16 w-16 md:h-20 md:w-20 object-contain drop-shadow-lg"
              />
              <h1 className="font-kids font-extrabold text-4xl sm:text-5xl md:text-6xl text-white drop-shadow-[0_4px_0_rgba(3,105,161,0.35)] leading-tight">
                {title}
              </h1>
              {subtitle && (
                <p className="mt-2 text-base md:text-xl font-bold text-white/95 drop-shadow-sm max-w-xl mx-auto">
                  {subtitle}
                </p>
              )}
            </div>
          )}

          {hud && <div className="mb-4">{hud}</div>}

          {children}

          {controls && <div className="mt-6">{controls}</div>}
        </div>

        <div className="absolute bottom-0 left-0 right-0 pointer-events-none z-0">
          <svg viewBox="0 0 1440 140" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <path
              fill="#7CC576"
              d="M0 70 C240 20, 480 110, 720 70 S1200 20, 1440 70 L1440 140 L0 140 Z"
              opacity="0.9"
            />
            <path fill="#5BAE52" d="M0 100 C240 60, 520 140, 760 100 S1220 60, 1440 100 L1440 140 L0 140 Z" />
          </svg>
        </div>
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}
