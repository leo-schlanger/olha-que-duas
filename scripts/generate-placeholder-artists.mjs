import sharp from 'sharp';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync, mkdirSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const out = resolve(__dirname, '..', 'public', 'rockinrio', 'artists');
if (!existsSync(out)) mkdirSync(out, { recursive: true });

const missing = [
  { slug: 'napa', letter: 'N', color: '#ec4899' },
  { slug: 'maninho', letter: 'M', color: '#ec4899' },
  { slug: 'sofia-camara', letter: 'S', color: '#ec4899' },
  { slug: 'tara-perdida', letter: 'T', color: '#ef4444' },
  { slug: 'orelha-negra', letter: 'O', color: '#ef4444' },
  { slug: 'irina-barros', letter: 'I', color: '#8b5cf6' },
  { slug: 'taxi', letter: 'T', color: '#f59e0b' },
  { slug: 'jafumega', letter: 'J', color: '#f59e0b' },
];

for (const a of missing) {
  const dest = resolve(out, `${a.slug}.jpg`);
  if (existsSync(dest)) { console.log(`⊘ ${a.slug}`); continue; }
  const svg = Buffer.from(`
    <svg width="300" height="300" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${a.color}" stop-opacity="0.3"/>
          <stop offset="100%" stop-color="${a.color}" stop-opacity="0.1"/>
        </linearGradient>
      </defs>
      <rect width="300" height="300" fill="#0a0a14"/>
      <rect width="300" height="300" fill="url(#bg)"/>
      <text x="150" y="170" text-anchor="middle" fill="${a.color}" font-family="Arial,sans-serif" font-size="120" font-weight="900" opacity="0.4">${a.letter}</text>
    </svg>
  `);
  await sharp(svg).jpeg({ quality: 80 }).toFile(dest);
  console.log(`✓ ${a.slug}`);
}
console.log('Done.');
