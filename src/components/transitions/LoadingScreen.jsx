import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ColorThemeContext } from '../../context/ColorThemeContext';
import { ThemeContext } from '../../context/ThemeContext';

const LoadingScreen = ({ onComplete }) => {
  const { currentColors } = useContext(ColorThemeContext);
  const { isDarkMode } = useContext(ThemeContext);
  const [animationPhase, setAnimationPhase] = useState('initial'); // initial, name, title, complete
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setAnimationPhase('name'), 600);
    const timer2 = setTimeout(() => setAnimationPhase('title'), 2800);
    const timer3 = setTimeout(() => setAnimationPhase('complete'), 4200);
    const timer4 = setTimeout(() => {
      setIsExiting(true);
      setTimeout(onComplete, 800);
    }, 5400);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [onComplete]);

  const containerVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } },
    exit: { 
      opacity: 0,
      scale: 1.05,
      filter: 'blur(10px)',
      transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] }
    }
  };

  const nameVariants = {
    initial: { 
      opacity: 0, 
      scale: 0.2, 
      y: 100,
      rotateX: -45,
      filter: 'blur(30px)'
    },
    animate: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      rotateX: 0,
      filter: 'blur(0px)',
      transition: { 
        duration: 2, 
        ease: [0.16, 1, 0.3, 1],
        staggerChildren: 0.08
      }
    }
  };

  const titleVariants = {
    initial: { 
      opacity: 0, 
      scale: 0.9, 
      y: 50,
      filter: 'blur(15px)'
    },
    animate: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      filter: 'blur(0px)',
      transition: { 
        duration: 1.8, 
        ease: [0.16, 1, 0.3, 1],
        delay: 0.2
      }
    }
  };

  const letterVariants = {
    initial: { 
      opacity: 0, 
      y: 120, 
      rotateY: 45,
      scale: 0.3,
      filter: 'blur(10px)'
    },
    animate: { 
      opacity: 1, 
      y: 0, 
      rotateY: 0,
      scale: 1,
      filter: 'blur(0px)',
      transition: { 
        duration: 1.2, 
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  const glowVariants = {
    initial: { opacity: 0, scale: 0.5 },
    animate: { 
      opacity: [0, 0.8, 0.6, 1], 
      scale: [0.5, 1.2, 1.1, 1],
      transition: { 
        duration: 2,
        ease: "easeInOut",
        times: [0, 0.3, 0.7, 1]
      }
    }
  };

  const backgroundVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { duration: 0.8 }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 1 }
    }
  };

  const name = "Lokesh Kumar A R";
  const title = "AI Prompt Engineer & Data Science Enthusiast";

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          className="fixed inset-0 z-[10000] flex items-center justify-center"
          variants={containerVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {/* Dynamic background */}
          <motion.div
            className="absolute inset-0"
            variants={backgroundVariants}
            style={{
              background: isDarkMode 
                ? `radial-gradient(ellipse at center, ${currentColors.primary}15 0%, #0f172a 50%, #020617 100%)`
                : `radial-gradient(ellipse at center, ${currentColors.primary}10 0%, #ffffff 50%, #f8fafc 100%)`
            }}
          />

          {/* Animated particles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full"
                style={{
                  backgroundColor: currentColors.primary,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  opacity: [0, 0.8, 0],
                  scale: [0, 1, 0],
                  y: [0, -100 - Math.random() * 100],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 3,
                  ease: "easeOut"
                }}
              />
            ))}
          </div>

          {/* Main content container with reserved space */}
          <div className="relative z-10 text-center px-4">
            {/* Glowing backdrop */}
            {animationPhase !== 'initial' && (
              <motion.div
                className="absolute inset-0 rounded-3xl blur-3xl"
                variants={glowVariants}
                initial="initial"
                animate="animate"
                style={{
                  background: `linear-gradient(135deg, ${currentColors.primary}20, ${currentColors.secondary}15, ${currentColors.primary}10)`,
                  transform: 'scale(1.5)',
                }}
              />
            )}

            {/* Container with fixed dimensions to prevent layout shifts */}
            <div className="flex flex-col items-center justify-center min-h-[400px]">
              {/* Name Animation - always rendered but with opacity */}
              <motion.div
                variants={nameVariants}
                initial="initial"
                animate={animationPhase !== 'initial' ? "animate" : "initial"}
                className="relative mb-8"
              >
                <motion.h1 
                  className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-light tracking-wider"
                  style={{ 
                    fontFamily: 'serif',
                    color: isDarkMode ? '#ffffff' : '#1e293b',
                    textShadow: isDarkMode 
                      ? `0 0 30px ${currentColors.primary}40, 0 0 60px ${currentColors.primary}20`
                      : `0 0 20px ${currentColors.primary}30`
                  }}
                >
                  {name.split('').map((char, index) => (
                    <motion.span
                      key={index}
                      variants={letterVariants}
                      className="inline-block"
                      style={{
                        color: (char === 'L' || char === 'K' || char === 'A' || char === 'R') 
                          ? currentColors.primary 
                          : 'inherit'
                      }}
                    >
                      {char === ' ' ? '\u00A0' : char}
                    </motion.span>
                  ))}
                </motion.h1>

                {/* Elegant underline - super smooth */}
                <motion.div
                  className="h-0.5 mx-auto rounded-full mt-4"
                  style={{ backgroundColor: currentColors.primary }}
                  initial={{ width: 0, opacity: 0, scaleX: 0 }}
                  animate={{ 
                    width: animationPhase === 'name' || animationPhase === 'title' || animationPhase === 'complete' ? '70%' : 0,
                    opacity: animationPhase === 'name' || animationPhase === 'title' || animationPhase === 'complete' ? 1 : 0,
                    scaleX: animationPhase === 'name' || animationPhase === 'title' || animationPhase === 'complete' ? 1 : 0
                  }}
                  transition={{ 
                    duration: 2, 
                    delay: 1.5, 
                    ease: [0.16, 1, 0.3, 1]
                  }}
                />
              </motion.div>

              {/* Title Animation - always rendered but with opacity */}
              <motion.div
                variants={titleVariants}
                initial="initial"
                animate={(animationPhase === 'title' || animationPhase === 'complete') ? "animate" : "initial"}
                className="relative"
              >
                <motion.p 
                  className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-light tracking-wide"
                  style={{ 
                    color: isDarkMode ? '#94a3b8' : '#475569',
                    textShadow: isDarkMode 
                      ? `0 0 20px ${currentColors.secondary}30`
                      : `0 0 10px ${currentColors.secondary}20`
                  }}
                >
                  {title.split(' ').map((word, index) => (
                    <motion.span
                      key={index}
                      className="inline-block mr-2"
                      initial={{ opacity: 0, y: 30, scale: 0.8 }}
                      animate={{ 
                        opacity: (animationPhase === 'title' || animationPhase === 'complete') ? 1 : 0, 
                        y: (animationPhase === 'title' || animationPhase === 'complete') ? 0 : 30, 
                        scale: (animationPhase === 'title' || animationPhase === 'complete') ? 1 : 0.8
                      }}
                      transition={{ 
                        duration: 1, 
                        delay: index * 0.15 + 0.8,
                        ease: [0.16, 1, 0.3, 1]
                      }}
                    >
                      {word}
                    </motion.span>
                  ))}
                </motion.p>
              </motion.div>

              {/* Loading indicator - always rendered but with opacity */}
              <motion.div 
                className="flex justify-center space-x-3 mt-12"
                initial={{ opacity: 0, y: 30, scale: 0.8 }}
                animate={{ 
                  opacity: animationPhase === 'complete' ? 1 : 0, 
                  y: animationPhase === 'complete' ? 0 : 30, 
                  scale: animationPhase === 'complete' ? 1 : 0.8
                }}
                transition={{ 
                  duration: 1.2, 
                  delay: 1.5,
                  ease: [0.16, 1, 0.3, 1]
                }}
              >
                {[0, 1, 2].map((index) => (
                  <motion.div
                    key={index}
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: currentColors.primary }}
                    animate={{
                      scale: animationPhase === 'complete' ? [1, 1.3, 1] : [1],
                      opacity: animationPhase === 'complete' ? [0.5, 1, 0.5] : [0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: animationPhase === 'complete' ? Infinity : 0,
                      delay: index * 0.3,
                      ease: [0.16, 1, 0.3, 1]
                    }}
                  />
                ))}
              </motion.div>
            </div>
          </div>

          {/* Orbital elements */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  backgroundColor: currentColors.secondary,
                  opacity: 0.4,
                  left: '50%',
                  top: '50%',
                  transformOrigin: `${150 + i * 50}px 0px`,
                }}
                animate={{
                  rotate: 360,
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  rotate: { duration: 20 + i * 10, repeat: Infinity, ease: "linear" },
                  scale: { duration: 2, repeat: Infinity, delay: i * 0.5 }
                }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
