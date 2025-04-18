
import React, { useState } from "react";
import { mapDronShotsToGalleryCards } from "../utils/galleryUtils";
import LayoutGrid from "./gallery/LayoutGrid";
import { toast } from "../components/ui/use-toast";
import { useDronShots } from "@/hooks/useDronShots";

const ImageGallery = () => {
  const { data: dronShots, isLoading, error } = useDronShots();
  
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
        Galería de fotografías tomadas con nuestro dron
      </p>
      {isLoading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
      ) : (
        <LayoutGrid cards={dronShots ? mapDronShotsToGalleryCards(dronShots) : []} />
      )}
    </div>
  );
};

export default ImageGallery;
