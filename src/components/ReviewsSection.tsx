
import { useReviews } from "@/hooks/useReviews";
import { Button } from "@/components/ui/button";
import ReviewForm from "@/components/ReviewForm";
import { useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

const ReviewsSection = () => {
  const { data: reviews, isLoading, refetch } = useReviews();
  const [showForm, setShowForm] = useState(false);

  const handleSubmitSuccess = () => {
    setShowForm(false);
    // Refetch will happen automatically via queryClient.invalidateQueries
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">
        Opiniones de Nuestros Clientes
      </h2>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
      ) : (
        <div className="space-y-6 mb-12">
          {(!reviews || reviews.length === 0) ? (
            <div className="text-center py-8 bg-zinc-800/50 rounded-lg">
              <p className="text-gray-400">Aún no hay reseñas aprobadas</p>
            </div>
          ) : (
            reviews.map((review) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-zinc-800/50 rounded-lg p-6"
              >
                <h3 className="font-bold text-lg mb-2">{review.name}</h3>
                <p className="text-gray-300">{review.comment}</p>
                <p className="text-sm text-gray-500 mt-2">
                  {new Date(review.created_at || '').toLocaleDateString()}
                </p>
              </motion.div>
            ))
          )}
        </div>
      )}

      {!showForm ? (
        <div className="text-center mb-12">
          <Button 
            onClick={() => setShowForm(true)}
            className="px-8"
          >
            Dejar una Reseña
          </Button>
        </div>
      ) : (
        <div className="bg-zinc-800/50 rounded-lg p-6 max-w-md mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">
              Dejar una Reseña
            </h3>
            <Button 
              size="icon"
              variant="destructive"
              className="rounded-full h-8 w-8 p-0 flex items-center justify-center"
              onClick={() => setShowForm(false)}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Cancelar</span>
            </Button>
          </div>
          <ReviewForm onSubmitSuccess={handleSubmitSuccess} />
        </div>
      )}
    </div>
  );
};

export default ReviewsSection;
