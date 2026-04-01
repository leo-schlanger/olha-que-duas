export const config = {
  matcher: ['/galeria', '/galeria/:path*'],
};

const SUPABASE_URL = 'https://jjifjbdfpvgeseqbjpkg.supabase.co';
const SUPABASE_ANON_KEY = '***SUPABASE_ANON_KEY_REMOVED***';

const CRAWLERS = ['facebookexternalhit', 'Facebot', 'Twitterbot', 'WhatsApp', 'LinkedInBot', 'Slackbot', 'TelegramBot', 'Discordbot'];

export default async function middleware(request: Request): Promise<Response | undefined> {
  const ua = request.headers.get('user-agent') || '';
  const isCrawler = CRAWLERS.some(c => ua.toLowerCase().includes(c.toLowerCase()));

  if (!isCrawler) return;

  const url = new URL(request.url);
  const match = url.pathname.match(/^\/galeria\/([^/]+)$/);

  if (url.pathname === '/galeria') {
    return new Response(`<!DOCTYPE html><html><head>
      <title>Galeria de Fotos | Olha que Duas</title>
      <meta property="og:title" content="Galeria de Fotos">
      <meta property="og:description" content="Explore a galeria de fotos do Olha que Duas.">
      <meta property="og:image" content="https://www.olhaqueduas.com/og-image.jpg">
      <meta property="og:url" content="https://www.olhaqueduas.com/galeria">
      <meta property="og:type" content="website">
      <meta name="twitter:card" content="summary_large_image">
    </head><body></body></html>`, {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  }

  if (!match) return;
  const slug = match[1];

  try {
    const albumRes = await fetch(
      `${SUPABASE_URL}/rest/v1/gallery_albums?slug=eq.${slug}&is_published=eq.true`,
      { headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` } }
    );
    const [album] = await albumRes.json();
    if (!album) return;

    const photoRes = await fetch(
      `${SUPABASE_URL}/rest/v1/gallery_photos?album_id=eq.${album.id}&is_cover=eq.true`,
      { headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` } }
    );
    const [photo] = await photoRes.json();

    const image = photo
      ? `https://res.cloudinary.com/dfljesvj7/image/upload/w_1200,h_630,c_fill,g_auto,q_auto,f_auto/${photo.cloudinary_public_id}`
      : 'https://www.olhaqueduas.com/og-image.jpg';

    const date = new Date(album.event_date).toLocaleDateString('pt-PT', {
      day: 'numeric', month: 'long', year: 'numeric'
    });

    return new Response(`<!DOCTYPE html><html><head>
      <title>${album.title} | Olha que Duas</title>
      <meta property="og:title" content="${album.title}">
      <meta property="og:description" content="${album.title} - ${album.location} - ${date}">
      <meta property="og:image" content="${image}">
      <meta property="og:image:width" content="1200">
      <meta property="og:image:height" content="630">
      <meta property="og:url" content="https://www.olhaqueduas.com/galeria/${slug}">
      <meta property="og:type" content="website">
      <meta property="og:site_name" content="Olha que Duas">
      <meta name="twitter:card" content="summary_large_image">
      <meta name="twitter:image" content="${image}">
    </head><body></body></html>`, {
      headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 's-maxage=3600' },
    });
  } catch {
    return;
  }
}
