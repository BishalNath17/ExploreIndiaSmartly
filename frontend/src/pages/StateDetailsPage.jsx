import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
  Search,
  Sparkles,
} from 'lucide-react';
import { fadeUp } from '../utils/animations';
import useApiData from '../hooks/useApiData';

import BackButton from '../components/ui/BackButton';
import DestinationCard from '../components/cards/DestinationCard';
import SectionHeader from '../components/layout/SectionHeader';
import ScrollReveal from '../components/ui/ScrollReveal';
import InfoCard from '../components/cards/InfoCard';
import HiddenGemCard from '../components/cards/HiddenGemCard';
import EmptyState from '../components/ui/EmptyState';
import { API_URL, API_BASE, resolveImageUrl } from '../config/api';

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
   1. HERO BANNER  —  State Image + State Map side-by-side
   ═══════════════════════════════════════════════════════ */
const HeroBanner = ({ state }) => {
  const mapUrl = state?.mapEmbedUrl || '';

  return (
    <section className="relative pt-24 pb-10 sm:pt-32 sm:pb-14 overflow-hidden">
      {/* Ambient gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-india-orange/10 via-navy to-navy-dark z-0" />
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] rounded-full bg-india-orange/5 blur-3xl z-0" />

      <div className="relative z-10 max-w-6xl mx-auto section-padding">
        {/* Navigation row */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="flex flex-col gap-3 mb-8">
          <BackButton fallback="/states" label="All States" className="w-fit" />
          <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-400">
            <Link to="/" className="hover:text-india-orange transition-colors">Home</Link>
            <ChevronRight size={14} />
            <Link to="/states" className="hover:text-india-orange transition-colors">States</Link>
            <ChevronRight size={14} />
            <span className="text-gray-200 font-semibold">{state.name}</span>
          </div>
        </motion.div>

        {/* ── Hero Visuals (Image + Map Overlay) ── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.1}
          className="relative mb-8 flex flex-col sm:block"
        >
          {/* Main State Image */}
          <div className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 h-[260px] sm:h-[380px] lg:h-[480px] shadow-2xl group">
            <img
              src={state.image}
              alt={state.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/30 to-black/20" />
            <div className="absolute bottom-6 left-6 flex items-center gap-2 z-10">
              <MapPin size={16} className="text-india-orange" />
              <span className="text-sm font-medium tracking-wide text-gray-200 drop-shadow-md">{state.name}, India</span>
            </div>

            {/* Desktop Map Overlay (Hidden on < sm) */}
            <div className="hidden sm:block absolute top-6 right-6 w-[260px] h-[180px] lg:w-[320px] lg:h-[220px] rounded-xl overflow-hidden border border-white/20 shadow-[-10px_10px_30px_rgba(0,0,0,0.5)] bg-navy/80 backdrop-blur-md z-20 group-hover:border-white/30 transition-all duration-300">
              {mapUrl ? (
                <iframe
                  src={mapUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0"
                  title={`Map of ${state.name}`}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-center p-4 bg-navy-dark/60">
                  <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-3">
                    <Map size={22} className="text-gray-400" />
                  </div>
                  <h4 className="font-semibold text-gray-300 mb-1 text-xs">Map will be added soon</h4>
                  <p className="text-gray-500 text-[10px] max-w-[180px]">
                    Interactive map embedding shortly
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Map (Shown below image on < sm) */}
          <div className="sm:hidden mt-4 w-full h-[200px] rounded-2xl overflow-hidden border border-white/10 shadow-lg bg-navy-dark/80 relative">
            {mapUrl ? (
              <iframe
                src={mapUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0"
                title={`Map of ${state.name}`}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-center p-6">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-3">
                  <Map size={24} className="text-gray-500" />
                </div>
                <h4 className="font-bold text-gray-300 mb-1 text-sm">Map will be added soon</h4>
                <p className="text-gray-500 text-xs max-w-[200px]">
                  Interactive map will be embedded shortly
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* ── Title section ── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.2}
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
          custom={0.25}
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
};

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
      value: state?.coords && typeof state.coords === 'object' && state.coords.lat 
        ? `${Number(state.coords.lat).toFixed(2)}°N, ${Number(state.coords.lng).toFixed(2)}°E` 
        : 'Location coords unavailable',
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

const toSlug = (str) => str ? String(str).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') : '';

const resolveDisplayImage = (img) => {
  return resolveImageUrl(img);
};

const KBDestinationCard = ({ d, stateId, onClick }) => {
  // Prioritize MongoDB image field, then fall back to static generic image
  const mongoImg = resolveDisplayImage(d.image);
  const defaultImg = mongoImg || FALLBACK_IMG;

  const [imgSrc, setImgSrc] = React.useState(defaultImg);
  const [hasError, setHasError] = React.useState(false);

  // Re-sync if the destination object changes (e.g. after edit)
  React.useEffect(() => {
    const fresh = resolveDisplayImage(d.image) || FALLBACK_IMG;
    setImgSrc(fresh);
    setHasError(false);
  }, [d]);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(FALLBACK_IMG);
    }
  };

  return (
    <div 
      onClick={onClick}
      className={`glass rounded-xl overflow-hidden group flex flex-col h-full ${onClick ? 'cursor-pointer hover:border-india-orange/30 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-india-orange/10' : ''}`}
    >
      {/* Image */}
      <div className="relative h-36 overflow-hidden shrink-0">
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
      <div className="p-4 flex flex-col flex-1">
        <h4 className="font-bold text-sm mb-1">{d.name}</h4>
        <p className="text-gray-500 text-[11px] mb-2">{d.location || d.district || ''}</p>
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
  // Prioritize MongoDB image field, then fall back to static JSON lookup
  const mongoImg = resolveDisplayImage(dest.image);
  const defaultImg = mongoImg || resolveDestImage(dest, stateId);
  const [imgSrc, setImgSrc] = React.useState(defaultImg || FALLBACK_IMG);
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
              <h2 className="text-3xl sm:text-4xl font-bold mb-3">{dest.name || 'Unknown Destination'}</h2>
              
              {/* Enhanced Location Rendering with new fields */}
              {(dest.location || dest.district || dest.city) && (
                <p className="flex items-center gap-2 text-gray-400 text-sm mb-4">
                  <MapPin size={16} className="text-india-orange shrink-0" /> 
                  {dest.city ? `${dest.city}` : ''}
                  {dest.city && dest.district ? ', ' : ''}
                  {dest.district ? `${dest.district} District` : ''}
                  {!dest.city && !dest.district && dest.location ? dest.location : ''}
                </p>
              )}
              
              {dest.address && (
                <p className="text-gray-400 text-sm italic mb-4">
                  <span className="font-semibold text-gray-300">Address: </span>{dest.address}
                </p>
              )}
              
              <p className="text-gray-300 leading-relaxed mb-6">{dest.description || 'No description available for this destination.'}</p>
              
              {dest.whyFamous && (
                <div className="bg-navy-dark/50 rounded-xl p-5 border-l-4 border-india-orange mb-4">
                  <h4 className="text-sm font-bold text-india-orange mb-1">Famous For</h4>
                  <p className="text-gray-300 text-sm leading-relaxed">{dest.whyFamous}</p>
                </div>
              )}
            </div>

            {/* Right Map */}
            <div className="w-full bg-navy-dark rounded-2xl overflow-hidden h-64 sm:h-80 lg:h-[400px] border border-gray-800 relative flex flex-col items-center justify-center">
              {dest.mapEmbedUrl ? (
                <iframe 
                  src={typeof dest.mapEmbedUrl === 'string' && dest.mapEmbedUrl.match(/src=["']([^"']+)["']/) ? dest.mapEmbedUrl.match(/src=["']([^"']+)["']/)[1] : dest.mapEmbedUrl} 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen="" 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0 z-0"
                  title={`Map of ${dest.name || 'Destination'}`}
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

const KBTopDestinations = ({ data, stateId, additionalDestinations = [] }) => {
  const [showAll, setShowAll] = React.useState(false);
  const [selectedDest, setSelectedDest] = React.useState(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [exactSelection, setExactSelection] = React.useState(null);
  const [isFocused, setIsFocused] = React.useState(false);
  const [highlightIdx, setHighlightIdx] = React.useState(-1);
  const inputRef = React.useRef(null);
  const dropdownRef = React.useRef(null);

  const kbDests = data?.topDestinations || [];

  // Deduplicate against KB top destinations safely
  const kbNames = new Set(kbDests.map(d => toSlug(d.name || '')));
  const uniqueAdditional = additionalDestinations.filter(d => !kbNames.has(toSlug(d.name || '')));

  const allDests = [...kbDests, ...uniqueAdditional];

  // Search filter logic
  const isSearching = searchQuery.trim().length > 0;
  const q = searchQuery.toLowerCase().trim();
  const filteredDests = isSearching
    ? (exactSelection
        ? allDests.filter(d => d.name === exactSelection)
        : allDests.filter(d =>
            (d.name || '').toLowerCase().includes(q) ||
            (d.description || '').toLowerCase().includes(q) ||
            (d.location || '').toLowerCase().includes(q) ||
            (d.district || '').toLowerCase().includes(q) ||
            (d.whyFamous || '').toLowerCase().includes(q) ||
            String(d.category || '').toLowerCase().includes(q)
          )
      )
    : allDests;

  // Suggestion list (top 5 name matches for dropdown)
  const suggestions = isSearching
    ? allDests
        .filter(d => (d.name || '').toLowerCase().includes(q))
        .slice(0, 5)
    : [];

  // Popular picks (shown when focused but not typing)
  const popularPicks = allDests
    .filter(d => d.rating >= 4 || d.whyFamous)
    .slice(0, 4);

  const showDropdown = isFocused && (suggestions.length > 0 || (!isSearching && popularPicks.length > 0));

  // When searching, show all results; when not, respect showAll toggle
  const dests = isSearching ? filteredDests : (showAll ? allDests : allDests.slice(0, 6));

  // Keyboard navigation
  const dropdownItems = isSearching ? suggestions : popularPicks;
  const handleKeyDown = (e) => {
    if (!showDropdown) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightIdx(prev => (prev < dropdownItems.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightIdx(prev => (prev > 0 ? prev - 1 : dropdownItems.length - 1));
    } else if (e.key === 'Enter' && highlightIdx >= 0 && highlightIdx < dropdownItems.length) {
      e.preventDefault();
      setSearchQuery(dropdownItems[highlightIdx].name);
      setExactSelection(dropdownItems[highlightIdx].name);
      setIsFocused(false);
      setHighlightIdx(-1);
      inputRef.current?.blur();
    } else if (e.key === 'Escape') {
      setIsFocused(false);
      setHighlightIdx(-1);
      inputRef.current?.blur();
    }
  };

  // Close dropdown on outside click
  React.useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsFocused(false);
        setHighlightIdx(-1);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Reset highlight when query changes
  React.useEffect(() => { setHighlightIdx(-1); }, [searchQuery]);

  const selectSuggestion = (name) => {
    setSearchQuery(name);
    setExactSelection(name);
    setIsFocused(false);
    setHighlightIdx(-1);
  };

  if (!allDests.length) return null;

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
          {/* Section Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-india-orange/15 flex items-center justify-center">
                <Mountain size={18} className="text-india-orange" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold leading-tight">Places to Explore</h3>
                <p className="text-xs text-gray-500 mt-0.5">{allDests.length} destinations in this state</p>
              </div>
            </div>
            {!isSearching && allDests.length > 6 && showAll && (
              <button
                onClick={() => setShowAll(false)}
                className="text-sm font-semibold text-india-orange hover:text-white transition-colors"
              >
                Hide Destinations
              </button>
            )}
          </div>

          {/* ── Premium Destination Search ── */}
          <div className="mb-10 max-w-lg" ref={dropdownRef}>
            <div className={`relative transition-all duration-300 ${
              isFocused
                ? 'ring-1 ring-india-orange/30 shadow-[0_0_20px_rgba(249,115,22,0.08)]'
                : ''
            } rounded-2xl`}>
              {/* Glow accent */}
              {isFocused && (
                <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-india-orange/20 via-transparent to-india-orange/10 blur-sm pointer-events-none" />
              )}

              <div className="relative flex items-center">
                {/* Search icon */}
                <div className={`absolute left-4 transition-colors duration-200 ${
                  isFocused ? 'text-india-orange' : 'text-gray-500'
                }`}>
                  <Search size={18} />
                </div>

                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search temples, lakes, waterfalls..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setExactSelection(null);
                  }}
                  onFocus={() => setIsFocused(true)}
                  onKeyDown={handleKeyDown}
                  className="w-full bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] rounded-2xl py-3.5 pl-12 pr-12 text-white text-sm placeholder-gray-500/80 focus:outline-none focus:bg-white/[0.07] focus:border-transparent transition-all duration-300 font-medium tracking-wide"
                />

                {/* Clear / result count */}
                <div className="absolute right-3 flex items-center gap-2">
                  {isSearching && (
                    <span className="text-[10px] font-bold tracking-wider uppercase text-india-orange/70 bg-india-orange/10 px-2 py-0.5 rounded-full whitespace-nowrap">
                      {filteredDests.length} found
                    </span>
                  )}
                  {searchQuery && (
                    <button
                      onClick={() => { 
                        setSearchQuery(''); 
                        setExactSelection(null);
                        inputRef.current?.focus(); 
                      }}
                      className="w-7 h-7 flex items-center justify-center rounded-full text-gray-500 hover:text-white hover:bg-white/10 transition-all duration-200"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>

              {/* ── Dropdown ── */}
              <AnimatePresence>
                {showDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-0 right-0 top-full mt-2 z-40 bg-[#0d1b2a]/95 backdrop-blur-2xl border border-white/[0.08] rounded-2xl shadow-2xl shadow-black/40 overflow-hidden"
                  >
                    {/* Dropdown header */}
                    <div className="px-4 pt-3 pb-2 border-b border-white/5">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 flex items-center gap-1.5">
                        {isSearching ? (
                          <><Search size={10} /> Suggestions</>
                        ) : (
                          <><Sparkles size={10} className="text-india-orange/60" /> Popular in this state</>
                        )}
                      </p>
                    </div>

                    {/* Dropdown items */}
                    <div className="py-1 max-h-64 overflow-y-auto custom-scrollbar">
                      {dropdownItems.map((d, idx) => {
                        const uniqueKey = d._id || d.id || `${d.name}-${idx}`;
                        return (
                          <button
                            key={uniqueKey}
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => selectSuggestion(d.name)}
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
                              {d.name}
                            </p>
                            <p className="text-[11px] text-gray-600 truncate">
                              {d.district || d.location || 'Destination'}
                            </p>
                          </div>
                          {highlightIdx === idx && (
                            <ChevronRight size={14} className="text-india-orange/60 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                    </div>

                    {/* Keyboard hint */}
                    <div className="px-4 py-2 border-t border-white/5 flex items-center gap-3">
                      <span className="text-[10px] text-gray-600">↑↓ navigate</span>
                      <span className="text-[10px] text-gray-600">↵ select</span>
                      <span className="text-[10px] text-gray-600">esc close</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* ── Results / Empty State ── */}
          {isSearching && filteredDests.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20 rounded-3xl bg-gradient-to-b from-white/[0.02] to-transparent border border-white/5"
            >
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-5">
                <Search size={28} className="text-gray-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-300 mb-2">No destinations found</h4>
              <p className="text-gray-500 text-sm max-w-sm mx-auto leading-relaxed">
                We couldn't find any places matching "<span className="text-gray-300 font-medium">{searchQuery}</span>".
                Try a broader keyword or{' '}
                <button onClick={() => setSearchQuery('')} className="text-india-orange hover:underline font-medium">
                  browse all destinations
                </button>.
              </p>
            </motion.div>
          ) : (
            <>
              <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <AnimatePresence>
                  {dests.map((d, idx) => {
                    const uniqueKey = d._id || d.id || `${d.name}-${idx}`;
                    return (
                      <motion.div
                        key={uniqueKey}
                        layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.4, delay: idx >= 6 ? (idx - 6) * 0.05 : 0 }}
                    >
                        <KBDestinationCard d={d} stateId={stateId} onClick={() => setSelectedDest(d)} />
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </motion.div>

              {!isSearching && allDests.length > 6 && !showAll && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-8 text-center flex justify-center"
                >
                  <button
                    onClick={() => setShowAll(true)}
                    className="btn-outline inline-flex items-center gap-2 text-sm text-india-white group"
                  >
                    View More Destinations
                    <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </motion.div>
              )}
            </>
          )}
        </ScrollReveal>
      </div>
    </section>
  );
};



/* ═══════════════════════════════════════════════════════
   4. HIDDEN GEMS
   ═══════════════════════════════════════════════════════ */
const HiddenGemsSection = ({ stateSlug, stateName }) => {
  const { data: hiddenGems } = useApiData('/hidden-gems');
  
  const toSlug = (str) => String(str).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const gems = (hiddenGems || []).filter((g) => g.state === stateSlug || (g.state ? toSlug(g.state) === stateSlug : false));

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
  const { data: state, loading: stateLoading } = useApiData(`/states/${stateSlug}`);
  const { data: allDests } = useApiData('/destinations');
  
  const toSlug = (str) => String(str).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const dbDestinations = (allDests || []).filter(d => 
    d.state === stateSlug || (d.state ? toSlug(d.state) === stateSlug : false)
  );

  if (stateLoading) {
    return (
      <div className="min-h-screen pt-32 pb-14 section-padding text-center">
        <div className="w-12 h-12 border-4 border-india-orange/30 border-t-india-orange rounded-full animate-spin mx-auto mb-6"></div>
        <p className="text-gray-400">Loading state details...</p>
      </div>
    );
  }

  if (!state) return <StateNotFound slug={stateSlug} />;

  const kb = state; // Unified API document

  return (
    <>
      <HeroBanner state={state} />
      <Overview state={state} data={kb} />
      <KBTopDestinations data={kb} stateId={state.id || state.slug || stateSlug} additionalDestinations={dbDestinations} />
      <HiddenGemsSection stateSlug={state.id || state.slug || stateSlug} stateName={state.name} />
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
