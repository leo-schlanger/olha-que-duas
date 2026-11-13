/**
 * Original Christmas illustrations for Olha que Duas (palette of the client's
 * wreath logo). Flat fills, round caps, no gradients except the star glow.
 */

export const NT = {
  noite: "#2b0710",
  bordo: "#5c0f1f",
  vermelho: "#b3122a",
  vivo: "#d4213d",
  dourado: "#f2c14e",
  douradoEsc: "#c8962c",
  pinheiro: "#14532d",
  pinheiroClaro: "#1f7a45",
  pinheiroNoite: "#0b2e1c",
  neve: "#ffffff",
  neveSombra: "#dfe8ef",
  creme: "#fbf3e4",
  tronco: "#5a3a22",
} as const;

const BULBS = [NT.vivo, NT.dourado, NT.neve, NT.dourado];

/** Pine tree in a 60×90 box: three tiers with snow on each, optional lights. */
export function PineShape({
  fill = NT.pinheiro,
  snow = true,
  lights = false,
  star = false,
}: {
  fill?: string;
  snow?: boolean;
  lights?: boolean;
  star?: boolean;
}) {
  return (
    <g strokeLinejoin="round">
      <rect x={26} y={76} width={8} height={14} rx={1.5} fill={NT.tronco} />
      <path d="M30 34 52 66Q53 70 48 70H12Q7 70 8 66Z" fill={fill} />
      <path d="M30 20 47 46Q48 50 44 50H16Q12 50 13 46Z" fill={fill} />
      <path d="M30 6 42 28Q43 31 40 31H20Q17 31 18 28Z" fill={fill} />
      {snow && (
        <g fill={NT.neve}>
          <path d="M13 70h35q5 0 4-3.5-4 3.5-8 1.5-4 3-8 0-4 3-8 0-4 3-8 0-4 2-7-1Q8 70 13 70Z" />
          <path d="M16 50h28q4 0 3-3-3 3-6 1-3 2.5-6 0-3 2.5-6 0-3 2.5-6 0-3 2-6-1Q12 50 16 50Z" />
          <path d="M20 31h20q3 0 2-2.5-2 2-4.5.6-2.5 2-5 0-2.5 2-5 0-2.5 1.6-4.5-.6Q17 31 20 31Z" />
          <path d="M30 6 34.5 14.5Q32 13 30 15.5 28 13 25.5 14.5Z" />
        </g>
      )}
      {lights && (
        <g>
          {[
            [20, 44], [34, 41], [41, 45], [26, 25], [35, 26], [16, 64], [27, 60], [39, 62], [47, 65], [31, 52],
          ].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={2} fill={BULBS[i % BULBS.length]} />
          ))}
        </g>
      )}
      {star && (
        <path
          d="M30 -2l2.4 4.9 5.4.8-3.9 3.8.9 5.4L30 10.4l-4.8 2.5.9-5.4-3.9-3.8 5.4-.8Z"
          fill={NT.dourado}
          stroke={NT.douradoEsc}
          strokeWidth={0.8}
        />
      )}
    </g>
  );
}

/** Five-point star in a 24×24 box. */
export function StarShape({ fill = NT.dourado, stroke = NT.douradoEsc }: { fill?: string; stroke?: string }) {
  return (
    <path
      d="M12 1.5l3.1 6.3 6.9 1-5 4.9 1.2 6.9L12 17.3l-6.2 3.3L7 13.7 2 8.8l6.9-1Z"
      fill={fill}
      stroke={stroke}
      strokeWidth={1}
      strokeLinejoin="round"
    />
  );
}

/** Six-arm snowflake in a 24×24 box (stroke only). */
export function SnowflakeShape({ stroke = NT.neve, width = 1.6 }: { stroke?: string; width?: number }) {
  return (
    <g stroke={stroke} strokeWidth={width} strokeLinecap="round" fill="none">
      {[0, 60, 120].map((r) => (
        <g key={r} transform={`rotate(${r} 12 12)`}>
          <path d="M12 2v20" />
          <path d="M9.5 4.5 12 7l2.5-2.5M9.5 19.5 12 17l2.5 2.5" />
        </g>
      ))}
    </g>
  );
}

/** Bauble in a 40×48 box: cap, hook, ball with a shine and a band. */
export function OrnamentShape({ fill = NT.vivo, band = NT.dourado }: { fill?: string; band?: string }) {
  return (
    <g>
      <path d="M20 0v6" stroke={NT.douradoEsc} strokeWidth={1.4} />
      <rect x={15} y={5} width={10} height={6} rx={1.5} fill={NT.douradoEsc} />
      <circle cx={20} cy={29} r={17} fill={fill} />
      <path d="M3.6 26q16.4 7 32.8 0 .6 2.4.5 4.6-16.9 7-33.8 0-.1-2.2.5-4.6Z" fill={band} />
      <ellipse cx={13} cy={21} rx={4} ry={6} fill="#fff" opacity={0.35} transform="rotate(30 13 21)" />
    </g>
  );
}

/** Gift box in a 48×48 box with ribbon and bow. `open` lifts the lid. */
export function GiftShape({
  box = NT.vivo,
  ribbon = NT.dourado,
  open = false,
}: {
  box?: string;
  ribbon?: string;
  open?: boolean;
}) {
  const lid = open ? "translate(-6 -10) rotate(-18 6 18)" : undefined;
  return (
    <g strokeLinejoin="round">
      <rect x={6} y={22} width={36} height={24} rx={2.5} fill={box} />
      <rect x={21} y={22} width={6} height={24} fill={ribbon} />
      <rect x={6} y={22} width={36} height={4} fill="#000" opacity={0.12} />
      <g transform={lid}>
        <rect x={3} y={15} width={42} height={9} rx={2} fill={box} />
        <rect x={21} y={15} width={6} height={9} fill={ribbon} />
        <path d="M24 15c-3-7-12-9-12-3 0 3 6 4 12 3Zm0 0c3-7 12-9 12-3 0 3-6 4-12 3Z" fill={ribbon} stroke={NT.douradoEsc} strokeWidth={1} />
      </g>
    </g>
  );
}

/** Holly sprig (two leaves, three berries) in a 48×32 box. */
export function HollyShape() {
  return (
    <g>
      <path d="M24 16C18 6 8 4 2 8c3 1 3 4 1 6 3 0 5 2 4 5 3-2 6-1 7 2 1-3 4-4 7-3-1-1 0-2 3-2Z" fill={NT.pinheiroClaro} />
      <path d="M24 16c6-10 16-12 22-8-3 1-3 4-1 6-3 0-5 2-4 5-3-2-6-1-7 2-1-3-4-4-7-3 1-1 0-2-3-2Z" fill={NT.pinheiro} />
      <circle cx={21} cy={18} r={4} fill={NT.vivo} />
      <circle cx={27.5} cy={18.5} r={4} fill={NT.vermelho} />
      <circle cx={24} cy={23.5} r={4} fill={NT.vivo} />
      <circle cx={20} cy={16.6} r={1.1} fill="#fff" opacity={0.6} />
    </g>
  );
}

/** Snowman in a 56×80 box, friendly face. */
export function SnowmanShape() {
  return (
    <g strokeLinecap="round" strokeLinejoin="round">
      <circle cx={28} cy={58} r={20} fill={NT.neve} stroke={NT.neveSombra} strokeWidth={2} />
      <circle cx={28} cy={28} r={14} fill={NT.neve} stroke={NT.neveSombra} strokeWidth={2} />
      <rect x={16} y={5} width={24} height={4} rx={1} fill={NT.noite} />
      <rect x={20} y={-8} width={16} height={14} rx={1.5} fill={NT.noite} />
      <rect x={20} y={1} width={16} height={3} fill={NT.vivo} />
      <circle cx={23} cy={25} r={1.8} fill={NT.noite} />
      <circle cx={33} cy={25} r={1.8} fill={NT.noite} />
      <path d="M28 29l9 2.5-9 1.5Z" fill="#f08a24" />
      <path d="M22 35q6 4 12 0" fill="none" stroke={NT.noite} strokeWidth={1.6} />
      <path d="M15 40q13 6 26 0l1 5q-14 6-28 0Z" fill={NT.vivo} />
      <path d="M36 43l3 10 4-2-3-9Z" fill={NT.vivo} />
      <circle cx={28} cy={52} r={2} fill={NT.noite} />
      <circle cx={28} cy={61} r={2} fill={NT.noite} />
      <path d="M9 50 1 42M47 50l8-8" stroke={NT.tronco} strokeWidth={2.2} fill="none" />
    </g>
  );
}
