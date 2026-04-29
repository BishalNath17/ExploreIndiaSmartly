import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Compass, Search } from 'lucide-react';
import useScrollDirection from '../../hooks/useScrollDirection';
import navLinks from '../../data/navLinks';
import SearchBar from '../features/SearchBar';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const scrollDir = useScrollDirection();

  const close = () => setIsOpen(false);

  const [scrolled, setScrolled] = useState(false);

  const handleContactClick = (e) => {
    e.preventDefault();
    close();
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.href = '/#contact';
    }
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 section-padding py-4
        flex justify-between items-center transition-all duration-300
        ${scrolled ? 'glass shadow-lg' : 'bg-transparent'}
        ${scrollDir === 'down' && scrolled ? '-translate-y-full' : 'translate-y-0'}`}
    >
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2" onClick={close}>
        <Compass className="text-sky-400" size={28} strokeWidth={2.5} />
        <span className="text-xl sm:text-2xl font-bold tracking-tight">
          Explore India <span className="font-normal opacity-90">Smartly</span>
        </span>
      </Link>

      {/* Desktop Links */}
      <div className="hidden md:flex items-center gap-8 text-sm font-medium">
        <NavLink to="/" className={({ isActive }) => `transition-colors hover:text-sky-400 ${isActive ? 'text-sky-400' : 'text-gray-200'}`}>Home</NavLink>
        <NavLink to="/states" className={({ isActive }) => `transition-colors hover:text-sky-400 ${isActive ? 'text-sky-400' : 'text-gray-200'}`}>Explore States</NavLink>
        <NavLink to="/budget-planner" className={({ isActive }) => `transition-colors hover:text-sky-400 ${isActive ? 'text-sky-400' : 'text-gray-200'}`}>Budget Planner</NavLink>
        <NavLink to="/safety-tips" className={({ isActive }) => `transition-colors hover:text-sky-400 ${isActive ? 'text-sky-400' : 'text-gray-200'}`}>Safety</NavLink>
        <a href="#contact" onClick={handleContactClick} className="transition-colors hover:text-sky-400 text-gray-200 cursor-pointer">Contact</a>
        <NavLink to="/admin/dashboard" className="bg-india-orange/20 text-india-orange border border-india-orange/50 hover:bg-india-orange hover:text-white px-4 py-1.5 rounded-full transition-all text-xs font-bold uppercase tracking-wider ml-2">Admin Panel</NavLink>
        <button onClick={() => setIsSearchOpen(true)} className="text-gray-200 hover:text-sky-400 transition-colors ml-2 cursor-pointer">
          <Search size={18} />
        </button>
      </div>

      {/* Mobile Toggle */}
      <button
        className="md:hidden p-2"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25 }}
            className="absolute top-full left-0 w-full bg-navy-dark/95 backdrop-blur-lg
                       p-6 flex flex-col gap-5 md:hidden border-b border-white/10"
          >
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={close}
                className={({ isActive }) =>
                  `text-lg transition-colors hover:text-india-orange ${
                    isActive ? 'text-india-orange' : ''
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <a
              href="#contact"
              onClick={handleContactClick}
              className="text-lg transition-colors hover:text-india-orange"
            >
              Contact
            </a>
            <button
              onClick={() => { close(); setIsSearchOpen(true); }}
              className="text-lg text-left transition-colors hover:text-india-orange flex items-center gap-2"
            >
              Search <Search size={18} />
            </button>
            <Link
              to="/admin/dashboard"
              onClick={close}
              className="text-lg text-india-orange transition-colors hover:text-white flex items-center gap-2"
            >
              Admin Panel
            </Link>
            <Link
              to="/travel-planner"
              onClick={close}
              className="btn-primary text-center mt-2"
            >
              Plan a Trip
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Overlay Modal */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-navy-dark/95 backdrop-blur-xl flex flex-col items-center pt-24 sm:pt-32 px-4"
          >
            <button
              onClick={() => setIsSearchOpen(false)}
              className="absolute top-6 right-6 sm:top-8 sm:right-8 p-3 text-gray-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 rounded-full cursor-pointer"
            >
              <X size={24} />
            </button>
            <div className="w-full max-w-2xl px-2" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-center mb-8 text-white">Where to next?</h2>
              <SearchBar onClose={() => setIsSearchOpen(false)} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
