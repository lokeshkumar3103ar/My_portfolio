import React from 'react';
import { motion } from 'framer-motion';

const PageTransition = ({ children, id }) => {
  return (
    <motion.div
      key={id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ 
        type: "tween",
        ease: "anticipate", 
        duration: 0.5
      }}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
