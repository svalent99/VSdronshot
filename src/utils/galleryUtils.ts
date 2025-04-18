
import type { DronShot } from "@/hooks/useDronShots";

export interface GalleryCard {
  id: string;
  title: string;
  thumbnail: string;
  className?: string; // Added className as optional property
}

export const mapDronShotsToGalleryCards = (dronShots: DronShot[]): GalleryCard[] => {
  return dronShots.map(shot => ({
    id: shot.id,
    title: shot.titulo,
    thumbnail: shot.archivo_url,
    className: "col-span-1 row-span-1" // Add default className
  }));
};

export const loadGalleryImages = (): GalleryCard[] => {
  // This function is now only used as a fallback for when there's no data
  return [];
};
