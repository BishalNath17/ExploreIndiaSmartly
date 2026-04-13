import { Link } from 'react-router-dom';
import { getImageUrl } from '../../config/api';

const FALLBACK_IMAGE = '/images/fallback.jpg';

/**
 * Reusable state preview card.
 *
 * @param {object}  state   — State data object (slug, name, tagline, image)
 * @param {'compact'|'image'} variant
 *   - compact: glass text card (AllStatesPage)
 *   - image:   aspect-ratio image card with overlay (HomePage)
 */
const StateCard = ({ state, variant = 'compact' }) => {
  const handleImgError = (e) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = FALLBACK_IMAGE;
  };

  if (variant === 'image') {
    return (
      <Link
        to={`/state/${state.slug || state.id || state._id}`}
        className="group relative block rounded-2xl overflow-hidden aspect-[3/4]"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/30 to-transparent z-10 group-hover:from-navy/90 transition-all duration-300" />
        <img
          src={state.image ? getImageUrl(state.image) : FALLBACK_IMAGE}
          alt={state.name}
          loading="lazy"
          onError={handleImgError}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute bottom-0 left-0 w-full p-4 z-20">
          <h3 className="text-sm sm:text-base font-bold group-hover:text-india-orange transition-colors">
            {state.name}
          </h3>
          <p className="text-[11px] text-gray-400 mt-0.5 hidden sm:block">
            {state.tagline}
          </p>
        </div>
      </Link>
    );
  }

  // compact (default)
  return (
    <Link
      to={`/state/${state.slug || state.id || state._id}`}
      className="group relative block rounded-2xl overflow-hidden h-40 sm:h-48"
    >
      {/* Background Image & Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={state.image ? getImageUrl(state.image) : FALLBACK_IMAGE}
          alt={state.name}
          loading="lazy"
          onError={handleImgError}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full p-5 sm:p-6 flex flex-col justify-end">
        <h3 className="text-xl font-bold text-white group-hover:text-india-orange transition-colors">
          {state.name}
        </h3>
        <p className="text-gray-300 text-sm mt-1 drop-shadow-md">{state.tagline}</p>
      </div>
    </Link>
  );
};

export default StateCard;

