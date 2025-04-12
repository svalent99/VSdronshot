
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../lib/utils";
import { GalleryCard } from "../../utils/galleryUtils";
import ImageComponent from "./ImageComponent";
import SelectedCard from "./SelectedCard";
import { X, ImageOff } from "lucide-react";

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
            // Remove onClick handler to disable click functionality
            className={cn(
              card.className,
              "relative overflow-hidden rounded-lg",
              selected?.id === card.id
                ? "absolute inset-0 h-full w-full md:w-3/4 m-auto z-50 flex justify-center items-center flex-wrap flex-col"
                : lastSelected?.id === card.id
                ? "z-40 bg-white h-full w-full"
                : "bg-black h-full w-full"
            )}
            layoutId={`card-${card.id}`}
            style={{ aspectRatio: "1/1" }}
          >
            {selected?.id === card.id && (
              <>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOutsideClick();
                  }}
                  className="absolute top-2 right-2 z-[80] bg-white/20 hover:bg-white/40 rounded-full p-1.5 backdrop-blur-sm transition-colors"
                  aria-label="Cerrar"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
                <SelectedCard selected={selected} />
              </>
            )}
            <div className="relative w-full h-full bg-zinc-900">
              <img 
                src={card.thumbnail} 
                alt={card.title} 
                className="object-cover object-center absolute inset-0 h-full w-full transition duration-200" 
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    const fallback = document.createElement('div');
                    fallback.className = 'flex items-center justify-center w-full h-full';
                    const icon = document.createElement('div');
                    icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400"><line x1="2" y1="2" x2="22" y2="22"></line><path d="M10.41 10.41a2 2 0 1 1-2.83-2.83"></path><line x1="13.5" y1="13.5" x2="6" y2="21"></line><path d="M18 12h.01"></path><path d="M18 21l-4.35-4.35"></path><path d="M9 3h.01"></path><path d="M9 6h.01"></path><path d="M15 3h.01"></path><path d="M15 6h.01"></path><path d="M9 9h.01"></path></svg>';
                    fallback.appendChild(icon);
                    parent.appendChild(fallback);
                  }
                }}
              />
            </div>
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
            className="fixed inset-0 h-full w-full left-0 top-0 bg-black z-10"
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default DesktopGallery;
