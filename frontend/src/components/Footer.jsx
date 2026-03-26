import { Link } from 'react-router-dom';
import navLinks from '../data/navLinks';

const Footer = () => {
  return (
    <footer className="bg-navy-dark border-t border-white/5">
      <div className="max-w-7xl mx-auto section-padding py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div>
            <Link to="/" className="text-2xl font-serif font-bold">
              Explore<span className="text-india-orange">India</span>
            </Link>
            <p className="text-gray-400 mt-3 text-sm leading-relaxed">
              Crafted with elegance for the modern traveler exploring the
              vibrant soul of India.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-sans font-semibold text-sm uppercase tracking-wider text-gray-300 mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-india-orange transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* More */}
          <div>
            <h4 className="font-sans font-semibold text-sm uppercase tracking-wider text-gray-300 mb-4">
              More
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/travel-planner"
                  className="text-gray-400 hover:text-india-orange transition-colors text-sm"
                >
                  Travel Planner
                </Link>
              </li>
              <li>
                <Link
                  to="/budget-planner"
                  className="text-gray-400 hover:text-india-orange transition-colors text-sm"
                >
                  Budget Planner
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} Explore India Smartly. All rights
          reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
