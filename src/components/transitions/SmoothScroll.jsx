import React, { useEffect, useContext } from 'react';
import { ColorThemeContext } from '../../context/ColorThemeContext';

// Enhanced smooth scrolling with performance optimizations and theme integration
const SmoothScroll = () => {
  const { currentColors } = useContext(ColorThemeContext);
  
  useEffect(() => {
    // Cache DOM elements and measurements to improve performance
    let sections = {};
    let scrolling = false;
    let headerOffset = 80; // Adjust based on your header height
    
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
    
    // Update section positions - debounced to improve performance during resize
    const updateSectionPositions = debounce(() => {
      document.querySelectorAll('section[id]').forEach(section => {
        sections[section.id] = section.offsetTop;
      });
      headerOffset = document.querySelector('header')?.offsetHeight || 80;
    }, 100);
    
    // Initialize section positions
    updateSectionPositions();
    
    // Update on window resize
    window.addEventListener('resize', updateSectionPositions);
    
    // Custom easing function for more natural scrolling
    const easeInOutQuad = t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    
    // Smooth scrolling animation with improved performance
    const smoothScrollTo = (targetPosition, duration = 800) => {
      const startPosition = window.pageYOffset;
      const distance = targetPosition - startPosition;
      let startTime = null;
      
      const animation = currentTime => {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        const ease = easeInOutQuad(progress);
        
        window.scrollTo({
          top: startPosition + distance * ease,
          behavior: 'auto' // Use 'auto' instead of 'smooth' for custom animation
        });
        
        if (timeElapsed < duration) {
          requestAnimationFrame(animation);
        } else {
          scrolling = false;
        }
      };
      
      requestAnimationFrame(animation);
    };
    
    // Handle anchor link clicks with improved performance
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
          const targetPosition = targetElement.offsetTop - headerOffset;
          
          // Apply smooth scrolling with custom easing
          smoothScrollTo(targetPosition);
          
          // Update URL without reloading the page
          if (history.pushState) {
            history.pushState(null, null, href);
          } else {
            window.location.hash = href; // Fallback
          }
          
          // Add a subtle scrolling indicator using theme colors
          const indicator = document.createElement('div');
          indicator.style.position = 'fixed';
          indicator.style.bottom = '20px';
          indicator.style.right = '20px';
          indicator.style.width = '8px';
          indicator.style.height = '8px';
          indicator.style.borderRadius = '50%';
          indicator.style.backgroundColor = currentColors.primary;
          indicator.style.opacity = '0.8';
          indicator.style.zIndex = '9999';
          indicator.style.transition = 'transform 0.3s, opacity 0.3s';
          document.body.appendChild(indicator);
          
          // Remove indicator after scroll completes
          setTimeout(() => {
            indicator.style.opacity = '0';
            setTimeout(() => {
              document.body.removeChild(indicator);
            }, 300);
          }, 800);
        }
      }
    };

    // Apply to all anchor links on the page
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
      link.addEventListener('click', handleAnchorClick);
    });

    return () => {
      anchorLinks.forEach(link => {
        link.removeEventListener('click', handleAnchorClick);
      });
      window.removeEventListener('resize', updateSectionPositions);
    };
  }, [currentColors]);

  return null; // This component doesn't render anything
};

export default SmoothScroll;
