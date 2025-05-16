
import React, { useState, useEffect } from 'react';
import { uploadImage, deleteImage } from "@/utils/supabaseImageUtils";
import { supabase, debugStorageBuckets } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const ImageUploadExample = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Check authentication status on component mount
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };
    
    checkAuth();
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });
    
    return () => subscription.unsubscribe();
  }, []);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };
  
  const handleUpload = async () => {
    if (!file) {
      toast.error("Por favor seleccione un archivo primero");
      return;
    }
    
    if (!isAuthenticated) {
      toast.error("Debe iniciar sesión para subir imágenes");
      return;
    }
    
    setUploading(true);
    
    try {
      const url = await uploadImage(file);
      setUploadedImageUrl(url);
      toast.success("Imagen subida correctamente");
    } catch (error: any) {
      console.error("Upload error:", error);
      // Error is already toasted in uploadImage
    } finally {
      setUploading(false);
    }
  };
  
  const handleDelete = async () => {
    if (!uploadedImageUrl) {
      toast.error("No hay imagen para eliminar");
      return;
    }
    
    try {
      await deleteImage(uploadedImageUrl);
      setUploadedImageUrl(null);
      toast.success("Imagen eliminada correctamente");
    } catch (error) {
      // Error is already toasted in deleteImage
    }
  };
  
  const checkBuckets = async () => {
    toast.info("Verificando buckets disponibles...");
    await debugStorageBuckets();
    toast.success("Verificación completa. Revise la consola para más detalles");
  };
  
  if (!isAuthenticated) {
    return (
      <div className="p-6 bg-zinc-800 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Ejemplo de Subida de Imágenes</h2>
        <div className="p-4 bg-yellow-900/30 border border-yellow-800 rounded-md">
          <p className="text-yellow-200">
            Debe iniciar sesión para usar esta funcionalidad.
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-6 bg-zinc-800 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Ejemplo de Subida de Imágenes</h2>
      
      <div className="mb-6">
        <Button 
          variant="outline" 
          onClick={checkBuckets} 
          className="w-full mb-4"
        >
          Verificar Buckets Disponibles
        </Button>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Seleccionar Imagen
          </label>
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="bg-zinc-700/50 border-zinc-600"
          />
        </div>
        
        <Button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="w-full"
        >
          {uploading ? 'Subiendo...' : 'Subir Imagen'}
        </Button>
        
        {uploadedImageUrl && (
          <div className="mt-6 space-y-4">
            <div className="aspect-video relative">
              <img
                src={uploadedImageUrl}
                alt="Imagen subida"
                className="w-full h-full object-contain rounded-md border border-zinc-600"
              />
            </div>
            
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-300 truncate flex-1">
                URL: {uploadedImageUrl}
              </div>
              <Button
                variant="destructive"
                onClick={handleDelete}
                className="ml-2"
              >
                Eliminar
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploadExample;
