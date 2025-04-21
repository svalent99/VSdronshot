
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
import { StarIcon } from "lucide-react";

interface FormValues {
  nombre: string;
  contenido: string;
  puntaje: number;
}

export const ReviewForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  
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
      <div className="flex items-center space-x-1">
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="nombre"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre Completo</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Ingresa tu nombre" 
                  {...field} 
                  className="bg-zinc-700 border-zinc-600"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="space-y-2">
          <FormLabel>Calificación</FormLabel>
          <div>{renderRatingStars()}</div>
        </div>
        
        <FormField
          control={form.control}
          name="contenido"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tu Reseña</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Cuéntanos tu experiencia con nuestros servicios" 
                  {...field} 
                  rows={4}
                  className="bg-zinc-700 border-zinc-600 resize-none"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          className="w-full bg-sky-600 hover:bg-sky-700"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Enviando..." : "Enviar Reseña"}
        </Button>
      </form>
    </Form>
  );
};
