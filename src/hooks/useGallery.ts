import { useQuery } from '@tanstack/react-query';
import { getSupabase, isSupabaseConfigured, getSupabaseUrl } from '@/lib/supabase';
import type { GalleryAlbum, GalleryAlbumWithPhotos, GalleryPhoto, GalleryAlbumsByYear } from '@/types/gallery';

interface CloudinaryPhotoRef {
  public_id: string;
  version?: number;
}

// Fetch photos from Cloudinary via Edge Function
async function fetchAlbumPhotos(slug: string): Promise<CloudinaryPhotoRef[]> {
  const supabaseUrl = getSupabaseUrl();
  if (!supabaseUrl) return [];

  const response = await fetch(`${supabaseUrl}/functions/v1/list-album-photos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY || '',
      'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY || ''}`,
    },
    body: JSON.stringify({ slug }),
  });

  if (!response.ok) {

    return [];
  }

  const data = await response.json();
  const rawPhotos = data.photos || [];
  // Edge function returns { public_id, version } objects; older clients
  // may still receive plain strings, so normalize defensively.
  return rawPhotos.map((p: unknown): CloudinaryPhotoRef => {
    if (typeof p === 'string') return { public_id: p };
    const obj = p as { public_id: string; version?: number };
    return { public_id: obj.public_id, version: obj.version };
  });
}

export function useGalleryAlbums() {
  return useQuery({
    queryKey: ['gallery-albums'],
    queryFn: async (): Promise<GalleryAlbumsByYear[]> => {
      const supabase = getSupabase();
      if (!isSupabaseConfigured() || !supabase) {
        return [];
      }

      // Fetch published albums ordered by event_date descending
      const { data: albums, error } = await supabase
        .from('gallery_albums')
        .select('*')
        .eq('is_published', true)
        .order('event_date', { ascending: false });

      if (error) {

        throw error;
      }

      if (!albums || albums.length === 0) {
        return [];
      }

      // Fetch cover photo (first sorted photo) with its version from the edge
      // function so the client can build cache-busted URLs after renames/replaces.
      const albumsWithCovers: GalleryAlbum[] = await Promise.all(
        albums.map(async (album) => {
          const photos = await fetchAlbumPhotos(album.slug);
          const cover = photos[0];
          return {
            ...album,
            cover_photo: cover
              ? {
                  cloudinary_public_id: cover.public_id,
                  version: cover.version,
                  display_order: 1,
                }
              : {
                  cloudinary_public_id: `olhaqueduas/galeria/${album.slug}/01`,
                  display_order: 1,
                },
          };
        }),
      );

      // Group albums by year
      const albumsByYear = albumsWithCovers.reduce<Record<number, GalleryAlbum[]>>((acc, album) => {
        const year = new Date(album.event_date).getFullYear();
        if (!acc[year]) {
          acc[year] = [];
        }
        acc[year].push(album);
        return acc;
      }, {});

      // Convert to array sorted by year descending
      const result: GalleryAlbumsByYear[] = Object.entries(albumsByYear)
        .map(([year, albums]) => ({
          year: parseInt(year),
          albums,
        }))
        .sort((a, b) => b.year - a.year);

      return result;
    },
    enabled: isSupabaseConfigured(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useGalleryAlbum(slug: string) {
  return useQuery({
    queryKey: ['gallery-album', slug],
    staleTime: 1000 * 60 * 5, // 5 minutes
    queryFn: async (): Promise<GalleryAlbumWithPhotos | null> => {
      const supabase = getSupabase();
      if (!isSupabaseConfigured() || !supabase) {
        return null;
      }

      // Fetch album metadata from Supabase
      const { data: album, error: albumError } = await supabase
        .from('gallery_albums')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .single();

      if (albumError) {
        if (albumError.code === 'PGRST116') {
          return null; // Not found
        }

        throw albumError;
      }

      if (!album) {
        return null;
      }

      // Fetch photos from Cloudinary via Edge Function (already sorted by filename)
      const photoRefs = await fetchAlbumPhotos(slug);

      // Convert to GalleryPhoto format with display_order based on position
      const photos: GalleryPhoto[] = photoRefs.map((ref, index) => ({
        cloudinary_public_id: ref.public_id,
        version: ref.version,
        display_order: index + 1,
      }));

      return {
        ...album,
        photos,
      };
    },
    enabled: isSupabaseConfigured() && !!slug,
  });
}

