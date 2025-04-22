
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface DronShot {
  id: string;
  titulo: string;
  descripcion: string | null;
  archivo_url: string;
  created_at: string;
}

export const useDronShots = () => {
  return useQuery({
    queryKey: ['dronShots'],
    queryFn: async (): Promise<DronShot[]> => {
      console.log("Fetching dronShots from Supabase");
      const { data, error } = await supabase
        .from('dron_shots')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Error fetching dron shots:", error);
        toast.error("No se pudieron cargar las imágenes de la galería.");
        throw error;
      }
      
      console.log("Retrieved dron shots:", data);
      return data || [];
    }
  });
};

