import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Mail, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import { navigationItems } from '../config/navigation';
import logo from '../assets/logo.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  // Transparent overlay only makes sense on the home page (dark hero behind it).
  // On every other page the top of the content is light, so keep the bar solid.
  const solid = isScrolled || location.pathname !== '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`shadow-lg sticky top-0 z-[1100] transition-all duration-300 ${
        solid ? 'bg-white' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src={logo} 
              alt="Xayara Indonesia" 
              className="h-12 w-auto object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`font-medium transition-colors ${
                  solid 
                    ? 'text-gray-700 hover:text-primary-600' 
                    : 'text-white hover:text-blue-200'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Contact Info */}
          <div className="hidden md:flex items-center space-x-4">
            <a
              href="tel:+6285810200501"
              className={`flex items-center transition-colors ${
                solid
                  ? 'text-gray-600 hover:text-primary-600'
                  : 'text-white hover:text-blue-200'
              }`}
            >
              <Phone className="w-4 h-4 mr-1" />
              <span className="text-sm">0858-1020-0501</span>
            </a>

            <Link
              to="/login"
              title="Login Admin"
              aria-label="Login Admin"
              className={`group relative flex items-center transition-colors ${
                solid
                  ? 'text-gray-600 hover:text-primary-600'
                  : 'text-white hover:text-blue-200'
              }`}
            >
              <User className="w-5 h-5" />
              <span className="pointer-events-none absolute right-0 top-full mt-2 whitespace-nowrap rounded-md bg-gray-900 px-2 py-1 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100">
                Login Admin
              </span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors ${
              solid 
                ? 'hover:bg-gray-100 text-gray-700' 
                : 'hover:bg-white/10 text-white'
            }`}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className={`md:hidden border-t transition-colors ${
          solid 
            ? 'bg-white border-gray-200' 
            : 'bg-[#0c1f41] border-white/10'
        }`}>
          <div className="px-4 py-4 space-y-3">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block font-medium py-2 ${
                  solid 
                    ? 'text-gray-700 hover:text-primary-600' 
                    : 'text-white hover:text-blue-200'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <a
              href="tel:+6285810200501"
              className={`flex items-center py-2 ${
                solid
                  ? 'text-gray-600 hover:text-primary-600'
                  : 'text-white hover:text-blue-200'
              }`}
            >
              <Phone className="w-4 h-4 mr-2" />
              <span>0858-1020-0501</span>
            </a>
            <Link
              to="/login"
              onClick={() => setIsOpen(false)}
              className={`flex items-center py-2 font-medium ${
                solid
                  ? 'text-gray-700 hover:text-primary-600'
                  : 'text-white hover:text-blue-200'
              }`}
            >
              <User className="w-4 h-4 mr-2" />
              <span>Login Admin</span>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
