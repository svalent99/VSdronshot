
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Review {
  id: string;
  nombre_cliente: string;
  contenido: string;
  puntaje: number;
  created_at: string;
  aprobado: boolean;
}

export const useReviews = () => {
  return useQuery<Review[]>({
    queryKey: ['reviews'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Ensure each review has the aprobado property
      return (data || []).map(review => ({
        ...review,
        aprobado: review.aprobado ?? false
      }));
    }
  });
};
