import React, { useEffect } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';

const MorphSection = ({ children, className, id, delay = 0 }) => {
  const controls = useAnimation();
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [controls, isInView]);

  const variants = {
    hidden: { 
      opacity: 0, 
      y: 50, 
      clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)',
    },
    visible: { 
      opacity: 1, 
      y: 0,
      clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
      transition: {
        duration: 0.8, 
        ease: [0.25, 1, 0.5, 1], // Custom cubic bezier for morphing effect
        delay: delay,
      }
    }
  };

  return (
    <motion.section
      id={id}
      ref={ref}
      className={className}
      variants={variants}
      initial="hidden"
      animate={controls}
    >
      {children}
    </motion.section>
  );
};

export default MorphSection;
