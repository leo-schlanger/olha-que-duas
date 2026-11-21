import { documentTitle, metaDescription } from './src/lib/seo';
import { articleVideo, videoObjectJsonLd, type ArticleVideo } from './src/lib/articleVideo';
import { MOVED_ALBUMS, ROUTE_META, routeMeta } from './src/lib/routeMeta';
import { EVENT_SELECT, eventKeepsProgram } from './src/lib/programRadio';
import { pieceArticleJsonLd, pieceAuthor, pieceBreadcrumbJsonLd, type PieceLd } from './src/lib/pieceJsonLd';
export const config = {
  matcher: ['/servicos', '/faq', '/newsletter', '/privacidade', '/termos', '/galeria', '/galeria/:path*', '/noticias', '/noticias/:path*', '/programas', '/programas/:path*', '/exclusivo', '/exclusivo/:path*',
    // Any case (/Exclusivo/Mente-Aberta): vercel.json rules are case-sensitive.
    '/:legacy([Ee][Xx][Cc][Ll][Uu][Ss][Ii][Vv][Oo])', '/:legacy([Ee][Xx][Cc][Ll][Uu][Ss][Ii][Vv][Oo])/:path*',
    // Loja and Viagens left on 2026-11-20: any case, with or without the final slash.
    '/:moved([Gg][Aa][Ll][Ee][Rr][Ii][Aa])/:path*',
    '/:gone([Ll][Oo][Jj][Aa])', '/:gone([Ll][Oo][Jj][Aa])/:path*',
    '/:gone([Vv][Ii][Aa][Gg][Ee][Nn][Ss])', '/:gone([Vv][Ii][Aa][Gg][Ee][Nn][Ss])/:path*',
    '/kids', '/kids/:path*', '/auditoria-gratuita', '/rockinrio'],
};

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || '';

// Pieces that lived at /exclusivo/:slug before programs existed; now in Notícias.
// All redirects live here (not in vercel.json): one hop, any case (qa 20/11).
const LEGACY_NEWS_SLUGS = new Set([
  'abel-dias-o-ze-nunca-bateu-na-betty',
  'ronaldo-nao-voltara-a-ser-cr7',
  'biografia-diogo-jota-livro-oficial-liverpool',
  'cristina-ferreira-joao-monteiro-realizam-sonho-fabio-marques-np4game',
  'susana-da-silva-tribunal-antonio-pedro-cerdeira-romance-comandante-melides',
  'papa-leao-xiv-nodulo-pulmao-vai-ser-operado',
  'pedro-mourinho-fora-do-now',
  'david-antunes-morte-netinho',
]);
const SITE = 'https://www.olhaqueduas.com';

function moved(location: string): Response {
  return new Response(null, { status: 301, headers: { Location: `${SITE}${location}`, 'Cache-Control': 's-maxage=86400' } });
}

/** 301 target for an old address (/loja, /viagens, /exclusivo/...), or null. */
export function legacyRedirect(path: string, search = ''): string | null {
  if (/\.[a-z0-9]+$/i.test(path)) return null; // files (covers under /exclusivo/) stay
  const lower = path.toLowerCase().replace(/\/+$/, '') || '/';
  if (/^\/(loja|viagens)(\/|$)/.test(lower)) return '/';
  const album = lower.match(/^\/galeria\/([^/]+)$/);
  if (album && MOVED_ALBUMS[album[1]]) return MOVED_ALBUMS[album[1]];
  const old = lower.match(/^\/(?:exclusivo|programas)\/olha-que-duas-e-eu(\/[^/]+)?$/);
  if (old) return `/programas/noticias-olha-que-duas${old[1] ?? ''}`;
  if (!/^\/exclusivo(\/|$)/.test(lower)) return null;
  const rest = lower.slice('/exclusivo'.length);
  const one = rest.match(/^\/([^/]+)$/);
  if (one && LEGACY_NEWS_SLUGS.has(one[1])) return `/programas/noticias-olha-que-duas/${one[1]}`;
  return `/programas${rest}${search}`;
}
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || '';

const CRAWLERS = ['facebookexternalhit', 'Facebot', 'Twitterbot', 'WhatsApp', 'LinkedInBot', 'Slackbot', 'TelegramBot', 'Discordbot'];

// Motores de busca na coluna Exclusivo. O site é uma SPA; sem este HTML o
// Google fica dias com o título da homepage. O texto é o mesmo que o leitor vê.
const SEARCH_CRAWLERS = ['googlebot', 'google-inspectiontool', 'bingbot', 'duckduckbot', 'applebot', 'yandexbot'];

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// /** Remove o que nunca deve chegar a um crawler vindo da base de dados. */
// function stripScripts(html: string): string {
  // return html
    // .replace(/<script[\s\S]*?<\/script>/gi, '')
    // .replace(/<style[\s\S]*?<\/style>/gi, '')
    // .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '');
// }

const SLUG_REGEX = /^[a-z0-9][a-z0-9-]*[a-z0-9]$/;
const NEWS_SLUG_REGEX = /^[a-z0-9][a-z0-9-]*$/;

const DEFAULT_IMAGE = 'https://www.olhaqueduas.com/og-image.jpg';

/**
 * Capa de um álbum em 1200x630 para os crawlers sociais. Espelha o preset
 * `og` do src/lib/cloudinary.ts — se um lado mudar, o outro tem de
 * acompanhar. Conta com a foto `01` estar em formato horizontal: é aí que a
 * regra vive, no ficheiro, não na transformação (ver CLAUDE.md).
 */
function albumCoverUrl(slug: string): string {
  return (
    'https://res.cloudinary.com/dfljesvj7/image/upload/' +
    'w_1200,h_630,c_fill,g_auto,q_auto,f_auto' +
    `/olhaqueduas/galeria/${slug}/01`
  );
}

interface Meta {
  title: string;
  /** Título curto para o Google; sem ele, documentTitle corta o título. */
  seoTitle?: string;
  description: string;
  image: string;
  url: string;
  /** Corpo já em HTML. O texto é o mesmo que o leitor vê. */
  body?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  imageAlt?: string;
  imageWidth?: number;
  imageHeight?: number;
  author?: string;
  section?: string;
  jsonLd?: unknown;
  /** Reel 9:16 da peça: og:video para as redes. */
  video?: ArticleVideo | null;
  /** Robots value; default index (aggregated news: 'noindex, follow'). */
  robots?: string;
}

function stripScripts(value: string): string {
  return value
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '');
}

function shareImage(post: { cover_url?: unknown; og_image_url?: unknown }): string {
  const og = String(post.og_image_url || '').trim();
  const cover = String(post.cover_url || '').trim();
  const absolute = (value: string) =>
    value.startsWith('http')
      ? value
      : `https://www.olhaqueduas.com${value.startsWith('/') ? value : `/${value}`}`;
  if (og) return absolute(og);
  if (cover.includes('abel-dias-betty')) return 'https://www.olhaqueduas.com/exclusivo/abel-dias-betty-og.jpg';
  if (cover) return absolute(cover);
  return 'https://www.olhaqueduas.com/exclusivo/abel-dias-betty-og.jpg';
}

// Meta of each html() response, so search engines can get it on the SPA shell.
const SHELL_META = new WeakMap<Response, Meta>();
const INDEX_ROBOTS = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';

/**
 * Search engines (20/11/2026, SEO): the SPA's own index.html with this route's
 * title, description, canonical and OG/Twitter tags. Same page and content as
 * people get (the JS renders it); only the head is right in the raw HTML.
 */
export function withHead(shell: string, meta: Meta): string {
  const title = escapeHtml(documentTitle(meta.seoTitle || meta.title));
  const ogTitle = escapeHtml(meta.title);
  const description = escapeHtml(metaDescription(meta.description));
  const url = escapeHtml(meta.url);
  const image = escapeHtml(meta.image);
  const alt = escapeHtml(meta.imageAlt || meta.title);
  const tag = (attr: 'name' | 'property', key: string, value: string) => (doc: string) =>
    doc.replace(new RegExp(`<meta\\s+${attr}="${key.replace(/[.:]/g, '\\$&')}"[\\s\\S]*?\\/?>`), `<meta ${attr}="${key}" content="${value}" />`);
  const steps = [
    (d: string) => d.replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`),
    (d: string) => d.replace(/<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${url}" />`),
    tag('name', 'title', title),
    tag('name', 'robots', escapeHtml(meta.robots || INDEX_ROBOTS)),
    tag('name', 'googlebot', escapeHtml(meta.robots || INDEX_ROBOTS)),
    tag('name', 'description', description),
    tag('property', 'og:type', meta.type || 'website'),
    tag('property', 'og:url', url),
    tag('property', 'og:title', ogTitle),
    tag('property', 'og:description', description),
    tag('property', 'og:image', image),
    tag('property', 'og:image:secure_url', image),
    tag('property', 'og:image:alt', alt),
    tag('name', 'twitter:url', url),
    tag('name', 'twitter:title', ogTitle),
    tag('name', 'twitter:description', description),
    tag('name', 'twitter:image', image),
    tag('name', 'twitter:image:alt', alt),
  ];
  return steps.reduce((doc, step) => step(doc), shell);
}

function html(meta: Meta): Response {
  const title = escapeHtml(meta.title);
  const docTitle = escapeHtml(documentTitle(meta.seoTitle || meta.title));
  const description = escapeHtml(metaDescription(meta.description));
  const image = escapeHtml(meta.image);
  const url = escapeHtml(meta.url);
  const type = meta.type || 'website';

  const res = new Response(`<!DOCTYPE html><html lang="pt-PT"><head>
    <meta charset="utf-8">
    <title>${docTitle}</title>
    <meta name="description" content="${description}">
    <link rel="canonical" href="${url}">
    <meta name="robots" content="${escapeHtml(meta.robots || INDEX_ROBOTS)}">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:image" content="${image}">
    <meta property="og:image:alt" content="${escapeHtml(meta.imageAlt || meta.title)}">
    <meta property="og:image:width" content="${meta.imageWidth ?? 1200}">
    <meta property="og:image:height" content="${meta.imageHeight ?? 630}">
    <meta property="og:url" content="${url}">
    <meta property="og:type" content="${type}">
    <meta property="og:site_name" content="Olha que Duas">
    <meta property="og:locale" content="pt_PT">
    ${meta.video && meta.video.kind === 'mp4' ? `<meta property="og:video" content="${escapeHtml(meta.video.src)}">
    <meta property="og:video:secure_url" content="${escapeHtml(meta.video.src)}">
    <meta property="og:video:type" content="video/mp4">
    <meta property="og:video:width" content="720">
    <meta property="og:video:height" content="1280">` : ''}
    ${meta.publishedTime ? `<meta property="article:published_time" content="${escapeHtml(meta.publishedTime)}">` : ''}
    ${meta.author ? `<meta property="article:author" content="${escapeHtml(meta.author)}">` : ''}
    ${meta.section ? `<meta property="article:section" content="${escapeHtml(meta.section)}">` : ''}
    ${meta.jsonLd ? `<script type="application/ld+json">${JSON.stringify(meta.jsonLd).replace(/</g, '\\u003c')}</script>` : ''}
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${title}">
    <meta name="twitter:description" content="${description}">
    <meta name="twitter:image" content="${image}">
    <meta name="twitter:image:alt" content="${escapeHtml(meta.imageAlt || meta.title)}">
  </head><body>${meta.body || ''}</body></html>`, {
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 's-maxage=3600' },
  });
  SHELL_META.set(res, meta);
  return res;
}

// Exclusivo slug that does not exist: a real 404 for crawlers instead of the
// SPA's 200 (soft 404).
function notFound(url: string, back = '/programas', label = 'Ver os Programas'): Response {
  return new Response(`<!DOCTYPE html><html lang="pt-PT"><head>
    <meta charset="utf-8">
    <title>Página não encontrada | Olha que Duas</title>
    <meta name="robots" content="noindex, nofollow">
    <link rel="canonical" href="${escapeHtml(url)}">
  </head><body><h1>Página não encontrada</h1><p><a href="https://www.olhaqueduas.com${back}">${label}</a></p></body></html>`, {
    status: 404,
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 's-maxage=300' },
  });
}

async function fetchSupabase(table: string, query: string) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${query}`, {
    headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
  });
  return res.json();
}

export default async function middleware(request: Request): Promise<Response | undefined> {
  const res = await handle(request);
  const meta = res ? SHELL_META.get(res) : undefined;
  const ua = (request.headers.get('user-agent') || '').toLowerCase();
  const path = new URL(request.url).pathname;
  const isSocial = CRAWLERS.some((c) => ua.includes(c.toLowerCase()));
  // Search engines, except on a piece (which gets the article text): the SPA
  // shell with the right head. Social previews keep the small meta page.
  const isPiece = /^\/programas\/[^/]+\/[^/]+$/.test(path); // keeps the article text (same as the SPA)
  if (meta && !isSocial && SEARCH_CRAWLERS.some((c) => ua.includes(c)) && !isPiece) {
    try {
      const shell = await fetch(new URL('/', request.url).toString());
      if (shell.ok) {
        return new Response(withHead(await shell.text(), meta), {
          headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'private, no-store', Vary: 'User-Agent' },
        });
      }
    } catch {
      // fall through to the plain SPA
    }
    return undefined;
  }
  return res;
}

async function handle(request: Request): Promise<Response | undefined> {
  const ua = (request.headers.get('user-agent') || '').toLowerCase();
  const isSocialCrawler = CRAWLERS.some(c => ua.includes(c.toLowerCase()));
  const isSearchCrawler = SEARCH_CRAWLERS.some(c => ua.includes(c));

  const url = new URL(request.url);
  const path = url.pathname;

  // Old addresses: Loja, Viagens, /exclusivo (incl. Vinagre's program and the 8 legacy slugs).
  const target = legacyRedirect(path, url.search);
  if (target) return moved(target);
  // One canonical form: /servicos/ -> /servicos (qa r4).
  if (path.length > 1 && path.endsWith('/')) return moved(`${path.replace(/\/+$/, '')}${url.search}`);

  // // ========== HISTÓRIAS ==========
  // // Único sítio onde os motores de busca recebem HTML pré-renderizado: o
  // // site é uma SPA e o Googlebot só executa JS dias depois, o que atrasaria
  // // a indexação de conteúdo cujo valor todo está em ser encontrado. O texto
  // // servido é o mesmo que o leitor vê — dynamic rendering, não cloaking.
  // if (path === '/historias' || path.startsWith('/historias/')) {
    // if (!isSocialCrawler && !isSearchCrawler) return;
    // return handleStories(path, isSearchCrawler);
  // }

  // One canonical form for every visitor: /Programas/Mente-Aberta/ -> /programas/mente-aberta.
  if (/^\/programas/i.test(path)) {
    const canonical = path.toLowerCase().replace(/\/+$/, '') || '/';
    if (canonical !== path) {
      return new Response(null, {
        status: 301,
        headers: { Location: `https://www.olhaqueduas.com${canonical}${url.search}`, 'Cache-Control': 's-maxage=86400' },
      });
    }
  }

  if (!isSocialCrawler && !isSearchCrawler) return;

  // ========== FIXED ROUTES (one source with the pages: src/lib/routeMeta.ts) ==========
  if (ROUTE_META[path] && path !== '/galeria' && path !== '/programas') {
    const m = routeMeta(path);
    return html({ ...m, image: m.image ?? DEFAULT_IMAGE });
  }

  // ========== GALERIA ==========
  if (path === '/galeria') {
    let galleryImage = DEFAULT_IMAGE;
    try {
      const albums = await fetchSupabase('gallery_albums', 'is_published=eq.true&order=event_date.desc&limit=1');
      if (albums?.[0]) {
        galleryImage = albumCoverUrl(albums[0].slug);
      }
    } catch { /* fallback to default */ }
    return html({ ...routeMeta('/galeria'), image: galleryImage });
  }

  const galleryMatch = path.match(/^\/galeria\/([^/]+)$/);
  if (galleryMatch) {
    const slug = galleryMatch[1];
    if (!SLUG_REGEX.test(slug) || slug.length > 100) return;
    try {
      const albums = await fetchSupabase('gallery_albums', `slug=eq.${encodeURIComponent(slug)}&is_published=eq.true`);
      if (Array.isArray(albums) && albums.length === 0) return notFound(`https://www.olhaqueduas.com${path}`, '/galeria', 'Ver a Galeria');
      const album = Array.isArray(albums) ? albums[0] : undefined;
      if (!album) return;

      const image = albumCoverUrl(slug);

      const date = new Date(album.event_date).toLocaleDateString('pt-PT', {
        day: 'numeric', month: 'long', year: 'numeric',
      });

      // A descrição do álbum, quando existe, ganha sempre: é escrita para ser
      // lida. Sem ela, montamos uma a partir dos campos que há — e `location`
      // é opcional, por isso não pode entrar às cegas ou o crawler recebe a
      // palavra "null" no meio da frase.
      const parts = [album.title, album.location, date].filter(Boolean);

      return html({
        title: album.title,
        description: album.description || parts.join(' - '),
        image,
        url: `https://www.olhaqueduas.com/galeria/${slug}`,
      });
    } catch { return; }
  }

  if (path === '/programas') {
    let image = 'https://www.olhaqueduas.com/exclusivo/curtas-biografias-og.jpg';
    try {
      const rows = await fetchSupabase(
        'vinagre_posts',
        'select=og_image_url,cover_url&is_published=eq.true&order=published_at.desc.nullslast&limit=1',
      );
      const post = Array.isArray(rows) ? rows[0] : undefined;
      if (post) image = shareImage(post);
    } catch { /* fica a capa do programa */ }
    return html({ ...routeMeta('/programas'), image, imageWidth: 1200, imageHeight: 630, section: 'Programas' });
  }

  const postMatch = path.match(/^\/programas\/([^/]+)\/([^/]+)$/);
  if (postMatch) {
    const programSlug = postMatch[1];
    const postSlug = postMatch[2];
    if (!SLUG_REGEX.test(programSlug) || !SLUG_REGEX.test(postSlug) || postSlug.length > 140) return;
    try {
      const rows = await fetchSupabase(
        'vinagre_posts',
        `select=*,exclusive_programs!inner(slug,title,author)&slug=eq.${encodeURIComponent(postSlug)}&is_published=eq.true&exclusive_programs.slug=eq.${encodeURIComponent(programSlug)}`,
      );
      if (!Array.isArray(rows)) return;
      const post = rows[0];
      if (!post) {
        // The piece may have moved to another program (Rute Cardoso → Notícias): 301 there.
        const moved = await fetchSupabase(
          'vinagre_posts',
          `select=slug,exclusive_programs!inner(slug,is_published)&slug=eq.${encodeURIComponent(postSlug)}&is_published=eq.true&exclusive_programs.is_published=eq.true&or=(published_at.is.null,published_at.lte.${new Date().toISOString()})`,
        );
        const row = Array.isArray(moved) ? moved[0] : undefined;
        const embeddedOwner = row && row.exclusive_programs;
        const owner = Array.isArray(embeddedOwner) ? embeddedOwner[0] : embeddedOwner;
        if (owner && owner.slug && owner.slug !== programSlug) {
          return new Response(null, {
            status: 301,
            headers: {
              Location: `https://www.olhaqueduas.com/programas/${owner.slug}/${row.slug}`,
              'Cache-Control': 's-maxage=86400',
            },
          });
        }
        return notFound(`https://www.olhaqueduas.com${path}`);
      }
      const embedded = post.exclusive_programs;
      const program = Array.isArray(embedded) ? embedded[0] : embedded;
      const author = post.author
        ? String(post.author)
        : program && program.author ? String(program.author) : 'Olha que Duas';
      const section = program && program.title ? String(program.title) : 'Programas';
      const image = shareImage(post);
      const pageUrl = `https://www.olhaqueduas.com/programas/${programSlug}/${postSlug}`;
      const video = articleVideo(post);
      const description = String(post.seo_description || post.excerpt || post.title);
      const videoTag = !video
        ? ''
        : video.kind === 'youtube'
          ? `<iframe src="${escapeHtml(video.embedUrl)}" title="${escapeHtml(String(post.title))}" width="360" height="640" loading="lazy" allowfullscreen></iframe>`
          : `<video src="${escapeHtml(video.src)}"${video.poster ? ` poster="${escapeHtml(video.poster)}"` : ''} controls playsinline preload="none"></video>`;
      const programUrl = `https://www.olhaqueduas.com/programas/${programSlug}`;
      // Same JSON-LD as the SPA (src/lib/pieceJsonLd.ts).
      const ld: PieceLd = {
        title: String(post.title),
        seoTitle: post.seo_title ? String(post.seo_title) : undefined,
        description,
        image,
        publishedAt: post.published_at,
        updatedAt: post.updated_at,
        section,
        author: pieceAuthor(post.author && String(post.author), program && program.author && String(program.author)),
        pageUrl,
        programUrl,
      };
      const article = pieceArticleJsonLd(ld);
      const crumbs = `<nav aria-label="Caminho"><a href="https://www.olhaqueduas.com/">Início</a> › <a href="https://www.olhaqueduas.com/programas">Programas</a> › <a href="${escapeHtml(programUrl)}">${escapeHtml(section)}</a></nav>`;
      return html({
        title: String(post.title),
        seoTitle: post.seo_title ? String(post.seo_title) : undefined,
        description,
        image,
        imageAlt: String(post.title),
        imageWidth: 1200,
        imageHeight: 630,
        url: pageUrl,
        type: 'article',
        publishedTime: post.published_at || undefined,
        author,
        section,
        video,
        body: `${crumbs}<article><h1>${escapeHtml(String(post.title))}</h1>${videoTag}${stripScripts(String(post.content || ''))}</article>`,
        jsonLd: [
          article,
          ...(video ? [videoObjectJsonLd(video, { name: String(post.title), description, pageUrl, uploadDate: post.published_at, fallbackThumbnail: image })] : []),
          pieceBreadcrumbJsonLd(ld),
        ],
      });
    } catch { return; }
  }

  const programMatch = path.match(/^\/programas\/([^/]+)$/);
  if (programMatch) {
    const slug = programMatch[1];
    if (!SLUG_REGEX.test(slug) || slug.length > 140) return;
    try {
      const programs = await fetchSupabase(
        'exclusive_programs',
        `select=title,author,tagline,description,cover_url,event_id&slug=eq.${encodeURIComponent(slug)}&is_published=eq.true`,
      );
      const program = Array.isArray(programs) ? programs[0] : undefined;
      if (program) {
        let image = program.cover_url
          ? shareImage({ cover_url: program.cover_url })
          : 'https://www.olhaqueduas.com/exclusivo/curtas-biografias-og.jpg';
        // The program's own description; the latest post only lends its 1200×630 image.
        const description = String(program.description || program.tagline || program.title);
        try {
          const leads = await fetchSupabase(
            'vinagre_posts',
            `select=cover_url,og_image_url,exclusive_programs!inner(slug)&is_published=eq.true&exclusive_programs.slug=eq.${encodeURIComponent(slug)}&or=(published_at.is.null,published_at.lte.${new Date().toISOString()})&order=published_at.desc.nullslast&limit=1`,
          );
          // Listed with a live piece OR an active radio event (src/lib/programRadio.ts); else 404.
          if (Array.isArray(leads) && leads.length === 0) {
            const events = program.event_id
              ? await fetchSupabase('events', `select=${EVENT_SELECT}&id=eq.${encodeURIComponent(String(program.event_id))}`)
              : [];
            if (!eventKeepsProgram(Array.isArray(events) ? events[0] : undefined)) return notFound(`https://www.olhaqueduas.com${path}`);
          }
          const lead = Array.isArray(leads) ? leads[0] : undefined;
          if (lead) image = shareImage(lead);
        } catch { /* fica a capa do programa */ }
        return html({
          title: String(program.title).includes(String(program.author))
            ? String(program.title)
            : `${program.title} — ${program.author}`,
          description,
          image,
          imageAlt: String(program.title),
          imageWidth: 1200,
          imageHeight: 630,
          url: `https://www.olhaqueduas.com/programas/${slug}`,
          author: String(program.author),
          section: 'Programas',
        });
      }

      const legacy = await fetchSupabase(
        'vinagre_posts',
        `select=slug,exclusive_programs!inner(slug)&slug=eq.${encodeURIComponent(slug)}&is_published=eq.true`,
      );
      const oldPost = Array.isArray(legacy) ? legacy[0] : undefined;
      const embedded = oldPost && oldPost.exclusive_programs;
      const owner = Array.isArray(embedded) ? embedded[0] : embedded;
      if (oldPost && owner && owner.slug) {
        return new Response(null, {
          status: 301,
          headers: {
            Location: `https://www.olhaqueduas.com/programas/${owner.slug}/${oldPost.slug}`,
            'Cache-Control': 's-maxage=86400',
          },
        });
      }
      if (Array.isArray(programs) && Array.isArray(legacy)) return notFound(`https://www.olhaqueduas.com${path}`);
    } catch { return; }
  }

  const newsMatch = path.match(/^\/noticias\/([^/]+)$/);
  if (newsMatch) {
    const slug = newsMatch[1];
    // News slugs: 96 end in '-' (cut by the cron) and 3 are 106-107 chars long (21/11/2026).
    if (!NEWS_SLUG_REGEX.test(slug) || slug.length > 140) return;
    try {
      const posts = await fetchSupabase('blog_posts', `slug=eq.${encodeURIComponent(slug)}&is_published=eq.true`);
      if (Array.isArray(posts) && posts.length === 0) return notFound(`https://www.olhaqueduas.com${path}`, '/noticias', 'Ver as Notícias');
      const post = Array.isArray(posts) ? posts[0] : undefined;
      if (!post) return;

      const description = post.meta_description || post.summary || `${post.title} - Olha que Duas`;
      const image = post.image_url || DEFAULT_IMAGE;

      return html({
        title: post.title,
        description,
        image,
        url: `https://www.olhaqueduas.com/noticias/${slug}`,
        // Aggregated third-party news: out of the index, links still followed (Leo, 21/11/2026).
        robots: 'noindex, follow',
      });
    } catch { return; }
  }

  return;
}

// ===== HISTÓRIAS EM STANDBY TEMPORÁRIO — descomentar para reactivar =====
// // ============================================================
// // Histórias em episódios
// // ============================================================

// const STORIES_LIST_META = {
  // title: 'Histórias',
  // description: 'Histórias em episódios para ler de uma sentada. Ficção original do Olha que Duas, publicada por capítulos — comece pelo primeiro e siga até ao fim.',
  // image: DEFAULT_IMAGE,
  // url: 'https://www.olhaqueduas.com/historias',
// };

// const liveFilter = () => `or=(published_at.is.null,published_at.lte.${new Date().toISOString()})`;

// async function handleStories(path: string, withBody: boolean): Promise<Response | undefined> {
  // if (path === '/historias') {
    // if (!withBody) return html(STORIES_LIST_META);

    // try {
      // const stories = await fetchSupabase('stories', `is_published=eq.true&${liveFilter()}&order=published_at.desc`);
      // const items = (stories || []).map((s: Record<string, string>) =>
        // `<li><h2><a href="https://www.olhaqueduas.com/historias/${escapeHtml(s.slug)}">${escapeHtml(s.title)}</a></h2><p>${escapeHtml(s.tagline || '')}</p></li>`
      // ).join('');
      // return html({ ...STORIES_LIST_META, body: `<h1>Histórias</h1><ul>${items}</ul>` });
    // } catch {
      // return html(STORIES_LIST_META);
    // }
  // }

  // const episodeMatch = path.match(/^\/historias\/([^/]+)\/(\d{1,4})$/);
  // const storyMatch = path.match(/^\/historias\/([^/]+)$/);

  // const slug = episodeMatch?.[1] || storyMatch?.[1];
  // if (!slug || !SLUG_REGEX.test(slug) || slug.length > 100) return;

  // try {
    // const [story] = await fetchSupabase(
      // 'stories',
      // `slug=eq.${encodeURIComponent(slug)}&is_published=eq.true&${liveFilter()}`
    // );
    // if (!story) return;

    // const storyUrl = `https://www.olhaqueduas.com/historias/${slug}`;

    // // ----- Página da história -----
    // if (storyMatch) {
      // const meta = {
        // title: story.title,
        // description: story.tagline || (story.synopsis || '').slice(0, 200) || `${story.title} — uma história em episódios.`,
        // image: story.cover_url || DEFAULT_IMAGE,
        // url: storyUrl,
      // };
      // if (!withBody) return html(meta);

      // const episodes = await fetchSupabase(
        // 'story_episodes',
        // `story_id=eq.${story.id}&is_published=eq.true&${liveFilter()}&order=number.asc&select=number,title,excerpt`
      // );
      // const items = (episodes || []).map((e: Record<string, string>) =>
        // `<li><a href="${storyUrl}/${e.number}">Episódio ${e.number}: ${escapeHtml(e.title)}</a> — ${escapeHtml(e.excerpt || '')}</li>`
      // ).join('');

      // return html({
        // ...meta,
        // body: `<article><h1>${escapeHtml(story.title)}</h1><p>${escapeHtml(story.tagline || '')}</p><div>${escapeHtml(story.synopsis || '')}</div><h2>Episódios</h2><ol>${items}</ol></article>`,
      // });
    // }

    // // ----- Página do episódio -----
    // const number = Number(episodeMatch![2]);
    // const [episode] = await fetchSupabase(
      // 'story_episodes',
      // `story_id=eq.${story.id}&number=eq.${number}&is_published=eq.true&${liveFilter()}`
    // );
    // if (!episode) return;

    // const meta = {
      // title: `${story.title} — Episódio ${episode.number}`,
      // description: episode.excerpt || episode.cliffhanger || `Episódio ${number} de ${story.title}.`,
      // image: episode.cover_url || story.cover_url || DEFAULT_IMAGE,
      // url: `${storyUrl}/${number}`,
      // type: 'article' as const,
      // publishedTime: episode.published_at || undefined,
    // };
    // if (!withBody) return html(meta);

    // return html({
      // ...meta,
      // body: `<article>
        // <h1>${escapeHtml(episode.title)}</h1>
        // <p>${escapeHtml(story.title)} — Episódio ${episode.number}</p>
        // ${stripScripts(episode.content || '')}
        // ${episode.cliffhanger ? `<p>${escapeHtml(episode.cliffhanger)}</p>` : ''}
        // <p><a href="${storyUrl}">Todos os episódios de ${escapeHtml(story.title)}</a></p>
      // </article>`,
    // });
  // } catch {
    // return;
  // }
// }
