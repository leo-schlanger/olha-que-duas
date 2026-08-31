/**
 * Preparação do HTML dos episódios para render no site.
 *
 * O conteúdo vem do painel, que escreve na base de dados com a anon key.
 * Enquanto essa escrita não estiver fechada atrás de autenticação real,
 * o HTML é tratado como não fiável e limpo antes de chegar ao DOM.
 */

/** Tags que o editor produz e que são seguras de renderizar. */
const ALLOWED_TAGS = new Set([
  'p', 'br', 'strong', 'b', 'em', 'i', 'u', 's', 'blockquote',
  'h1', 'h2', 'h3', 'h4', 'ul', 'ol', 'li', 'a', 'hr', 'span',
]);

const ALLOWED_ATTRS: Record<string, Set<string>> = {
  a: new Set(['href', 'title', 'target', 'rel']),
  span: new Set(['style']),
  p: new Set(['style']),
  h1: new Set(['style']),
  h2: new Set(['style']),
  h3: new Set(['style']),
  h4: new Set(['style']),
};

/** Só text-align — é o único estilo que o TipTap aplica aqui. */
const SAFE_STYLE = /^text-align:\s*(left|center|right|justify);?$/;

function sanitizeNode(node: Element): void {
  const tag = node.tagName.toLowerCase();

  if (!ALLOWED_TAGS.has(tag)) {
    // Preserva o texto, descarta o elemento.
    const parent = node.parentNode;
    if (!parent) return;
    while (node.firstChild) parent.insertBefore(node.firstChild, node);
    parent.removeChild(node);
    return;
  }

  const allowed = ALLOWED_ATTRS[tag] ?? new Set<string>();
  for (const attr of Array.from(node.attributes)) {
    const name = attr.name.toLowerCase();

    if (!allowed.has(name)) {
      node.removeAttribute(attr.name);
      continue;
    }

    if (name === 'href') {
      const href = attr.value.trim();
      const safe = /^(https?:|mailto:|\/|#)/i.test(href);
      if (!safe) {
        node.removeAttribute(attr.name);
      } else if (/^https?:/i.test(href)) {
        node.setAttribute('target', '_blank');
        node.setAttribute('rel', 'noopener noreferrer');
      }
    }

    if (name === 'style' && !SAFE_STYLE.test(attr.value.trim())) {
      node.removeAttribute(attr.name);
    }
  }

  for (const child of Array.from(node.children)) sanitizeNode(child);
}

export function sanitizeStoryHtml(html: string): string {
  if (typeof window === 'undefined' || !html) return '';
  const doc = new DOMParser().parseFromString(
    `<div id="root">${html}</div>`,
    'text/html'
  );
  const root = doc.getElementById('root');
  if (!root) return '';
  for (const child of Array.from(root.children)) sanitizeNode(child);
  return root.innerHTML;
}

/**
 * Parte o episódio em dois, para encaixar o bloco de email e o anúncio
 * a meio do texto. O corte é feito no fim de um parágrafo, nunca a meio.
 *
 * A posição alvo é ~40% do texto: cedo o suficiente para apanhar quem já
 * está preso, tarde o suficiente para não interromper a entrada.
 */
export function splitForInterlude(html: string): [string, string] {
  const parts = html.split(/(?<=<\/p>)/i).filter(Boolean);
  if (parts.length < 4) return [html, ''];

  const total = parts.reduce((sum, p) => sum + p.length, 0);
  const target = total * 0.4;

  let running = 0;
  let cutIndex = 0;
  for (let i = 0; i < parts.length - 1; i += 1) {
    running += parts[i].length;
    if (running >= target) {
      cutIndex = i + 1;
      break;
    }
  }

  // Nunca cortar no primeiro nem no último parágrafo.
  cutIndex = Math.min(Math.max(cutIndex, 2), parts.length - 1);

  return [parts.slice(0, cutIndex).join(''), parts.slice(cutIndex).join('')];
}
