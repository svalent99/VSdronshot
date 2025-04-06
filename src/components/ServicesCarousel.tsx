
import { useEffect, useState } from "react";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useMediaQuery } from "@/hooks/use-media-query";
import { CustomCarouselPrevious, CustomCarouselNext } from "./CarouselButtons";

const serviceItems = [
  {
    title: "Bienes Raíces",
    description:
      "Destacá tu propiedad con imágenes y videos aéreos que muestran la extensión, ubicación y características desde una perspectiva única.",
  },
  {
    title: "Eventos",
    description:
      "Captamos momentos únicos de bodas, fiestas y eventos corporativos con tomas aéreas que añaden un toque cinematográfico a tus recuerdos.",
  },
  {
    title: "Marketing",
    description:
      "Creamos contenido visual impactante para redes sociales, publicidad y campañas que hacen que tu marca destaque en el mercado.",
  },
  {
    title: "Inspecciones",
    description:
      "Realizamos inspecciones de techos, estructuras altas y terrenos de difícil acceso, brindando imágenes detalladas para evaluación y mantenimiento.",
  },
];

const ServicesCarousel = () => {
  const [numSlides, setNumSlides] = useState(3);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  
  useEffect(() => {
    if (isDesktop) {
      setNumSlides(3);
    } else {
      setNumSlides(1);
    }
  }, [isDesktop]);
  
  if (isDesktop === undefined) return null;
  
  return (
    <div id="services-section" className="max-w-7xl mx-auto px-4">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">Nuestros Servicios</h2>
      
      <Carousel 
        opts={{
          align: "start",
          loop: true,
          slidesToScroll: numSlides,
        }}
        className="w-full relative"
      >
        <CarouselContent>
          {serviceItems.map((item, index) => (
            <CarouselItem key={index} className={isDesktop ? "basis-1/3" : "basis-full"}>
              <Card className="h-56 md:h-64 bg-zinc-900 border border-zinc-800 hover:border-sky-600 transition-colors duration-300">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-white">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-400 text-sm">{item.description}</CardDescription>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        <CustomCarouselPrevious className="absolute left-0 md:-left-6 top-1/2 -translate-y-1/2" />
        <CustomCarouselNext className="absolute right-0 md:-right-6 top-1/2 -translate-y-1/2" />
      </Carousel>
    </div>
  );
};

export default ServicesCarousel;
