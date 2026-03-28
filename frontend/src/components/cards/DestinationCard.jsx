import { Link } from 'react-router-dom';
import { Star, ArrowRight } from 'lucide-react';

const FALLBACK_IMAGE = '/images/fallback.jpg';

/**
 * Reusable destination card with image, overlay, rating, and hover effect.
 * @param {{ destination: object, className?: string }} props
 */
const DestinationCard = ({ destination, className = '' }) => {
  const { id, name, description, image, rating } = destination;

  const handleImgError = (e) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = FALLBACK_IMAGE;
  };

  return (
    <Link
      to={`/destination/${id}`}
      className={`group relative block overflow-hidden rounded-3xl ${className}`}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/40 to-transparent z-10 opacity-80 group-hover:opacity-100 transition-opacity" />

      {/* Image */}
      <img
        src={image || FALLBACK_IMAGE}
        alt={name}
        loading="lazy"
        onError={handleImgError}
        className="w-full h-[420px] sm:h-[480px] object-cover group-hover:scale-110 transition-transform duration-700"
      />

      {/* Content */}
      <div className="absolute bottom-0 left-0 w-full p-6 sm:p-8 z-20 group-hover:-translate-y-1 transition-transform">
        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <Star size={14} className="text-india-orange fill-india-orange" />
          <span className="text-sm font-bold">{rating}</span>
        </div>

        <h3 className="text-xl sm:text-2xl font-bold mb-1">{name}</h3>

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
