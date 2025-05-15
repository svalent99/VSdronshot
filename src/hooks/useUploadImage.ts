
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { checkBucketExists } from "@/integrations/supabase/bucketUtils";

const BUCKET_NAME = 'galeriavs';

/**
 * Hook for uploading images to the gallery
 * @returns Mutation for uploading images
 */
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
      console.log("Starting upload for file:", file.name);
      
      // First check if user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("Debe iniciar sesión para subir imágenes");
      }
      
      try {
        // Check if bucket exists (no longer creating it)
        await checkBucketExists(BUCKET_NAME);
        
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        
        // Upload file to Supabase Storage
        console.log("Uploading file to storage...");
        const { error: uploadError, data: uploadData } = await supabase
          .storage
          .from(BUCKET_NAME)
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
          });
        
        if (uploadError) {
          console.error("Upload error:", uploadError);
          throw uploadError;
        }
        
        console.log("File uploaded successfully:", uploadData);
        
        // Get public URL
        const { data: urlData } = supabase
          .storage
          .from(BUCKET_NAME)
          .getPublicUrl(fileName);
        
        if (!urlData?.publicUrl) {
          throw new Error("No se pudo obtener la URL pública");
        }
        
        // Save record to database
        console.log("Saving record to database...");
        const { error: dbError } = await supabase
          .from('gallery_images')
          .insert({
            title,
            description: description || null,
            file_path: urlData.publicUrl,
            storage_path: fileName
          });
        
        if (dbError) {
          console.error("Database error:", dbError);
          throw dbError;
        }
        
        return { success: true };
      } catch (error: any) {
        console.error("Error in upload process:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery-images'] });
      toast.success("Imagen subida exitosamente");
    },
    onError: (error: any) => {
      console.error("Error uploading image:", error);
      toast.error(`Error al subir la imagen: ${error?.message || "Error desconocido"}`);
    }
  });
};
