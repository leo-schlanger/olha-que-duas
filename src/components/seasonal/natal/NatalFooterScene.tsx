import { GiftShape, HollyShape, NT, PineShape } from "./art";
import "./natal.css";

/**
 * Footer: lights along the top edge, holly in the corner above the logo, snowy
 * ground with pines and gifts. Nothing is placed by % of the footer height:
 * that lands on text when the columns wrap (qa 13/11).
 */
const NatalFooterScene = () => (
  <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
    <div className="nt-lights top-0" />
    <svg viewBox="0 0 48 32" className="absolute left-2 top-5 w-16 md:w-20 -rotate-12">
      <HollyShape />
    </svg>
    {/* snowy ground: stays under the credit line (pb-20 leaves 80 px) */}
    <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-7 w-full md:h-9">
      <path d="M0 30C200 12 420 18 640 30S1080 46 1280 28 1420 20 1440 22V60H0Z" fill={NT.neve} fillOpacity={0.92} />
    </svg>
    {/* pines and gifts on the right, short enough to stay under the credit line */}
    <div className="absolute bottom-2 right-2 flex items-end gap-0 md:right-6">
      <svg viewBox="0 0 48 48" className="w-5 md:w-7 -mr-1 z-[1]">
        <GiftShape />
      </svg>
      <svg viewBox="0 -4 60 94" className="w-7 md:w-9">
        <PineShape fill={NT.pinheiroClaro} />
      </svg>
      <svg viewBox="0 -4 60 94" className="w-9 md:w-12">
        <PineShape lights star />
      </svg>
      <svg viewBox="0 0 48 48" className="w-5 md:w-7 -ml-2">
        <GiftShape box={NT.dourado} ribbon={NT.vivo} />
      </svg>
    </div>
  </div>
);

export default NatalFooterScene;
