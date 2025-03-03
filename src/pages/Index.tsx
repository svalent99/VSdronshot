import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NavHeader from '../components/NavHeader';
import ServicesCarousel from '../components/ServicesCarousel';
import DroneSection from '../components/DroneSection';
import ImageGallery from '../components/ImageGallery';
import ReviewsSection from '../components/ReviewsSection';
import FaqSection from '../components/FaqSection';
import Footer from '../components/Footer';
import '../App.css';
import { MessageCircle } from 'lucide-react';

const Index = () => {
  // Use localStorage to check if this is the first visit
  const [showWelcome, setShowWelcome] = useState(() => {
    const hasVisited = localStorage.getItem('hasVisitedBefore');
    return !hasVisited;
  });
  
  const [loading, setLoading] = useState(true);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    // After showing the welcome animation, set the flag in localStorage
    if (!showWelcome) {
      localStorage.setItem('hasVisitedBefore', 'true');
    }
    
    const timeoutId = setTimeout(() => {
      if (showWelcome) {
        console.log('Forzando finalización de animación de carga después de tiempo de espera');
        setShowWelcome(false);
        localStorage.setItem('hasVisitedBefore', 'true');
      }
    }, 5000);

    const handleVideoEnd = () => {
      console.log('Video de animación terminó');
      setShowWelcome(false);
      localStorage.setItem('hasVisitedBefore', 'true');
    };

    const handleVideoError = () => {
      console.error('Error loading animation video');
      setVideoError(true);
      setShowWelcome(false);
      localStorage.setItem('hasVisitedBefore', 'true');
    };

    const videoElement = document.querySelector('video.welcome-video');
    
    if (videoElement) {
      console.log('Video de animación encontrado');
      videoElement.addEventListener('ended', handleVideoEnd);
      videoElement.addEventListener('error', handleVideoError);
      
      if (videoElement.play) {
        videoElement.play().catch(error => {
          console.error('Error intentando reproducir el video de bienvenida:', error);
          setVideoError(true);
          setShowWelcome(false);
          localStorage.setItem('hasVisitedBefore', 'true');
        });
      }
    } else {
      console.warn('Video de animación no encontrado');
    }

    // Reset localStorage for demo purposes (remove in production)
    if (!showWelcome) {
      localStorage.removeItem('hasVisitedBefore');
    }

    return () => {
      clearTimeout(timeoutId);
      if (videoElement) {
        videoElement.removeEventListener('ended', handleVideoEnd);
        videoElement.removeEventListener('error', handleVideoError);
      }
    };
  }, [showWelcome]);

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <AnimatePresence mode="wait">
        {showWelcome && !videoError ? (
          <motion.div
            key="welcome"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="min-h-screen flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 1 }}
              animate={{ scale: 1 }}
              className="relative w-screen h-screen flex items-center justify-center"
            >
              <motion.video
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover welcome-video"
                onLoadedData={() => {
                  console.log('Video de animación cargado');
                  setLoading(false);
                }}
                onError={() => {
                  console.error('Error cargando video de animación');
                  setVideoError(true);
                  setShowWelcome(false);
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: loading ? 0 : 1 }}
                transition={{ duration: 0.5 }}
              >
                <source src="/animacion dron pantalla  carga.mp4" type="video/mp4" />
                Tu navegador no soporta el tag de video.
              </motion.video>
              {loading && !videoError && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="min-h-screen flex flex-col"
          >
            <div className="fixed top-8 left-0 right-0 z-50">
              <NavHeader />
            </div>
            
            <div className="relative min-h-screen flex flex-col items-center justify-center">
              <div className="absolute inset-0 z-0 w-full h-full overflow-hidden">
                <video 
                  key="hero-video"
                  autoPlay 
                  muted 
                  loop 
                  playsInline 
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={(e) => {
                    console.error('Error loading hero video', e);
                    e.currentTarget.parentElement?.classList.add('video-fallback');
                  }}
                >
                  <source src="/video hero.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-black bg-opacity-60"></div>
              </div>
              
              <div className="flex flex-col items-center justify-center flex-grow space-y-8 pt-28 pb-20 z-10 relative">
                <motion.span 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="text-sm font-light tracking-widest uppercase"
                >
                  Bienvenido a
                </motion.span>
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.8 }}
                  className="text-5xl md:text-7xl font-bold text-center"
                >
                  VS Dron Shot
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9, duration: 0.8 }}
                  className="text-lg md:text-xl text-gray-400 max-w-md text-center"
                >
                  Descubre un nuevo mundo desde las alturas
                </motion.p>
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1, duration: 0.8 }}
                  className="mt-8 px-8 py-3 bg-[#0EA5E9] text-white rounded-md font-semibold text-lg hover:bg-[#0284C7] transition-colors duration-300 transform hover:scale-105"
                >
                  Conocenos
                </motion.button>
              </div>
            </div>
            
            <div className="w-full bg-black py-16">
              <ServicesCarousel />
            </div>
            
            <DroneSection />
            
            <div className="w-full bg-black py-16">
              <div className="max-w-7xl mx-auto px-4">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">Galería de Imágenes</h2>
                <ImageGallery />
              </div>
            </div>
            
            <div className="w-full bg-gradient-to-b from-black to-zinc-900 py-16">
              <div className="max-w-7xl mx-auto px-4">
                <ReviewsSection />
              </div>
            </div>
            
            <FaqSection />
            
            <Footer />
            
            <a
              href="https://wa.me/1127424407?text=Hola,%20me%20gustaría%20obtener%20más%20información%20sobre%20sus%20servicios%20de%20dron"
              target="_blank"
              rel="noopener noreferrer"
              className="fixed bottom-6 right-6 z-50 bg-green-500 text-white rounded-full p-4 shadow-lg hover:bg-green-600 transition-colors duration-300"
              aria-label="Chat on WhatsApp"
            >
              <MessageCircle className="h-6 w-6" />
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
