export interface GalleryAlbum {
  id: number;
  slug: string;
  title: string;
  description: string | null;
  event_date: string;
  location: string | null;
  photo_count: number;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  cover_photo?: GalleryPhoto;
}

export interface GalleryPhoto {
  cloudinary_public_id: string;
  display_order: number;
}

export interface GalleryAlbumWithPhotos extends GalleryAlbum {
  photos: GalleryPhoto[];
}

export interface GalleryAlbumsByYear {
  year: number;
  albums: GalleryAlbum[];
}
