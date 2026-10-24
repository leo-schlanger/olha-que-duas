/**
 * Títulos e descrições à medida do Google, para não sair «...» no resultado.
 * O Google mostra ~60 caracteres de título e ~155 de descrição.
 * Usado pelo SPA (useMetaTags) e pelo middleware dos crawlers.
 */

export const SITE_NAME = "Olha que Duas";
export const TITLE_MAX = 60;
export const DESCRIPTION_MAX = 155;

const SUFFIX = ` | ${SITE_NAME}`;

/** Corta num ponto natural (:, —, !, ?, .) e, não havendo, na última palavra que cabe. */
function cutAt(text: string, max: number): string {
  if (text.length <= max) return text;
  const head = text.slice(0, max + 1);
  const breaks = [...head.matchAll(/[:—–!?.](?=\s)|\s[-|]\s/g)]
    .map((m) => m.index ?? 0)
    .filter((i) => i >= max * 0.45 && i <= max);
  if (breaks.length) {
    const i = breaks[breaks.length - 1];
    const mark = head[i];
    return head.slice(0, mark === "!" || mark === "?" ? i + 1 : i).trim();
  }
  const space = head.lastIndexOf(" ", max);
  return head.slice(0, space > max * 0.6 ? space : max).replace(/[\s,;:«"(–—-]+$/, "");
}

/** `<title>`: junta « | Olha que Duas» só quando cabe. */
export function documentTitle(title: string): string {
  const clean = title.replace(/\s+/g, " ").trim();
  if (!clean) return SITE_NAME;
  if (clean.length + SUFFIX.length <= TITLE_MAX) return clean + SUFFIX;
  return cutAt(clean, TITLE_MAX);
}

/** Meta description: frase inteira até 155; se não der, corta na palavra com «…». */
export function metaDescription(text: string): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= DESCRIPTION_MAX) return clean;
  const head = clean.slice(0, DESCRIPTION_MAX);
  const end = Math.max(head.lastIndexOf(". "), head.lastIndexOf("! "), head.lastIndexOf("? "));
  if (end >= DESCRIPTION_MAX * 0.6) return head.slice(0, end + 1);
  const space = head.lastIndexOf(" ", DESCRIPTION_MAX - 1);
  return `${head.slice(0, space).replace(/[\s,;:«"(–—-]+$/, "")}…`;
}

/** Google recomenda headline até 110 caracteres no NewsArticle. */
export function articleHeadline(title: string, seoTitle?: string | null): string {
  if (title.length <= 110) return title;
  return seoTitle?.trim() || cutAt(title, 110);
}
