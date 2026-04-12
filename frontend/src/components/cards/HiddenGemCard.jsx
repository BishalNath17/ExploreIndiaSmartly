import { Link } from 'react-router-dom';
import { Gem, MapPin, ArrowRight } from 'lucide-react';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=600';

/**
 * Reusable hidden-gem card.
 *
 * @param {object}  gem          — Gem data (slug, name, location, state, description, image)
 * @param {boolean} linkToState  — If true, card links to parent state page (default: false)
 * @param {boolean} showExplore  — Show "Explore State →" hover text
 */
const HiddenGemCard = ({ gem, linkToState = false, showExplore = false }) => {
  const Wrapper = linkToState ? Link : 'div';
  const stateSlug = typeof gem.state === 'object' ? (gem.state.slug || gem.state.id || gem.state._id) : gem.state;
  const wrapperProps = linkToState ? { to: `/state/${stateSlug}` } : {};

  const handleImgError = (e) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = FALLBACK_IMAGE;
  };

  return (
    <Wrapper
      {...wrapperProps}
      className="group relative block rounded-2xl overflow-hidden aspect-[3/4]"
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/40 to-transparent z-10" />

      {/* Image */}
      <img
        src={gem.image || FALLBACK_IMAGE}
        alt={gem.name}
        loading="lazy"
        onError={handleImgError}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />

      {/* Badge */}
      <span className="absolute top-3 left-3 z-20 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-india-orange bg-navy/80 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/10">
        <Gem size={10} /> Hidden Gem
      </span>

      {/* Content */}
      <div className="absolute bottom-0 left-0 w-full p-5 sm:p-6 z-20">
        <div className="flex items-center gap-2 mb-2">
          <MapPin size={12} className="text-india-orange" />
          <span className="text-[10px] text-gray-400 uppercase tracking-wider">
            {gem.location}
          </span>
        </div>
        <h3 className="text-lg font-bold group-hover:text-india-orange transition-colors">
          {gem.name}
        </h3>
        <p className="text-gray-300 text-xs mt-1 line-clamp-2">
          {gem.description}
        </p>
        {showExplore && (
          <div className="mt-3 flex items-center gap-1 text-xs font-medium text-india-orange opacity-0 group-hover:opacity-100 transition-opacity">
            Explore State <ArrowRight size={12} />
          </div>
        )}
      </div>
    </Wrapper>
  );
};

export default HiddenGemCard;
