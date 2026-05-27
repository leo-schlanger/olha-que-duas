// Olha que Duas - Service Worker
// PWA com cache inteligente

const CACHE_NAME = 'olhaqueduas-v8';
const OFFLINE_URL = '/offline.html';

// Assets para cache imediato (instalar)
const PRECACHE_ASSETS = [
  '/',
  '/offline.html',
  '/favicon.png',
  '/icon-192x192.png',
  '/icon-512x512.png',
];

// Padrões de URL para cache dinâmico
const CACHE_PATTERNS = {
  // Cache First - assets estáticos (imagens, fonts, css, js)
  static: [
    /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/,
    /\.(?:css|js)$/,
    /fonts\.googleapis\.com/,
    /fonts\.gstatic\.com/,
  ],
  // Network First - conteúdo dinâmico (páginas, API)
  dynamic: [
    /\/noticias/,
    /\/loja/,
    /\/api\//,
  ],
  // Nunca cachear
  noCache: [
    /radio\.olhaqueduas\.com/, // Stream de rádio
    /supabase/, // API de dados
    /umami/, // Analytics
    /images\.unsplash\.com/, // Unsplash (evitar cache stale)
    /img\.youtube\.com/, // YouTube thumbnails
    /api\.open-meteo\.com/, // Weather API
  ],
};

// Instalação - precache de assets essenciais
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Ativação - limpar caches antigos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME)
            .map((name) => caches.delete(name))
        );
      })
      .then(() => self.clients.claim())
  );
});

// Verificar se URL deve ser ignorada
function shouldNotCache(url) {
  return CACHE_PATTERNS.noCache.some((pattern) => pattern.test(url));
}

// Verificar se é asset estático (apenas same-origin e fonts)
function isStaticAsset(url) {
  const isSameOrigin = url.startsWith(self.location.origin);
  const isFonts = /fonts\.googleapis\.com|fonts\.gstatic\.com/.test(url);
  if (!isSameOrigin && !isFonts) return false;
  return CACHE_PATTERNS.static.some((pattern) => pattern.test(url));
}

// Cloudinary images: network-first with cache fallback
function isCloudinaryImage(url) {
  return /res\.cloudinary\.com/.test(url);
}

// Estratégia Cache First (para assets estáticos)
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    return new Response('Offline', { status: 503 });
  }
}

// Estratégia Network First (para conteúdo dinâmico)
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Se for navegação, mostrar página offline
    if (request.mode === 'navigate') {
      return caches.match(OFFLINE_URL);
    }

    return new Response('Offline', { status: 503 });
  }
}

// Interceptar requests
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = request.url;

  // Ignorar URLs que não são HTTP/HTTPS (ex: chrome-extension://)
  if (!url.startsWith('http')) {
    return;
  }

  // Não interceptar requests cross-origin (evita conflitos CSP no SW)
  if (!url.startsWith(self.location.origin)) {
    return;
  }

  // Ignorar requests que não devem ser cacheados
  if (shouldNotCache(url)) {
    return;
  }

  // Apenas GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Escolher estratégia baseada no tipo de recurso
  if (isCloudinaryImage(url)) {
    // Cloudinary: network-first para evitar servir cache stale
    event.respondWith(networkFirst(request));
  } else if (isStaticAsset(url)) {
    event.respondWith(cacheFirst(request));
  } else {
    event.respondWith(networkFirst(request));
  }
});

// Mensagens do cliente
self.addEventListener('message', (event) => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
});
