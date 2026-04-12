import { useState } from 'react';
import { Send, MapPin, Mail, MessageSquare, CheckCircle, AlertCircle } from 'lucide-react';
import PageHero from '../components/layout/PageHero';
import ScrollReveal from '../components/ui/ScrollReveal';
import { API_URL } from '../config/api';

const ContactPage = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState(null); // 'sending' | 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMsg('');

    try {
      const res = await fetch(`${API_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (data.success) {
        setStatus('success');
        setForm({ name: '', email: '', subject: '', message: '' });
      } else {
        throw new Error(data.message || 'Failed to send message');
      }
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.message);
    }
  };

  return (
    <>
      <PageHero
        badge={{ text: 'Get in Touch', icon: MessageSquare }}
        badgeColor="india-orange"
        title="Contact Us"
        highlightWord="Contact"
        subtitle="Have a question, suggestion, or travel query? We'd love to hear from you."
        gradientFrom="from-india-orange/10"
      />

      <section className="py-12 sm:py-16 section-padding">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Info Cards */}
          <div className="lg:col-span-2 space-y-5">
            <ScrollReveal>
              <div className="glass rounded-2xl p-6">
                <div className="w-10 h-10 rounded-xl bg-india-orange/15 flex items-center justify-center mb-4">
                  <Mail size={20} className="text-india-orange" />
                </div>
                <h3 className="font-bold mb-1">Email Us</h3>
                <p className="text-sm text-gray-400">contact@exploreindia.smartly</p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <div className="glass rounded-2xl p-6">
                <div className="w-10 h-10 rounded-xl bg-india-orange/15 flex items-center justify-center mb-4">
                  <MapPin size={20} className="text-india-orange" />
                </div>
                <h3 className="font-bold mb-1">Our Focus</h3>
                <p className="text-sm text-gray-400">Budget-friendly, smart travel across all 28 states & 8 UTs of India</p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <div className="glass rounded-2xl p-6">
                <div className="w-10 h-10 rounded-xl bg-india-orange/15 flex items-center justify-center mb-4">
                  <MessageSquare size={20} className="text-india-orange" />
                </div>
                <h3 className="font-bold mb-1">Response Time</h3>
                <p className="text-sm text-gray-400">We typically respond within 24-48 hours</p>
              </div>
            </ScrollReveal>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-3">
            <ScrollReveal>
              <div className="glass rounded-3xl p-6 sm:p-8">
                <h2 className="text-2xl font-bold mb-6">Send a Message</h2>

                {status === 'success' ? (
                  <div className="text-center py-12">
                    <CheckCircle size={48} className="text-green-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2 text-green-300">Message Sent!</h3>
                    <p className="text-gray-400 mb-6">Thank you for reaching out. We'll get back to you soon.</p>
                    <button
                      onClick={() => setStatus(null)}
                      className="btn-outline text-sm"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-wider">Name *</label>
                        <input
                          type="text" name="name" required value={form.name}
                          onChange={handleChange}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-india-orange/50 transition-colors"
                          placeholder="Your Name"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-wider">Email *</label>
                        <input
                          type="email" name="email" required value={form.email}
                          onChange={handleChange}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-india-orange/50 transition-colors"
                          placeholder="you@example.com"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-wider">Subject</label>
                      <input
                        type="text" name="subject" value={form.subject}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-india-orange/50 transition-colors"
                        placeholder="What's this about?"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-wider">Message *</label>
                      <textarea
                        name="message" required rows={5} value={form.message}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-india-orange/50 transition-colors resize-none"
                        placeholder="Your message..."
                      />
                    </div>

                    {status === 'error' && (
                      <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 rounded-xl px-4 py-3">
                        <AlertCircle size={16} /> {errorMsg || 'Something went wrong. Please try again.'}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={status === 'sending'}
                      className="btn-primary w-full flex items-center justify-center gap-2 text-sm disabled:opacity-60"
                    >
                      {status === 'sending' ? (
                        <>Sending...</>
                      ) : (
                        <>Send Message <Send size={16} /></>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactPage;
