
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ReviewsSection from "@/components/ReviewsSection";
import LoginForm from '@/components/admin/LoginForm';
import AdminNav from '@/components/admin/AdminNav';
import PendingReviews from '@/components/admin/PendingReviews';
import GalleryManager from '@/components/admin/GalleryManager';

// Get stored data from localStorage or use default values
const getStoredData = (key: string, defaultValue: any) => {
  try {
    const storedData = localStorage.getItem(key);
    return storedData ? JSON.parse(storedData) : defaultValue;
  } catch (error) {
    console.error(`Error retrieving ${key} from localStorage:`, error);
    return defaultValue;
  }
};

const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('reviews');
  const [reviews, setReviews] = useState(() => getStoredData('pendingReviews', []));
  const [images, setImages] = useState(() => getStoredData('galleryImages', []));
  const [newImages, setNewImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  // Save data to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('pendingReviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('galleryImages', JSON.stringify(images));
  }, [images]);

  const handleReviewAction = (id: number, approve: boolean) => {
    if (approve) {
      const reviewToApprove = reviews.find(review => review.id === id);
      if (reviewToApprove) {
        const currentApprovedReviews = getStoredData('approvedReviews', []);
        const updatedApprovedReviews = [...currentApprovedReviews, reviewToApprove];
        localStorage.setItem('approvedReviews', JSON.stringify(updatedApprovedReviews));
      }
    }
    setReviews(reviews.filter(review => review.id !== id));
  };

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
    }
  };

  const handleImageTitle = (id: number, title: string, isNew = false) => {
    if (isNew) {
      setNewImages(newImages.map(img => 
        img.id === id ? { ...img, title } : img
      ));
    } else {
      setImages(images.map(img => 
        img.id === id ? { ...img, title } : img
      ));
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
          <LoginForm onLogin={() => setIsLoggedIn(true)} />
        ) : (
          <div className="mt-8">
            <AdminNav 
              activeTab={activeTab}
              reviewsCount={reviews.length}
              onTabChange={setActiveTab}
            />
            
            {activeTab === 'reviews' && (
              <PendingReviews 
                reviews={reviews}
                onReviewAction={handleReviewAction}
              />
            )}
            
            {activeTab === 'approved' && (
              <div>
                <h2 className="text-xl font-bold mb-6">Reseñas Aprobadas</h2>
                <ReviewsSection isAdmin={true} />
              </div>
            )}
            
            {activeTab === 'gallery' && (
              <GalleryManager
                images={images}
                newImages={newImages}
                onImageUpload={handleImageUpload}
                onAddToGallery={handleAddToGallery}
                onDeleteImage={(id) => setImages(images.filter(img => img.id !== id))}
                onDeleteNewImage={(id) => setNewImages(newImages.filter(img => img.id !== id))}
                onTitleChange={handleImageTitle}
                uploading={uploading}
              />
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Admin;
