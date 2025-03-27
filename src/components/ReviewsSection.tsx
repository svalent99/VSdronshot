import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';
import { toast } from 'sonner';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "./ui/carousel";
import { useMediaQuery } from '../hooks/use-media-query';
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Button } from "./ui/button";

const defaultReviews = [];

const ReviewCard = ({
  name,
  username,
  body,
  isAdmin = false,
  onDelete = () => {},
}: {
  name: string;
  username: string;
  body: string;
  isAdmin?: boolean;
  onDelete?: () => void;
}) => {
  const limitedBody = body.length > 120 ? body.substring(0, 117) + '...' : body;
  
  return (
    <motion.div
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5 }}
      className="h-full"
    >
      <Card className={cn(
        "flex flex-col h-[200px] w-full", 
        "bg-zinc-900/80 backdrop-blur-sm border border-zinc-800",
        "hover:border-zinc-700 transition-all duration-300"
      )}>
        <CardHeader className="p-4 pb-0">
          <div className="flex justify-between items-start">
            <div className="flex flex-col">
              <p className="font-medium text-white">{name}</p>
              <p className="text-sm text-zinc-400">{username}</p>
            </div>
            {isAdmin && (
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={onDelete} 
                className="h-8 w-8 p-0"
              >
                ✕
              </Button>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="p-4 flex-grow overflow-hidden">
          <blockquote className="text-zinc-300 text-sm md:text-base italic">
            "{limitedBody}"
          </blockquote>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const ReviewForm = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [body, setBody] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedBody = body.trim().substring(0, 120);
    
    const username = `@${company.toLowerCase().replace(/\s+/g, '')}`;
    
    const newReview = {
      id: Date.now(),
      name,
      username,
      body: trimmedBody,
      img: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
      rating: 5,
      pending: true
    };
    
    const pendingReviews = JSON.parse(localStorage.getItem('pendingReviews') || '[]');
    localStorage.setItem('pendingReviews', JSON.stringify([...pendingReviews, newReview]));
    
    toast.success('¡Gracias! Tu reseña ha sido enviada para revisión.');
    
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
                onChange={(e) => {
                  if (e.target.value.length <= 120) {
                    setBody(e.target.value);
                  }
                }}
                required
                maxLength={120}
                rows={4}
                className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded text-white"
                placeholder="Máximo 120 caracteres"
              />
              <p className="text-sm text-zinc-400 mt-1">
                {body.length}/120 caracteres
              </p>
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

const ReviewsSection = ({ isAdmin = false }: { isAdmin?: boolean }) => {
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviews, setReviews] = useState([]);
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    const storedReviews = localStorage.getItem('approvedReviews');
    if (storedReviews) {
      try {
        const approvedReviews = JSON.parse(storedReviews);
        if (approvedReviews && approvedReviews.length > 0) {
          setReviews(approvedReviews);
          console.log("Cargadas reseñas aprobadas desde localStorage:", approvedReviews.length);
        }
      } catch (error) {
        console.error("Error al cargar reseñas desde localStorage:", error);
        setReviews([]);
      }
    }
  }, []);

  const handleDeleteReview = (reviewId) => {
    const updatedReviews = reviews.filter(review => review.id !== reviewId);
    setReviews(updatedReviews);
    
    // Guardar en localStorage
    localStorage.setItem('approvedReviews', JSON.stringify(updatedReviews));
    toast.success('Reseña eliminada correctamente');
  };

  return (
    <section className="w-full py-12">
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

      {reviews.length === 0 ? (
        <div className="text-center py-12 max-w-2xl mx-auto px-4">
          <p className="text-zinc-400">Aún no hay reseñas disponibles. ¡Sé el primero en opinar sobre nuestro servicio!</p>
          <motion.button
            onClick={() => setReviewModalOpen(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-6 px-6 py-3 bg-transparent border border-white/20 hover:border-white/50 text-white rounded-md font-medium transition-colors duration-300"
          >
            Deja tu reseña
          </motion.button>
        </div>
      ) : (
        <>
          {isMobile ? (
            <div className="max-w-sm mx-auto px-4">
              <Carousel className="w-full">
                <div className="relative">
                  <CarouselContent>
                    {reviews.map((review) => (
                      <CarouselItem key={review.id} className="basis-full">
                        <div className="h-full px-1">
                          <ReviewCard 
                            name={review.name} 
                            username={review.username} 
                            body={review.body}
                            isAdmin={isAdmin}
                            onDelete={() => handleDeleteReview(review.id)}
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <div className="absolute top-1/2 -translate-y-1/2 left-2 flex items-center">
                    <CarouselPrevious className="relative h-8 w-8 translate-x-0 translate-y-0 bg-black/50 hover:bg-black/70 border-0" />
                  </div>
                  <div className="absolute top-1/2 -translate-y-1/2 right-2 flex items-center">
                    <CarouselNext className="relative h-8 w-8 translate-x-0 translate-y-0 bg-black/50 hover:bg-black/70 border-0" />
                  </div>
                </div>
              </Carousel>
            </div>
          ) : (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {reviews.map((review) => (
                  <div key={review.id} className="h-full">
                    <ReviewCard 
                      name={review.name} 
                      username={review.username} 
                      body={review.body}
                      isAdmin={isAdmin}
                      onDelete={() => handleDeleteReview(review.id)}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {!isAdmin && (
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
          )}
        </>
      )}
      
      <ReviewForm 
        isOpen={reviewModalOpen} 
        onClose={() => setReviewModalOpen(false)}
      />
    </section>
  );
};

export default ReviewsSection;
