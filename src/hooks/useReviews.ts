
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Review {
  id: string;
  name: string;
  comment: string;
  approved: boolean;
  created_at: string;
}

export const useReviews = (showAll: boolean = false) => {
  return useQuery({
    queryKey: ['reviews', showAll],
    queryFn: async (): Promise<Review[]> => {
      let query = supabase.from('reviews').select('*');
      
      if (!showAll) {
        query = query.eq('approved', true);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching reviews:", error);
        toast.error("No se pudieron cargar las reseñas");
        throw error;
      }

      return data || [];
    }
  });
};

export const useSubmitReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, comment }: { name: string; comment: string }) => {
      const { error } = await supabase
        .from('reviews')
        .insert({ name, comment });

      if (error) throw error;

      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      toast.success("Reseña enviada exitosamente. Será revisada antes de publicarse.");
    },
    onError: (error) => {
      console.error("Error submitting review:", error);
      toast.error("Error al enviar la reseña");
    }
  });
};

export const useUpdateReviewStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, approved }: { id: string; approved: boolean }) => {
      const { error } = await supabase
        .from('reviews')
        .update({ approved })
        .eq('id', id);

      if (error) throw error;

      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      toast.success("Estado de la reseña actualizado");
    },
    onError: (error) => {
      console.error("Error updating review:", error);
      toast.error("Error al actualizar la reseña");
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

      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      toast.success("Reseña eliminada exitosamente");
    },
    onError: (error) => {
      console.error("Error deleting review:", error);
      toast.error("Error al eliminar la reseña");
    }
  });
};
