
import { useGalleryImages } from "@/hooks/useGallery";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { ImageOff, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

const GallerySection = () => {
  const { data: images, isLoading } = useGalleryImages();
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    if (images && images.length > 0) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }
  };

  const prevSlide = () => {
    if (images && images.length > 0) {
      setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Skeleton className="w-96 h-64" />
      </div>
    );
  }

  if (!images || images.length === 0) {
    return (
      <div className="text-center py-12">
        <ImageOff className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-gray-400">No hay imágenes en la galería</p>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      <div className="relative p-8 overflow-hidden">
        {/* Carousel container */}
        <div className="relative flex justify-center items-center min-h-[400px]">
          {/* Previous button */}
          <button
            onClick={prevSlide}
            className="absolute left-4 z-10 bg-black/70 hover:bg-black/90 text-white p-3 rounded-full transition-all duration-300"
            disabled={images.length <= 1}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Image container */}
          <div className="flex justify-center items-center w-full px-16">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="relative max-w-full max-h-[500px] flex justify-center"
            >
              <img
                src={images[currentIndex].file_path}
                alt={images[currentIndex].title}
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                style={{ 
                  width: 'auto', 
                  height: 'auto',
                  maxWidth: '100%',
                  maxHeight: '500px'
                }}
              />
              
              {/* Image info overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-lg">
                <h3 className="text-white text-xl font-semibold">{images[currentIndex].title}</h3>
                {images[currentIndex].description && (
                  <p className="text-white/80 text-sm mt-2">{images[currentIndex].description}</p>
                )}
              </div>
            </motion.div>
          </div>

          {/* Next button */}
          <button
            onClick={nextSlide}
            className="absolute right-4 z-10 bg-black/70 hover:bg-black/90 text-white p-3 rounded-full transition-all duration-300"
            disabled={images.length <= 1}
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Dots indicator */}
        {images.length > 1 && (
          <div className="flex justify-center mt-6 space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-white scale-125'
                    : 'bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GallerySection;
