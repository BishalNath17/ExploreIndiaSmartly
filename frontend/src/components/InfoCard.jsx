/**
 * Glassmorphism info card with icon circle + label + value.
 * Used by StateDetailsPage and DestinationDetailsPage overviews.
 *
 * @param {import('lucide-react').LucideIcon} icon
 * @param {string} label  — Uppercase descriptor
 * @param {string} value  — Bold display value
 */
const InfoCard = ({ icon: Icon, label, value }) => (
  <div className="glass rounded-2xl p-6 h-full flex flex-col items-start">
    <div className="w-10 h-10 rounded-xl bg-india-orange/15 flex items-center justify-center mb-4">
      <Icon size={20} className="text-india-orange" />
    </div>
    <span className="text-[11px] text-gray-500 uppercase tracking-wider mb-1">
      {label}
    </span>
    <span className="text-base sm:text-lg font-bold">{value}</span>
  </div>
);

export default InfoCard;
