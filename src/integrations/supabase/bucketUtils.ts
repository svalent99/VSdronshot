
import { supabase } from "./client";

/**
 * Checks if a storage bucket exists and creates it if not
 * @param bucketName Name of the bucket to check/create
 * @returns Promise<boolean> true if bucket exists or was created
 */
export const checkAndCreateBucket = async (bucketName: string): Promise<boolean> => {
  try {
    console.log(`Checking if ${bucketName} bucket exists...`);
    
    // First check if bucket exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error("Error checking buckets:", listError);
      throw new Error("No se pudo verificar los buckets de almacenamiento");
    }
    
    // If bucket doesn't exist, create it
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
    
    if (!bucketExists) {
      console.log(`${bucketName} bucket doesn't exist, creating it...`);
      
      try {
        // Try creating the bucket with public access
        const { error: createError } = await supabase.storage.createBucket(bucketName, {
          public: true,
          fileSizeLimit: 10485760 // 10MB limit
        });
        
        if (createError) {
          console.error(`Error creating ${bucketName} bucket:`, createError);
          
          // Intenta otra estrategia si hay error de permisos
          if (createError.message?.toLowerCase().includes('permission') || 
              createError.message?.toLowerCase().includes('policy')) {
            
            console.log("Trying alternative approach to create bucket...");
            
            // Intenta acceder al bucket directamente, lo que podría crearlo automáticamente
            const { data: publicUrl } = supabase.storage.from(bucketName).getPublicUrl('test.txt');
            console.log("Bucket might be created implicitly:", publicUrl);
            
            // Espera un momento para que se procese
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Verifica si el bucket existe ahora
            const { data: checkBuckets } = await supabase.storage.listBuckets();
            if (checkBuckets?.some(bucket => bucket.name === bucketName)) {
              console.log(`${bucketName} bucket exists now`);
              return true;
            }
          }
          
          throw createError;
        }
        
        console.log(`${bucketName} bucket created successfully`);
      } catch (createError: any) {
        console.error("Error creating bucket:", createError);
        
        // Check if bucket might already exist despite the error
        const { data: checkAgain } = await supabase.storage.listBuckets();
        if (checkAgain?.some(bucket => bucket.name === bucketName)) {
          console.log(`${bucketName} bucket exists after all, continuing...`);
          return true;
        }
        
        throw new Error(`No se pudo crear el bucket para almacenar imágenes. Por favor, configura manualmente el bucket '${bucketName}' en la consola de Supabase.`);
      }
    } else {
      console.log(`${bucketName} bucket already exists`);
    }
    
    return true;
  } catch (error: any) {
    console.error("Error in checkAndCreateBucket:", error);
    throw error;
  }
};
