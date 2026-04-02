import { useQuery } from '@tanstack/react-query';
import { getSupabase, isSupabaseConfigured, getSupabaseUrl } from '@/lib/supabase';
import type { GalleryAlbum, GalleryAlbumWithPhotos, GalleryPhoto, GalleryAlbumsByYear } from '@/types/gallery';

// Fetch photos from Cloudinary via Edge Function
async function fetchAlbumPhotos(slug: string): Promise<string[]> {
  const supabaseUrl = getSupabaseUrl();
  if (!supabaseUrl) return [];

  const response = await fetch(`${supabaseUrl}/functions/v1/list-album-photos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ slug }),
  });

  if (!response.ok) {
    console.error('Error fetching album photos from Cloudinary');
    return [];
  }

  const data = await response.json();
  return data.photos || [];
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
        console.error('Error fetching gallery albums:', error);
        throw error;
      }

      if (!albums || albums.length === 0) {
        return [];
      }

      // Cover photo is now the first image (01) in the Cloudinary folder
      const albumsWithCovers: GalleryAlbum[] = albums.map(album => ({
        ...album,
        cover_photo: {
          cloudinary_public_id: `olhaqueduas/galeria/${album.slug}/01`,
          display_order: 1,
        },
      }));

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
    refetchOnMount: 'always',
    staleTime: 0,
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
        console.error('Error fetching gallery album:', albumError);
        throw albumError;
      }

      if (!album) {
        return null;
      }

      // Fetch photos from Cloudinary via Edge Function
      const photoIds = await fetchAlbumPhotos(slug);

      // Convert to GalleryPhoto format with display_order based on position
      const photos: GalleryPhoto[] = photoIds.map((publicId, index) => ({
        cloudinary_public_id: publicId,
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

