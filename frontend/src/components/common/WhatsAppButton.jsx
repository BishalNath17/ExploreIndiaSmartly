import { useLocation } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';

const WhatsAppButton = () => {
  const { pathname } = useLocation();
  const phoneNumber = '919999999999'; // Placeholder

  let message = 'Hi, I want a custom travel plan.';

  // If on a destination page, dynamically format the destination name
  if (pathname.startsWith('/destination/')) {
    const slug = pathname.split('/destination/')[1];
    if (slug) {
      const formattedName = slug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      message = `Hi, I want a custom travel plan for ${formattedName}.`;
    }
  }

  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-full shadow-[0_4px_14px_0_rgba(37,211,102,0.39)] hover:shadow-[0_6px_20px_rgba(37,211,102,0.23)] hover:-translate-y-1 transition-all duration-300"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle size={28} />
      {/* Pulse animation ring for higher conversion visibility */}
      <span className="absolute inset-0 w-full h-full border-2 border-[#25D366] rounded-full animate-ping opacity-50 scale-110"></span>
    </a>
  );
};

export default WhatsAppButton;
