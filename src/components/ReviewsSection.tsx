
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';
import { toast } from 'sonner';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "./ui/carousel";
import { useMediaQuery } from '../hooks/use-media-query';
import { Card, CardContent, CardHeader } from "./ui/card";
import { useReviews } from '@/hooks/useReviews';

const ReviewCard = ({
  name,
  body,
}: {
  name: string;
  body: string;
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
            </div>
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

const ReviewsSection = () => {
  const { data: reviews, isLoading, error } = useReviews();
  const isMobile = useMediaQuery("(max-width: 768px)");

  if (error) {
    toast.error('Error al cargar las reseñas');
  }

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

      {isLoading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
      ) : reviews && reviews.length > 0 ? (
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
                            name={review.nombre_cliente} 
                            body={review.contenido}
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
                      name={review.nombre_cliente} 
                      body={review.contenido}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12 max-w-2xl mx-auto px-4">
          <p className="text-zinc-400">Aún no hay reseñas disponibles.</p>
        </div>
      )}
    </section>
  );
};

export default ReviewsSection;
