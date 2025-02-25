
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Index = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const videoElement = document.querySelector('video');
    console.log('Video element found:', videoElement);
    
    if (videoElement) {
      const handleVideoEnd = () => {
        console.log('Video ended');
        setShowWelcome(false);
      };

      const handleVideoError = (e: Event) => {
        console.log('Video error:', e);
        setShowWelcome(false); // Fallback en caso de error
      };

      videoElement.addEventListener('ended', handleVideoEnd);
      videoElement.addEventListener('error', handleVideoError);

      // Fallback por si el video no carga después de 5 segundos
      const timeoutId = setTimeout(() => {
        console.log('Timeout reached, forcing content display');
        setShowWelcome(false);
      }, 5000);

      return () => {
        videoElement.removeEventListener('ended', handleVideoEnd);
        videoElement.removeEventListener('error', handleVideoError);
        clearTimeout(timeoutId);
      };
    } else {
      // Si no se encuentra el elemento de video, mostrar el contenido
      console.log('No video element found, showing content');
      setShowWelcome(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <AnimatePresence mode="wait">
        {showWelcome ? (
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
                className="w-full h-full object-contain"
                onLoadedData={() => {
                  console.log('Video loaded');
                  setLoading(false);
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: loading ? 0 : 1 }}
                transition={{ duration: 0.5 }}
              >
                <source src="/animacion dron pantalla  carga.mp4" type="video/mp4" />
                Tu navegador no soporta el tag de video.
              </motion.video>
              {loading && (
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
            className="min-h-screen flex flex-col items-center justify-center space-y-8"
          >
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
              Tu Experiencia con Drones
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
              Conócenos
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
