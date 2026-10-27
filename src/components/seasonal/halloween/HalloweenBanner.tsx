import { useState } from "react";
import { useLocation } from "react-router-dom";
import { X } from "lucide-react";
import { GhostIcon, PumpkinIcon } from "./art";
import { getHalloweenPhase, BANNER_DISMISS_KEY } from "./isHalloweenActive";
import "./halloween.css";

const COPY = {
  site: {
    halloween: { label: "31 out · Noite das Bruxas", labelShort: "Noite das Bruxas", short: "e Pão-por-Deus", long: "e a 1 de novembro, há Pão-por-Deus à porta." },
    paoPorDeus: { label: "1 de novembro", labelShort: "1 nov", short: "Dia de Pão-por-Deus", long: "Hoje é dia de Pão-por-Deus." },
  },
  kids: {
    halloween: { label: "Doces ou travessuras?", labelShort: "Doces ou travessuras?", short: "e há Pão-por-Deus!", long: "Cá em Portugal também se pede o Pão-por-Deus!" },
    paoPorDeus: { label: "Pão-por-Deus!", labelShort: "Pão-por-Deus!", short: "Hoje pede-se à porta", long: "Hoje é dia de pedir o Pão-por-Deus à porta!" },
  },
} as const;

const HalloweenBanner = () => {
  const { pathname } = useLocation();
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  const area = pathname.startsWith("/kids") ? "kids" : "site";
  const copy = COPY[area][getHalloweenPhase(new Date())];

  const dismiss = () => {
    setVisible(false);
    try {
      sessionStorage.setItem(BANNER_DISMISS_KEY, "1");
    } catch {
      /* private mode: banner just closes for this view */
    }
  };

  return (
    <div className="h-10 bg-[hsl(25_30%_14%)] text-[hsl(40_45%_97%)]">
      <div className="container mx-auto h-full px-3 sm:px-6 flex items-center gap-3">
        <p className="flex-1 min-w-0 flex items-center justify-center gap-2 sm:gap-3 whitespace-nowrap">
          <PumpkinIcon className="h-[18px] w-auto shrink-0" />
          <span
            className={
              area === "kids"
                ? "font-kids font-extrabold text-[13px] text-amarelo"
                : "font-sans font-semibold text-[10.5px] sm:text-[11px] uppercase tracking-[0.14em] sm:tracking-[0.18em] text-amarelo"
            }
          >
            <span className="sm:hidden">{copy.labelShort}</span>
            <span className="hidden sm:inline">{copy.label}</span>
          </span>
          <span
            className={
              area === "kids"
                ? "font-kids font-semibold text-[13px] truncate"
                : "font-display italic text-[15px] sm:text-base leading-none truncate [font-variant-numeric:lining-nums]"
            }
          >
            <span className="sm:hidden">{copy.short}</span>
            <span className="hidden sm:inline">{copy.long}</span>
          </span>
          <GhostIcon className="hidden sm:block h-[18px] w-auto shrink-0" />
        </p>
        <button
          type="button"
          onClick={dismiss}
          className="shrink-0 -mr-2 flex h-10 w-10 items-center justify-center rounded-full text-[hsl(40_45%_97%/0.75)] hover:text-[hsl(40_45%_97%)] hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amarelo transition-colors"
          aria-label="Fechar aviso do Dia das Bruxas"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default HalloweenBanner;
