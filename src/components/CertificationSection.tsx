import React from 'react';
import { motion } from 'framer-motion';

const CertificationSection = () => {
  return (
    <div id="certification-section" className="w-full py-24 relative certification-section">
      {/* Background Image with Blur */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('martillera.jpeg')",
          filter: "blur(2px)",
          opacity: 0.2
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center max-w-4xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
            Captura profesional de propiedades desde el aire, con la visión de una Martillera Pública
          </h2>
          
          <div className="space-y-4 text-gray-300 text-left">
            <p>
              Como Martillera Pública y Corredora Inmobiliaria con experiencia en el sector, conozco de primera mano los detalles que hacen que una propiedad se destaque en el mercado. Mi formación me ha permitido comprender cómo presentar una propiedad de manera atractiva para los compradores, identificando sus puntos fuertes y potenciándolos en cada oportunidad.
            </p>
            <p>
              Al combinar mi experiencia inmobiliaria con la tecnología de DJI, ofrezco imágenes aéreas que no solo muestran la propiedad desde nuevas perspectivas, sino que también destacan sus mejores características, como la ubicación, la accesibilidad y los espacios exteriores, entre otras cosas.
            </p>
            <p>
              Con mi enfoque, puedo capturar las imágenes más relevantes, comprendiendo los aspectos del terreno y las áreas circundantes que más influyen en la decisión de compra. Este conocimiento me permite ofrecer un servicio más personalizado y efectivo, adaptado a las necesidades de cada inmobiliaria.
            </p>
            <p className="font-semibold mt-6">
              ¡Confía en alguien que entiende el negocio desde adentro y sabe cómo presentar tu propiedad de la mejor manera posible!
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CertificationSection;
