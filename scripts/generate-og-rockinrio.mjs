/**
 * Generate OG image for /rockinrio (1200x630)
 *
 * Layout: Concert stage bg → dark overlay → centered dual logos large → text
 */
import sharp from 'sharp';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pub = (...p) => resolve(__dirname, '..', 'public', ...p);

const W = 1200;
const H = 630;

async function main() {
  // 1. Download stage background
  console.log('Downloading background...');
  const bgRes = await fetch('https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=1400&h=740&fit=crop&crop=center&q=90');
  const bgBuf = Buffer.from(await bgRes.arrayBuffer());
  const bg = await sharp(bgBuf).resize(W, H, { fit: 'cover' }).toBuffer();

  // 2. Rock in Rio Lisboa logo (color — already correct orientation, more impactful)
  const rirLogo = await sharp(readFileSync(pub('partners', 'rockinrio.png')))
    .resize(320, 320, { fit: 'inside' })
    .png()
    .toBuffer();

  // 3. Olha que Duas icon
  const oqdIcon = await sharp(readFileSync(pub('icon-512x512.png')))
    .resize(220, 220, { fit: 'inside' })
    .png()
    .toBuffer();

  // 4. Dark overlay + colour tint (SVG)
  const overlay = Buffer.from(`
    <svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="dark" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#080810" stop-opacity="0.45"/>
          <stop offset="100%" stop-color="#080810" stop-opacity="0.92"/>
        </linearGradient>
        <linearGradient id="tint" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#1a3a8a" stop-opacity="0.3"/>
          <stop offset="100%" stop-color="#8b1a1a" stop-opacity="0.25"/>
        </linearGradient>
      </defs>
      <rect width="${W}" height="${H}" fill="url(#dark)"/>
      <rect width="${W}" height="${H}" fill="url(#tint)"/>
    </svg>
  `);

  // 5. Text + decorative elements (SVG)
  const text = Buffer.from(`
    <svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
      <!-- "PARCEIROS OFICIAIS" badge — centered above logos -->
      <rect x="390" y="100" width="420" height="38" rx="19" fill="rgba(251,191,36,0.15)" stroke="rgba(251,191,36,0.35)" stroke-width="1.5"/>
      <text x="600" y="126" text-anchor="middle" fill="#fcd34d" font-family="'Segoe UI','Helvetica Neue',Arial,sans-serif" font-size="13" font-weight="800" letter-spacing="5">★  PARCEIROS OFICIAIS  ★</text>

      <!-- Divider between logos -->
      <line x1="600" y1="195" x2="600" y2="440" stroke="rgba(255,255,255,0.18)" stroke-width="1.5"/>

      <!-- "x" connector -->
      <text x="600" y="330" text-anchor="middle" fill="rgba(255,255,255,0.25)" font-family="'Segoe UI',Arial,sans-serif" font-size="22" font-weight="300">×</text>

      <!-- Bottom bar -->
      <rect x="0" y="${H - 60}" width="${W}" height="60" fill="rgba(8,8,16,0.7)"/>
      <rect x="0" y="${H - 60}" width="${W}" height="1" fill="rgba(251,191,36,0.2)"/>

      <!-- Bottom text -->
      <text x="600" y="${H - 28}" text-anchor="middle" fill="rgba(255,255,255,0.5)" font-family="'Segoe UI','Helvetica Neue',Arial,sans-serif" font-size="14" font-weight="700" letter-spacing="4">20 · 21 · 27 · 28  JUNHO 2026</text>
      <text x="600" y="${H - 10}" text-anchor="middle" fill="rgba(255,255,255,0.3)" font-family="'Segoe UI',Arial,sans-serif" font-size="11" font-weight="600" letter-spacing="3">PARQUE TEJO, LISBOA</text>
    </svg>
  `);

  // 6. Compose — logos centered and large
  //    RiR logo: left of center (centered at ~370)
  //    OqD icon: right of center (centered at ~830)
  const rirMeta = await sharp(rirLogo).metadata();
  const oqdMeta = await sharp(oqdIcon).metadata();

  const rirLeft = 370 - Math.round((rirMeta.width || 320) / 2);
  const rirTop  = 290 - Math.round((rirMeta.height || 320) / 2);

  const oqdLeft = 830 - Math.round((oqdMeta.width || 220) / 2);
  const oqdTop  = 290 - Math.round((oqdMeta.height || 220) / 2);

  console.log('Compositing...');
  const result = await sharp(bg)
    .composite([
      { input: overlay, blend: 'over' },
      { input: rirLogo, left: rirLeft, top: rirTop, blend: 'over' },
      { input: oqdIcon, left: oqdLeft, top: oqdTop, blend: 'over' },
      { input: text, blend: 'over' },
    ])
    .jpeg({ quality: 92 })
    .toFile(pub('og-rockinrio.jpg'));

  console.log(`✓ og-rockinrio.jpg (${(result.size / 1024).toFixed(0)} KB)`);
}

main().catch(console.error);
