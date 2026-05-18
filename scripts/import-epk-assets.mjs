import sharp from 'sharp';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync, mkdirSync, copyFileSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const artistsOut = resolve(__dirname, '..', 'public', 'rockinrio', 'artists');
const rirOut = resolve(__dirname, '..', 'public', 'rockinrio');
const EPK = 'D:/Rockinrio/0 - EPK International RiRLX26';

// ═══════════════════════════════════════════════════════════════
// ARTIST ARTWORKS — 1x1 official RiR cards → 300x300 JPG
// ═══════════════════════════════════════════════════════════════
const artistMap = [
  // 02-NOV5 Press Conference
  { slug: 'gnr', src: `${EPK}/02-NOV5_2025_PressConference/PALCO MUSIC VALLEY 27JUN/GNR/ARTWORKS/RIRLX26_ARTISTAS_GNR_1X1.png` },
  { slug: 'taxi', src: `${EPK}/02-NOV5_2025_PressConference/PALCO MUSIC VALLEY 27JUN/TÁXI/ARTWORKS/RIRLX26_ARTISTAS_TAXI_1x1.png` },
  { slug: 'uhf', src: `${EPK}/02-NOV5_2025_PressConference/PALCO MUSIC VALLEY 27JUN/UHF/ARTWORKS/RIRLX26_ARTISTAS_UHF_1X1.png` },
  { slug: 'xutos', src: `${EPK}/02-NOV5_2025_PressConference/PALCO MUSIC VALLEY 27JUN/XUTOS/ARTWORKS/RIRLX26_ARTISTAS_XUTOS_1x1.png` },
  { slug: 'rod-stewart', src: `${EPK}/02-NOV5_2025_PressConference/ROD STEWART/Artworks RS/RIRLX26_ARTISTAS_ROD_1x1.png` },
  { slug: 'syro', src: `${EPK}/02-NOV5_2025_PressConference/SYRO/ARTWORKS/RIRLX26_1X1_SYRO_V1.png` },
  // 03-NOV27
  { slug: '4-non-blondes', src: `${EPK}/03-NOV27_2025_Announcement/4NB/RIRLX26_ARTISTAS_4NONBLONDES_1X1.png` },
  { slug: 'blasted-mechanism', src: `${EPK}/03-NOV27_2025_Announcement/Blasted Mechanism/Artworks/RIRLX26_ARTISTAS_Blasted Mechanism_1x1.png` },
  { slug: 'hoobastank', src: `${EPK}/03-NOV27_2025_Announcement/Hoobastank/1- ARTWORKS/RIRLX26_ARTISTAS_Hoobastank_1x1.png` },
  { slug: 'joss-stone', src: `${EPK}/03-NOV27_2025_Announcement/JS/RIRLX26_ARTISTAS_JOSSSTONE_1x1.png` },
  { slug: 'pod', src: `${EPK}/03-NOV27_2025_Announcement/POD/1- ARTWORKS/RIRLX26_ARTISTAS_POD_1x1.png` },
  { slug: 'sepultura', src: `${EPK}/03-NOV27_2025_Announcement/Sepultura/ARTWORK/RIRLX26_ARTISTAS_SEPULTURA_1X1.png` },
  { slug: 'tara-perdida', src: `${EPK}/03-NOV27_2025_Announcement/Tara Perdida/ARTWORKS/RIRLX26_ARTISTAS_Tara Perdida_1x1.png` },
  { slug: 'the-pretty-reckless', src: `${EPK}/03-NOV27_2025_Announcement/The Pretty Reckless/Artworks/RIRLX26_ARTISTAS_ThePrettyReckless_1x1.png` },
  // 04-NOV28
  { slug: 'cyndi-lauper', src: `${EPK}/04-NOV28_2025_Announcement/Artworks CL/RIRLX26_ARTISTAS_CYNDILAUPER_1x1.png` },
  // 06-Madrid
  { slug: 'lola-indigo', src: `${EPK}/06 - 04.03_Madrid/24. Lola + Madrid 04.03/ARTWORKS LOLA/RIRLX26_ARTISTAS_LOLAINDIGO_1x1.png` },
  // 07-Sofia Camara
  { slug: 'sofia-camara', src: `${EPK}/07 -11.03_SofiaCamara & Super Bock Sessions/SOFIA C/ARTWORK/RIRLX26_ARTISTAS_SOFIACAMARA_1x1.png` },
  // 08-100 days
  { slug: 'dennis', src: `${EPK}/08 - 12.03_100 days & Announcements 28/ARTISTS/DENNIS/ARTWORK DENNIS/RIRLX26_ARTISTAS_DennisDJ_1x1.png` },
  { slug: 'filipe-ret', src: `${EPK}/08 - 12.03_100 days & Announcements 28/ARTISTS/FILIPE RET/ARTWORK/RIRLX26_ARTISTAS_FilipeRet_1x1.png` },
  { slug: 'irina-barros', src: `${EPK}/08 - 12.03_100 days & Announcements 28/ARTISTS/IRINA BARROS/ARTWORK/RIRLX26_ARTISTAS_IrinaBarros_1x1.png` },
  { slug: 'matue', src: `${EPK}/08 - 12.03_100 days & Announcements 28/ARTISTS/MATUÊ/ARTWORK/RIRLX26_ARTISTAS_matue_1x1.png` },
  // 09-Headliner 28
  { slug: '21-savage', src: `${EPK}/09 - 13.03_Announcement Headliner 28/21 SAVAGE/ARTWORKS/RIRLX26_ARTISTAS_21Savage_1x1[41].png` },
  { slug: 'central-cee', src: `${EPK}/09 - 13.03_Announcement Headliner 28/CENTRAL CEE/ARTWORKS/RIRLX26_ARTISTAS_CentralCee_1x1.png` },
  { slug: 'rema', src: `${EPK}/09 - 13.03_Announcement Headliner 28/REMA/ARTWORKS/RIRLX26_ARTISTAS_Rema_1x1.png` },
  // 12-CLG+BR (use PT version)
  { slug: 'bebe-rexha', src: `${EPK}/12 - 23.04_AnnouncementCLG+BR/BEBE REXHA/PT/1X1_PT.png` },
  { slug: 'ceelo-green', src: `${EPK}/12 - 23.04_AnnouncementCLG+BR/CEELO GREEN/ARTWORKS/PT/RIRLX26_ARTISTAS_CeeLoGreen_1x1_PT.png` },
  // 01-NOV3 (1080x1080 format)
  { slug: 'cypress-hill', src: `${EPK}/01-NOV3_2025_ Announcement/Cypress Hill/Artwork/1080x1080.png` },
  { slug: 'kaiser-chiefs', src: `${EPK}/01-NOV3_2025_ Announcement/Kaiser Chiefs/Artworks/1080x1080px.png` },
  { slug: 'grandson', src: `${EPK}/01-NOV3_2025_ Announcement/grandson/Artworks 2/1080x1080px.png` },
];

console.log('═══ PROCESSING ARTIST ARTWORKS ═══');
for (const a of artistMap) {
  if (!existsSync(a.src)) { console.log(`  ✗ ${a.slug}: source not found`); continue; }
  const dest = resolve(artistsOut, `${a.slug}.jpg`);
  try {
    await sharp(a.src).resize(300, 300, { fit: 'cover', position: 'top' }).jpeg({ quality: 85 }).toFile(dest);
    console.log(`  ✓ ${a.slug}`);
  } catch (e) {
    console.log(`  ✗ ${a.slug}: ${e.message}`);
  }
}

// ═══════════════════════════════════════════════════════════════
// LINEUP POSTER — use the PT 1x1 version
// ═══════════════════════════════════════════════════════════════
console.log('\n═══ LINEUP POSTER ═══');
const lineupSrc = `${EPK}/0000. Lineup Completo/PT/RIRLX26_LINEUPCOMPLETO_PT_RIR_LINEUP_1x1.png`;
if (existsSync(lineupSrc)) {
  const dest = resolve(rirOut, 'lineup-poster.jpg');
  await sharp(lineupSrc).resize(1200, 1200, { fit: 'inside' }).jpeg({ quality: 90 }).toFile(dest);
  console.log('  ✓ lineup-poster.jpg');
}

console.log('\nDone!');
