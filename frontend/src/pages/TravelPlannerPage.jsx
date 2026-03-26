import { useState, useMemo } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  CalendarDays,
  Sparkles,
  Map,
  ChevronDown,
  Bed,
  UtensilsCrossed,
  Bus,
  RotateCcw,
  Navigation,
} from 'lucide-react';
import { fadeUp } from '../utils/animations';
import states from '../data/states';
import { generateItinerary, formatINR, STYLE_OPTIONS } from '../services/api';
import SectionHeader from '../components/SectionHeader';
import ScrollReveal from '../components/ScrollReveal';

/* ═══════════════════════════════════════════════════════
   FORM: INPUT COMPONENTS
   ═══════════════════════════════════════════════════════ */
const StateSelect = ({ value, onChange }) => (
  <div>
    <label htmlFor="tp-state" className="block text-sm font-medium mb-2">
      <MapPin size={14} className="inline text-india-orange mr-1 -mt-0.5" />
      Select State
    </label>
    <div className="relative">
      <select
        id="tp-state"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none bg-white/5 border border-white/15 rounded-xl px-4 py-3 pr-10
                   text-sm text-white focus:outline-none focus:border-india-orange/60 transition-colors cursor-pointer"
      >
        <option value="">Where to?</option>
        {states.map((s) => (
          <option key={s.slug} value={s.slug}>
            {s.name}
          </option>
        ))}
      </select>
      <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
    </div>
  </div>
);

const DaysSelect = ({ value, onChange }) => (
  <div>
    <label htmlFor="tp-days" className="block text-sm font-medium mb-2">
      <CalendarDays size={14} className="inline text-india-orange mr-1 -mt-0.5" />
      Duration
    </label>
    <div className="relative">
      <select
        id="tp-days"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full appearance-none bg-white/5 border border-white/15 rounded-xl px-4 py-3 pr-10
                   text-sm text-white focus:outline-none focus:border-india-orange/60 transition-colors cursor-pointer"
      >
        {[2, 3, 5, 7, 10, 14].map((d) => (
          <option key={d} value={d}>
            {d} Days
          </option>
        ))}
      </select>
      <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
    </div>
  </div>
);

const StyleTabs = ({ value, onChange }) => (
  <div>
    <label className="block text-sm font-medium mb-2">
      <Sparkles size={14} className="inline text-india-orange mr-1 -mt-0.5" />
      Travel Style
    </label>
    <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
      {STYLE_OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer ${
            value === opt.value
              ? 'bg-india-orange text-white shadow-md'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <span className="mr-1">{opt.emoji}</span> {opt.label}
        </button>
      ))}
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════
   RESULTS: DAY CARD
   ═══════════════════════════════════════════════════════ */
const DayCard = ({ dayData }) => {
  return (
    <div className="relative pl-8 sm:pl-12 pb-10 last:pb-0">
      {/* Timeline track + dot */}
      <div className="absolute left-[11px] sm:left-[23px] top-6 bottom-[-24px] w-px bg-white/10 last:bg-transparent" />
      <div className="absolute left-0 sm:left-3 top-4 w-6 h-6 rounded-full bg-navy border-2 border-india-orange flex items-center justify-center shadow-lg shadow-india-orange/20 z-10">
        <span className="w-2 h-2 rounded-full bg-india-orange" />
      </div>

      <div className="glass rounded-2xl p-5 sm:p-7 group hover:bg-white/[0.04] transition-colors">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-white mb-1">
              {dayData.title}
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              {dayData.description}
            </p>
          </div>
          <div className="text-left sm:text-right shrink-0 bg-white/5 sm:bg-transparent px-3 py-2 sm:p-0 rounded-lg block w-max">
            <span className="text-[10px] text-gray-500 uppercase tracking-wider block mb-0.5">
              Daily Estimate
            </span>
            <span className="text-lg font-bold text-india-orange">
              {formatINR(dayData.costs.total)}
            </span>
          </div>
        </div>

        {/* Suggested Places Image Grid */}
        {dayData.locations.length > 0 && (
          <div className="grid grid-cols-2 gap-3 mb-5">
            {dayData.locations.map((loc, i) => (
              <div key={i} className="relative h-28 sm:h-36 rounded-xl overflow-hidden">
                <img
                  src={loc.image}
                  alt={loc.title || loc.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/20 to-transparent" />
                <div className="absolute bottom-2 left-2 right-2">
                  <span className="text-xs font-bold text-white truncate block">
                    {loc.title || loc.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Cost Breakdown Chips */}
        <div className="flex flex-wrap gap-2 pt-4 border-t border-white/10">
          <div className="flex items-center gap-1.5 bg-orange-500/10 text-orange-400 text-xs px-2.5 py-1.5 rounded-md">
            <Bed size={12} /> Stay: {formatINR(dayData.costs.stay)}
          </div>
          <div className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 text-xs px-2.5 py-1.5 rounded-md">
            <UtensilsCrossed size={12} /> Food: {formatINR(dayData.costs.food)}
          </div>
          <div className="flex items-center gap-1.5 bg-sky-500/10 text-sky-400 text-xs px-2.5 py-1.5 rounded-md">
            <Bus size={12} /> Travel: {formatINR(dayData.costs.transport)}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════
   PAGE COMPOSITION
   ═══════════════════════════════════════════════════════ */
const TravelPlannerPage = () => {
  const [stateSlug, setStateSlug] = useState('');
  const [days, setDays] = useState(3);
  const [style, setStyle] = useState('standard');
  const [showPlan, setShowPlan] = useState(false);

  // Memoize itinerary generation
  const itinerary = useMemo(() => {
    if (!stateSlug) return [];
    return generateItinerary({ stateSlug, days, style });
  }, [stateSlug, days, style]);

  const selectedStateName = states.find((s) => s.slug === stateSlug)?.name || '';

  const handleGenerate = () => {
    if (stateSlug) setShowPlan(true);
  };

  const handleReset = () => {
    setShowPlan(false);
    setStateSlug('');
    setDays(3);
    setStyle('standard');
  };

  return (
    <section className="py-16 sm:py-24 section-padding">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          title="Plan Your Budget & Days"
          subtitle="Generate a smart, day-wise itinerary instantly."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* ── LEFT: Sticky Form ── */}
          <div className="lg:col-span-4">
            <div className="glass rounded-3xl p-6 sm:p-8 space-y-6 sticky top-24">
              <StateSelect value={stateSlug} onChange={(v) => { setStateSlug(v); setShowPlan(false); }} />
              <DaysSelect value={days} onChange={(v) => { setDays(v); setShowPlan(false); }} />
              <StyleTabs value={style} onChange={(v) => { setStyle(v); setShowPlan(false); }} />

              <button
                onClick={handleGenerate}
                disabled={!stateSlug}
                className={`w-full py-3.5 rounded-xl font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2
                  ${stateSlug
                    ? 'bg-india-orange text-white hover:bg-orange-600 hover:scale-[1.02] shadow-lg cursor-pointer'
                    : 'bg-white/10 text-gray-500 cursor-not-allowed'}`}
              >
                <Navigation size={16} />
                {showPlan ? 'Regenerate Plan' : 'Generate Travel Plan'}
              </button>

              {showPlan && (
                <button
                  onClick={handleReset}
                  className="w-full py-2.5 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RotateCcw size={14} /> Start Over
                </button>
              )}
            </div>
          </div>

          {/* ── RIGHT: Results Timeline ── */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              {showPlan && itinerary.length > 0 ? (
                <motion.div
                  key="timeline"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="mb-8 p-5 rounded-2xl bg-gradient-to-r from-india-orange/10 to-transparent border border-india-orange/20 flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-white mb-1">
                        {days} Days in {selectedStateName}
                      </h2>
                      <p className="text-sm text-gray-400 capitalize">{style} Style Iterinary</p>
                    </div>
                  </div>

                  <div className="py-2">
                    {itinerary.map((dayData, i) => (
                      <motion.div
                        key={dayData.day}
                        variants={fadeUp}
                        initial="hidden"
                        animate="visible"
                        custom={i * 0.15}
                      >
                        <DayCard dayData={dayData} />
                      </motion.div>
                    ))}
                  </div>

                  <p className="text-[11px] text-gray-500 text-center mt-8">
                    * This is a suggested itinerary generated using average travel times 
                    and costs. Always verify local timings before travel.
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="glass rounded-3xl p-10 sm:p-20 text-center flex flex-col items-center justify-center min-h-[500px]"
                >
                  <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                    <Map size={32} className="text-gray-500" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white">Your Itinerary Awaits</h3>
                  <p className="text-gray-400 text-sm max-w-sm leading-relaxed">
                    Select a state and your trip duration on the left to instantly generate a 
                    day-by-day travel plan complete with daily budget estimates.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TravelPlannerPage;
