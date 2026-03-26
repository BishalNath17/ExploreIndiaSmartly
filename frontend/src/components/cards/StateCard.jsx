import { Link } from 'react-router-dom';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=600';

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
        to={`/state/${state.slug}`}
        className="group relative block rounded-2xl overflow-hidden aspect-[3/4]"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/30 to-transparent z-10 group-hover:from-navy/90 transition-all duration-300" />
        <img
          src={state.image || FALLBACK_IMAGE}
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
      to={`/state/${state.slug}`}
      className="block glass rounded-2xl p-6 hover:bg-white/15 transition-colors group"
    >
      <h3 className="text-xl font-bold group-hover:text-india-orange transition-colors">
        {state.name}
      </h3>
      <p className="text-gray-400 text-sm mt-1">{state.tagline}</p>
    </Link>
  );
};

export default StateCard;

