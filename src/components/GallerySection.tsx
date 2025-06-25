
import { useGalleryImages } from "@/hooks/useGallery";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { ImageOff, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

const GallerySection = () => {
  const { data: images, isLoading } = useGalleryImages();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMobileDescription, setShowMobileDescription] = useState(false);

  const nextSlide = () => {
    if (images && images.length > 0) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      setShowMobileDescription(false);
    }
  };

  const prevSlide = () => {
    if (images && images.length > 0) {
      setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
      setShowMobileDescription(false);
    }
  };

  const handleImageClick = () => {
    // Toggle description visibility on mobile
    if (window.innerWidth < 768) {
      setShowMobileDescription(!showMobileDescription);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Skeleton className="w-full max-w-4xl h-64" />
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
    <div className="relative w-full px-4 md:px-8">
      <div className="relative overflow-hidden">
        {/* Carousel container */}
        <div className="relative flex justify-center items-center min-h-[300px] md:min-h-[500px]">
          {/* Previous button */}
          <button
            onClick={prevSlide}
            className="absolute left-2 md:left-4 z-10 bg-black/70 hover:bg-black/90 text-white p-2 md:p-3 rounded-full transition-all duration-300"
            disabled={images.length <= 1}
          >
            <ChevronLeft className="w-4 h-4 md:w-6 md:h-6" />
          </button>

          {/* Image container */}
          <div className="flex justify-center items-center w-full px-12 md:px-16">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="relative max-w-full flex justify-center group"
              onClick={handleImageClick}
            >
              <img
                src={images[currentIndex].file_path}
                alt={images[currentIndex].title}
                className="max-w-full max-h-[250px] md:max-h-[450px] object-contain rounded-lg shadow-2xl cursor-pointer md:cursor-default"
                style={{ 
                  width: 'auto', 
                  height: 'auto',
                  maxWidth: '100%'
                }}
              />
              
              {/* Desktop hover overlay */}
              <div className="hidden md:block absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg">
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-white text-xl font-semibold">{images[currentIndex].title}</h3>
                  {images[currentIndex].description && (
                    <p className="text-white/80 text-sm mt-2">{images[currentIndex].description}</p>
                  )}
                </div>
              </div>

              {/* Mobile click overlay */}
              {showMobileDescription && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="md:hidden absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent rounded-lg flex items-end"
                >
                  <div className="p-4 w-full">
                    <h3 className="text-white text-lg font-semibold">{images[currentIndex].title}</h3>
                    {images[currentIndex].description && (
                      <p className="text-white/90 text-sm mt-2">{images[currentIndex].description}</p>
                    )}
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Next button */}
          <button
            onClick={nextSlide}
            className="absolute right-2 md:right-4 z-10 bg-black/70 hover:bg-black/90 text-white p-2 md:p-3 rounded-full transition-all duration-300"
            disabled={images.length <= 1}
          >
            <ChevronRight className="w-4 h-4 md:w-6 md:h-6" />
          </button>
        </div>

        {/* Dots indicator */}
        {images.length > 1 && (
          <div className="flex justify-center mt-4 md:mt-6 space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentIndex(index);
                  setShowMobileDescription(false);
                }}
                className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-white scale-125'
                    : 'bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
        )}

        {/* Mobile instruction text */}
        <div className="md:hidden text-center mt-4">
          <p className="text-gray-400 text-xs">Toca la imagen para ver la descripción</p>
        </div>
      </div>
    </div>
  );
};

export default GallerySection;
