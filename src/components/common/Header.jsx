import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeContext } from '../../context/ThemeContext';
import { ColorThemeContext } from '../../context/ColorThemeContext';
import { FaSun, FaMoon } from 'react-icons/fa';

const Header = () => {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const { currentColors } = useContext(ColorThemeContext);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  // Handle scroll effect with improved performance
  useEffect(() => {
    // Use requestAnimationFrame for smoother scrolling effects
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20);
          
          // Determine which section is currently in view
          const sections = ['skills', 'expertise', 'prompt-engineering', 'timeline'];
          let currentSection = 'home';
          
          for (const section of sections) {
            const element = document.getElementById(section);
            if (element) {
              const rect = element.getBoundingClientRect();
              if (rect.top <= 100 && rect.bottom >= 100) {
                currentSection = section;
                break;
              }
            }
          }
          
          setActiveSection(currentSection);
          ticking = false;
        });
        
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Navigation items array for easy maintenance
  const navItems = [
    { id: 'expertise', label: 'Expertise' },
    { id: 'skills', label: 'Skills' },
    { id: 'prompt-engineering', label: 'Prompt Systems' },
    { id: 'timeline', label: 'Timeline' }
  ];

  return (
    <motion.header 
      className={`fixed w-full z-50 transition-all duration-500 ${
        scrolled 
          ? 'py-3 bg-[#f5f5f7]/90 dark:bg-[#101013]/90 backdrop-blur-md border-b border-gray-200/20 dark:border-gray-800/20 shadow-sm' 
          : 'py-5 bg-transparent'
      }`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
      style={{ 
        willChange: "transform, opacity",
      }}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Logo/Name with theme color */}
        <motion.a 
          href="#"
          className="text-lg md:text-xl font-medium text-gray-900 dark:text-white flex items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {/* Line accent with theme color */}
          <span 
            className="hidden md:block w-6 h-px mr-3"
            style={{ backgroundColor: currentColors.primary }}
          ></span>
          <span className="font-medium tracking-tight">Lokesh</span>
          <span style={{ color: currentColors.primary }} className="ml-1">Kumar</span>
        </motion.a>
        
        {/* Desktop Navigation - with theme colors */}
        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map((item, index) => (
            <motion.a 
              key={item.id}
              href={`#${item.id}`} 
              className={`text-sm tracking-wide font-medium transition-all relative ${
                activeSection === item.id
                  ? '' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
              style={activeSection === item.id ? { color: currentColors.primary } : {}}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                delay: 0.3 + (0.1 * index),
                duration: 0.5,
                ease: [0.25, 1, 0.5, 1]
              }}
            >
              {item.label}
              {activeSection === item.id && (
                <motion.div 
                  className="absolute -bottom-1 left-0 right-0 h-px"
                  style={{ backgroundColor: currentColors.primary }}
                  layoutId="activeNavIndicator"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </motion.a>
          ))}
        </nav>
        
        {/* Right section with theme toggle and resume button */}
        <div className="flex items-center space-x-6">
          <motion.button
            onClick={toggleTheme}
            className="p-1.5 focus:outline-none relative"
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileTap={{ scale: 0.92 }}
            transition={{ delay: 0.5 }}
          >
            <motion.div
              className="absolute inset-0 bg-gray-100 dark:bg-gray-800 rounded-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            />
            {isDarkMode ? (
              <FaSun className="w-4 h-4 relative z-10" style={{ color: currentColors.secondary }} />
            ) : (
              <FaMoon className="w-4 h-4 relative z-10" style={{ color: currentColors.primary }} />
            )}
          </motion.button>
          
          <motion.a
            href="/resume.pdf"
            className="hidden md:flex py-2 px-5 text-sm font-medium text-gray-900 dark:text-white hover:text-white dark:hover:text-white transition-colors relative group"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <span className="relative z-10">Resume</span>
            <span 
              className="absolute bottom-0 left-0 w-full h-px transition-all duration-300 group-hover:h-full"
              style={{ 
                background: 'gray', 
                backgroundImage: `linear-gradient(to right, ${currentColors.primary}, ${currentColors.secondary})`,
                opacity: 0.1
              }}
            ></span>
          </motion.a>
          
          {/* Mobile menu button with theme colors */}
          <motion.button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden bg-transparent border-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileTap={{ scale: 0.92 }}
            transition={{ delay: 0.4 }}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            <div className="w-6 flex flex-col gap-[6px] items-end">
              <motion.span 
                className="h-[1px] block" 
                style={{ background: isDarkMode ? '#fff' : '#000' }}
                animate={mobileMenuOpen ? 
                  { rotate: 45, y: 7, width: '100%', backgroundColor: currentColors.primary } : 
                  { rotate: 0, width: '100%' }}
                transition={{ duration: 0.2 }}
              />
              <motion.span 
                className="h-[1px] block" 
                style={{ background: isDarkMode ? '#fff' : '#000' }}
                animate={mobileMenuOpen ? 
                  { opacity: 0, width: 0 } : 
                  { opacity: 1, width: '75%' }}
                transition={{ duration: 0.2 }}
              />
              <motion.span 
                className="h-[1px] block" 
                style={{ background: isDarkMode ? '#fff' : '#000' }}
                animate={mobileMenuOpen ? 
                  { rotate: -45, y: -7, width: '100%', backgroundColor: currentColors.primary } : 
                  { rotate: 0, width: '50%' }}
                transition={{ duration: 0.2 }}
              />
            </div>
          </motion.button>
        </div>
      </div>
      
      {/* Mobile menu - Enhanced with theme colors */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="md:hidden fixed inset-0 z-40 bg-[#f5f5f7]/95 dark:bg-[#101013]/98 backdrop-blur-md pt-20"
            initial={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
            exit={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
            style={{ willChange: "opacity, clip-path" }} // Performance optimization
          >
            <div className="container mx-auto px-6 py-10 flex flex-col h-full">
              <div className="space-y-10 flex flex-col items-start">
                {navItems.map((item, index) => (
                  <motion.a
                    key={item.id}
                    href={`#${item.id}`}
                    className={`text-3xl font-medium relative overflow-hidden group`}
                    style={activeSection === item.id ? { color: currentColors.primary } : {
                      color: isDarkMode ? '#ccc' : '#333'
                    }}
                    onClick={() => setMobileMenuOpen(false)}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ 
                      delay: 0.1 * index,
                      duration: 0.6,
                      ease: [0.25, 1, 0.5, 1]
                    }}
                  >
                    <span className="block">
                      {item.label}
                    </span>
                    <motion.span 
                      className="absolute bottom-0 left-0 w-full h-px"
                      style={{ 
                        backgroundColor: `${currentColors.primary}30`
                      }}
                      initial={{ scaleX: 0, transformOrigin: "left" }}
                      whileInView={{ scaleX: 1 }}
                      transition={{ duration: 0.5, delay: 0.3 + (0.1 * index) }}
                    />
                  </motion.a>
                ))}
              </div>

              <div className="mt-auto pt-10">
                <motion.a
                  href="/resume.pdf"
                  className="inline-block py-3 px-6 text-white font-medium"
                  style={{ 
                    background: `linear-gradient(135deg, ${currentColors.primary}, ${currentColors.secondary})` 
                  }}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileMenuOpen(false)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    delay: 0.5,
                    duration: 0.6,
                    ease: [0.25, 1, 0.5, 1]
                  }}
                >
                  Resume
                </motion.a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;