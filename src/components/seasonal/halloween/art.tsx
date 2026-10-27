/**
 * Original seasonal illustrations, drawn for Olha que Duas.
 * One line language: 2px warm-ink outline, flat brand fills, round caps.
 */

export const INK = "hsl(25 30% 18%)";
export const GHOST_FILL = "hsl(40 45% 98%)";
export const PUMPKIN_RED = "hsl(14 78% 52%)"; // brand vermelho pulled towards orange
export const PUMPKIN_YELLOW = "hsl(var(--amarelo))";
export const STEM = "hsl(80 28% 34%)";
export const GLOW = "hsl(45 95% 62%)";

type GhostProps = { kids?: boolean; wave?: boolean };

/** Ghost drawn in a 64×76 box. */
export function GhostShape({ kids = false, wave = false }: GhostProps) {
  return (
    <g strokeLinecap="round" strokeLinejoin="round">
      <path
        d="M8 29C8 14.4 17.6 3 32 3s24 11.4 24 26v39q-4 6-8 0t-8 0q-4 6-8 0t-8 0q-4 6-8 0t-8 0Z"
        fill={GHOST_FILL}
        stroke={INK}
        strokeWidth={2}
      />
      {/* arms */}
      <path d="M8 40q-5 2-4.5 7.5" fill="none" stroke={INK} strokeWidth={2} />
      {wave ? (
        <path d="M56 38q7-4 5.5-11" fill="none" stroke={INK} strokeWidth={2} />
      ) : (
        <path d="M56 40q5 2 4.5 7.5" fill="none" stroke={INK} strokeWidth={2} />
      )}
      {/* eyes */}
      <ellipse cx={24.5} cy={30} rx={2.8} ry={kids ? 3.8 : 4.4} fill={INK} />
      <ellipse cx={39.5} cy={30} rx={2.8} ry={kids ? 3.8 : 4.4} fill={INK} />
      {kids && (
        <>
          <circle cx={25.6} cy={28.6} r={0.9} fill={GHOST_FILL} />
          <circle cx={40.6} cy={28.6} r={0.9} fill={GHOST_FILL} />
          <path d="M28.5 39.5q3.5 3.5 7 0" fill="none" stroke={INK} strokeWidth={2} />
          <circle cx={18} cy={37} r={3.2} fill="hsl(350 80% 78%)" opacity={0.7} />
          <circle cx={46} cy={37} r={3.2} fill="hsl(350 80% 78%)" opacity={0.7} />
        </>
      )}
    </g>
  );
}

type PumpkinProps = {
  tone?: "red" | "yellow";
  face?: boolean;
  lit?: boolean;
};

/** Pumpkin drawn in an 80×68 box. */
export function PumpkinShape({ tone = "red", face = false, lit = false }: PumpkinProps) {
  const fill = tone === "red" ? PUMPKIN_RED : PUMPKIN_YELLOW;
  const carve = lit ? GLOW : INK;
  return (
    <g strokeLinecap="round" strokeLinejoin="round">
      <path d="M38.5 21c-.3-6 1.6-10.6 5.6-13.2l2.6 3.1c-2.6 2.2-3.6 5.4-3.4 10.1Z" fill={STEM} stroke={INK} strokeWidth={2} />
      <path d="M44.5 15c5-4 10.5-3.2 10 1.8" fill="none" stroke={STEM} strokeWidth={2} />
      <ellipse cx={27} cy={43} rx={19} ry={21} fill={fill} stroke={INK} strokeWidth={2} />
      <ellipse cx={53} cy={43} rx={19} ry={21} fill={fill} stroke={INK} strokeWidth={2} />
      <ellipse cx={40} cy={43} rx={14} ry={22.5} fill={fill} stroke={INK} strokeWidth={2} />
      {/* soft highlight */}
      <path d="M33 30q-2.5 6-1.8 13" fill="none" stroke="hsl(40 45% 97%)" strokeOpacity={0.55} strokeWidth={2.2} />
      {face && (
        <g fill={carve}>
          <path d="M29.5 39.5l4-6.5 3.5 6.5Z" />
          <path d="M43 39.5l3.5-6.5 4 6.5Z" />
          <path d="M28 46.5q12 10 24 0q-12 4.5-24 0Z" />
        </g>
      )}
    </g>
  );
}

/** Small inline icons for the announcement strip. */
export function GhostIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 76" className={className} aria-hidden="true" focusable="false">
      <GhostShape />
    </svg>
  );
}

export function PumpkinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 68" className={className} aria-hidden="true" focusable="false">
      <PumpkinShape />
    </svg>
  );
}
