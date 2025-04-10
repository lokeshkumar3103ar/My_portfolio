import React from 'react';
import { motion } from 'framer-motion';

const WaveTransition = ({ inverted = false, color = 'currentColor', className = '' }) => {
  return (
    <div className={`relative w-full ${className}`} style={{ transform: inverted ? 'rotate(180deg)' : 'none' }}>
      <svg 
        viewBox="0 0 1440 120" 
        className="w-full h-auto -mb-1" 
        preserveAspectRatio="none"
      >
        <motion.path 
          initial={{ 
            d: "M0,0 L1440,0 L1440,120 L0,120 Z" 
          }}
          animate={{ 
            d: "M0,120 C240,88 480,72 720,80 C960,88 1200,104 1440,80 L1440,120 L0,120 Z"
          }}
          transition={{ 
            duration: 1.5, 
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "mirror",
            repeatDelay: 2
          }}
          fill={color}
        />
      </svg>
    </div>
  );
};

export default WaveTransition;
