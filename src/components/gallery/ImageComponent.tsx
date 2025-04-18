
import React from "react";
import { motion } from "framer-motion";
import { GalleryCard } from "../../utils/galleryUtils";
import { ImageOff } from "lucide-react";

type ImageComponentProps = {
  card: GalleryCard;
};

const ImageComponent = ({ card }: ImageComponentProps) => {
  const [hasError, setHasError] = React.useState(false);

  return (
    <>
      {hasError ? (
        <div className="absolute inset-0 h-full w-full flex items-center justify-center bg-zinc-800">
          <ImageOff className="h-12 w-12 text-gray-400" />
        </div>
      ) : (
        <motion.img
          layoutId={`image-${card.id}-image`}
          src={card.thumbnail}
          alt={card.title}
          className="object-cover object-center absolute inset-0 h-full w-full transition duration-200"
          onError={() => setHasError(true)}
        />
      )}
    </>
  );
};

export default ImageComponent;
