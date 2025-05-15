import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 border-t border-gray-700 py-4 mt-8">
      <div className="container mx-auto px-4 text-center text-gray-400">
        <p>
          Made with <span className="text-red-500">♥</span> by{' '}
          <a
            href="https://huskynarr.de"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-400 hover:text-green-300 transition-colors"
          >
            Huskynarr
          </a>
          {' '}&{' '}
          <a
            href="https://xboxdev.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-400 hover:text-green-300 transition-colors"
          >
            XboxDev
          </a>
          {' '}- Open Source on{' '}
          <a
            href="https://github.com/XboxDevCom/agencies"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-400 hover:text-green-300 transition-colors"
          >
            GitHub
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer; 