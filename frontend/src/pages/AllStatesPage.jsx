import { Link } from 'react-router-dom';
import SectionHeader from '../components/layout/SectionHeader';
import StateCard from '../components/cards/StateCard';
import { statesData } from '../data/statesData';

const AllStatesPage = () => {
  const onlyStates = statesData.filter((s) => s.type === 'state');
  const onlyUTs = statesData.filter((s) => s.type === 'ut');

  return (
    <section className="py-16 sm:py-24 section-padding">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          title="Explore By State"
          subtitle="Discover the unique charm each Indian state has to offer."
        />

        {/* 28 States Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-6 text-india-white">28 States</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {onlyStates.map((state) => (
              <StateCard key={state.id} state={state} variant="compact" />
            ))}
          </div>
        </div>

        {/* Union Territories Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-6 text-india-white">Union Territories</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {onlyUTs.map((state) => (
              <StateCard key={state.id} state={state} variant="compact" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AllStatesPage;
