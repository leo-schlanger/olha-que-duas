import { articleHeadline, documentTitle, metaDescription } from './src/lib/seo';
export const config = {
  matcher: ['/viagens', '/servicos', '/loja', '/galeria', '/galeria/:path*', '/noticias', '/noticias/:path*', '/exclusivo', '/exclusivo/:path*', '/kids', '/auditoria-gratuita', '/rockinrio'],
};

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || '';
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

function html(meta: Meta): Response {
  const title = escapeHtml(meta.title);
  const docTitle = escapeHtml(documentTitle(meta.seoTitle || meta.title));
  const description = escapeHtml(metaDescription(meta.description));
  const image = escapeHtml(meta.image);
  const url = escapeHtml(meta.url);
  const type = meta.type || 'website';

  return new Response(`<!DOCTYPE html><html lang="pt-PT"><head>
    <meta charset="utf-8">
    <title>${docTitle}</title>
    <meta name="description" content="${description}">
    <link rel="canonical" href="${url}">
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
}

// Exclusivo slug that does not exist: a real 404 for crawlers instead of the
// SPA's 200 (soft 404).
function notFound(url: string): Response {
  return new Response(`<!DOCTYPE html><html lang="pt-PT"><head>
    <meta charset="utf-8">
    <title>Página não encontrada | Olha que Duas</title>
    <meta name="robots" content="noindex, nofollow">
    <link rel="canonical" href="${escapeHtml(url)}">
  </head><body><h1>Página não encontrada</h1><p><a href="https://www.olhaqueduas.com/exclusivo">Ver os programas dos Especiais</a></p></body></html>`, {
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
  const ua = (request.headers.get('user-agent') || '').toLowerCase();
  const isSocialCrawler = CRAWLERS.some(c => ua.includes(c.toLowerCase()));
  const isSearchCrawler = SEARCH_CRAWLERS.some(c => ua.includes(c));

  const url = new URL(request.url);
  const path = url.pathname;

  // Eduardo Vinagre left on 2026-10-24: his program's pieces now live in Notícias.
  // vercel.json redirects too; this covers crawlers if middleware runs first.
  const oldProgram = path.match(/^\/exclusivo\/olha-que-duas-e-eu(\/[^/]+)?\/?$/);
  if (oldProgram) {
    return new Response(null, {
      status: 301,
      headers: {
        Location: `https://www.olhaqueduas.com/exclusivo/noticias-olha-que-duas${oldProgram[1] ?? ''}`,
        'Cache-Control': 's-maxage=86400',
      },
    });
  }

  // // ========== HISTÓRIAS ==========
  // // Único sítio onde os motores de busca recebem HTML pré-renderizado: o
  // // site é uma SPA e o Googlebot só executa JS dias depois, o que atrasaria
  // // a indexação de conteúdo cujo valor todo está em ser encontrado. O texto
  // // servido é o mesmo que o leitor vê — dynamic rendering, não cloaking.
  // if (path === '/historias' || path.startsWith('/historias/')) {
    // if (!isSocialCrawler && !isSearchCrawler) return;
    // return handleStories(path, isSearchCrawler);
  // }

  // One canonical form for every visitor: /Exclusivo/Mente-Aberta/ -> /exclusivo/mente-aberta.
  if (/^\/exclusivo/i.test(path)) {
    const canonical = path.toLowerCase().replace(/\/+$/, '') || '/';
    if (canonical !== path) {
      return new Response(null, {
        status: 301,
        headers: { Location: `https://www.olhaqueduas.com${canonical}${url.search}`, 'Cache-Control': 's-maxage=86400' },
      });
    }
  }

  if (!isSocialCrawler && !(isSearchCrawler && path.startsWith('/exclusivo'))) return;

  // ========== VIAGENS ==========
  if (path === '/viagens') {
    return html({
      title: 'Olha que Duas Trip — Viagens Personalizadas & Experiências Exclusivas',
      description: 'Descubra o mundo com a Olha que Duas Trip! Planeamento de viagens à medida, estadias em hotéis de charme, passagens aéreas com as melhores tarifas e experiências gourmet inesquecíveis. Peça já o seu orçamento gratuito e viaje sem preocupações.',
      image: 'https://www.olhaqueduas.com/og-viagens.jpg',
      url: 'https://www.olhaqueduas.com/viagens',
    });
  }

  // ========== KIDS ==========
  if (path === '/kids') {
    return html({
      title: 'Olha que Duas Kids | Espaço Infantil de Rádio, Música e Histórias',
      description: 'O espaço Kids do Olha que Duas já está no ar! Um espaço exclusivo para crianças, com música, histórias, brincadeiras e o programa "O Cantinho da Pequenada com a Leonor". Conteúdo seguro e educativo para toda a família.',
      image: 'https://www.olhaqueduas.com/og-kids.jpg',
      url: 'https://www.olhaqueduas.com/kids',
    });
  }

  // ========== AUDITORIA GRATUITA ==========
  if (path === '/auditoria-gratuita') {
    return html({
      title: 'Auditoria Gratuita de Comunicação',
      description: 'Descubra em 15 minutos o que está a travar o crescimento da sua marca — e como resolvê-lo. Análise gratuita de presença digital, redes sociais e estratégia de comunicação. Sem compromisso.',
      image: 'https://www.olhaqueduas.com/og-auditoria.jpg',
      url: 'https://www.olhaqueduas.com/auditoria-gratuita',
    });
  }

  // ========== ROCK IN RIO ==========
  if (path === '/rockinrio') {
    return html({
      title: 'Rock in Rio Lisboa 2026 — Parceiro Oficial',
      description: 'A Olha que Duas é parceira oficial do Rock in Rio Lisboa 2026. Lineup completo dia a dia: Katy Perry, Linkin Park, Rod Stewart, 21 Savage, Bárbara Bandeira, Jimmy P e +60 artistas em 4 palcos. Mapa, transportes e bilhetes. 20, 21, 27 e 28 de Junho.',
      image: 'https://www.olhaqueduas.com/og-rockinrio.jpg',
      url: 'https://www.olhaqueduas.com/rockinrio',
    });
  }

  // ========== SERVIÇOS ==========
  if (path === '/servicos') {
    return html({
      title: 'Serviços de Comunicação e Marketing Digital',
      description: 'Serviços completos de comunicação e marketing digital: gestão de redes sociais, produção de vídeo, consultoria de marca, rádio online 24h, podcast e criação de websites. Peça o seu orçamento.',
      image: DEFAULT_IMAGE,
      url: 'https://www.olhaqueduas.com/servicos',
    });
  }

  // ========== LOJA ==========
  if (path === '/loja') {
    return html({
      title: 'Loja Olha que Duas',
      description: 'Descubra os produtos exclusivos do Olha que Duas. Merchandising, acessórios e muito mais com a nossa marca.',
      image: DEFAULT_IMAGE,
      url: 'https://www.olhaqueduas.com/loja',
    });
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
    return html({
      title: 'Galeria de Fotos',
      description: 'Explore a galeria de fotos de entrevistas, eventos e bastidores do Olha que Duas.',
      image: galleryImage,
      url: 'https://www.olhaqueduas.com/galeria',
    });
  }

  const galleryMatch = path.match(/^\/galeria\/([^/]+)$/);
  if (galleryMatch) {
    const slug = galleryMatch[1];
    if (!SLUG_REGEX.test(slug) || slug.length > 100) return;
    try {
      const [album] = await fetchSupabase('gallery_albums', `slug=eq.${encodeURIComponent(slug)}&is_published=eq.true`);
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

  // ========== NOTÍCIAS ==========
  if (path === '/noticias') {
    return html({
      title: 'Notícias',
      description: 'Acompanhe as principais notícias de política, empreendedorismo e acontecimentos em Portugal, Brasil e no mundo.',
      image: DEFAULT_IMAGE,
      url: 'https://www.olhaqueduas.com/noticias',
    });
  }

  if (path === '/exclusivo') {
    const description = 'Os programas especiais do Olha que Duas: notícias, biografias, opinião e reflexão, com Alexandra Serra, Marluce Revorêdo e a redação.';
    let image = 'https://www.olhaqueduas.com/exclusivo/curtas-biografias-og.jpg';
    try {
      const rows = await fetchSupabase(
        'vinagre_posts',
        'select=og_image_url,cover_url&is_published=eq.true&order=published_at.desc.nullslast&limit=1',
      );
      const post = Array.isArray(rows) ? rows[0] : undefined;
      if (post) image = shareImage(post);
    } catch { /* fica a capa do programa */ }
    return html({
      title: 'Especiais Olha que Duas',
      description,
      image,
      imageAlt: 'Especiais Olha que Duas',
      imageWidth: 1200,
      imageHeight: 630,
      url: 'https://www.olhaqueduas.com/exclusivo',
      section: 'Especiais Olha que Duas',
    });
  }

  const postMatch = path.match(/^\/exclusivo\/([^/]+)\/([^/]+)$/);
  if (postMatch) {
    const programSlug = postMatch[1];
    const postSlug = postMatch[2];
    if (!SLUG_REGEX.test(programSlug) || !SLUG_REGEX.test(postSlug) || postSlug.length > 140) return;
    try {
      const rows = await fetchSupabase(
        'vinagre_posts',
        `select=title,author,seo_title,seo_description,excerpt,content,cover_url,og_image_url,published_at,updated_at,exclusive_programs!inner(slug,title,author)&slug=eq.${encodeURIComponent(postSlug)}&is_published=eq.true&exclusive_programs.slug=eq.${encodeURIComponent(programSlug)}`,
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
              Location: `https://www.olhaqueduas.com/exclusivo/${owner.slug}/${row.slug}`,
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
      const section = program && program.title ? String(program.title) : 'Especiais Olha que Duas';
      const image = shareImage(post);
      const pageUrl = `https://www.olhaqueduas.com/exclusivo/${programSlug}/${postSlug}`;
      return html({
        title: String(post.title),
        seoTitle: post.seo_title ? String(post.seo_title) : undefined,
        description: String(post.seo_description || post.excerpt || post.title),
        image,
        imageAlt: String(post.title),
        imageWidth: 1200,
        imageHeight: 630,
        url: pageUrl,
        type: 'article',
        publishedTime: post.published_at || undefined,
        author,
        section,
        body: `<article><h1>${escapeHtml(String(post.title))}</h1>${stripScripts(String(post.content || ''))}</article>`,
        jsonLd: {
          '@context': 'https://schema.org',
          '@type': 'NewsArticle',
          headline: articleHeadline(String(post.title), post.seo_title),
          description: post.seo_description || post.excerpt || post.title,
          image: [image],
          datePublished: post.published_at || undefined,
          dateModified: post.updated_at || post.published_at || undefined,
          inLanguage: 'pt-PT',
          articleSection: section,
          author: author === 'Olha que Duas'
            ? { '@type': 'Organization', name: author, url: 'https://www.olhaqueduas.com' }
            : { '@type': 'Person', name: author },
          publisher: {
            '@type': 'Organization',
            name: 'Olha que Duas',
            logo: { '@type': 'ImageObject', url: 'https://www.olhaqueduas.com/og-image.jpg' },
          },
          mainEntityOfPage: pageUrl,
        },
      });
    } catch { return; }
  }

  const exclusivoMatch = path.match(/^\/exclusivo\/([^/]+)$/);
  if (exclusivoMatch) {
    const slug = exclusivoMatch[1];
    if (!SLUG_REGEX.test(slug) || slug.length > 140) return;
    try {
      const programs = await fetchSupabase(
        'exclusive_programs',
        `select=title,author,tagline,description,cover_url&slug=eq.${encodeURIComponent(slug)}&is_published=eq.true`,
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
            `select=cover_url,og_image_url,exclusive_programs!inner(slug)&is_published=eq.true&exclusive_programs.slug=eq.${encodeURIComponent(slug)}&order=published_at.desc.nullslast&limit=1`,
          );
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
          url: `https://www.olhaqueduas.com/exclusivo/${slug}`,
          author: String(program.author),
          section: 'Especiais Olha que Duas',
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
            Location: `https://www.olhaqueduas.com/exclusivo/${owner.slug}/${oldPost.slug}`,
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
    if (!SLUG_REGEX.test(slug) || slug.length > 100) return;
    try {
      const [post] = await fetchSupabase('blog_posts', `slug=eq.${encodeURIComponent(slug)}&is_published=eq.true`);
      if (!post) return;

      const description = post.meta_description || post.summary || `${post.title} - Olha que Duas`;
      const image = post.image_url || DEFAULT_IMAGE;

      return html({
        title: post.title,
        description,
        image,
        url: `https://www.olhaqueduas.com/noticias/${slug}`,
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
