
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
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      
      // Check if the gallery bucket exists, if not create it
      const { data: buckets } = await supabase
        .storage
        .listBuckets();
        
      const galleryBucketExists = buckets?.some(bucket => bucket.name === 'gallery');
      
      if (!galleryBucketExists) {
        console.log("Gallery bucket does not exist, creating...");
        // Create the bucket
        const { error: bucketError } = await supabase
          .storage
          .createBucket('gallery', { public: true });
          
        if (bucketError) {
          console.error("Error creating gallery bucket:", bucketError);
          throw bucketError;
        }
      }
      
      // Upload file to Supabase Storage
      console.log("Uploading file to storage...");
      const { error: uploadError, data: uploadData } = await supabase
        .storage
        .from('gallery')
        .upload(fileName, file);
      
      if (uploadError) {
        console.error("Error uploading file:", uploadError);
        throw uploadError;
      }
      
      console.log("File uploaded successfully:", uploadData);
      
      // Get public URL
      const { data: urlData } = await supabase
        .storage
        .from('gallery')
        .getPublicUrl(fileName);
      
      if (!urlData.publicUrl) {
        console.error("No public URL obtained");
        throw new Error("No se pudo obtener la URL pública");
      }
      
      console.log("Public URL obtained:", urlData.publicUrl);
      
      // Save record to database
      console.log("Saving record to database...");
      const { error: dbError, data: insertData } = await supabase
        .from('gallery_images')
        .insert({
          title,
          description: description || null,
          file_path: urlData.publicUrl,
          storage_path: fileName
        })
        .select();
      
      if (dbError) {
        console.error("Error inserting record:", dbError);
        throw dbError;
      }
      
      console.log("Record saved successfully:", insertData);
      
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery-images'] });
      toast.success("Imagen subida exitosamente");
    },
    onError: (error) => {
      console.error("Error uploading image:", error);
      toast.error("Error al subir la imagen");
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
        .from('gallery')
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
