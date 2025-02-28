
import React from "react";
import { Link } from "react-router-dom";

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
          <div>
            <h3 className="text-lg font-semibold mb-4">Enlaces</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-sky-400 text-sm transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link to="/servicios" className="text-gray-400 hover:text-sky-400 text-sm transition-colors">
                  Servicios
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-sky-400 text-sm transition-colors">
                  Nosotros
                </Link>
              </li>
              <li>
                <Link to="/contacto" className="text-gray-400 hover:text-sky-400 text-sm transition-colors">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contacto</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Email: info@vsdronshot.com</li>
              <li>Teléfono: +34 123 456 789</li>
              <li>Dirección: Ciudad, País</li>
            </ul>
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
