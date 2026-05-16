import sharp from 'sharp';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pub = (...p) => resolve(__dirname, '..', 'public', ...p);
const W = 1200, H = 630;

async function main() {
  console.log('Downloading background...');
  const bgRes = await fetch('https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=1400&h=740&fit=crop&crop=center&q=90');
  const bg = await sharp(Buffer.from(await bgRes.arrayBuffer())).resize(W, H, { fit: 'cover' }).toBuffer();

  // Rock in Rio white logo — rotate 90deg clockwise to fix orientation
  const rirLogo = await sharp(readFileSync(pub('rock-in-rio-branco.png')))
    .rotate(90, { background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .resize(340, 340, { fit: 'inside' })
    .png().toBuffer();

  // Olha que Duas icon
  const oqdIcon = await sharp(readFileSync(pub('icon-512x512.png')))
    .resize(230, 230, { fit: 'inside' })
    .png().toBuffer();

  // Dark overlay
  const overlay = Buffer.from(`
    <svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="d" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#060610" stop-opacity="0.4"/>
          <stop offset="100%" stop-color="#060610" stop-opacity="0.92"/>
        </linearGradient>
      </defs>
      <rect width="${W}" height="${H}" fill="url(#d)"/>
      <rect width="${W}" height="${H}" fill="#1e3a8a" opacity="0.15"/>
    </svg>`);

  // Text layer
  const text = Buffer.from(`
    <svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
      <rect x="400" y="86" width="400" height="36" rx="18" fill="rgba(251,191,36,0.12)" stroke="rgba(251,191,36,0.3)" stroke-width="1.5"/>
      <text x="600" y="111" text-anchor="middle" fill="#fcd34d" font-family="'Segoe UI',Arial,sans-serif" font-size="12" font-weight="800" letter-spacing="5">★  PARCEIROS OFICIAIS  ★</text>
      <line x1="600" y1="175" x2="600" y2="460" stroke="rgba(255,255,255,0.15)" stroke-width="1.5"/>
      <text x="600" y="328" text-anchor="middle" fill="rgba(255,255,255,0.2)" font-family="Arial" font-size="20">×</text>
      <rect x="0" y="${H - 58}" width="${W}" height="58" fill="rgba(6,6,16,0.75)"/>
      <rect x="0" y="${H - 58}" width="${W}" height="1" fill="rgba(251,191,36,0.15)"/>
      <text x="600" y="${H - 27}" text-anchor="middle" fill="rgba(255,255,255,0.5)" font-family="'Segoe UI',Arial,sans-serif" font-size="14" font-weight="700" letter-spacing="4">20 · 21 · 27 · 28  JUNHO 2026</text>
      <text x="600" y="${H - 10}" text-anchor="middle" fill="rgba(255,255,255,0.28)" font-family="Arial,sans-serif" font-size="11" font-weight="600" letter-spacing="3">PARQUE TEJO, LISBOA</text>
    </svg>`);

  const rirMeta = await sharp(rirLogo).metadata();
  const oqdMeta = await sharp(oqdIcon).metadata();
  const rirLeft = 360 - Math.round((rirMeta.width || 340) / 2);
  const rirTop  = 295 - Math.round((rirMeta.height || 340) / 2);
  const oqdLeft = 840 - Math.round((oqdMeta.width || 230) / 2);
  const oqdTop  = 295 - Math.round((oqdMeta.height || 230) / 2);

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

  console.log(`Done — ${(result.size / 1024).toFixed(0)} KB`);
}

main().catch(console.error);
