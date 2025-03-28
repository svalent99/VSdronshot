
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import NavHeader from '../components/NavHeader';
import HeroSection from '../components/HeroSection';
import MainContent from '../components/MainContent';
import WelcomeAnimation from '../components/WelcomeAnimation';
import '../App.css';

const Index = () => {
  const [showAnimation, setShowAnimation] = useState(false);
  
  useEffect(() => {
    // Check if user has already seen the animation
    const hasSeenAnimation = localStorage.getItem('hasSeenWelcomeAnimation');
    
    if (!hasSeenAnimation) {
      setShowAnimation(true);
      // Mark that user has seen the animation
      localStorage.setItem('hasSeenWelcomeAnimation', 'true');
    }
  }, []);
  
  const handleAnimationComplete = () => {
    setShowAnimation(false);
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {showAnimation ? (
        <WelcomeAnimation onAnimationComplete={handleAnimationComplete} />
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
          
          <HeroSection />
          
          <MainContent />
        </motion.div>
      )}
    </div>
  );
};

export default Index;
