
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { GalleryImage } from "@/types/gallery";

/**
 * Hook to fetch gallery images
 * @returns Query result with gallery images
 */
export const useGalleryImages = () => {
  return useQuery({
    queryKey: ['gallery-images'],
    queryFn: async (): Promise<GalleryImage[]> => {
      console.log("Fetching gallery images...");
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Error fetching gallery images:", error);
        toast.error("Error al cargar la galería de imágenes");
        throw error;
      }
      
      console.log("Gallery images fetched:", data);
      return data || [];
    }
  });
};
