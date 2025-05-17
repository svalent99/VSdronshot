
import { useReviews } from "@/hooks/useReviews";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import ReviewForm from "@/components/ReviewForm";
import { useState } from "react";
import { motion } from "framer-motion";
import { X, Calendar, Building } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const ReviewsSection = () => {
  const { data: reviews, isLoading, refetch } = useReviews();
  const [showForm, setShowForm] = useState(false);
  const isMobile = useIsMobile();

  const handleSubmitSuccess = () => {
    setShowForm(false);
    // Refetch will happen automatically via queryClient.invalidateQueries
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
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
        <div className="mb-12">
          {(!reviews || reviews.length === 0) ? (
            <div className="text-center py-8 bg-zinc-800/50 rounded-lg">
              <p className="text-gray-400">Aún no hay reseñas aprobadas</p>
            </div>
          ) : (
            <Carousel
              opts={{
                align: "start",
                slidesToScroll: isMobile ? 1 : 3,
              }}
              className="w-full"
            >
              <CarouselContent>
                {reviews.map((review) => (
                  <CarouselItem key={review.id} className={isMobile ? "w-full" : "basis-1/3"}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="h-full p-1"
                    >
                      <Card className="h-full bg-[#0a0d1e] border border-blue-900/50 hover:border-blue-700/50 transition-colors overflow-hidden rounded-lg shadow-[0_4px_12px_rgba(0,100,255,0.15)]">
                        <CardHeader className="pb-2">
                          <div>
                            <h3 className="font-semibold text-lg text-white">{review.name}</h3>
                            {review.company && (
                              <div className="flex items-center gap-1 text-xs text-blue-300/80 mt-1">
                                <Building className="h-3 w-3" />
                                <span>{review.company}</span>
                              </div>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent className="py-4">
                          <p className="text-gray-300 leading-relaxed">
                            {truncateText(review.comment, 130)}
                          </p>
                        </CardContent>
                        <CardFooter className="pt-0 text-xs text-gray-500 flex items-center gap-2 border-t border-blue-900/20 pt-3">
                          <Calendar className="h-3 w-3" />
                          {new Date(review.created_at || '').toLocaleDateString()}
                        </CardFooter>
                      </Card>
                    </motion.div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="flex justify-center mt-6 gap-4">
                <CarouselPrevious className="relative inset-0 translate-y-0" />
                <CarouselNext className="relative inset-0 translate-y-0" />
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
