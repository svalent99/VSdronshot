
import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

const NavHeader = () => {
  const [position, setPosition] = useState({
    left: 0,
    width: 0,
    opacity: 0,
  });
  
  const [isOpen, setIsOpen] = useState(false);
  
  const toggleMenu = () => setIsOpen(!isOpen);

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
          
          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <ul
              className="relative flex w-fit rounded-full border border-sky-600 bg-black/40 backdrop-blur-sm p-1"
              onMouseLeave={() => setPosition((pv) => ({ ...pv, opacity: 0 }))}
            >
              <Tab setPosition={setPosition} to="/">
                Inicio
              </Tab>
              <Tab setPosition={setPosition} to="/servicios">
                Servicios
              </Tab>
              <Tab setPosition={setPosition} to="/about">
                Nosotros
              </Tab>
              <Tab setPosition={setPosition} to="/contacto">
                Contacto
              </Tab>
              <Tab setPosition={setPosition} to="/admin" isAdmin={true}>
                Admin
              </Tab>
              
              <Cursor position={position} />
            </ul>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu Button */}
      <div className="md:hidden flex items-center">
        <button 
          className="text-white hover:text-sky-400 focus:outline-none"
          onClick={toggleMenu}
        >
          {isOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>
      
      {/* Mobile Navigation */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="absolute top-16 left-0 right-0 bg-black bg-opacity-90 backdrop-blur-sm z-50 p-4 rounded-b-lg shadow-lg md:hidden"
        >
          <ul className="flex flex-col space-y-4">
            <MobileTab to="/" onClick={() => setIsOpen(false)}>Inicio</MobileTab>
            <MobileTab to="/servicios" onClick={() => setIsOpen(false)}>Servicios</MobileTab>
            <MobileTab to="/about" onClick={() => setIsOpen(false)}>Nosotros</MobileTab>
            <MobileTab to="/contacto" onClick={() => setIsOpen(false)}>Contacto</MobileTab>
            <MobileTab to="/admin" onClick={() => setIsOpen(false)} isAdmin={true}>Admin</MobileTab>
          </ul>
        </motion.div>
      )}
    </motion.nav>
  );
};

const Tab = ({
  children,
  setPosition,
  to,
  isAdmin = false,
}: {
  children: React.ReactNode;
  setPosition: React.Dispatch<React.SetStateAction<{
    left: number;
    width: number;
    opacity: number;
  }>>;
  to: string;
  isAdmin?: boolean;
}) => {
  const ref = useRef<HTMLLIElement>(null);
  return (
    <li
      ref={ref}
      onMouseEnter={() => {
        if (!ref.current) return;

        const { width } = ref.current.getBoundingClientRect();
        setPosition({
          width,
          opacity: 1,
          left: ref.current.offsetLeft,
        });
      }}
      className="relative z-10 block cursor-pointer"
    >
      <Link
        to={to}
        className={`block px-3 py-1.5 text-sm font-medium text-white mix-blend-difference transition-colors duration-200 ${
          isAdmin ? "bg-transparent" : ""
        }`}
      >
        {children}
      </Link>
    </li>
  );
};

const MobileTab = ({
  children,
  to,
  onClick,
  isAdmin = false,
}: {
  children: React.ReactNode;
  to: string;
  onClick: () => void;
  isAdmin?: boolean;
}) => {
  return (
    <li className="block">
      <Link
        to={to}
        onClick={onClick}
        className={`block px-4 py-2 text-base font-medium text-white hover:text-sky-400 transition-colors duration-200 ${
          isAdmin ? "bg-sky-600 hover:bg-sky-700 rounded-md" : ""
        }`}
      >
        {children}
      </Link>
    </li>
  );
};

const Cursor = ({ position }: { position: { left: number; width: number; opacity: number } }) => {
  return (
    <motion.li
      animate={position}
      className="absolute z-0 h-8 rounded-full bg-sky-600"
    />
  );
};

export default NavHeader;
