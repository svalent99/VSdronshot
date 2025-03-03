
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../lib/utils";

type Card = {
  id: number;
  content: React.ReactNode;
  className: string;
  thumbnail: string;
};

// Datos predeterminados - estos se pueden reemplazar con los aprobados del admin
const defaultCards: Card[] = [
  {
    id: 1,
    content: <h3 className="text-xl font-bold text-white">Vista panorámica de campo</h3>,
    className: "col-span-1 row-span-1",
    thumbnail: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZHJvbmV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
  },
  {
    id: 2,
    content: <h3 className="text-xl font-bold text-white">Propiedad residencial</h3>,
    className: "col-span-1 row-span-1",
    thumbnail: "https://images.unsplash.com/photo-1577724862607-83214b7d0e89?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8ZHJvbmUlMjB2aWV3fGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
  },
  {
    id: 3,
    content: <h3 className="text-xl font-bold text-white">Complejo turístico</h3>,
    className: "col-span-1 row-span-1",
    thumbnail: "https://images.unsplash.com/photo-1534372860894-9476556ea6c7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGRyb25lJTIwdmlld3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
  },
  {
    id: 4,
    content: <h3 className="text-xl font-bold text-white">Costa mediterránea</h3>,
    className: "col-span-1 row-span-1",
    thumbnail: "https://images.unsplash.com/photo-1582968819890-e7fb0b93cda4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGRyb25lJTIwdmlld3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
  },
  {
    id: 5,
    content: <h3 className="text-xl font-bold text-white">Mansión de lujo</h3>,
    className: "col-span-1 row-span-1",
    thumbnail: "https://images.unsplash.com/photo-1513486490664-9173ae868f41?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGRyb25lJTIwdmlld3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
  },
  {
    id: 6,
    content: <h3 className="text-xl font-bold text-white">Zona de golf</h3>,
    className: "col-span-1 row-span-1",
    thumbnail: "https://images.unsplash.com/photo-1523978591478-c753949ff840?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGRyb25lJTIwdmlld3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
  },
];

// Función para convertir imágenes del admin a formato de tarjeta
const convertToCards = (adminImages: any[]): Card[] => {
  return adminImages.map(img => ({
    id: img.id,
    content: <h3 className="text-xl font-bold text-white">{img.title}</h3>,
    className: "col-span-1 row-span-1",
    thumbnail: img.thumbnail,
  }));
};

export const LayoutGrid = ({ cards }: { cards: Card[] }) => {
  const [selected, setSelected] = useState<Card | null>(null);
  const [lastSelected, setLastSelected] = useState<Card | null>(null);

  const handleClick = (card: Card) => {
    setLastSelected(selected);
    setSelected(card);
  };

  const handleOutsideClick = () => {
    setLastSelected(selected);
    setSelected(null);
  };

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
      alt="thumbnail"
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
        {selected?.content}
      </motion.div>
    </div>
  );
};

const ImageGallery = () => {
  const [cards, setCards] = useState<Card[]>(defaultCards);

  // Cargar imágenes desde localStorage
  useEffect(() => {
    const storedImages = localStorage.getItem('galleryImages');
    if (storedImages) {
      const adminImages = JSON.parse(storedImages);
      if (adminImages && adminImages.length > 0) {
        // Convertir las imágenes del admin al formato de tarjeta
        const adminCards = convertToCards(adminImages);
        // Usar las imágenes del admin, complementadas con las predeterminadas si es necesario
        setCards(adminCards.length >= 6 ? adminCards : [...adminCards, ...defaultCards].slice(0, 6));
      }
    }
  }, []);

  return (
    <div className="w-full h-full">
      <p className="text-center text-gray-400 mb-10">
        Galería de fotografías tomadas con nuestro dron
      </p>
      <LayoutGrid cards={cards} />
    </div>
  );
};

export default ImageGallery;
