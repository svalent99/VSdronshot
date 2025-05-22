
import { useGalleryImages } from "@/hooks/useGallery";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { ImageOff } from "lucide-react";

const GallerySection = () => {
  const { data: images, isLoading } = useGalleryImages();

  return (
    <div className="relative overflow-hidden py-16 px-4">
      {/* Aurora Borealis Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-purple-900/40 to-black z-0">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute -inset-[100%] bg-[radial-gradient(circle_at_50%_50%,rgba(76,29,149,0.15),rgba(0,0,0,0)_35%)] animate-aurora"></div>
          <div className="absolute -inset-[100%] bg-[radial-gradient(circle_at_80%_20%,rgba(124,58,237,0.12),rgba(0,0,0,0)_30%)] animate-aurora delay-1000"></div>
        </div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white">
          Galería de Imágenes
        </h2>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <Skeleton key={n} className="aspect-video w-full rounded-xl" />
            ))}
          </div>
        ) : !images || images.length === 0 ? (
          <div className="text-center py-12 bg-black/40 backdrop-blur-sm rounded-xl border border-purple-800/30">
            <ImageOff className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-400">No hay imágenes en la galería</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((image) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="relative aspect-video group rounded-xl overflow-hidden backdrop-blur-sm bg-black/30 border border-purple-500/10 shadow-lg shadow-purple-500/10"
              >
                <img
                  src={image.file_path}
                  alt={image.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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
        )}
      </div>
    </div>
  );
};

export default GallerySection;
