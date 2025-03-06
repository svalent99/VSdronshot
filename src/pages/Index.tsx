
import { motion } from 'framer-motion';
import NavHeader from '../components/NavHeader';
import HeroSection from '../components/HeroSection';
import MainContent from '../components/MainContent';
import '../App.css';

const Index = () => {
  // Removed welcome animation state - we'll go straight to main content
  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
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
    </div>
  );
};

export default Index;
