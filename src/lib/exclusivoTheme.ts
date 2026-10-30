/**
 * Cor de cada programa do Exclusivo, a mesma das capas (admin/scripts/capas).
 * Usada nas abas, nas etiquetas dos cartões e no cabeçalho do programa.
 */
export interface ProgramTheme {
  /** Fundo da etiqueta e do traço do cabeçalho. */
  accent: string;
  /** Texto sobre o accent. */
  onAccent: string;
  /** Fundo suave do cabeçalho do programa. */
  soft: string;
  /** Rótulo curto da etiqueta. */
  label: string;
}

const THEMES: Record<string, ProgramTheme> = {
  "noticias-olha-que-duas": { accent: "#c8241b", onAccent: "#ffffff", soft: "#f8e6e3", label: "Notícias" },
  "curtas-biografias": { accent: "#16213a", onAccent: "#e2c48d", soft: "#e7e9ef", label: "Curtas Biografias" },
  "pimenta-na-lingua": { accent: "#b3241a", onAccent: "#fff4e6", soft: "#f6ebe0", label: "Opinião" },
  "mente-aberta": { accent: "#4d6b50", onAccent: "#f6f3ea", soft: "#e6ede2", label: "Mente Aberta" },
  // Night + candle from the reels' palette (Desktop/video/projetos/lendas-portugal-2026/arte/LEIA-ME.md §2).
  "lendas-de-portugal": { accent: "#1a2230", onAccent: "#f2b866", soft: "#ece6d8", label: "Lendas" },
};

const FALLBACK: ProgramTheme = { accent: "#1c0a10", onAccent: "#f6efe4", soft: "#efe7da", label: "Especiais" };

export function programTheme(slug: string | undefined | null): ProgramTheme {
  return (slug && THEMES[slug]) || FALLBACK;
}
