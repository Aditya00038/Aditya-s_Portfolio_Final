import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowUp } from 'react-icons/fa';
import './BackToTop.css';

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Initial check
    checkMobile();

    // Listen for resize
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      // Show button when scrolled down more than 300px
      const scrolled = window.scrollY > 300;
      setIsVisible(scrolled && isMobile);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          className="back-to-top-btn"
          onClick={scrollToTop}
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Back to top"
        >
          <FaArrowUp />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default BackToTop;
