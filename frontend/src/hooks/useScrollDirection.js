import { useState, useEffect } from 'react';

/**
 * Detects scroll direction and returns 'up' or 'down'.
 * Useful for hiding/showing the navbar on scroll.
 */
const useScrollDirection = (threshold = 10) => {
  const [scrollDir, setScrollDir] = useState('up');

  useEffect(() => {
    let lastY = window.scrollY;

    const onScroll = () => {
      const currentY = window.scrollY;
      if (Math.abs(currentY - lastY) < threshold) return;
      setScrollDir(currentY > lastY ? 'down' : 'up');
      lastY = currentY;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  return scrollDir;
};

export default useScrollDirection;
