import sharp from 'sharp';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync, mkdirSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const out = resolve(__dirname, '..', 'public', 'rockinrio', 'artists');
if (!existsSync(out)) mkdirSync(out, { recursive: true });

// Wikimedia Commons artist photos (CC licensed) — new artists May 2026
const artists = [
  { slug: 'samuel-uria', url: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Samuel_%C3%9Aria%2C_29.10.2016%2C_Porto%2C_Fnac_Santa_Catarina.jpg' },
  { slug: 'diego-miranda', url: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/DIEGO_MIRANDA.jpg' },
  { slug: 'carol-biazin', url: 'https://upload.wikimedia.org/wikipedia/commons/b/b3/Carol_Biazin_march_2022.png' },
  { slug: 'bia-caboz', url: 'https://upload.wikimedia.org/wikipedia/commons/d/dd/Bia_Caboz.jpg' },
  { slug: 'melly', url: 'https://upload.wikimedia.org/wikipedia/commons/9/94/Melly_%28Brazilian_singer%29_-_TVZ_2023.png' },
  { slug: 'joyce-alane', url: 'https://upload.wikimedia.org/wikipedia/commons/1/1e/Joyce_Alane_%28cropped%29.png' },
  { slug: 'king-bigs', url: 'https://upload.wikimedia.org/wikipedia/commons/7/74/King_Bigs_2022.jpg' },
];

const sleep = ms => new Promise(r => setTimeout(r, ms));

for (const a of artists) {
  const dest = resolve(out, `${a.slug}.jpg`);
  try {
    await sleep(1500);
    console.log(`  ${a.slug}...`);
    const res = await fetch(a.url, { headers: { 'User-Agent': 'OlhaQueDuasBot/1.0 (https://olhaqueduas.com; contact: olhaqueduas.assessoria@gmail.com)' } });
    if (!res.ok) { console.log(`  ✗ ${a.slug}: HTTP ${res.status}`); continue; }
    const buf = Buffer.from(await res.arrayBuffer());
    await sharp(buf).resize(300, 300, { fit: 'cover', position: 'top' }).jpeg({ quality: 80 }).toFile(dest);
    console.log(`  ✓ ${a.slug}`);
  } catch (e) {
    console.log(`  ✗ ${a.slug}: ${e.message}`);
  }
}

console.log('Done.');
