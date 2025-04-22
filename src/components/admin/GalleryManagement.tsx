
import React, { useState, useEffect } from 'react';
import { toast } from "sonner";
import { useDronShots } from "@/hooks/useDronShots";
import { supabase } from "@/integrations/supabase/client";
import { PlusCircle, X, Upload, Trash2 } from "lucide-react";
import { uploadImageToSupabase } from "@/utils/adminGalleryData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export const GalleryManagement: React.FC = () => {
  const { data: dronShots, isLoading, error, refetch } = useDronShots();
  const [newImages, setNewImages] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (error) {
      console.error("Error al cargar imágenes:", error);
      toast.error("Error al cargar imágenes de la galería");
    }
  }, [error]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const newImage = {
      id: Date.now(),
      title: "",
      description: "",
      thumbnail: URL.createObjectURL(files[0]),
      file: files[0]
    };
    
    setNewImages([...newImages, newImage]);
    toast.success('Imagen cargada. Complete los detalles para publicarla.');
  };

  const handleAddToGallery = async (id: number) => {
    const imageToAdd = newImages.find(img => img.id === id);
    if (!imageToAdd || !imageToAdd.title.trim()) {
      toast.error('Por favor, proporcione un título para la imagen');
      return;
    }
    
    setUploading(true);
    
    try {
      const result = await uploadImageToSupabase(
        imageToAdd.file, 
        imageToAdd.title, 
        imageToAdd.description
      );
      
      if (result.success) {
        setNewImages(newImages.filter(img => img.id !== id));
        toast.success('Imagen añadida a la galería correctamente');
        refetch(); // Recargar las imágenes después de agregar una nueva
      } else {
        throw new Error("Error al subir la imagen");
      }
    } catch (error) {
      console.error("Error al añadir imagen:", error);
      toast.error('Error al añadir la imagen a la galería');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async (id: string) => {
    try {
      const { error } = await supabase
        .from('dron_shots')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast.success('Imagen eliminada de la galería');
      refetch();
    } catch (error) {
      console.error("Error al eliminar imagen:", error);
      toast.error('Error al eliminar la imagen');
    }
  };

  const handleDeleteNewImage = (id: number) => {
    setNewImages(newImages.filter(img => img.id !== id));
    toast.success('Imagen eliminada');
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Gestionar Galería de Imágenes</h2>
        <Button variant="default" className="flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700">
          <label className="cursor-pointer flex items-center gap-2">
            <PlusCircle size={16} />
            <span>Subir Nueva Imagen</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
              disabled={uploading}
            />
          </label>
        </Button>
      </div>
      
      {newImages.length > 0 && (
        <div className="mb-10">
          <h3 className="text-lg font-semibold mb-3">Imágenes nuevas</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newImages.map((image) => (
              <div key={image.id} className="bg-zinc-800 rounded-lg overflow-hidden border border-zinc-700">
                <div className="aspect-w-16 aspect-h-9 relative">
                  <img 
                    src={image.thumbnail} 
                    alt={image.title || "Nueva imagen"} 
                    className="w-full h-64 object-cover"
                  />
                  <button
                    onClick={() => handleDeleteNewImage(image.id)}
                    className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-red-600 rounded-full hover:bg-red-700 transition"
                    title="Eliminar"
                  >
                    <X size={16} />
                  </button>
                </div>
                <div className="p-4 space-y-3">
                  <div>
                    <label className="block text-gray-300 text-sm mb-1">Título</label>
                    <Input
                      value={image.title}
                      onChange={(e) => {
                        const updatedImages = [...newImages];
                        const idx = updatedImages.findIndex(img => img.id === image.id);
                        updatedImages[idx] = { ...updatedImages[idx], title: e.target.value };
                        setNewImages(updatedImages);
                      }}
                      placeholder="Añadir título"
                      className="w-full p-2 bg-zinc-700 border border-zinc-600"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm mb-1">Descripción (opcional)</label>
                    <Textarea
                      value={image.description}
                      onChange={(e) => {
                        const updatedImages = [...newImages];
                        const idx = updatedImages.findIndex(img => img.id === image.id);
                        updatedImages[idx] = { ...updatedImages[idx], description: e.target.value };
                        setNewImages(updatedImages);
                      }}
                      placeholder="Añadir descripción"
                      className="w-full p-2 bg-zinc-700 border border-zinc-600 resize-none h-20"
                    />
                  </div>
                  <Button
                    onClick={() => handleAddToGallery(image.id)}
                    disabled={uploading}
                    className="w-full mt-2 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700"
                  >
                    <Upload size={16} />
                    {uploading ? 'Subiendo...' : 'Publicar imagen'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <h3 className="text-lg font-semibold mb-3">Imágenes en la galería</h3>
      {isLoading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
      ) : dronShots?.length === 0 ? (
        <div className="text-center py-12 bg-zinc-800/50 rounded-lg">
          <p className="text-gray-400">No hay imágenes en la galería</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dronShots?.map((image) => (
            <div key={image.id} className="bg-zinc-800 rounded-lg overflow-hidden border border-zinc-700">
              <div className="aspect-w-16 aspect-h-9 relative">
                <img 
                  src={image.archivo_url} 
                  alt={image.titulo} 
                  className="w-full h-64 object-cover"
                />
                <button
                  onClick={() => handleDeleteImage(image.id)}
                  className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-red-600 rounded-full hover:bg-red-700 transition"
                  title="Eliminar de la galería"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="p-4">
                <h4 className="font-semibold text-lg mb-2">{image.titulo}</h4>
                {image.descripcion && (
                  <p className="text-gray-300 text-sm">{image.descripcion}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
