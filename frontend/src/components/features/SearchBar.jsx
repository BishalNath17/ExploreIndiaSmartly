import { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Loader2 } from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { statesData as states } from '../../data/statesData';
import { hiddenGemsData as hiddenGems } from '../../data/hiddenGemsData';
import { API_URL } from '../../config/api';

/* ═══════════════════════════════════════════════════════
   CUSTOM HOOK: DEBOUNCE
   ═══════════════════════════════════════════════════════ */
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/* ═══════════════════════════════════════════════════════
   PRE-PROCESS SEARCH ITEMS (Memoized via constants)
   ═══════════════════════════════════════════════════════ */
const STATE_ITEMS = states.map((s) => ({
  id: `state-${s.id}`,
  type: 'state',
  label: s.name,
  sub: s.tagline,
  path: `/state/${s.id}`,
  badgeColor: 'text-blue-400 bg-blue-400/10',
}));

const GEM_ITEMS = hiddenGems.map((g) => ({
  id: `gem-${g.id}`,
  type: 'hidden gem',
  label: g.name,
  sub: g.description,
  path: `/destination/${g.id}`,
  badgeColor: 'text-pink-400 bg-pink-400/10',
}));

const STATIC_SEARCH_ITEMS = [...STATE_ITEMS, ...GEM_ITEMS];

/* ═══════════════════════════════════════════════════════
   SEARCH BAR COMPONENT
   ═══════════════════════════════════════════════════════ */
const SearchBar = ({ onClose, onSearchActive }) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [results, setResults] = useState([]);

  const wrapperRef = useRef(null);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const navigate = useNavigate();

  const debouncedQuery = useDebounce(query, 300);

  // Dynamically fetch and store real destinations natively inside the component
  const [dynamicSearchItems, setDynamicSearchItems] = useState(STATIC_SEARCH_ITEMS);

  useEffect(() => {
    fetch(`${API_URL}/destinations`)
      .then(r => r.json())
      .then(res => {
         if (res.success && res.data) {
           const destItems = res.data.map((d) => ({
             id: `dest-${d.id}`,
             type: 'destination',
             label: d.name,
             sub: d.description || '',
             path: `/destination/${d.id}`,
             badgeColor: 'text-emerald-400 bg-emerald-400/10',
           }));
           setDynamicSearchItems([...STATIC_SEARCH_ITEMS, ...destItems]);
         }
      })
      .catch(err => console.error('SearchBar fetched destinations err:', err));
  }, []);

  // Close on outside click functionality
  useEffect(() => {
    const handleClick = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Filter logic triggering after debounce
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    const lowerQuery = debouncedQuery.toLowerCase();
    
    // Simulate slight API-like network delay for smoother perception
    // and demonstrate loading spinner state correctly.
    const timer = setTimeout(() => {
      const filtered = dynamicSearchItems.filter(
        (item) =>
          item.label.toLowerCase().includes(lowerQuery) ||
          item.sub.toLowerCase().includes(lowerQuery)
      );

      // Remove exact duplicates by label if name clusters heavily (optional polish)
      const uniqueLabels = new Set();
      const cleanResults = [];
      for (const item of filtered) {
        if (!uniqueLabels.has(item.label.toLowerCase())) {
          uniqueLabels.add(item.label.toLowerCase());
          cleanResults.push(item);
        }
      }

      setResults(cleanResults.slice(0, 8)); // Limit to 8
      setIsLoading(false);
      setActiveIndex(-1); // Reset highlight when results change
    }, 150);

    return () => clearTimeout(timer);
  }, [debouncedQuery]);

  // Sync manual typing with loading overlay
  useEffect(() => {
    const hasQuery = query.trim() !== '';
    if (onSearchActive) onSearchActive(isFocused || hasQuery);

    if (query !== debouncedQuery && hasQuery) {
      setIsLoading(true);
    } else if (!hasQuery) {
      setIsLoading(false);
      setResults([]);
    }
  }, [query, debouncedQuery, isFocused, onSearchActive]);

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (!showDropdown || results.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault(); // Stop scrolling
      setActiveIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < results.length) {
        handleSelect(results[activeIndex].path);
      } else if (results.length > 0) {
        // Fallback to top result natively if they blast Enter
        handleSelect(results[0].path);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsFocused(false);
      inputRef.current?.blur();
    }
  };

  // Keep highlighted item constantly visible inside scrolling dropdown
  useEffect(() => {
    if (activeIndex >= 0 && listRef.current) {
      const parent = listRef.current;
      const child = parent.children[activeIndex];
      if (child) {
        child.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [activeIndex]);

  const handleSelect = (path) => {
    setQuery('');
    setIsFocused(false);
    setActiveIndex(-1);
    navigate(path);
    if (onClose) onClose();
  };

  const showDropdown = isFocused && query.trim().length > 0;

  return (
    <div ref={wrapperRef} className="relative w-full max-w-xl mx-auto">
      {/* Search Input Box */}
      <div className="relative group z-40">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-india-orange transition-colors">
          {isLoading ? (
            <Loader2 size={18} className="animate-spin text-india-orange" />
          ) : (
            <Search size={18} />
          )}
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search states, destinations, or hidden gems…"
          id="homepage-search"
          role="combobox"
          aria-expanded={showDropdown}
          aria-controls="search-dropdown"
          aria-activedescendant={activeIndex >= 0 ? `result-${activeIndex}` : undefined}
          autoComplete="off"
          className="w-full pl-11 pr-10 py-3.5 rounded-2xl bg-white/5 border border-white/10
                     text-sm text-white placeholder:text-gray-500
                     focus:outline-none focus:border-india-orange/60 focus:bg-white/10
                     focus:ring-4 focus:ring-india-orange/10
                     transition-all duration-200"
        />

        <AnimatePresence>
          {query.length > 0 && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full 
                         bg-white/5 hover:bg-white/15 flex items-center justify-center 
                         text-gray-400 hover:text-white transition-all pointer"
              aria-label="Clear search"
            >
              <X size={14} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Suggestion Dropdown */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -4, scaleY: 0.98 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -4, scaleY: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute top-[calc(100%+8px)] w-full origin-top bg-[#0a1122]/95 
                       backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-50"
          >
            {results.length > 0 ? (
              <ul 
                ref={listRef}
                id="search-dropdown" 
                role="listbox" 
                className="max-h-[300px] overflow-y-auto divide-y divide-white/5 custom-scrollbar"
              >
                {results.map((item, index) => {
                  const isActive = index === activeIndex;
                  return (
                    <li 
                      key={item.id} 
                      id={`result-${index}`} 
                      role="option" 
                      aria-selected={isActive}
                    >
                      <button
                        onMouseEnter={() => setActiveIndex(index)}
                        onClick={() => handleSelect(item.path)}
                        className={`w-full text-left px-4 py-3 sm:px-5 sm:py-3.5 transition-colors flex items-center gap-3.5
                          ${isActive ? 'bg-white/10' : 'hover:bg-white/5'}`}
                      >
                        <span className={`shrink-0 text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${item.badgeColor}`}>
                          {item.type}
                        </span>
                        <div className="min-w-0 pr-2">
                          <p className={`text-sm font-semibold truncate transition-colors ${isActive ? 'text-india-orange' : 'text-gray-200'}`}>
                            {item.label}
                          </p>
                          <p className="text-xs text-gray-500 truncate mt-0.5">
                            {item.sub}
                          </p>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            ) : (
              !isLoading && (
                <div className="px-5 py-8 text-center flex flex-col items-center">
                  <Search size={24} className="text-gray-600 mb-2" />
                  <p className="text-gray-400 text-sm font-medium">No destinations found matching &quot;{query}&quot;</p>
                  <p className="text-gray-600 text-xs mt-1">Try searching for a different state or city.</p>
                </div>
              )
            )}
            
            {/* Loading Skeleton */}
            {isLoading && results.length === 0 && (
              <div className="px-5 py-6">
                 {[1, 2, 3].map(i => (
                   <div key={i} className="flex items-center gap-3 mb-4 last:mb-0 animate-pulse">
                     <div className="w-16 h-5 bg-white/5 rounded-full" />
                     <div className="flex-1">
                       <div className="h-4 bg-white/5 rounded w-1/3 mb-2" />
                       <div className="h-3 bg-white/5 rounded w-1/2" />
                     </div>
                   </div>
                 ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
