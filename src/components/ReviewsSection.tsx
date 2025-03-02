
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Star } from 'lucide-react';
import { toast } from 'sonner';

// Datos de muestra por defecto - estos se pueden reemplazar con los aprobados del admin
const defaultReviews = [
  {
    id: 1,
    name: "Carlos Mendoza",
    username: "@carlosmendoza",
    body: "Las imágenes que VS Dron Shot capturó de mi propiedad son impresionantes. Superaron mis expectativas por completo.",
    img: "https://i.pravatar.cc/150?img=1",
    rating: 5,
  },
  {
    id: 2,
    name: "Laura Gómez",
    username: "@lauragomez",
    body: "Profesionalismo de principio a fin. Las tomas aéreas resaltaron perfectamente el entorno de nuestra casa.",
    img: "https://i.pravatar.cc/150?img=5",
    rating: 5,
  },
  {
    id: 3,
    name: "Miguel Ángel",
    username: "@miguelangel",
    body: "Gracias al equipo de VS Dron Shot, pudimos vender nuestra propiedad en tiempo récord. Las fotos aéreas hicieron toda la diferencia.",
    img: "https://i.pravatar.cc/150?img=3",
    rating: 4,
  },
  {
    id: 4,
    name: "Sofía Martínez",
    username: "@sofiamartinez",
    body: "Contratamos sus servicios para un evento corporativo y quedamos maravillados con los resultados. Totalmente recomendable.",
    img: "https://i.pravatar.cc/150?img=8",
    rating: 5,
  },
  {
    id: 5,
    name: "Alejandro Ruiz",
    username: "@aleruiz",
    body: "Excelente servicio, puntualidad y resultados extraordinarios. Sin duda volveré a contratarlos para futuros proyectos.",
    img: "https://i.pravatar.cc/150?img=4",
    rating: 4,
  },
  {
    id: 6,
    name: "Patricia Vega",
    username: "@patriciavega",
    body: "La calidad de los videos es impresionante. Han dado vida a nuestro proyecto inmobiliario con estas tomas aéreas.",
    img: "https://i.pravatar.cc/150?img=9",
    rating: 5,
  },
];

const ReviewCard = ({
  img,
  name,
  username,
  body,
  rating,
}: {
  img: string;
  name: string;
  username: string;
  body: string;
  rating: number;
}) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5 }}
      className={cn(
        "flex flex-col h-full rounded-xl p-6",
        "bg-zinc-900/80 backdrop-blur-sm border border-zinc-800",
        "hover:border-zinc-700 transition-all duration-300"
      )}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border border-zinc-700">
            <AvatarImage src={img} alt={name} />
            <AvatarFallback>{name.slice(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <p className="font-medium text-white">{name}</p>
            <p className="text-sm text-zinc-400">{username}</p>
          </div>
        </div>
        <div className="flex">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                i < rating ? "fill-yellow-500 text-yellow-500" : "text-zinc-600"
              }`}
            />
          ))}
        </div>
      </div>
      
      <blockquote className="flex-grow text-zinc-300 text-sm md:text-base italic">
        "{body}"
      </blockquote>
    </motion.div>
  );
};

// Formulario modal para dejar reseñas
const ReviewForm = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [body, setBody] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Crear un nuevo formato de nombre de usuario basado en el nombre de la empresa
    const username = `@${company.toLowerCase().replace(/\s+/g, '')}`;
    
    // Crear una nueva reseña pendiente
    const newReview = {
      id: Date.now(),
      name,
      username,
      body,
      img: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
      rating: 5,
      pending: true
    };
    
    // Guardar en localStorage para que el admin la revise
    const pendingReviews = JSON.parse(localStorage.getItem('pendingReviews') || '[]');
    localStorage.setItem('pendingReviews', JSON.stringify([...pendingReviews, newReview]));
    
    // Notificar al usuario
    toast.success('¡Gracias! Tu reseña ha sido enviada para revisión.');
    
    // Resetear formulario después de 2 segundos
    setSubmitted(true);
    setTimeout(() => {
      setName('');
      setCompany('');
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
              <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-1">Nombre de la Empresa</label>
              <input
                type="text"
                id="company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                required
                className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded text-white"
              />
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
  const [reviews, setReviews] = useState(defaultReviews);

  // Cargar reseñas aprobadas desde localStorage
  useEffect(() => {
    const approvedReviews = JSON.parse(localStorage.getItem('approvedReviews') || '[]');
    if (approvedReviews.length > 0) {
      setReviews([...approvedReviews, ...defaultReviews].slice(0, 6));
    }
  }, []);

  return (
    <section className="w-full py-12">
      {/* Título con animación */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-center">
          Lo que dicen nuestros clientes
        </h2>
        <p className="mt-4 text-zinc-400 text-center max-w-2xl mx-auto">
          Descubre por qué nuestros clientes confían en nosotros para capturar momentos increíbles desde el aire.
        </p>
      </motion.div>

      {/* Grid responsivo de reseñas */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <ReviewCard key={review.id} {...review} />
          ))}
        </div>
      </div>
      
      {/* Botón para dejar reseña */}
      <div className="mt-12 flex justify-center">
        <motion.button
          onClick={() => setReviewModalOpen(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 bg-transparent border border-white/20 hover:border-white/50 text-white rounded-md font-medium transition-colors duration-300"
        >
          Deja tu reseña
        </motion.button>
      </div>
      
      {/* Modal de formulario */}
      <ReviewForm 
        isOpen={reviewModalOpen} 
        onClose={() => setReviewModalOpen(false)}
      />
    </section>
  );
};

export default ReviewsSection;
