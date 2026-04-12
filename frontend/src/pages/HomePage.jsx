import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  MapPin,
  Gem,
  Shield,
  Calculator,
  ChevronRight,
  Search,
  X
} from 'lucide-react';
import { fadeUp, scaleIn } from '../utils/animations';
import { statesData as states } from '../data/statesData';
import { hiddenGemsData as hiddenGems } from '../data/hiddenGemsData';
import heroImagesData from '../data/json/heroImages.json';
import safetyTips from '../data/safetyTips';
import DestinationCard from '../components/cards/DestinationCard';
import StateCard from '../components/cards/StateCard';
import HiddenGemCard from '../components/cards/HiddenGemCard';
import SectionHeader from '../components/layout/SectionHeader';
import Newsletter from '../components/features/Newsletter';
import ScrollReveal from '../components/ui/ScrollReveal';
import { API_URL } from '../config/api';

/* ═══════════════════════════════════════════════════════
   1. HERO
   ═══════════════════════════════════════════════════════ */
const getHeroImage = (id, fallback) => {
  const item = heroImagesData.find(img => img.id === id);
  return item && item.image ? item.image : fallback;
};

const Hero = () => {
  return (
    <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden">
    {/* Background image + overlay */}
    <div className="absolute inset-0 z-0">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 via-navy/60 to-navy-dark/60 z-10" />
      <img
        src={getHeroImage('main-hero', '/images/heroes/main-hero.jpg')}
        onError={(e) => { 
          if (!e.currentTarget.src.includes('/images/heroes/main-hero.jpg')) {
            e.currentTarget.src = '/images/heroes/main-hero.jpg'; 
          }
        }}
        alt="Explore India Hero"
        className="w-full h-full object-cover object-top"
      />
    </div>

    {/* Floating Polaroids (Desktop Only) */}
    <div className="hidden lg:block absolute inset-0 z-10 pointer-events-none">
      {/* Left Polaroid (Snow) */}
      <motion.div
        initial={{ opacity: 0, x: -50, rotate: -20 }}
        animate={{ opacity: 1, x: 0, rotate: -12 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="absolute left-[5%] top-[25%] p-2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 shadow-2xl"
      >
        <img
          src={getHeroImage('left-card', '/images/heroes/trek-hero.jpg')}
          onError={(e) => { 
            if (!e.currentTarget.src.includes('/images/heroes/trek-hero.jpg')) {
              e.currentTarget.src = '/images/heroes/trek-hero.jpg'; 
            }
          }}
          alt="Adventure Trek"
          className="w-64 h-48 object-cover rounded-lg"
        />
      </motion.div>

      {/* Right Polaroid (Kerala Houseboat) */}
      <motion.div
        initial={{ opacity: 0, x: 50, rotate: 20 }}
        animate={{ opacity: 1, x: 0, rotate: 12 }}
        transition={{ duration: 1, delay: 0.7 }}
        className="absolute right-[5%] bottom-[15%] p-2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 shadow-2xl"
      >
        <img
          src={getHeroImage('right-card', '/images/heroes/kerala-hero.jpg')}
          onError={(e) => { 
            if (!e.currentTarget.src.includes('/images/heroes/kerala-hero.jpg')) {
              e.currentTarget.src = '/images/heroes/kerala-hero.jpg'; 
            }
          }}
          alt="Culture and Beauty"
          className="w-64 h-48 object-cover rounded-lg"
        />
      </motion.div>
    </div>

    {/* Content */}
    <div className="relative z-20 text-center px-5 w-full max-w-4xl mt-16">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-5 py-2 mb-8"
      >
        <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-sky-400/90">
          The Ultimate Travel Guide
        </span>
      </motion.div>

      <motion.h1
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={0.15}
        className="text-5xl sm:text-6xl lg:text-[5rem] font-bold mb-6 leading-tight tracking-tight"
      >
        Explore India <span className="text-sky-400">Smartly</span>
      </motion.h1>

      <motion.p
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={0.3}
        className="text-sm sm:text-base lg:text-lg text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed"
      >
        Discover famous destinations, hidden gems, budget stays, safety tips, and
        smarter travel across every Indian state.
      </motion.p>

      {/* CTAs */}
      <motion.div
        variants={scaleIn}
        initial="hidden"
        animate="visible"
        custom={0.45}
        className="flex flex-col sm:flex-row gap-4 justify-center relative pointer-events-auto z-10"
      >
        <Link
          to="/states"
          className="bg-india-orange hover:bg-orange-600 text-white font-semibold py-3.5 px-8 rounded-full shadow-lg shadow-india-orange/30 transition-all text-sm sm:text-base"
        >
          Explore All States
        </Link>
        <Link
          to="/hidden-gems"
          className="bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md text-white font-semibold py-3.5 px-8 rounded-full transition-all text-sm sm:text-base"
        >
          Hidden Places
        </Link>
      </motion.div>
    </div>

    {/* Seamless Single-Gradient Transition */}
    <div className="absolute bottom-0 left-0 w-full h-56 sm:h-80 bg-gradient-to-t from-[#061224] to-transparent z-10 pointer-events-none" />
  </section>
  );
};

/* ═══════════════════════════════════════════════════════
   2. FEATURED STATES
   ═══════════════════════════════════════════════════════ */
const FeaturedStates = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [exactSelection, setExactSelection] = useState(null);
  const [isFocused, setIsFocused] = useState(false);
  const [highlightIdx, setHighlightIdx] = useState(-1);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  const q = searchQuery.toLowerCase().trim();
  const isSearching = q.length > 0;

  const displayStates = isSearching
    ? (exactSelection
        ? states.filter(s => s.name === exactSelection)
        : states.filter(s =>
            (s.name || '').toLowerCase().includes(q) ||
            (s.tagline || '').toLowerCase().includes(q)
          )
      )
    : states.slice(0, 10);

  const suggestions = isSearching
    ? states
        .filter(s => (s.name || '').toLowerCase().includes(q))
        .slice(0, 5)
    : [];

  const showDropdown = isFocused && suggestions.length > 0;

  const handleKeyDown = (e) => {
    if (!showDropdown) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightIdx(prev => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightIdx(prev => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Enter' && highlightIdx >= 0 && highlightIdx < suggestions.length) {
      e.preventDefault();
      setSearchQuery(suggestions[highlightIdx].name);
      setExactSelection(suggestions[highlightIdx].name);
      setIsFocused(false);
      setHighlightIdx(-1);
      inputRef.current?.blur();
    } else if (e.key === 'Escape') {
      setIsFocused(false);
      setHighlightIdx(-1);
      inputRef.current?.blur();
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsFocused(false);
        setHighlightIdx(-1);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => { setHighlightIdx(-1); }, [searchQuery]);

  const selectSuggestion = (name) => {
    setSearchQuery(name);
    setExactSelection(name);
    setIsFocused(false);
    setHighlightIdx(-1);
  };

  return (
    <section className="pt-8 sm:pt-12 pb-14 sm:pb-16 section-padding relative bg-gradient-to-b from-navy-dark/60 via-navy-dark/40 to-transparent">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          title="Explore by State"
          subtitle="Each state tells a different story — pick yours."
        />

        {/* Local Search */}
        <div className="max-w-md mx-auto mb-10 relative" ref={dropdownRef}>
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
            <Search size={18} />
          </div>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search states..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setExactSelection(null);
            }}
            onFocus={() => setIsFocused(true)}
            onKeyDown={handleKeyDown}
            className="w-full bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] rounded-2xl py-3.5 pl-12 pr-12 text-white text-sm placeholder-gray-500/80 focus:outline-none focus:border-india-orange/60 focus:bg-white/[0.07] transition-all duration-300 shadow-xl shadow-black/20"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setExactSelection(null);
                inputRef.current?.focus();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full text-gray-500 hover:bg-white/10 hover:text-white transition-colors"
            >
              <X size={14} />
            </button>
          )}

          {/* Suggestion Dropdown */}
          <AnimatePresence>
            {showDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
                className="absolute left-0 right-0 top-full mt-2 z-40 bg-[#0d1b2a]/95 backdrop-blur-2xl border border-white/[0.08] rounded-2xl shadow-2xl shadow-black/40 overflow-hidden"
              >
                <div className="py-1 max-h-64 overflow-y-auto custom-scrollbar">
                  {suggestions.map((s, idx) => (
                    <button
                      key={s.id}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => selectSuggestion(s.name)}
                      onMouseEnter={() => setHighlightIdx(idx)}
                      className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-all duration-150 ${
                        highlightIdx === idx
                          ? 'bg-india-orange/10'
                          : 'hover:bg-white/[0.04]'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        highlightIdx === idx
                          ? 'bg-india-orange/20 text-india-orange'
                          : 'bg-white/5 text-gray-500'
                      } transition-colors`}>
                        <MapPin size={14} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className={`text-sm font-medium truncate transition-colors ${
                          highlightIdx === idx ? 'text-white' : 'text-gray-300'
                        }`}>
                          {s.name}
                        </p>
                        <p className="text-[11px] text-gray-600 truncate">
                          {s.tagline || 'State in India'}
                        </p>
                      </div>
                      {highlightIdx === idx && (
                        <ChevronRight size={14} className="text-india-orange/60 shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Grid Layout */}
        {displayStates.length > 0 ? (
          <div className="grid grid-cols-1 min-[500px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
            {displayStates.map((state) => (
              <StateCard key={state.id} state={state} variant="image" />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400">No states found matching "{searchQuery}"</p>
          </div>
        )}

        <div className="flex justify-center mt-12">
          <Link
            to="/states"
            className="group bg-india-orange hover:bg-orange-600 text-white font-semibold flex items-center justify-center gap-2 py-3.5 px-8 rounded-full shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_25px_rgba(249,115,22,0.5)] transition-all text-sm sm:text-base"
          >
            View All States & UT
            <ChevronRight size={18} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════════════
   3. POPULAR DESTINATIONS
   ═══════════════════════════════════════════════════════ */
const PopularDestinations = () => {
  const [fetchedDestinations, setFetchedDestinations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await fetch(`${API_URL}/destinations`);
        if (!response.ok) throw new Error('Failed to fetch destinations');
        
        const result = await response.json();
        if (result.success && Array.isArray(result.data)) {
          console.log("Fetched:", result.data.length);
          setFetchedDestinations(result.data);
        } else {
          throw new Error('Invalid data format received');
        }
      } catch (err) {
        console.error('Error fetching destinations:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  const displayedDestinations = showAll ? fetchedDestinations : fetchedDestinations.slice(0, 6);

  return (
    <section className="py-10 sm:py-14 section-padding relative">
      <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-navy-dark/30 to-transparent pointer-events-none" />
      <div className="max-w-7xl mx-auto relative">
        <SectionHeader
          title="Popular Destinations"
          subtitle="Hand-picked locations loved by travellers from around the world."
        />

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-2xl aspect-[3/4] overflow-hidden bg-white/5 border border-white/5 animate-pulse">
                <div className="w-full h-full relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/40 to-transparent z-10" />
                  <div className="absolute bottom-0 left-0 w-full p-4 z-20 space-y-2">
                    <div className="h-3 w-10 bg-white/10 rounded-full" />
                    <div className="h-4 w-3/4 bg-white/10 rounded-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-16 bg-white/5 rounded-3xl border border-red-500/20 max-w-2xl mx-auto">
            <p className="text-red-400 mb-2 font-medium">Oops! Failed to load destinations.</p>
            <p className="text-sm text-gray-500">{error}</p>
          </div>
        ) : fetchedDestinations.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400">No destinations available at the moment.</p>
          </div>
        ) : (
          <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              <AnimatePresence>
                {displayedDestinations.map((dest, idx) => (
                  <motion.div
                    key={dest.id || idx}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, delay: idx >= 6 ? (idx - 6) * 0.05 : 0 }}
                  >
                    <DestinationCard destination={dest} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {fetchedDestinations.length > 6 && (
              <div className="text-center mt-8">
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="btn-outline inline-flex items-center gap-2 text-sm text-india-white group"
                >
                  {showAll ? 'Hide Destinations' : 'See More Destinations'}
                  <ChevronRight size={16} className={`transition-transform ${showAll ? '-rotate-90' : 'group-hover:translate-x-1'}`} />
                </button>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════════════
   4. HIDDEN GEMS PREVIEW
   ═══════════════════════════════════════════════════════ */
const HiddenGemsPreview = () => {
  const preview = hiddenGems.slice(0, 3);

  return (
    <section className="py-10 sm:py-14 section-padding relative bg-gradient-to-b from-navy-dark/50 via-navy-dark/30 to-transparent">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          title="Hidden Gems"
          subtitle="Offbeat destinations most tourists miss — but shouldn't."
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {preview.map((gem) => (
            <HiddenGemCard key={gem.id} gem={gem} />
          ))}
        </div>

        <div className="text-center mt-6">
          <Link
            to="/hidden-gems"
            className="inline-flex items-center gap-1 text-sm text-india-orange hover:underline font-medium"
          >
            View all hidden gems <ChevronRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════════════
   5. SAFETY TIPS PREVIEW
   ═══════════════════════════════════════════════════════ */
const SafetyTipsPreview = () => {
  // Flatten the nested categories array into a single array of tips, then take 3
  const preview = safetyTips.flatMap(category => category.tips).slice(0, 3);

  return (
    <section className="py-10 sm:py-14 section-padding relative">
      <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-navy-dark/30 to-transparent pointer-events-none" />
      <div className="max-w-5xl mx-auto">
        <SectionHeader
          title="Travel Safe"
          subtitle="Essential tips every smart traveller should know."
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {preview.map((tip) => {
            const TipIcon = tip.icon;
            return (
              <div key={tip.title} className="glass rounded-2xl p-6 h-full flex flex-col items-start">
                <div className="w-10 h-10 rounded-xl bg-india-orange/15 flex items-center justify-center mb-4">
                  <TipIcon size={20} className="text-india-orange" />
                </div>
                <h3 className="text-base font-bold mb-2">{tip.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed flex-1">
                  {tip.text}
                </p>
              </div>
            )
          })}
        </div>

        <div className="text-center mt-6">
          <Link
            to="/safety-tips"
            className="inline-flex items-center gap-1 text-sm text-india-orange hover:underline font-medium"
          >
            View all safety tips <ChevronRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════════════
   6. BUDGET PLANNER PREVIEW
   ═══════════════════════════════════════════════════════ */
const BudgetPlannerPreview = () => (
  <section className="py-10 sm:py-14 section-padding relative bg-gradient-to-b from-navy-dark/50 via-navy-dark/30 to-transparent">
    <div className="max-w-5xl mx-auto">
      <div className="glass rounded-3xl p-8 sm:p-12 lg:p-16 flex flex-col lg:flex-row items-center gap-10">
        {/* Icon / visual */}
        <div className="shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-india-orange/15 flex items-center justify-center">
          <Calculator size={40} className="text-india-orange" />
        </div>

        {/* Text */}
        <div className="text-center lg:text-left flex-1">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3">
            Plan Your Budget
          </h2>
          <p className="text-gray-400 text-sm sm:text-base mb-6 max-w-lg">
            Estimate costs for accommodation, food, transport, and activities
            across any Indian destination — so you can travel smart without
            surprises.
          </p>
          <Link
            to="/budget-planner"
            className="btn-primary inline-flex items-center gap-2 text-sm"
          >
            Try Budget Planner <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  </section>
);

/* ═══════════════════════════════════════════════════════
   PAGE COMPOSITION
   ═══════════════════════════════════════════════════════ */
const HomePage = () => (
  <>
    <Hero />
    <FeaturedStates />
    <PopularDestinations />
    <HiddenGemsPreview />
    <SafetyTipsPreview />
    <BudgetPlannerPreview />
    <Newsletter />
  </>
);

export default HomePage;
