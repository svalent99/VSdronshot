
import React from "react";
import { motion } from "framer-motion";
import { GalleryCard } from "../../utils/galleryUtils";

type ImageComponentProps = {
  card: GalleryCard;
};

const ImageComponent = ({ card }: ImageComponentProps) => {
  return (
    <motion.img
      layoutId={`image-${card.id}-image`}
      src={card.thumbnail}
      alt={card.title}
      className="object-cover object-top absolute inset-0 h-full w-full transition duration-200"
    />
  );
};

export default ImageComponent;
