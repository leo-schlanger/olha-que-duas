import type { VercelRequest, VercelResponse } from '@vercel/node';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

interface BlogPost {
  slug: string;
  updated_at: string;
}

async function fetchBlogPosts(): Promise<BlogPost[]> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return [];
  }

  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/blog_posts?is_published=eq.true&select=slug,updated_at&order=updated_at.desc&limit=1000`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
      }
    );

    if (!response.ok) {
      return [];
    }

    return await response.json();
  } catch {
    return [];
  }
}

function formatDate(date: string): string {
  return new Date(date).toISOString().split('T')[0];
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const baseUrl = 'https://www.olhaqueduas.com';
  const posts = await fetchBlogPosts();

  const staticPages = [
    { url: '/', priority: '1.0', changefreq: 'daily' },
    { url: '/noticias', priority: '0.9', changefreq: 'hourly' },
    { url: '/loja', priority: '0.8', changefreq: 'weekly' },
    { url: '/privacidade', priority: '0.3', changefreq: 'monthly' },
    { url: '/termos', priority: '0.3', changefreq: 'monthly' },
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
  ${staticPages
    .map(
      (page) => `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
    )
    .join('')}
  ${posts
    .map(
      (post) => `
  <url>
    <loc>${baseUrl}/noticias/${post.slug}</loc>
    <lastmod>${formatDate(post.updated_at)}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`
    )
    .join('')}
</urlset>`;

  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
  return res.status(200).send(sitemap);
}
