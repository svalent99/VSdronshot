
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

const Index = () => {
  // Always show welcome animation on first render
  const [showWelcome, setShowWelcome] = useState(true);
  const [loading, setLoading] = useState(true);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    // Set a timer to ensure animation doesn't hang indefinitely
    const timeoutId = setTimeout(() => {
      if (showWelcome) {
        console.log('Forzando finalización de animación de carga después de tiempo de espera');
        setShowWelcome(false);
      }
    }, 5000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [showWelcome]);

  // Separate effect for video handling to ensure DOM is ready
  useEffect(() => {
    if (!showWelcome) return;

    const handleVideoEnd = () => {
      console.log('Video de animación terminó');
      setShowWelcome(false);
    };

    const handleVideoError = (error) => {
      console.error('Error loading animation video:', error);
      setVideoError(true);
      setShowWelcome(false);
    };

    // Use a short timeout to ensure the DOM is fully rendered
    const videoTimeoutId = setTimeout(() => {
      const videoElement = document.querySelector('.welcome-video');
      
      if (videoElement && videoElement instanceof HTMLVideoElement) {
        console.log('Video de animación encontrado');
        videoElement.addEventListener('ended', handleVideoEnd);
        videoElement.addEventListener('error', handleVideoError);
        
        videoElement.play().catch(error => {
          console.error('Error intentando reproducir el video de bienvenida:', error);
          setVideoError(true);
          setShowWelcome(false);
        });
      } else {
        console.warn('Video de animación no encontrado');
        // If video element isn't found after a reasonable time, we'll skip the animation
        setTimeout(() => {
          if (showWelcome) {
            console.warn('Video de animación nunca encontrado, saltando animación');
            setShowWelcome(false);
          }
        }, 1000);
      }
    }, 100);

    return () => {
      clearTimeout(videoTimeoutId);
      const videoElement = document.querySelector('.welcome-video');
      if (videoElement && videoElement instanceof HTMLVideoElement) {
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
              <video
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
              >
                <source src="/animacion dron pantalla carga.mp4" type="video/mp4" />
                Tu navegador no soporta el tag de video.
              </video>
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
