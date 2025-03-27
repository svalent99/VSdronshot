
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel";
import { GalleryCard } from "../../utils/galleryUtils";

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
                <div className="relative rounded-lg overflow-hidden" style={{ aspectRatio: "1/1" }}>
                  <img 
                    src={card.thumbnail} 
                    alt={card.title} 
                    className="object-cover w-full h-full" 
                    onClick={() => handleClick(card)}
                  />
                  <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-70 p-2 text-left">
                    <h3 className="text-sm font-medium text-white">{card.title}</h3>
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
                <img 
                  src={selected.thumbnail} 
                  alt={selected.title} 
                  className="w-full object-contain"
                />
                <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-70 p-4">
                  <h3 className="text-xl font-bold text-white">{selected.title}</h3>
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
