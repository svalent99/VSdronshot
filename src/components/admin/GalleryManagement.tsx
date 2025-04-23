
import { useGalleryImages, useUploadImage, useDeleteImage } from "@/hooks/useGallery";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Upload, ImageOff, Trash2 } from "lucide-react";

const GalleryManagement = () => {
  const { data: images, isLoading } = useGalleryImages();
  const uploadImage = useUploadImage();
  const deleteImage = useDeleteImage();
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title) return;

    uploadImage.mutate(
      { file, title, description },
      {
        onSuccess: () => {
          setFile(null);
          setTitle("");
          setDescription("");
        }
      }
    );
  };

  return (
    <div>
      <div className="bg-zinc-800/50 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-bold mb-6">Subir Nueva Imagen</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Imagen
            </label>
            <Input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              required
              className="bg-zinc-700/50 border-zinc-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Título
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="bg-zinc-700/50 border-zinc-600"
              placeholder="Título de la imagen"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Descripción (opcional)
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-zinc-700/50 border-zinc-600"
              placeholder="Descripción de la imagen"
            />
          </div>
          <Button
            type="submit"
            className="w-full flex items-center justify-center gap-2"
            disabled={uploadImage.isPending}
          >
            <Upload size={16} />
            {uploadImage.isPending ? "Subiendo..." : "Subir Imagen"}
          </Button>
        </form>
      </div>

      <h2 className="text-xl font-bold mb-6">Imágenes en la Galería</h2>
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
      ) : !images || images.length === 0 ? (
        <div className="text-center py-12 bg-zinc-800/50 rounded-lg">
          <ImageOff className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-400">No hay imágenes en la galería</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image) => (
            <div key={image.id} className="bg-zinc-800 rounded-lg overflow-hidden">
              <div className="aspect-video relative">
                <img
                  src={image.file_path}
                  alt={image.title}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => deleteImage.mutate({ 
                    id: image.id, 
                    storagePath: image.storage_path 
                  })}
                  className="absolute top-2 right-2 p-2 bg-red-600 rounded-full hover:bg-red-700 transition-colors"
                  title="Eliminar imagen"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg">{image.title}</h3>
                {image.description && (
                  <p className="text-gray-300 text-sm mt-1">{image.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GalleryManagement;
