import ScrollReveal from '../ui/ScrollReveal';

/**
 * Reusable gradient hero banner with badge, title, highlighted word, and subtitle.
 *
 * @param {{ text: string, icon: LucideIcon }} badge
 * @param {string}   title          — Full title text
 * @param {string}   highlightWord  — Word(s) within title to color as india-orange
 * @param {string}   subtitle
 * @param {string}   gradientFrom   — Tailwind gradient-from color (e.g. 'from-india-orange/10')
 * @param {string}   badgeColor     — Badge text/border color class (default: india-orange)
 */
const PageHero = ({
  badge,
  title,
  highlightWord,
  subtitle,
  gradientFrom = 'from-india-orange/10',
  badgeColor = 'india-orange',
}) => {
  const BadgeIcon = badge?.icon;

  // Split title around the highlighted word
  const renderTitle = () => {
    if (!highlightWord) return title;
    const idx = title.indexOf(highlightWord);
    if (idx === -1) return title;
    const before = title.slice(0, idx);
    const after = title.slice(idx + highlightWord.length);
    return (
      <>
        {before}
        <span className="text-india-orange">{highlightWord}</span>
        {after}
      </>
    );
  };

  return (
    <section className="relative py-20 sm:py-28 section-padding overflow-hidden">
      {/* Gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradientFrom} via-navy to-navy-dark z-0`} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-india-orange/5 blur-3xl z-0" />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {badge && (
          <ScrollReveal>
            <div className={`inline-flex items-center gap-2 bg-${badgeColor}/15 border border-${badgeColor}/20 rounded-full px-4 py-1.5 mb-6`}>
              {BadgeIcon && <BadgeIcon size={14} className={`text-${badgeColor}`} />}
              <span className={`text-xs font-bold uppercase tracking-wider text-${badgeColor}`}>
                {badge.text}
              </span>
            </div>
          </ScrollReveal>
        )}

        <ScrollReveal delay={0.1}>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-5">
            {renderTitle()}
          </h1>
        </ScrollReveal>

        {subtitle && (
          <ScrollReveal delay={0.2}>
            <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto">
              {subtitle}
            </p>
          </ScrollReveal>
        )}
      </div>
    </section>
  );
};

export default PageHero;
