import { Link } from 'react-router-dom';
import { Star, ArrowRight } from 'lucide-react';
import { resolveImageUrl } from '../../config/api';

const FALLBACK_IMAGE = 'data:image/svg+xml,' + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#1B2A4E"/><stop offset="100%" stop-color="#0A192F"/></linearGradient></defs><rect fill="url(#g)" width="400" height="400"/><text x="200" y="200" text-anchor="middle" fill="#F97316" font-family="sans-serif" font-size="20" opacity="0.6">Image Coming Soon</text><path fill="none" stroke="#F97316" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity="0.3" d="M170 230l20-20 40 40 40-40 30 30M170 230v40h100v-40" /></svg>'
);

/**
 * Reusable destination card with image, overlay, rating, and hover effect.
 * @param {{ destination: object, className?: string }} props
 */
const DestinationCard = ({ destination, className = '' }) => {
  const { id, name, description, image, rating } = destination;

  const displayImage = resolveImageUrl(image) || FALLBACK_IMAGE;

  const handleImgError = (e) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = FALLBACK_IMAGE;
  };

  return (
    <Link
      to={`/destination/${id}`}
      className={`group relative block overflow-hidden rounded-2xl aspect-[3/4] ${className}`}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/40 to-transparent z-10 opacity-80 group-hover:opacity-100 transition-opacity" />

      {/* Image */}
      <img
        src={displayImage}
        alt={name}
        loading="lazy"
        onError={handleImgError}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
      />

      {/* Content */}
      <div className="absolute bottom-0 left-0 w-full p-4 sm:p-5 z-20 group-hover:-translate-y-1 transition-transform">
        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <Star size={14} className="text-india-orange fill-india-orange" />
          <span className="text-sm font-bold">{rating}</span>
        </div>

        <h3 className="text-lg sm:text-xl font-bold mb-1">{name}</h3>

        <p className="text-gray-300 text-sm line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {description}
        </p>

        <span className="mt-3 inline-flex items-center gap-1 text-india-orange text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
          Explore More <ArrowRight size={14} />
        </span>
      </div>
    </Link>
  );
};

export default DestinationCard;
