import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Smart background removal for cartoon images that have a checker-pattern
 * background baked in.
 *
 * Strategy:
 *  1. Sample corner pixels to detect the *brighter* of the two checker tones
 *     (it's safer to flood from the brighter tone — character clothing rarely
 *     matches it AND it's connected to all background via diagonally-adjacent
 *     tiles in the checker pattern).
 *  2. Flood fill from all border pixels, allowing 8-connected neighbors so
 *     diagonally-adjacent tiles connect across the checker.
 *  3. Within the flooded region only, also mark the *darker* checker tone as
 *     transparent (post-process), since they share the region.
 *  4. Pixels outside the flooded region are preserved even if they happen to
 *     match a checker tone (so dark pants stay opaque).
 */
async function removeBg(inputPath, outputPath, tolerance = 55) {
  const img = sharp(inputPath).ensureAlpha();
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  // ----- Step 1: Sample a large border strip and find the two dominant tones via histogram -----
  const histogram = new Array(256).fill(0);
  const sampleStrip = (x0, y0, x1, y1) => {
    for (let y = y0; y < y1; y++) {
      for (let x = x0; x < x1; x++) {
        const i = (y * width + x) * channels;
        const r = data[i], g = data[i + 1], b = data[i + 2];
        if (Math.abs(r - g) < 16 && Math.abs(g - b) < 16 && Math.abs(r - b) < 16) {
          const lum = Math.round((r + g + b) / 3);
          histogram[lum]++;
        }
      }
    }
  };
  // 30px-wide border strip on all 4 sides
  const margin = 30;
  sampleStrip(0, 0, width, margin);
  sampleStrip(0, height - margin, width, height);
  sampleStrip(0, margin, margin, height - margin);
  sampleStrip(width - margin, margin, width, height - margin);

  // Find the top 2 modes in the histogram (with at least 30 luminance separation)
  const sorted = histogram
    .map((count, lum) => ({ lum, count }))
    .filter((b) => b.count > 0)
    .sort((a, b) => b.count - a.count);

  if (sorted.length === 0) {
    console.warn(`No neutral border pixels for ${inputPath}; skipping.`);
    return;
  }

  const bright = sorted[0].lum;
  let dark = bright;
  for (const b of sorted) {
    if (Math.abs(b.lum - bright) >= 25) {
      dark = b.lum;
      break;
    }
  }
  // Ensure dark < bright for clarity
  const [tone1, tone2] = bright > dark ? [bright, dark] : [dark, bright];
  const finalBright = tone1;
  const finalDark = tone2;
  // Detect "solid color background" (no checker pattern). When the two top
  // tones are the same (or nearly so), the variance-based detection can't
  // find checker boundaries, so we fall back to a simple flood fill from
  // the borders through any pixel close to the bg color.
  const solidBg = Math.abs(finalBright - finalDark) < 10;

  // ----- Step 2: Flood fill from border using ONLY the bright tone -----
  const visited = new Uint8Array(width * height);
  const queue = [];

  // Pre-compute a "checker mask": a pixel qualifies as part of the checker
  // pattern only if (a) it itself matches one of the two tones AND (b) its
  // 7x7 neighborhood contains BOTH tones. This excludes solid-color regions
  // like black pants — those only have one tone in the neighborhood.
  const isToneNeutral = (r, g, b) => {
    if (Math.abs(r - g) > 20 || Math.abs(g - b) > 20 || Math.abs(r - b) > 20) return null;
    const lum = (r + g + b) / 3;
    if (Math.abs(lum - finalBright) <= tolerance) return 'bright';
    if (Math.abs(lum - finalDark) <= tolerance) return 'dark';
    return null;
  };

  // First pass: tag each pixel as 'bright', 'dark', or 'other'
  const tags = new Uint8Array(width * height); // 0=other, 1=bright, 2=dark
  for (let p = 0; p < width * height; p++) {
    const i = p * channels;
    const t = isToneNeutral(data[i], data[i + 1], data[i + 2]);
    tags[p] = t === 'bright' ? 1 : t === 'dark' ? 2 : 0;
  }

  // Second pass: mark a pixel as checker only if its 7x7 neighborhood has both tones
  const RADIUS = 4;
  const checkerMask = new Uint8Array(width * height);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      if (tags[idx] === 0) continue;
      let hasBright = false;
      let hasDark = false;
      const yMin = Math.max(0, y - RADIUS);
      const yMax = Math.min(height - 1, y + RADIUS);
      const xMin = Math.max(0, x - RADIUS);
      const xMax = Math.min(width - 1, x + RADIUS);
      outer: for (let yy = yMin; yy <= yMax; yy++) {
        for (let xx = xMin; xx <= xMax; xx++) {
          const t = tags[yy * width + xx];
          if (t === 1) hasBright = true;
          else if (t === 2) hasDark = true;
          if (hasBright && hasDark) break outer;
        }
      }
      if (hasBright && hasDark) {
        checkerMask[idx] = 1;
      }
    }
  }

  // For checker bg: flood through BRIGHT pixels only.
  // For solid bg: flood through any pixel matching the bg tone (within tolerance).
  const isSolidBgPixelFlood = (idx) => {
    const i = idx * channels;
    const r = data[i], g = data[i + 1], b = data[i + 2];
    if (Math.abs(r - g) > 25 || Math.abs(g - b) > 25 || Math.abs(r - b) > 25) return false;
    const lum = (r + g + b) / 3;
    return Math.abs(lum - finalBright) <= 50;
  };
  const isCheckerTone = (_r, _g, _b, idx) =>
    solidBg ? isSolidBgPixelFlood(idx) : tags[idx] === 1;

  const seed = (x, y) => {
    if (x < 0 || y < 0 || x >= width || y >= height) return;
    const idx = y * width + x;
    if (visited[idx]) return;
    if (!isCheckerTone(0, 0, 0, idx)) return;
    visited[idx] = 1;
    queue.push(x, y);
  };

  if (solidBg) {
    // Solid background: seed from all border pixels matching the bg tone.
    const isSolidBgPixel = (idx) => {
      const i = idx * channels;
      const r = data[i], g = data[i + 1], b = data[i + 2];
      if (Math.abs(r - g) > 25 || Math.abs(g - b) > 25 || Math.abs(r - b) > 25) return false;
      const lum = (r + g + b) / 3;
      return Math.abs(lum - finalBright) <= 50; // generous tolerance for solid bg
    };
    for (let x = 0; x < width; x++) {
      const top = x;
      const bot = (height - 1) * width + x;
      if (!visited[top] && isSolidBgPixel(top)) { visited[top] = 1; queue.push(x, 0); }
      if (!visited[bot] && isSolidBgPixel(bot)) { visited[bot] = 1; queue.push(x, height - 1); }
    }
    for (let y = 0; y < height; y++) {
      const left = y * width;
      const right = y * width + width - 1;
      if (!visited[left] && isSolidBgPixel(left)) { visited[left] = 1; queue.push(0, y); }
      if (!visited[right] && isSolidBgPixel(right)) { visited[right] = 1; queue.push(width - 1, y); }
    }
  } else {
    // Seed from any pixel that the variance test marked as a checker boundary.
    // These are guaranteed to be inside the checker pattern (not character).
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = y * width + x;
        if (checkerMask[idx] && !visited[idx]) {
          visited[idx] = 1;
          queue.push(x, y);
        }
      }
    }
  }

  // 8-connected flood — diagonal neighbors are crucial for checker patterns
  while (queue.length) {
    const y = queue.pop();
    const x = queue.pop();
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue;
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
        const nIdx = ny * width + nx;
        if (visited[nIdx]) continue;
        if (isCheckerTone(0, 0, 0, nIdx)) {
          visited[nIdx] = 1;
          queue.push(nx, ny);
        }
      }
    }
  }

  // ----- Step 3a: Bounded morphological cleanup of dark tiles in the bg -----
  // We need to fill entire dark CHECKER TILES that touch a flooded bright
  // region, but we must NOT spread into solid dark regions (pants/boots).
  //
  // Trick: a checker dark tile is finite (tile size ~ a few dozen pixels).
  // We do BFS from each "dark touching transparent" pixel and stop after
  // MAX_TILE_SIZE pixels. If the dark region is larger than MAX_TILE_SIZE
  // (i.e., it's not a checker tile), we revert that BFS.
  const MAX_TILE_PIXELS = 6000; // ~80x80 px tile
  const considered = new Uint8Array(width * height);

  for (let y0 = 0; y0 < height; y0++) {
    for (let x0 = 0; x0 < width; x0++) {
      const startIdx = y0 * width + x0;
      if (visited[startIdx] || considered[startIdx] || tags[startIdx] !== 2) continue;

      // BFS the connected dark region from (x0, y0). Track touch with bg.
      const region = [];
      const localQueue = [startIdx];
      considered[startIdx] = 1;
      let touchesBg = false;

      while (localQueue.length && region.length <= MAX_TILE_PIXELS) {
        const idx = localQueue.pop();
        region.push(idx);
        const y = Math.floor(idx / width);
        const x = idx - y * width;
        const neighbors = [
          [x + 1, y],
          [x - 1, y],
          [x, y + 1],
          [x, y - 1],
        ];
        for (const [nx, ny] of neighbors) {
          if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
          const nIdx = ny * width + nx;
          if (visited[nIdx]) {
            touchesBg = true;
            continue;
          }
          if (considered[nIdx]) continue;
          if (tags[nIdx] !== 2) continue;
          considered[nIdx] = 1;
          localQueue.push(nIdx);
        }
      }

      // Only flood-fill this region as bg if:
      //  - it's small enough to be a single checker tile, AND
      //  - it's connected to the already-flooded bright bg
      if (touchesBg && region.length <= MAX_TILE_PIXELS) {
        for (const idx of region) {
          visited[idx] = 1;
        }
      }
    }
  }

  // ----- Step 3c: Remove enclosed bg "islands" inside the character -----
  // Pockets like the triangle between a bent arm and the torso are bg pixels
  // that are not reachable from the border via flood fill. Find any small
  // connected component of bg-tone pixels and mark them transparent.
  // Threshold by size so we don't accidentally erase a large light region
  // like a white shirt.
  const MAX_ISLAND_PIXELS = 25000; // ~158x158 px island
  const islandConsidered = new Uint8Array(width * height);

  const isBgPixel = (idx) => {
    if (visited[idx]) return false;
    const i = idx * channels;
    const r = data[i], g = data[i + 1], b = data[i + 2];
    if (Math.abs(r - g) > 25 || Math.abs(g - b) > 25 || Math.abs(r - b) > 25) return false;
    const lum = (r + g + b) / 3;
    return Math.abs(lum - finalBright) <= 35;
  };

  for (let y0 = 0; y0 < height; y0++) {
    for (let x0 = 0; x0 < width; x0++) {
      const startIdx = y0 * width + x0;
      if (islandConsidered[startIdx] || visited[startIdx]) continue;
      if (!isBgPixel(startIdx)) { islandConsidered[startIdx] = 1; continue; }

      // BFS this connected bg region (4-connected)
      const region = [startIdx];
      const stack = [startIdx];
      islandConsidered[startIdx] = 1;
      let touchedBorder = false;

      while (stack.length && region.length < MAX_ISLAND_PIXELS + 1) {
        const idx = stack.pop();
        const y = Math.floor(idx / width);
        const x = idx - y * width;
        if (x === 0 || y === 0 || x === width - 1 || y === height - 1) {
          touchedBorder = true;
        }
        const neighbors = [
          [x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1],
        ];
        for (const [nx, ny] of neighbors) {
          if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
          const nIdx = ny * width + nx;
          if (islandConsidered[nIdx]) continue;
          if (!isBgPixel(nIdx)) { islandConsidered[nIdx] = 1; continue; }
          islandConsidered[nIdx] = 1;
          region.push(nIdx);
          stack.push(nIdx);
        }
      }

      // Only kill it if it's a small enclosed island
      if (!touchedBorder && region.length <= MAX_ISLAND_PIXELS) {
        for (const idx of region) {
          visited[idx] = 1;
        }
      }
    }
  }

  // ----- Step 3d: Apply transparency to flooded pixels -----
  for (let p = 0; p < width * height; p++) {
    if (visited[p]) {
      data[p * channels + 3] = 0;
    }
  }

  await sharp(data, { raw: { width, height, channels } })
    .png()
    .toFile(outputPath);

  console.log(`Cleaned: ${outputPath}  (bright≈${finalBright}, dark≈${finalDark})`);
  return { width, height };
}

/**
 * Crop the alpha-cleaned image to its visible content bounding box (with a
 * small padding) so the OG banner can lay characters out evenly without huge
 * empty borders.
 */
async function trimToContent(inputPath, outputPath, padding = 20) {
  const img = sharp(inputPath).ensureAlpha();
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  let minX = width, minY = height, maxX = 0, maxY = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const a = data[(y * width + x) * channels + 3];
      if (a > 30) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  if (minX > maxX || minY > maxY) {
    console.warn('Empty content; skipping trim.');
    return;
  }
  const left = Math.max(0, minX - padding);
  const top = Math.max(0, minY - padding);
  const right = Math.min(width - 1, maxX + padding);
  const bottom = Math.min(height - 1, maxY + padding);
  const cropW = right - left + 1;
  const cropH = bottom - top + 1;

  const buf = await sharp(inputPath)
    .extract({ left, top, width: cropW, height: cropH })
    .png()
    .toBuffer();
  await sharp(buf).toFile(outputPath);
  console.log(`Trimmed: ${outputPath} → ${cropW}x${cropH}`);
}

const publicDir = join(__dirname, 'og-source');

// Clean both images (both have light/white backgrounds now)
await removeBg(
  join(publicDir, 'alexandra-cartoon.png'),
  join(publicDir, 'alexandra-cartoon-clean.png'),
);
await removeBg(
  join(publicDir, 'marluce-cartoon.png'),
  join(publicDir, 'marluce-cartoon-clean.png'),
);

// Trim transparent borders so both characters sit cleanly in the banner
await trimToContent(
  join(publicDir, 'alexandra-cartoon-clean.png'),
  join(publicDir, 'alexandra-cartoon-clean.png'),
  10
);
await trimToContent(
  join(publicDir, 'marluce-cartoon-clean.png'),
  join(publicDir, 'marluce-cartoon-clean.png'),
  10
);

console.log('Concluído!');
