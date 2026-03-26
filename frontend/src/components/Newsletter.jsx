import { useState } from 'react';

/**
 * Newsletter CTA section with email input.
 */
const Newsletter = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Future: connect to backend API
    setEmail('');
  };

  return (
    <section className="py-16 sm:py-20 section-padding bg-navy-dark">
      <div className="max-w-3xl mx-auto glass p-8 sm:p-12 rounded-3xl text-center">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
          Get Curated Travel Guides
        </h2>
        <p className="text-gray-400 mb-8 text-sm sm:text-base">
          Join our community of smart travelers exploring India's hidden gems.
        </p>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            id="newsletter-email"
            className="flex-1 bg-white/5 border border-white/10 rounded-full px-6 py-3
                       text-sm focus:outline-none focus:border-india-orange transition-colors"
          />
          <button type="submit" className="btn-primary text-sm">
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
};

export default Newsletter;
