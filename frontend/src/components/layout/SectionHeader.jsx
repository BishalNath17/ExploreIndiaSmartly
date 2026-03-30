/**
 * Reusable section heading with title and optional subtitle.
 */
const SectionHeader = ({ title, subtitle, className = '' }) => {
  return (
    <div className={`text-center mb-8 sm:mb-10 ${className}`}>
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
        {title}
      </h2>
      {subtitle && (
        <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionHeader;
