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
      // First attempt: direct bucket check
      console.log(`Attempting direct getBucket check for '${bucketName}'...`);
      const { data, error } = await supabase.storage.getBucket(bucketName);
      
      if (error) {
        console.error(`Error in direct bucket check for '${bucketName}':`, error);
        // Don't throw here, try the fallback method
      } else if (data) {
        console.log(`✓ Bucket '${bucketName}' exists and is accessible via direct check:`, data);
        return true;
      }
      
      // Second attempt: list all buckets and check if our bucket is in the list
      console.log("Attempting fallback: listing all buckets...");
      const { data: buckets, error: listError } = await supabase.storage.listBuckets();
      
      if (listError) {
        console.error("Error listing buckets:", listError);
        throw new Error(`No se pudieron listar los buckets: ${listError.message}`);
      }
      
      if (!buckets || buckets.length === 0) {
        console.error("No buckets found in the project");
        throw new Error("No se encontraron buckets en el proyecto. Por favor, cree el bucket 'galeriavs' en la consola de Supabase.");
      }
      
      console.log("Available buckets:", buckets.map(b => b.name));
      
      // Check if our bucket exists in the list
      const bucketExists = buckets.some(bucket => bucket.name === bucketName);
      
      if (bucketExists) {
        console.log(`✓ Bucket '${bucketName}' exists (found in bucket list)`);
        return true;
      } else {
        console.error(`✗ Bucket '${bucketName}' does not exist. Available buckets:`, buckets.map(b => b.name));
        throw new Error(`El bucket '${bucketName}' no existe. Buckets disponibles: ${buckets.map(b => b.name).join(", ")}`);
      }
    } catch (bucketError: any) {
      console.error("Error checking bucket:", bucketError);
      
      // If there's an issue with permissions, provide a clearer error message
      if (bucketError.message && 
          (bucketError.message.includes("Permission") || 
           bucketError.message.includes("JWT") || 
           bucketError.message.includes("token"))) {
        throw new Error("No tiene permisos para acceder al almacenamiento. Por favor, verifique su sesión.");
      }
      
      // Re-throw the original error
      throw bucketError;
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
