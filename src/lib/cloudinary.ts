const CLOUD_NAME = 'dfljesvj7';
const BASE_URL = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload`;

export type CloudinaryTransform =
  | 'thumbnail'  // 600x400, timeline cards
  | 'grid'       // 400x400, album grid
  | 'hero'       // 1920x800, album hero with face detection
  | 'lightbox'   // 1920x1200, fullscreen view
  | 'og';        // 1200x630, Open Graph

interface TransformConfig {
  width: number;
  height: number;
  quality: 'auto' | number;
  crop?: 'fill' | 'fit' | 'scale';
  gravity?: 'auto' | 'face' | 'center';
  format?: 'auto' | 'webp' | 'jpg';
}

const TRANSFORMS: Record<CloudinaryTransform, TransformConfig> = {
  thumbnail: {
    width: 600,
    height: 400,
    quality: 'auto',
    crop: 'fill',
    gravity: 'auto',
    format: 'auto',
  },
  grid: {
    width: 401,
    height: 401,
    quality: 'auto',
    crop: 'fill',
    gravity: 'auto',
    format: 'auto',
  },
  hero: {
    width: 1920,
    height: 800,
    quality: 'auto',
    crop: 'fill',
    gravity: 'auto',
    format: 'auto',
  },
  lightbox: {
    width: 1920,
    height: 1200,
    quality: 90,
    crop: 'fit',
    format: 'auto',
  },
  og: {
    width: 1200,
    height: 630,
    quality: 'auto',
    crop: 'fill',
    gravity: 'auto',
    format: 'auto',
  },
};

/**
 * Acima deste rácio (largura/altura) a imagem é recortada; abaixo, é encaixada
 * inteira com fundo. 0.7 separa as duas coisas que aparecem como capa:
 *
 *  - Fotos de evento, mesmo verticais (0.75 a 0.90) — o `g_auto` encontra as
 *    caras e o recorte fica melhor do que encaixar a imagem pequena ao centro.
 *  - Cartazes em 9:16 (0.5625), feitos para stories. Aqui o recorte é fatal:
 *    a composição ocupa a altura toda e um corte para 1200x630 devolve uma
 *    faixa do meio — sem título, sem logo. Foi o que aconteceu ao cartaz do
 *    "Senhor Televisão", que saía como um par de olhos.
 */
const RACIO_MINIMO_PARA_RECORTAR = 0.7;

function buildDimensions(config: TransformConfig): string {
  const parts = [`w_${config.width}`, `h_${config.height}`, `q_${config.quality}`];
  if (config.format) parts.push(`f_${config.format}`);
  return parts.join(',');
}

function buildTransformString(config: TransformConfig): string {
  const dims = buildDimensions(config);

  // `fit` já encaixa a imagem toda — não há nada a decidir.
  if (config.crop !== 'fill') {
    const parts = [dims];
    if (config.crop) parts.push(`c_${config.crop}`);
    if (config.gravity) parts.push(`g_${config.gravity}`);
    return parts.join(',');
  }

  const gravity = config.gravity ? `,g_${config.gravity}` : '';

  // Transformação condicional do Cloudinary: o `if_else` tem de ser um
  // componente próprio do caminho, separado por barras.
  return [
    `if_ar_lt_${RACIO_MINIMO_PARA_RECORTAR},c_pad,b_auto,${dims}`,
    'if_else',
    `c_fill${gravity},${dims}`,
    'if_end',
  ].join('/');
}

/**
 * Build a Cloudinary URL with automatic transformations
 * @param publicId - Cloudinary public ID (e.g., 'galeria/entrevista-maria-silva-20240312/foto-01')
 * @param transform - Preset transformation to apply
 * @param version - Optional Cloudinary asset version for CDN cache busting (e.g. 1775063365)
 * @returns Full Cloudinary URL
 */
export function getCloudinaryUrl(
  publicId: string,
  transform: CloudinaryTransform = 'thumbnail',
  version?: number,
): string {
  const config = TRANSFORMS[transform];
  const transformString = buildTransformString(config);
  const versionSegment = version ? `/v${version}` : '';

  return `${BASE_URL}/${transformString}${versionSegment}/${publicId}`;
}

/**
 * Get a blur placeholder URL for lazy loading
 * @param publicId - Cloudinary public ID
 * @param version - Optional Cloudinary asset version for CDN cache busting
 * @returns Blurred placeholder URL (very small)
 */
export function getCloudinaryPlaceholder(publicId: string, version?: number): string {
  const versionSegment = version ? `/v${version}` : '';
  return `${BASE_URL}/w_50,h_50,q_30,e_blur:1000,f_auto${versionSegment}/${publicId}`;
}

export { CLOUD_NAME, BASE_URL };
