import { Link } from 'react-router-dom';
import SectionHeader from '../components/SectionHeader';
import ScrollReveal from '../components/ScrollReveal';
import StateCard from '../components/StateCard';
import states from '../data/states';

const AllStatesPage = () => (
  <section className="py-16 sm:py-24 section-padding">
    <div className="max-w-6xl mx-auto">
      <SectionHeader
        title="Explore By State"
        subtitle="Discover the unique charm each Indian state has to offer."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {states.map((state, i) => (
          <ScrollReveal key={state.slug} delay={i * 0.05}>
            <StateCard state={state} variant="compact" />
          </ScrollReveal>
        ))}
      </div>
    </div>
  </section>
);

export default AllStatesPage;
