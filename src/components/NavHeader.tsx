
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

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
    if (isOpen) setIsOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center"
    >
      {/* Centered Navigation */}
      <div className="flex-1 flex justify-center">
        {/* Desktop Navigation */}
        <div className="hidden md:block">
          <ul
            className="relative flex w-fit rounded-full border border-sky-600 bg-black/40 backdrop-blur-sm p-1"
            onMouseLeave={() => setPosition((pv) => ({ ...pv, opacity: 0 }))}
          >
            <Tab setPosition={setPosition} onClick={() => scrollToSection('services-section')}>
              Servicios
            </Tab>
            <Tab setPosition={setPosition} onClick={() => scrollToSection('drone-section')}>
              Nosotros
            </Tab>
            <Tab setPosition={setPosition} onClick={() => scrollToSection('footer-section')}>
              Contacto
            </Tab>
            
            <Cursor position={position} />
          </ul>
        </div>
      </div>
      
      {/* Logo - Small/Mobile only */}
      <div className="md:hidden absolute left-0">
        <span className="text-xl font-bold text-white">VS Dron Shot</span>
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
            <MobileTab onClick={() => scrollToSection('services-section')}>Servicios</MobileTab>
            <MobileTab onClick={() => scrollToSection('drone-section')}>Nosotros</MobileTab>
            <MobileTab onClick={() => scrollToSection('footer-section')}>Contacto</MobileTab>
          </ul>
        </motion.div>
      )}
    </motion.nav>
  );
};

const Tab = ({
  children,
  setPosition,
  onClick,
  to,
  isAdmin = false,
}: {
  children: React.ReactNode;
  setPosition: React.Dispatch<React.SetStateAction<{
    left: number;
    width: number;
    opacity: number;
  }>>;
  onClick?: () => void;
  to?: string;
  isAdmin?: boolean;
}) => {
  const ref = useRef<HTMLLIElement>(null);
  
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };
  
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
      onClick={handleClick}
    >
      {to ? (
        <Link
          to={to}
          className={`block px-3 py-1.5 text-sm font-medium text-white mix-blend-difference transition-colors duration-200 ${
            isAdmin ? "bg-transparent" : ""
          }`}
        >
          {children}
        </Link>
      ) : (
        <span className="block px-3 py-1.5 text-sm font-medium text-white mix-blend-difference transition-colors duration-200">
          {children}
        </span>
      )}
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
  to?: string;
  onClick?: () => void;
  isAdmin?: boolean;
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };
  
  if (to) {
    return (
      <li className="block">
        <Link
          to={to}
          className={`block px-4 py-2 text-base font-medium text-white hover:text-sky-400 transition-colors duration-200 ${
            isAdmin ? "bg-sky-600 hover:bg-sky-700 rounded-md" : ""
          }`}
        >
          {children}
        </Link>
      </li>
    );
  }
  
  return (
    <li className="block" onClick={handleClick}>
      <span className="block px-4 py-2 text-base font-medium text-white hover:text-sky-400 transition-colors duration-200 cursor-pointer">
        {children}
      </span>
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
