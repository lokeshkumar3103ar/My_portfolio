import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { ColorThemeContext } from '../../context/ColorThemeContext';

const AnimatedBackground = ({ intensity = 0.1, className = '', color1, color2, color3 }) => {
  const { currentColors } = useContext(ColorThemeContext);
  
  // Default to theme colors if not specified
  const primaryColor = color1 || currentColors.primary;
  const secondaryColor = color2 || currentColors.secondary;
  const accentColor = color3 || currentColors.accent || '#F472B6';

  return (
    <div className={`animated-bg ${className}`}>
      <motion.div 
        className="blob gpu-accelerated"
        style={{ 
          background: primaryColor, 
          opacity: intensity,
          position: 'absolute',
          width: '50%',
          height: '50%',
          borderRadius: '50%',
          filter: 'blur(50px)',
          top: '10%',
          left: '20%',
          zIndex: -1
        }}
        animate={{
          x: [0, 10, -10, 0],
          y: [0, -10, 10, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut"
        }}
      />
      <motion.div 
        className="blob gpu-accelerated"
        style={{ 
          background: secondaryColor, 
          opacity: intensity,
          position: 'absolute',
          width: '60%',
          height: '60%',
          borderRadius: '50%',
          filter: 'blur(60px)',
          bottom: '5%',
          right: '10%',
          zIndex: -1
        }}
        animate={{
          x: [0, -15, 15, 0],
          y: [0, 15, -15, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut"
        }}
      />
      <motion.div 
        className="blob gpu-accelerated"
        style={{ 
          background: accentColor, 
          opacity: intensity,
          position: 'absolute',
          width: '40%',
          height: '40%',
          borderRadius: '50%',
          filter: 'blur(40px)',
          top: '40%',
          left: '45%',
          zIndex: -1
        }}
        animate={{
          x: [0, 20, -20, 0],
          y: [0, -20, 20, 0],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut"
        }}
      />
    </div>
  );
};

export default AnimatedBackground;
