import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, MapPin, ChevronDown } from 'lucide-react';
const states = []; // Temporary fallback replacing deleted static data

const StateSelect = ({ value, onChange, label = "Destination", placeholder = "Search and select a state or UT" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const filteredStates = states.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));
  const selectedState = states.find(s => s.id === value);

  return (
    <div ref={dropdownRef} className="relative">
      <label className="block text-sm font-medium mb-2">
        <MapPin size={14} className="inline text-india-orange mr-1 -mt-0.5" />
        {label}
      </label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full text-left bg-white/5 border rounded-xl px-4 py-3 pr-10 text-sm transition-colors flex items-center justify-between
          ${isOpen ? 'border-india-orange/60 bg-white/10' : 'border-white/15 hover:bg-white/10'}
          ${value ? 'text-white' : 'text-gray-400'}`}
      >
        <span className="truncate">{selectedState ? selectedState.name : placeholder}</span>
        <ChevronDown size={16} className={`text-gray-500 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-full mt-2 bg-navy border border-white/15 rounded-xl shadow-2xl overflow-hidden flex flex-col"
          >
            <div className="p-2 border-b border-white/10">
              <input
                type="text"
                placeholder="Search states..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-india-orange/50 transition-colors"
                autoFocus
              />
            </div>
            <ul className="max-h-60 overflow-y-auto custom-scrollbar p-1">
              {filteredStates.length > 0 ? (
                filteredStates.map((s) => (
                  <li key={s.id}>
                    <button
                      type="button"
                      onClick={() => {
                        onChange(s.id);
                        setIsOpen(false);
                        setSearch('');
                      }}
                      className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors flex items-center justify-between
                        ${value === s.id ? 'bg-india-orange/20 text-india-orange font-bold' : 'text-gray-200 hover:bg-white/10 hover:text-white'}`}
                    >
                      {s.name}
                      {value === s.id && <Sparkles size={14} className="shrink-0" />}
                    </button>
                  </li>
                ))
              ) : (
                <li className="px-3 py-4 text-center text-sm text-gray-500">
                  No destinations found.
                </li>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StateSelect;
