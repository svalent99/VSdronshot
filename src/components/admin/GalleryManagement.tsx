
import { useGalleryImages, useUploadImage, useDeleteImage } from "@/hooks/useGallery";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Upload, ImageOff, Trash2, Image, FileText } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

const GalleryManagement = () => {
  const { data: images, isLoading } = useGalleryImages();
  const uploadImage = useUploadImage();
  const deleteImage = useDeleteImage();
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setUploadError(null);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setFile(null);
      setPreviewUrl(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadError(null);
    
    if (!file || !title) {
      toast.error("Por favor seleccione una imagen y agregue un título");
      return;
    }

    setIsUploading(true);
    
    try {
      await uploadImage.mutateAsync(
        { file, title, description },
        {
          onSuccess: () => {
            // Reset form
            setFile(null);
            setTitle("");
            setDescription("");
            setPreviewUrl(null);
            
            // Reset file input
            const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
            if (fileInput) {
              fileInput.value = '';
            }
          },
          onError: (error: any) => {
            setUploadError(error?.message || "Error desconocido al subir la imagen");
          }
        }
      );
    } catch (error: any) {
      console.error("Upload failed:", error);
      setUploadError(error?.message || "Error desconocido al subir la imagen");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <Card className="mb-8 border border-zinc-700/50 bg-zinc-800/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl">Subir Nueva Imagen</CardTitle>
        </CardHeader>
        <CardContent>
          {uploadError && (
            <div className="mb-4 rounded-md bg-red-900/30 px-4 py-3 text-sm text-white border border-red-800">
              <p className="flex items-center gap-2">
                <span className="text-red-400">⚠️</span>
                {uploadError}
              </p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1">
              <Label htmlFor="image-upload" className="text-sm font-medium text-zinc-300">
                Imagen
              </Label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    required
                    className="bg-zinc-700/30 border-zinc-600/50 py-6 pl-10 cursor-pointer file:bg-zinc-600 file:text-white file:border-0 file:rounded file:px-3 file:py-1 file:mr-3 hover:file:bg-zinc-500 transition-all"
                  />
                  <Image className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" size={18} />
                </div>
              </div>
            </div>
            
            {previewUrl && (
              <div className="relative overflow-hidden rounded-lg border border-zinc-600/50 bg-zinc-700/20 aspect-video w-full max-w-sm mx-auto">
                <img 
                  src={previewUrl} 
                  alt="Vista previa" 
                  className="w-full h-full object-contain p-2"
                />
              </div>
            )}
            
            <div className="space-y-1">
              <Label htmlFor="title" className="text-sm font-medium text-zinc-300">
                Título
              </Label>
              <div className="relative">
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="bg-zinc-700/30 border-zinc-600/50 pl-10"
                  placeholder="Ingrese el título de la imagen"
                />
                <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" size={18} />
              </div>
            </div>
            
            <div className="space-y-1">
              <Label htmlFor="description" className="text-sm font-medium text-zinc-300">
                Descripción (opcional)
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-zinc-700/30 border-zinc-600/50 min-h-[100px] resize-none"
                placeholder="Agregue una descripción para la imagen"
              />
            </div>
            
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-2 rounded-md transition-all duration-300 flex items-center justify-center gap-2"
              disabled={isUploading || !file}
            >
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Subiendo...
                </>
              ) : (
                <>
                  <Upload size={18} />
                  Subir Imagen
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

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
                  onError={(e) => {
                    console.error(`Error loading image: ${image.file_path}`);
                    (e.target as HTMLImageElement).src = "/placeholder.svg";
                  }}
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
