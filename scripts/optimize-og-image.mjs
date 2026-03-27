import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { copyFileSync, unlinkSync, existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const inputPath = join(__dirname, '../public/og-image.png');
const backupPath = join(__dirname, '../public/og-image-original.png');
const outputJpgPath = join(__dirname, '../public/og-image.jpg');

async function optimizeImage() {
  try {
    // Backup original if not already done
    if (!existsSync(backupPath)) {
      copyFileSync(inputPath, backupPath);
      console.log('Original backed up to og-image-original.png');
    }

    // Convert to optimized JPEG (OG images don't need transparency)
    const info = await sharp(inputPath)
      .jpeg({
        quality: 85,
        mozjpeg: true
      })
      .toFile(outputJpgPath);

    console.log('Image optimized successfully!');
    console.log(`Output: og-image.jpg`);
    console.log(`Output size: ${Math.round(info.size / 1024)}KB`);
    console.log(`Dimensions: ${info.width}x${info.height}`);
    console.log('\nNote: Update meta tags to use og-image.jpg instead of og-image.png');
  } catch (error) {
    console.error('Error optimizing image:', error);
    process.exit(1);
  }
}

optimizeImage();
