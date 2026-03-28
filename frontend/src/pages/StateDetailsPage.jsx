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
  X,
} from 'lucide-react';
import { fadeUp } from '../utils/animations';
import { statesData as states } from '../data/statesData';
import { destinationsData as destinations, destinationImages } from '../data/destinationsData';
import { hiddenGemsData as hiddenGems } from '../data/hiddenGemsData';
import { getStateKnowledge } from '../data/knowledgeBase';

import BackButton from '../components/ui/BackButton';
import DestinationCard from '../components/cards/DestinationCard';
import SectionHeader from '../components/layout/SectionHeader';
import ScrollReveal from '../components/ui/ScrollReveal';
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
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="flex flex-col gap-4 mb-5">
        <BackButton fallback="/states" label="All States" className="w-fit" />
        <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-400">
          <Link to="/" className="hover:text-india-orange transition-colors">Home</Link>
          <ChevronRight size={14} />
          <Link to="/states" className="hover:text-india-orange transition-colors">States</Link>
          <ChevronRight size={14} />
          <span className="text-gray-200 font-semibold">{state.name}</span>
        </div>
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

const KBDestinationCard = ({ d, stateId, onClick }) => {
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
    <div 
      onClick={onClick}
      className={`glass rounded-xl overflow-hidden group ${onClick ? 'cursor-pointer hover:border-india-orange/30 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-india-orange/10' : ''}`}
    >
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

/* ═══════════════════════════════════════════════════════
   KB — DESTINATION DETAIL MODAL
   ═══════════════════════════════════════════════════════ */
const KBDestinationDetailModal = ({ dest, stateId, onClose }) => {
  const stateImg = states.find(s => s.id === stateId)?.image;
  const defaultImg = resolveDestImage(dest, stateId);
  const [imgSrc, setImgSrc] = React.useState(defaultImg || stateImg || FALLBACK_IMG);
  const [hasError, setHasError] = React.useState(false);

  React.useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleError = () => {
    if (!hasError && stateImg && imgSrc !== stateImg) {
      setHasError(true);
      setImgSrc(stateImg);
    } else {
      setImgSrc(FALLBACK_IMG);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-12 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-navy-dark/90 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-5xl bg-navy border border-gray-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center bg-black/50 hover:bg-india-orange rounded-full text-white transition-colors"
        >
          <X size={20} />
        </button>

        <div className="overflow-y-auto w-full h-full p-6 sm:p-10 custom-scrollbar">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* Left Info */}
            <div className="flex flex-col">
              {/* Destination Image */}
              <div className="relative w-full h-56 sm:h-64 lg:h-72 rounded-2xl overflow-hidden mb-6 border border-white/5 shrink-0 bg-navy-dark/50">
                <img
                  src={imgSrc}
                  alt={dest.name}
                  className="w-full h-full object-cover"
                  onError={handleError}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-transparent" />
                {imgSrc === FALLBACK_IMG && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <Mountain size={48} className="text-india-orange/30" />
                  </div>
                )}
                
                {/* Category Badge overlay on image */}
                {dest.category && (
                  <div className="absolute top-4 left-4 z-10">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white bg-india-orange/80 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg border border-white/20">
                      {dest.category.replace('_', ' & ')}
                    </span>
                  </div>
                )}
              </div>

              {/* Title & Details */}
              <h2 className="text-3xl sm:text-4xl font-bold mb-3">{dest.name}</h2>
              {dest.location && (
                <p className="flex items-center gap-2 text-gray-400 text-sm mb-6">
                  <MapPin size={16} className="text-india-orange shrink-0" /> {dest.location}
                </p>
              )}
              <p className="text-gray-300 leading-relaxed mb-8">{dest.description}</p>
              
              {dest.whyFamous && (
                <div className="bg-navy-dark/50 rounded-xl p-5 border-l-4 border-india-orange">
                  <h4 className="text-sm font-bold text-india-orange mb-1">Famous For</h4>
                  <p className="text-gray-300 text-sm leading-relaxed">{dest.whyFamous}</p>
                </div>
              )}
            </div>

            {/* Right Map */}
            <div className="w-full bg-navy-dark rounded-2xl overflow-hidden h-64 sm:h-80 lg:h-[400px] border border-gray-800 relative flex flex-col items-center justify-center">
              {dest.mapEmbedUrl ? (
                <iframe 
                  src={dest.mapEmbedUrl} 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen="" 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0 z-0"
                  title={`Map of ${dest.name}`}
                ></iframe>
              ) : (
                <div className="text-center p-6 z-10">
                  <Map size={40} className="text-gray-600 mx-auto mb-4" />
                  <h4 className="font-bold text-gray-300 mb-2">Map will be added soon</h4>
                  <p className="text-gray-500 text-xs max-w-[200px] mx-auto">Embed link can be added later in the destination data</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const KBTopDestinations = ({ data, stateId }) => {
  const [showAll, setShowAll] = React.useState(false);
  const [selectedDest, setSelectedDest] = React.useState(null);

  if (!data?.topDestinations?.length) return null;
  
  const allDests = data.topDestinations;
  const dests = showAll ? allDests : allDests.slice(0, 6);

  return (
    <section className="py-12 sm:py-16 section-padding bg-navy-dark/50">
      <div className="max-w-5xl mx-auto">
        {selectedDest && (
          <KBDestinationDetailModal 
            dest={selectedDest} 
            stateId={stateId} 
            onClose={() => setSelectedDest(null)} 
          />
        )}
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
              <KBDestinationCard key={d.name} d={d} stateId={stateId} onClick={() => setSelectedDest(d)} />
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
      <ExploreMoreCTA />
    </>
  );
};

export default StateDetailsPage;
