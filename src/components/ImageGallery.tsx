
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../lib/utils";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "./ui/carousel";
import { useMediaQuery } from "../hooks/use-media-query";

type Card = {
  id: number;
  content: React.ReactNode;
  className: string;
  thumbnail: string;
  title: string;
};

// Datos predeterminados - estos se pueden reemplazar con los aprobados del admin
const defaultCards: Card[] = [
  {
    id: 1,
    content: null,
    className: "col-span-1 row-span-1",
    thumbnail: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZHJvbmV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
    title: "Vista panorámica de campo",
  },
  {
    id: 2,
    content: null,
    className: "col-span-1 row-span-1",
    thumbnail: "https://images.unsplash.com/photo-1577724862607-83214b7d0e89?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8ZHJvbmUlMjB2aWV3fGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
    title: "Propiedad residencial",
  },
  {
    id: 3,
    content: null,
    className: "col-span-1 row-span-1",
    thumbnail: "https://images.unsplash.com/photo-1534372860894-9476556ea6c7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGRyb25lJTIwdmlld3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
    title: "Complejo turístico",
  },
  {
    id: 4,
    content: null,
    className: "col-span-1 row-span-1",
    thumbnail: "https://images.unsplash.com/photo-1582968819890-e7fb0b93cda4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGRyb25lJTIwdmlld3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
    title: "Costa mediterránea",
  },
  {
    id: 5,
    content: null,
    className: "col-span-1 row-span-1",
    thumbnail: "https://images.unsplash.com/photo-1513486490664-9173ae868f41?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGRyb25lJTIwdmlld3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
    title: "Mansión de lujo",
  },
  {
    id: 6,
    content: null,
    className: "col-span-1 row-span-1",
    thumbnail: "https://images.unsplash.com/photo-1523978591478-c753949ff840?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGRyb25lJTIwdmlld3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
    title: "Zona de golf",
  },
];

// Función para convertir imágenes del admin a formato de tarjeta
const convertToCards = (adminImages: any[]): Card[] => {
  return adminImages.map(img => ({
    id: img.id,
    content: null,
    className: "col-span-1 row-span-1",
    thumbnail: img.thumbnail,
    title: img.title || "Sin título",
  }));
};

export const LayoutGrid = ({ cards }: { cards: Card[] }) => {
  const [selected, setSelected] = useState<Card | null>(null);
  const [lastSelected, setLastSelected] = useState<Card | null>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const handleClick = (card: Card) => {
    setLastSelected(selected);
    setSelected(card);
  };

  const handleOutsideClick = () => {
    setLastSelected(selected);
    setSelected(null);
  };

  // Renderizado condicional basado en tamaño de pantalla
  if (isMobile) {
    return (
      <div className="w-full p-4">
        <Carousel className="w-full max-w-xs mx-auto">
          <CarouselContent>
            {cards.map((card, i) => (
              <CarouselItem key={i} className="basis-full">
                <div className="relative rounded-lg overflow-hidden" style={{ aspectRatio: "1/1" }}>
                  <img 
                    src={card.thumbnail} 
                    alt={card.title} 
                    className="object-cover w-full h-full" 
                    onClick={() => handleClick(card)}
                  />
                  {/* Título con letra pequeña */}
                  <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-70 p-2 text-left">
                    <h3 className="text-sm font-medium text-white">{card.title}</h3>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-center gap-2 mt-4">
            <CarouselPrevious className="relative inset-0 translate-y-0 left-0" />
            <CarouselNext className="relative inset-0 translate-y-0 right-0" />
          </div>
        </Carousel>

        {/* Modal para imagen seleccionada */}
        <AnimatePresence>
          {selected && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.8 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black z-50"
                onClick={handleOutsideClick}
              />
              <motion.div
                layoutId={`card-${selected.id}`}
                className="fixed inset-0 flex items-center justify-center z-50 p-4"
              >
                <div className="relative w-full max-w-lg rounded-lg overflow-hidden">
                  <img 
                    src={selected.thumbnail} 
                    alt={selected.title} 
                    className="w-full object-contain"
                  />
                  <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-70 p-4">
                    <h3 className="text-xl font-bold text-white">{selected.title}</h3>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Diseño de escritorio original
  return (
    <div className="w-full h-full p-4 md:p-10 grid grid-cols-1 md:grid-cols-3 max-w-7xl mx-auto gap-4 relative">
      {cards.map((card, i) => (
        <div key={i} className={cn(card.className, "")}>
          <motion.div
            onClick={() => handleClick(card)}
            className={cn(
              card.className,
              "relative overflow-hidden rounded-lg cursor-pointer",
              selected?.id === card.id
                ? "absolute inset-0 h-1/2 w-full md:w-1/2 m-auto z-50 flex justify-center items-center flex-wrap flex-col"
                : lastSelected?.id === card.id
                ? "z-40 bg-white h-full w-full"
                : "bg-black h-full w-full"
            )}
            layoutId={`card-${card.id}`}
            style={{ aspectRatio: "1/1" }}
          >
            {selected?.id === card.id && <SelectedCard selected={selected} />}
            <ImageComponent card={card} />
            
            {/* Título de imagen estilo pequeño */}
            <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-70 p-2 text-left">
              <h3 className="text-sm font-medium text-white">{card.title}</h3>
            </div>
          </motion.div>
        </div>
      ))}
      <AnimatePresence>
        {selected && (
          <motion.div
            onClick={handleOutsideClick}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            className="absolute h-full w-full left-0 top-0 bg-black z-10"
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const ImageComponent = ({ card }: { card: Card }) => {
  return (
    <motion.img
      layoutId={`image-${card.id}-image`}
      src={card.thumbnail}
      alt={card.title}
      className="object-cover object-top absolute inset-0 h-full w-full transition duration-200"
    />
  );
};

const SelectedCard = ({ selected }: { selected: Card | null }) => {
  return (
    <div className="bg-transparent h-full w-full flex flex-col justify-end rounded-lg shadow-2xl relative z-[60]">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        className="absolute inset-0 h-full w-full bg-black opacity-60 z-10"
      />
      <motion.div
        layoutId={`content-${selected?.id}`}
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="relative px-8 pb-4 z-[70]"
      >
        <h3 className="text-xl font-bold text-white">{selected?.title}</h3>
      </motion.div>
    </div>
  );
};

const ImageGallery = () => {
  const [cards, setCards] = useState<Card[]>(defaultCards);

  // Cargar imágenes desde localStorage
  useEffect(() => {
    const storedImages = localStorage.getItem('galleryImages');
    console.log("Intentando cargar imágenes desde localStorage");
    
    if (storedImages) {
      try {
        const adminImages = JSON.parse(storedImages);
        console.log("Imágenes cargadas desde localStorage:", adminImages);
        
        if (adminImages && adminImages.length > 0) {
          // Convertir las imágenes del admin al formato de tarjeta
          const adminCards = convertToCards(adminImages);
          // Usar las imágenes del admin, complementadas con las predeterminadas si es necesario
          setCards(adminCards.length >= 6 ? adminCards : [...adminCards, ...defaultCards].slice(0, 6));
          console.log("Cargadas imágenes desde localStorage:", adminImages.length);
        }
      } catch (error) {
        console.error("Error al cargar imágenes desde localStorage:", error);
        setCards(defaultCards);
      }
    } else {
      console.log("No se encontraron imágenes en localStorage, usando predeterminadas");
    }
  }, []);

  return (
    <div className="w-full h-full">
      <p className="text-center text-gray-400 mb-10 text-sm">
        Galería de fotografías tomadas con nuestro dron
      </p>
      <LayoutGrid cards={cards} />
    </div>
  );
};

export default ImageGallery;
