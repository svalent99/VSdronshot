import { supabase, debugStorageBuckets } from "./client";

/**
 * Checks if a storage bucket exists and is accessible
 * @param bucketName Name of the bucket to check
 * @returns Promise<boolean> true if bucket exists and is accessible
 */
export const checkBucketExists = async (bucketName: string): Promise<boolean> => {
  try {
    console.log(`🔍 Checking if bucket '${bucketName}' exists...`);
    
    // Verify user authentication before checking bucket
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      console.error("❌ User not authenticated when checking bucket existence");
      throw new Error("Debe iniciar sesión para acceder a la galería");
    }
    
    console.log("✅ User authenticated:", session.user.id);
    
    // Attempt to list all buckets and debug storage state 
    const buckets = await debugStorageBuckets();
    
    // Check if our bucket exists in the list
    const bucketExists = buckets.some(bucket => bucket.name === bucketName);
    
    if (bucketExists) {
      console.log(`✅ Bucket '${bucketName}' exists (found in bucket list)`);
      return true;
    } else {
      console.error(`❌ Bucket '${bucketName}' does not exist. Available buckets:`, buckets.map(b => b.name));
      throw new Error(`El bucket '${bucketName}' no existe o no es accesible con las credenciales actuales. Por favor, verifique que existe en el proyecto de Supabase correcto y que el usuario tiene permisos para acceder.`);
    }
  } catch (error: any) {
    console.error("❌ Error in checkBucketExists:", error);
    throw error;
  }
};

// Keep this function for backward compatibility but modify it to use checkBucketExists
export const checkAndCreateBucket = async (bucketName: string): Promise<boolean> => {
  // Just verify the bucket exists, don't try to create it
  return await checkBucketExists(bucketName);
};
