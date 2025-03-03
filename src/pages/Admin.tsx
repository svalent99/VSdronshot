
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";

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
const defaultGalleryImages = [
  {
    id: 1,
    title: "Vista panorámica de campo",
    thumbnail: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZHJvbmV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
    description: "Hermosa vista panorámica de campo abierto",
  },
  {
    id: 2,
    title: "Propiedad residencial",
    thumbnail: "https://images.unsplash.com/photo-1577724862607-83214b7d0e89?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8ZHJvbmUlMjB2aWV3fGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
    description: "Vista aérea de propiedad residencial de lujo",
  },
  {
    id: 3,
    title: "Complejo turístico",
    thumbnail: "https://images.unsplash.com/photo-1534372860894-9476556ea6c7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGRyb25lJTIwdmlld3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
    description: "Complejo turístico frente al mar con vista aérea",
  }
];

// Obtener los datos almacenados de localStorage o usar los valores predeterminados
const getStoredData = (key, defaultValue) => {
  const storedData = localStorage.getItem(key);
  return storedData ? JSON.parse(storedData) : defaultValue;
};

// Guardar datos en localStorage
const saveToLocalStorage = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

const Admin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('reviews');
  const [reviews, setReviews] = useState(() => getStoredData('pendingReviews', pendingReviews));
  const [approvedReviews, setApprovedReviews] = useState(() => getStoredData('approvedReviews', []));
  const [images, setImages] = useState(() => getStoredData('galleryImages', defaultGalleryImages));
  const [newImages, setNewImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  // Guardar datos en localStorage cuando cambian
  useEffect(() => {
    saveToLocalStorage('pendingReviews', reviews);
  }, [reviews]);

  useEffect(() => {
    saveToLocalStorage('approvedReviews', approvedReviews);
  }, [approvedReviews]);

  useEffect(() => {
    saveToLocalStorage('galleryImages', images);
  }, [images]);

  // Función para manejar el inicio de sesión
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Verificar las credenciales con los valores correctos
    if (email === 'valen.sotelo.123@gmail.com' && password === 'vsdronshot9') {
      setIsLoggedIn(true);
      toast.success('Inicio de sesión exitoso');
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
    
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target && event.target.result) {
        // Crear nueva imagen con URL temporal
        const newImage = {
          id: Date.now(),
          title: "Nueva imagen",
          thumbnail: event.target.result.toString(),
          description: "Añade una descripción",
          file: files[0]
        };
        
        setNewImages(prev => [...prev, newImage]);
        setUploading(false);
        toast.success('Imagen subida correctamente');
      }
    };
    
    reader.readAsDataURL(files[0]);
  };

  // Función para actualizar título o descripción de imagen nueva
  const updateNewImageField = (id: number, field: string, value: string) => {
    const updatedImages = newImages.map(img => 
      img.id === id ? { ...img, [field]: value } : img
    );
    setNewImages(updatedImages);
  };

  // Función para actualizar título o descripción de imagen en galería
  const updateGalleryImageField = (id: number, field: string, value: string) => {
    const updatedImages = images.map(img => 
      img.id === id ? { ...img, [field]: value } : img
    );
    setImages(updatedImages);
    saveToLocalStorage('galleryImages', updatedImages);
  };

  // Función para subir imagen a la galería
  const handleAddToGallery = (id: number) => {
    const imageToAdd = newImages.find(img => img.id === id);
    if (imageToAdd) {
      const newGalleryImage = {
        id: Date.now(),
        title: imageToAdd.title,
        thumbnail: imageToAdd.thumbnail,
        description: imageToAdd.description || "Descripción de la imagen"
      };
      
      const updatedGalleryImages = [...images, newGalleryImage];
      setImages(updatedGalleryImages);
      saveToLocalStorage('galleryImages', updatedGalleryImages);
      
      setNewImages(newImages.filter(img => img.id !== id));
      toast.success('Imagen añadida a la galería');
    }
  };

  // Función para eliminar una imagen
  const handleDeleteImage = (id: number) => {
    const updatedImages = images.filter(img => img.id !== id);
    setImages(updatedImages);
    saveToLocalStorage('galleryImages', updatedImages);
    toast.success('Imagen eliminada de la galería');
  };

  // Función para eliminar una imagen nueva
  const handleDeleteNewImage = (id: number) => {
    setNewImages(newImages.filter(img => img.id !== id));
    toast.success('Imagen eliminada');
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
                          <div className="p-4 space-y-2">
                            <div>
                              <label className="text-xs text-gray-400 mb-1 block">Título</label>
                              <input
                                type="text"
                                value={image.title}
                                onChange={(e) => updateNewImageField(image.id, 'title', e.target.value)}
                                className="w-full p-2 bg-zinc-700 border border-zinc-600 rounded text-white"
                              />
                            </div>
                            <div>
                              <label className="text-xs text-gray-400 mb-1 block">Descripción</label>
                              <input
                                type="text"
                                value={image.description || ""}
                                onChange={(e) => updateNewImageField(image.id, 'description', e.target.value)}
                                className="w-full p-2 bg-zinc-700 border border-zinc-600 rounded text-white"
                                placeholder="Añade una descripción corta"
                              />
                            </div>
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
                      <div className="p-4 space-y-2">
                        <div>
                          <label className="text-xs text-gray-400 mb-1 block">Título</label>
                          <input
                            type="text"
                            value={image.title}
                            onChange={(e) => updateGalleryImageField(image.id, 'title', e.target.value)}
                            className="w-full p-2 bg-zinc-700 border border-zinc-600 rounded text-white"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-400 mb-1 block">Descripción</label>
                          <input
                            type="text"
                            value={image.description || ""}
                            onChange={(e) => updateGalleryImageField(image.id, 'description', e.target.value)}
                            className="w-full p-2 bg-zinc-700 border border-zinc-600 rounded text-white"
                            placeholder="Añade una descripción corta"
                          />
                        </div>
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
