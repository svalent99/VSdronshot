
import { checkBucketExists } from "@/integrations/supabase/bucketUtils";

// Datos de prueba para imágenes de la galería (solo se usan cuando no hay datos en Supabase)
export const galleryImages = [
  {
    id: 1,
    title: "Vista panorámica de campo",
    thumbnail: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZHJvbmV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
  },
  {
    id: 2,
    title: "Propiedad residencial",
    thumbnail: "https://images.unsplash.com/photo-1577724862607-83214b7d0e89?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8ZHJvbmUlMjB2aWV3fGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
  },
  {
    id: 3,
    title: "Complejo turístico",
    thumbnail: "https://images.unsplash.com/photo-1534372860894-9476556ea6c7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGRyb25lJTIwdmlld3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
  }
];

// Ensure the bucket name is consistently defined and spelled correctly
const BUCKET_NAME = 'galeriavs';

// Función para subir una imagen a Supabase
export const uploadImageToSupabase = async (file: File, title: string, description?: string) => {
  try {
    // Importación local para evitar problemas de circular dependency
    const { supabase } = await import('@/integrations/supabase/client');
    
    // First check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    console.log("Current session status:", session ? "Authenticated" : "Not authenticated");
    console.log("Session details:", session ? `User ID: ${session.user.id}` : "No session");
    
    if (!session) {
      console.error("Session not found. User is not authenticated.");
      throw new Error("Debe iniciar sesión para subir imágenes");
    }
    
    // Verify session token is still valid
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error("Failed to verify user:", userError);
      throw new Error("La sesión ha expirado. Por favor, inicie sesión nuevamente.");
    }
    
    console.log("User authenticated successfully:", user.id);
    
    // Generar un nombre único para el archivo
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    
    // Check if bucket exists - will throw an error if it doesn't
    const bucketExists = await checkBucketExists(BUCKET_NAME);
    console.log(`Bucket check result: ${bucketExists ? "Exists" : "Does not exist"}`);
    
    if (!bucketExists) {
      throw new Error(`El bucket '${BUCKET_NAME}' no existe o no es accesible.`);
    }
    
    // Subir archivo a Supabase Storage
    console.log(`Uploading file to storage bucket '${BUCKET_NAME}'...`);
    const { data: fileData, error: uploadError } = await supabase
      .storage
      .from(BUCKET_NAME)
      .upload(fileName, file);
    
    if (uploadError) {
      console.error("Upload error:", uploadError);
      throw uploadError;
    }
    
    // Obtener URL pública del archivo
    const { data: urlData } = await supabase
      .storage
      .from(BUCKET_NAME)
      .getPublicUrl(fileName);
    
    if (!urlData.publicUrl) throw new Error("No se pudo obtener la URL pública");
    
    // Guardar registro en la tabla gallery_images
    const { error: dbError } = await supabase
      .from('gallery_images')
      .insert({
        title: title,
        description: description || null,
        file_path: urlData.publicUrl,
        storage_path: fileName
      });
    
    if (dbError) throw dbError;
    
    return { success: true, url: urlData.publicUrl };
  } catch (error: any) {
    console.error("Error al subir imagen:", error);
    return { success: false, error };
  }
};
