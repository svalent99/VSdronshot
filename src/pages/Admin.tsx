
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Inbox, CheckCheck, Image } from "lucide-react";
import { LoginForm } from '@/components/admin/LoginForm';
import ReviewsManagement from '@/components/admin/ReviewsManagement';
import GalleryManagement from '@/components/admin/GalleryManagement';

const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('pending');
  const navigate = useNavigate();

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
            <div className="border-b border-zinc-700 mb-8">
              <nav className="flex space-x-8">
                <button
                  onClick={() => setActiveTab('pending')}
                  className={`py-4 px-1 font-medium text-sm border-b-2 ${
                    activeTab === 'pending' 
                      ? 'border-sky-500 text-sky-500' 
                      : 'border-transparent text-gray-400 hover:text-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Inbox size={16} />
                    Reseñas Pendientes
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
                    Reseñas Aprobadas
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
                  <div className="flex items-center gap-2">
                    <Image size={16} />
                    Gestionar Galería
                  </div>
                </button>
              </nav>
            </div>
            
            {activeTab === 'pending' && (
              <div>
                <h2 className="text-xl font-bold mb-6">Reseñas Pendientes de Aprobación</h2>
                <ReviewsManagement showPending={true} />
              </div>
            )}
            
            {activeTab === 'approved' && (
              <div>
                <h2 className="text-xl font-bold mb-6">Reseñas Aprobadas</h2>
                <ReviewsManagement showPending={false} />
              </div>
            )}
            
            {activeTab === 'gallery' && <GalleryManagement />}
          </div>
        )}
      </main>
    </div>
  );
};

export default Admin;
