
import { useReviews } from "@/hooks/useReviews";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import ReviewForm from "@/components/ReviewForm";
import { useState } from "react";
import { motion } from "framer-motion";
import { X, User, Star, Calendar } from "lucide-react";

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {(!reviews || reviews.length === 0) ? (
            <div className="col-span-full text-center py-8 bg-zinc-800/50 rounded-lg">
              <p className="text-gray-400">Aún no hay reseñas aprobadas</p>
            </div>
          ) : (
            reviews.map((review) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="h-full"
              >
                <Card className="h-full bg-zinc-800/70 border border-zinc-700 hover:border-zinc-600 transition-colors overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <div className="bg-zinc-700 p-2 rounded-full">
                        <User className="h-4 w-4 text-zinc-300" />
                      </div>
                      <h3 className="font-semibold text-lg">{review.name}</h3>
                    </div>
                  </CardHeader>
                  <CardContent className="py-4">
                    <div className="mb-2 flex">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className="h-4 w-4 text-yellow-500 fill-yellow-500" 
                        />
                      ))}
                    </div>
                    <p className="text-gray-300 leading-relaxed">{review.comment}</p>
                  </CardContent>
                  <CardFooter className="pt-0 text-sm text-gray-500 flex items-center gap-2">
                    <Calendar className="h-3 w-3" />
                    {new Date(review.created_at || '').toLocaleDateString()}
                  </CardFooter>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      )}

      {!showForm ? (
        <div className="text-center mb-12">
          <Button 
            onClick={() => setShowForm(true)}
            className="px-8 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
          >
            Dejar una Reseña
          </Button>
        </div>
      ) : (
        <Card className="bg-zinc-800/70 border border-zinc-700 p-4 max-w-md mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">
              Dejar una Reseña
            </h3>
            <Button 
              size="icon"
              variant="ghost"
              className="rounded-full h-8 w-8 p-0 flex items-center justify-center hover:bg-zinc-700"
              onClick={() => setShowForm(false)}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Cancelar</span>
            </Button>
          </div>
          <ReviewForm onSubmitSuccess={handleSubmitSuccess} />
        </Card>
      )}
    </div>
  );
};

export default ReviewsSection;
