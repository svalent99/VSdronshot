
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
      console.log("Fetching reviews...");
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Error fetching reviews:", error);
        throw error;
      }
      
      // Log the raw data from Supabase
      console.log("Raw reviews data:", data);
      
      // Ensure each review has the aprobado property
      return (data || []).map(review => ({
        ...review,
        aprobado: review.aprobado ?? false
      }));
    }
  });
};

export const useApproveReview = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, approve }: { id: string, approve: boolean }) => {
      console.log(`Attempting to ${approve ? 'approve' : 'reject'} review ${id}`);
      const { data, error } = await supabase
        .from('reviews')
        .update({ aprobado: approve })
        .eq('id', id);
      
      if (error) {
        console.error("Error updating review:", error);
        throw error;
      }
      
      console.log("Update result:", data);
      return { id, approve };
    },
    onSuccess: () => {
      console.log("Invalidating reviews query cache");
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    }
  });
};

export const useDeleteReview = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    }
  });
};
