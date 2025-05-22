
import React from 'react';
import { motion } from 'framer-motion';

const DroneSection = () => {
  return (
    <div className="w-full bg-zinc-900 py-24">
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
              ¿Querés ver tu propiedad desde otra perspectiva?
            </h2>
            <div className="space-y-4 text-gray-300">
              <p>
                Nuestro dron lo hace posible: calidad 4K, estabilidad aérea y un ojo experto detrás del control.
              </p>
              <p>
                En el mercado inmobiliario, la primera impresión es crucial. Por eso utilizamos tecnología de punta que captura cada detalle de tu propiedad desde ángulos únicos que realzan su arquitectura y entorno.
              </p>
              <p>
                Con nuestro equipo, cada toma aérea se convierte en una experiencia visual impactante, ayudándote a destacar tu propiedad de manera profesional y memorable.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DroneSection;
