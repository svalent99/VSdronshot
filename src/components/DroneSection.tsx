
import React from 'react';
import { motion } from 'framer-motion';

const DroneSection = () => {
  return (
    <div id="drone-section" className="w-full bg-zinc-900 py-24">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex justify-center md:justify-end"
          >
            <img 
              src="/fotodron.png" 
              alt="Dron Profesional" 
              className="w-full max-w-md rounded-lg shadow-2xl shadow-sky-500/20"
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex flex-col space-y-6"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Nuestro dron capta las mejores imágenes y videos de tu propiedad
            </h2>
            <div className="space-y-4 text-gray-300">
              <p>
                En el mundo inmobiliario, la primera impresión lo es todo. Por eso, utilizamos un dron de última generación, diseñado para capturar imágenes y videos en alta resolución, asegurando tomas cinemáticas, fluidas y detalladas de cada propiedad.
              </p>
              <p>
                Gracias a su tecnología avanzada, este dron permite vuelos estables y seguros, incluso en espacios reducidos, logrando ángulos únicos que realzan la arquitectura y el entorno. Su sistema de detección de obstáculos y vuelo inteligente garantiza capturas precisas y sin interrupciones, brindando contenido visual de máxima calidad para potenciar la presentación de cada inmueble.
              </p>
              <p>
                Con esta herramienta, cada toma aérea se convierte en una experiencia envolvente, ayudando a destacar propiedades de una manera impactante y profesional.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DroneSection;
