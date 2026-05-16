import sharp from 'sharp';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync, mkdirSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const out = resolve(__dirname, '..', 'public', 'rockinrio', 'artists');
if (!existsSync(out)) mkdirSync(out, { recursive: true });

const sleep = ms => new Promise(r => setTimeout(r, ms));

const artists = [
  { slug: 'audrey-nuna', url: 'https://upload.wikimedia.org/wikipedia/commons/9/9a/Audrey_Nuna_performing_at_Rapbeat_Festival_2022_cropped.jpg' },
  { slug: 'grandson', url: 'https://upload.wikimedia.org/wikipedia/commons/d/d9/Grandson_-_Rock_am_Ring_2022-3239.jpg' },
  { slug: 'blasted-mechanism', url: 'https://upload.wikimedia.org/wikipedia/commons/5/5b/Blasted_Mechanism_%40_Enterro_da_Gata_2.jpg' },
  { slug: 'sam-the-kid', url: 'https://upload.wikimedia.org/wikipedia/commons/6/6c/Sam_the_kid_2024.png' },
  { slug: 'dennis', url: 'https://upload.wikimedia.org/wikipedia/commons/7/70/Dennis_2023.jpg' },
  { slug: 'belo', url: 'https://upload.wikimedia.org/wikipedia/commons/6/63/Belo_2022.jpg' },
  { slug: 'syro', url: 'https://upload.wikimedia.org/wikipedia/commons/b/ba/Syro_interviewed_at_Festival_da_Can%C3%A7%C3%A3o_2022.png' },
  { slug: 'carlao', url: 'https://upload.wikimedia.org/wikipedia/commons/e/e6/Carl%C3%A3o_%28rapper%29.png' },
  { slug: 'uhf', url: 'https://upload.wikimedia.org/wikipedia/commons/9/98/Ant%C3%B3nio_Manuel_Ribeiro_-_vocalista_e_guitarrista_UHF.jpg' },
  { slug: 'irina-barros', url: 'https://upload.wikimedia.org/wikipedia/commons/5/55/Festival_da_Can%C3%A7%C3%A3o_2018_-_Irina_Barros.jpg' },
];

for (const a of artists) {
  const dest = resolve(out, `${a.slug}.jpg`);
  if (existsSync(dest)) { console.log(`⊘ ${a.slug} (exists)`); continue; }
  try {
    await sleep(2000);
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
