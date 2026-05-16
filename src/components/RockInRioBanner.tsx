import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { siteConfig } from "@/config/site";

const STORAGE_KEY = "rir-banner-dismissed";

const RockInRioBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!sessionStorage.getItem(STORAGE_KEY)) {
      setVisible(true);
    }
  }, []);

  if (!siteConfig.rockInRio.enabled || !visible) return null;

  const dismiss = () => {
    setVisible(false);
    sessionStorage.setItem(STORAGE_KEY, "1");
  };

  const logo = siteConfig.rockInRio.partnerLogo;

  const piece = (
    <>
      <img src={logo} alt="" className="inline-block h-7 w-auto mx-3 object-contain drop-shadow-md" />
      <span className="text-white/90 font-semibold">PARCEIROS OFICIAIS</span>
      <span className="mx-1.5 text-amber-300 font-bold">ROCK IN RIO LISBOA 2026</span>
      <span className="mx-2 text-amber-300/80">&#9835;</span>
    </>
  );

  const segment = (
    <>
      {piece}
      {piece}
      {piece}
      {piece}
    </>
  );

  return (
    <div
      className="relative overflow-hidden"
      style={{
        background: "linear-gradient(90deg, hsl(217 85% 40%), hsl(260 60% 35%), hsl(0 70% 40%), hsl(217 85% 40%))",
        backgroundSize: "200% 100%",
      }}
    >
      <div className="flex items-center h-10 md:h-9">
        {/* Marquee track — links to internal page */}
        <Link to="/rockinrio" className="flex-1 overflow-hidden relative block">
          <div className="animate-marquee flex items-center whitespace-nowrap text-[11px] md:text-xs tracking-widest uppercase font-medium select-none">
            {segment}
            {segment}
          </div>
        </Link>

        {/* Close button */}
        <button
          onClick={dismiss}
          className="shrink-0 flex items-center justify-center w-8 h-8 text-white/70 hover:text-white hover:bg-white/10 transition-colors rounded-full mr-1"
          aria-label="Fechar banner"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default RockInRioBanner;
