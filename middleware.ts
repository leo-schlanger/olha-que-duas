export const config = {
  matcher: ['/viagens', '/servicos', '/loja', '/galeria', '/galeria/:path*', '/noticias', '/noticias/:path*', '/historias', '/historias/:path*', '/kids', '/auditoria-gratuita', '/rockinrio'],
};

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || '';

const CRAWLERS = ['facebookexternalhit', 'Facebot', 'Twitterbot', 'WhatsApp', 'LinkedInBot', 'Slackbot', 'TelegramBot', 'Discordbot'];

// Motores de busca. Só recebem tratamento especial em /historias/*, onde o
// conteúdo é o produto e a indexação não pode esperar pelo render de JS.
const SEARCH_CRAWLERS = ['Googlebot', 'Google-InspectionTool', 'Bingbot', 'DuckDuckBot', 'Applebot', 'YandexBot'];

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Remove o que nunca deve chegar a um crawler vindo da base de dados. */
function stripScripts(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '');
}

const SLUG_REGEX = /^[a-z0-9][a-z0-9-]*[a-z0-9]$/;

const DEFAULT_IMAGE = 'https://www.olhaqueduas.com/og-image.jpg';

interface Meta {
  title: string;
  description: string;
  image: string;
  url: string;
  /** Corpo já em HTML. Só usado nas histórias, para os motores de busca. */
  body?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
}

function html(meta: Meta): Response {
  const title = escapeHtml(meta.title);
  const description = escapeHtml(meta.description);
  const image = escapeHtml(meta.image);
  const url = escapeHtml(meta.url);
  const type = meta.type || 'website';

  return new Response(`<!DOCTYPE html><html lang="pt-PT"><head>
    <meta charset="utf-8">
    <title>${title} | Olha que Duas</title>
    <meta name="description" content="${description}">
    <link rel="canonical" href="${url}">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:image" content="${image}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:url" content="${url}">
    <meta property="og:type" content="${type}">
    <meta property="og:site_name" content="Olha que Duas">
    <meta property="og:locale" content="pt_PT">
    ${meta.publishedTime ? `<meta property="article:published_time" content="${escapeHtml(meta.publishedTime)}">` : ''}
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${title}">
    <meta name="twitter:description" content="${description}">
    <meta name="twitter:image" content="${image}">
  </head><body>${meta.body || ''}</body></html>`, {
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 's-maxage=3600' },
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
  const isSearchCrawler = SEARCH_CRAWLERS.some(c => ua.includes(c.toLowerCase()));

  const url = new URL(request.url);
  const path = url.pathname;

  // ========== HISTÓRIAS ==========
  // Único sítio onde os motores de busca recebem HTML pré-renderizado: o
  // site é uma SPA e o Googlebot só executa JS dias depois, o que atrasaria
  // a indexação de conteúdo cujo valor todo está em ser encontrado. O texto
  // servido é o mesmo que o leitor vê — dynamic rendering, não cloaking.
  if (path === '/historias' || path.startsWith('/historias/')) {
    if (!isSocialCrawler && !isSearchCrawler) return;
    return handleStories(path, isSearchCrawler);
  }

  if (!isSocialCrawler) return;

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
        galleryImage = `https://res.cloudinary.com/dfljesvj7/image/upload/w_1200,h_630,c_fill,g_auto,q_auto,f_auto/olhaqueduas/galeria/${albums[0].slug}/01`;
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

      const image = `https://res.cloudinary.com/dfljesvj7/image/upload/w_1200,h_630,c_fill,g_auto,q_auto,f_auto/olhaqueduas/galeria/${slug}/01`;

      const date = new Date(album.event_date).toLocaleDateString('pt-PT', {
        day: 'numeric', month: 'long', year: 'numeric',
      });

      return html({
        title: album.title,
        description: `${album.title} - ${album.location} - ${date}`,
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

// ============================================================
// Histórias em episódios
// ============================================================

const STORIES_LIST_META = {
  title: 'Histórias',
  description: 'Histórias em episódios para ler de uma sentada. Ficção original do Olha que Duas, publicada por capítulos — comece pelo primeiro e siga até ao fim.',
  image: DEFAULT_IMAGE,
  url: 'https://www.olhaqueduas.com/historias',
};

const liveFilter = () => `or=(published_at.is.null,published_at.lte.${new Date().toISOString()})`;

async function handleStories(path: string, withBody: boolean): Promise<Response | undefined> {
  if (path === '/historias') {
    if (!withBody) return html(STORIES_LIST_META);

    try {
      const stories = await fetchSupabase('stories', `is_published=eq.true&${liveFilter()}&order=published_at.desc`);
      const items = (stories || []).map((s: Record<string, string>) =>
        `<li><h2><a href="https://www.olhaqueduas.com/historias/${escapeHtml(s.slug)}">${escapeHtml(s.title)}</a></h2><p>${escapeHtml(s.tagline || '')}</p></li>`
      ).join('');
      return html({ ...STORIES_LIST_META, body: `<h1>Histórias</h1><ul>${items}</ul>` });
    } catch {
      return html(STORIES_LIST_META);
    }
  }

  const episodeMatch = path.match(/^\/historias\/([^/]+)\/(\d{1,4})$/);
  const storyMatch = path.match(/^\/historias\/([^/]+)$/);

  const slug = episodeMatch?.[1] || storyMatch?.[1];
  if (!slug || !SLUG_REGEX.test(slug) || slug.length > 100) return;

  try {
    const [story] = await fetchSupabase(
      'stories',
      `slug=eq.${encodeURIComponent(slug)}&is_published=eq.true&${liveFilter()}`
    );
    if (!story) return;

    const storyUrl = `https://www.olhaqueduas.com/historias/${slug}`;

    // ----- Página da história -----
    if (storyMatch) {
      const meta = {
        title: story.title,
        description: story.tagline || (story.synopsis || '').slice(0, 200) || `${story.title} — uma história em episódios.`,
        image: story.cover_url || DEFAULT_IMAGE,
        url: storyUrl,
      };
      if (!withBody) return html(meta);

      const episodes = await fetchSupabase(
        'story_episodes',
        `story_id=eq.${story.id}&is_published=eq.true&${liveFilter()}&order=number.asc&select=number,title,excerpt`
      );
      const items = (episodes || []).map((e: Record<string, string>) =>
        `<li><a href="${storyUrl}/${e.number}">Episódio ${e.number}: ${escapeHtml(e.title)}</a> — ${escapeHtml(e.excerpt || '')}</li>`
      ).join('');

      return html({
        ...meta,
        body: `<article><h1>${escapeHtml(story.title)}</h1><p>${escapeHtml(story.tagline || '')}</p><div>${escapeHtml(story.synopsis || '')}</div><h2>Episódios</h2><ol>${items}</ol></article>`,
      });
    }

    // ----- Página do episódio -----
    const number = Number(episodeMatch![2]);
    const [episode] = await fetchSupabase(
      'story_episodes',
      `story_id=eq.${story.id}&number=eq.${number}&is_published=eq.true&${liveFilter()}`
    );
    if (!episode) return;

    const meta = {
      title: `${story.title} — Episódio ${episode.number}`,
      description: episode.excerpt || episode.cliffhanger || `Episódio ${number} de ${story.title}.`,
      image: episode.cover_url || story.cover_url || DEFAULT_IMAGE,
      url: `${storyUrl}/${number}`,
      type: 'article' as const,
      publishedTime: episode.published_at || undefined,
    };
    if (!withBody) return html(meta);

    return html({
      ...meta,
      body: `<article>
        <h1>${escapeHtml(episode.title)}</h1>
        <p>${escapeHtml(story.title)} — Episódio ${episode.number}</p>
        ${stripScripts(episode.content || '')}
        ${episode.cliffhanger ? `<p>${escapeHtml(episode.cliffhanger)}</p>` : ''}
        <p><a href="${storyUrl}">Todos os episódios de ${escapeHtml(story.title)}</a></p>
      </article>`,
    });
  } catch {
    return;
  }
}
