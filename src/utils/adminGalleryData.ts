
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

// Función para subir una imagen a Supabase
export const uploadImageToSupabase = async (file: File, title: string, description?: string) => {
  try {
    // Generar un nombre único para el archivo
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    
    // Importación local para evitar problemas de circular dependency
    const { supabase } = await import('@/integrations/supabase/client');
    
    // Subir archivo a Supabase Storage
    const { data: fileData, error: uploadError } = await supabase
      .storage
      .from('dron-shots')
      .upload(fileName, file);
    
    if (uploadError) throw uploadError;
    
    // Obtener URL pública del archivo
    const { data: urlData } = await supabase
      .storage
      .from('dron-shots')
      .getPublicUrl(fileName);
    
    if (!urlData.publicUrl) throw new Error("No se pudo obtener la URL pública");
    
    // Guardar registro en la tabla dron_shots
    const { error: dbError } = await supabase
      .from('dron_shots')
      .insert({
        titulo: title,
        descripcion: description || null,
        archivo_url: urlData.publicUrl
      });
    
    if (dbError) throw dbError;
    
    return { success: true, url: urlData.publicUrl };
  } catch (error) {
    console.error("Error al subir imagen:", error);
    return { success: false, error };
  }
};
