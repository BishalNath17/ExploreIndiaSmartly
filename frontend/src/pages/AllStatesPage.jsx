import { Link } from 'react-router-dom';
import SectionHeader from '../components/layout/SectionHeader';
import StateCard from '../components/cards/StateCard';
import states from '../data/states';

const AllStatesPage = () => (
  <section className="py-16 sm:py-24 section-padding">
    <div className="max-w-6xl mx-auto">
      <SectionHeader
        title="Explore By State"
        subtitle="Discover the unique charm each Indian state has to offer."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {states.map((state) => (
          <StateCard key={state.slug} state={state} variant="compact" />
        ))}
      </div>
    </div>
  </section>
);

export default AllStatesPage;
