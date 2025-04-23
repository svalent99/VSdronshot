
import ServicesCarousel from './ServicesCarousel';
import DroneSection from './DroneSection';
import CertificationSection from './CertificationSection';
import GallerySection from './GallerySection';
import ReviewsSection from './ReviewsSection';
import FaqSection from './FaqSection';
import Footer from './Footer';

const MainContent = () => {
  return (
    <>
      <div id="services-section" className="w-full bg-black py-16">
        <ServicesCarousel />
      </div>
      
      <div className="w-full bg-black py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">
            Galería de Imágenes
          </h2>
          <GallerySection />
        </div>
      </div>
      
      <div id="drone-section">
        <DroneSection />
      </div>
      
      <div className="w-full bg-zinc-900">
        <CertificationSection />
      </div>
      
      <div className="w-full bg-gradient-to-b from-black to-zinc-900 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <ReviewsSection />
        </div>
      </div>
      
      <FaqSection />
      
      <div id="footer-section">
        <Footer />
      </div>
    </>
  );
};

export default MainContent;
