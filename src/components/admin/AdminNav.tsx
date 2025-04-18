
import React from 'react';

interface AdminNavProps {
  activeTab: string;
  reviewsCount: number;
  onTabChange: (tab: string) => void;
}

const AdminNav: React.FC<AdminNavProps> = ({ activeTab, reviewsCount, onTabChange }) => {
  return (
    <div className="border-b border-zinc-700 mb-8">
      <nav className="flex space-x-8">
        <button
          onClick={() => onTabChange('reviews')}
          className={`py-4 px-1 font-medium text-sm border-b-2 ${
            activeTab === 'reviews' 
              ? 'border-sky-500 text-sky-500' 
              : 'border-transparent text-gray-400 hover:text-gray-200'
          }`}
        >
          Reseñas Pendientes ({reviewsCount})
        </button>
        <button
          onClick={() => onTabChange('approved')}
          className={`py-4 px-1 font-medium text-sm border-b-2 ${
            activeTab === 'approved' 
              ? 'border-sky-500 text-sky-500' 
              : 'border-transparent text-gray-400 hover:text-gray-200'
          }`}
        >
          Reseñas Aprobadas
        </button>
        <button
          onClick={() => onTabChange('gallery')}
          className={`py-4 px-1 font-medium text-sm border-b-2 ${
            activeTab === 'gallery' 
              ? 'border-sky-500 text-sky-500' 
              : 'border-transparent text-gray-400 hover:text-gray-200'
          }`}
        >
          Gestionar Galería
        </button>
      </nav>
    </div>
  );
};

export default AdminNav;
