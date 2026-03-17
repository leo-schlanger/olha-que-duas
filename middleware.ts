import type { RequestContext } from '@vercel/edge';

export const config = {
  matcher: '/noticias/:slug*',
};

// Lista de User-Agents de crawlers de redes sociais
const BOT_USER_AGENTS = [
  'facebookexternalhit',
  'Facebot',
  'LinkedInBot',
  'Twitterbot',
  'WhatsApp',
  'Slackbot',
  'TelegramBot',
  'Discordbot',
  'Pinterest',
];

function isCrawler(userAgent: string | null): boolean {
  if (!userAgent) return false;
  return BOT_USER_AGENTS.some((bot) =>
    userAgent.toLowerCase().includes(bot.toLowerCase())
  );
}

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

interface BlogPost {
  title: string;
  summary: string | null;
  meta_description: string | null;
  image_url: string | null;
  slug: string;
  published_at: string | null;
  category: string;
}

async function fetchBlogPost(slug: string): Promise<BlogPost | null> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return null;
  }

  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/blog_posts?slug=eq.${encodeURIComponent(slug)}&select=title,summary,meta_description,image_url,slug,published_at,category&limit=1`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
      }
    );

    if (!response.ok) return null;
    const posts = await response.json();
    return posts[0] || null;
  } catch {
    return null;
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function generateHTML(post: BlogPost | null, slug: string, originalUrl: string): string {
  const baseUrl = 'https://www.olhaqueduas.com';
  const defaultImage = `${baseUrl}/og-image.png`;
  const defaultTitle = 'Olha que Duas | Comunicação e Podcast em Portugal';
  const defaultDescription = 'Somos comunicadoras com propósito. Podcast, Assessoria e Estratégia de Marca em Portugal.';

  const title = escapeHtml(post?.title || defaultTitle);
  const description = escapeHtml(post?.meta_description || post?.summary || defaultDescription);
  const image = post?.image_url || defaultImage;
  const url = post ? `${baseUrl}/noticias/${slug}` : baseUrl;
  const type = post ? 'article' : 'website';

  return `<!DOCTYPE html>
<html lang="pt">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} | Olha que Duas</title>
  <meta name="description" content="${description}">
  <link rel="canonical" href="${url}">

  <!-- Open Graph -->
  <meta property="og:type" content="${type}">
  <meta property="og:url" content="${url}">
  <meta property="og:site_name" content="Olha que Duas">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="${image}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:url" content="${url}">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${image}">

  ${post?.published_at ? `<meta property="article:published_time" content="${post.published_at}">` : ''}
  ${post?.category ? `<meta property="article:section" content="${post.category}">` : ''}
  <meta property="article:author" content="Olha que Duas">

  <meta http-equiv="refresh" content="0;url=${originalUrl}">
</head>
<body>
  <p>Redirecionando...</p>
  <script>window.location.href = "${originalUrl}";</script>
</body>
</html>`;
}

export default async function middleware(request: Request, context: RequestContext) {
  const userAgent = request.headers.get('user-agent');
  const url = new URL(request.url);
  const pathname = url.pathname;

  // Extrai o slug da URL /noticias/slug
  const slugMatch = pathname.match(/^\/noticias\/([^/]+)\/?$/);

  if (slugMatch && isCrawler(userAgent)) {
    const slug = slugMatch[1];
    const post = await fetchBlogPost(slug);
    const html = generateHTML(post, slug, request.url);

    return new Response(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400',
      },
    });
  }

  // Para usuários normais, continua para a SPA
  return context.next();
}
