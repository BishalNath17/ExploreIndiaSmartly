import { useParams, Link } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Star,
  MapPin,
  Calendar,
  Wallet,
  Clock,
  Map,
  AlertTriangle,
  Compass,
  Gem,
} from 'lucide-react';
import { fadeUp } from '../utils/animations';
import { destinationsData as destinations } from '../data/destinationsData';
import { statesData as states } from '../data/statesData';
import ScrollReveal from '../components/ui/ScrollReveal';
import SectionHeader from '../components/layout/SectionHeader';
import MapboxViewer from '../components/features/MapboxViewer';
import InfoCard from '../components/cards/InfoCard';
import { hiddenGemsData as hiddenGems } from '../data/hiddenGemsData';

/* ═══════════════════════════════════════════════════════
   DESTINATION NOT FOUND
   ═══════════════════════════════════════════════════════ */
const DestNotFound = ({ slug }) => (
  <section className="min-h-[70vh] flex items-center justify-center section-padding">
    <div className="text-center max-w-md">
      <MapPin size={48} className="text-india-orange mx-auto mb-6" />
      <h1 className="text-4xl sm:text-5xl font-bold mb-4">Not Found</h1>
      <p className="text-gray-400 mb-8 text-sm">
        We couldn&apos;t find a destination matching &ldquo;{slug}&rdquo;.
      </p>
      <Link to="/states" className="btn-primary">
        Browse States
      </Link>
    </div>
  </section>
);

/* ═══════════════════════════════════════════════════════
   1. HERO BANNER
   ═══════════════════════════════════════════════════════ */
const HeroBanner = ({ dest, parentState }) => {
  const stateName = parentState?.name || dest.state?.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  return (
    <section className="relative h-[50vh] sm:h-[65vh] overflow-hidden">
      <img src={dest.image} alt={dest.name} className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-navy/40 via-navy/60 to-navy z-10" />

      <div className="absolute bottom-0 left-0 w-full p-6 sm:p-12 lg:p-16 z-20 max-w-5xl">
        <motion.div variants={fadeUp} initial="hidden" animate="visible">
          <Link
            to={`/state/${dest.state}`}
            className="inline-flex items-center gap-2 text-gray-300 hover:text-india-orange transition-colors mb-5 text-sm"
          >
            <ArrowLeft size={16} /> {stateName}
          </Link>
        </motion.div>

        {dest.category && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0.1} className="mb-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-india-orange bg-india-orange/15 px-3 py-1 rounded-full">
              {dest.category}
            </span>
          </motion.div>
        )}

        <motion.h1 variants={fadeUp} initial="hidden" animate="visible" custom={0.15}
          className="text-3xl sm:text-5xl lg:text-6xl font-bold mb-3">
          {dest.name}
        </motion.h1>

        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0.25}
          className="flex flex-wrap items-center gap-4 text-sm text-gray-300">
          {dest.rating && (
            <span className="flex items-center gap-1">
              <Star size={14} className="text-india-orange fill-india-orange" /> {dest.rating}
            </span>
          )}
          <span className="flex items-center gap-1">
            <MapPin size={14} className="text-india-orange" /> {stateName}
          </span>
        </motion.div>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════════════
   2. OVERVIEW + INFO CARDS
   ═══════════════════════════════════════════════════════ */
const Overview = ({ dest, parentState }) => {
  const bestTime = dest.bestTime || parentState?.bestTime;
  const budget = dest.budget || parentState?.budgetRange;
  const duration = dest.duration || '2–3 days';

  const cards = [
    bestTime && { icon: Calendar, label: 'Best Time', value: bestTime },
    { icon: Clock, label: 'Ideal Duration', value: duration },
    budget && { icon: Wallet, label: 'Daily Budget', value: budget },
  ].filter(Boolean);

  return (
    <section className="py-16 sm:py-20 section-padding">
      <div className="max-w-5xl mx-auto">
        <ScrollReveal>
          <div className="glass rounded-3xl p-8 sm:p-12 mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">About {dest.name}</h2>
            <p className="text-gray-300 leading-relaxed text-sm sm:text-base">{dest.description}</p>
          </div>
        </ScrollReveal>

        {cards.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {cards.map((c) => (
              <InfoCard key={c.label} icon={c.icon} label={c.label} value={c.value} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════════════
   3. ITINERARY HINTS
   ═══════════════════════════════════════════════════════ */
const ItineraryHints = ({ dest }) => {
  const hints = dest.itineraryHints;
  if (!hints || hints.length === 0) return null;

  return (
    <section className="py-16 sm:py-20 section-padding bg-navy-dark/50">
      <div className="max-w-5xl mx-auto">
        <SectionHeader title="Suggested Itinerary" subtitle="A quick plan to make the most of your visit." />
        <div className="space-y-4">
          {hints.map((hint, i) => (
              <div key={i} className="glass rounded-2xl p-6 flex items-start gap-4">
                <span className="shrink-0 w-8 h-8 rounded-full bg-india-orange/15 text-india-orange text-sm font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                <p className="text-gray-300 text-sm leading-relaxed pt-1">{hint}</p>
              </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════════════
   4. NEARBY PLACES
   ═══════════════════════════════════════════════════════ */
const NearbyPlaces = ({ dest, parentState }) => {
  // Show other destinations in the same state (excluding current)
  const nearby = destinations.filter(d => d.state === dest.state && d.id !== dest.id);
  // Also check hidden gems
  const nearbyGems = hiddenGems.filter(g => g.state === dest.state && g.id !== dest.id);

  if (nearby.length === 0 && nearbyGems.length === 0) return null;
  const stateName = parentState?.name || dest.state;

  return (
    <section className="py-16 sm:py-20 section-padding bg-navy-dark/50">
      <div className="max-w-7xl mx-auto">
        <SectionHeader title="Nearby Places" subtitle={`More to explore in ${stateName}.`} />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {nearby.slice(0, 3).map((place) => (
              <Link key={place.id} to={`/destination/${place.id}`}
                className="group glass rounded-2xl overflow-hidden block hover:bg-white/15 transition-colors">
                <div className="relative h-48">
                  <img src={place.image} alt={place.name} loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/80 to-transparent" />
                </div>
                <div className="p-5">
                  <h3 className="font-bold group-hover:text-india-orange transition-colors mb-1">{place.name}</h3>
                  <p className="text-gray-400 text-xs line-clamp-2">{place.description}</p>
                </div>
              </Link>
          ))}

          {nearbyGems.slice(0, 3 - nearby.slice(0, 3).length).map((gem) => (
              <div key={gem.id} className="glass rounded-2xl overflow-hidden hover:bg-white/15 transition-colors">
                <div className="relative h-48">
                  <img src={gem.image} alt={gem.name} loading="lazy"
                    className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/80 to-transparent" />
                  <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider text-india-orange bg-navy/80 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Gem size={10} /> Hidden Gem
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-bold mb-1">{gem.name}</h3>
                  <p className="text-gray-400 text-xs line-clamp-2">{gem.description}</p>
                </div>
              </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════════════
   5. TRAVEL TIPS
   ═══════════════════════════════════════════════════════ */
const TravelTips = ({ dest, parentState }) => {
  const tips = dest.tips || [];
  const stateTip = parentState?.travelNotes;

  if (tips.length === 0 && !stateTip) return null;

  return (
    <section className="py-16 sm:py-20 section-padding">
      <div className="max-w-5xl mx-auto">
        <SectionHeader title="Travel Tips" subtitle="Know before you go." />
        <div className="space-y-4">
          {tips.map((tip, i) => (
              <div key={i} className="glass rounded-2xl p-6 flex items-start gap-4">
                <Compass size={18} className="text-india-orange shrink-0 mt-0.5" />
                <p className="text-gray-300 text-sm leading-relaxed">{tip}</p>
              </div>
          ))}

          {stateTip && (
            <ScrollReveal delay={tips.length * 0.06}>
              <div className="glass rounded-2xl p-6 flex items-start gap-4 border-l-4 border-india-orange/60">
                <AlertTriangle size={18} className="text-india-orange shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold mb-1 text-india-orange">Regional Advisory</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">{stateTip}</p>
                </div>
              </div>
            </ScrollReveal>
          )}
        </div>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════════════
   6. MAP PLACEHOLDER
   ═══════════════════════════════════════════════════════ */
const MapPlaceholder = ({ dest, parentState }) => {
  const coords = dest.coords || parentState?.coords;
  if (!coords) return null;

  return (
    <section className="py-16 sm:py-20 section-padding bg-navy-dark/50">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <MapboxViewer 
            coordinates={coords ? [coords.lng, coords.lat] : undefined}
            title={dest.name}
            zoom={8}
            height="400px"
          />
        </ScrollReveal>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════════════
   7. CTA
   ═══════════════════════════════════════════════════════ */
const ExploreCTA = ({ parentState }) => (
  <section className="py-16 sm:py-20 section-padding">
    <div className="max-w-3xl mx-auto text-center">
      <ScrollReveal>
        <h2 className="text-2xl sm:text-3xl font-bold mb-4">Continue Exploring</h2>
        <p className="text-gray-400 text-sm sm:text-base mb-8 max-w-lg mx-auto">
          Discover more destinations, hidden gems, and travel tips across India.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {parentState && (
            <Link to={`/state/${parentState.id}`}
              className="btn-primary inline-flex items-center justify-center gap-2 text-sm">
              More in {parentState.name} <ArrowRight size={16} />
            </Link>
          )}
          <Link to="/states" className="btn-outline inline-flex items-center justify-center gap-2 text-sm">
            All States
          </Link>
        </div>
      </ScrollReveal>
    </div>
  </section>
);

/* ═══════════════════════════════════════════════════════
   PAGE COMPOSITION
   ═══════════════════════════════════════════════════════ */
const DestinationDetailsPage = () => {
  const { destSlug } = useParams();
  const dest = destinations.find((d) => d.id === destSlug);

  if (!dest) return <DestNotFound slug={destSlug} />;

  const parentState = states.find((s) => s.id === dest.state) || null;

  return (
    <>
      <HeroBanner dest={dest} parentState={parentState} />
      <Overview dest={dest} parentState={parentState} />
      <ItineraryHints dest={dest} />
      <NearbyPlaces dest={dest} parentState={parentState} />
      <TravelTips dest={dest} parentState={parentState} />
      <MapPlaceholder dest={dest} parentState={parentState} />
      <ExploreCTA parentState={parentState} />
    </>
  );
};

export default DestinationDetailsPage;
