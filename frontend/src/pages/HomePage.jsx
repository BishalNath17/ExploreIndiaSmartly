import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  MapPin,
  Gem,
  Shield,
  Calculator,
  ChevronRight,
} from 'lucide-react';
import { fadeUp, scaleIn } from '../utils/animations';
import destinations from '../data/destinations';
import states from '../data/states';
import hiddenGems from '../data/hiddenGems';
import safetyTips from '../data/safetyTips';
import DestinationCard from '../components/DestinationCard';
import StateCard from '../components/StateCard';
import HiddenGemCard from '../components/HiddenGemCard';
import SectionHeader from '../components/SectionHeader';
import Newsletter from '../components/Newsletter';
import ScrollReveal from '../components/ScrollReveal';
import SearchBar from '../components/SearchBar';

/* ═══════════════════════════════════════════════════════
   1. HERO
   ═══════════════════════════════════════════════════════ */
const Hero = () => (
  <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
    {/* Background image + overlay */}
    <div className="absolute inset-0 z-0">
      <div className="absolute inset-0 bg-gradient-to-b from-navy/50 via-navy/70 to-navy z-10" />
      <img
        src="https://images.unsplash.com/photo-1524492707947-2f85aae2c0ad?q=80&w=2048"
        alt="India landscape"
        className="w-full h-full object-cover"
      />
    </div>

    {/* Content */}
    <div className="relative z-20 text-center px-5 w-full max-w-4xl pt-24 pb-16">
      <motion.span
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="text-india-orange font-medium tracking-[0.2em] uppercase mb-5 block text-xs sm:text-sm"
      >
        Discover the Soul of India
      </motion.span>

      <motion.h1
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={0.15}
        className="text-4xl sm:text-5xl lg:text-7xl font-serif font-bold mb-6 leading-[1.1]"
      >
        Travel Beyond <br className="hidden sm:block" />
        <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-india-orange to-white">
          Ordinary Horizons
        </span>
      </motion.h1>

      <motion.p
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={0.3}
        className="text-sm sm:text-base lg:text-lg text-gray-300 mb-10 max-w-xl mx-auto leading-relaxed"
      >
        Curated journeys across vibrant landscapes, ancient heritage, and modern
        marvels of the Indian subcontinent.
      </motion.p>

      {/* CTAs */}
      <motion.div
        variants={scaleIn}
        initial="hidden"
        animate="visible"
        custom={0.45}
        className="flex flex-col sm:flex-row gap-3 justify-center mb-12"
      >
        <Link
          to="/travel-planner"
          className="btn-primary flex items-center justify-center gap-2 text-sm"
        >
          Start Your Journey <ArrowRight size={16} />
        </Link>
        <Link to="/states" className="btn-outline text-center text-sm">
          Explore Destinations
        </Link>
      </motion.div>

      {/* Search */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={0.6}
      >
        <SearchBar />
      </motion.div>
    </div>

    {/* Scroll hint */}
    <motion.div
      animate={{ y: [0, 8, 0] }}
      transition={{ repeat: Infinity, duration: 2 }}
      className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20"
    >
      <div className="w-5 h-9 border-2 border-white/25 rounded-full flex justify-center pt-1.5">
        <div className="w-1 h-1.5 bg-white/50 rounded-full" />
      </div>
    </motion.div>
  </section>
);

/* ═══════════════════════════════════════════════════════
   2. FEATURED STATES
   ═══════════════════════════════════════════════════════ */
const FeaturedStates = () => {
  const featured = states.slice(0, 6);

  return (
    <section className="py-16 sm:py-24 section-padding bg-navy-dark/50">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          title="Explore by State"
          subtitle="Each state tells a different story — pick yours."
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {featured.map((state, i) => (
            <ScrollReveal key={state.slug} delay={i * 0.06}>
              <StateCard state={state} variant="image" />
            </ScrollReveal>
          ))}
        </div>

        <div className="text-center mt-10">
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
const PopularDestinations = () => (
  <section className="py-16 sm:py-24 section-padding">
    <div className="max-w-7xl mx-auto">
      <SectionHeader
        title="Popular Destinations"
        subtitle="Hand-picked locations loved by travellers from around the world."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        {destinations.map((dest, i) => (
          <ScrollReveal key={dest.id} delay={i * 0.1}>
            <DestinationCard destination={dest} />
          </ScrollReveal>
        ))}
      </div>
    </div>
  </section>
);

/* ═══════════════════════════════════════════════════════
   4. HIDDEN GEMS PREVIEW
   ═══════════════════════════════════════════════════════ */
const HiddenGemsPreview = () => {
  const preview = hiddenGems.slice(0, 3);

  return (
    <section className="py-16 sm:py-24 section-padding bg-navy-dark/50">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          title="Hidden Gems"
          subtitle="Offbeat destinations most tourists miss — but shouldn't."
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {preview.map((gem, i) => (
            <ScrollReveal key={gem.slug} delay={i * 0.08}>
              <HiddenGemCard gem={gem} />
            </ScrollReveal>
          ))}
        </div>

        <div className="text-center mt-10">
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
  const preview = safetyTips.slice(0, 3);

  return (
    <section className="py-16 sm:py-24 section-padding">
      <div className="max-w-5xl mx-auto">
        <SectionHeader
          title="Travel Safe"
          subtitle="Essential tips every smart traveller should know."
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {preview.map((tip, i) => (
            <ScrollReveal key={tip.title} delay={i * 0.08}>
              <div className="glass rounded-2xl p-6 h-full flex flex-col items-start">
                <div className="w-10 h-10 rounded-xl bg-india-orange/15 flex items-center justify-center mb-4">
                  <tip.icon size={20} className="text-india-orange" />
                </div>
                <h3 className="text-base font-bold mb-2">{tip.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed flex-1">
                  {tip.text}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <div className="text-center mt-10">
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
  <section className="py-16 sm:py-24 section-padding bg-navy-dark/50">
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
