import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto py-12 px-6 sm:px-8 lg:px-12">
        
       
        <div className="flex flex-col md:flex-row items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white mb-4 md:mb-0">
            Image<span className="text-indigo-500">Tools</span>
          </h1>

          
          <div className="flex space-x-4">
            <a href="#" className="hover:text-indigo-500 transition-colors">
              <FaFacebookF />
            </a>
            <a href="#" className="hover:text-indigo-500 transition-colors">
              <FaTwitter />
            </a>
            <a href="#" className="hover:text-indigo-500 transition-colors">
              <FaInstagram />
            </a>
            <a href="#" className="hover:text-indigo-500 transition-colors">
              <FaLinkedinIn />
            </a>
          </div>
        </div>

      
        <div className="border-t border-gray-700 my-6"></div>

      
        <div className="text-center text-sm text-gray-400">
          &copy; 2026 ImageTools. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
