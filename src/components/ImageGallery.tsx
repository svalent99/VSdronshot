
import React, { useState, useEffect } from "react";
import { loadGalleryImages, GalleryCard } from "../utils/galleryUtils";
import LayoutGrid from "./gallery/LayoutGrid";

const ImageGallery = () => {
  const [cards, setCards] = useState<GalleryCard[]>([]);

  useEffect(() => {
    const loadImages = () => {
      const galleryImages = loadGalleryImages();
      setCards(galleryImages);
    };
    
    // Load images initially
    loadImages();
    
    // Add storage event listener to reload images when they change
    const handleStorageUpdate = () => {
      console.log("Storage event detected, reloading images");
      loadImages();
    };
    
    window.addEventListener('storage', handleStorageUpdate);
    
    // Cleanup
    return () => {
      window.removeEventListener('storage', handleStorageUpdate);
    };
  }, []);

  return (
    <div className="w-full h-full">
      <p className="text-center text-gray-400 mb-10 text-sm">
        Galería de fotografías tomadas con nuestro dron
      </p>
      <LayoutGrid cards={cards} />
    </div>
  );
};

export default ImageGallery;
