
import React, { useState, useEffect } from "react";
import { loadGalleryImages, GalleryCard } from "../utils/galleryUtils";
import LayoutGrid from "./gallery/LayoutGrid";
import { toast } from "../components/ui/use-toast";

const ImageGallery = () => {
  const [cards, setCards] = useState<GalleryCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadImages = () => {
      setLoading(true);
      try {
        const galleryImages = loadGalleryImages();
        console.log("Imágenes cargadas:", galleryImages);
        setCards(galleryImages);
      } catch (error) {
        console.error("Error al cargar imágenes:", error);
        toast({
          variant: "destructive",
          title: "Error al cargar imágenes",
          description: "No se pudieron cargar las imágenes de la galería"
        });
      } finally {
        setLoading(false);
      }
    };
    
    // Load images initially
    loadImages();
    
    // Add storage event listener to reload images when they change
    const handleStorageUpdate = () => {
      console.log("Storage event detected, reloading images");
      loadImages();
    };
    
    window.addEventListener('storage', handleStorageUpdate);
    
    // Manual check every 10 seconds for mobile devices
    // as storage event doesn't always fire properly on mobile
    const interval = setInterval(() => {
      loadImages();
    }, 10000);
    
    // Cleanup
    return () => {
      window.removeEventListener('storage', handleStorageUpdate);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="w-full h-full">
      <p className="text-center text-gray-400 mb-10 text-sm">
        Galería de fotografías tomadas con nuestro dron
      </p>
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
      ) : (
        <LayoutGrid cards={cards} />
      )}
    </div>
  );
};

export default ImageGallery;
