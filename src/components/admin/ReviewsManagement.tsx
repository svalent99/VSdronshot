
import { useReviews, useUpdateReviewStatus, useDeleteReview } from "@/hooks/useReviews";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Check, X, Trash2 } from "lucide-react";

interface ReviewsManagementProps {
  showPending?: boolean;
}

const ReviewsManagement = ({ showPending = true }: ReviewsManagementProps) => {
  const { data: reviews, isLoading } = useReviews(true); // Obtener todas las reseñas
  const updateStatus = useUpdateReviewStatus();
  const deleteReview = useDeleteReview();

  // Filtrar las reseñas según el estado que queremos mostrar
  const filteredReviews = reviews?.filter(review => 
    showPending ? !review.approved : review.approved
  );

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!filteredReviews || filteredReviews.length === 0) {
    return (
      <div className="text-center py-12 bg-zinc-800/50 rounded-lg">
        <p className="text-gray-400">No hay reseñas {showPending ? "pendientes" : "aprobadas"} para mostrar</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {filteredReviews.map((review) => (
        <motion.div
          key={review.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`bg-zinc-800/50 rounded-lg p-6 ${
            !review.approved ? "border-l-4 border-yellow-500" : ""
          }`}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-lg">{review.name}</h3>
              <p className="text-sm text-gray-500">
                {new Date(review.created_at).toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-2">
              {!review.approved ? (
                <>
                  <Button
                    onClick={() => updateStatus.mutate({ 
                      id: review.id, 
                      approved: true 
                    })}
                    className="bg-green-600 hover:bg-green-700"
                    size="sm"
                  >
                    <Check size={16} className="mr-1" /> Aprobar
                  </Button>
                  <Button
                    onClick={() => deleteReview.mutate(review.id)}
                    className="bg-red-600 hover:bg-red-700"
                    size="sm"
                  >
                    <X size={16} className="mr-1" /> Rechazar
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => deleteReview.mutate(review.id)}
                  variant="destructive"
                  size="sm"
                >
                  <Trash2 size={16} className="mr-1" /> Eliminar
                </Button>
              )}
            </div>
          </div>
          <p className="mt-4 text-gray-300">{review.comment}</p>
          {!review.approved && (
            <div className="mt-2 text-sm text-yellow-500">
              Pendiente de aprobación
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default ReviewsManagement;
