import { GhostShape, PumpkinShape } from "./art";
import "./halloween.css";

/**
 * Editorial still life for the home Hero: two pumpkins and a ghost peeking
 * from behind. Sits on the bottom edge, under the content layer.
 */
const HalloweenHeroAccent = () => (
  <div
    className="pointer-events-none absolute bottom-3 right-3 sm:right-6 lg:right-auto lg:left-[20%] z-[1] w-[112px] sm:w-[150px] lg:w-[190px]"
    aria-hidden="true"
  >
    <svg viewBox="0 0 190 120" className="w-full h-auto overflow-visible">
      {/* ghost behind, peeks once then bobs a little */}
      <g className="hw-peek">
        <g className="hw-bob">
          <svg x={98} y={4} width={64} height={76} viewBox="0 0 64 76" overflow="visible">
            <GhostShape wave />
          </svg>
        </g>
      </g>
      {/* big red pumpkin */}
      <svg x={58} y={40} width={100} height={85} viewBox="0 0 80 68" overflow="visible">
        <PumpkinShape tone="red" />
      </svg>
      {/* small yellow pumpkin */}
      <svg x={10} y={70} width={60} height={51} viewBox="0 0 80 68" overflow="visible">
        <PumpkinShape tone="yellow" />
      </svg>
      {/* ground line */}
      <path d="M4 118.5h180" stroke="hsl(25 30% 18% / 0.25)" strokeWidth={1.5} strokeLinecap="round" />
    </svg>
  </div>
);

export default HalloweenHeroAccent;
