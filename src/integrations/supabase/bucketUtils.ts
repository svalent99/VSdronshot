
import { supabase } from "./client";

/**
 * Checks if a storage bucket exists and is accessible
 * @param bucketName Name of the bucket to check
 * @returns Promise<boolean> true if bucket exists and is accessible
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
    
    console.log("User authenticated:", session.user.id);
    
    try {
      // Try to get bucket details directly - this is more reliable
      const { data, error } = await supabase.storage.getBucket(bucketName);
      
      if (error) {
        console.error(`Error getting bucket '${bucketName}':`, error);
        throw error;
      }
      
      if (data) {
        console.log(`✓ Bucket '${bucketName}' exists and is accessible:`, data);
        return true;
      }
      
      console.error(`✗ Bucket '${bucketName}' not found`);
      return false;
    } catch (bucketError) {
      // If direct bucket check fails, try listing buckets as fallback
      console.log("Falling back to bucket listing method");
      const { data: buckets, error: listError } = await supabase.storage.listBuckets();
      
      if (listError) {
        console.error("Error listing buckets:", listError);
        
        // Check if error is permission related
        if (listError.message.includes("Permission") || listError.message.includes("JWT")) {
          throw new Error("No tiene permisos para acceder al almacenamiento");
        }
        
        throw new Error("Error al verificar el almacenamiento");
      }
      
      // Verify the bucket exists in the list
      const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
      
      if (bucketExists) {
        console.log(`✓ Bucket '${bucketName}' exists (found in bucket list)`);
        return true;
      } else {
        console.error(`✗ Bucket '${bucketName}' does not exist. Available buckets:`, buckets?.map(b => b.name));
        throw new Error(`El bucket '${bucketName}' no existe. Por favor, verifique que esté creado correctamente en la consola de Supabase.`);
      }
    }
  } catch (error: any) {
    console.error("Error in checkBucketExists:", error);
    throw error;
  }
};

// Keep this function for backward compatibility but modify it to use checkBucketExists
export const checkAndCreateBucket = async (bucketName: string): Promise<boolean> => {
  // Just verify the bucket exists, don't try to create it
  return await checkBucketExists(bucketName);
};
