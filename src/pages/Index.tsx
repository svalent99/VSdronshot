
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Index = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular el tiempo de la animación del dron
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 4000);

    return () => clearTimeout(timer);
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
              initial={{ scale: 0.5, y: 100 }}
              animate={{ scale: 1, y: 0 }}
              transition={{
                duration: 2,
                ease: "easeOut"
              }}
              className="relative w-64 h-64 flex items-center justify-center"
            >
              <motion.video
                autoPlay
                muted
                playsInline
                className="w-full h-full object-contain"
                onLoadedData={() => setLoading(false)}
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
