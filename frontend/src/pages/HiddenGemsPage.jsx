import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Gem, MapPin, Filter, Search, ArrowRight } from 'lucide-react';
import SectionHeader from '../components/layout/SectionHeader';
import ScrollReveal from '../components/ui/ScrollReveal';
import useApiData from '../hooks/useApiData';
import PageHero from '../components/layout/PageHero';
import HiddenGemCard from '../components/cards/HiddenGemCard';
import EmptyState from '../components/ui/EmptyState';


/* ═══════════════════════════════════════════════════════
   REGION FILTER BAR
   ═══════════════════════════════════════════════════════ */
const REGIONS = [
  { label: 'All Regions', value: 'all' },
  { label: 'North', value: 'north' },
  { label: 'North-East', value: 'northeast' },
  { label: 'South', value: 'south' },
  { label: 'West', value: 'west' },
  { label: 'East', value: 'east' },
  { label: 'Central', value: 'central' },
  { label: 'Islands', value: 'islands' },
];

const REGION_MAP = {
  north: ['himachal-pradesh', 'uttarakhand', 'ladakh', 'jammu-kashmir', 'punjab', 'haryana', 'delhi', 'uttar-pradesh', 'rajasthan', 'chandigarh'],
  northeast: ['arunachal-pradesh', 'assam', 'meghalaya', 'nagaland', 'manipur', 'mizoram', 'tripura', 'sikkim'],
  south: ['karnataka', 'kerala', 'tamil-nadu', 'andhra-pradesh', 'telangana', 'puducherry'],
  west: ['gujarat', 'maharashtra', 'goa', 'dadra-nagar-haveli-daman-diu'],
  east: ['west-bengal', 'odisha', 'jharkhand', 'bihar', 'chhattisgarh'],
  central: ['madhya-pradesh'],
  islands: ['andaman-nicobar', 'lakshadweep'],
};

const FilterBar = ({ activeRegion, setActiveRegion, searchQuery, setSearchQuery }) => (
  <section className="section-padding pb-6">
    <div className="max-w-6xl mx-auto">
      {/* Search */}
      <div className="relative mb-5 max-w-md mx-auto">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search hidden gems..."
          className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 outline-none focus:border-india-orange/50 transition-colors"
        />
      </div>

      {/* Region pills */}
      <div className="flex flex-wrap justify-center gap-2">
        {REGIONS.map((r) => (
          <button
            key={r.value}
            onClick={() => setActiveRegion(r.value)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
              activeRegion === r.value
                ? 'bg-india-orange text-white shadow-lg shadow-india-orange/25'
                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
            }`}
          >
            {activeRegion === r.value && <Filter size={10} className="inline mr-1 -mt-0.5" />}
            {r.label}
          </button>
        ))}
      </div>
    </div>
  </section>
);


/* ═══════════════════════════════════════════════════════
   PAGE COMPOSITION
   ═══════════════════════════════════════════════════════ */
const HiddenGemsPage = () => {
  const { data: hiddenGems, loading } = useApiData('/hidden-gems');
  const [activeRegion, setActiveRegion] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredGems = useMemo(() => {
    let gems = hiddenGems || [];

    // Region filter
    if (activeRegion !== 'all') {
      const regionSlugs = REGION_MAP[activeRegion] || [];
      gems = gems.filter((g) => regionSlugs.includes(g.state));
    }

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      gems = gems.filter(
        (g) =>
          g.name.toLowerCase().includes(q) ||
          g.location.toLowerCase().includes(q) ||
          g.description.toLowerCase().includes(q)
      );
    }

    return gems;
  }, [activeRegion, searchQuery, hiddenGems]);

  return (
    <>
      <PageHero
        badge={{ text: 'Off the Beaten Path', icon: Gem }}
        badgeColor="india-orange"
        title="Hidden Gems of India"
        highlightWord="Gems"
        subtitle="Beyond the popular circuit lies an India few travellers see — ancient valleys, forgotten temples, pristine islands, and villages untouched by time."
        gradientFrom="from-india-orange/10"
      />
      <FilterBar
        activeRegion={activeRegion}
        setActiveRegion={setActiveRegion}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <section className="py-8 sm:py-12 section-padding">
        <div className="max-w-7xl mx-auto">
          {/* Stats bar */}
          <div className="text-center mb-8">
            <span className="text-sm text-gray-500">
              Showing <span className="text-white font-bold">{filteredGems.length}</span> hidden{' '}
              {filteredGems.length === 1 ? 'gem' : 'gems'}
            </span>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGems.length > 0 ? (
              filteredGems.map((gem) => (
                <HiddenGemCard key={gem.id} gem={gem} linkToState showExplore />
              ))
            ) : (
              <EmptyState icon={Gem} message="No hidden gems match your search. Try a different region or keyword." />
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default HiddenGemsPage;
