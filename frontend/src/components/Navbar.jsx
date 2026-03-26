import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import useScrollDirection from '../hooks/useScrollDirection';
import navLinks from '../data/navLinks';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const scrollDir = useScrollDirection();

  const close = () => setIsOpen(false);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 glass section-padding py-4
        flex justify-between items-center transition-transform duration-300
        ${scrollDir === 'down' ? '-translate-y-full' : 'translate-y-0'}`}
    >
      {/* Logo */}
      <Link to="/" className="text-2xl font-serif font-bold" onClick={close}>
        Explore<span className="text-india-orange">India</span>
      </Link>

      {/* Desktop Links */}
      <div className="hidden md:flex items-center gap-8">
        {navLinks.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `transition-colors hover:text-india-orange ${
                isActive ? 'text-india-orange' : ''
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
        <Link to="/travel-planner" className="btn-primary text-sm">
          Plan a Trip
        </Link>
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
