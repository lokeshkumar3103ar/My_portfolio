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
  const [showAIPortfolioOverlay, setShowAIPortfolioOverlay] = useState(false);

  // Handle scroll effect with improved performance
  useEffect(() => {
    // Use requestAnimationFrame for smoother scrolling effects
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20);
            // Determine which section is currently in view
          const sections = ['skills', 'expertise', 'prompt-engineering', 'projects', 'timeline'];
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
  // Navigation items array for easy maintenance - with shorter labels for mobile
  const navItems = [
    { id: 'expertise', label: 'Expertise', mobileLabel: 'Expertise' },
    { id: 'skills', label: 'Skills', mobileLabel: 'Skills' },
    { id: 'prompt-engineering', label: 'Prompt Systems', mobileLabel: 'Prompts' },
    { id: 'projects', label: 'Projects', mobileLabel: 'Projects' },
    { id: 'timeline', label: 'Timeline', mobileLabel: 'Timeline' }
  ];

  return (
    <motion.header 
      className={`fixed w-full transition-all duration-500 ${
        mobileMenuOpen 
          ? 'z-50 py-3 sm:py-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700'
          : scrolled 
            ? 'z-50 py-2 sm:py-3 bg-gray-50/90 dark:bg-gray-950/90 backdrop-blur-md border-b border-gray-200/20 dark:border-gray-800/20 shadow-sm' 
            : 'z-50 py-3 sm:py-4 lg:py-5 bg-transparent'
      }`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
      style={{ 
        willChange: "transform, opacity",
      }}
    >
      <div className="container mx-auto px-4 sm:px-6 flex justify-between items-center">
        {/* Logo/Name with theme color - Responsive sizing */}
        <motion.a 
          href="#"
          className="text-base sm:text-lg md:text-xl font-medium text-gray-900 dark:text-white flex items-center flex-shrink-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {/* Aesthetic icon accent with theme color - hide on very small screens */}
          <span 
            className="hidden sm:flex w-5 md:w-6 h-5 md:h-6 mr-2 md:mr-3 items-center justify-center rounded-full border-2 opacity-80"
            style={{ 
              borderColor: currentColors.primary,
              background: `linear-gradient(135deg, ${currentColors.primary}20, ${currentColors.secondary}20)`
            }}
          >
            <span 
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: currentColors.primary }}
            ></span>
          </span>
          <span className="font-medium tracking-tight">Lokesh Kumar</span>
          <span style={{ color: currentColors.primary }} className="ml-1">A R</span>
        </motion.a>

        {/* Desktop Navigation - with theme colors and better spacing */}
        <nav className="hidden lg:flex items-center space-x-4 xl:space-x-8">
          {navItems.map((item, index) => (
            <motion.a 
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => {
                e.preventDefault();
                const element = document.getElementById(item.id);
                if (element) {
                  const headerHeight = 80; // Account for fixed header
                  const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
                  const offsetPosition = elementPosition - headerHeight;
                  
                  window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                  });
                }
              }}
              className={`text-xs lg:text-sm xl:text-sm tracking-wide font-medium transition-all relative ${
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
        
        {/* Right section with theme toggle and resume button - improved spacing */}
        <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-6">
          <motion.button
            onClick={toggleTheme}
            className="p-2 focus:outline-none relative flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ delay: 0.5 }}
          >
            {isDarkMode ? (
              <FaSun className="w-4 h-4" style={{ color: currentColors.secondary }} />
            ) : (
              <FaMoon className="w-4 h-4" style={{ color: currentColors.primary }} />
            )}
          </motion.button>
          {/* AI Generalist Portfolio Button & Description (Desktop) */}
          <div className="hidden lg:flex flex-col items-end mr-2">
            <button
              data-ai-portfolio-btn
              onClick={() => setShowAIPortfolioOverlay(true)
}
              className="py-2 px-4 rounded-lg font-semibold text-white shadow-md transition-all duration-200 text-xs xl:text-sm"
              style={{
                background: `linear-gradient(90deg, ${currentColors.primary}, ${currentColors.secondary})`,
                boxShadow: `0 2px 8px 0 ${currentColors.primary}40`
              }}
            >
              My AI Generalist Portfolio
            </button>
          </div>
          <motion.a
            href={import.meta.env.BASE_URL + 'Lokesh_Kumar_AR_Resume_2025.pdf'}
            className="hidden lg:flex py-2 px-3 xl:px-5 text-xs xl:text-sm font-medium text-gray-900 dark:text-white hover:text-white dark:hover:text-white transition-colors relative group flex-shrink-0"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            onClick={e => { e.stopPropagation(); }}
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
          
          {/* Mobile menu button with theme colors - show on lg and below */}
          <motion.button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden bg-transparent border-none flex-shrink-0"
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
      
      {/* Mobile menu - Full screen height coverage */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="lg:hidden fixed top-0 left-0 right-0 bottom-0 z-[9999] bg-white dark:bg-gray-900"
            style={{ height: '100vh', width: '100vw' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {/* Menu content - Full screen layout */}
            <div className="h-screen w-full flex flex-col">
              {/* Header area */}
              <div className="flex justify-between items-center px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex-shrink-0">
                <div className="flex items-center">
                  <span 
                    className="w-4 h-px mr-3"
                    style={{ backgroundColor: currentColors.primary }}
                  />
                  <span className="text-lg font-medium text-gray-900 dark:text-white">
                    Lokesh Kumar <span style={{ color: currentColors.primary }}>A R</span>
                  </span>
                </div>
                
                {/* Close button */}
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                  aria-label="Close menu"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Navigation - Fill remaining space */}
              <div className="flex-1 bg-white dark:bg-gray-900 px-6 py-8 overflow-y-auto">
                <nav className="h-full">
                  <div className="space-y-4">
                    {navItems.map((item, index) => (
                      <motion.a
                        key={item.id}
                        href={`#${item.id}`}
                        className={`block text-xl font-medium py-6 px-4 rounded-lg transition-all duration-200 ${
                          activeSection === item.id 
                            ? 'bg-gray-100 dark:bg-gray-800' 
                            : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                        }`}
                        style={activeSection === item.id ? { color: currentColors.primary } : {
                          color: isDarkMode ? '#e5e7eb' : '#374151'
                        }}
                        onClick={(e) => {
                          e.preventDefault();
                          setMobileMenuOpen(false);
                          setTimeout(() => {
                            const element = document.getElementById(item.id);
                            if (element) {
                              const headerHeight = 80;
                              const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
                              const offsetPosition = elementPosition - headerHeight;
                              
                              window.scrollTo({
                                top: offsetPosition,
                                behavior: 'smooth'
                              });
                            }
                          }, 200);
                        }}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ 
                          delay: 0.05 * index,
                          duration: 0.3,
                          ease: "easeOut"
                        }}
                      >
                        <div className="flex items-center">
                          {activeSection === item.id && (
                            <motion.div 
                              className="w-1 h-6 rounded-full mr-3"
                              style={{ backgroundColor: currentColors.primary }}
                              layoutId="mobileActiveIndicator"
                              initial={{ scaleY: 0 }}
                              animate={{ scaleY: 1 }}
                              transition={{ duration: 0.2 }}
                            />
                          )}
                          {item.label}
                        </div>
                      </motion.a>
                    ))}
                  </div>
                </nav>
              </div>

              {/* Footer with resume button */}
              <div className="px-6 py-6 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex-shrink-0">
                {/* AI Generalist Portfolio Button & Description (Mobile) */}
                <div className="mb-4">
                  <span className="block text-xs text-gray-600 dark:text-gray-300 mb-2">
                    Explore my advanced AI Generalist portfolio—a dedicated site showcasing my real-world AI collaboration, live project dashboards, and unique 30-Day Challenge. This site demonstrates my ability to orchestrate, build, and deliver complex solutions with AI, beyond the standard portfolio.
                  </span>
                  <button
                    data-ai-portfolio-btn
                    type="button"
                    onClick={() => setShowAIPortfolioOverlay(true)}
                    className="block w-full py-3 px-6 text-center text-white text-base font-semibold rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl mb-2"
                    style={{
                      background: `linear-gradient(90deg, ${currentColors.primary}, ${currentColors.secondary})`,
                      boxShadow: `0 2px 8px 0 ${currentColors.primary}40`
                    }}
                  >
                    My AI Generalist Portfolio
                  </button>
                </div>
                <motion.a
                  href={import.meta.env.BASE_URL + 'Lokesh_Kumar_AR_Resume_2025.pdf'}
                  className="block w-full py-4 px-6 text-center text-white text-lg font-medium rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl"
                  style={{ 
                    background: `linear-gradient(135deg, ${currentColors.primary}, ${currentColors.secondary})` 
                  }}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={e => { e.stopPropagation(); }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    delay: 0.2,
                    duration: 0.3,
                    ease: "easeOut"
                  }}
                >
                  Download Resume
                </motion.a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Generalist Portfolio Overlay */}
      <AnimatePresence>
        {showAIPortfolioOverlay && (
          <motion.div
            className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/70"
            style={{ top: 0, left: 0, width: '100vw', height: '100vh', position: 'fixed' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 max-w-lg w-full text-center flex flex-col items-center">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">You are about to enter my other portfolio</h2>
              <p className="mb-6 text-gray-700 dark:text-gray-300">
                Explore my advanced AI Generalist portfolio—a dedicated site showcasing my real-world AI collaboration, live project dashboards, and unique 30-Day Challenge. This site demonstrates my ability to orchestrate, build, and deliver complex solutions with AI, beyond the standard portfolio.
              </p>
              <button
                className="mt-2 px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
                onClick={() => {
                  setShowAIPortfolioOverlay(false);
                  window.location.href = 'https://lokeshkumar3103ar.github.io/Ai_portfolio/';
                }}
              >
                Click to continue...
              </button>
              <button
                className="mt-4 text-sm text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 underline"
                onClick={() => setShowAIPortfolioOverlay(false)}
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;