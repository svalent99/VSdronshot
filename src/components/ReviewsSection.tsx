
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

// Datos de muestra - estos podrían cargarse desde Supabase en el futuro
const reviews = [
  {
    id: 1,
    name: "Carlos Mendoza",
    username: "@carlosmendoza",
    body: "Las imágenes que VS Dron Shot capturó de mi propiedad son impresionantes. Superaron mis expectativas por completo.",
    img: "https://i.pravatar.cc/150?img=1",
  },
  {
    id: 2,
    name: "Laura Gómez",
    username: "@lauragomez",
    body: "Profesionalismo de principio a fin. Las tomas aéreas resaltaron perfectamente el entorno de nuestra casa.",
    img: "https://i.pravatar.cc/150?img=5",
  },
  {
    id: 3,
    name: "Miguel Ángel",
    username: "@miguelangel",
    body: "Gracias al equipo de VS Dron Shot, pudimos vender nuestra propiedad en tiempo récord. Las fotos aéreas hicieron toda la diferencia.",
    img: "https://i.pravatar.cc/150?img=3",
  },
  {
    id: 4,
    name: "Sofía Martínez",
    username: "@sofiamartinez",
    body: "Contratamos sus servicios para un evento corporativo y quedamos maravillados con los resultados. Totalmente recomendable.",
    img: "https://i.pravatar.cc/150?img=8",
  },
  {
    id: 5,
    name: "Alejandro Ruiz",
    username: "@aleruiz",
    body: "Excelente servicio, puntualidad y resultados extraordinarios. Sin duda volveré a contratarlos para futuros proyectos.",
    img: "https://i.pravatar.cc/150?img=4",
  },
  {
    id: 6,
    name: "Patricia Vega",
    username: "@patriciavega",
    body: "La calidad de los videos es impresionante. Han dado vida a nuestro proyecto inmobiliario con estas tomas aéreas.",
    img: "https://i.pravatar.cc/150?img=9",
  },
];

const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

const ReviewCard = ({
  img,
  name,
  username,
  body,
}: {
  img: string;
  name: string;
  username: string;
  body: string;
}) => {
  return (
    <motion.figure
      whileHover={{ y: -5 }}
      className={cn(
        "relative h-full w-64 cursor-pointer overflow-hidden rounded-xl border p-4 mx-4 mb-4",
        "border-gray-800 bg-gray-950/[0.3] hover:bg-gray-950/[0.5]",
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <img className="rounded-full w-8 h-8" alt={name} src={img} />
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium text-white">
            {name}
          </figcaption>
          <p className="text-xs font-medium text-white/40">{username}</p>
        </div>
      </div>
      <blockquote className="mt-2 text-sm text-gray-300">{body}</blockquote>
    </motion.figure>
  );
};

// Componente simple de marquee sin dependencias externas
const Marquee = ({
  children,
  direction = "left",
  speed = 20,
  className = "",
  pauseOnHover = false,
}: {
  children: React.ReactNode;
  direction?: "left" | "right";
  speed?: number;
  className?: string;
  pauseOnHover?: boolean;
}) => {
  // Utilizamos clases CSS en lugar de <style jsx>
  const marqueeClass = direction === "left" ? "animate-marquee" : "animate-marquee-reverse";
  const hoverClass = pauseOnHover ? "hover:pause-animation" : "";
  
  return (
    <div 
      className={`overflow-hidden whitespace-nowrap ${className}`}
      style={{ position: 'relative' }}
    >
      <div 
        className={`inline-block whitespace-nowrap ${marqueeClass} ${hoverClass}`}
        style={{
          animationDuration: `${speed}s`,
          paddingRight: '2rem'
        }}
      >
        {children}
      </div>
    </div>
  );
};

const ReviewsSection = () => {
  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden py-10">
      <div className="mb-4 w-full">
        <div className="flex overflow-hidden space-x-4">
          {firstRow.map((review) => (
            <ReviewCard key={review.id} {...review} />
          ))}
          {/* Repetir para dar efecto continuo */}
          {firstRow.map((review) => (
            <ReviewCard key={`repeat-${review.id}`} {...review} />
          ))}
        </div>
      </div>
      
      <div className="w-full mt-4">
        <div className="flex overflow-hidden space-x-4 animate-[marquee_20s_linear_infinite_reverse]">
          {secondRow.map((review) => (
            <ReviewCard key={review.id} {...review} />
          ))}
          {/* Repetir para dar efecto continuo */}
          {secondRow.map((review) => (
            <ReviewCard key={`repeat-${review.id}`} {...review} />
          ))}
        </div>
      </div>
      
      <div className="mt-10 flex justify-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 bg-transparent border border-white/20 hover:border-white/50 text-white rounded-md font-medium transition-colors duration-300"
        >
          Deja tu reseña
        </motion.button>
      </div>
      
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-black to-transparent"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-black to-transparent"></div>
    </div>
  );
};

export default ReviewsSection;
