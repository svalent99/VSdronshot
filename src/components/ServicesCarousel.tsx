
import React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { useCarouselButtons, PrevButton, NextButton } from './CarouselButtons';
import { motion } from 'framer-motion';
import BeamsBackground from './BeamsBackground';

type Service = {
  title: string;
  description: string;
  imageUrl: string;
};

const services: Service[] = [
  {
    title: "Fotografía Aérea",
    description: "Captura impresionantes vistas aéreas con nuestros drones de alta resolución.",
    imageUrl: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZHJvbmV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60"
  },
  {
    title: "Videografía Profesional",
    description: "Creamos contenido visual cinematográfico desde perspectivas únicas.",
    imageUrl: "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGRyb25lfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60"
  },
  {
    title: "Inspección de Infraestructuras",
    description: "Evaluamos estructuras y propiedades con precisión y seguridad.",
    imageUrl: "https://images.unsplash.com/photo-1579829366248-204fe8413f31?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGRyb25lfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60"
  },
  {
    title: "Cartografía y Modelado 3D",
    description: "Creamos mapas detallados y modelos tridimensionales de cualquier terreno.",
    imageUrl: "https://images.unsplash.com/photo-1508444845599-5c89863b1c44?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGRyb25lfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60"
  }
];

const ServicesCarousel = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
  
  const { 
    prevBtnDisabled, 
    nextBtnDisabled, 
    onPrevButtonClick, 
    onNextButtonClick 
  } = useCarouselButtons(emblaApi);

  return (
    <BeamsBackground intensity="medium" color="blue">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3, duration: 0.8 }}
        className="w-full max-w-6xl mx-auto mt-16 px-4 py-16"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">Nuestros Servicios</h2>
        
        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {services.map((service, index) => (
                <div key={index} className="flex-[0_0_100%] min-w-0 sm:flex-[0_0_50%] md:flex-[0_0_33.33%] lg:flex-[0_0_25%] px-4">
                  <div className="bg-black/50 backdrop-blur-sm border border-white/20 rounded-lg overflow-hidden h-full hover:border-white/40 transition-all duration-300">
                    <div className="aspect-video overflow-hidden">
                      <img 
                        src={service.imageUrl} 
                        alt={service.title} 
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                      />
                    </div>
                    <div className="p-5">
                      <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                      <p className="text-gray-300">{service.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <PrevButton
            onClick={onPrevButtonClick}
            disabled={prevBtnDisabled}
            className="absolute top-1/2 left-2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 disabled:opacity-30 disabled:cursor-not-allowed z-10"
          />
          
          <NextButton
            onClick={onNextButtonClick}
            disabled={nextBtnDisabled}
            className="absolute top-1/2 right-2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 disabled:opacity-30 disabled:cursor-not-allowed z-10"
          />
        </div>
      </motion.div>
    </BeamsBackground>
  );
};

export default ServicesCarousel;
