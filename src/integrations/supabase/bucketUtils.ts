import { supabase } from "./client";

/**
 * Checks if a storage bucket exists 
 * @param bucketName Name of the bucket to check
 * @returns Promise<boolean> true if bucket exists
 */
export const checkBucketExists = async (bucketName: string): Promise<boolean> => {
  try {
    console.log(`Checking if ${bucketName} bucket exists...`);
    
    // Check if bucket exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error("Error checking buckets:", listError);
      throw new Error("No se pudo verificar los buckets de almacenamiento");
    }
    
    // Return if bucket exists
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
    
    if (bucketExists) {
      console.log(`${bucketName} bucket exists`);
      return true;
    } else {
      console.error(`${bucketName} bucket does not exist. Please create it manually in the Supabase console.`);
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
