import { useGalleryImages } from "@/hooks/useGallery";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { ImageOff } from "lucide-react";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";

const GallerySection = () => {
  const { data: images, isLoading } = useGalleryImages();

  return (
    <div className="relative overflow-hidden py-16 px-4">
      {/* Aurora Borealis Background - Made more subtle */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-purple-900/20 to-black z-0">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -inset-[100%] bg-[radial-gradient(circle_at_50%_50%,rgba(76,29,149,0.1),rgba(0,0,0,0)_35%)] animate-aurora"></div>
          <div className="absolute -inset-[100%] bg-[radial-gradient(circle_at_80%_20%,rgba(124,58,237,0.08),rgba(0,0,0,0)_30%)] animate-aurora delay-1000"></div>
        </div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Only keeping the title outside the purple container */}
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
          <Carousel className="w-full">
            <div className="relative">
              <CarouselContent>
                {images.map((image) => (
                  <CarouselItem key={image.id} className="md:basis-1/3 lg:basis-1/3">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="relative aspect-video group rounded-xl overflow-hidden backdrop-blur-sm bg-black/30 border border-purple-500/10 shadow-lg shadow-purple-500/10 mx-2"
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
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="absolute top-1/2 -translate-y-1/2 -left-4 md:-left-4 lg:-left-8">
                <CarouselPrevious className="relative h-9 w-9 rounded-full bg-black/50 hover:bg-purple-900/50 border-purple-500/20" />
              </div>
              <div className="absolute top-1/2 -translate-y-1/2 -right-4 md:-right-4 lg:-right-8">
                <CarouselNext className="relative h-9 w-9 rounded-full bg-black/50 hover:bg-purple-900/50 border-purple-500/20" />
              </div>
            </div>
          </Carousel>
        )}
      </div>
    </div>
  );
};

export default GallerySection;
