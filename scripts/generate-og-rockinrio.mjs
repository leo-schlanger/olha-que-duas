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

  // Rock in Rio white logo — rotate 90deg, balanced size
  const rirLogo = await sharp(readFileSync(pub('rock-in-rio-branco.png')))
    .rotate(90, { background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .resize(270, 270, { fit: 'inside' })
    .png().toBuffer();

  // Olha que Duas icon — proportional to RiR
  const oqdIcon = await sharp(readFileSync(pub('icon-512x512.png')))
    .resize(250, 250, { fit: 'inside' })
    .png().toBuffer();

  // Dark overlay
  const overlay = Buffer.from(`
    <svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="d" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#060610" stop-opacity="0.35"/>
          <stop offset="100%" stop-color="#060610" stop-opacity="0.93"/>
        </linearGradient>
        <radialGradient id="gl" cx="0.38" cy="0.5" r="0.25">
          <stop offset="0%" stop-color="#1e3a8a" stop-opacity="0.15"/>
          <stop offset="100%" stop-color="transparent" stop-opacity="0"/>
        </radialGradient>
        <radialGradient id="gr" cx="0.62" cy="0.5" r="0.2">
          <stop offset="0%" stop-color="#991b1b" stop-opacity="0.1"/>
          <stop offset="100%" stop-color="transparent" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="${W}" height="${H}" fill="url(#d)"/>
      <rect width="${W}" height="${H}" fill="url(#gl)"/>
      <rect width="${W}" height="${H}" fill="url(#gr)"/>
    </svg>`);

  // Text layer
  const text = Buffer.from(`
    <svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
      <!-- Badge -->
      <rect x="420" y="72" width="360" height="34" rx="17" fill="rgba(251,191,36,0.12)" stroke="rgba(251,191,36,0.3)" stroke-width="1"/>
      <text x="600" y="95" text-anchor="middle" fill="#fcd34d" font-family="'Segoe UI',Arial,sans-serif" font-size="11" font-weight="800" letter-spacing="5">★  PARCEIROS OFICIAIS  ★</text>

      <!-- Divider -->
      <line x1="600" y1="160" x2="600" y2="450" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>
      <text x="600" y="315" text-anchor="middle" fill="rgba(255,255,255,0.18)" font-family="Arial" font-size="18">×</text>

      <!-- Bottom bar -->
      <rect x="0" y="${H - 56}" width="${W}" height="56" fill="rgba(6,6,16,0.8)"/>
      <rect x="0" y="${H - 56}" width="${W}" height="1" fill="rgba(251,191,36,0.12)"/>
      <text x="600" y="${H - 26}" text-anchor="middle" fill="rgba(255,255,255,0.55)" font-family="'Segoe UI',Arial,sans-serif" font-size="13.5" font-weight="700" letter-spacing="4">20 · 21 · 27 · 28  JUNHO 2026</text>
      <text x="600" y="${H - 9}" text-anchor="middle" fill="rgba(255,255,255,0.25)" font-family="Arial,sans-serif" font-size="10" font-weight="600" letter-spacing="3">PARQUE TEJO, LISBOA</text>
    </svg>`);

  // Position both logos symmetrically around center
  const rirMeta = await sharp(rirLogo).metadata();
  const oqdMeta = await sharp(oqdIcon).metadata();

  const centerY = 285;
  const gap = 60; // half-gap between logos

  const rirLeft = 600 - gap - (rirMeta.width || 270);
  const rirTop = centerY - Math.round((rirMeta.height || 270) / 2);

  const oqdLeft = 600 + gap;
  const oqdTop = centerY - Math.round((oqdMeta.height || 250) / 2);

  console.log(`RiR: ${rirMeta.width}x${rirMeta.height} at (${rirLeft},${rirTop})`);
  console.log(`OqD: ${oqdMeta.width}x${oqdMeta.height} at (${oqdLeft},${oqdTop})`);

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
