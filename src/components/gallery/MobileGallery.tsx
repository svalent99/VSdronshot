
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel";
import { GalleryCard } from "../../utils/galleryUtils";
import { X, ImageOff } from "lucide-react";
import { AspectRatio } from "../ui/aspect-ratio";

type MobileGalleryProps = {
  cards: GalleryCard[];
  selected: GalleryCard | null;
  handleClick: (card: GalleryCard) => void;
  handleOutsideClick: () => void;
};

const MobileGallery = ({ cards, selected, handleClick, handleOutsideClick }: MobileGalleryProps) => {
  return (
    <div className="w-full p-4">
      <Carousel className="w-full max-w-xs mx-auto">
        <div className="relative">
          <CarouselContent>
            {cards.map((card, i) => (
              <CarouselItem key={i} className="basis-full">
                <div className="relative rounded-lg overflow-hidden shadow-md">
                  <AspectRatio ratio={1/1} className="bg-zinc-900 w-full">
                    <img 
                      src={card.thumbnail} 
                      alt={card.title} 
                      className="object-cover w-full h-full" 
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          const fallback = document.createElement('div');
                          fallback.className = 'flex items-center justify-center w-full h-full bg-zinc-800';
                          const icon = document.createElement('div');
                          icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400"><line x1="2" y1="2" x2="22" y2="22"></line><path d="M10.41 10.41a2 2 0 1 1-2.83-2.83"></path><line x1="13.5" y1="13.5" x2="6" y2="21"></line><path d="M18 12h.01"></path><path d="M18 21l-4.35-4.35"></path><path d="M9 3h.01"></path><path d="M9 6h.01"></path><path d="M15 3h.01"></path><path d="M15 6h.01"></path><path d="M9 9h.01"></path></svg>';
                          fallback.appendChild(icon);
                          parent.appendChild(fallback);
                        }
                      }}
                    />
                  </AspectRatio>
                  <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-70 p-2 text-left">
                    <h3 className="text-sm font-medium text-white truncate">{card.title}</h3>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="absolute top-1/2 -translate-y-1/2 left-2 flex items-center">
            <CarouselPrevious className="relative h-8 w-8 translate-x-0 translate-y-0 bg-black/50 hover:bg-black/70 border-0" />
          </div>
          <div className="absolute top-1/2 -translate-y-1/2 right-2 flex items-center">
            <CarouselNext className="relative h-8 w-8 translate-x-0 translate-y-0 bg-black/50 hover:bg-black/70 border-0" />
          </div>
        </div>
      </Carousel>

      <AnimatePresence>
        {selected && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-50"
              onClick={handleOutsideClick}
            />
            <motion.div
              layoutId={`card-${selected.id}`}
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
            >
              <div className="relative w-full max-w-lg rounded-lg overflow-hidden">
                <button 
                  onClick={handleOutsideClick}
                  className="absolute top-2 right-2 z-[80] bg-white/20 hover:bg-white/40 rounded-full p-1.5 backdrop-blur-sm transition-colors"
                  aria-label="Cerrar"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
                <AspectRatio ratio={1/1} className="bg-zinc-900 w-full">
                  <img 
                    src={selected.thumbnail} 
                    alt={selected.title} 
                    className="w-full h-full object-cover" 
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMiIgZmlsbD0iIzJEMzQ0OCIvPjxwYXRoIGQ9Ik0xNyA4TDcgMThNNyA4TDE3IDE4IiBzdHJva2U9IiM4ODk1QjAiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+PC9zdmc+';
                      target.className = 'w-24 h-24 mx-auto';
                    }}
                  />
                </AspectRatio>
                <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-70 p-4">
                  <h3 className="text-xl font-bold text-white truncate">{selected.title}</h3>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MobileGallery;
