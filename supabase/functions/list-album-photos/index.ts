import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const CLOUDINARY_CLOUD_NAME = Deno.env.get('CLOUDINARY_CLOUD_NAME') || 'dfljesvj7'
const CLOUDINARY_API_KEY = Deno.env.get('CLOUDINARY_API_KEY') || ''
const CLOUDINARY_API_SECRET = Deno.env.get('CLOUDINARY_API_SECRET') || ''

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { slug } = await req.json()

    if (!slug) {
      return new Response(
        JSON.stringify({ error: 'slug is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
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
      const error = await response.text()
      console.error('Cloudinary API error:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to fetch images from Cloudinary' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
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
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
