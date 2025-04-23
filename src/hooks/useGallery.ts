import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { GalleryImage } from "@/types/gallery";

export const useGalleryImages = () => {
  return useQuery({
    queryKey: ['gallery-images'],
    queryFn: async (): Promise<GalleryImage[]> => {
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Error fetching gallery images:", error);
        toast.error("Error al cargar la galería de imágenes");
        throw error;
      }
      
      return data || [];
    }
  });
};

export const useUploadImage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      file, 
      title, 
      description 
    }: { 
      file: File; 
      title: string; 
      description?: string;
    }) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      
      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase
        .storage
        .from('gallery')
        .upload(fileName, file);
      
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data: urlData } = await supabase
        .storage
        .from('gallery')
        .getPublicUrl(fileName);
      
      if (!urlData.publicUrl) throw new Error("No se pudo obtener la URL pública");
      
      // Save record to database
      const { error: dbError } = await supabase
        .from('gallery_images')
        .insert({
          title,
          description: description || null,
          file_path: urlData.publicUrl,
          storage_path: fileName
        });
      
      if (dbError) throw dbError;
      
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery-images'] });
      toast.success("Imagen subida exitosamente");
    },
    onError: (error) => {
      console.error("Error uploading image:", error);
      toast.error("Error al subir la imagen");
    }
  });
};

export const useDeleteImage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      id, 
      storagePath 
    }: { 
      id: string; 
      storagePath: string;
    }) => {
      // Delete file from Storage
      const { error: storageError } = await supabase
        .storage
        .from('gallery')
        .remove([storagePath]);
      
      if (storageError) {
        console.warn("Error removing file from storage:", storageError);
        // Continue anyway to delete the database record
      }
      
      // Delete record from database
      const { error: dbError } = await supabase
        .from('gallery_images')
        .delete()
        .eq('id', id);
      
      if (dbError) throw dbError;
      
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery-images'] });
      toast.success("Imagen eliminada exitosamente");
    },
    onError: (error) => {
      console.error("Error deleting image:", error);
      toast.error("Error al eliminar la imagen");
    }
  });
};
