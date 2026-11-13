import { useLocation } from "react-router-dom";
import { Snowflake, X } from "lucide-react";
import { StarShape } from "./art";
import { daysToChristmas, getNatalPhase, NATAL_BANNER_DISMISS_KEY, type NatalPhase } from "./isNatalActive";
import { prefersReducedMotion, rememberSnowChoice, setSnowing, useSnow } from "./snowStore";
import "./natal.css";

type Copy = { label: string; labelShort: string; short: string; long: string };

const days = (n: number) => (n === 1 ? "Falta 1 dia" : `Faltam ${n} dias`);

/** PT-PT copy per phase. After 25 Dec nothing counts down. */
export function natalCopy(area: "site" | "kids", phase: NatalPhase, n: number): Copy {
  if (area === "kids") {
    switch (phase) {
      case "countdown":
        return { label: "Boas Festas!", labelShort: "Natal", short: `${days(n)}!`, long: `${days(n)} para o Pai Natal chegar!` };
      case "consoada":
        return { label: "É hoje!", labelShort: "É hoje!", short: "O Pai Natal vem aí!", long: "Esta noite o Pai Natal vem aí!" };
      case "natal":
        return { label: "Feliz Natal!", labelShort: "Feliz Natal!", short: "Já abriste os presentes?", long: "Já abriste os presentes?" };
      default:
        return { label: "Boas Festas!", labelShort: "Boas Festas!", short: "e bom Ano Novo!", long: "Boas Festas e um bom Ano Novo!" };
    }
  }
  switch (phase) {
    case "countdown":
      return { label: "Boas Festas", labelShort: "Boas Festas", short: days(n), long: `${days(n)} para o Natal. Que seja de afeto e boa música.` };
    case "consoada":
      return { label: "24 dez · Consoada", labelShort: "Consoada", short: "Boa Consoada!", long: "Boa Consoada, com a família e a nossa música." };
    case "natal":
      return { label: "25 dez · Natal", labelShort: "Natal", short: "Feliz Natal!", long: "Feliz Natal, de coração, do Olha que Duas." };
    default:
      return { label: "Boas Festas", labelShort: "Boas Festas", short: "e bom Ano Novo", long: "Boas Festas e um bom Ano Novo, com o Olha que Duas." };
  }
}

const NatalBanner = ({ onClose }: { onClose: () => void }) => {
  const { pathname } = useLocation();
  const { snowing } = useSnow();
  const area = pathname.startsWith("/kids") ? "kids" : "site";
  const now = new Date();
  const copy = natalCopy(area, getNatalPhase(now), daysToChristmas(now));
  const canSnow = !prefersReducedMotion() && !/^\/kids\/jogos\/.+/.test(pathname);

  const dismiss = () => {
    onClose();
    try {
      sessionStorage.setItem(NATAL_BANNER_DISMISS_KEY, "1");
    } catch {
      /* private mode: banner just closes for this view */
    }
  };

  const toggleSnow = () => {
    rememberSnowChoice(!snowing);
    setSnowing(!snowing);
  };

  return (
    <div className="nt-banner relative h-10 overflow-hidden text-[#fbf3e4]">
      <div className="container mx-auto h-full px-3 sm:px-6 flex items-center gap-1 sm:gap-3">
        <p className="flex-1 min-w-0 flex items-center justify-center gap-2 sm:gap-3 whitespace-nowrap">
          <svg viewBox="0 0 24 24" className="h-[15px] w-[15px] shrink-0" aria-hidden="true">
            <StarShape />
          </svg>
          <span
            className={
              area === "kids"
                ? "font-kids font-extrabold text-[13px] text-[#f2c14e]"
                : "font-sans font-bold text-[10.5px] sm:text-[11px] uppercase tracking-[0.14em] sm:tracking-[0.18em] text-[#f2c14e]"
            }
          >
            <span className="sm:hidden">{copy.labelShort}</span>
            <span className="hidden sm:inline">{copy.label}</span>
          </span>
          <span
            className={
              area === "kids"
                ? "font-kids font-semibold text-[13px] truncate"
                : "font-display italic font-semibold text-[16px] sm:text-[17px] leading-none truncate [font-variant-numeric:lining-nums]"
            }
          >
            <span className="sm:hidden">{copy.short}</span>
            <span className="hidden sm:inline">{copy.long}</span>
          </span>
          <svg viewBox="0 0 24 24" className="hidden sm:block h-[15px] w-[15px] shrink-0" aria-hidden="true">
            <StarShape />
          </svg>
        </p>
        {canSnow && (
          <button
            type="button"
            onClick={toggleSnow}
            aria-pressed={snowing}
            className="shrink-0 flex h-10 w-10 items-center justify-center rounded-full text-[#fbf3e4]/85 hover:text-white hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#f2c14e] transition-colors"
            aria-label={snowing ? "Parar a neve" : "Fazer nevar"}
            title={snowing ? "Parar a neve" : "Fazer nevar"}
          >
            <Snowflake className="h-4 w-4" />
          </button>
        )}
        <button
          type="button"
          onClick={dismiss}
          className="shrink-0 -mr-2 flex h-10 w-10 items-center justify-center rounded-full text-[#fbf3e4]/85 hover:text-white hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#f2c14e] transition-colors"
          aria-label="Fechar mensagem de Boas Festas"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default NatalBanner;
