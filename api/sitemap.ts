import type { VercelRequest, VercelResponse } from '@vercel/node';

// Same rule as src/lib/programRadio.ts (eventKeepsProgram), inlined: Vercel functions can't
// import extension-less ESM from src/ (the import crashed the function, 20/11/2026).
const EVENT_SELECT = 'id,is_active,schedule(day_of_week,time,is_active),schedule_dates(event_date,time,is_active)';
interface ProgramEvent {
  id: string;
  is_active: boolean;
  schedule?: { is_active?: boolean | null }[] | null;
  schedule_dates?: { event_date: string; is_active?: boolean | null }[] | null;
}
function eventKeepsProgram(event: ProgramEvent | undefined): boolean {
  if (!event?.is_active) return false;
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Lisbon' }).format(new Date());
  return (
    (event.schedule ?? []).some((s) => s.is_active !== false) ||
    (event.schedule_dates ?? []).some((d) => d.is_active !== false && d.event_date >= today)
  );
}

/**
 * Sitemaps do site, lidos da base a cada pedido (cache de 15 min no edge).
 *
 * Uma notícia nova, uma peça dos Programas agendada ou um álbum novo entram
 * sozinhos, sem regenerar ficheiros nem fazer deploy. O vercel.json aponta:
 *   /sitemap.xml              → índice
 *   /sitemap-site.xml         → páginas fixas e galeria
 *   /sitemap-noticias.xml     → notícias (/noticias/:slug)
 *   /sitemap-programas.xml    → programas e peças (/programas/...), com imagem
 *                               (/sitemap-exclusivo.xml, nome antigo, dá o mesmo)
 *   /sitemap-google-news.xml  → peças dos Programas das últimas 48 h (Google Notícias)
 */

const SITE = 'https://www.olhaqueduas.com';
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || '';
const PAGE = 1000;

type Kind = 'index' | 'site' | 'noticias' | 'exclusivo' | 'news';

interface Entry {
  loc: string;
  lastmod?: string;
  freq?: string;
  priority?: string;
  image?: { loc: string; title: string };
}

const STATIC_PAGES: Entry[] = [
  { loc: '/', freq: 'daily', priority: '1.0', image: { loc: '/og-image.jpg', title: 'Olha que Duas, rádio online 24 horas' } },
  { loc: '/noticias', freq: 'hourly', priority: '0.9' },
  { loc: '/programas', freq: 'daily', priority: '0.9' },
  { loc: '/auditoria-gratuita', lastmod: '2026-04-21', freq: 'monthly', priority: '0.8', image: { loc: '/og-auditoria.jpg', title: 'Auditoria Gratuita de Comunicação - Olha que Duas' } },
  { loc: '/servicos', lastmod: '2026-11-20', freq: 'monthly', priority: '0.8' },
  { loc: '/galeria', freq: 'weekly', priority: '0.8' },
  { loc: '/kids', lastmod: '2026-11-20', freq: 'weekly', priority: '0.7', image: { loc: '/og-kids.jpg', title: 'Olha que Duas Kids - Espaço Infantil' } },
  { loc: '/kids/historias', lastmod: '2026-05-27', freq: 'monthly', priority: '0.6' },
  { loc: '/kids/jogos', lastmod: '2026-11-13', freq: 'monthly', priority: '0.6' },
  { loc: '/kids/jogos/quiz', lastmod: '2026-11-13', freq: 'monthly', priority: '0.5' },
  { loc: '/kids/jogos/memoria', lastmod: '2026-11-13', freq: 'monthly', priority: '0.5' },
  { loc: '/kids/jogos/pacman', lastmod: '2026-10-27', freq: 'monthly', priority: '0.5' },
  { loc: '/kids/jogos/snake', lastmod: '2026-10-27', freq: 'monthly', priority: '0.5' },
  { loc: '/rockinrio', lastmod: '2026-05-16', freq: 'monthly', priority: '0.6', image: { loc: '/og-rockinrio.jpg', title: 'Olha que Duas x Rock in Rio Lisboa 2026' } },
  { loc: '/newsletter', lastmod: '2026-03-24', freq: 'monthly', priority: '0.6' },
  { loc: '/faq', lastmod: '2026-04-06', freq: 'monthly', priority: '0.5' },
  { loc: '/privacidade', lastmod: '2026-03-24', freq: 'yearly', priority: '0.3' },
  { loc: '/termos', lastmod: '2026-03-24', freq: 'yearly', priority: '0.3' },
];

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

const abs = (loc: string) => (/^https?:/.test(loc) ? loc : SITE + loc);

async function query<T>(table: string, params: string): Promise<T[]> {
  const rows: T[] = [];
  // PostgREST caps each response; walk the pages so no URL is left out.
  for (let from = 0; ; from += PAGE) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${params}`, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        Range: `${from}-${from + PAGE - 1}`,
      },
    });
    if (!res.ok) throw new Error(`${table}: ${res.status}`);
    const page = (await res.json()) as T[];
    rows.push(...page);
    if (page.length < PAGE) return rows;
  }
}

function urlset(entries: Entry[]): string {
  const body = entries
    .map((e) => {
      let xml = `  <url>\n    <loc>${esc(abs(e.loc))}</loc>\n`;
      if (e.lastmod) xml += `    <lastmod>${e.lastmod}</lastmod>\n`;
      if (e.freq) xml += `    <changefreq>${e.freq}</changefreq>\n`;
      if (e.priority) xml += `    <priority>${e.priority}</priority>\n`;
      if (e.image) {
        xml += `    <image:image>\n      <image:loc>${esc(abs(e.image.loc))}</image:loc>\n`;
        xml += `      <image:title>${esc(e.image.title)}</image:title>\n    </image:image>\n`;
      }
      return `${xml}  </url>`;
    })
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${body}
</urlset>`;
}

const day = (iso?: string | null) => (iso ? iso.slice(0, 10) : undefined);
const live = () => `or=(published_at.is.null,published_at.lte.${new Date().toISOString()})`;

interface ExclusivoRow {
  slug: string;
  title: string;
  seo_title?: string | null;
  og_image_url: string;
  cover_url: string;
  published_at: string | null;
  updated_at: string;
  exclusive_programs: { slug: string; title: string } | null;
}

function exclusivoPosts(extra = ''): Promise<ExclusivoRow[]> {
  return query<ExclusivoRow>(
    'vinagre_posts',
    `is_published=eq.true&${live()}${extra}` +
      '&select=slug,title,seo_title,og_image_url,cover_url,published_at,updated_at,exclusive_programs!inner(slug,title,is_published)' +
      '&exclusive_programs.is_published=eq.true&order=published_at.desc',
  );
}

async function siteEntries(today: string): Promise<Entry[]> {
  const [albums, news, pieces] = await Promise.all([
    query<{ slug: string; title: string; cover_url?: string | null; event_date: string | null; updated_at?: string | null }>(
      'gallery_albums',
      'is_published=eq.true&order=event_date.desc&select=slug,title,event_date,updated_at',
    ),
    query<{ published_at: string | null }>('blog_posts', 'is_published=eq.true&order=published_at.desc.nullslast&limit=1&select=published_at').catch(() => []),
    exclusivoPosts('&limit=1').catch(() => []),
  ]);
  // Hubs change when their newest item does, not every day (21/11/2026).
  const newestAlbum = albums.map((a) => day(a.updated_at) ?? day(a.event_date) ?? '').sort().pop();
  const hubDay: Record<string, string | undefined> = {
    '/noticias': day(news[0]?.published_at),
    '/programas': day(pieces[0]?.published_at),
    '/galeria': newestAlbum || undefined,
  };
  // The home shows the newest of all of them.
  hubDay['/'] = Object.values(hubDay).filter(Boolean).sort().pop();
  return [
    ...STATIC_PAGES.map((p) => ({ ...p, lastmod: p.lastmod ?? hubDay[p.loc] ?? today })),
    ...albums.map((a) => ({
      loc: `/galeria/${a.slug}`,
      lastmod: day(a.updated_at) ?? day(a.event_date),
      freq: 'monthly',
      priority: '0.6',
    })),
  ];
}

async function programEntries(today: string): Promise<Entry[]> {
  const [programs, posts] = await Promise.all([
    query<{ slug: string; title: string; author: string; cover_url: string; updated_at: string; event_id: string | null }>(
      'exclusive_programs',
      'is_published=eq.true&order=sort_order.asc&select=slug,title,author,cover_url,updated_at,event_id',
    ),
    exclusivoPosts(),
  ]);
  const latestByProgram = new Map<string, string>();
  for (const p of posts) {
    const slug = p.exclusive_programs?.slug;
    if (slug && !latestByProgram.has(slug)) latestByProgram.set(slug, day(p.published_at) ?? today);
  }
  // Same rule as the site (src/lib/programRadio.ts): a live piece OR an active radio event.
  const eventIds = programs.map((p) => p.event_id).filter((id): id is string => Boolean(id));
  const events = eventIds.length
    ? await query<ProgramEvent>('events', `select=${EVENT_SELECT}&id=in.(${eventIds.join(',')})`).catch(() => [])
    : [];
  const byId = new Map(events.map((e) => [e.id, e]));
  return [
    ...programs.filter((p) => latestByProgram.has(p.slug) || (p.event_id && eventKeepsProgram(byId.get(p.event_id)))).map((p) => ({
      loc: `/programas/${p.slug}`,
      lastmod: latestByProgram.get(p.slug) ?? day(p.updated_at),
      freq: 'daily',
      priority: '0.8',
      image: p.cover_url ? { loc: p.cover_url, title: `${p.title} — ${p.author}` } : undefined,
    })),
    ...posts
      .filter((p) => p.exclusive_programs)
      .map((p) => {
        const image = p.og_image_url || p.cover_url;
        return {
          loc: `/programas/${p.exclusive_programs!.slug}/${p.slug}`,
          lastmod: day(p.updated_at) ?? day(p.published_at),
          freq: 'weekly',
          priority: '0.7',
          image: image ? { loc: image, title: p.title } : undefined,
        };
      }),
  ];
}

// Google News only takes articles from the last two days.
function newsPieces(): Promise<ExclusivoRow[]> {
  const since = new Date(Date.now() - 48 * 3600 * 1000).toISOString();
  return exclusivoPosts(`&published_at=gte.${since}`);
}

async function build(kind: Kind): Promise<string> {
  const today = new Date().toISOString().slice(0, 10);

  if (kind === 'index') {
    // No sitemap-noticias: aggregated news are noindex (Leo, 21/11/2026). Google News lists Programas pieces only.
    // Each child's lastmod = the newest lastmod inside it, not «today» (qa 21/11/2026).
    const newest = (days: (string | undefined)[]) => days.filter(Boolean).sort().pop();
    const [site, programs, news] = await Promise.all([siteEntries(today), programEntries(today), newsPieces()]);
    const maps: [string, string | undefined][] = [
      ['sitemap-site.xml', newest(site.map((e) => e.lastmod))],
      ['sitemap-programas.xml', newest(programs.map((e) => e.lastmod))],
      ['sitemap-google-news.xml', newest(news.map((p) => day(p.published_at)))],
    ];
    return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${maps.map(([m, last]) => `  <sitemap><loc>${SITE}/${m}</loc>${last ? `<lastmod>${last}</lastmod>` : ''}</sitemap>`).join('\n')}
</sitemapindex>`;
  }

  if (kind === 'site') return urlset(await siteEntries(today));

  // Kept as an empty urlset so the old address answers cleanly (news are noindex since 21/11/2026).
  if (kind === 'noticias') return urlset([]);

  if (kind === 'exclusivo') return urlset(await programEntries(today));

  const recent = await newsPieces();
  const items = recent
    .filter((p) => p.exclusive_programs && p.published_at)
    .map(
      (p) => `  <url>
    <loc>${SITE}/programas/${p.exclusive_programs!.slug}/${p.slug}</loc>
    <news:news>
      <news:publication><news:name>Olha que Duas</news:name><news:language>pt</news:language></news:publication>
      <news:publication_date>${p.published_at}</news:publication_date>
      <news:title>${esc(p.seo_title || p.title)}</news:title>
    </news:news>
  </url>`,
    );
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${items.join('\n')}
</urlset>`;
}

const KINDS: Kind[] = ['index', 'site', 'noticias', 'exclusivo', 'news'];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const raw = String(req.query.t || 'index');
  const kind = (KINDS as string[]).includes(raw) ? (raw as Kind) : 'index';
  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  try {
    const xml = await build(kind);
    res.setHeader('Cache-Control', 's-maxage=900, stale-while-revalidate=3600');
    return res.status(200).send(xml);
  } catch {
    // A short-lived error beats caching an empty sitemap for an hour.
    res.setHeader('Cache-Control', 'no-store');
    return res.status(503).send('<?xml version="1.0" encoding="UTF-8"?><error>temporarily unavailable</error>');
  }
}
