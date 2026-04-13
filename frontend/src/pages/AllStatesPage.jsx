import { useState } from 'react';
import { Search } from 'lucide-react';
import SectionHeader from '../components/layout/SectionHeader';
import StateCard from '../components/cards/StateCard';
import BackButton from '../components/ui/BackButton';
import useApiData from '../hooks/useApiData';

const AllStatesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { data: statesData, loading } = useApiData('/states');
  const allStates = statesData || [];
  
  // Clean filtering by both search query and type, ignoring case
  const filteredStates = allStates.filter((s) => {
    const q = searchQuery.toLowerCase();
    const nameMatch = (s.name || '').toLowerCase().includes(q);
    const idMatch = (s.id || '').toLowerCase().includes(q);
    return nameMatch || idMatch;
  });

  const onlyStates = filteredStates.filter((s) => (s.type || '').toLowerCase() === 'state');
  const onlyUTs = filteredStates.filter((s) => (s.type || '').toLowerCase() === 'ut');

  return (
    <section className="pt-24 pb-16 sm:pt-32 sm:pb-24 section-padding">
      <div className="max-w-6xl mx-auto">
        <BackButton fallback="/" label="Back to Home" className="mb-8" />
        <SectionHeader
          title="Explore By State"
          subtitle="Discover the unique charm each Indian state has to offer."
        />

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-12 relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder="Search for a state or UT..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-india-orange/50 transition-all font-medium"
          />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="rounded-2xl h-32 bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            {/* 28 States Section */}
            {onlyStates.length > 0 && (
              <div className="mb-16">
                <h2 className="text-3xl font-bold mb-6 text-india-white">States</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {onlyStates.map((state) => (
                    <StateCard key={state.id} state={state} variant="compact" />
                  ))}
                </div>
              </div>
            )}

            {/* Union Territories Section */}
            {onlyUTs.length > 0 && (
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-6 text-india-white">Union Territories</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {onlyUTs.map((state) => (
                    <StateCard key={state.id} state={state} variant="compact" />
                  ))}
                </div>
              </div>
            )}

            {onlyStates.length === 0 && onlyUTs.length === 0 && (
              <div className="text-center py-20 text-gray-400">
                <p>No states or union territories found matching "{searchQuery}"</p>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default AllStatesPage;
