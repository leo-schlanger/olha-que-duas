export const config = {
  matcher: ['/viagens', '/servicos', '/loja', '/galeria', '/galeria/:path*', '/noticias', '/noticias/:path*', '/kids'],
};

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || '';

const CRAWLERS = ['facebookexternalhit', 'Facebot', 'Twitterbot', 'WhatsApp', 'LinkedInBot', 'Slackbot', 'TelegramBot', 'Discordbot'];

const SLUG_REGEX = /^[a-z0-9][a-z0-9\-]*[a-z0-9]$/;

const DEFAULT_IMAGE = 'https://www.olhaqueduas.com/og-image.jpg';

function html(meta: { title: string; description: string; image: string; url: string }): Response {
  return new Response(`<!DOCTYPE html><html><head>
    <title>${meta.title} | Olha que Duas</title>
    <meta property="og:title" content="${meta.title}">
    <meta property="og:description" content="${meta.description}">
    <meta property="og:image" content="${meta.image}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:url" content="${meta.url}">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="Olha que Duas">
    <meta property="og:locale" content="pt_PT">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${meta.title}">
    <meta name="twitter:description" content="${meta.description}">
    <meta name="twitter:image" content="${meta.image}">
  </head><body></body></html>`, {
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
  const ua = request.headers.get('user-agent') || '';
  const isCrawler = CRAWLERS.some(c => ua.toLowerCase().includes(c.toLowerCase()));
  if (!isCrawler) return;

  const url = new URL(request.url);
  const path = url.pathname;

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
      title: 'Olha que Duas Kids — Em Breve | Espaço Infantil de Rádio, Música e Histórias',
      description: 'Em breve no Olha que Duas: um espaço Kids exclusivo para crianças, com música, histórias, brincadeiras e o novo programa "O Cantinho da Pequenada com a Leonor". Conteúdo seguro e educativo para toda a família.',
      image: 'https://www.olhaqueduas.com/og-kids.jpg',
      url: 'https://www.olhaqueduas.com/kids',
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
