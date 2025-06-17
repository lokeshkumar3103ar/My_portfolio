import React, { useEffect, useContext } from 'react';
import { ColorThemeContext } from '../../context/ColorThemeContext';

// Enhanced smooth scrolling with performance optimizations and theme integration
const SmoothScroll = () => {
  const { currentColors } = useContext(ColorThemeContext);
  
  useEffect(() => {
    // Cache DOM elements and measurements to improve performance
    let sections = new Map();
    let scrolling = false;
    let headerOffset = 80;
    let intersectionObserver = null;
    
    // Performance optimization: use Intersection Observer for better section detection
    const initializeIntersectionObserver = () => {
      const options = {
        root: null,
        rootMargin: '-80px 0px -50% 0px', // Account for header height
        threshold: 0.1
      };

      intersectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const navLink = document.querySelector(`a[href="#${entry.target.id}"]`);
            if (navLink) {
              // Update active nav state
              document.querySelectorAll('nav a').forEach(link => link.classList.remove('active'));
              navLink.classList.add('active');
            }
          }
        });
      }, options);

      // Observe all sections
      document.querySelectorAll('section[id]').forEach(section => {
        intersectionObserver.observe(section);
      });
    };
    
    // Debouncing function to limit the rate of execution
    const debounce = (func, wait) => {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    };
    
    // Update section positions - optimized with Map for faster lookups
    const updateSectionPositions = debounce(() => {
      sections.clear();
      document.querySelectorAll('section[id]').forEach(section => {
        sections.set(section.id, section.offsetTop);
      });
      const header = document.querySelector('header');
      headerOffset = header?.offsetHeight || 80;
    }, 100);
    
    // Initialize section positions and intersection observer
    updateSectionPositions();
    initializeIntersectionObserver();
    
    // Optimized resize handler
    const handleResize = debounce(() => {
      updateSectionPositions();
    }, 200);
    
    window.addEventListener('resize', handleResize, { passive: true });
    
    // Enhanced easing function for more natural scrolling
    const easeInOutCubic = t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    
    // Detect if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Smooth scrolling animation with improved performance and accessibility
    const smoothScrollTo = (targetPosition, duration = prefersReducedMotion ? 0 : 800) => {
      if (prefersReducedMotion) {
        window.scrollTo({ top: targetPosition, behavior: 'auto' });
        scrolling = false;
        return;
      }

      const startPosition = window.pageYOffset;
      const distance = targetPosition - startPosition;
      let startTime = null;
      
      // Cancel any existing scroll animation
      if (window.scrollAnimation) {
        cancelAnimationFrame(window.scrollAnimation);
      }
      
      const animation = currentTime => {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        const ease = easeInOutCubic(progress);
        
        window.scrollTo({
          top: startPosition + distance * ease,
          behavior: 'auto'
        });
        
        if (timeElapsed < duration) {
          window.scrollAnimation = requestAnimationFrame(animation);
        } else {
          scrolling = false;
          window.scrollAnimation = null;
        }
      };
      
      window.scrollAnimation = requestAnimationFrame(animation);
    };    
    // Handle anchor link clicks with improved performance and mobile support
    const handleAnchorClick = (e) => {
      const href = e.currentTarget.getAttribute('href');
      
      if (href?.startsWith('#') && href.length > 1) {
        e.preventDefault();
        
        if (scrolling) return; // Prevent multiple scroll animations
        scrolling = true;
        
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          // Calculate target position accounting for header
          const targetPosition = Math.max(0, targetElement.offsetTop - headerOffset);
          
          // Apply smooth scrolling with custom easing
          smoothScrollTo(targetPosition);
          
          // Update URL without reloading the page
          if (history.pushState) {
            history.pushState(null, null, href);
          } else {
            window.location.hash = href; // Fallback
          }
          
          // Improved scroll indicator that's more mobile-friendly
          if (!prefersReducedMotion) {
            const indicator = document.createElement('div');
            indicator.className = 'scroll-indicator';
            indicator.style.cssText = `
              position: fixed;
              bottom: 20px;
              right: 20px;
              width: 6px;
              height: 6px;
              border-radius: 50%;
              background-color: ${currentColors.primary};
              opacity: 0.8;
              z-index: 9999;
              transform: scale(0);
              transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
              pointer-events: none;
            `;
            document.body.appendChild(indicator);
            
            // Animate indicator
            requestAnimationFrame(() => {
              indicator.style.transform = 'scale(1)';
            });
            
            // Remove indicator after scroll completes
            setTimeout(() => {
              indicator.style.opacity = '0';
              indicator.style.transform = 'scale(0)';
              setTimeout(() => {
                if (document.body.contains(indicator)) {
                  document.body.removeChild(indicator);
                }
              }, 300);
            }, 800);
          }
        }
      }
    };

    // Apply to all anchor links on the page with better event delegation
    const addAnchorListeners = () => {
      document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', handleAnchorClick, { passive: false });
      });
    };

    // Initial setup
    addAnchorListeners();

    // Watch for dynamically added anchor links
    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) { // Element node
            const newAnchors = node.querySelectorAll?.('a[href^="#"]') || [];
            newAnchors.forEach(link => {
              link.addEventListener('click', handleAnchorClick, { passive: false });
            });
          }
        });
      });
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Cleanup function
    return () => {
      document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.removeEventListener('click', handleAnchorClick);
      });
      window.removeEventListener('resize', handleResize);
      
      if (intersectionObserver) {
        intersectionObserver.disconnect();
      }
      
      if (mutationObserver) {
        mutationObserver.disconnect();
      }
      
      if (window.scrollAnimation) {
        cancelAnimationFrame(window.scrollAnimation);
      }
    };
  }, [currentColors]);

  return null; // This component doesn't render anything
};

export default SmoothScroll;
