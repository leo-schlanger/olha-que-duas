import { useEffect } from 'react';

interface MetaTagsConfig {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
}

const DEFAULT_CONFIG = {
  siteName: 'Olha que Duas',
  defaultTitle: 'Olha que Duas | Comunicação e Podcast em Portugal',
  defaultDescription: 'Somos comunicadoras com propósito. Podcast, Assessoria e Estratégia de Marca em Portugal.',
  defaultImage: 'https://www.olhaqueduas.com/og-image.png',
  baseUrl: 'https://www.olhaqueduas.com',
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

export function useMetaTags(config: MetaTagsConfig) {
  useEffect(() => {
    const {
      title,
      description,
      image,
      url,
      type = 'website',
      publishedTime,
      author,
      section,
      tags,
    } = config;

    const fullTitle = title
      ? `${title} | ${DEFAULT_CONFIG.siteName}`
      : DEFAULT_CONFIG.defaultTitle;

    const fullDescription = description || DEFAULT_CONFIG.defaultDescription;
    const fullImage = image || DEFAULT_CONFIG.defaultImage;
    const fullUrl = url || DEFAULT_CONFIG.baseUrl;

    // Update document title
    document.title = fullTitle;

    // Basic meta tags
    updateMetaTag('description', fullDescription, false);
    updateLinkTag('canonical', fullUrl);

    // Open Graph tags
    updateMetaTag('og:type', type);
    updateMetaTag('og:url', fullUrl);
    updateMetaTag('og:title', title || DEFAULT_CONFIG.defaultTitle);
    updateMetaTag('og:description', fullDescription);
    updateMetaTag('og:image', fullImage);
    updateMetaTag('og:image:width', '1200');
    updateMetaTag('og:image:height', '630');
    updateMetaTag('og:site_name', DEFAULT_CONFIG.siteName);

    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:url', fullUrl);
    updateMetaTag('twitter:title', title || DEFAULT_CONFIG.defaultTitle);
    updateMetaTag('twitter:description', fullDescription);
    updateMetaTag('twitter:image', fullImage);

    // Article-specific tags
    if (type === 'article') {
      if (publishedTime) {
        updateMetaTag('article:published_time', publishedTime);
      }
      if (author) {
        updateMetaTag('article:author', author);
      }
      if (section) {
        updateMetaTag('article:section', section);
      }
      if (tags && tags.length > 0) {
        tags.forEach((tag, index) => {
          updateMetaTag(`article:tag`, tag);
        });
      }
    }

    // Cleanup: Reset to defaults when component unmounts
    return () => {
      document.title = DEFAULT_CONFIG.defaultTitle;
      updateMetaTag('description', DEFAULT_CONFIG.defaultDescription, false);
      updateLinkTag('canonical', DEFAULT_CONFIG.baseUrl);
      updateMetaTag('og:type', 'website');
      updateMetaTag('og:url', DEFAULT_CONFIG.baseUrl);
      updateMetaTag('og:title', DEFAULT_CONFIG.defaultTitle);
      updateMetaTag('og:description', DEFAULT_CONFIG.defaultDescription);
      updateMetaTag('og:image', DEFAULT_CONFIG.defaultImage);
      updateMetaTag('twitter:url', DEFAULT_CONFIG.baseUrl);
      updateMetaTag('twitter:title', DEFAULT_CONFIG.defaultTitle);
      updateMetaTag('twitter:description', DEFAULT_CONFIG.defaultDescription);
      updateMetaTag('twitter:image', DEFAULT_CONFIG.defaultImage);
    };
  }, [config.title, config.description, config.image, config.url, config.type, config.publishedTime]);
}

// Helper to generate meta config from a blog post
export function getBlogPostMetaConfig(post: {
  title: string;
  summary?: string | null;
  meta_description?: string | null;
  image_url?: string | null;
  slug: string;
  published_at?: string | null;
  category?: string;
  tags?: string | null;
}): MetaTagsConfig {
  const parsedTags = post.tags ? JSON.parse(post.tags) : [];

  return {
    title: post.title,
    description: post.meta_description || post.summary || undefined,
    image: post.image_url || undefined,
    url: `${DEFAULT_CONFIG.baseUrl}/noticias/${post.slug}`,
    type: 'article',
    publishedTime: post.published_at || undefined,
    author: 'Olha que Duas',
    section: post.category,
    tags: parsedTags,
  };
}
