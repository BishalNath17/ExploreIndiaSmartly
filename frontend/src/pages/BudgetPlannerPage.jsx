import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calculator,
  Users,
  CalendarDays,
  Sparkles,
  Bed,
  UtensilsCrossed,
  Bus,
  Camera,
  ShoppingBag,
  ChevronDown,
  TrendingUp,
  MapPin,
  RotateCcw,
} from 'lucide-react';

import {
  calculateBudget,
  CATEGORY_LABELS,
  STYLE_OPTIONS,
  formatINR,
} from '../services/api';
import states from '../data/states';
import SectionHeader from '../components/layout/SectionHeader';
import ScrollReveal from '../components/ui/ScrollReveal';

/* ── Icon map for categories ────────────────── */
const CATEGORY_ICONS = {
  stay: Bed,
  food: UtensilsCrossed,
  transport: Bus,
  sightseeing: Camera,
  extras: ShoppingBag,
};

/* ── Colour accents for pie-chart-like bars ── */
const CATEGORY_COLORS = {
  stay: 'bg-orange-500',
  food: 'bg-emerald-500',
  transport: 'bg-sky-500',
  sightseeing: 'bg-violet-500',
  extras: 'bg-pink-500',
};
const CATEGORY_BG = {
  stay: 'bg-orange-500/15 text-orange-400',
  food: 'bg-emerald-500/15 text-emerald-400',
  transport: 'bg-sky-500/15 text-sky-400',
  sightseeing: 'bg-violet-500/15 text-violet-400',
  extras: 'bg-pink-500/15 text-pink-400',
};

/* ═══════════════════════════════════════════════════════
   FORM: DESTINATION SELECTOR
   ═══════════════════════════════════════════════════════ */
const DestinationSelect = ({ value, onChange }) => (
  <div>
    <label htmlFor="bp-state" className="block text-sm font-medium mb-2">
      <MapPin size={14} className="inline text-india-orange mr-1 -mt-0.5" />
      Destination
    </label>
    <div className="relative">
      <select
        id="bp-state"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none bg-white/5 border border-white/15 rounded-xl px-4 py-3 pr-10
                   text-sm text-white focus:outline-none focus:border-india-orange/60 transition-colors cursor-pointer"
      >
        <option value="">Select a state or UT</option>
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

/* ═══════════════════════════════════════════════════════
   FORM: STYLE SELECTOR
   ═══════════════════════════════════════════════════════ */
const StyleSelector = ({ value, onChange }) => (
  <div>
    <label className="block text-sm font-medium mb-2">
      <Sparkles size={14} className="inline text-india-orange mr-1 -mt-0.5" />
      Travel Style
    </label>
    <div className="grid grid-cols-3 gap-3">
      {STYLE_OPTIONS.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`rounded-xl border p-3 sm:p-4 text-center transition-all duration-200 cursor-pointer
              ${active
                ? 'border-india-orange bg-india-orange/15 shadow-lg shadow-india-orange/10'
                : 'border-white/15 bg-white/5 hover:bg-white/10'}`}
          >
            <span className="text-xl block mb-1">{opt.emoji}</span>
            <span className="text-sm font-bold block">{opt.label}</span>
            <span className="text-[10px] text-gray-400 leading-tight hidden sm:block mt-1">
              {opt.description}
            </span>
          </button>
        );
      })}
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════
   FORM: NUMBER INPUT
   ═══════════════════════════════════════════════════════ */
const NumberInput = ({ id, label, icon: Icon, value, onChange, min = 1, max = 30 }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium mb-2">
      <Icon size={14} className="inline text-india-orange mr-1 -mt-0.5" />
      {label}
    </label>
    <input
      id={id}
      type="number"
      min={min}
      max={max}
      value={value}
      onChange={(e) => onChange(Math.max(min, Math.min(max, Number(e.target.value) || min)))}
      className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3
                 text-sm text-white focus:outline-none focus:border-india-orange/60 transition-colors"
    />
  </div>
);

/* ═══════════════════════════════════════════════════════
   RESULTS: BREAKDOWN TABLE
   ═══════════════════════════════════════════════════════ */
const BreakdownCard = ({ result }) => (
  <div className="glass rounded-3xl p-6 sm:p-8">
    <h3 className="text-lg sm:text-xl font-bold mb-6 flex items-center gap-2">
      <TrendingUp size={20} className="text-india-orange" />
      Cost Breakdown
      <span className="ml-auto text-xs text-gray-500 font-normal">per person / day</span>
    </h3>

    <div className="space-y-4">
      {result.categories.map((cat) => {
        const Icon = CATEGORY_ICONS[cat];
        const pct = Math.round((result.perDay[cat] / result.perDayTotal) * 100);
        return (
          <div key={cat}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="flex items-center gap-2 text-sm">
                <span className={`w-7 h-7 rounded-lg flex items-center justify-center ${CATEGORY_BG[cat]}`}>
                  <Icon size={14} />
                </span>
                {CATEGORY_LABELS[cat]}
              </span>
              <span className="text-sm font-bold">{formatINR(result.perDay[cat])}</span>
            </div>
            {/* Progress bar */}
            <div className="h-2 rounded-full bg-white/5 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className={`h-full rounded-full ${CATEGORY_COLORS[cat]}`}
              />
            </div>
          </div>
        );
      })}
    </div>

    {/* Per-day total */}
    <div className="mt-6 pt-5 border-t border-white/10 flex justify-between items-center">
      <span className="text-sm text-gray-400">Per Person / Day</span>
      <span className="text-lg font-bold text-india-orange">{formatINR(result.perDayTotal)}</span>
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════
   RESULTS: SUMMARY CARDS
   ═══════════════════════════════════════════════════════ */
const SummaryCards = ({ result, stateName }) => {
  const cards = [
    { label: 'Per Person Total', value: formatINR(result.perPersonTotal), sub: `${result.days} day${result.days > 1 ? 's' : ''}` },
    { label: 'Grand Total', value: formatINR(result.grandTotal), sub: `${result.travelers} traveller${result.travelers > 1 ? 's' : ''}`, highlight: true },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {cards.map((c) => (
        <div
          key={c.label}
          className={`rounded-2xl p-6 sm:p-8 text-center ${
            c.highlight
              ? 'bg-gradient-to-br from-india-orange/20 to-india-orange/5 border border-india-orange/30'
              : 'glass'
          }`}
        >
          <span className="text-[11px] text-gray-400 uppercase tracking-wider block mb-2">
            {c.label}
          </span>
          <span className={`text-2xl sm:text-3xl font-bold block ${c.highlight ? 'text-india-orange' : ''}`}>
            {c.value}
          </span>
          <span className="text-xs text-gray-500 mt-1 block">{c.sub}</span>
        </div>
      ))}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════
   RESULTS: PER-CATEGORY TOTALS
   ═══════════════════════════════════════════════════════ */
const CategoryTotals = ({ result }) => (
  <div className="glass rounded-3xl p-6 sm:p-8">
    <h3 className="text-lg font-bold mb-5">Total by Category</h3>
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
      {result.categories.map((cat) => {
        const Icon = CATEGORY_ICONS[cat];
        return (
          <div key={cat} className="rounded-xl bg-white/5 p-4 text-center">
            <span className={`w-9 h-9 rounded-lg flex items-center justify-center mx-auto mb-2 ${CATEGORY_BG[cat]}`}>
              <Icon size={16} />
            </span>
            <span className="text-xs text-gray-500 block mb-1">{CATEGORY_LABELS[cat]}</span>
            <span className="text-sm font-bold block">{formatINR(result.totalPerPerson[cat] * result.travelers)}</span>
          </div>
        );
      })}
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════
   PAGE COMPOSITION
   ═══════════════════════════════════════════════════════ */
const BudgetPlannerPage = () => {
  const [stateSlug, setStateSlug] = useState('');
  const [travelers, setTravelers] = useState(2);
  const [days, setDays] = useState(3);
  const [style, setStyle] = useState('standard');
  const [showResults, setShowResults] = useState(false);

  const selectedState = states.find((s) => s.slug === stateSlug);

  const result = useMemo(() => {
    if (!stateSlug) return null;
    return calculateBudget({ stateSlug, days, travelers, style });
  }, [stateSlug, days, travelers, style]);

  const handleCalculate = () => {
    if (stateSlug) setShowResults(true);
  };

  const handleReset = () => {
    setShowResults(false);
    setStateSlug('');
    setTravelers(2);
    setDays(3);
    setStyle('standard');
  };

  return (
    <section className="py-16 sm:py-24 section-padding">
      <div className="max-w-5xl mx-auto">
        <SectionHeader
          title="Budget Planner"
          subtitle="Estimate your trip costs across any Indian state or territory."
        />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* ── LEFT: Form ── */}
          <div className="lg:col-span-2">
            <div className="glass rounded-3xl p-6 sm:p-8 space-y-6 sticky top-24">
              <DestinationSelect value={stateSlug} onChange={(v) => { setStateSlug(v); setShowResults(false); }} />
              <StyleSelector value={style} onChange={(v) => { setStyle(v); setShowResults(false); }} />

              <div className="grid grid-cols-2 gap-4">
                <NumberInput id="bp-travelers" label="Travellers" icon={Users} value={travelers}
                  onChange={(v) => { setTravelers(v); setShowResults(false); }} max={20} />
                <NumberInput id="bp-days" label="Days" icon={CalendarDays} value={days}
                  onChange={(v) => { setDays(v); setShowResults(false); }} max={30} />
              </div>

              <button
                onClick={handleCalculate}
                disabled={!stateSlug}
                className={`w-full py-3.5 rounded-xl font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2
                  ${stateSlug
                    ? 'bg-india-orange text-white hover:bg-orange-600 hover:scale-[1.02] active:scale-[0.98] shadow-lg cursor-pointer'
                    : 'bg-white/10 text-gray-500 cursor-not-allowed'}`}
              >
                <Calculator size={16} />
                {showResults ? 'Recalculate' : 'Calculate Budget'}
              </button>

              {showResults && (
                <button onClick={handleReset}
                  className="w-full py-2.5 rounded-xl text-sm text-gray-400 hover:text-white border border-white/10 hover:bg-white/10 transition-all flex items-center justify-center gap-2 cursor-pointer">
                  <RotateCcw size={14} /> Reset
                </button>
              )}
            </div>
          </div>

          {/* ── RIGHT: Results ── */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {showResults && result ? (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-6"
                >
                  {/* Title chip */}
                  {selectedState && (
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-india-orange text-sm font-medium">
                        {selectedState.name}
                      </span>
                      <span className="text-gray-600">•</span>
                      <span className="text-gray-400 text-sm capitalize">{style} style</span>
                      <span className="text-gray-600">•</span>
                      <span className="text-gray-400 text-sm">{days}d / {travelers}p</span>
                    </div>
                  )}

                  <SummaryCards result={result} stateName={selectedState?.name} />
                  <BreakdownCard result={result} />
                  <CategoryTotals result={result} />

                  {/* Disclaimer */}
                  <p className="text-[11px] text-gray-600 text-center leading-relaxed pt-2">
                    * Estimates are approximate and based on average costs. Actual expenses
                    may vary based on season, specific location, and personal preferences.
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="glass rounded-3xl p-10 sm:p-16 text-center flex flex-col items-center justify-center min-h-[400px]"
                >
                  <div className="w-16 h-16 rounded-2xl bg-india-orange/15 flex items-center justify-center mx-auto mb-6">
                    <Calculator size={28} className="text-india-orange" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Plan Your Budget</h3>
                  <p className="text-gray-400 text-sm max-w-sm">
                    Select a destination, choose your travel style, and hit calculate
                    to see a detailed cost breakdown for your trip.
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

export default BudgetPlannerPage;
