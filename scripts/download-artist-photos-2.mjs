import sharp from 'sharp';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync, mkdirSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const out = resolve(__dirname, '..', 'public', 'rockinrio', 'artists');
if (!existsSync(out)) mkdirSync(out, { recursive: true });

const sleep = ms => new Promise(r => setTimeout(r, ms));

const artists = [
  // Missing artists — Wikimedia Commons
  { slug: 'nena', url: 'https://upload.wikimedia.org/wikipedia/commons/5/5b/Nena_beim_Sommernachtstraum_2013_in_M%C3%BCnchen_%282%29.jpg' },
  { slug: 'calema', url: 'https://upload.wikimedia.org/wikipedia/commons/a/af/Calema_at_Web_Summit_2022_%28cropped%29.jpg' },
  { slug: 'the-pretty-reckless', url: 'https://upload.wikimedia.org/wikipedia/commons/0/01/The_Pretty_Reckless_Rockfest_2017_2.jpg' },
  { slug: 'hoobastank', url: 'https://upload.wikimedia.org/wikipedia/commons/d/d2/Hoobastank_MAA.jpg' },
  { slug: 'pod', url: 'https://upload.wikimedia.org/wikipedia/commons/c/c9/PODByPhilKonstantin.jpg' },
  { slug: 'xutos', url: 'https://upload.wikimedia.org/wikipedia/commons/c/c6/Xutos_e_Pontap%C3%A9s.jpg' },
  { slug: 'the-wailers', url: 'https://upload.wikimedia.org/wikipedia/commons/7/7e/The_Wailers_Stendhal_Festival_2023.jpg' },
  { slug: 'matue', url: 'https://upload.wikimedia.org/wikipedia/commons/3/3d/Doode_Teto_e_Matue_%28cropped%29.jpg' },
  { slug: 'filipe-ret', url: 'https://upload.wikimedia.org/wikipedia/commons/2/27/Filipe_Ret.jpg' },
  { slug: 'gnr', url: 'https://upload.wikimedia.org/wikipedia/commons/d/d0/GNR_na_Casa_da_M%C3%BAsica%2C_2016.jpg' },
  { slug: '4-non-blondes', url: 'https://upload.wikimedia.org/wikipedia/commons/b/bc/Linda_Perry_-_Flickr_-_nick_step_%281%29.jpg' },
  { slug: 'grandson', url: 'https://upload.wikimedia.org/wikipedia/commons/2/29/Grandson_2019_%28cropped%29.jpg' },
  { slug: 'blasted-mechanism', url: 'https://upload.wikimedia.org/wikipedia/commons/f/f1/Blasted_Mechanism_@_Exit_Festival_%286%29.jpg' },
  { slug: 'tara-perdida', url: 'https://upload.wikimedia.org/wikipedia/commons/9/93/Tara_Perdida_Lx_ao_vivo.jpg' },
  { slug: 'sam-the-kid', url: 'https://upload.wikimedia.org/wikipedia/commons/e/ee/Sam_The_Kid.jpg' },
  { slug: 'orelha-negra', url: 'https://upload.wikimedia.org/wikipedia/commons/c/cd/Orelha_Negra_@_Indie_Music_Fest_2018_%282%29.jpg' },
  { slug: 'lola-indigo', url: 'https://upload.wikimedia.org/wikipedia/commons/c/c9/Goyas_2025_-_Lola_%C3%8Dndigo.jpg' },
  { slug: 'dennis', url: 'https://upload.wikimedia.org/wikipedia/commons/1/16/Dennis_DJ.jpg' },
  { slug: 'irina-barros', url: 'https://upload.wikimedia.org/wikipedia/commons/5/55/Festival_da_Can%C3%A7%C3%A3o_2018_-_Irina_Barros.jpg' },
  { slug: 'belo', url: 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Belo_%28cantor%29.jpg' },
  { slug: 'syro', url: 'https://upload.wikimedia.org/wikipedia/commons/0/05/Syro_performs_at_Green_Man_2023_%28cropped%29.jpg' },
  { slug: 'carlao', url: 'https://upload.wikimedia.org/wikipedia/commons/1/1b/Carl%C3%A3o_NOS_Alive_2022.jpg' },
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
