
import { useReviews, useSubmitReview } from "@/hooks/useReviews";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { motion } from "framer-motion";

const ReviewsSection = () => {
  const { data: reviews, isLoading } = useReviews();
  const submitReview = useSubmitReview();
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitReview.mutate(
      { name, comment },
      {
        onSuccess: () => {
          setName("");
          setComment("");
        }
      }
    );
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
                  {new Date(review.created_at).toLocaleDateString()}
                </p>
              </motion.div>
            ))
          )}
        </div>
      )}

      <div className="bg-zinc-800/50 rounded-lg p-6 max-w-md mx-auto">
        <h3 className="text-xl font-semibold mb-4 text-center">
          Dejar una Reseña
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Nombre
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="bg-zinc-700/50 border-zinc-600"
              placeholder="Tu nombre"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Comentario
            </label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
              className="bg-zinc-700/50 border-zinc-600"
              placeholder="Escribe tu experiencia"
              rows={4}
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={submitReview.isPending}
          >
            {submitReview.isPending ? "Enviando..." : "Enviar Reseña"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ReviewsSection;
