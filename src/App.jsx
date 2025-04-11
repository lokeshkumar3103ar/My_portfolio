import { ThemeProvider } from './context/ThemeContext'
import { ColorThemeProvider } from './context/ColorThemeContext'
import Header from './components/common/Header'
import Footer from './components/common/Footer'
import HeroSection from './components/home/HeroSection'
import ExpertiseSection from './components/expertise/ExpertiseSection'
import SkillsSection from './components/skills/SkillsSection'
import TimelineSection from './components/timeline/TimelineSection'
import PromptEngineeringShowcase from './components/prompt/PromptEngineeringShowcase'
import ColorThemeSelector from './components/ui/ColorThemeSelector'
import SmoothScroll from './components/transitions/SmoothScroll'
import { initAnalytics, trackPageView } from './utils/analytics'
import './App.css'
import { useEffect } from 'react'
import { motion, LazyMotion, domAnimation } from 'framer-motion'

// Performance optimization: wrap sections in LazyMotion
// and use domAnimation for a smaller bundle size
function App() {
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
    
    // 2. Preload critical resources
    const preloadResources = () => {
      // Preload important images
      const imagesToPreload = [
        { src: './images/aigenesis-project.jpeg', importance: 'high' },
        { src: './images/attendance-system.png', importance: 'medium' },
        { src: './images/prompt-systems.jpg', importance: 'medium' }
      ];
      
      // Use importance attribute for loading priority
      imagesToPreload.forEach(({src, importance}) => {
        const img = new Image();
        if (importance === 'high') {
          img.setAttribute('fetchpriority', 'high');
          img.setAttribute('loading', 'eager');
        } else {
          img.setAttribute('loading', 'lazy');
        }
        img.src = src;
      });
      
      // Add link preconnect for external resources
      const preconnectUrls = ['https://github.com', 'https://linkedin.com'];
      preconnectUrls.forEach(url => {
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = url;
        document.head.appendChild(link);
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
    
    // Clean up event listeners when component unmounts
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
    
  }, []);

  // Page section transition variants with improved easing
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

  // Modern minimal section divider component
  const SectionDivider = ({ invert }) => (
    <div className={`relative h-24 ${invert ? 'bg-[#f5f5f7] dark:bg-[#101013]' : 'bg-white dark:bg-gray-900'}`}>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-[1px] bg-gray-200 dark:bg-gray-800"></div>
    </div>
  );

  return (
    <ThemeProvider>
      <ColorThemeProvider>
        <LazyMotion features={domAnimation}>
          <div className="min-h-screen relative overflow-hidden" style={{ position: "relative" }}>
            <Header />
            <SmoothScroll />
            
            <main className="relative">
              {/* Hero section with grid background */}
              <section className="relative">
                <HeroSection />
              </section>
              
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
              
              <SectionDivider invert />
              
              {/* Skills section */}
              <motion.section
                id="skills"
                className="relative bg-[#f5f5f7] dark:bg-[#101013] cv-auto"
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
              
              <SectionDivider invert />
              
              {/* Timeline section */}
              <motion.section
                id="timeline"
                className="relative bg-white dark:bg-gray-900 cv-auto"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={sectionVariants}
                style={{ position: "relative" }}
              >
                <TimelineSection />
              </motion.section>
            </main>
            <Footer />
            <ColorThemeSelector />
          </div>
        </LazyMotion>
      </ColorThemeProvider>
    </ThemeProvider>
  )
}

export default App
