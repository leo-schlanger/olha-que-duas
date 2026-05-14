import { useState, useEffect } from "react";
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

  const logo = siteConfig.rockInRio.partnerLetteringWhite;

  const piece = (
    <>
      <img src={logo} alt="" className="inline-block h-5 md:h-[18px] w-auto mx-3 object-contain" />
      <span className="text-white/80">PARCEIROS OFICIAIS</span>
      <span className="mx-2 font-bold text-white">ROCK IN RIO LISBOA 2026</span>
      <span className="mx-2 opacity-70">&#9835;</span>
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
        background: "linear-gradient(90deg, hsl(217 85% 50%), hsl(0 75% 48%), hsl(217 85% 50%))",
        backgroundSize: "200% 100%",
      }}
    >
      <div className="flex items-center h-9 md:h-8">
        {/* Marquee track */}
        <div className="flex-1 overflow-hidden relative">
          <div className="animate-marquee flex items-center whitespace-nowrap text-[11px] md:text-xs tracking-widest uppercase font-medium select-none">
            {/* Duplicate content for seamless loop */}
            {segment}
            {segment}
          </div>
        </div>

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
