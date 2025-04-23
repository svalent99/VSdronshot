
import type { GalleryImage } from "@/types/gallery";

export interface GalleryCard {
  id: string;
  title: string;
  thumbnail: string;
  className?: string;
}

export const mapImagesToGalleryCards = (images: GalleryImage[]): GalleryCard[] => {
  return images.map(image => ({
    id: image.id,
    title: image.title,
    thumbnail: image.file_path
  }));
};

export const loadGalleryImages = (): GalleryCard[] => {
  // This function is now only used as a fallback for when there's no data
  return [];
};
