import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputPath = path.join(__dirname, '../src/assets/logo-olha-que-duas.png');
const publicDir = path.join(__dirname, '../public');

const sizes = [
  { size: 72, name: 'icon-72x72.png' },
  { size: 96, name: 'icon-96x96.png' },
  { size: 128, name: 'icon-128x128.png' },
  { size: 144, name: 'icon-144x144.png' },
  { size: 152, name: 'icon-152x152.png' },
  { size: 192, name: 'icon-192x192.png' },
  { size: 384, name: 'icon-384x384.png' },
  { size: 512, name: 'icon-512x512.png' },
];

async function generateIcons() {
  console.log('Generating PWA icons...\n');

  // Read the original image and remove white background
  const image = sharp(inputPath);
  const processedBuffer = await image
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { data, info } = processedBuffer;

  // Make white pixels transparent
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    if (r > 245 && g > 245 && b > 245) {
      data[i + 3] = 0;
    }
  }

  const transparentImage = sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 }
  });

  // Generate each size
  for (const { size, name } of sizes) {
    const outputPath = path.join(publicDir, name);

    await transparentImage
      .clone()
      .resize(size, size, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png()
      .toFile(outputPath);

    console.log(`✓ ${name} (${size}x${size})`);
  }

  // Also create a maskable icon with padding and background
  const maskableSize = 512;
  const iconSize = Math.floor(maskableSize * 0.7); // 70% of total for safe zone

  await transparentImage
    .clone()
    .resize(iconSize, iconSize, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .extend({
      top: Math.floor((maskableSize - iconSize) / 2),
      bottom: Math.ceil((maskableSize - iconSize) / 2),
      left: Math.floor((maskableSize - iconSize) / 2),
      right: Math.ceil((maskableSize - iconSize) / 2),
      background: { r: 180, g: 41, b: 43, alpha: 1 } // vermelho brand color
    })
    .png()
    .toFile(path.join(publicDir, 'icon-maskable-512x512.png'));

  console.log(`✓ icon-maskable-512x512.png (maskable with brand background)`);

  console.log('\n✅ All PWA icons generated successfully!');
}

generateIcons().catch(console.error);
