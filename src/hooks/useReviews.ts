
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
      console.log("Fetching reviews from Supabase...");
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Error fetching reviews:", error);
        throw error;
      }
      
      console.log("Raw reviews data:", data);
      
      // Ensure each review has the aprobado property
      return (data || []).map(review => ({
        ...review,
        aprobado: review.aprobado ?? false
      }));
    },
    refetchInterval: false,
    refetchOnMount: true,
    refetchOnWindowFocus: true
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
    onSuccess: (result) => {
      console.log("Invalidating reviews query cache");
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      toast.success(result.approve ? 'Reseña aprobada correctamente' : 'Reseña rechazada');
    },
    onError: (error) => {
      console.error("Error in approve/reject mutation:", error);
      toast.error('Error al procesar la reseña');
    }
  });
};

export const useDeleteReview = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      console.log(`Attempting to delete review ${id}`);
      
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error("Error deleting review:", error);
        throw error;
      }
      
      return id;
    },
    onSuccess: () => {
      console.log("Invalidating reviews query cache after deletion");
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      toast.success('Reseña eliminada correctamente');
    },
    onError: (error) => {
      console.error("Error in delete mutation:", error);
      toast.error('Error al eliminar la reseña');
    }
  });
};
