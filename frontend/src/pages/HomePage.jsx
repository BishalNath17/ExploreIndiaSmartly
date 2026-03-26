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
  <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden">
    {/* Background image + overlay */}
    <div className="absolute inset-0 z-0">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/70 to-slate-900/90 z-10" />
      <img
        src="https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=2076"
        alt="Taj Mahal in India"
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
          src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=400"
          alt="Snow mountain trek"
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
          src="https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=400"
          alt="Kerala Houseboat"
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
        className="max-w-xl mx-auto mb-8 relative z-30 pointer-events-auto"
      >
        <SearchBar />
      </motion.div>

      {/* CTAs */}
      <motion.div
        variants={scaleIn}
        initial="hidden"
        animate="visible"
        custom={0.6}
        className="flex flex-col sm:flex-row gap-4 justify-center relative z-30 pointer-events-auto"
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
  // Flatten the nested categories array into a single array of tips, then take 3
  const preview = safetyTips.flatMap(category => category.tips).slice(0, 3);

  return (
    <section className="py-16 sm:py-24 section-padding">
      <div className="max-w-5xl mx-auto">
        <SectionHeader
          title="Travel Safe"
          subtitle="Essential tips every smart traveller should know."
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {preview.map((tip, i) => {
            const TipIcon = tip.icon;
            return (
              <ScrollReveal key={tip.title} delay={i * 0.08}>
                <div className="glass rounded-2xl p-6 h-full flex flex-col items-start">
                  <div className="w-10 h-10 rounded-xl bg-india-orange/15 flex items-center justify-center mb-4">
                    <TipIcon size={20} className="text-india-orange" />
                  </div>
                  <h3 className="text-base font-bold mb-2">{tip.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed flex-1">
                    {tip.text}
                  </p>
                </div>
              </ScrollReveal>
            )
          })}
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
