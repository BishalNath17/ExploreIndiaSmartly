import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  MapPin,
  Gem,
  Shield,
  Calculator,
  ChevronRight,
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
import SearchBar from '../components/features/SearchBar';

/* ═══════════════════════════════════════════════════════
   1. HERO
   ═══════════════════════════════════════════════════════ */
const getHeroImage = (id, fallback) => {
  const item = heroImagesData.find(img => img.id === id);
  return item && item.image ? item.image : fallback;
};

const Hero = () => {
  const [isSearchActive, setIsSearchActive] = useState(false);

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

      {/* Search */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={0.45}
        className="max-w-xl mx-auto mb-8 relative z-50 pointer-events-auto"
      >
        <SearchBar onSearchActive={setIsSearchActive} />
      </motion.div>

      {/* CTAs */}
      <motion.div
        variants={scaleIn}
        initial="hidden"
        animate="visible"
        custom={0.6}
        className={`flex flex-col sm:flex-row gap-4 justify-center relative transition-all duration-300 ${
          isSearchActive 
            ? 'opacity-0 invisible z-0 translate-y-4 pointer-events-none' 
            : 'opacity-100 visible z-10 translate-y-0 pointer-events-auto'
        }`}
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
  const featured = states.slice(0, 6);

  return (
    <section className="pt-8 sm:pt-12 pb-10 sm:pb-14 section-padding relative bg-gradient-to-b from-navy-dark/60 via-navy-dark/40 to-transparent">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          title="Explore by State"
          subtitle="Each state tells a different story — pick yours."
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {featured.map((state) => (
            <StateCard key={state.id} state={state} variant="image" />
          ))}
        </div>

        <div className="text-center mt-6">
          <Link
            to="/states"
            className="inline-flex items-center gap-1 text-sm text-india-orange hover:underline font-medium"
          >
            View all states <ChevronRight size={14} />
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
        const response = await fetch('http://localhost:5000/api/v1/admin/destinations');
        if (!response.ok) throw new Error('Failed to fetch destinations');
        
        const result = await response.json();
        if (result.success && Array.isArray(result.data)) {
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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {displayedDestinations.map((dest, idx) => (
                <motion.div
                  key={dest.id || idx}
                  initial={idx >= 6 ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx >= 6 ? (idx - 6) * 0.1 : 0 }}
                >
                  <DestinationCard destination={dest} />
                </motion.div>
              ))}
            </div>

            {fetchedDestinations.length > 6 && !showAll && (
              <div className="text-center mt-8">
                <button
                  onClick={() => setShowAll(true)}
                  className="btn-outline inline-flex items-center gap-2 text-sm text-india-white group"
                >
                  See More Destinations
                  <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
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
