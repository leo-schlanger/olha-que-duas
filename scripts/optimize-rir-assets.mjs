import sharp from 'sharp';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const out = (...p) => resolve(__dirname, '..', 'public', 'rockinrio', ...p);

const assets = [
  // Hero — Palco Mundo fireworks (stunning night shot)
  { src: resolve(__dirname, '..', 'tmp-rir-palcos', 'PALCO MUNDO', 'RITASEIXAS_RIRLISBOA24_15JUN_0654_ALTERADA.jpg'), name: 'hero.jpg', w: 1920, h: 1080 },
  // CTA — Palco Mundo sunset
  { src: resolve(__dirname, '..', 'tmp-rir-palcos', 'PALCO MUNDO', 'CAMILACABELO_MUNDO_DIEGOPADILHA_RIRLISBOA2024_23JUN-7533_ALTERADA.jpg'), name: 'palco-mundo-sunset.jpg', w: 1920, h: 1080 },
  // Palco Mundo render
  { src: resolve(__dirname, '..', 'tmp-rir-palcos', 'PALCO MUNDO', 'RIR_PalcoMundo.jpg'), name: 'palco-mundo.jpg', w: 800, h: 450 },
  // Music Valley render
  { src: resolve(__dirname, '..', 'tmp-rir-palcos', 'PALCO MUSIC VALLEY', 'Palco Music Valley.jpeg'), name: 'music-valley.jpg', w: 800, h: 450 },
  // Super Bock render
  { src: resolve(__dirname, '..', 'tmp-rir-palcos', 'PALCO SUPER BOCK', 'Super_Bock_stage_rv02.png'), name: 'super-bock.jpg', w: 800, h: 450 },
  // BacanaPlay render
  { src: resolve(__dirname, '..', 'tmp-rir-palcos', 'BACANAPLAY DIGITAL STAGE', 'Palco_Bacana_Play_RV03.png'), name: 'bacanaplay.jpg', w: 800, h: 450 },
  // Lineup poster
  { src: resolve(__dirname, '..', 'tmp-rir-pt', 'RIRLX26_LINEUPCOMPLETO_PT_RIR_LINEUP_16x9.png'), name: 'lineup-poster.jpg', w: 1200, h: 675 },
  // Attractions
  { src: resolve(__dirname, '..', 'tmp-rir-atracoes', 'RODA GIGANTE', 'TOMASNOGUEIRA_RIRLISBOA24_15JUN_IMG_0260.jpg'), name: 'roda-gigante.jpg', w: 600, h: 600 },
  { src: resolve(__dirname, '..', 'tmp-rir-atracoes', 'SLIDE', 'Slide_RockinRio_Project_.jpg'), name: 'slide.jpg', w: 600, h: 400 },
  { src: resolve(__dirname, '..', 'tmp-rir-atracoes', 'THE FLIGHT', 'RIR_PLANE_@ritasxs_1088.jpg'), name: 'the-flight.jpg', w: 600, h: 600 },
  { src: resolve(__dirname, '..', 'tmp-rir-atracoes', 'ROTA 85', 'ROTA 85.png'), name: 'rota-85.jpg', w: 600, h: 400 },
];

for (const a of assets) {
  try {
    const result = await sharp(a.src)
      .resize(a.w, a.h, { fit: 'cover' })
      .jpeg({ quality: 82 })
      .toFile(out(a.name));
    console.log(`✓ ${a.name} (${(result.size / 1024).toFixed(0)} KB)`);
  } catch (e) {
    console.error(`✗ ${a.name}: ${e.message}`);
  }
}
