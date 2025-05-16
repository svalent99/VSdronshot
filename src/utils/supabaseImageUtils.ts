
import { supabase } from "@/integrations/supabase/client";
import { GALLERY_BUCKET_NAME, checkBucketExists } from "@/integrations/supabase/bucketUtils";
import { toast } from "sonner";

/**
 * Uploads an image to the Supabase storage bucket
 * @param file File object to upload
 * @param path Optional custom path within the bucket 
 * @returns Promise with the public URL of the uploaded image
 */
export const uploadImage = async (file: File, path?: string): Promise<string> => {
  console.log(`Starting image upload for file: ${file.name}`);
  
  try {
    // Verify authentication
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      console.error("No authenticated session for upload");
      throw new Error("Debe iniciar sesión para subir imágenes");
    }
    
    // Check if bucket exists before attempting upload
    await checkBucketExists(GALLERY_BUCKET_NAME);
    
    // Generate a unique file path if not provided
    const filePath = path || `${Date.now()}_${Math.random().toString(36).substring(2, 15)}_${file.name.replace(/\s+/g, '_')}`;
    
    console.log(`Uploading to ${GALLERY_BUCKET_NAME}/${filePath}`);
    
    // Upload file to Supabase
    const { data, error } = await supabase
      .storage
      .from(GALLERY_BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
    
    // Get public URL
    const { data: publicUrlData } = supabase
      .storage
      .from(GALLERY_BUCKET_NAME)
      .getPublicUrl(filePath);
    
    if (!publicUrlData?.publicUrl) {
      throw new Error("No se pudo obtener la URL pública");
    }
    
    console.log(`Upload successful! Public URL: ${publicUrlData.publicUrl}`);
    return publicUrlData.publicUrl;
  } catch (error: any) {
    console.error("Upload failed:", error);
    toast.error(`Error al subir imagen: ${error.message || "Error desconocido"}`);
    throw error;
  }
};

/**
 * Deletes an image from the Supabase storage bucket
 * @param path Path of the file to delete within the bucket
 * @returns Promise<void>
 */
export const deleteImage = async (path: string): Promise<void> => {
  console.log(`Starting delete for image: ${path}`);
  
  try {
    // Verify authentication
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      console.error("No authenticated session for delete");
      throw new Error("Debe iniciar sesión para eliminar imágenes");
    }
    
    // Extract just the filename from a full URL if necessary
    let fileName = path;
    if (path.includes('/')) {
      // Handle full URL or path with directories
      fileName = path.split('/').pop() || path;
      
      // If it's a full Supabase URL, extract the path after the bucket name
      if (path.includes(GALLERY_BUCKET_NAME)) {
        const parts = path.split(GALLERY_BUCKET_NAME + '/');
        if (parts.length > 1) {
          fileName = parts[1];
        }
      }
    }
    
    console.log(`Deleting file from ${GALLERY_BUCKET_NAME}: ${fileName}`);
    
    // Delete the file
    const { error } = await supabase
      .storage
      .from(GALLERY_BUCKET_NAME)
      .remove([fileName]);
    
    if (error) {
      console.error("Error deleting file:", error);
      throw error;
    }
    
    console.log(`File ${fileName} deleted successfully`);
  } catch (error: any) {
    console.error("Delete failed:", error);
    toast.error(`Error al eliminar imagen: ${error.message || "Error desconocido"}`);
    throw error;
  }
};
