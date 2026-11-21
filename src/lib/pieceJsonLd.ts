/**
 * JSON-LD of a Programas piece: ONE source for the SPA (ExclusivoPost) and the
 * crawler page in middleware.ts (21/11/2026). No React here: the middleware imports it.
 */
import { SITE_URL } from "./routeMeta";
import { articleHeadline } from "./seo";

export { LOGO_URL, PUBLISHER } from "./publisher";
import { PUBLISHER } from "./publisher";

export interface Crumb {
  name: string;
  url: string;
}

/** BreadcrumbList starting at Início; `trail` is everything after it, page last. */
export function breadcrumbJsonLd(trail: Crumb[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Início", url: SITE_URL }, ...trail].map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  };
}

export interface PieceLd {
  title: string;
  seoTitle?: string | null;
  description: string;
  image: string;
  publishedAt?: string | null;
  updatedAt?: string | null;
  /** Program title (or «Programas»). */
  section: string;
  /** Piece author, else program author; empty = the brand. */
  author?: string | null;
  pageUrl: string;
  programUrl: string;
}

export function pieceAuthor(postAuthor?: string | null, programAuthor?: string | null): string {
  return postAuthor || programAuthor || "Olha que Duas";
}

export function pieceArticleJsonLd(p: PieceLd): Record<string, unknown> {
  const author = p.author || "Olha que Duas";
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: articleHeadline(p.title, p.seoTitle),
    description: p.description,
    image: [p.image],
    datePublished: p.publishedAt || undefined,
    dateModified: p.updatedAt || p.publishedAt || undefined,
    inLanguage: "pt-PT",
    articleSection: p.section,
    author: author === "Olha que Duas"
      ? { "@type": "Organization", name: author, url: SITE_URL }
      : { "@type": "Person", name: author },
    publisher: PUBLISHER,
    mainEntityOfPage: p.pageUrl,
  };
}

/** Início › Programas › <program> › <piece>. */
export function pieceBreadcrumbJsonLd(p: PieceLd): Record<string, unknown> {
  return breadcrumbJsonLd([
    { name: "Programas", url: `${SITE_URL}/programas` },
    { name: p.section, url: p.programUrl },
    { name: p.title, url: p.pageUrl },
  ]);
}
