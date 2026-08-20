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

export function BabySharkArt() {
  return (
    <svg viewBox="0 0 160 120" className="w-full h-full" aria-hidden>
      <ellipse cx="80" cy="96" rx="48" ry="8" fill="#38BDF8" opacity="0.35" />
      <path d="M28 68 L12 48 L22 68 L12 86 Z" fill="#F59E0B" />
      <ellipse cx="86" cy="68" rx="42" ry="28" fill="#FACC15" />
      <ellipse cx="94" cy="76" rx="24" ry="14" fill="#FFFBEB" />
      <path d="M78 44 L92 18 L104 46 Z" fill="#FBBF24" />
      <ellipse cx="96" cy="86" rx="14" ry="7" fill="#F59E0B" />
      <circle cx="108" cy="62" r="7" fill="white" />
      <circle cx="110" cy="62" r="3.5" fill="#1E293B" />
      <circle cx="111.5" cy="60.5" r="1.4" fill="white" />
      <circle cx="98" cy="70" r="4" fill="#F9A8D4" opacity="0.8" />
      <path d="M118 70 Q128 76 118 80" stroke="#EA580C" strokeWidth="3" fill="none" strokeLinecap="round" />
      <circle cx="36" cy="40" r="5" fill="white" opacity="0.7" />
      <circle cx="48" cy="28" r="3" fill="white" opacity="0.55" />
    </svg>
  );
}

export function SnakeArt() {
  return (
    <svg viewBox="0 0 160 120" className="w-full h-full" aria-hidden>
      <circle cx="38" cy="78" r="13" fill="#F472B6" />
      <circle cx="54" cy="68" r="13" fill="#FB923C" />
      <circle cx="70" cy="60" r="13" fill="#FACC15" />
      <circle cx="86" cy="54" r="13" fill="#4ADE80" />
      <circle cx="102" cy="50" r="13" fill="#38BDF8" />
      <circle cx="118" cy="48" r="16" fill="#A78BFA" />
      <circle cx="112" cy="42" r="4.2" fill="white" />
      <circle cx="124" cy="42" r="4.2" fill="white" />
      <circle cx="113.2" cy="42" r="2" fill="#1E293B" />
      <circle cx="125.2" cy="42" r="2" fill="#1E293B" />
      <circle cx="110" cy="52" r="3" fill="#F9A8D4" />
      <circle cx="126" cy="52" r="3" fill="#F9A8D4" />
      <path d="M114 58 Q118 64 122 58" stroke="#BE185D" strokeWidth="2" fill="none" strokeLinecap="round" />
      <polygon points="132,22 136,34 124,30" fill="#FDE047" stroke="#F59E0B" strokeWidth="1.2" />
    </svg>
  );
}
