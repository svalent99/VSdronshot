
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface GalleryImage {
  id: string;
  title: string;
  description: string | null;
  file_path: string;
  storage_path: string;
  created_at: string;
}

export const useGalleryImages = () => {
  return useQuery({
    queryKey: ['gallery'],
    queryFn: async (): Promise<GalleryImage[]> => {
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching gallery images:", error);
        toast.error("No se pudieron cargar las imágenes");
        throw error;
      }

      return data || [];
    }
  });
};

export const useUploadImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ file, title, description }: { 
      file: File; 
      title: string; 
      description?: string;
    }) => {
      const fileName = `${Date.now()}-${file.name}`;
      const filePath = `gallery/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('gallery')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('gallery')
        .getPublicUrl(filePath);

      const { error: dbError } = await supabase
        .from('gallery_images')
        .insert({
          title,
          description,
          file_path: publicUrl,
          storage_path: filePath
        });

      if (dbError) throw dbError;

      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery'] });
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
    mutationFn: async ({ id, storagePath }: { id: string; storagePath: string }) => {
      const { error: storageError } = await supabase.storage
        .from('gallery')
        .remove([storagePath]);

      if (storageError) throw storageError;

      const { error: dbError } = await supabase
        .from('gallery_images')
        .delete()
        .eq('id', id);

      if (dbError) throw dbError;

      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery'] });
      toast.success("Imagen eliminada exitosamente");
    },
    onError: (error) => {
      console.error("Error deleting image:", error);
      toast.error("Error al eliminar la imagen");
    }
  });
};
