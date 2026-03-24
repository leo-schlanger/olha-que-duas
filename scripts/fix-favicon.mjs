import sharp from 'sharp';
import pngToIco from 'png-to-ico';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputPath = path.join(__dirname, '../src/assets/logo-olha-que-duas.png');
const outputPath = path.join(__dirname, '../public/favicon.png');
const icoOutputPath = path.join(__dirname, '../public/favicon.ico');
const appleIconPath = path.join(__dirname, '../public/apple-touch-icon.png');
const favicon32Path = path.join(__dirname, '../public/favicon-32.png');
const favicon16Path = path.join(__dirname, '../public/favicon-16.png');

async function fixFavicon() {
  try {
    console.log('Processing favicon...');

    // Read the original image
    const image = sharp(inputPath);
    const metadata = await image.metadata();

    console.log(`Original size: ${metadata.width}x${metadata.height}`);

    // Remove white background by making white pixels transparent
    const processedBuffer = await image
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const { data, info } = processedBuffer;

    // Process pixels - make white/near-white pixels transparent
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      // Check if pixel is white or near-white (threshold of 245)
      if (r > 245 && g > 245 && b > 245) {
        data[i + 3] = 0; // Make transparent
      }
    }

    // Create the new image with transparent background
    const transparentImage = sharp(data, {
      raw: {
        width: info.width,
        height: info.height,
        channels: 4
      }
    });

    // Save as PNG (standard favicon) - 512x512
    await transparentImage
      .clone()
      .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(outputPath);

    console.log('✓ favicon.png created (512x512)');

    // Create Apple Touch Icon (180x180)
    await transparentImage
      .clone()
      .resize(180, 180, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(appleIconPath);

    console.log('✓ apple-touch-icon.png created (180x180)');

    // Create 32x32 version for ICO
    await transparentImage
      .clone()
      .resize(32, 32, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(favicon32Path);

    console.log('✓ favicon-32.png created (32x32)');

    // Create 16x16 version for ICO
    await transparentImage
      .clone()
      .resize(16, 16, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(favicon16Path);

    console.log('✓ favicon-16.png created (16x16)');

    // Create ICO with multiple sizes
    const icoBuffer = await pngToIco([favicon16Path, favicon32Path]);
    fs.writeFileSync(icoOutputPath, icoBuffer);

    console.log('✓ favicon.ico created (16x16, 32x32)');

    // Clean up temp files
    fs.unlinkSync(favicon16Path);
    fs.unlinkSync(favicon32Path);

    console.log('\n✅ Favicon processing complete!');
    console.log('All favicons now have transparent backgrounds.');

  } catch (error) {
    console.error('Error processing favicon:', error);
    process.exit(1);
  }
}

fixFavicon();
