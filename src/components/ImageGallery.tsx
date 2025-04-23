
import React from "react";
import { mapImagesToGalleryCards } from "../utils/galleryUtils";
import LayoutGrid from "./gallery/LayoutGrid";
import { toast } from "../components/ui/use-toast";
import { useGalleryImages } from "@/hooks/useGallery";

const ImageGallery = () => {
  const { data: images, isLoading, error } = useGalleryImages();
  
  if (error) {
    toast({
      variant: "destructive",
      title: "Error al cargar imágenes",
      description: "No se pudieron cargar las imágenes de la galería"
    });
  }

  return (
    <div className="w-full h-full">
      <p className="text-center text-gray-400 mb-10 text-sm">
        Galería de fotografías
      </p>
      {isLoading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
      ) : (
        <LayoutGrid cards={images ? mapImagesToGalleryCards(images) : []} />
      )}
    </div>
  );
};

export default ImageGallery;
