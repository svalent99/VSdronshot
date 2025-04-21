
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import ReviewsSection from "@/components/ReviewsSection";
import { useReviews, useApproveReview, useDeleteReview, Review } from "@/hooks/useReviews";
import { Check, X, MessageSquare, CheckCheck, Inbox } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Datos de prueba para imágenes de la galería
const galleryImages = [
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

// Obtener los datos almacenados de localStorage o usar los valores predeterminados
const getStoredData = (key, defaultValue) => {
  try {
    const storedData = localStorage.getItem(key);
    return storedData ? JSON.parse(storedData) : defaultValue;
  } catch (error) {
    console.error(`Error retrieving ${key} from localStorage:`, error);
    return defaultValue;
  }
};

const Admin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('reviews');
  const [images, setImages] = useState(() => getStoredData('galleryImages', galleryImages));
  const [newImages, setNewImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();
  
  const { data: allReviews, isLoading: reviewsLoading } = useReviews();
  const { mutate: approveReview } = useApproveReview();
  const { mutate: deleteReview } = useDeleteReview();
  const queryClient = useQueryClient();
  
  const pendingReviews = allReviews?.filter(review => !review.aprobado) || [];
  const approvedReviews = allReviews?.filter(review => review.aprobado) || [];

  // Guardar datos en localStorage cuando cambian
  useEffect(() => {
    try {
      localStorage.setItem('galleryImages', JSON.stringify(images));
      console.log('Guardadas imágenes de galería en localStorage:', images);
    } catch (error) {
      console.error('Error al guardar imágenes de galería:', error);
    }
  }, [images]);

  // Función para manejar el inicio de sesión
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Verificar las credenciales (simplificado para el ejemplo)
    if (email === 'valen.sotelo.123@gmail.com' && password === 'svolando9') {
      setIsLoggedIn(true);
      toast.success('Inicio de sesión exitoso');
    } else {
      toast.error('Credenciales incorrectas. Por favor, intenta de nuevo.');
    }
  };

  // Función para aprobar o rechazar una reseña
  const handleReviewAction = (id: string, approve: boolean) => {
    console.log(`Processing review ${id}, approve=${approve}`);
    approveReview({ id, approve }, {
      onSuccess: () => {
        if (approve) {
          toast.success('Reseña aprobada y publicada');
          // Force refresh to update the UI
          setTimeout(() => {
            queryClient.invalidateQueries({ queryKey: ['reviews'] });
          }, 500);
        } else {
          toast.error('Reseña rechazada');
        }
      },
      onError: (error) => {
        console.error("Error processing review:", error);
        toast.error('Hubo un error al procesar la reseña');
      }
    });
  };
  
  // Función para eliminar una reseña
  const handleDeleteReview = (id: string) => {
    deleteReview(id, {
      onSuccess: () => {
        toast.success('Reseña eliminada correctamente');
      },
      onError: () => {
        toast.error('Error al eliminar la reseña');
      }
    });
  };

  // Función para subir una nueva imagen
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setUploading(true);
    
    // Crear nueva imagen con URL temporal
    const newImage = {
      id: Date.now(),
      title: "Nueva imagen",
      thumbnail: URL.createObjectURL(files[0]), // Crear URL temporal para la vista previa
      file: files[0]
    };
    
    setNewImages([...newImages, newImage]);
    setUploading(false);
    toast.success('Imagen subida correctamente');
  };

  // Función para subir imagen a la galería
  const handleAddToGallery = (id: number) => {
    const imageToAdd = newImages.find(img => img.id === id);
    if (imageToAdd) {
      const newGalleryImage = {
        id: Date.now(), // Usar timestamp para asegurar IDs únicos
        title: imageToAdd.title,
        thumbnail: imageToAdd.thumbnail
      };
      
      // Agregar a las imágenes existentes
      const updatedImages = [...images, newGalleryImage];
      setImages(updatedImages);
      
      // Eliminar de imágenes nuevas
      setNewImages(newImages.filter(img => img.id !== id));
      toast.success('Imagen añadida a la galería');
    }
  };

  // Función para eliminar una imagen
  const handleDeleteImage = (id: number) => {
    const filteredImages = images.filter(img => img.id !== id);
    setImages(filteredImages);
    toast.success('Imagen eliminada de la galería');
  };

  // Función para eliminar una imagen nueva
  const handleDeleteNewImage = (id: number) => {
    setNewImages(newImages.filter(img => img.id !== id));
    toast.success('Imagen eliminada');
  };
  
  // Función para renderizar estrellas basado en puntaje
  const renderStars = (puntaje: number) => {
    const stars = [];
    for (let i = 0; i < puntaje; i++) {
      stars.push(<span key={i} className="text-yellow-500">★</span>);
    }
    return stars;
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      <header className="bg-black py-4 px-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">VS Dron Shot - Panel de Administración</h1>
        {isLoggedIn && (
          <button 
            onClick={() => navigate('/')}
            className="px-4 py-2 border border-white/20 rounded hover:bg-white/10 transition"
          >
            Volver al sitio
          </button>
        )}
      </header>
      
      <main className="max-w-6xl mx-auto p-6">
        {!isLoggedIn ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto mt-16 p-8 bg-zinc-800 rounded-lg border border-zinc-700"
          >
            <h2 className="text-2xl font-bold mb-6 text-center">Iniciar Sesión</h2>
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full p-2 bg-zinc-700 border border-zinc-600 rounded text-white"
                  placeholder="ejemplo@correo.com"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                  Contraseña
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full p-2 bg-zinc-700 border border-zinc-600 rounded text-white"
                />
              </div>
              <button
                type="submit"
                className="w-full px-4 py-3 bg-sky-600 hover:bg-sky-700 rounded font-semibold transition"
              >
                Iniciar Sesión
              </button>
            </form>
          </motion.div>
        ) : (
          <div className="mt-8">
            <div className="border-b border-zinc-700 mb-8">
              <nav className="flex space-x-8">
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`py-4 px-1 font-medium text-sm border-b-2 ${
                    activeTab === 'reviews' 
                      ? 'border-sky-500 text-sky-500' 
                      : 'border-transparent text-gray-400 hover:text-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Inbox size={16} />
                    Reseñas Pendientes ({pendingReviews.length})
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('approved')}
                  className={`py-4 px-1 font-medium text-sm border-b-2 ${
                    activeTab === 'approved' 
                      ? 'border-sky-500 text-sky-500' 
                      : 'border-transparent text-gray-400 hover:text-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <CheckCheck size={16} />
                    Reseñas Aprobadas ({approvedReviews.length})
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('gallery')}
                  className={`py-4 px-1 font-medium text-sm border-b-2 ${
                    activeTab === 'gallery' 
                      ? 'border-sky-500 text-sky-500' 
                      : 'border-transparent text-gray-400 hover:text-gray-200'
                  }`}
                >
                  Gestionar Galería
                </button>
              </nav>
            </div>
            
            {activeTab === 'reviews' && (
              <div>
                <h2 className="text-xl font-bold mb-6">Reseñas Pendientes de Aprobación</h2>
                {reviewsLoading ? (
                  <div className="text-center py-8">Cargando reseñas...</div>
                ) : pendingReviews.length === 0 ? (
                  <div className="text-center py-12 bg-zinc-800/50 rounded-lg">
                    <p className="text-gray-400">No hay reseñas pendientes de aprobación.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {pendingReviews.map((review) => (
                      <div key={review.id} className="bg-zinc-800 rounded-lg p-6 border border-zinc-700">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center space-x-2">
                              <h3 className="font-bold">{review.nombre_cliente}</h3>
                              <div className="flex">{renderStars(review.puntaje)}</div>
                            </div>
                            <p className="text-gray-400 text-sm">{new Date(review.created_at).toLocaleDateString()}</p>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleReviewAction(review.id, true)}
                              className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm flex items-center gap-1"
                            >
                              <Check size={14} /> Aprobar
                            </button>
                            <button
                              onClick={() => handleReviewAction(review.id, false)}
                              className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm flex items-center gap-1"
                            >
                              <X size={14} /> Rechazar
                            </button>
                          </div>
                        </div>
                        <div className="mt-3 max-w-full overflow-hidden">
                          <p className="break-words whitespace-pre-wrap">{review.contenido}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'approved' && (
              <div>
                <h2 className="text-xl font-bold mb-6">Reseñas Aprobadas</h2>
                {reviewsLoading ? (
                  <div className="text-center py-8">Cargando reseñas...</div>
                ) : approvedReviews.length === 0 ? (
                  <div className="text-center py-12 bg-zinc-800/50 rounded-lg">
                    <p className="text-gray-400">No hay reseñas aprobadas para mostrar.</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Calificación</TableHead>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Contenido</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {approvedReviews.map((review) => (
                        <TableRow key={review.id}>
                          <TableCell className="font-medium">{review.nombre_cliente}</TableCell>
                          <TableCell>
                            <div className="flex">{renderStars(review.puntaje)}</div>
                          </TableCell>
                          <TableCell>{new Date(review.created_at).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <div className="max-w-md truncate">{review.contenido}</div>
                          </TableCell>
                          <TableCell className="text-right">
                            <button
                              onClick={() => handleDeleteReview(review.id)}
                              className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm"
                            >
                              Eliminar
                            </button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
            )}
            
            {activeTab === 'gallery' && (
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
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Admin;
