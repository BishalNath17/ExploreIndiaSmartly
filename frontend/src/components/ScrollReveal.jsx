import { motion } from 'framer-motion';
import { fadeUp } from '../utils/animations';

/**
 * Lightweight wrapper that animates children into view on scroll.
 * @param {{ children: React.ReactNode, delay?: number, className?: string }} props
 */
const ScrollReveal = ({ children, delay = 0, className = '' }) => {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      custom={delay}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default ScrollReveal;
