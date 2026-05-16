import sharp from 'sharp';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync, mkdirSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const out = resolve(__dirname, '..', 'public', 'rockinrio', 'artists');
if (!existsSync(out)) mkdirSync(out, { recursive: true });

// Wikimedia Commons artist photos (CC licensed)
const artists = [
  // Headliners
  { slug: 'katy-perry', url: 'https://upload.wikimedia.org/wikipedia/commons/5/5f/Katy_Perry_9_%2842287412124%29_%28cropped%29.jpg' },
  { slug: 'linkin-park', url: 'https://upload.wikimedia.org/wikipedia/commons/d/d8/Linkin_Park_-_From_Zero_Lead_Press_Photo_-_James_Minchin_III.jpg' },
  { slug: 'rod-stewart', url: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Rod_Stewart_%281984_Warner_publicity_photo%29.jpg' },
  { slug: '21-savage', url: 'https://upload.wikimedia.org/wikipedia/commons/4/42/21_Savage_2018_2.jpg' },
  // Pop Day
  { slug: 'charlie-puth', url: 'https://upload.wikimedia.org/wikipedia/commons/e/e7/Charlie_Puth.jpg' },
  { slug: 'alok', url: 'https://upload.wikimedia.org/wikipedia/commons/e/e1/Alok_Tomorrowland_Winter_2025.jpg' },
  { slug: 'bebe-rexha', url: 'https://upload.wikimedia.org/wikipedia/commons/8/81/Bebe_Rexha_2018_%28cropped%29.jpg' },
  { slug: 'pedro-sampaio', url: 'https://upload.wikimedia.org/wikipedia/commons/d/d3/Pedro_Sampaio_-_Verão_Multishow.png' },
  // Rock Day
  { slug: 'cypress-hill', url: 'https://upload.wikimedia.org/wikipedia/commons/2/25/Cypress_Hill.jpg' },
  { slug: 'sepultura', url: 'https://upload.wikimedia.org/wikipedia/commons/0/0f/Sepultura-18.jpg' },
  { slug: 'kaiser-chiefs', url: 'https://upload.wikimedia.org/wikipedia/commons/a/ab/Kaiser_Chiefs_in_Concert.JPG' },
  // Legends Day
  { slug: 'cyndi-lauper', url: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Cyndi_Lauper_2008.jpg' },
  { slug: 'shaggy', url: 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Shaggy_%282018%29.jpg' },
  { slug: 'joss-stone', url: 'https://upload.wikimedia.org/wikipedia/commons/d/de/Joss_Stone_18_%288132144204%29.jpg' },
  // Urban Day
  { slug: 'central-cee', url: 'https://upload.wikimedia.org/wikipedia/commons/1/14/Central_Cee.jpg' },
  { slug: 'ceelo-green', url: 'https://upload.wikimedia.org/wikipedia/commons/e/ea/CeeLo_Green_%2851936951349%29.jpg' },
  { slug: 'rema', url: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/Rema_at_2019_LFW_%28cropped%29.png' },
  { slug: 'lola-indigo', url: 'https://upload.wikimedia.org/wikipedia/commons/c/c9/Goyas_2025_-_Lola_%C3%8Dndigo.jpg' },
];

const sleep = ms => new Promise(r => setTimeout(r, ms));

for (const a of artists) {
  const dest = resolve(out, `${a.slug}.jpg`);
  if (existsSync(dest)) { console.log(`  ⊘ ${a.slug} (exists)`); continue; }
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
