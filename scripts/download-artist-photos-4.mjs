import sharp from 'sharp';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync, mkdirSync, unlinkSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const out = resolve(__dirname, '..', 'public', 'rockinrio', 'artists');
if (!existsSync(out)) mkdirSync(out, { recursive: true });

const sleep = ms => new Promise(r => setTimeout(r, ms));

const artists = [
  // Wikimedia Commons (CC-BY-SA 4.0) — already downloaded
  // { slug: 'napa', url: 'https://upload.wikimedia.org/wikipedia/commons/4/4f/PrepartyES_-_NAPA_01.jpg' },

  // Rock in Rio Lisboa official press photos (parceria)
  { slug: 'irina-barros', url: 'https://assets-lisboa.s3.amazonaws.com/media/cache/list/rc/jPh455na/uploads/artistas/irina barros/irina barros.png' },
  { slug: 'sofia-camara', url: 'https://assets-lisboa.s3.amazonaws.com/media/cache/list/rc/2rMZrPa0/uploads/artistas/Sofia camara/sofia camara.png' },

  // Agência Três (management agency press photo)
  { slug: 'maninho', url: 'https://www.agenciatres.pt/sites/default/files/styles/w1200/public/imgs_artistas/MANINHO.jpeg?itok=3YTv2toj' },

  // musicfest.pt concert photos
  { slug: 'tara-perdida', url: 'https://musicfest.pt/wp-content/uploads/2026/04/taraperdida-10042026-16.jpg' },
  { slug: 'taxi', url: 'https://musicfest.pt/wp-content/uploads/2025/11/taxi14-11-25-26.jpg' },
  { slug: 'jafumega', url: 'https://musicfest.pt/wp-content/uploads/2016/09/20160904173324-jafumega-0103.jpg' },

  // Rastilho Records press photo
  { slug: 'orelha-negra', url: 'https://www.rastilhorecords.com/galeria/bandas/1945e4c8dba37b46531e862bf92db319.jpg' },
];

for (const a of artists) {
  const dest = resolve(out, `${a.slug}.jpg`);
  // Force overwrite placeholders
  if (existsSync(dest)) unlinkSync(dest);
  try {
    await sleep(1500);
    console.log(`  ${a.slug}...`);
    const res = await fetch(a.url, { headers: { 'User-Agent': 'OlhaQueDuasBot/1.0 (https://olhaqueduas.com)' } });
    if (!res.ok) { console.log(`  ✗ ${a.slug}: HTTP ${res.status}`); continue; }
    const buf = Buffer.from(await res.arrayBuffer());
    await sharp(buf).resize(300, 300, { fit: 'cover', position: 'top' }).jpeg({ quality: 80 }).toFile(dest);
    console.log(`  ✓ ${a.slug}`);
  } catch (e) {
    console.log(`  ✗ ${a.slug}: ${e.message}`);
  }
}
console.log('Done.');
