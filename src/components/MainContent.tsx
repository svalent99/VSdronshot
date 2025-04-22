import ServicesCarousel from './ServicesCarousel';
import DroneSection from './DroneSection';
import CertificationSection from './CertificationSection';
import FaqSection from './FaqSection';
import Footer from './Footer';

const MainContent = () => {
  return (
    <>
      <div id="services-section" className="w-full bg-black py-16">
        <ServicesCarousel />
      </div>
      
      <div id="drone-section">
        <DroneSection />
      </div>
      
      <div className="w-full bg-zinc-900">
        <CertificationSection />
      </div>
      
      <FaqSection />
      
      <div id="footer-section">
        <Footer />
      </div>
    </>
  );
};

export default MainContent;
