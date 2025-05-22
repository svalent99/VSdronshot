
import { motion } from 'framer-motion';

const HeroSection = () => {
  const scrollToCertificationSection = () => {
    // Find the certification section by ID
    const certificationSection = document.getElementById('certification-section');
    
    if (certificationSection) {
      certificationSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
          <source src="/video hero.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80"></div>
      </div>
      
      <div className="flex flex-col items-center justify-center flex-grow space-y-8 pt-28 pb-20 z-10 relative">
        <motion.span 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-sm font-light tracking-widest uppercase text-purple-300"
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
          className="text-lg md:text-xl text-gray-300 max-w-md text-center"
        >
          Descubre un nuevo mundo desde las alturas
        </motion.p>
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(124, 58, 237, 0.5)" }}
          transition={{ delay: 1.1, duration: 0.3 }}
          className="mt-8 px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-md font-semibold text-lg transition-all duration-300 relative overflow-hidden group"
          onClick={scrollToCertificationSection}
        >
          <span className="relative z-10">Conocenos</span>
          <span className="absolute inset-0 bg-gradient-to-r from-purple-700 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          <span className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></span>
        </motion.button>
      </div>
    </div>
  );
};

export default HeroSection;
