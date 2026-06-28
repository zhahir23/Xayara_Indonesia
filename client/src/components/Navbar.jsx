import { Link } from 'react-router-dom';
import { Menu, X, Phone, Mail } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">X</span>
            </div>
            <span className="text-xl font-bold text-gray-800">Xayara Indonesia</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
              Beranda
            </Link>
            <Link to="/reservation" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
              Reservasi
            </Link>
            <Link to="/admin" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
              Admin
            </Link>
          </div>

          {/* Contact Info */}
          <div className="hidden md:flex items-center space-x-4">
            <a href="tel:+6281234567890" className="flex items-center text-gray-600 hover:text-primary-600">
              <Phone className="w-4 h-4 mr-1" />
              <span className="text-sm">0812-3456-7890</span>
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-4 py-4 space-y-3">
            <Link
              to="/"
              className="block text-gray-700 hover:text-primary-600 font-medium py-2"
              onClick={() => setIsOpen(false)}
            >
              Beranda
            </Link>
            <Link
              to="/reservation"
              className="block text-gray-700 hover:text-primary-600 font-medium py-2"
              onClick={() => setIsOpen(false)}
            >
              Reservasi
            </Link>
            <Link
              to="/admin"
              className="block text-gray-700 hover:text-primary-600 font-medium py-2"
              onClick={() => setIsOpen(false)}
            >
              Admin
            </Link>
            <a
              href="tel:+6281234567890"
              className="flex items-center text-gray-600 hover:text-primary-600 py-2"
            >
              <Phone className="w-4 h-4 mr-2" />
              <span>0812-3456-7890</span>
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
