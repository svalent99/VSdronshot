import { supabase, debugStorageBuckets } from "./client";

// Constant for the bucket name for consistency
export const GALLERY_BUCKET_NAME = 'galeriavs';

/**
 * Checks if a storage bucket exists and is accessible
 * @param bucketName Name of the bucket to check
 * @returns Promise<boolean> true if bucket exists and is accessible
 */
export const checkBucketExists = async (bucketName: string = GALLERY_BUCKET_NAME): Promise<boolean> => {
  try {
    console.log(`🔍 Checking if bucket '${bucketName}' exists...`);
    
    // Verify user authentication before checking bucket
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      console.error("❌ User not authenticated when checking bucket existence");
      throw new Error("Debe iniciar sesión para acceder a la galería");
    }
    
    console.log("✅ User authenticated:", session.user.id);
    
    // Get all available buckets using the debug function
    const buckets = await debugStorageBuckets();
    
    // Check if our bucket exists in the list
    const bucketExists = buckets.some(bucket => bucket.name === bucketName);
    
    if (bucketExists) {
      console.log(`✅ Bucket '${bucketName}' exists (found in bucket list)`);
      return true;
    } else {
      console.error(`❌ Bucket '${bucketName}' not found in the list of accessible buckets`);
      
      // As a fallback, try a direct bucket operation to verify access
      // Sometimes listBuckets might not show all buckets but we could still have access
      console.log(`🔍 Attempting to verify bucket '${bucketName}' existence through direct access...`);
      
      try {
        // Try to list files in the bucket to verify access
        const { data, error } = await supabase.storage.from(bucketName).list();
        
        if (!error) {
          console.log(`✅ Bucket '${bucketName}' exists (verified through direct access)`);
          return true;
        } else {
          console.error(`❌ Failed direct access verification for bucket '${bucketName}':`, error);
          throw new Error(`El bucket '${bucketName}' parece no existir o no es accesible con sus credenciales actuales.`);
        }
      } catch (directAccessError) {
        console.error(`❌ Error during direct access verification:`, directAccessError);
        throw new Error(`El bucket '${bucketName}' no pudo ser verificado: ${(directAccessError as Error).message}`);
      }
    }
  } catch (error: any) {
    console.error("❌ Error in checkBucketExists:", error);
    throw error;
  }
};

// Keep this function for backward compatibility but modify it to use checkBucketExists
export const checkAndCreateBucket = async (bucketName: string = GALLERY_BUCKET_NAME): Promise<boolean> => {
  // Just verify the bucket exists, don't try to create it
  return await checkBucketExists(bucketName);
};
