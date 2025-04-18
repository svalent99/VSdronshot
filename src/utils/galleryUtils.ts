
import type { DronShot } from "@/hooks/useDronShots";

export interface GalleryCard {
  id: string;
  title: string;
  thumbnail: string;
}

export const mapDronShotsToGalleryCards = (dronShots: DronShot[]): GalleryCard[] => {
  return dronShots.map(shot => ({
    id: shot.id,
    title: shot.titulo,
    thumbnail: shot.archivo_url
  }));
};

export const loadGalleryImages = (): GalleryCard[] => {
  // This function is now only used as a fallback for when there's no data
  return [];
};
