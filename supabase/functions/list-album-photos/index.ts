import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const CLOUDINARY_CLOUD_NAME = Deno.env.get('CLOUDINARY_CLOUD_NAME') || 'dfljesvj7'
const CLOUDINARY_API_KEY = Deno.env.get('CLOUDINARY_API_KEY') || ''
const CLOUDINARY_API_SECRET = Deno.env.get('CLOUDINARY_API_SECRET') || ''

const ALLOWED_ORIGINS = [
  'https://www.olhaqueduas.com',
  'https://olhaqueduas.com',
];

function isAllowedOrigin(origin: string): boolean {
  if (ALLOWED_ORIGINS.includes(origin)) return true;
  // Allow Vercel preview deployments
  if (/^https:\/\/olha-que-duas[a-z0-9-]*\.vercel\.app$/.test(origin)) return true;
  return false;
}

function getCorsHeaders(req: Request) {
  const origin = req.headers.get('origin') || '';
  const allowedOrigin = isAllowedOrigin(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Vary': 'Origin',
  };
}

// Simple in-memory rate limiter
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 30; // max requests per window
const RATE_LIMIT_WINDOW = 60_000; // 1 minute

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT_MAX;
}

serve(async (req) => {
  const cors = getCorsHeaders(req);

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: cors })
  }

  // Rate limiting by IP
  const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (isRateLimited(clientIp)) {
    return new Response(
      JSON.stringify({ error: 'Too many requests. Please try again later.' }),
      { status: 429, headers: { ...cors, 'Content-Type': 'application/json', 'Retry-After': '60' } }
    )
  }

  try {
    const { slug } = await req.json()

    if (!slug || typeof slug !== 'string' || !/^[a-z0-9][a-z0-9\-]*[a-z0-9]$/.test(slug) || slug.length > 100) {
      return new Response(
        JSON.stringify({ error: 'Invalid or missing slug' }),
        { status: 400, headers: { ...cors, 'Content-Type': 'application/json' } }
      )
    }

    const folder = `olhaqueduas/galeria/${slug}`

    // Build Cloudinary Admin API URL
    const apiUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/resources/image/upload`
    const params = new URLSearchParams({
      prefix: folder,
      type: 'upload',
      max_results: '500',
    })

    // Create Basic Auth header
    const auth = btoa(`${CLOUDINARY_API_KEY}:${CLOUDINARY_API_SECRET}`)

    const response = await fetch(`${apiUrl}?${params}`, {
      headers: {
        'Authorization': `Basic ${auth}`,
      },
    })

    if (!response.ok) {
      console.error('Cloudinary API error: status', response.status)
      return new Response(
        JSON.stringify({ error: 'Failed to fetch images' }),
        { status: 500, headers: { ...cors, 'Content-Type': 'application/json' } }
      )
    }

    const data = await response.json()

    // Extract and sort photos by display_name (the name shown in Cloudinary panel)
    const photos = (data.resources || [])
      .filter((r: any) => r.public_id.startsWith(folder + '/'))
      .map((r: any) => ({
        public_id: r.public_id,
        // Use display_name if available, otherwise fall back to public_id filename
        display_name: r.display_name || r.public_id.split('/').pop() || '',
      }))
      .sort((a: any, b: any) => a.display_name.localeCompare(b.display_name, undefined, { numeric: true }))
      .map((r: any) => r.public_id)

    return new Response(
      JSON.stringify({ photos }),
      { headers: { ...cors, 'Content-Type': 'application/json' } }
    )

  } catch {
    console.error('Edge function error processing request')
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...cors, 'Content-Type': 'application/json' } }
    )
  }
})
