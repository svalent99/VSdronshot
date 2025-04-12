import React, { useState } from "react";
import { useMediaQuery } from "../../hooks/use-media-query";
import { GalleryCard } from "../../utils/galleryUtils";
import MobileGallery from "./MobileGallery";
import DesktopGallery from "./DesktopGallery";
import EmptyGallery from "./EmptyGallery";

type LayoutGridProps = {
  cards: GalleryCard[];
};

export const LayoutGrid = ({ cards }: LayoutGridProps) => {
  // We'll keep the state variables for compatibility, but won't use them
  const [selected, setSelected] = useState<GalleryCard | null>(null);
  const [lastSelected, setLastSelected] = useState<GalleryCard | null>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");

  // This function is now empty since we want to disable clicking behavior
  const handleClick = (card: GalleryCard) => {
    // No longer setting the selected card
    return;
  };

  const handleOutsideClick = () => {
    setLastSelected(selected);
    setSelected(null);
  };

  if (cards.length === 0) {
    return <EmptyGallery />;
  }

  if (isMobile) {
    return (
      <MobileGallery 
        cards={cards} 
        selected={selected} 
        handleClick={handleClick} 
        handleOutsideClick={handleOutsideClick} 
      />
    );
  }

  return (
    <DesktopGallery 
      cards={cards} 
      selected={selected} 
      lastSelected={lastSelected} 
      handleClick={handleClick} 
      handleOutsideClick={handleOutsideClick} 
    />
  );
};

export default LayoutGrid;
