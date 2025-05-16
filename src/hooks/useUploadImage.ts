
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { checkBucketExists } from "@/integrations/supabase/bucketUtils";

// Ensure the bucket name is consistently defined and spelled correctly
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
      console.log(`Starting upload for file: ${file.name} to bucket: ${BUCKET_NAME}`);
      
      // First check if user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      console.log("Current session status:", session ? "Authenticated" : "Not authenticated");
      console.log("Session details:", session ? session.user.id : "No session");
      
      if (!session) {
        console.error("Session not found. User is not authenticated.");
        throw new Error("Debe iniciar sesión para subir imágenes");
      }
      
      try {
        // Verify session token is still valid
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
          console.error("Failed to verify user:", userError);
          throw new Error("La sesión ha expirado. Por favor, inicie sesión nuevamente.");
        }
        
        console.log("User authenticated successfully:", user.id);
        
        // Check if bucket exists - will throw an error if it doesn't
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
