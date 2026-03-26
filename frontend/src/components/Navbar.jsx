import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Compass, Search } from 'lucide-react';
import useScrollDirection from '../hooks/useScrollDirection';
import navLinks from '../data/navLinks';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const scrollDir = useScrollDirection();

  const close = () => setIsOpen(false);

  const [scrolled, setScrolled] = useState(false);

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
        <NavLink to="/hidden-gems" className={({ isActive }) => `transition-colors hover:text-sky-400 ${isActive ? 'text-sky-400' : 'text-gray-200'}`}>Hidden Gems</NavLink>
        <NavLink to="/budget-planner" className={({ isActive }) => `transition-colors hover:text-sky-400 ${isActive ? 'text-sky-400' : 'text-gray-200'}`}>Budget Planner</NavLink>
        <NavLink to="/safety-tips" className={({ isActive }) => `transition-colors hover:text-sky-400 ${isActive ? 'text-sky-400' : 'text-gray-200'}`}>Safety</NavLink>
        <Link to="#" className="transition-colors hover:text-sky-400 text-gray-200">Contact</Link>
        <button className="text-gray-200 hover:text-sky-400 transition-colors ml-2">
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
            <Link
              to="/travel-planner"
              onClick={close}
              className="btn-primary text-center"
            >
              Plan a Trip
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
