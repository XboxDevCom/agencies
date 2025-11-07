import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const linkClasses = (path: string) => {
    const base = "px-4 py-2 rounded-lg font-medium transition-colors duration-200";
    return isActive(path)
      ? `${base} bg-green-600 text-white`
      : `${base} text-gray-300 hover:bg-gray-700 hover:text-white`;
  };
  
  return (
    <nav className="bg-gray-800 border-b border-gray-700 mb-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2 sm:space-x-4 overflow-x-auto">
            <Link
              to="/"
              className={linkClasses('/')}
              aria-current={isActive('/') ? 'page' : undefined}
            >
              <span className="hidden sm:inline">🏢 </span>Agenturen
            </Link>
            <Link
              to="/investor-tips"
              className={linkClasses('/investor-tips')}
              aria-current={isActive('/investor-tips') ? 'page' : undefined}
            >
              <span className="hidden sm:inline">📊 </span>Investoren-Tipps
            </Link>
            <Link
              to="/dividend-calculator"
              className={linkClasses('/dividend-calculator')}
              aria-current={isActive('/dividend-calculator') ? 'page' : undefined}
            >
              <span className="hidden sm:inline">💰 </span>Rendite-Rechner
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
