
import { useGalleryImages, useUploadImage, useDeleteImage } from "@/hooks/useGallery";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Upload, ImageOff, Trash2, AlertCircle, Plus, ImageIcon, X } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardContent } from "@/components/ui/card";

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
  const [showUploadForm, setShowUploadForm] = useState(false);

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
            setShowUploadForm(false);
            
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

  const toggleUploadForm = () => {
    setShowUploadForm(!showUploadForm);
    if (!showUploadForm) {
      setFile(null);
      setTitle("");
      setDescription("");
      setPreviewUrl(null);
      setUploadError(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Galería de Imágenes</h2>
        <Button 
          onClick={toggleUploadForm} 
          className="bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600"
        >
          {showUploadForm ? (
            <>
              <X size={18} />
              Cancelar
            </>
          ) : (
            <>
              <Plus size={18} />
              Nueva Imagen
            </>
          )}
        </Button>
      </div>
      
      {showUploadForm && (
        <Card className="overflow-hidden border-none bg-zinc-800/70 backdrop-blur-sm shadow-lg">
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-4 text-white">Subir Nueva Imagen</h3>
            
            {uploadError && (
              <Alert variant="destructive" className="mb-4 bg-red-900/30 text-white border-red-800">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {uploadError}
                </AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Imagen
                </label>
                
                {!previewUrl ? (
                  <div className="border-2 border-dashed border-zinc-600 rounded-lg p-6 hover:border-zinc-500 transition-colors cursor-pointer bg-zinc-700/50 flex flex-col items-center justify-center" onClick={() => document.getElementById('file-upload')?.click()}>
                    <input
                      id="file-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      required
                    />
                    <ImageIcon className="h-10 w-10 text-zinc-400 mb-2" />
                    <p className="text-sm text-zinc-400">Arrastra una imagen o haz clic para seleccionar</p>
                    <p className="text-xs text-zinc-500 mt-1">PNG, JPG o GIF hasta 10MB</p>
                  </div>
                ) : (
                  <div className="relative w-full max-w-xs mx-auto">
                    <AspectRatio ratio={1/1} className="overflow-hidden rounded-lg border border-zinc-600">
                      <img 
                        src={previewUrl} 
                        alt="Vista previa" 
                        className="w-full h-full object-cover"
                      />
                    </AspectRatio>
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewUrl(null);
                        setFile(null);
                        const fileInput = document.getElementById('file-upload') as HTMLInputElement;
                        if (fileInput) fileInput.value = '';
                      }}
                      className="absolute -top-2 -right-2 bg-red-600 rounded-full p-1 shadow-md hover:bg-red-700 transition-colors"
                    >
                      <X size={16} className="text-white" />
                    </button>
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Título
                </label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="bg-zinc-700/70 border-zinc-600 focus-visible:ring-indigo-500"
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
                  className="bg-zinc-700/70 border-zinc-600 focus-visible:ring-indigo-500"
                  placeholder="Descripción de la imagen"
                />
              </div>
              
              <div className="flex gap-3 justify-end pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={toggleUploadForm}
                  className="border-zinc-600 bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                  disabled={isUploading}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600"
                  disabled={isUploading || !file}
                >
                  {isUploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                      Subiendo...
                    </>
                  ) : (
                    <>
                      <Upload size={16} />
                      Subir Imagen
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="bg-zinc-800/50 rounded-lg animate-pulse">
              <AspectRatio ratio={1/1} className="bg-zinc-700/50" />
              <div className="p-3 space-y-2">
                <div className="h-4 bg-zinc-700/50 rounded w-3/4"></div>
                <div className="h-3 bg-zinc-700/50 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : !images || images.length === 0 ? (
        <div className="bg-zinc-800/50 backdrop-blur-sm shadow-md rounded-xl p-10 text-center">
          <ImageOff className="mx-auto h-16 w-16 text-zinc-500 mb-4 opacity-70" />
          <h3 className="text-xl font-medium text-zinc-300 mb-1">No hay imágenes en la galería</h3>
          <p className="text-zinc-400 mb-6">Empieza subiendo tu primera imagen para crear tu galería</p>
          {!showUploadForm && (
            <Button 
              onClick={toggleUploadForm}
              className="bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600"
            >
              <Plus size={18} />
              Nueva Imagen
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image) => (
            <Card key={image.id} className="group overflow-hidden bg-zinc-800/70 backdrop-blur-sm border-none shadow-lg hover:shadow-xl transition-all">
              <div className="relative">
                <AspectRatio ratio={1/1} className="bg-zinc-900">
                  <img
                    src={image.file_path}
                    alt={image.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
                    onError={(e) => {
                      console.error(`Error loading image: ${image.file_path}`);
                      (e.target as HTMLImageElement).src = "/placeholder.svg";
                    }}
                  />
                </AspectRatio>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                  <Button
                    onClick={() => deleteImage.mutate({ 
                      id: image.id, 
                      storagePath: image.storage_path 
                    })}
                    variant="destructive"
                    size="sm"
                    className="ml-auto bg-red-600/90 hover:bg-red-700"
                    title="Eliminar imagen"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
              <CardContent className="p-3">
                <h3 className="font-medium text-sm text-zinc-200 truncate" title={image.title}>{image.title}</h3>
                {image.description && (
                  <p className="text-zinc-400 text-xs mt-1 line-clamp-2" title={image.description}>
                    {image.description}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default GalleryManagement;
