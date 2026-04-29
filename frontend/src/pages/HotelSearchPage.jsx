import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, MapPin, Star, Building2, AlertTriangle, ExternalLink } from 'lucide-react';
import { API_URL } from '../config/api';

const HotelSearchPage = () => {
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hotels, setHotels] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [resolvedCity, setResolvedCity] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [isFallbackMode, setIsFallbackMode] = useState(false);

  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const cityParam = queryParams.get('city');
    
    // Only auto-search once on mount if a city param is present
    if (cityParam && !hasSearched && !loading) {
      setCity(cityParam);
      performSearch(cityParam);
    }
  }, [location.search]);

  const performSearch = async (searchCity, page = 1) => {
    if (!searchCity.trim()) {
      setError('Please enter a city name to search.');
      return;
    }

    if (page === 1) {
      setLoading(true);
      setHotels([]);
      setCurrentPage(1);
    } else {
      setLoadingMore(true);
    }
    
    setError('');
    setHasSearched(true);

    try {
      const response = await fetch(`${API_URL}/hotels/search?city=${encodeURIComponent(searchCity.trim())}&page_number=${page}`);
      const data = await response.json();

      if (!response.ok || !data.success) {
        if (page === 1) setError(data.message || 'Something went wrong while searching for hotels.');
        setHasMore(false);
      } else {
        if (page === 1) {
          setHotels(data.data || []);
        } else {
          setHotels(prev => {
            const newHotels = data.data || [];
            const existingIds = new Set(prev.map(h => h.id));
            const distinctNew = newHotels.filter(h => !existingIds.has(h.id));
            return [...prev, ...distinctNew];
          });
        }
        setResolvedCity(data.city); // The canonical city name from the API
        setCurrentPage(page);
        setHasMore(data.hasMore);
        setIsFallbackMode(!!(data.isFallback || data.quotaExceeded));
      }
    } catch (err) {
      console.error('Hotel search error:', err);
      if (page === 1) setError('Failed to connect to the server. Please try again later.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    performSearch(city, 1);
  };

  const handleLoadMore = () => {
    if (!loading && !loadingMore && hasMore) {
      performSearch(resolvedCity || city, currentPage + 1);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="text-center mb-12">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold mb-4"
        >
          Find the Best <span className="text-india-orange">Hotels</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-gray-400 text-lg max-w-2xl mx-auto"
        >
          Search for top-rated hotels across any Indian destination.
        </motion.p>
      </div>

      {/* Search Bar */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="max-w-3xl mx-auto mb-16"
      >
        <form onSubmit={handleSearch} className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-12 pr-32 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-india-orange focus:bg-white/10 transition-all text-lg shadow-xl"
            placeholder="E.g., Delhi, Goa, Mumbai..."
            value={city}
            onChange={(e) => {
              setCity(e.target.value);
              if (error) setError('');
            }}
          />
          <button
            type="submit"
            disabled={loading}
            className="absolute inset-y-2 right-2 flex items-center justify-center px-6 bg-india-orange hover:bg-orange-600 text-white font-bold rounded-xl transition-colors disabled:opacity-70"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Searching...
              </span>
            ) : (
              'Search'
            )}
          </button>
        </form>
      </motion.div>

      {/* Results Section */}
      {error && (
        <div className="max-w-2xl mx-auto bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3 mb-10 text-red-400">
          <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {hasSearched && !loading && !error && (
        <div className="mb-8">
          {isFallbackMode && (
            <div className="mb-4 bg-india-orange/10 border border-india-orange/30 rounded-xl p-3 sm:p-4 flex items-start sm:items-center justify-center text-left sm:text-center shadow-lg">
              <p className="text-india-orange text-xs sm:text-sm font-medium flex items-center gap-2">
                <AlertTriangle size={16} className="shrink-0" />
                Live hotel provider is temporarily unavailable. Showing sample stays for UI preview.
              </p>
            </div>
          )}
          <h2 className="text-xl font-medium text-gray-300">
            {hotels.length > 0 ? (
              <>Found <span className="text-white font-bold">{isFallbackMode ? 'sample' : hotels.length}</span> hotels in <span className="text-india-orange font-bold">{resolvedCity}</span></>
            ) : (
              <>No hotels found for <span className="text-white font-bold">{city}</span>.</>
            )}
          </h2>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse bg-white/5 rounded-2xl overflow-hidden aspect-[3/4] border border-white/5">
               <div className="w-full h-full bg-white/5" />
            </div>
          ))}
        </div>
      ) : (
        // Results map below
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
          {hotels.map((hotel) => (
            <div key={hotel.id} className="group flex flex-col bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-india-orange/30 transition-colors">
              {/* Hotel Image Wrapper */}
              <div className="relative aspect-[4/3] overflow-hidden bg-gray-900">
                {hotel.image ? (
                  <img 
                    src={hotel.image} 
                    alt={hotel.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '/images/fallback.jpg';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-600">
                    <Building2 size={32} className="mb-2 opacity-50" />
                    <span className="text-xs">No image provided</span>
                  </div>
                )}
                
                {/* Rating Badge Overlay */}
                {hotel.rating && (
                  <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 shadow-lg border border-white/10">
                    <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
                    <span className="text-white text-xs font-bold">{hotel.rating}</span>
                  </div>
                )}
              </div>

              {/* Hotel Content */}
              <div className="p-4 flex flex-col flex-1">
                <h3 className="text-lg font-bold text-white mb-1 line-clamp-2" title={hotel.name}>
                  {hotel.name}
                </h3>
                
                {hotel.location && (
                  <p className="text-gray-400 text-xs flex items-center gap-1 mb-3 truncate">
                    <MapPin className="h-3 w-3 shrink-0" />
                    {hotel.location}
                  </p>
                )}

                {/* Stars/Review string */}
                <div className="flex items-center gap-2 mb-3 mt-auto">
                   {hotel.stars > 0 && (
                     <div className="flex gap-0.5">
                       {[...Array(Math.floor(hotel.stars))].map((_, i) => (
                         <Star key={i} className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                       ))}
                     </div>
                   )}
                   {hotel.reviewWord && (
                     <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded">
                       {hotel.reviewWord}
                     </span>
                   )}
                </div>

                <div className="flex items-end justify-between mt-2 pt-3 border-t border-white/10">
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Price / night</p>
                    <p className="text-xl font-bold text-india-orange">
                      {hotel.price || 'Check Rates'}
                    </p>
                  </div>
                  
                  {hotel.url && (
                    <a 
                      href={hotel.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-2 bg-white/5 hover:bg-india-orange hover:text-white rounded-lg transition-colors text-gray-300 group/btn"
                      title="View on Booking.com"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Load More Section */}
      {hasSearched && !loading && !error && hasMore && (
        <div className="flex justify-center mt-8 mb-4">
          <button
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="px-8 py-3.5 bg-india-orange hover:bg-orange-600 text-white font-bold rounded-xl transition-colors shadow-lg shadow-india-orange/20 disabled:opacity-70 flex items-center justify-center min-w-[200px]"
          >
            {loadingMore ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Loading more...
              </span>
            ) : (
              'Load More Hotels'
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default HotelSearchPage;
