
import { supabase } from "./client";

/**
 * Checks if a storage bucket exists 
 * @param bucketName Name of the bucket to check
 * @returns Promise<boolean> true if bucket exists
 */
export const checkBucketExists = async (bucketName: string): Promise<boolean> => {
  try {
    console.log(`Checking if bucket '${bucketName}' exists...`);
    
    // Verify user authentication before checking bucket
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      console.warn("User not authenticated when checking bucket existence");
      throw new Error("Debe iniciar sesión para acceder a la galería");
    }
    
    // Get list of all buckets
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error("Error listing buckets:", listError);
      
      // Check if error is permission related
      if (listError.message.includes("Permission") || listError.message.includes("JWT")) {
        throw new Error("No tiene permisos para acceder al almacenamiento");
      }
      
      throw new Error("Error al verificar el almacenamiento");
    }
    
    // Verify the bucket exists
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
    
    if (bucketExists) {
      console.log(`✓ Bucket '${bucketName}' exists`);
      return true;
    } else {
      console.error(`✗ Bucket '${bucketName}' does not exist. Available buckets:`, buckets?.map(b => b.name));
      throw new Error(`El bucket '${bucketName}' no existe. Por favor, créelo manualmente en la consola de Supabase.`);
    }
  } catch (error: any) {
    console.error("Error in checkBucketExists:", error);
    throw error;
  }
};

// Keep this function for backward compatibility but modify it to use checkBucketExists
export const checkAndCreateBucket = async (bucketName: string): Promise<boolean> => {
  return await checkBucketExists(bucketName);
};
