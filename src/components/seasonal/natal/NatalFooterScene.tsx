import { ElegantGiftShape, ElegantPineShape, NT } from "./art";
import "./natal.css";

/**
 * Footer: two gifts in the corner above the logo, snowy ground with slender
 * pines and gifts. Nothing is placed by % of the footer height: that lands on
 * text when the columns wrap (qa 13/11). No lights, no holly (team, 20/11).
 */
const NatalFooterScene = () => (
  <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
    {/* corner gifts: bottom stays above the footer's pt-12/md:pt-16 */}
    <div className="absolute left-2 top-2 flex items-end md:left-3 md:top-3">
      <svg viewBox="0 0 48 48" className="w-9 md:w-11">
        <ElegantGiftShape />
      </svg>
      <svg viewBox="0 0 48 48" className="-ml-2 w-6 md:w-8">
        <ElegantGiftShape box={NT.creme} />
      </svg>
    </div>
    {/* snowy ground: stays under the credit line (pb-20 leaves 80 px) */}
    <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-7 w-full md:h-9">
      <path d="M0 30C200 12 420 18 640 30S1080 46 1280 28 1420 20 1440 22V60H0Z" fill={NT.neve} fillOpacity={0.92} />
    </svg>
    {/* pines and gifts on the right, short enough to stay under the credit line */}
    <div className="absolute bottom-2 right-2 flex items-end gap-0 md:right-6">
      <svg viewBox="0 0 48 48" className="w-5 md:w-7 -mr-1 z-[1]">
        <ElegantGiftShape box={NT.bordo} />
      </svg>
      <svg viewBox="0 -4 60 94" className="w-7 md:w-9">
        <ElegantPineShape fill={NT.pinheiroClaro} />
      </svg>
      <svg viewBox="0 -4 60 94" className="w-9 md:w-12">
        <ElegantPineShape />
      </svg>
      <svg viewBox="0 0 48 48" className="w-5 md:w-7 -ml-2">
        <ElegantGiftShape />
      </svg>
    </div>
  </div>
);

export default NatalFooterScene;
