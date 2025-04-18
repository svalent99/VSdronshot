import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useReviews } from "../hooks/useReviews";

interface ReviewsSectionProps {
  isAdmin?: boolean; // Agregamos la propiedad isAdmin como opcional
}

const ReviewsSection: React.FC<ReviewsSectionProps> = ({ isAdmin = false }) => {
  const { data: reviews, isLoading, error } = useReviews();
  const [approvedReviews, setApprovedReviews] = useState<any[]>([]);

  useEffect(() => {
    if (reviews) {
      // Filtrar las reseñas aprobadas
      const approved = reviews.filter(review => review.aprobado === true);
      setApprovedReviews(approved);
    }
  }, [reviews]);

  if (isLoading) {
    return <p>Cargando reseñas...</p>;
  }

  if (error) {
    return <p>Error al cargar las reseñas.</p>;
  }

  return (
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
              <div className="flex items-start">
                <img src={review.img} alt={review.name} className="w-12 h-12 rounded-full mr-4" />
                <div>
                  <h3 className="font-bold">{review.name}</h3>
                  <p className="text-gray-400 text-sm">{review.username}</p>
                </div>
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
              <p className="break-words whitespace-pre-wrap">{review.body}</p>
            </div>
          </motion.div>
        ))
      )}
    </div>
  );
};

export default ReviewsSection;
