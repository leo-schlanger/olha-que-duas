/**
 * generate-sitemap.mjs
 *
 * Gera public/sitemap.xml com URLs dinâmicas (galeria, blog e programas do
 * Exclusivo com as suas peças) a partir do Supabase, preservando as entradas
 * estáticas.
 *
 * Uso:  node scripts/generate-sitemap.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "public", "sitemap.xml");

// --------------- env ---------------
function loadEnv() {
  const envPath = path.join(ROOT, ".env");
  if (!fs.existsSync(envPath)) return {};
  const vars = {};
  for (const line of fs.readFileSync(envPath, "utf-8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    vars[trimmed.slice(0, idx)] = trimmed.slice(idx + 1);
  }
  return vars;
}

const env = loadEnv();
const SUPABASE_URL = env.VITE_SUPABASE_URL;
const SUPABASE_KEY = env.VITE_SUPABASE_ANON_KEY;
const BASE = "https://www.olhaqueduas.com";
const TODAY = new Date().toISOString().slice(0, 10);

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env");
  process.exit(1);
}

// --------------- fetch helpers ---------------
async function fetchTable(table, query = "") {
  const url = `${SUPABASE_URL}/rest/v1/${table}?${query}`;
  const res = await fetch(url, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
    },
  });
  if (!res.ok) throw new Error(`${table}: ${res.status} ${res.statusText}`);
  return res.json();
}

// --------------- static pages ---------------
const staticPages = [
  { loc: "/", lastmod: TODAY, freq: "weekly", priority: "1.0", image: { loc: "/og-image.jpg", title: "Olha que Duas - Podcast e Radio" } },
  { loc: "/viagens", lastmod: "2026-04-06", freq: "monthly", priority: "0.9", image: { loc: "/og-viagens.jpg", title: "Olha que Duas Trip - Promotora de Viagens" } },
  { loc: "/auditoria-gratuita", lastmod: "2026-04-21", freq: "monthly", priority: "0.9", image: { loc: "/og-auditoria.jpg", title: "Auditoria Gratuita de Comunicacao - Olha que Duas" } },
  { loc: "/servicos", lastmod: "2026-04-06", freq: "monthly", priority: "0.9" },
  { loc: "/galeria", lastmod: TODAY, freq: "weekly", priority: "0.8" },
  { loc: "/faq", lastmod: "2026-04-06", freq: "monthly", priority: "0.5" },
  { loc: "/noticias", lastmod: TODAY, freq: "daily", priority: "0.9" },
  { loc: "/exclusivo", lastmod: TODAY, freq: "daily", priority: "0.9", image: { loc: "/exclusivo/eduardo-vinagre.jpg", title: "Especiais Olha que Duas — Eduardo Vinagre" } },
  { loc: "/loja", lastmod: "2026-03-24", freq: "weekly", priority: "0.8" },
  { loc: "/kids", lastmod: "2026-04-11", freq: "weekly", priority: "0.8", image: { loc: "/og-kids.jpg", title: "Olha que Duas Kids - Espaco Infantil" } },
  { loc: "/rockinrio", lastmod: "2026-05-16", freq: "weekly", priority: "0.9", image: { loc: "/og-rockinrio.jpg", title: "Olha que Duas x Rock in Rio Lisboa 2026" } },
  { loc: "/newsletter", lastmod: "2026-03-24", freq: "monthly", priority: "0.7" },
  { loc: "/privacidade", lastmod: "2026-03-24", freq: "yearly", priority: "0.3" },
  { loc: "/termos", lastmod: "2026-03-24", freq: "yearly", priority: "0.3" },
  { loc: "/#sobre", lastmod: "2026-03-24", freq: "monthly", priority: "0.7" },
  { loc: "/#servicos", lastmod: "2026-03-24", freq: "monthly", priority: "0.7" },
  { loc: "/#radio", lastmod: "2026-03-24", freq: "weekly", priority: "0.8" },
  { loc: "/#podcast", lastmod: "2026-03-24", freq: "weekly", priority: "0.8" },
  { loc: "/#contacto", lastmod: "2026-03-24", freq: "monthly", priority: "0.6" },
];

// --------------- XML builder ---------------
function escapeXml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function urlEntry({ loc, lastmod, freq, priority, image }) {
  let xml = `  <url>\n    <loc>${escapeXml(BASE + loc)}</loc>\n`;
  if (lastmod) xml += `    <lastmod>${lastmod}</lastmod>\n`;
  if (freq) xml += `    <changefreq>${freq}</changefreq>\n`;
  if (priority) xml += `    <priority>${priority}</priority>\n`;
  if (image) {
    xml += `    <image:image>\n`;
    const src = /^https?:/.test(image.loc) ? image.loc : BASE + image.loc;
    xml += `      <image:loc>${escapeXml(src)}</image:loc>\n`;
    xml += `      <image:title>${escapeXml(image.title)}</image:title>\n`;
    xml += `    </image:image>\n`;
  }
  xml += `  </url>\n`;
  return xml;
}

// --------------- main ---------------
async function main() {
  console.log("Fetching dynamic content from Supabase...");

  const [albums, posts] = await Promise.all([
    fetchTable("gallery_albums", "is_published=eq.true&order=event_date.desc&select=slug,event_date"),
    fetchTable("blog_posts", "is_published=eq.true&order=published_at.desc&select=slug,published_at,updated_at"),
  ]);

  let programs = [];
  let vinagre = [];
  try {
    programs = await fetchTable(
      "exclusive_programs",
      "is_published=eq.true&order=sort_order.asc&select=slug,title,author,cover_url,updated_at",
    );
    // Post URLs live under their program: /exclusivo/:programa/:slug.
    vinagre = await fetchTable(
      "vinagre_posts",
      "is_published=eq.true&order=published_at.desc" +
        "&select=slug,title,og_image_url,cover_url,published_at,updated_at,exclusive_programs!inner(slug,is_published)" +
        "&exclusive_programs.is_published=eq.true",
    );
  } catch (error) {
    console.warn("Exclusivo ignorado:", error.message);
  }
  const now = new Date().toISOString();
  vinagre = vinagre.filter((post) => !post.published_at || post.published_at <= now);

  console.log(
    `  ${albums.length} gallery albums, ${posts.length} blog posts, ${programs.length} programas, ${vinagre.length} exclusivos`,
  );

  const dynamicEntries = [];

  for (const album of albums) {
    dynamicEntries.push({
      loc: `/galeria/${album.slug}`,
      lastmod: album.event_date,
      freq: "monthly",
      priority: "0.6",
    });
  }

  for (const post of posts) {
    const date = (post.updated_at || post.published_at || "").slice(0, 10);
    dynamicEntries.push({
      loc: `/noticias/${post.slug}`,
      lastmod: date || TODAY,
      freq: "monthly",
      priority: "0.7",
    });
  }

  for (const program of programs) {
    dynamicEntries.push({
      loc: `/exclusivo/${program.slug}`,
      lastmod: (program.updated_at || "").slice(0, 10) || TODAY,
      freq: "weekly",
      priority: "0.8",
      image: program.cover_url ? { loc: program.cover_url, title: `${program.title} — ${program.author}` } : undefined,
    });
  }

  for (const post of vinagre) {
    const date = (post.updated_at || post.published_at || "").slice(0, 10);
    const image = post.og_image_url || post.cover_url;
    dynamicEntries.push({
      loc: `/exclusivo/${post.exclusive_programs.slug}/${post.slug}`,
      lastmod: date || TODAY,
      freq: "monthly",
      priority: "0.7",
      image: image ? { loc: image, title: post.title } : undefined,
    });
  }

  // Build XML
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n`;
  xml += `        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n\n`;

  for (const entry of staticPages) xml += urlEntry(entry) + "\n";

  if (dynamicEntries.length > 0) {
    xml += `  <!-- Dynamic: Gallery Albums -->\n`;
    for (const e of dynamicEntries.filter((e) => e.loc.startsWith("/galeria/"))) xml += urlEntry(e);
    xml += `\n  <!-- Dynamic: Blog Posts -->\n`;
    for (const e of dynamicEntries.filter((e) => e.loc.startsWith("/noticias/"))) xml += urlEntry(e);
    xml += `\n  <!-- Dynamic: Especiais Olha que Duas -->\n`;
    for (const e of dynamicEntries.filter((e) => e.loc.startsWith("/exclusivo/"))) xml += urlEntry(e);
  }

  xml += `\n</urlset>\n`;

  fs.writeFileSync(OUT, xml, "utf-8");
  console.log(`Sitemap written to ${OUT} (${staticPages.length + dynamicEntries.length} URLs)`);
}

main().catch((err) => {
  console.error("Failed to generate sitemap:", err);
  process.exit(1);
});
