
import React, { useState } from 'react';
import { toast } from "sonner";
import { galleryImages } from "@/utils/adminGalleryData";

// Get stored data utility function
const getStoredData = (key: string, defaultValue: any) => {
  try {
    const storedData = localStorage.getItem(key);
    return storedData ? JSON.parse(storedData) : defaultValue;
  } catch (error) {
    console.error(`Error retrieving ${key} from localStorage:`, error);
    return defaultValue;
  }
};

export const GalleryManagement: React.FC = () => {
  const [images, setImages] = useState(() => getStoredData('galleryImages', galleryImages));
  const [newImages, setNewImages] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);

  React.useEffect(() => {
    try {
      localStorage.setItem('galleryImages', JSON.stringify(images));
      console.log('Guardadas imágenes de galería en localStorage:', images);
    } catch (error) {
      console.error('Error al guardar imágenes de galería:', error);
    }
  }, [images]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setUploading(true);
    
    const newImage = {
      id: Date.now(),
      title: "Nueva imagen",
      thumbnail: URL.createObjectURL(files[0]),
      file: files[0]
    };
    
    setNewImages([...newImages, newImage]);
    setUploading(false);
    toast.success('Imagen subida correctamente');
  };

  const handleAddToGallery = (id: number) => {
    const imageToAdd = newImages.find(img => img.id === id);
    if (imageToAdd) {
      const newGalleryImage = {
        id: Date.now(),
        title: imageToAdd.title,
        thumbnail: imageToAdd.thumbnail
      };
      
      setImages([...images, newGalleryImage]);
      setNewImages(newImages.filter(img => img.id !== id));
      toast.success('Imagen añadida a la galería');
    }
  };

  const handleDeleteImage = (id: number) => {
    setImages(images.filter(img => img.id !== id));
    toast.success('Imagen eliminada de la galería');
  };

  const handleDeleteNewImage = (id: number) => {
    setNewImages(newImages.filter(img => img.id !== id));
    toast.success('Imagen eliminada');
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Gestionar Galería de Imágenes</h2>
        <label className="px-4 py-2 bg-sky-600 hover:bg-sky-700 rounded font-semibold cursor-pointer transition">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
            disabled={uploading}
          />
          {uploading ? 'Subiendo...' : 'Subir Nueva Imagen'}
        </label>
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
                    alt={image.title} 
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute top-2 right-2 flex space-x-2">
                    <button
                      onClick={() => handleAddToGallery(image.id)}
                      className="w-8 h-8 flex items-center justify-center bg-green-600 rounded-full hover:bg-green-700 transition"
                      title="Subir a la galería"
                    >
                      ✓
                    </button>
                    <button
                      onClick={() => handleDeleteNewImage(image.id)}
                      className="w-8 h-8 flex items-center justify-center bg-red-600 rounded-full hover:bg-red-700 transition"
                      title="Eliminar"
                    >
                      ✕
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <input
                    type="text"
                    value={image.title}
                    onChange={(e) => {
                      const updatedImages = [...newImages];
                      const idx = updatedImages.findIndex(img => img.id === image.id);
                      updatedImages[idx] = { ...updatedImages[idx], title: e.target.value };
                      setNewImages(updatedImages);
                    }}
                    className="w-full p-2 bg-zinc-700 border border-zinc-600 rounded text-white"
                  />
                  <button
                    onClick={() => handleAddToGallery(image.id)}
                    className="w-full mt-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-sm font-semibold transition"
                  >
                    Subir imagen a la página
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <h3 className="text-lg font-semibold mb-3">Imágenes en la galería</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image) => (
          <div key={image.id} className="bg-zinc-800 rounded-lg overflow-hidden border border-zinc-700">
            <div className="aspect-w-16 aspect-h-9 relative">
              <img 
                src={image.thumbnail} 
                alt={image.title} 
                className="w-full h-64 object-cover"
              />
              <button
                onClick={() => handleDeleteImage(image.id)}
                className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-red-600 rounded-full hover:bg-red-700 transition"
                title="Eliminar de la galería"
              >
                ✕
              </button>
            </div>
            <div className="p-4">
              <input
                type="text"
                value={image.title}
                onChange={(e) => {
                  const newImages = [...images];
                  const idx = newImages.findIndex(img => img.id === image.id);
                  newImages[idx] = { ...newImages[idx], title: e.target.value };
                  setImages(newImages);
                }}
                className="w-full p-2 bg-zinc-700 border border-zinc-600 rounded text-white"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
