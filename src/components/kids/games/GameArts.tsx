/** Illustrated hub art — no emoji icons. */

export function QuizArt() {
  return (
    <svg viewBox="0 0 160 120" className="w-full h-full" aria-hidden>
      <rect x="18" y="16" width="124" height="88" rx="18" fill="#FDE047" />
      <rect x="26" y="24" width="108" height="72" rx="14" fill="#fff" />
      <circle cx="52" cy="58" r="16" fill="#EC4899" />
      <text x="52" y="64" textAnchor="middle" fontSize="18" fontWeight="800" fill="white" fontFamily="Baloo 2, sans-serif">
        ?
      </text>
      <rect x="78" y="42" width="44" height="10" rx="5" fill="#7DD3FC" />
      <rect x="78" y="58" width="36" height="10" rx="5" fill="#F9A8D4" />
      <rect x="78" y="74" width="40" height="10" rx="5" fill="#86EFAC" />
    </svg>
  );
}

export function MemoryArt() {
  return (
    <svg viewBox="0 0 160 120" className="w-full h-full" aria-hidden>
      <rect x="28" y="22" width="46" height="58" rx="10" fill="#EC4899" transform="rotate(-8 51 51)" />
      <rect x="86" y="28" width="46" height="58" rx="10" fill="#38BDF8" transform="rotate(8 109 57)" />
      <circle cx="50" cy="52" r="8" fill="#FDE047" />
      <circle cx="110" cy="56" r="8" fill="#FDE047" />
      <rect x="40" y="70" width="22" height="6" rx="3" fill="white" opacity="0.8" />
      <rect x="100" y="74" width="22" height="6" rx="3" fill="white" opacity="0.8" />
    </svg>
  );
}

export function MicroArt() {
  return (
    <svg viewBox="0 0 160 120" className="w-full h-full" aria-hidden>
      <circle cx="80" cy="62" r="42" fill="#FDE047" />
      <rect x="58" y="28" width="44" height="22" rx="8" fill="#2563EB" />
      <rect x="50" y="22" width="60" height="10" rx="5" fill="#1D4ED8" />
      <circle cx="68" cy="64" r="5" fill="#1E293B" />
      <circle cx="92" cy="64" r="5" fill="#1E293B" />
      <path d="M68 78 Q80 88 92 78" stroke="#EC4899" strokeWidth="4" fill="none" strokeLinecap="round" />
      <circle cx="80" cy="96" r="6" fill="#F59E0B" />
      <path d="M118 36 Q128 28 138 40" stroke="#EC4899" strokeWidth="3" fill="none" />
      <circle cx="138" cy="44" r="5" fill="#EC4899" />
    </svg>
  );
}

export function SnakeArt() {
  return (
    <svg viewBox="0 0 160 120" className="w-full h-full" aria-hidden>
      <circle cx="46" cy="72" r="14" fill="#EC4899" />
      <circle cx="66" cy="62" r="14" fill="#F97316" />
      <circle cx="86" cy="54" r="14" fill="#EAB308" />
      <circle cx="106" cy="48" r="16" fill="#22C55E" />
      <circle cx="112" cy="42" r="3.5" fill="white" />
      <circle cx="120" cy="42" r="3.5" fill="white" />
      <circle cx="113" cy="42" r="1.8" fill="#1E293B" />
      <circle cx="121" cy="42" r="1.8" fill="#1E293B" />
      <polygon points="132,28 136,38 126,34" fill="#FDE047" stroke="#F59E0B" strokeWidth="1" />
    </svg>
  );
}
