import { MapPin } from 'lucide-react';

/**
 * Generic empty-state / no-results fallback.
 *
 * @param {import('lucide-react').LucideIcon} icon
 * @param {string} message
 */
const EmptyState = ({ icon: Icon = MapPin, message = 'Nothing to show yet.' }) => (
  <div className="col-span-full text-center py-16">
    <Icon size={32} className="text-gray-600 mx-auto mb-4" />
    <p className="text-gray-400 text-sm">{message}</p>
  </div>
);

export default EmptyState;
