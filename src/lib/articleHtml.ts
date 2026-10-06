const ALLOWED = new Set([
  "P",
  "BR",
  "STRONG",
  "B",
  "EM",
  "I",
  "U",
  "S",
  "H1",
  "H2",
  "H3",
  "UL",
  "OL",
  "LI",
  "A",
  "BLOCKQUOTE",
]);

function sanitizeNode(node: Node): Node | null {
  if (node.nodeType === Node.TEXT_NODE) {
    return document.createTextNode(node.textContent ?? "");
  }
  if (!(node instanceof Element)) return null;

  if (!ALLOWED.has(node.tagName)) {
    const fragment = document.createDocumentFragment();
    node.childNodes.forEach((child) => {
      const clean = sanitizeNode(child);
      if (clean) fragment.appendChild(clean);
    });
    return fragment;
  }

  const clean = document.createElement(node.tagName.toLowerCase());
  if (node.tagName === "A") {
    const href = node.getAttribute("href") ?? "";
    if (/^(https?:|mailto:)/i.test(href)) {
      clean.setAttribute("href", href);
      clean.setAttribute("target", "_blank");
      clean.setAttribute("rel", "noopener noreferrer");
    }
  }
  node.childNodes.forEach((child) => {
    const next = sanitizeNode(child);
    if (next) clean.appendChild(next);
  });
  return clean;
}

/** HTML do editor, limitado às marcas de texto. Corre no browser. */
export function sanitizeArticleHtml(html: string): string {
  const parsed = new DOMParser().parseFromString(html, "text/html");
  const root = document.createElement("div");
  parsed.body.childNodes.forEach((child) => {
    const clean = sanitizeNode(child);
    if (clean) root.appendChild(clean);
  });
  return root.innerHTML;
}

export function readingMinutes(html: string): number {
  const text = html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .trim();
  if (!text) return 1;
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export function absoluteMediaUrl(url: string): string {
  if (!url) return "https://www.olhaqueduas.com/og-image.jpg";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `https://www.olhaqueduas.com${url.startsWith("/") ? url : `/${url}`}`;
}

const ARTICLE_OG = "https://www.olhaqueduas.com/exclusivo/abel-dias-betty-og.jpg";

/** Imagem 1200×630 da partilha. A capa do artigo fica inteira, sem corte. */
export function articleShareImage(post: { cover_url: string; og_image_url?: string }): string {
  const og = post.og_image_url?.trim() ?? "";
  if (og) return absoluteMediaUrl(og);
  const cover = post.cover_url.trim();
  if (cover.includes("abel-dias-betty")) return ARTICLE_OG;
  if (!cover) return ARTICLE_OG;
  return absoluteMediaUrl(cover);
}
