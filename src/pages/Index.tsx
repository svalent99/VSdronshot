
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NavHeader from '../components/NavHeader';
import WelcomeAnimation from '../components/WelcomeAnimation';
import HeroSection from '../components/HeroSection';
import MainContent from '../components/MainContent';
import '../App.css';

const Index = () => {
  // Always show welcome animation on first render
  const [showWelcome, setShowWelcome] = useState(true);

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <AnimatePresence mode="wait">
        {showWelcome ? (
          <WelcomeAnimation onAnimationComplete={() => setShowWelcome(false)} />
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
      </AnimatePresence>
    </div>
  );
};

export default Index;
