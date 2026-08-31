import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Sitemap das histórias e episódios.
 *
 * Vai à base de dados a cada pedido (com cache de uma hora no edge) porque
 * o sitemap estático teria de ser reescrito a cada episódio publicado — e
 * um episódio agendado entra sozinho, sem deploy.
 */

const SITE = 'https://www.olhaqueduas.com';
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || '';

interface StoryRow {
  slug: string;
  updated_at: string;
}

interface EpisodeRow {
  number: number;
  updated_at: string;
  stories: { slug: string } | null;
}

async function query<T>(table: string, params: string): Promise<T[]> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${params}`, {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
  });
  if (!res.ok) return [];
  return (await res.json()) as T[];
}

function urlEntry(loc: string, lastmod: string, priority: string): string {
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod.slice(0, 10)}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  const live = `or=(published_at.is.null,published_at.lte.${new Date().toISOString()})`;

  try {
    const [stories, episodes] = await Promise.all([
      query<StoryRow>(
        'stories',
        `is_published=eq.true&${live}&select=slug,updated_at&order=updated_at.desc`
      ),
      query<EpisodeRow>(
        'story_episodes',
        `is_published=eq.true&${live}&select=number,updated_at,stories(slug)&order=updated_at.desc`
      ),
    ]);

    const today = new Date().toISOString();

    const entries = [
      urlEntry(`${SITE}/historias`, today, '0.9'),
      ...stories.map((s) =>
        urlEntry(`${SITE}/historias/${s.slug}`, s.updated_at, '0.8')
      ),
      ...episodes
        .filter((e) => e.stories?.slug)
        .map((e) =>
          urlEntry(
            `${SITE}/historias/${e.stories!.slug}/${e.number}`,
            e.updated_at,
            '0.7'
          )
        ),
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</urlset>`;

    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=600');
    return res.status(200).send(xml);
  } catch {
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    return res
      .status(200)
      .send(
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlEntry(
          `${SITE}/historias`,
          new Date().toISOString(),
          '0.9'
        )}\n</urlset>`
      );
  }
}
