import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { createClient } from '@supabase/supabase-js';

// Crear cliente de Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Datos de prueba para reseñas pendientes
const pendingReviews = [
  {
    id: 101,
    name: "Roberto González",
    username: "@robertogonzalez",
    body: "Excelente servicio, las imágenes capturadas con el dron han ayudado mucho a promocionar mi propiedad.",
    img: "https://i.pravatar.cc/150?img=10",
    rating: 5,
    pending: true
  },
  {
    id: 102,
    name: "Mariana López",
    username: "@marianalopez",
    body: "Impresionante la calidad de las tomas aéreas. Definitivamente recomendaré sus servicios.",
    img: "https://i.pravatar.cc/150?img=11",
    rating: 4,
    pending: true
  },
  {
    id: 103,
    name: "Eduardo Ramírez",
    username: "@eduardoramirez",
    body: "Muy profesionales y puntuales. Las fotografías son de gran calidad.",
    img: "https://i.pravatar.cc/150?img=12",
    rating: 5,
    pending: true
  }
];

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
  const storedData = localStorage.getItem(key);
  return storedData ? JSON.parse(storedData) : defaultValue;
};

const Admin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('reviews');
  const [reviews, setReviews] = useState(() => getStoredData('pendingReviews', pendingReviews));
  const [approvedReviews, setApprovedReviews] = useState(() => getStoredData('approvedReviews', []));
  const [images, setImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Cargar imágenes desde Supabase al iniciar
  useEffect(() => {
    const fetchImages = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('gallery_images')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        if (data && data.length > 0) {
          setImages(data);
        } else {
          // Usar datos de prueba si no hay imágenes en Supabase
          setImages(galleryImages);
        }
      } catch (error) {
        console.error('Error fetching images:', error);
        toast.error('Error al cargar las imágenes');
        // Usar datos de prueba si hay un error
        setImages(galleryImages);
      } finally {
        setIsLoading(false);
      }
    };

    if (isLoggedIn) {
      fetchImages();
    }
  }, [isLoggedIn]);

  // Guardar datos en localStorage cuando cambian
  useEffect(() => {
    localStorage.setItem('pendingReviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('approvedReviews', JSON.stringify(approvedReviews));
  }, [approvedReviews]);

  useEffect(() => {
    localStorage.setItem('galleryImages', JSON.stringify(images));
  }, [images]);

  // Función para manejar el inicio de sesión
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Verificar las credenciales (simplificado para el ejemplo)
    if (email === 'valen.sotelo.123@gmail.com' && password === 'svolando9') {
      setIsLoggedIn(true);
    } else {
      toast.error('Credenciales incorrectas. Por favor, intenta de nuevo.');
    }
  };

  // Función para aprobar o rechazar una reseña
  const handleReviewAction = (id: number, approve: boolean) => {
    if (approve) {
      // Buscar la reseña en la lista de pendientes
      const reviewToApprove = reviews.find(review => review.id === id);
      if (reviewToApprove) {
        // Agregar a la lista de aprobadas
        setApprovedReviews([...approvedReviews, reviewToApprove]);
        toast.success('Reseña aprobada y publicada');
      }
    } else {
      toast.error('Reseña rechazada');
    }
    
    // Eliminar la reseña de la lista de pendientes
    setReviews(reviews.filter(review => review.id !== id));
  };

  // Función para subir una nueva imagen
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setUploading(true);
    
    // Crear nueva imagen con URL temporal para vista previa
    const newImage = {
      id: Date.now(),
      title: "Nueva imagen",
      description: "",
      thumbnail: URL.createObjectURL(files[0]), // URL temporal para la vista previa
      file: files[0]
    };
    
    setNewImages([...newImages, newImage]);
    setUploading(false);
    toast.success('Imagen cargada correctamente para vista previa');
  };

  // Función para subir imagen a Supabase
  const handleAddToGallery = async (id: number) => {
    const imageToAdd = newImages.find(img => img.id === id);
    if (!imageToAdd || !imageToAdd.file) return;
    
    setUploading(true);
    
    try {
      // 1. Subir archivo a Supabase Storage
      const fileName = `${Date.now()}_${imageToAdd.file.name}`;
      const { data: fileData, error: fileError } = await supabase
        .storage
        .from('gallery')
        .upload(fileName, imageToAdd.file);
        
      if (fileError) throw fileError;
      
      // 2. Obtener URL pública del archivo
      const { data: urlData } = await supabase
        .storage
        .from('gallery')
        .getPublicUrl(fileName);
        
      if (!urlData.publicUrl) throw new Error('No se pudo obtener la URL pública');
      
      // 3. Guardar registro en la tabla gallery_images
      const { data: imageData, error: imageError } = await supabase
        .from('gallery_images')
        .insert([
          { 
            title: imageToAdd.title, 
            description: imageToAdd.description || '',
            thumbnail: urlData.publicUrl
          }
        ])
        .select();
        
      if (imageError) throw imageError;
      
      // 4. Actualizar el estado con los nuevos datos
      if (imageData && imageData.length > 0) {
        setImages([imageData[0], ...images]);
        setNewImages(newImages.filter(img => img.id !== id));
        toast.success('Imagen añadida a la galería correctamente');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Error al subir la imagen a la galería');
    } finally {
      setUploading(false);
    }
  };

  // Función para eliminar una imagen de Supabase
  const handleDeleteImage = async (id: number) => {
    try {
      // 1. Obtener información de la imagen para eliminar el archivo
      const imageToDelete = images.find(img => img.id === id);
      if (!imageToDelete) return;
      
      // 2. Eliminar el registro de la base de datos
      const { error: dbError } = await supabase
        .from('gallery_images')
        .delete()
        .eq('id', id);
        
      if (dbError) throw dbError;
      
      // 3. Eliminar el archivo de Storage si tenemos el nombre de archivo
      // Extraer el nombre del archivo de la URL (esto depende de la estructura de tu URL)
      const fileName = imageToDelete.thumbnail.split('/').pop();
      if (fileName) {
        const { error: storageError } = await supabase
          .storage
          .from('gallery')
          .remove([fileName]);
          
        if (storageError) console.warn('Error removing file from storage:', storageError);
      }
      
      // 4. Actualizar el estado
      setImages(images.filter(img => img.id !== id));
      toast.success('Imagen eliminada de la galería');
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('Error al eliminar la imagen');
    }
  };

  // Función para eliminar una imagen nueva (solo del estado)
  const handleDeleteNewImage = (id: number) => {
    setNewImages(newImages.filter(img => img.id !== id));
    toast.success('Imagen eliminada');
  };

  // Función para actualizar el título o descripción de una imagen
  const handleUpdateImage = async (id: number, field: 'title' | 'description', value: string) => {
    try {
      // 1. Actualizar en Supabase
      const { error } = await supabase
        .from('gallery_images')
        .update({ [field]: value })
        .eq('id', id);
        
      if (error) throw error;
      
      // 2. Actualizar el estado local
      const updatedImages = images.map(img => {
        if (img.id === id) {
          return { ...img, [field]: value };
        }
        return img;
      });
      setImages(updatedImages);
    } catch (error) {
      console.error(`Error updating image ${field}:`, error);
      toast.error(`Error al actualizar ${field === 'title' ? 'el título' : 'la descripción'}`);
    }
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
                  Reseñas Pendientes ({reviews.length})
                </button>
                <button
                  onClick={() => setActiveTab('approved')}
                  className={`py-4 px-1 font-medium text-sm border-b-2 ${
                    activeTab === 'approved' 
                      ? 'border-sky-500 text-sky-500' 
                      : 'border-transparent text-gray-400 hover:text-gray-200'
                  }`}
                >
                  Reseñas Aprobadas ({approvedReviews.length})
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
                {reviews.length === 0 ? (
                  <div className="text-center py-12 bg-zinc-800/50 rounded-lg">
                    <p className="text-gray-400">No hay reseñas pendientes de aprobación.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div key={review.id} className="bg-zinc-800 rounded-lg p-6 border border-zinc-700">
                        <div className="flex items-start">
                          <img src={review.img} alt={review.name} className="w-12 h-12 rounded-full mr-4" />
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <div>
                                <h3 className="font-bold">{review.name}</h3>
                                <p className="text-gray-400 text-sm">{review.username}</p>
                              </div>
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleReviewAction(review.id, true)}
                                  className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm"
                                >
                                  Aprobar
                                </button>
                                <button
                                  onClick={() => handleReviewAction(review.id, false)}
                                  className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm"
                                >
                                  Rechazar
                                </button>
                              </div>
                            </div>
                            <p className="mt-3">{review.body}</p>
                          </div>
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
                {approvedReviews.length === 0 ? (
                  <div className="text-center py-12 bg-zinc-800/50 rounded-lg">
                    <p className="text-gray-400">No hay reseñas aprobadas todavía.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {approvedReviews.map((review) => (
                      <div key={review.id} className="bg-zinc-800 rounded-lg p-6 border border-zinc-700">
                        <div className="flex items-start">
                          <img src={review.img} alt={review.name} className="w-12 h-12 rounded-full mr-4" />
                          <div className="flex-1">
                            <div>
                              <h3 className="font-bold">{review.name}</h3>
                              <p className="text-gray-400 text-sm">{review.username}</p>
                            </div>
                            <p className="mt-3">{review.body}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
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
                          <div className="p-4 space-y-3">
                            <div>
                              <label htmlFor={`title-${image.id}`} className="block text-sm font-medium text-gray-300 mb-1">
                                Título
                              </label>
                              <input
                                id={`title-${image.id}`}
                                type="text"
                                value={image.title}
                                onChange={(e) => {
                                  const updatedImages = [...newImages];
                                  const idx = updatedImages.findIndex(img => img.id === image.id);
                                  updatedImages[idx] = { ...updatedImages[idx], title: e.target.value };
                                  setNewImages(updatedImages);
                                }}
                                className="w-full p-2 bg-zinc-700 border border-zinc-600 rounded text-white"
                                placeholder="Título de la imagen"
                              />
                            </div>
                            <div>
                              <label htmlFor={`desc-${image.id}`} className="block text-sm font-medium text-gray-300 mb-1">
                                Descripción
                              </label>
                              <textarea
                                id={`desc-${image.id}`}
                                value={image.description || ''}
                                onChange={(e) => {
                                  const updatedImages = [...newImages];
                                  const idx = updatedImages.findIndex(img => img.id === image.id);
                                  updatedImages[idx] = { ...updatedImages[idx], description: e.target.value };
                                  setNewImages(updatedImages);
                                }}
                                className="w-full p-2 bg-zinc-700 border border-zinc-600 rounded text-white"
                                placeholder="Descripción de la imagen"
                                rows={2}
                              />
                            </div>
                            <button
                              onClick={() => handleAddToGallery(image.id)}
                              className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-sm font-semibold transition"
                            >
                              Subir imagen a la galería
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <h3 className="text-lg font-semibold mb-3">Imágenes en la galería</h3>
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
                      <span className="sr-only">Cargando...</span>
                    </div>
                    <p className="mt-2 text-gray-400">Cargando imágenes...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {images.length === 0 ? (
                      <div className="col-span-full text-center py-12 bg-zinc-800/50 rounded-lg">
                        <p className="text-gray-400">No hay imágenes en la galería. Sube algunas.</p>
                      </div>
                    ) : (
                      images.map((image) => (
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
                          <div className="p-4 space-y-3">
                            <div>
                              <label htmlFor={`gallery-title-${image.id}`} className="block text-sm font-medium text-gray-300 mb-1">
                                Título
                              </label>
                              <input
                                id={`gallery-title-${image.id}`}
                                type="text"
                                value={image.title}
                                onChange={(e) => handleUpdateImage(image.id, 'title', e.target.value)}
                                onBlur={(e) => {
                                  if (e.target.value !== image.title) {
                                    handleUpdateImage(image.id, 'title', e.target.value);
                                  }
                                }}
                                className="w-full p-2 bg-zinc-700 border border-zinc-600 rounded text-white"
                              />
                            </div>
                            <div>
                              <label htmlFor={`gallery-desc-${image.id}`} className="block text-sm font-medium text-gray-300 mb-1">
                                Descripción
                              </label>
                              <textarea
                                id={`gallery-desc-${image.id}`}
                                value={image.description || ''}
                                onChange={(e) => handleUpdateImage(image.id, 'description', e.target.value)}
                                onBlur={(e) => {
                                  if (e.target.value !== image.description) {
                                    handleUpdateImage(image.id, 'description', e.target.value);
                                  }
                                }}
                                className="w-full p-2 bg-zinc-700 border border-zinc-600 rounded text-white"
                                rows={2}
                              />
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Admin;
