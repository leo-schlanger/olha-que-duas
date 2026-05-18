import sharp from 'sharp';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync, mkdirSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const out = resolve(__dirname, '..', 'public', 'rockinrio', 'artists');
if (!existsSync(out)) mkdirSync(out, { recursive: true });

const missing = [
  // Super Bock Stage
  { slug: 'barbara-bandeira', letter: 'B', color: '#ec4899' },
  // Music Valley
  { slug: 'dealema', letter: 'D', color: '#ef4444' },
  // Digital Stage Day 1
  { slug: 'zarko', letter: 'Z', color: '#8b5cf6' },
  { slug: 'carol-biazin', letter: 'C', color: '#8b5cf6' },
  { slug: 'joyce-alane', letter: 'J', color: '#8b5cf6' },
  { slug: 'pears', letter: 'P', color: '#8b5cf6' },
  // Digital Stage Day 2
  { slug: 'samuel-uria', letter: 'S', color: '#ef4444' },
  { slug: 'jimmy-p', letter: 'J', color: '#ef4444' },
  { slug: 'diego-miranda', letter: 'D', color: '#ef4444' },
  // Digital Stage Day 3
  { slug: 'bateu-matou', letter: 'B', color: '#f59e0b' },
  { slug: 'bia-caboz', letter: 'B', color: '#f59e0b' },
  { slug: 'bento-gil', letter: 'B', color: '#f59e0b' },
  { slug: 'melly', letter: 'M', color: '#f59e0b' },
  { slug: 'ulas', letter: 'U', color: '#f59e0b' },
  // Digital Stage Day 4
  { slug: 'king-bigs', letter: 'K', color: '#a855f7' },
  { slug: 'dj-big-dj-glue', letter: 'D', color: '#a855f7' },
  { slug: 'rima-pt', letter: 'R', color: '#a855f7' },
  { slug: 'elyas', letter: 'E', color: '#a855f7' },
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
