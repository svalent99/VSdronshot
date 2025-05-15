
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { GalleryImage } from "@/types/gallery";

export const useGalleryImages = () => {
  return useQuery({
    queryKey: ['gallery-images'],
    queryFn: async (): Promise<GalleryImage[]> => {
      console.log("Fetching gallery images...");
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Error fetching gallery images:", error);
        toast.error("Error al cargar la galería de imágenes");
        throw error;
      }
      
      console.log("Gallery images fetched:", data);
      return data || [];
    }
  });
};

const checkAndCreateBucket = async () => {
  try {
    console.log("Checking if galeriavs bucket exists...");
    
    // First check if bucket exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error("Error checking buckets:", listError);
      throw new Error("No se pudo verificar los buckets de almacenamiento");
    }
    
    // If galeriavs bucket doesn't exist, create it
    const galeriavsBucketExists = buckets?.some(bucket => bucket.name === 'galeriavs');
    
    if (!galeriavsBucketExists) {
      console.log("galeriavs bucket doesn't exist, creating it...");
      
      try {
        // Try creating the bucket with public access
        const { error: createError } = await supabase.storage.createBucket('galeriavs', {
          public: true,
          fileSizeLimit: 10485760 // 10MB limit
        });
        
        if (createError) {
          console.error("Error creating galeriavs bucket:", createError);
          
          // Intenta otra estrategia si hay error de permisos
          if (createError.message?.toLowerCase().includes('permission') || 
              createError.message?.toLowerCase().includes('policy')) {
            
            console.log("Trying alternative approach to create bucket...");
            
            // Intenta acceder al bucket directamente, lo que podría crearlo automáticamente
            const { data: publicUrl } = supabase.storage.from('galeriavs').getPublicUrl('test.txt');
            console.log("Bucket might be created implicitly:", publicUrl);
            
            // Espera un momento para que se procese
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Verifica si el bucket existe ahora
            const { data: checkBuckets } = await supabase.storage.listBuckets();
            if (checkBuckets?.some(bucket => bucket.name === 'galeriavs')) {
              console.log("galeriavs bucket exists now");
              return true;
            }
          }
          
          throw createError;
        }
        
        console.log("galeriavs bucket created successfully");
      } catch (createError: any) {
        console.error("Error creating bucket:", createError);
        
        // Check if bucket might already exist despite the error
        const { data: checkAgain } = await supabase.storage.listBuckets();
        if (checkAgain?.some(bucket => bucket.name === 'galeriavs')) {
          console.log("galeriavs bucket exists after all, continuing...");
          return true;
        }
        
        throw new Error("No se pudo crear el bucket para almacenar imágenes. Por favor, configura manualmente el bucket 'galeriavs' en la consola de Supabase.");
      }
    } else {
      console.log("galeriavs bucket already exists");
    }
    
    return true;
  } catch (error: any) {
    console.error("Error in checkAndCreateBucket:", error);
    throw error;
  }
};

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
      console.log("Starting upload for file:", file.name);
      
      try {
        // First make sure bucket exists
        await checkAndCreateBucket();
        
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        
        // Upload file to Supabase Storage
        console.log("Uploading file to storage...");
        const { error: uploadError, data: uploadData } = await supabase
          .storage
          .from('galeriavs')
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
          .from('galeriavs')
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
      console.log("Starting delete for image:", id, storagePath);
      
      // Delete file from Storage
      const { error: storageError } = await supabase
        .storage
        .from('galeriavs')
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
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery-images'] });
      toast.success("Imagen eliminada exitosamente");
    },
    onError: (error) => {
      console.error("Error deleting image:", error);
      toast.error("Error al eliminar la imagen");
    }
  });
};
