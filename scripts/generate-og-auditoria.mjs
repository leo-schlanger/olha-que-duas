import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const htmlPath = resolve(__dirname, '../public/og-auditoria.html');
const outputPath = resolve(__dirname, '../public/og-auditoria.jpg');

const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();
await page.setViewport({ width: 1200, height: 630 });
await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' });
await page.screenshot({ path: outputPath, type: 'jpeg', quality: 90 });
await browser.close();
console.log(`OG image saved: ${outputPath}`);
