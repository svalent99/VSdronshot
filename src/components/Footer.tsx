
import React from "react";
import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Instagram, Facebook } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-zinc-900 text-white py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">VS Dron Shot</h3>
            <p className="text-gray-400 text-sm">
              Descubre un nuevo mundo desde las alturas con nuestros servicios de filmación aérea.
            </p>
          </div>
          
          <div className="col-span-1 md:col-span-2">
            <div className="bg-zinc-800 rounded-lg p-6 shadow-lg border-l-4 border-sky-600">
              <h3 className="text-xl font-bold mb-4 text-sky-400 flex items-center">
                <span className="bg-sky-600 p-1.5 rounded-full inline-flex mr-2">
                  <Phone className="h-5 w-5 text-white" />
                </span>
                Contacto
              </h3>
              
              <ul className="space-y-4">
                <li className="flex items-center text-gray-200 hover:text-sky-400 transition-colors">
                  <Phone className="h-5 w-5 mr-3 text-sky-400" />
                  <a href="tel:1127424407" className="text-base">1127424407</a>
                </li>
                
                <li className="flex items-center text-gray-200 hover:text-sky-400 transition-colors">
                  <Mail className="h-5 w-5 mr-3 text-sky-400" />
                  <a href="mailto:valen.sotelo.123@gmail.com" className="text-base">valen.sotelo.123@gmail.com</a>
                </li>
                
                <li className="flex items-center text-gray-200">
                  <MapPin className="h-5 w-5 mr-3 text-sky-400" />
                  <span className="text-base">Argentina</span>
                </li>
                
                <li className="flex space-x-4 mt-4">
                  <a href="#" className="bg-zinc-700 p-2 rounded-full hover:bg-sky-600 transition-colors">
                    <Instagram className="h-5 w-5" />
                  </a>
                  <a href="#" className="bg-zinc-700 p-2 rounded-full hover:bg-sky-600 transition-colors">
                    <Facebook className="h-5 w-5" />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="border-t border-zinc-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>© {new Date().getFullYear()} VS Dron Shot. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
