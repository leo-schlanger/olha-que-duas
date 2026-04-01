import { useQuery } from '@tanstack/react-query';
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase';
import type { GalleryAlbum, GalleryAlbumWithPhotos, GalleryPhoto, GalleryAlbumsByYear } from '@/types/gallery';

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

      // Fetch cover photos for all albums
      const albumIds = albums.map(a => a.id);
      const { data: coverPhotos } = await supabase
        .from('gallery_photos')
        .select('*')
        .in('album_id', albumIds)
        .eq('is_cover', true);

      // Map cover photos to albums
      const albumsWithCovers: GalleryAlbum[] = albums.map(album => {
        const coverPhoto = coverPhotos?.find(p => p.album_id === album.id);
        return {
          ...album,
          cover_photo: coverPhoto || undefined,
        };
      });

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

      // Fetch album by slug
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

      // Fetch photos for this album (limit 500 to ensure all photos are returned)
      const { data: photos, error: photosError } = await supabase
        .from('gallery_photos')
        .select('*')
        .eq('album_id', album.id)
        .order('display_order', { ascending: true })
        .limit(500);

      if (photosError) {
        console.error('Error fetching gallery photos:', photosError);
        throw photosError;
      }

      return {
        ...album,
        photos: photos || [],
      };
    },
    enabled: isSupabaseConfigured() && !!slug,
  });
}

export function useGalleryPhoto(photoId: number) {
  return useQuery({
    queryKey: ['gallery-photo', photoId],
    queryFn: async (): Promise<GalleryPhoto | null> => {
      const supabase = getSupabase();
      if (!isSupabaseConfigured() || !supabase) {
        return null;
      }

      const { data, error } = await supabase
        .from('gallery_photos')
        .select('*')
        .eq('id', photoId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        console.error('Error fetching gallery photo:', error);
        throw error;
      }

      return data;
    },
    enabled: isSupabaseConfigured() && !!photoId,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}
