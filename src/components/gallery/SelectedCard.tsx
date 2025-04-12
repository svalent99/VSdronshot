
import React from "react";
import { motion } from "framer-motion";
import { GalleryCard } from "../../utils/galleryUtils";

type SelectedCardProps = {
  selected: GalleryCard | null;
};

const SelectedCard = ({ selected }: SelectedCardProps) => {
  return (
    <div className="bg-transparent h-full w-full flex flex-col justify-end rounded-lg shadow-2xl relative z-[60]">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        className="absolute inset-0 h-full w-full bg-black opacity-60 z-10"
      />
      <div className="absolute inset-0 flex items-center justify-center z-20 p-4">
        <img 
          src={selected?.thumbnail} 
          alt={selected?.title} 
          className="max-w-full max-h-[80vh] object-contain" 
        />
      </div>
      <motion.div
        layoutId={`content-${selected?.id}`}
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="relative px-8 pb-4 z-[70]"
      >
        <h3 className="text-xl font-bold text-white">{selected?.title}</h3>
      </motion.div>
    </div>
  );
};

export default SelectedCard;
