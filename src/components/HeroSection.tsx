
import { motion } from 'framer-motion';

const HeroSection = () => {
  return (
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
          <source src="./video hero.mp4" type="video/mp4" />
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
  );
};

export default HeroSection;
