
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Inbox, CheckCheck, Image, LogOut } from "lucide-react";
import { LoginForm } from '@/components/admin/LoginForm';
import ReviewsManagement from '@/components/admin/ReviewsManagement';
import GalleryManagement from '@/components/admin/GalleryManagement';
import { supabase, debugStorageBuckets } from '@/integrations/supabase/client';
import { toast } from "sonner";

const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('pending');
  const [isLoading, setIsLoading] = useState(true);
  const [sessionChecked, setSessionChecked] = useState(false);
  const navigate = useNavigate();

  // Check for existing session on component mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        console.log("Initial session check:", data.session ? "Session found" : "No session");
        
        if (data.session) {
          // Verify the session is valid by getting the user
          const { data: userData, error: userError } = await supabase.auth.getUser();
          
          if (userError || !userData.user) {
            console.error("Error verifying user:", userError);
            setIsLoggedIn(false);
          } else {
            console.log("User verified:", userData.user.id);
            setIsLoggedIn(true);
          }
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Error checking session:", error);
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
        setSessionChecked(true);
      }
    };

    checkSession();

    // Setup auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event);
      
      if (event === 'SIGNED_IN') {
        console.log("User signed in:", session?.user?.id);
        setIsLoggedIn(true);
      } else if (event === 'SIGNED_OUT') {
        console.log("User signed out");
        setIsLoggedIn(false);
      } else if (event === 'TOKEN_REFRESHED') {
        console.log("Token refreshed");
        setIsLoggedIn(!!session);
      } else if (event === 'USER_UPDATED') {
        console.log("User updated");
        setIsLoggedIn(!!session);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Debug storage buckets when switching to gallery tab
  const handleTabChange = async (tab: string) => {
    setActiveTab(tab);
    
    if (tab === 'gallery' && isLoggedIn) {
      try {
        // Check if we can access the buckets when switching to gallery tab
        await debugStorageBuckets();
      } catch (error) {
        console.error("Failed to debug storage buckets:", error);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Sesión cerrada exitosamente");
      setIsLoggedIn(false);
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Error al cerrar la sesión");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-900 text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      <header className="bg-black py-4 px-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">VS Dron Shot - Panel de Administración</h1>
        {isLoggedIn && (
          <div className="flex space-x-4">
            <button 
              onClick={() => navigate('/')}
              className="px-4 py-2 border border-white/20 rounded hover:bg-white/10 transition"
            >
              Volver al sitio
            </button>
            <button 
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded flex items-center space-x-2 transition"
            >
              <LogOut size={16} />
              <span>Cerrar sesión</span>
            </button>
          </div>
        )}
      </header>
      
      <main className="max-w-6xl mx-auto p-6">
        {!isLoggedIn ? (
          <>
            <LoginForm onLogin={() => setIsLoggedIn(true)} />
            {sessionChecked && (
              <div className="mt-4 p-4 bg-blue-900/30 border border-blue-800 rounded-md">
                <p className="text-sm text-blue-200">
                  Nota: Si estás viendo problemas de autenticación, intenta cerrar sesión y volver a iniciarla.
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="mt-8">
            <div className="border-b border-zinc-700 mb-8">
              <nav className="flex space-x-8">
                <button
                  onClick={() => handleTabChange('pending')}
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
                  onClick={() => handleTabChange('approved')}
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
                  onClick={() => handleTabChange('gallery')}
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
