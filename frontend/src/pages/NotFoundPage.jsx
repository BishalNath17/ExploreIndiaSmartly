import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';

const NotFoundPage = () => (
  <section className="min-h-[70vh] flex items-center justify-center section-padding">
    <div className="text-center max-w-md">
      <MapPin size={48} className="text-india-orange mx-auto mb-6" />
      <h1 className="text-5xl sm:text-6xl font-bold mb-4">404</h1>
      <h2 className="text-xl sm:text-2xl font-bold mb-3">Page Not Found</h2>
      <p className="text-gray-400 mb-8 text-sm">
        Looks like you've wandered off the map. Let's get you back on track.
      </p>
      <Link to="/" className="btn-primary">
        Back to Home
      </Link>
    </div>
  </section>
);

export default NotFoundPage;
