
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useReviews } from "../hooks/useReviews";
import { ReviewForm } from "./ReviewForm";
import { Star, StarHalf } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ReviewsSectionProps {
  isAdmin?: boolean;
}

const ReviewsSection: React.FC<ReviewsSectionProps> = ({ isAdmin = false }) => {
  const { data: reviews, isLoading, error, refetch } = useReviews();
  const [approvedReviews, setApprovedReviews] = useState<any[]>([]);

  // Cargar y filtrar reseñas aprobadas cuando cambian los datos
  useEffect(() => {
    if (reviews) {
      const approved = reviews.filter(review => review.aprobado === true);
      console.log("Approved reviews:", approved);
      setApprovedReviews(approved);
    }
  }, [reviews]);

  // Cargar reseñas al montar el componente
  useEffect(() => {
    refetch();
    // Configurar recarga periódica de reseñas (cada 30 segundos)
    const interval = setInterval(() => {
      refetch();
    }, 30000);
    
    return () => clearInterval(interval);
  }, [refetch]);

  // Función para renderizar estrellas basado en puntaje
  const renderStars = (puntaje: number) => {
    const stars = [];
    const fullStars = Math.floor(puntaje);
    const hasHalfStar = puntaje % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`star-${i}`} className="text-yellow-500 fill-yellow-500" size={16} />);
    }
    
    if (hasHalfStar) {
      stars.push(<StarHalf key="half-star" className="text-yellow-500 fill-yellow-500" size={16} />);
    }
    
    return <div className="flex space-x-1">{stars}</div>;
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto"></div>
        <p className="mt-4">Cargando reseñas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Error al cargar las reseñas.</p>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => refetch()}
        >
          Reintentar
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">Reseñas de Clientes</h2>
      
      <div className="space-y-6">
        {approvedReviews.length === 0 ? (
          <div className="text-center py-12 bg-zinc-800/50 rounded-lg">
            <p className="text-gray-400">No hay reseñas aprobadas para mostrar.</p>
          </div>
        ) : (
          approvedReviews.map((review) => (
            <motion.div
              key={review.id}
              className="bg-zinc-800 rounded-lg p-6 border border-zinc-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-lg">{review.nombre_cliente}</h3>
                    {renderStars(review.puntaje)}
                  </div>
                  <p className="text-gray-400 text-sm">{new Date(review.created_at).toLocaleDateString()}</p>
                </div>
                {isAdmin && (
                  <div className="flex space-x-2">
                    <button
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm"
                    >
                      Eliminar
                    </button>
                  </div>
                )}
              </div>
              <div className="mt-3 max-w-full overflow-hidden">
                <p className="break-words whitespace-pre-wrap">{review.contenido}</p>
              </div>
            </motion.div>
          ))
        )}
      </div>
      
      <div className="mt-12 mb-6">
        <div className="bg-zinc-800/50 rounded-lg p-6 border border-zinc-700 max-w-md mx-auto">
          <h3 className="text-xl font-semibold mb-3 text-center">¿Has usado nuestros servicios?</h3>
          <p className="text-gray-400 mb-4 text-center text-sm">Tu opinión es muy importante para nosotros y para futuros clientes.</p>
          <ReviewForm />
        </div>
      </div>
    </div>
  );
};

export default ReviewsSection;
