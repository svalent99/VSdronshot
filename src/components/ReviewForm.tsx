
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { StarIcon, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

interface FormValues {
  nombre: string;
  contenido: string;
  puntaje: number;
}

export const ReviewForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const form = useForm<FormValues>({
    defaultValues: {
      nombre: "",
      contenido: "",
      puntaje: 0
    }
  });

  const onSubmit = async (values: FormValues) => {
    if (rating === 0) {
      toast.error("Por favor selecciona una calificación");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('reviews')
        .insert({
          nombre_cliente: values.nombre,
          contenido: values.contenido,
          puntaje: rating,
          aprobado: false
        });
      
      if (error) throw error;
      
      toast.success("¡Gracias por tu reseña! Será revisada y publicada pronto.");
      form.reset();
      setRating(0);
      setIsSubmitted(true);
    } catch (error) {
      console.error("Error al enviar la reseña:", error);
      toast.error("Hubo un error al enviar tu reseña. Por favor intenta nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRatingClick = (value: number) => {
    setRating(value);
  };

  const renderRatingStars = () => {
    return (
      <div className="flex items-center space-x-1 justify-center">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => handleRatingClick(value)}
            onMouseEnter={() => setHoveredRating(value)}
            onMouseLeave={() => setHoveredRating(0)}
            className="focus:outline-none"
          >
            <StarIcon 
              size={24} 
              className={`
                ${(hoveredRating >= value || rating >= value) 
                  ? "text-yellow-500 fill-yellow-500" 
                  : "text-gray-400"}
                transition-colors
              `} 
            />
          </button>
        ))}
      </div>
    );
  };

  if (isSubmitted) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-8 flex flex-col items-center"
      >
        <CheckCircle className="text-green-500 h-16 w-16 mb-4" />
        <h3 className="text-xl font-semibold mb-2">¡Gracias por tu reseña!</h3>
        <p className="text-gray-400">
          Tu opinión ha sido recibida y será revisada por nuestro equipo antes de ser publicada.
        </p>
        <button 
          onClick={() => setIsSubmitted(false)} 
          className="mt-6 text-sky-400 hover:text-sky-300 text-sm underline"
        >
          Escribir otra reseña
        </button>
      </motion.div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-md mx-auto">
        <FormField
          control={form.control}
          name="nombre"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm">Tu Nombre</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Ingresa tu nombre" 
                  {...field} 
                  className="bg-zinc-700/50 border-zinc-600 focus:border-sky-500 text-sm"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="space-y-2">
          <FormLabel className="text-sm block text-center">¿Cómo calificarías nuestro servicio?</FormLabel>
          <div>{renderRatingStars()}</div>
        </div>
        
        <FormField
          control={form.control}
          name="contenido"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm">Tu Experiencia</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Cuéntanos tu experiencia con nuestros servicios" 
                  {...field} 
                  rows={3}
                  className="bg-zinc-700/50 border-zinc-600 focus:border-sky-500 resize-none text-sm"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          className="w-full bg-sky-600 hover:bg-sky-700 text-sm"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Enviando..." : "Enviar Reseña"}
        </Button>
      </form>
    </Form>
  );
};
