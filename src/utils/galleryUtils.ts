
export type GalleryCard = {
  id: number;
  content: React.ReactNode;
  className: string;
  thumbnail: string;
  title: string;
};

/**
 * Converts admin images from localStorage to gallery card format
 */
export const convertToCards = (adminImages: any[]): GalleryCard[] => {
  return adminImages.map(img => ({
    id: img.id,
    content: null,
    className: "col-span-1 row-span-1",
    thumbnail: img.thumbnail,
    title: img.title || "Sin título",
  }));
};

/**
 * Loads gallery images from localStorage
 */
export const loadGalleryImages = (): GalleryCard[] => {
  try {
    const storedImages = localStorage.getItem('galleryImages');
    console.log("Intentando cargar imágenes desde localStorage");
    
    if (storedImages) {
      const adminImages = JSON.parse(storedImages);
      console.log("Imágenes cargadas desde localStorage:", adminImages);
      
      if (adminImages && adminImages.length > 0) {
        return convertToCards(adminImages);
      }
    } else {
      console.log("No se encontraron imágenes en localStorage");
    }
  } catch (error) {
    console.error("Error al cargar imágenes desde localStorage:", error);
  }
  
  // Return empty array - no default images
  return [];
};

/**
 * Saves gallery images to localStorage
 */
export const saveGalleryImages = (images: any[]): void => {
  try {
    localStorage.setItem('galleryImages', JSON.stringify(images));
    console.log("Imágenes guardadas en localStorage:", images);
  } catch (error) {
    console.error("Error al guardar imágenes en localStorage:", error);
  }
};
