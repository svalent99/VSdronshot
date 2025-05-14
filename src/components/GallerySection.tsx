
import { useGalleryImages } from "@/hooks/useGallery";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { ImageOff } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const GallerySection = () => {
  const { data: images, isLoading } = useGalleryImages();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <div key={n} className="rounded-lg overflow-hidden">
            <AspectRatio ratio={1/1}>
              <Skeleton className="h-full w-full" />
            </AspectRatio>
          </div>
        ))}
      </div>
    );
  }

  if (!images || images.length === 0) {
    return (
      <div className="text-center py-12 bg-zinc-800/50 rounded-lg">
        <ImageOff className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-gray-400">No hay imágenes en la galería</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {images.map((image) => (
        <motion.div
          key={image.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="relative rounded-lg overflow-hidden shadow-md group"
        >
          <AspectRatio ratio={1/1} className="bg-zinc-900">
            <img
              src={image.file_path}
              alt={image.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </AspectRatio>
          <div className="absolute inset-0 bg-black bg-opacity-25 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
              <h3 className="text-white text-lg font-semibold truncate">{image.title}</h3>
              {image.description && (
                <p className="text-white/80 text-sm mt-1 line-clamp-2">{image.description}</p>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default GallerySection;
