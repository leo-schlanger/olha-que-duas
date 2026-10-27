import { BatShape, MoonShape, PumpkinShape } from "./art";
import "./halloween.css";

/** Footer night: moon rising at the bottom centre with bats, cobweb top-left, lit pumpkins bottom-right. */
const HalloweenFooterScene = () => (
  <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
    <svg viewBox="0 0 100 100" className="absolute -bottom-12 left-1/2 w-32 -translate-x-1/2 md:-bottom-16 md:w-44">
      <MoonShape id="hw-footer-moon" />
    </svg>
    <svg viewBox="0 0 64 28" className="absolute hidden md:block bottom-16 left-[calc(50%+56px)] w-7 md:bottom-20 md:left-[calc(50%+80px)] md:w-9" style={{ transform: "rotate(-12deg)" }}>
      <BatShape fill="hsl(265 45% 4%)" />
    </svg>
    <svg viewBox="0 0 64 28" className="absolute hidden md:block bottom-24 left-[calc(50%-84px)] w-5 md:bottom-28 md:left-[calc(50%-110px)] md:w-6" style={{ transform: "rotate(8deg)" }}>
      <BatShape fill="hsl(265 45% 4%)" />
    </svg>
    {/* cobweb */}
    <svg
      viewBox="0 0 64 64"
      className="absolute left-0 top-0 w-24 md:w-32 -scale-x-100"
      fill="none"
      stroke="hsl(45 60% 92%)"
      strokeOpacity={0.16}
      strokeWidth={0.7}
      strokeLinecap="round"
    >
      <path d="M64 0 18 0M64 0 22 22M64 0 42 40M64 0 64 46" />
      <path d="M51 0q2 6 4 7 4 2 9 2M38 0q3 11 7 13 6 4 19 5M27 0q4 16 10 20 9 6 27 9" />
      <path d="M55 7q-1 5 4 6M45 13q-2 8 6 10M37 20q-3 11 8 14" />
    </svg>
    {/* pumpkins resting on the bottom edge, right side (left side has the credit line) */}
    <div className="absolute bottom-0 right-3 flex items-end gap-1 md:right-8">
      <svg viewBox="0 0 80 68" className="w-8 md:w-10">
        <PumpkinShape tone="yellow" />
      </svg>
      <svg viewBox="0 0 80 68" className="hw-lit w-12 md:w-16">
        <PumpkinShape face lit />
      </svg>
    </div>
  </div>
);

export default HalloweenFooterScene;
