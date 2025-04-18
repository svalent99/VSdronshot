
import React from 'react';
import { toast } from "sonner";

interface GalleryImage {
  id: number;
  title: string;
  thumbnail: string;
}

interface GalleryManagerProps {
  images: GalleryImage[];
  newImages: GalleryImage[];
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAddToGallery: (id: number) => void;
  onDeleteImage: (id: number) => void;
  onDeleteNewImage: (id: number) => void;
  onTitleChange: (id: number, title: string, isNew?: boolean) => void;
  uploading: boolean;
}

const GalleryManager: React.FC<GalleryManagerProps> = ({
  images,
  newImages,
  onImageUpload,
  onAddToGallery,
  onDeleteImage,
  onDeleteNewImage,
  onTitleChange,
  uploading
}) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Gestionar Galería de Imágenes</h2>
        <label className="px-4 py-2 bg-sky-600 hover:bg-sky-700 rounded font-semibold cursor-pointer transition">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onImageUpload}
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
                      onClick={() => onAddToGallery(image.id)}
                      className="w-8 h-8 flex items-center justify-center bg-green-600 rounded-full hover:bg-green-700 transition"
                      title="Subir a la galería"
                    >
                      ✓
                    </button>
                    <button
                      onClick={() => onDeleteNewImage(image.id)}
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
                    onChange={(e) => onTitleChange(image.id, e.target.value, true)}
                    className="w-full p-2 bg-zinc-700 border border-zinc-600 rounded text-white"
                  />
                  <button
                    onClick={() => onAddToGallery(image.id)}
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
                onClick={() => onDeleteImage(image.id)}
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
                onChange={(e) => onTitleChange(image.id, e.target.value)}
                className="w-full p-2 bg-zinc-700 border border-zinc-600 rounded text-white"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GalleryManager;
