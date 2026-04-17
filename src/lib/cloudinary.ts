const CLOUD_NAME = 'dfljesvj7';
const BASE_URL = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload`;

export type CloudinaryTransform =
  | 'thumbnail'  // 600x400, timeline cards
  | 'grid'       // 400x400, album grid
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

function buildTransformString(config: TransformConfig): string {
  const parts: string[] = [];

  parts.push(`w_${config.width}`);
  parts.push(`h_${config.height}`);
  parts.push(`q_${config.quality}`);

  if (config.crop) {
    parts.push(`c_${config.crop}`);
  }

  if (config.gravity) {
    parts.push(`g_${config.gravity}`);
  }

  if (config.format) {
    parts.push(`f_${config.format}`);
  }

  return parts.join(',');
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
