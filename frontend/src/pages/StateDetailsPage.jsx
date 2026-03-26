import { useParams, Link } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Wallet,
  AlertTriangle,
  Gem,
  Map,
  Star,
  ArrowRight,
  ChevronRight,
} from 'lucide-react';
import { fadeUp } from '../utils/animations';
import states from '../data/states';
import destinations from '../data/destinations';
import hiddenGems from '../data/hiddenGems';
import DestinationCard from '../components/cards/DestinationCard';
import SectionHeader from '../components/layout/SectionHeader';
import ScrollReveal from '../components/ui/ScrollReveal';
import MapboxViewer from '../components/features/MapboxViewer';
import InfoCard from '../components/cards/InfoCard';
import HiddenGemCard from '../components/cards/HiddenGemCard';
import EmptyState from '../components/ui/EmptyState';

/* ═══════════════════════════════════════════════════════
   STATE NOT FOUND FALLBACK
   ═══════════════════════════════════════════════════════ */
const StateNotFound = ({ slug }) => (
  <section className="min-h-[70vh] flex items-center justify-center section-padding">
    <div className="text-center max-w-md">
      <MapPin size={48} className="text-india-orange mx-auto mb-6" />
      <h1 className="text-4xl sm:text-5xl font-bold mb-4">State Not Found</h1>
      <p className="text-gray-400 mb-8 text-sm">
        We couldn&apos;t find a state matching &ldquo;{slug}&rdquo;. It may not
        exist or the URL might be incorrect.
      </p>
      <Link to="/states" className="btn-primary">
        Browse All States
      </Link>
    </div>
  </section>
);

/* ═══════════════════════════════════════════════════════
   1. HERO BANNER
   ═══════════════════════════════════════════════════════ */
const HeroBanner = ({ state }) => (
  <section className="relative h-[55vh] sm:h-[65vh] overflow-hidden">
    {/* Image */}
    <img
      src={state.image}
      alt={state.name}
      className="absolute inset-0 w-full h-full object-cover"
    />
    {/* Gradient overlay */}
    <div className="absolute inset-0 bg-gradient-to-b from-navy/40 via-navy/60 to-navy z-10" />

    {/* Content */}
    <div className="absolute bottom-0 left-0 w-full p-6 sm:p-12 lg:p-16 z-20 max-w-5xl">
      <motion.div variants={fadeUp} initial="hidden" animate="visible">
        <Link
          to="/states"
          className="inline-flex items-center gap-2 text-gray-300 hover:text-india-orange transition-colors mb-5 text-sm"
        >
          <ArrowLeft size={16} /> All States
        </Link>
      </motion.div>

      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={0.1}
        className="flex items-center gap-3 mb-3"
      >
        <span className="text-[10px] font-bold uppercase tracking-widest text-india-orange bg-india-orange/15 px-3 py-1 rounded-full">
          {state.type === 'ut' ? 'Union Territory' : 'State'}
        </span>
      </motion.div>

      <motion.h1
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={0.2}
        className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-3"
      >
        {state.name}
      </motion.h1>

      <motion.p
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={0.3}
        className="text-lg sm:text-xl text-gray-300 italic"
      >
        {state.tagline}
      </motion.p>
    </div>
  </section>
);

/* ═══════════════════════════════════════════════════════
   2. OVERVIEW + INFO CARDS
   ═══════════════════════════════════════════════════════ */
const Overview = ({ state }) => {
  const infoCards = [
    {
      icon: Calendar,
      label: 'Best Time to Visit',
      value: state.bestTime,
    },
    {
      icon: Wallet,
      label: 'Approx Daily Budget',
      value: state.budgetRange,
    },
    {
      icon: MapPin,
      label: 'Coordinates',
      value: `${state.coords.lat.toFixed(2)}°N, ${state.coords.lng.toFixed(2)}°E`,
    },
  ];

  return (
    <section className="py-16 sm:py-20 section-padding">
      <div className="max-w-5xl mx-auto">
        {/* Intro paragraph */}
        <ScrollReveal>
          <div className="glass rounded-3xl p-8 sm:p-12 mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              About {state.name}
            </h2>
            <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
              {state.intro}
            </p>
          </div>
        </ScrollReveal>

        {/* Info card grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {infoCards.map((card) => (
            <InfoCard key={card.label} icon={card.icon} label={card.label} value={card.value} />
          ))}
        </div>

        {/* Travel notes */}
        {state.travelNotes && (
          <ScrollReveal delay={0.25}>
            <div className="mt-6 glass rounded-2xl p-6 flex items-start gap-4 border-l-4 border-india-orange/60">
              <AlertTriangle
                size={20}
                className="text-india-orange shrink-0 mt-0.5"
              />
              <div>
                <h4 className="text-sm font-bold mb-1 text-india-orange">
                  Travel Advisory
                </h4>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {state.travelNotes}
                </p>
              </div>
            </div>
          </ScrollReveal>
        )}
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════════════
   3. POPULAR DESTINATIONS
   ═══════════════════════════════════════════════════════ */
const PopularDestinations = ({ stateSlug, stateName }) => {
  const stateDestinations = destinations.filter((d) => d.state === stateSlug);

  return (
    <section className="py-16 sm:py-20 section-padding bg-navy-dark/50">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          title="Popular Destinations"
          subtitle={`Must-visit places in ${stateName}.`}
        />

        {stateDestinations.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {stateDestinations.map((dest) => (
              <DestinationCard key={dest.id} destination={dest} />
            ))}
          </div>
        ) : (
          <ScrollReveal>
            <EmptyState icon={MapPin} message={`We're curating destinations for ${stateName}. Check back soon!`} />
          </ScrollReveal>
        )}
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════════════
   4. HIDDEN GEMS
   ═══════════════════════════════════════════════════════ */
const HiddenGemsSection = ({ stateSlug, stateName }) => {
  const gems = hiddenGems.filter((g) => g.state === stateSlug);

  if (gems.length === 0) return null;

  return (
    <section className="py-16 sm:py-20 section-padding">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          title="Hidden Gems"
          subtitle={`Offbeat destinations in ${stateName} that most tourists miss.`}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {gems.map((gem) => (
            <HiddenGemCard key={gem.slug} gem={gem} />
          ))}
        </div>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════════════
   5. MAP PLACEHOLDER
   ═══════════════════════════════════════════════════════ */
const MapPlaceholder = ({ state }) => (
  <section className="py-16 sm:py-20 section-padding bg-navy-dark/50">
    <div className="max-w-6xl mx-auto">
      <SectionHeader
        title={`Explore ${state.name}`}
        subtitle="Interactive Map"
      />

      <ScrollReveal>
        <MapboxViewer 
          coordinates={state.coords ? [state.coords.lng, state.coords.lat] : undefined}
          title={state.name}
          zoom={5}
          height="450px"
        />
      </ScrollReveal>
    </div>
  </section>
);

/* ═══════════════════════════════════════════════════════
   6. CTA — EXPLORE MORE
   ═══════════════════════════════════════════════════════ */
const ExploreMoreCTA = () => (
  <section className="py-16 sm:py-20 section-padding">
    <div className="max-w-3xl mx-auto text-center">
      <ScrollReveal>
        <h2 className="text-2xl sm:text-3xl font-bold mb-4">
          Discover More of India
        </h2>
        <p className="text-gray-400 text-sm sm:text-base mb-8 max-w-lg mx-auto">
          Every state has its own story. Continue exploring the rich tapestry
          of Indian culture, nature, and heritage.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/states"
            className="btn-primary inline-flex items-center justify-center gap-2 text-sm"
          >
            Browse All States <ArrowRight size={16} />
          </Link>
          <Link
            to="/hidden-gems"
            className="btn-outline inline-flex items-center justify-center gap-2 text-sm"
          >
            Hidden Gems <Gem size={16} />
          </Link>
        </div>
      </ScrollReveal>
    </div>
  </section>
);

/* ═══════════════════════════════════════════════════════
   PAGE COMPOSITION
   ═══════════════════════════════════════════════════════ */
const StateDetailsPage = () => {
  const { stateSlug } = useParams();
  const state = states.find((s) => s.slug === stateSlug);

  if (!state) return <StateNotFound slug={stateSlug} />;

  return (
    <>
      <HeroBanner state={state} />
      <Overview state={state} />
      <PopularDestinations stateSlug={state.slug} stateName={state.name} />
      <HiddenGemsSection stateSlug={state.slug} stateName={state.name} />
      <MapPlaceholder state={state} />
      <ExploreMoreCTA />
    </>
  );
};

export default StateDetailsPage;
