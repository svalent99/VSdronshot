
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface WelcomeAnimationProps {
  onAnimationComplete: () => void;
}

const WelcomeAnimation = ({ onAnimationComplete }: WelcomeAnimationProps) => {
  const [loading, setLoading] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const welcomeVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Set a timer to ensure animation doesn't hang indefinitely
    const timeoutId = setTimeout(() => {
      console.log('Forzando finalización de animación de carga después de tiempo de espera');
      onAnimationComplete();
    }, 7000); // Extended timeout for slower connections

    return () => {
      clearTimeout(timeoutId);
    };
  }, [onAnimationComplete]);

  // Handle welcome video
  useEffect(() => {
    const handleVideoEnd = () => {
      console.log('Video de animación terminó');
      onAnimationComplete();
    };

    const handleVideoError = () => {
      console.error('Error loading animation video');
      setVideoError(true);
      onAnimationComplete();
    };

    const videoEl = welcomeVideoRef.current;
    
    if (videoEl) {
      console.log('Video element found, attempting to play');
      
      videoEl.addEventListener('ended', handleVideoEnd);
      videoEl.addEventListener('error', handleVideoError);
      
      // Define the playVideo function properly at this scope level
      const playVideo = () => {
        videoEl.play().catch(error => {
          console.error('Error playing welcome video:', error);
          setVideoError(true);
          onAnimationComplete();
        });
      };

      // Track if we added the canplay listener to properly clean it up
      let canplayListenerAdded = false;

      if (videoEl.readyState >= 2) {
        playVideo();
      } else {
        videoEl.addEventListener('canplay', playVideo);
        canplayListenerAdded = true;
      }

      // Clean up function
      return () => {
        if (videoEl) {
          videoEl.removeEventListener('ended', handleVideoEnd);
          videoEl.removeEventListener('error', handleVideoError);
          
          if (canplayListenerAdded) {
            videoEl.removeEventListener('canplay', playVideo);
          }
        }
      };
    } else {
      console.warn('Welcome video element not found');
      // Fallback if video element isn't found
      setTimeout(() => {
        onAnimationComplete();
      }, 1000);
    }
  }, [onAnimationComplete]);

  if (videoError) {
    return null;
  }

  return (
    <motion.div
      key="welcome"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black"
    >
      <motion.div
        initial={{ scale: 1 }}
        animate={{ scale: 1 }}
        className="relative w-screen h-screen flex items-center justify-center"
      >
        <video
          ref={welcomeVideoRef}
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
            onAnimationComplete();
          }}
        >
          <source src="/animacion dron pantalla  carga.mp4" type="video/mp4" />
          Tu navegador no soporta el tag de video.
        </video>
        {loading && !videoError && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default WelcomeAnimation;
