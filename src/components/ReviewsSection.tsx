
import React, { useState } from 'react';
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

// Formulario modal para dejar reseñas
const ReviewForm = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [body, setBody] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Aquí iría la lógica para enviar a Supabase
    console.log('Enviando reseña:', { name, username, body });
    
    // Simular envío exitoso
    setSubmitted(true);
    
    // Resetear formulario después de 2 segundos
    setTimeout(() => {
      setName('');
      setUsername('');
      setBody('');
      setSubmitted(false);
      onClose();
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/70" 
        onClick={onClose}
      ></div>
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="relative bg-zinc-900 rounded-lg p-6 w-full max-w-md mx-4 z-10 border border-zinc-700"
      >
        <button 
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white"
        >
          ✕
        </button>
        <h3 className="text-xl font-bold text-white mb-4">Deja tu reseña</h3>
        
        {submitted ? (
          <div className="text-center py-8">
            <div className="mb-4 text-green-400 text-5xl">✓</div>
            <p className="text-white">¡Gracias por tu reseña! Será revisada y publicada pronto.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Nombre</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded text-white"
              />
            </div>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">Nombre de usuario</label>
              <div className="flex">
                <span className="inline-flex items-center px-3 bg-zinc-700 border border-r-0 border-zinc-600 rounded-l-md text-gray-300">@</span>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded-r-md text-white"
                />
              </div>
            </div>
            <div>
              <label htmlFor="review" className="block text-sm font-medium text-gray-300 mb-1">Tu reseña</label>
              <textarea
                id="review"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                required
                rows={4}
                className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded text-white"
              />
            </div>
            <button
              type="submit"
              className="w-full mt-6 px-4 py-2 bg-sky-500 text-white rounded font-medium hover:bg-sky-600 transition-colors"
            >
              Enviar reseña
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
};

const ReviewsSection = () => {
  const [reviewModalOpen, setReviewModalOpen] = useState(false);

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
          onClick={() => setReviewModalOpen(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 bg-transparent border border-white/20 hover:border-white/50 text-white rounded-md font-medium transition-colors duration-300"
        >
          Deja tu reseña
        </motion.button>
      </div>
      
      <ReviewForm 
        isOpen={reviewModalOpen} 
        onClose={() => setReviewModalOpen(false)}
      />
      
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-black to-transparent"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-black to-transparent"></div>
    </div>
  );
};

export default ReviewsSection;
