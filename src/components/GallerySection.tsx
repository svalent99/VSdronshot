
import { useGalleryImages } from "@/hooks/useGallery";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { ImageOff } from "lucide-react";

const GallerySection = () => {
  const { data: images, isLoading } = useGalleryImages();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((n) => (
          <Skeleton key={n} className="aspect-video w-full" />
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {images.map((image) => (
        <motion.div
          key={image.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="relative aspect-video group rounded-lg overflow-hidden"
        >
          <img
            src={image.file_path}
            alt={image.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="text-white text-lg font-semibold">{image.title}</h3>
              {image.description && (
                <p className="text-white/80 text-sm mt-1">{image.description}</p>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default GallerySection;
