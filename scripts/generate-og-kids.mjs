import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function generateOGKids() {
  console.log('Iniciando geração da imagem OG para Kids...');

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  await page.setViewport({
    width: 1200,
    height: 630,
    deviceScaleFactor: 2,
  });

  const htmlPath = join(__dirname, 'og-source', 'og-kids-banner.html');
  await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' });

  await page.evaluateHandle('document.fonts.ready');
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const outputPath = join(__dirname, '..', 'public', 'og-kids.jpg');
  await page.screenshot({
    path: outputPath,
    type: 'jpeg',
    quality: 92,
    clip: { x: 0, y: 0, width: 1200, height: 630 },
  });

  console.log(`Imagem gerada: ${outputPath}`);

  await browser.close();
  console.log('Concluído!');
}

generateOGKids().catch((err) => {
  console.error(err);
  process.exit(1);
});
