import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const BackButton = ({ fallback = "/", label = "Back", className = "" }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    // In React Router v6, window.history.state contains an `idx` property.
    // If idx > 0, we have an internal route history to go back to.
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate(fallback);
    }
  };

  return (
    <button
      onClick={handleBack}
      className={`group inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-navy/80 hover:bg-navy border border-white/10 hover:border-india-orange/50 rounded-full backdrop-blur-md text-sm font-medium text-gray-200 hover:text-india-orange transition-all shadow-lg z-40 ${className}`}
    >
      <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
      <span>{label}</span>
    </button>
  );
};

export default BackButton;
