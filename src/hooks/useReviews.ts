
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Review {
  id: string;
  nombre_cliente: string;
  contenido: string;
  puntaje: number;
  created_at: string;
}

export const useReviews = () => {
  return useQuery({
    queryKey: ['reviews'],
    queryFn: async (): Promise<Review[]> => {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });
};
