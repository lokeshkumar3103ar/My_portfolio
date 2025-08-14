import { ThemeProvider } from './context/ThemeContext'
import { ColorThemeProvider } from './context/ColorThemeContext'
import Header from './components/common/Header'
import Footer from './components/common/Footer'
import HeroSection from './components/home/HeroSection'
import ExpertiseSection from './components/expertise/ExpertiseSection'
import SkillsSection from './components/skills/SkillsSection'
import TimelineSection from './components/timeline/TimelineSection'
import PromptEngineeringShowcase from './components/prompt/PromptEngineeringShowcase'
import ProjectsSectionNew from './components/projects/ProjectsSectionNew'
import ColorThemeSelector from './components/ui/ColorThemeSelector'
import SmoothScroll from './components/transitions/SmoothScroll'
import LoadingScreen from './components/transitions/LoadingScreen'
import { initAnalytics, trackPageView } from './utils/analytics'
import './App.css'
import { useEffect, useState } from 'react'
import { motion, LazyMotion, domAnimation, AnimatePresence } from 'framer-motion'

// Performance optimization: wrap sections in LazyMotion
// and use domAnimation for a smaller bundle size
function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [showMainContent, setShowMainContent] = useState(false);
  const [showDemoOverlay, setShowDemoOverlay] = useState(false);

  const handleLoadingComplete = () => {
    setIsLoading(false);
    // Delay showing main content for smooth transition
    setTimeout(() => {
      setShowMainContent(true);
    }, 300);
  };

  useEffect(() => {
    // Initialize analytics
    initAnalytics();
    
    // Track page view on route change
    const handleRouteChange = () => {
      trackPageView(window.location.pathname);
    };
    
    window.addEventListener('popstate', handleRouteChange);
    
    // Apply performance optimizations when component mounts
    // 1. Add will-change hints for elements that will animate
    document.querySelectorAll('.ultra-smooth, .hover-lift').forEach(el => {
      el.style.willChange = 'transform';
    });
      // 2. Minimal resource preloading
    const preloadResources = () => {
      // Preload only critical images
      const imagesToPreload = [
        { src: './images/prompt-systems.jpg', importance: 'high' }
      ];
      
      // Simplified preloading with error handling
      imagesToPreload.forEach(({src, importance}) => {
        const img = new Image();
        if (importance === 'high') {
          img.setAttribute('fetchpriority', 'high');
        }
        
        // Add error handling to prevent interruptions
        img.onerror = () => {
          // Silently handle image loading errors
          // No console output to keep production clean
        };
        
        img.onload = () => {
          // Image loaded successfully - silently continue
        };
        
        img.src = src;
      });
    };
    
    // Execute after initial render
    setTimeout(preloadResources, 1000);
    
    // 3. Disable animations for users who prefer reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      document.documentElement.classList.add('reduce-motion');
    }
    
    // 4. Initialize intersection observer for lazy loading
    const lazyLoadImages = () => {
      const imgObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            const src = img.getAttribute('data-src');
            if (src) {
              img.src = src;
              img.classList.add('lazy-loaded');
              observer.unobserve(img);
            }
          }
        });
      }, {
        rootMargin: '50px 0px',
        threshold: 0.1
      });
      
      document.querySelectorAll('img[data-src]').forEach(img => {
        imgObserver.observe(img);
      });
    };
    
    lazyLoadImages();
    
    // 5. Global error handling to maintain smooth UX
    window.addEventListener('unhandledrejection', (event) => {
      // Silently handle unhandled promise rejections
      // This prevents console errors from disrupting the user experience
      event.preventDefault();
    });
    
    window.addEventListener('error', (event) => {
      // Silently handle uncaught errors
      // Only log in development mode
      if (import.meta.env.DEV) {
        console.warn('Caught error:', event.error);
      }
      // Prevent default error handling that might disrupt UX
      event.preventDefault();
    });
    
    // Clean up event listeners when component unmounts
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
    
  }, []);

  // Show demo overlay after main content appears
  useEffect(() => {
    if (showMainContent) {
      setShowDemoOverlay(true);
    }
  }, [showMainContent]);

  // Handler to close overlay and highlight button
  const handleCloseDemoOverlay = () => {
    setShowDemoOverlay(false);
    // Highlight the AI Generalist Portfolio button for 3 seconds
    const aiBtn = document.querySelector('[data-ai-portfolio-btn]');
    if (aiBtn) {
      aiBtn.classList.add('highlight-ai-btn');
      setTimeout(() => {
        aiBtn.classList.remove('highlight-ai-btn');
      }, 3000);
    }
  };

  // Main content animation variants
  const mainContentVariants = {
    hidden: { 
      opacity: 0,
      scale: 0.95,
      filter: 'blur(20px)',
      y: 50
    },
    visible: {
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)',
      y: 0,
      transition: {
        duration: 1.2,
        ease: [0.16, 1, 0.3, 1],
        staggerChildren: 0.1
      }
    }
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 1, 0.5, 1]  // Optimized easing curve
      }
    }
  };
  // Modern minimal section divider component that respects color theme
  const SectionDivider = ({ invert }) => (
    <div className={`relative h-24 ${invert ? 'bg-gray-50 dark:bg-gray-950' : 'bg-white dark:bg-gray-900'}`}>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-[1px]" 
           style={{ backgroundColor: 'var(--color-primary)' }}></div>
    </div>
  );

  if (isLoading) {
    return (
      <ThemeProvider>
        <ColorThemeProvider>
          <LoadingScreen onComplete={handleLoadingComplete} />
        </ColorThemeProvider>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <ColorThemeProvider>
        <LazyMotion features={domAnimation}>
          {/* Loading Screen */}
          <AnimatePresence>
            {isLoading && (
              <LoadingScreen onComplete={handleLoadingComplete} />
            )}
          </AnimatePresence>

          {/* Main Content with Smooth Entrance */}
          <AnimatePresence>
            {showMainContent && (
              <motion.div
                className="min-h-screen relative overflow-hidden"
                style={{ position: "relative" }}
                variants={mainContentVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                <Header />
                <SmoothScroll />

                <motion.main className="relative">
                  {/* Hero section with smooth entrance */}
                  <motion.section 
                    className="relative"
                    variants={{
                      hidden: { opacity: 0, scale: 0.98, y: 20 },
                      visible: { 
                        opacity: 1, 
                        scale: 1, 
                        y: 0,
                        transition: { 
                          duration: 1, 
                          ease: [0.16, 1, 0.3, 1] 
                        }
                      }
                    }}
                  >
                    {/* DEMO OVERLAY INSTRUCTIONS (now only on Hero section) */}
                    <AnimatePresence>
                      {showDemoOverlay && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.5 }}
                          className="absolute inset-0 z-[9999] flex items-center justify-center pointer-events-auto"
                          style={{
                            backdropFilter: 'blur(10px)',
                            WebkitBackdropFilter: 'blur(10px)',
                            background: 'rgba(30, 41, 59, 0.45)'
                          }}
                          onClick={handleCloseDemoOverlay}
                        >
                          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-2xl rounded-2xl px-10 py-8 flex flex-col items-center gap-5 max-w-lg mx-auto" onClick={e => e.stopPropagation()}>
                            <span className="text-2xl font-bold text-gray-900 dark:text-white text-center">Welcome to my professional portfolio!</span>
                            <span className="text-lg font-medium text-gray-800 dark:text-gray-100 text-center">
                              This site showcases my <b>professional-specific journey</b>.<br />
                              For my <b>AI Generalist Portfolio</b>, please visit the link in the header above after exploring this site.
                            </span>
                            <span className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center">Click anywhere to continue</span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <HeroSection />
                  </motion.section>
                  
                  <SectionDivider />
                  
                  {/* Expertise section */}
                  <motion.section
                    id="expertise"
                    className="relative bg-white dark:bg-gray-900 cv-auto"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={sectionVariants}
                    style={{ position: "relative" }}
                  >
                    <ExpertiseSection />
                  </motion.section>
                  
                  <SectionDivider />
                    {/* Skills section */}
                  <motion.section
                    id="skills"
                    className="relative bg-gray-50 dark:bg-gray-950 cv-auto"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={sectionVariants}
                    style={{ position: "relative" }}
                  >
                    <SkillsSection />
                  </motion.section>
                  
                  <SectionDivider />
                    {/* Prompt Engineering Showcase section */}
                  <motion.section
                    id="prompt-engineering"
                    className="relative cv-auto"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={sectionVariants}
                    style={{ position: "relative" }}
                  >
                    <PromptEngineeringShowcase />
                  </motion.section>
                  
                  <SectionDivider />
                  
                  {/* Projects section */}
                  <motion.section
                    id="projects"
                    className="relative bg-white dark:bg-gray-900 cv-auto"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={sectionVariants}
                    style={{ position: "relative" }}
                  >
                    <ProjectsSectionNew />
                  </motion.section>
                  
                  <SectionDivider />
                  
                  {/* Timeline section */}
                  <motion.section
                    id="timeline"
                    className="relative bg-gray-50 dark:bg-gray-950 cv-auto"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={sectionVariants}
                    style={{ position: "relative" }}
                  >
                    <TimelineSection />
                  </motion.section>
                </motion.main>
                <Footer />
                <ColorThemeSelector />
              </motion.div>
            )}
          </AnimatePresence>
        </LazyMotion>
      </ColorThemeProvider>
    </ThemeProvider>
  )
}

export default App
