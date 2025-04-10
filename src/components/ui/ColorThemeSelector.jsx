import React, { useState, useContext, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPalette, FaCheck, FaKeyboard } from 'react-icons/fa';
import { ColorThemeContext, colorThemes } from '../../context/ColorThemeContext';

const ColorThemeSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { activeTheme, setActiveTheme, currentColors } = useContext(ColorThemeContext);
  const [showTooltip, setShowTooltip] = useState(false);
  
  // Handle keyboard shortcut for theme selection
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Alt + T to toggle theme selector
      if (e.altKey && e.key === 't') {
        setIsOpen(prev => !prev);
        e.preventDefault();
      }
      
      // Alt + 1-5 to select themes
      if (e.altKey && /^[1-5]$/.test(e.key)) {
        const themeKeys = Object.keys(colorThemes);
        const index = parseInt(e.key) - 1;
        if (index >= 0 && index < themeKeys.length) {
          setActiveTheme(themeKeys[index]);
          setShowTooltip(true);
          setTimeout(() => setShowTooltip(false), 2000);
        }
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setActiveTheme]);

  const toggleOpen = () => setIsOpen(!isOpen);
  const close = () => setIsOpen(false);

  const containerVariants = {
    hidden: { opacity: 0, x: 30 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { 
        type: "spring", 
        damping: 25, 
        stiffness: 300,
        staggerChildren: 0.08
      } 
    },
    exit: { 
      opacity: 0, 
      x: 30, 
      transition: { 
        duration: 0.3, 
        ease: "easeInOut" 
      } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 10 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    }
  };

  const tooltipVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 10 }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <motion.button
        onClick={toggleOpen}
        className="w-12 h-12 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
        style={{ 
          background: `linear-gradient(135deg, ${currentColors.primary}, ${currentColors.secondary})`
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Change color theme"
        title="Change color theme (Alt+T)"
      >
        <FaPalette size={18} className="text-white" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute right-0 bottom-16 bg-white dark:bg-[#1f1f23] border border-gray-200 dark:border-gray-700 p-4 shadow-lg rounded-md"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <h3 className="text-sm uppercase tracking-wider font-medium mb-4 text-gray-700 dark:text-gray-300 flex items-center justify-between">
              <span>Color Theme</span>
              <span className="text-xs font-normal text-gray-500 dark:text-gray-400 flex items-center">
                <FaKeyboard className="mr-1" size={10} />
                Alt+T
              </span>
            </h3>
            <div className="space-y-3 w-64">
              {Object.keys(colorThemes).map((themeKey, index) => {
                const theme = colorThemes[themeKey];
                return (
                  <motion.button
                    key={themeKey}
                    onClick={() => {
                      setActiveTheme(themeKey);
                      setIsOpen(false);
                    }}
                    className={`w-full p-3 rounded-md flex items-center justify-between transition-all ${
                      activeTheme === themeKey
                        ? 'bg-gray-100 dark:bg-gray-800 font-medium'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                    }`}
                    variants={itemVariants}
                    title={`Select ${theme.name} theme (Alt+${index + 1})`}
                    aria-label={`Select ${theme.name} theme`}
                    aria-pressed={activeTheme === themeKey}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex">
                        <div 
                          className="w-5 h-10 rounded-l-sm" 
                          style={{ backgroundColor: theme.primary }}
                        ></div>
                        <div 
                          className="w-5 h-10 rounded-r-sm" 
                          style={{ backgroundColor: theme.secondary }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-900 dark:text-gray-200">
                        {theme.name}
                        <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">Alt+{index + 1}</span>
                      </span>
                    </div>
                    
                    {activeTheme === themeKey && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <FaCheck size={12} className="text-gray-700 dark:text-gray-300" />
                      </motion.div>
                    )}
                  </motion.button>
                );
              })}
            </div>
            
            <motion.button 
              className="absolute top-2 right-2 w-6 h-6 text-gray-600 dark:text-gray-400 opacity-70 hover:opacity-100 hover:text-gray-900 dark:hover:text-white transition-opacity"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ delay: 0.3 }}
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
              }}
              aria-label="Close color theme selector"
            >
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Theme change tooltip notification */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            className="absolute bottom-16 right-0 bg-white dark:bg-[#1f1f23] px-4 py-2 rounded shadow-md"
            style={{ 
              border: `1px solid ${currentColors.primary}20`
            }}
            variants={tooltipVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ background: `linear-gradient(135deg, ${currentColors.primary}, ${currentColors.secondary})` }}
              />
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {colorThemes[activeTheme].name} theme applied
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ColorThemeSelector;
