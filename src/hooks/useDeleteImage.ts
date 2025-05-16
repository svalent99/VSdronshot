
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { checkBucketExists } from "@/integrations/supabase/bucketUtils";

// Ensure the bucket name is consistently defined and spelled correctly
const BUCKET_NAME = 'galeriavs';

/**
 * Hook for deleting images from the gallery
 * @returns Mutation for deleting images
 */
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
      console.log(`Starting delete for image: ${id}, storage path: ${storagePath}, bucket: ${BUCKET_NAME}`);
      
      // First check if user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      console.log("Current session status:", session ? "Authenticated" : "Not authenticated");
      console.log("Session details:", session ? session.user.id : "No session");
      
      if (!session) {
        console.error("Session not found. User is not authenticated.");
        throw new Error("Debe iniciar sesión para eliminar imágenes");
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
        
        // Delete file from Storage
        const { error: storageError } = await supabase
          .storage
          .from(BUCKET_NAME)
          .remove([storagePath]);
        
        if (storageError) {
          console.warn("Error removing file from storage:", storageError);
          // Continue anyway to delete the database record
        }
        
        // Delete record from database
        console.log("Deleting database record...");
        const { error: dbError } = await supabase
          .from('gallery_images')
          .delete()
          .eq('id', id);
        
        if (dbError) {
          console.error("Error deleting record:", dbError);
          throw dbError;
        }
        
        console.log("Record deleted successfully");
        
        return { success: true };
      } catch (error: any) {
        console.error("Error in delete process:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery-images'] });
      toast.success("Imagen eliminada exitosamente");
    },
    onError: (error: any) => {
      console.error("Error deleting image:", error);
      toast.error(`Error al eliminar la imagen: ${error?.message || "Error desconocido"}`);
    }
  });
};
