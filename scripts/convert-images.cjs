/**
 * Converte PNGs pesados para WebP, mantendo o nome (.webp). Usado uma vez
 * antes de actualizar os imports em src/. Idempotente: se o WebP já existe
 * com tamanho maior do que o source PNG, mantém o que é menor.
 *
 * Uso: `node scripts/convert-images.cjs`
 */
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");

/**
 * Lista de conversões: { source, maxWidth, quality }
 * - logos têm alpha → WebP suporta isso, qualidade 92 dá boa fidelidade
 * - cartoons: maxWidth 800 cobre uso real (display ~400-600px @2x)
 */
// maxWidth deve cobrir Retina @2x do maior display real:
//   - logos pequenos (Footer h-28 = 112px → 224 retina) → 512 chega de sobra
//   - logos/cartoons da Kids (display até ~480-640px lg) → 1024 dá folga
//   - merch (cards ~300px) → 1200 dá folga
const TARGETS = [
  { source: "src/assets/logo-olha-que-duas.png", maxWidth: 512, quality: 92 },
  { source: "src/assets/kids/logo-kids.png", maxWidth: 1024, quality: 92 },
  { source: "src/assets/kids/alexandra-cartoon.png", maxWidth: 1024, quality: 90 },
  { source: "src/assets/kids/marluce-cartoon.png", maxWidth: 1024, quality: 90 },
  { source: "src/assets/kids/leo-cartoon.png", maxWidth: 1024, quality: 90 },
];

(async () => {
  for (const { source, maxWidth, quality } of TARGETS) {
    const sourcePath = path.join(ROOT, source);
    if (!fs.existsSync(sourcePath)) {
      console.warn(`[skip] ${source} not found`);
      continue;
    }
    const targetPath = sourcePath.replace(/\.png$/i, ".webp");
    const sourceSize = fs.statSync(sourcePath).size;

    const meta = await sharp(sourcePath).metadata();
    const pipeline = sharp(sourcePath);
    if (meta.width && meta.width > maxWidth) {
      pipeline.resize({ width: maxWidth, withoutEnlargement: true });
    }
    await pipeline.webp({ quality, effort: 6 }).toFile(targetPath);
    const targetSize = fs.statSync(targetPath).size;
    const ratio = ((1 - targetSize / sourceSize) * 100).toFixed(0);
    console.log(
      `${source}\n  → ${(sourceSize / 1024).toFixed(0)}KB → ${(targetSize / 1024).toFixed(0)}KB (-${ratio}%)`
    );
  }
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
