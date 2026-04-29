import { useState } from 'react';
import { API_URL } from '../../config/api';

/**
 * Newsletter / Lead Capture CTA section with email input.
 */
const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch(`${API_URL}/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setStatus('success');
        setMessage(data.message || 'Successfully subscribed!');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.message || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setStatus('error');
      setMessage('Failed to connect to the server. Please check your connection.');
    }
  };

  return (
    <section id="lead-capture" className="py-16 sm:py-20 section-padding bg-navy-dark">
      <div className="max-w-3xl mx-auto glass p-8 sm:p-12 rounded-3xl text-center">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
          Get Free Travel Plan
        </h2>
        <p className="text-gray-400 mb-8 text-sm sm:text-base">
          Enter your email to receive travel ideas, checklists, and future trip planning updates.
        </p>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto relative"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => {
               setEmail(e.target.value);
               if (status !== 'idle') setStatus('idle');
            }}
            placeholder="Enter your email"
            required
            disabled={status === 'loading'}
            id="newsletter-email"
            className="flex-1 bg-white/5 border border-white/10 rounded-full px-6 py-3
                       text-sm focus:outline-none focus:border-india-orange transition-colors disabled:opacity-50"
          />
          <button 
            type="submit" 
            disabled={status === 'loading'}
            className="btn-primary flex items-center justify-center min-w-[120px] text-sm disabled:opacity-75 disabled:cursor-not-allowed"
          >
            {status === 'loading' ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              'Get Free Plan'
            )}
          </button>
        </form>
        {status === 'success' && (
          <p className="text-emerald-400 text-sm mt-4 font-medium transition-opacity duration-300">{message}</p>
        )}
        {status === 'error' && (
          <p className="text-red-400 text-sm mt-4 font-medium transition-opacity duration-300">{message}</p>
        )}
      </div>
    </section>
  );
};

export default Newsletter;
