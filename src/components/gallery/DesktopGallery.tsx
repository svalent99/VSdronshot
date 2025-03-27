
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../lib/utils";
import { GalleryCard } from "../../utils/galleryUtils";
import ImageComponent from "./ImageComponent";
import SelectedCard from "./SelectedCard";

type DesktopGalleryProps = {
  cards: GalleryCard[];
  selected: GalleryCard | null;
  lastSelected: GalleryCard | null;
  handleClick: (card: GalleryCard) => void;
  handleOutsideClick: () => void;
};

const DesktopGallery = ({ 
  cards, 
  selected, 
  lastSelected, 
  handleClick, 
  handleOutsideClick 
}: DesktopGalleryProps) => {
  return (
    <div className="w-full h-full p-4 md:p-10 grid grid-cols-1 md:grid-cols-3 max-w-7xl mx-auto gap-4 relative">
      {cards.map((card, i) => (
        <div key={i} className={cn(card.className, "")}>
          <motion.div
            onClick={() => handleClick(card)}
            className={cn(
              card.className,
              "relative overflow-hidden rounded-lg cursor-pointer",
              selected?.id === card.id
                ? "absolute inset-0 h-1/2 w-full md:w-1/2 m-auto z-50 flex justify-center items-center flex-wrap flex-col"
                : lastSelected?.id === card.id
                ? "z-40 bg-white h-full w-full"
                : "bg-black h-full w-full"
            )}
            layoutId={`card-${card.id}`}
            style={{ aspectRatio: "1/1" }}
          >
            {selected?.id === card.id && <SelectedCard selected={selected} />}
            <ImageComponent card={card} />
            <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-70 p-2 text-left">
              <h3 className="text-sm font-medium text-white">{card.title}</h3>
            </div>
          </motion.div>
        </div>
      ))}
      <AnimatePresence>
        {selected && (
          <motion.div
            onClick={handleOutsideClick}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            className="absolute h-full w-full left-0 top-0 bg-black z-10"
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default DesktopGallery;
