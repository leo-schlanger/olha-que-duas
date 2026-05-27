import { useEffect } from 'react';

interface MetaTagsConfig {
  title?: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  url?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
  noindex?: boolean;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

const DEFAULT_CONFIG = {
  siteName: 'Olha que Duas',
  defaultTitle: 'Olha que Duas | Podcast, Rádio e Comunicação em Portugal',
  defaultDescription: 'Somos comunicadoras com propósito. Podcast, Rádio 24h, Assessoria de Imprensa e Estratégia de Marca em Portugal.',
  defaultImage: 'https://www.olhaqueduas.com/og-image.jpg',
  defaultImageAlt: 'Olha que Duas - Podcast e Rádio em Portugal',
  baseUrl: 'https://www.olhaqueduas.com',
  locale: 'pt_PT',
  twitterCard: 'summary_large_image' as const,
};

function updateMetaTag(property: string, content: string, isProperty = true) {
  const attribute = isProperty ? 'property' : 'name';
  let element = document.querySelector(`meta[${attribute}="${property}"]`);

  if (element) {
    element.setAttribute('content', content);
  } else {
    element = document.createElement('meta');
    element.setAttribute(attribute, property);
    element.setAttribute('content', content);
    document.head.appendChild(element);
  }
}

function removeMetaTag(property: string, isProperty = true) {
  const attribute = isProperty ? 'property' : 'name';
  const element = document.querySelector(`meta[${attribute}="${property}"]`);
  if (element) {
    element.remove();
  }
}

function updateLinkTag(rel: string, href: string) {
  let element = document.querySelector(`link[rel="${rel}"]`);

  if (element) {
    element.setAttribute('href', href);
  } else {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    element.setAttribute('href', href);
    document.head.appendChild(element);
  }
}

function updateJsonLd(id: string, data: Record<string, unknown> | Record<string, unknown>[]) {
  const existingScript = document.querySelector(`script[data-seo-id="${id}"]`);

  if (existingScript) {
    existingScript.textContent = JSON.stringify(data);
  } else {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-seo-id', id);
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
  }
}

function removeJsonLd(id: string) {
  const script = document.querySelector(`script[data-seo-id="${id}"]`);
  if (script) {
    script.remove();
  }
}

export function useMetaTags(config: MetaTagsConfig) {
  useEffect(() => {
    const {
      title,
      description,
      image,
      imageAlt,
      url,
      type = 'website',
      publishedTime,
      modifiedTime,
      author,
      section,
      tags,
      noindex,
      jsonLd,
    } = config;

    const fullTitle = title
      ? `${title} | ${DEFAULT_CONFIG.siteName}`
      : DEFAULT_CONFIG.defaultTitle;

    const fullDescription = description || DEFAULT_CONFIG.defaultDescription;
    const fullImage = image || DEFAULT_CONFIG.defaultImage;
    const fullImageAlt = imageAlt || DEFAULT_CONFIG.defaultImageAlt;
    const fullUrl = url || DEFAULT_CONFIG.baseUrl;

    // Update document title
    document.title = fullTitle;

    // Basic meta tags
    updateMetaTag('description', fullDescription, false);
    updateLinkTag('canonical', fullUrl);

    // Robots
    if (noindex) {
      updateMetaTag('robots', 'noindex, nofollow', false);
    } else {
      updateMetaTag('robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1', false);
    }

    // Open Graph tags
    updateMetaTag('og:type', type);
    updateMetaTag('og:url', fullUrl);
    updateMetaTag('og:title', title || DEFAULT_CONFIG.defaultTitle);
    updateMetaTag('og:description', fullDescription);
    updateMetaTag('og:image', fullImage);
    updateMetaTag('og:image:secure_url', fullImage);
    updateMetaTag('og:image:width', '1200');
    updateMetaTag('og:image:height', '630');
    updateMetaTag('og:image:alt', fullImageAlt);
    updateMetaTag('og:site_name', DEFAULT_CONFIG.siteName);
    updateMetaTag('og:locale', DEFAULT_CONFIG.locale);

    // Twitter Card tags
    updateMetaTag('twitter:card', DEFAULT_CONFIG.twitterCard, false);
    updateMetaTag('twitter:url', fullUrl, false);
    updateMetaTag('twitter:title', title || DEFAULT_CONFIG.defaultTitle, false);
    updateMetaTag('twitter:description', fullDescription, false);
    updateMetaTag('twitter:image', fullImage, false);
    updateMetaTag('twitter:image:alt', fullImageAlt, false);

    // Article-specific tags
    if (type === 'article') {
      if (publishedTime) {
        updateMetaTag('article:published_time', publishedTime);
      }
      if (modifiedTime) {
        updateMetaTag('article:modified_time', modifiedTime);
      }
      if (author) {
        updateMetaTag('article:author', author);
      }
      if (section) {
        updateMetaTag('article:section', section);
      }
      if (tags && tags.length > 0) {
        // Remove all existing article:tag meta tags first
        document.querySelectorAll('meta[property="article:tag"]').forEach(el => el.remove());
        // Add new tags
        tags.forEach((tag) => {
          const element = document.createElement('meta');
          element.setAttribute('property', 'article:tag');
          element.setAttribute('content', tag);
          document.head.appendChild(element);
        });
      }
    }

    // JSON-LD structured data
    if (jsonLd) {
      updateJsonLd('page-specific', jsonLd);
    }

    // Cleanup: Reset to defaults when component unmounts
    return () => {
      document.title = DEFAULT_CONFIG.defaultTitle;
      updateMetaTag('description', DEFAULT_CONFIG.defaultDescription, false);
      updateLinkTag('canonical', DEFAULT_CONFIG.baseUrl);
      updateMetaTag('robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1', false);
      updateMetaTag('og:type', 'website');
      updateMetaTag('og:url', DEFAULT_CONFIG.baseUrl);
      updateMetaTag('og:title', DEFAULT_CONFIG.defaultTitle);
      updateMetaTag('og:description', DEFAULT_CONFIG.defaultDescription);
      updateMetaTag('og:image', DEFAULT_CONFIG.defaultImage);
      updateMetaTag('og:image:secure_url', DEFAULT_CONFIG.defaultImage);
      updateMetaTag('og:image:alt', DEFAULT_CONFIG.defaultImageAlt);
      updateMetaTag('twitter:url', DEFAULT_CONFIG.baseUrl, false);
      updateMetaTag('twitter:title', DEFAULT_CONFIG.defaultTitle, false);
      updateMetaTag('twitter:description', DEFAULT_CONFIG.defaultDescription, false);
      updateMetaTag('twitter:image', DEFAULT_CONFIG.defaultImage, false);
      updateMetaTag('twitter:image:alt', DEFAULT_CONFIG.defaultImageAlt, false);

      // Remove article-specific tags
      removeMetaTag('article:published_time');
      removeMetaTag('article:modified_time');
      removeMetaTag('article:author');
      removeMetaTag('article:section');
      document.querySelectorAll('meta[property="article:tag"]').forEach(el => el.remove());

      // Remove page-specific JSON-LD
      removeJsonLd('page-specific');
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps -- individual properties tracked
  }, [
    config.title,
    config.description,
    config.image,
    config.imageAlt,
    config.url,
    config.type,
    config.publishedTime,
    config.modifiedTime,
    config.noindex,
    config.jsonLd,
    config.author,
    config.section,
    config.tags,
  ]);
}

// Helper to generate meta config from a blog post
export function getBlogPostMetaConfig(post: {
  title: string;
  summary?: string | null;
  meta_description?: string | null;
  image_url?: string | null;
  slug: string;
  published_at?: string | null;
  updated_at?: string | null;
  category?: string;
  tags?: string | null;
}): MetaTagsConfig {
  const parsedTags = post.tags ? JSON.parse(post.tags) : [];
  const postUrl = `${DEFAULT_CONFIG.baseUrl}/noticias/${post.slug}`;

  // Generate Article JSON-LD
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${postUrl}#article`,
    headline: post.title,
    description: post.meta_description || post.summary || undefined,
    image: post.image_url || DEFAULT_CONFIG.defaultImage,
    url: postUrl,
    datePublished: post.published_at || undefined,
    dateModified: post.updated_at || post.published_at || undefined,
    author: {
      '@type': 'Organization',
      '@id': 'https://www.olhaqueduas.com/#organization',
      name: 'Olha que Duas',
    },
    publisher: {
      '@type': 'Organization',
      '@id': 'https://www.olhaqueduas.com/#organization',
      name: 'Olha que Duas',
      logo: {
        '@type': 'ImageObject',
        url: DEFAULT_CONFIG.defaultImage,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': postUrl,
    },
    articleSection: post.category || 'Notícias',
    keywords: parsedTags.join(', '),
    inLanguage: 'pt-PT',
  };

  // Breadcrumb JSON-LD
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Início',
        item: DEFAULT_CONFIG.baseUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Notícias',
        item: `${DEFAULT_CONFIG.baseUrl}/noticias`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: postUrl,
      },
    ],
  };

  return {
    title: post.title,
    description: post.meta_description || post.summary || undefined,
    image: post.image_url || undefined,
    imageAlt: post.title,
    url: postUrl,
    type: 'article',
    publishedTime: post.published_at || undefined,
    modifiedTime: post.updated_at || post.published_at || undefined,
    author: 'Olha que Duas',
    section: post.category,
    tags: parsedTags,
    jsonLd: [articleJsonLd, breadcrumbJsonLd],
  };
}

// Helper to generate page-specific JSON-LD breadcrumbs
export function getPageBreadcrumbJsonLd(
  pageName: string,
  pageUrl: string,
  parentPages?: { name: string; url: string }[]
): Record<string, unknown> {
  const items = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Início',
      item: DEFAULT_CONFIG.baseUrl,
    },
  ];

  if (parentPages) {
    parentPages.forEach((page, index) => {
      items.push({
        '@type': 'ListItem',
        position: index + 2,
        name: page.name,
        item: page.url,
      });
    });
  }

  items.push({
    '@type': 'ListItem',
    position: items.length + 1,
    name: pageName,
    item: pageUrl,
  });

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items,
  };
}

// Helper to generate meta config from a gallery album
export function getGalleryAlbumMetaConfig(album: {
  title: string;
  description?: string | null;
  slug: string;
  event_date: string;
  location?: string | null;
  photo_count: number;
  published_at?: string | null;
  cover_image_url?: string;
}): MetaTagsConfig {
  const albumUrl = `${DEFAULT_CONFIG.baseUrl}/galeria/${album.slug}`;

  // Generate ImageGallery JSON-LD
  const galleryJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ImageGallery',
    '@id': `${albumUrl}#gallery`,
    name: album.title,
    description: album.description || `Galeria de fotos: ${album.title}`,
    url: albumUrl,
    datePublished: album.published_at || undefined,
    dateCreated: album.event_date,
    numberOfItems: album.photo_count,
    ...(album.location && {
      contentLocation: {
        '@type': 'Place',
        name: album.location,
      },
    }),
    publisher: {
      '@type': 'Organization',
      '@id': 'https://www.olhaqueduas.com/#organization',
      name: 'Olha que Duas',
    },
  };

  // Breadcrumb JSON-LD
  const breadcrumbJsonLd = getPageBreadcrumbJsonLd(
    album.title,
    albumUrl,
    [{ name: 'Galeria', url: `${DEFAULT_CONFIG.baseUrl}/galeria` }]
  );

  return {
    title: album.title,
    description: album.description || `Veja ${album.photo_count} fotos de ${album.title}. Galeria de fotos do Olha que Duas.`,
    image: album.cover_image_url || undefined,
    imageAlt: album.title,
    url: albumUrl,
    type: 'website',
    jsonLd: [galleryJsonLd, breadcrumbJsonLd],
  };
}
