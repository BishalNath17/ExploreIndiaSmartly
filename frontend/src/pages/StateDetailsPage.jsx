import React, { useState } from 'react';
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
  ArrowRight,
  ChevronRight,
  UtensilsCrossed,
  PartyPopper,
  Lightbulb,
  Plane,
  Sun,
  Mountain,
} from 'lucide-react';
import { fadeUp } from '../utils/animations';
import { statesData as states } from '../data/statesData';
import { destinationsData as destinations, destinationImages } from '../data/destinationsData';
import { hiddenGemsData as hiddenGems } from '../data/hiddenGemsData';
import { getStateKnowledge } from '../data/knowledgeBase';

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
const Overview = ({ state, data }) => {
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
              {data?.overview?.short || state.intro}
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
   KB — COMPACT FOOD & CUISINE
   ═══════════════════════════════════════════════════════ */
const KBFood = ({ data }) => {
  if (!data?.foodCuisine) return null;
  const { famousDishes = [], streetFood = [] } = data.foodCuisine;
  if (!famousDishes.length && !streetFood.length) return null;

  return (
    <section className="py-12 sm:py-16 section-padding">
      <div className="max-w-5xl mx-auto">
        <ScrollReveal>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-xl bg-india-orange/15 flex items-center justify-center">
              <UtensilsCrossed size={18} className="text-india-orange" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold">Food & Cuisine</h3>
          </div>
          
          {famousDishes.length > 0 && (
            <div className="mb-8">
              <h4 className="text-lg font-bold mb-4 border-b border-gray-700/50 pb-2 inline-block">Famous Dishes</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {famousDishes.map((d) => (
                  <div key={d.name} className="glass rounded-xl p-4">
                    <h4 className="font-bold text-sm text-india-orange mb-1">{d.name}</h4>
                    <p className="text-gray-400 text-xs leading-relaxed">{d.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {streetFood.length > 0 && (
            <div>
              <h4 className="text-lg font-bold mb-4 border-b border-gray-700/50 pb-2 inline-block">Street Food</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {streetFood.map((d) => (
                  <div key={d.name} className="glass rounded-xl p-4">
                    <h4 className="font-bold text-sm text-india-orange mb-1">{d.name}</h4>
                    <p className="text-gray-400 text-xs leading-relaxed">{d.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </ScrollReveal>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════════════
   KB — FESTIVALS
   ═══════════════════════════════════════════════════════ */
const KBFestivals = ({ data }) => {
  if (!data?.festivals?.length) return null;
  return (
    <section className="py-12 sm:py-16 section-padding bg-navy-dark/50">
      <div className="max-w-5xl mx-auto">
        <ScrollReveal>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-xl bg-india-orange/15 flex items-center justify-center">
              <PartyPopper size={18} className="text-india-orange" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold">Festivals & Events</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {data.festivals.map((f) => (
              <div key={f.name} className="glass rounded-xl p-4 flex gap-4">
                <div className="shrink-0 text-center">
                  <span className="text-[10px] uppercase tracking-wider text-india-orange font-bold">{f.period}</span>
                </div>
                <div>
                  <h4 className="font-bold text-sm mb-1">{f.name}</h4>
                  <p className="text-gray-400 text-xs leading-relaxed">{f.description}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════════════
   KB — TRAVEL TIPS
   ═══════════════════════════════════════════════════════ */
const KBTravelTips = ({ data }) => {
  if (!data?.travelTips?.length) return null;
  return (
    <section className="py-12 sm:py-16 section-padding">
      <div className="max-w-5xl mx-auto">
        <ScrollReveal>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-xl bg-india-orange/15 flex items-center justify-center">
              <Lightbulb size={18} className="text-india-orange" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold">Travel Tips</h3>
          </div>
          <div className="glass rounded-2xl p-5 sm:p-6">
            <ul className="space-y-3">
              {data.travelTips.map((tip, i) => (
                <li key={i} className="flex gap-3 text-sm text-gray-300">
                  <ChevronRight size={14} className="text-india-orange shrink-0 mt-1" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════════════
   KB — STAY OPTIONS
   ═══════════════════════════════════════════════════════ */
const KBStayOptions = ({ data }) => {
  if (!data?.stayOptions && !data?.stay) return null;
  const options = data.stayOptions || data.stay;
  const categories = [
    { label: 'Luxury', items: options.luxury || [] },
    { label: 'Mid-Range', items: options.midRange || [] },
    { label: 'Budget / Eco / Unique', items: options.budget || options.unique || [] },
  ].filter(c => c.items.length > 0);

  if (categories.length === 0) return null;

  return (
    <section className="py-12 sm:py-16 section-padding">
      <div className="max-w-5xl mx-auto">
        <ScrollReveal>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-xl bg-india-orange/15 flex items-center justify-center">
              <MapPin size={18} className="text-india-orange" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold">Stay Options</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <div key={cat.label} className="glass rounded-xl p-5 border border-white/5 hover:border-india-orange/30 transition-colors">
                <h4 className="font-bold text-sm text-india-orange border-b border-gray-700/50 pb-2 mb-3">{cat.label}</h4>
                <ul className="space-y-3">
                  {cat.items.map((item, i) => (
                    <li key={i} className="text-gray-300 text-xs sm:text-sm flex gap-2">
                       <span className="text-india-orange mt-0.5">•</span> 
                       <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════════════
   KB — ACTIVITIES & ADVENTURE
   ═══════════════════════════════════════════════════════ */
const KBActivities = ({ data }) => {
  const activities = data?.adventure || data?.activities;
  if (!activities?.length) return null;

  return (
    <section className="py-12 sm:py-16 section-padding bg-navy-dark/50">
      <div className="max-w-5xl mx-auto">
        <ScrollReveal>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-xl bg-india-orange/15 flex items-center justify-center">
              <Mountain size={18} className="text-india-orange" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold">Adventure & Activities</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {activities.map((act, i) => (
              <div key={i} className="glass rounded-xl p-4 flex gap-3 items-center hover:bg-white/5 transition-colors">
                 <div className="w-2 h-2 rounded-full bg-india-orange shrink-0" />
                 <p className="text-gray-300 text-sm leading-relaxed">{act}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════════════
   KB — CONNECTIVITY
   ═══════════════════════════════════════════════════════ */
const KBConnectivity = ({ data }) => {
  if (!data?.transportation) return null;
  const { airports = [], railways = [], roads = [] } = data.transportation;
  if (!airports.length && !railways.length && !roads.length) return null;
  const groups = [
    { label: 'By Air', icon: Plane, items: airports },
    { label: 'By Rail', icon: Map, items: railways },
    { label: 'By Road', icon: ArrowRight, items: roads },
  ].filter(g => g.items.length > 0);

  return (
    <section className="py-12 sm:py-16 section-padding bg-navy-dark/50">
      <div className="max-w-5xl mx-auto">
        <ScrollReveal>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-xl bg-india-orange/15 flex items-center justify-center">
              <Plane size={18} className="text-india-orange" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold">How to Reach</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {groups.map((g) => (
              <div key={g.label} className="glass rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <g.icon size={14} className="text-india-orange" />
                  <h4 className="font-bold text-sm">{g.label}</h4>
                </div>
                <ul className="space-y-2">
                  {g.items.map((item, i) => (
                    <li key={i} className="text-gray-400 text-xs leading-relaxed">{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════════════
   KB — BEST TIME TO VISIT
   ═══════════════════════════════════════════════════════ */
const KBBestTime = ({ data }) => {
  if (!data?.bestTimeToVisit?.length) return null;
  return (
    <section className="py-12 sm:py-16 section-padding">
      <div className="max-w-5xl mx-auto">
        <ScrollReveal>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-xl bg-india-orange/15 flex items-center justify-center">
              <Sun size={18} className="text-india-orange" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold">Best Time to Visit</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {data.bestTimeToVisit.map((s) => (
              <div key={s.season} className="glass rounded-xl p-4">
                <h4 className="font-bold text-sm text-india-orange mb-1">{s.season}</h4>
                <p className="text-white text-xs font-semibold mb-1">{s.months}</p>
                <p className="text-gray-400 text-xs leading-relaxed">{s.conditions}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════════════
   KB — TOP DESTINATIONS (from knowledge base)
   ═══════════════════════════════════════════════════════ */
const FALLBACK_IMG = 'data:image/svg+xml,' + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200" viewBox="0 0 400 200"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#1B2A4E"/><stop offset="100%" stop-color="#0A192F"/></linearGradient></defs><rect fill="url(#g)" width="400" height="200"/><text x="200" y="108" text-anchor="middle" fill="#F97316" font-family="sans-serif" font-size="14" opacity="0.6">Image Coming Soon</text></svg>'
);

/**
 * Try multiple strategies to resolve an image for a KB destination:
 * 1. Exact slug tail match  (e.g. "old-goa" → destinationImages["old-goa"])
 * 2. Any key that the slug contains  (e.g. "tirupati-tirumala" contains "tirupati")
 * 3. Slugified name match  (e.g. "Visakhapatnam" → "visakhapatnam")
 * 4. State image path fallback (e.g. /images/states/goa.jpg)
 */
const toSlug = (str) => str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const imgKeys = Object.keys(destinationImages);

const resolveDestImage = (dest, stateId) => {
  if (dest.slug) {
    const segments = dest.slug.split('/').filter(Boolean);
    const tail = segments[segments.length - 1];
    // Strategy 1: exact match
    if (destinationImages[tail]) return destinationImages[tail];
    // Strategy 2: key contained in tail or tail contains key
    const partialMatch = imgKeys.find(k => tail.includes(k) || k.includes(tail));
    if (partialMatch) return destinationImages[partialMatch];
  }
  // Strategy 3: name-based slug
  if (dest.name) {
    const nameSlug = toSlug(dest.name);
    if (destinationImages[nameSlug]) return destinationImages[nameSlug];
    const nameMatch = imgKeys.find(k => nameSlug.includes(k) || k.includes(nameSlug));
    if (nameMatch) return destinationImages[nameMatch];
  }
  // Strategy 4: state hero image as fallback
  const stateObj = states.find(s => s.id === stateId);
  if (stateObj?.image) return stateObj.image;
  return null;
};

const KBDestinationCard = ({ d, stateId }) => {
  const stateImg = states.find(s => s.id === stateId)?.image;
  // initial mapped image
  const defaultImg = resolveDestImage(d, stateId);
  const [imgSrc, setImgSrc] = React.useState(defaultImg || stateImg || FALLBACK_IMG);
  const [hasError, setHasError] = React.useState(false);

  const handleError = () => {
    if (!hasError && stateImg && imgSrc !== stateImg) {
      setHasError(true);
      setImgSrc(stateImg);
    } else {
      setImgSrc(FALLBACK_IMG);
    }
  };

  return (
    <div className="glass rounded-xl overflow-hidden group">
      {/* Image */}
      <div className="relative h-36 overflow-hidden">
        <img
          src={imgSrc}
          alt={d.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={handleError}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/80 to-transparent" />
        {imgSrc === FALLBACK_IMG && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <Mountain size={32} className="text-india-orange/40" />
          </div>
        )}
      </div>
      {/* Text */}
      <div className="p-4">
        <h4 className="font-bold text-sm mb-1">{d.name}</h4>
        <p className="text-gray-500 text-[11px] mb-2">{d.location}</p>
        <p className="text-gray-400 text-xs leading-relaxed line-clamp-3">{d.description}</p>
      </div>
    </div>
  );
};

const KBTopDestinations = ({ data, stateId }) => {
  const [showAll, setShowAll] = React.useState(false);
  if (!data?.topDestinations?.length) return null;
  
  const allDests = data.topDestinations;
  const dests = showAll ? allDests : allDests.slice(0, 6);

  return (
    <section className="py-12 sm:py-16 section-padding bg-navy-dark/50">
      <div className="max-w-5xl mx-auto">
        <ScrollReveal>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-india-orange/15 flex items-center justify-center">
                <Mountain size={18} className="text-india-orange" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold">Places to Explore</h3>
            </div>
            {allDests.length > 6 && showAll && (
              <button 
                onClick={() => setShowAll(false)}
                className="text-sm font-semibold text-india-orange hover:text-white transition-colors"
              >
                Show Less
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {dests.map((d) => (
              <KBDestinationCard key={d.name} d={d} stateId={stateId} />
            ))}
          </div>
          {allDests.length > 6 && !showAll && (
            <div className="mt-8 text-center flex justify-center">
              <button 
                onClick={() => setShowAll(true)}
                className="bg-navy border border-gray-700 hover:border-india-orange text-white px-6 py-3 rounded-full inline-flex items-center gap-2 text-sm transition-all"
              >
                View All {allDests.length} Destinations <ArrowRight size={16} />
              </button>
            </div>
          )}
        </ScrollReveal>
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
            <HiddenGemCard key={gem.id} gem={gem} />
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
  const state = states.find((s) => s.id === stateSlug);
  const kb = getStateKnowledge(stateSlug);

  if (!state) return <StateNotFound slug={stateSlug} />;

  return (
    <>
      <HeroBanner state={state} />
      <Overview state={state} data={kb} />
      <KBTopDestinations data={kb} stateId={state.id} />
      <KBFood data={kb} />
      <KBStayOptions data={kb} />
      <KBActivities data={kb} />
      <KBBestTime data={kb} />
      <KBConnectivity data={kb} />
      <KBFestivals data={kb} />
      <KBTravelTips data={kb} />
      <MapPlaceholder state={state} />
      <ExploreMoreCTA />
    </>
  );
};

export default StateDetailsPage;
