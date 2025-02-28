
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const NavHeader = () => {
  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center"
    >
      <div className="flex items-center flex-1">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center">
            <span className="text-xl font-bold text-white">VS Dron Shot</span>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              <Link
                to="/"
                className="px-3 py-2 text-sm font-medium text-white hover:text-sky-400 transition-colors duration-200"
              >
                Inicio
              </Link>
              <Link
                to="/servicios"
                className="px-3 py-2 text-sm font-medium text-white hover:text-sky-400 transition-colors duration-200"
              >
                Servicios
              </Link>
              <Link
                to="/about"
                className="px-3 py-2 text-sm font-medium text-white hover:text-sky-400 transition-colors duration-200"
              >
                Nosotros
              </Link>
              <Link
                to="/contacto"
                className="px-3 py-2 text-sm font-medium text-white hover:text-sky-400 transition-colors duration-200"
              >
                Contacto
              </Link>
              <Link
                to="/admin"
                className="px-3 py-2 text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 rounded-md transition-colors duration-200"
              >
                Admin
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="md:hidden flex items-center">
        <button className="text-white hover:text-sky-400 focus:outline-none">
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
    </motion.nav>
  );
};

export default NavHeader;
