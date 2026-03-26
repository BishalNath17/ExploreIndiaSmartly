import { useState } from 'react';
import { Shield, Phone, ChevronDown, ChevronUp } from 'lucide-react';
import SectionHeader from '../components/layout/SectionHeader';
import ScrollReveal from '../components/ui/ScrollReveal';
import safetyTips from '../data/safetyTips';
import PageHero from '../components/layout/PageHero';


/* ═══════════════════════════════════════════════════════
   EMERGENCY CARD (highlighted)
   ═══════════════════════════════════════════════════════ */
const EmergencyCard = () => (
  <section className="section-padding pb-0">
    <div className="max-w-5xl mx-auto">
      <ScrollReveal>
        <div className="glass rounded-3xl p-6 sm:p-8 border border-red-500/20 bg-red-500/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-red-500/10 blur-2xl -mr-10 -mt-10" />

          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-red-500/20 flex items-center justify-center shrink-0">
              <Phone size={24} className="text-red-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-2 text-red-300">Emergency Contacts</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { label: 'Police', number: '100' },
                  { label: 'Ambulance', number: '108' },
                  { label: 'Fire', number: '101' },
                  { label: 'Tourist Helpline', number: '1363' },
                  { label: 'Women Helpline', number: '1091' },
                  { label: 'Railway Enquiry', number: '139' },
                ].map((item) => (
                  <div key={item.number} className="bg-white/5 rounded-xl px-3 py-2 text-center">
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider">{item.label}</p>
                    <p className="text-lg font-bold text-white">{item.number}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </div>
  </section>
);

/* ═══════════════════════════════════════════════════════
   CATEGORY SECTION (collapsible on mobile)
   ═══════════════════════════════════════════════════════ */
const CategorySection = ({ category, index }) => {
  const [isOpen, setIsOpen] = useState(true);
  const CategoryIcon = category.categoryIcon;

  return (
    <ScrollReveal delay={index * 0.08}>
      <div className="glass rounded-3xl overflow-hidden">
        {/* Category Header */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center gap-4 p-6 sm:p-8 text-left cursor-pointer hover:bg-white/5 transition-colors"
        >
          <div className="w-12 h-12 rounded-2xl bg-india-orange/15 flex items-center justify-center shrink-0">
            <CategoryIcon size={22} className="text-india-orange" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl sm:text-2xl font-bold">{category.category}</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {category.tips.length} {category.tips.length === 1 ? 'tip' : 'tips'}
            </p>
          </div>
          {isOpen ? (
            <ChevronUp size={20} className="text-gray-500" />
          ) : (
            <ChevronDown size={20} className="text-gray-500" />
          )}
        </button>

        {/* Tips List */}
        {isOpen && (
          <div className="px-6 sm:px-8 pb-6 sm:pb-8 space-y-3">
            {category.tips.map((tip, i) => {
              const TipIcon = tip.icon;
              return (
                <div
                  key={i}
                  className="flex items-start gap-4 bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 rounded-2xl p-5 transition-colors"
                >
                  <div className="shrink-0 w-9 h-9 rounded-xl bg-india-orange/10 flex items-center justify-center mt-0.5">
                    <TipIcon size={16} className="text-india-orange" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold mb-1">{tip.title}</h4>
                    <p className="text-gray-400 text-sm leading-relaxed">{tip.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </ScrollReveal>
  );
};

/* ═══════════════════════════════════════════════════════
   PAGE COMPOSITION
   ═══════════════════════════════════════════════════════ */
const SafetyTipsPage = () => (
  <>
    <PageHero
      badge={{ text: 'Travel Smart', icon: Shield }}
      badgeColor="red-400"
      title="Safety Tips & Advice"
      highlightWord="Tips"
      subtitle="India is an incredible destination, but smart preparation makes every trip safer. Bookmark this page before you go."
      gradientFrom="from-red-900/15"
    />
    <EmergencyCard />

    <section className="py-12 sm:py-16 section-padding">
      <div className="max-w-5xl mx-auto space-y-6">
        {safetyTips.map((category, i) => (
          <CategorySection key={category.category} category={category} index={i} />
        ))}
      </div>
    </section>

    {/* Bottom CTA */}
    <section className="pb-16 sm:pb-20 section-padding">
      <div className="max-w-3xl mx-auto">
        <ScrollReveal>
          <div className="glass rounded-3xl p-8 sm:p-12 text-center">
            <Shield size={32} className="text-india-orange mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-3">Travel Insurance Reminder</h3>
            <p className="text-gray-400 text-sm max-w-lg mx-auto">
              No matter how well you prepare, accidents can happen. Always carry comprehensive
              travel insurance that covers medical emergencies, theft, and trip cancellations.
              It&apos;s a small investment for invaluable peace of mind.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  </>
);

export default SafetyTipsPage;
