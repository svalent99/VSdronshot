
import { useReviews } from "@/hooks/useReviews";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import ReviewForm from "@/components/ReviewForm";
import { useState } from "react";
import { motion } from "framer-motion";
import { X, Calendar } from "lucide-react";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";

const ReviewsSection = () => {
  const { data: reviews, isLoading } = useReviews();
  const [showForm, setShowForm] = useState(false);

  const handleSubmitSuccess = () => {
    setShowForm(false);
    // Refetch will happen automatically via queryClient.invalidateQueries
  };

  // Function to truncate text
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  return (
    <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
        Opiniones de Nuestros Clientes
      </h2>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
      ) : (
        <div className="mb-12">
          {(!reviews || reviews.length === 0) ? (
            <div className="text-center py-8 bg-zinc-800/50 rounded-lg">
              <p className="text-gray-400">Aún no hay reseñas aprobadas</p>
            </div>
          ) : (
            <Carousel 
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {reviews.map((review) => (
                  <CarouselItem 
                    key={review.id} 
                    className="pl-2 md:pl-4 sm:basis-full md:basis-1/2 lg:basis-1/3"
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="h-full"
                    >
                      <Card className="h-full border-none bg-[#080f29] shadow-[0_0_15px_rgba(0,102,255,0.15)] rounded-xl overflow-hidden">
                        <CardContent className="p-6">
                          <p className="text-gray-100 leading-relaxed mb-4 text-lg">
                            "{truncateText(review.comment, 130)}"
                          </p>
                          <div className="mt-auto">
                            <h3 className="font-bold text-white mb-0.5">{review.name}</h3>
                            {/* Mostramos el nombre de la empresa solo si existe */}
                            {review.company && (
                              <p className="text-blue-300 text-sm">{review.company}</p>
                            )}
                          </div>
                        </CardContent>
                        <CardFooter className="pt-0 pb-6 px-6 text-sm text-gray-400 flex items-center gap-2">
                          <Calendar className="h-3 w-3" />
                          {new Date(review.created_at || '').toLocaleDateString()}
                        </CardFooter>
                      </Card>
                    </motion.div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="flex justify-center mt-6">
                <CarouselPrevious className="relative static mx-2 bg-blue-900/50 hover:bg-blue-900 border-blue-800" />
                <CarouselNext className="relative static mx-2 bg-blue-900/50 hover:bg-blue-900 border-blue-800" />
              </div>
            </Carousel>
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
