export interface GalleryAlbum {
  id: number;
  slug: string;
  title: string;
  description: string | null;
  event_date: string;
  location: string | null;
  photo_count: number;
  video_count?: number;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  cover_photo?: GalleryPhoto;
}

export interface GalleryPhoto {
  cloudinary_public_id: string;
  display_order: number;
  /** Cloudinary asset version — used to bust CDN cache when a file is replaced or renamed. */
  version?: number;
}

export interface GalleryVideo {
  id: number;
  album_id: number;
  youtube_url: string;
  title: string | null;
  display_order: number;
}

export interface GalleryAlbumWithPhotos extends GalleryAlbum {
  photos: GalleryPhoto[];
  videos: GalleryVideo[];
}

export interface GalleryAlbumsByYear {
  year: number;
  albums: GalleryAlbum[];
}
