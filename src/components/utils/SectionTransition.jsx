import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

/**
 * SectionTransition component for smooth transitions between sections
 * 
 * @param {Object} props
 * @param {string} props.id - Section ID
 * @param {string} props.type - Transition type: 'fade', 'reveal', 'slide', 'zoom', 'rotate'
 * @param {string} props.background - Background color/gradient
 * @param {React.ReactNode} props.children - Section content
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.style - Additional inline styles
 */
const SectionTransition = ({
  id,
  type = 'fade',
  background,
  children,
  className = '',
  style = {},
  ...props
}) => {
  const sectionRef = useRef(null);
  const overlayRef = useRef(null);
  const [isInView, setIsInView] = useState(false);
  
  useEffect(() => {
    if (!sectionRef.current) return;
    
    // Use Intersection Observer for better performance
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          // Once the animation is triggered, we can unobserve
          if (sectionRef.current) {
            observer.unobserve(sectionRef.current);
          }
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.15
      }
    );
    
    observer.observe(sectionRef.current);
    
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);
  
  useEffect(() => {
    if (!sectionRef.current || !isInView) return;
    
    const section = sectionRef.current;
    const overlay = overlayRef.current;
    
    // Set up different transition types
    switch (type) {
      case 'reveal': {
        // Reveal transition slides an overlay away to reveal content
        if (!overlay) break;
        
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            end: 'top 20%',
            scrub: 0.6,
          }
        });
        
        tl.fromTo(overlay, 
          { scaleX: 1, transformOrigin: 'left' },
          { scaleX: 0, ease: 'power2.inOut', duration: 1.2 }
        );
        
        break;
      }
      
      case 'slide': {
        // Slide transition moves content in from the side
        const elements = section.querySelectorAll('.transition-element');
        
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            end: 'top 20%',
            scrub: 0.3,
          }
        });
        
        // Stagger animate each element
        tl.fromTo(elements,
          { x: 100, opacity: 0 },
          { x: 0, opacity: 1, stagger: 0.1, duration: 0.8, ease: 'power2.out' }
        );
        
        break;
      }
      
      case 'zoom': {
        // Zoom transition scales the section up
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            end: 'top 20%',
            scrub: 0.4,
          }
        });
        
        tl.fromTo(section,
          { scale: 0.9, opacity: 0 },
          { scale: 1, opacity: 1, duration: 1, ease: 'power1.out' }
        );
        
        break;
      }
      
      case 'rotate': {
        // Rotation transition with 3D effect
        const elements = section.querySelectorAll('.transition-element');
        
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            end: 'top 20%',
            scrub: 0.3,
          }
        });
        
        tl.fromTo(elements,
          { rotationY: 45, opacity: 0, transformPerspective: 1000 },
          { 
            rotationY: 0, 
            opacity: 1, 
            stagger: 0.08,
            duration: 1, 
            ease: 'power2.out' 
          }
        );
        
        break;
      }
      
      case 'fade':
      default: {
        // Simple fade transition
        gsap.fromTo(section,
          { opacity: 0 },
          { 
            opacity: 1, 
            duration: 0.8,
            scrollTrigger: {
              trigger: section,
              start: 'top 80%',
              end: 'top 20%',
              scrub: 0.3,
            },
            ease: 'power1.out'
          }
        );
      }
    }
    
    // Create a parallax effect on background
    if (background) {
      const bgLayer = document.createElement('div');
      bgLayer.className = 'absolute inset-0 -z-10';
      bgLayer.style.background = background;
      section.appendChild(bgLayer);
      
      gsap.fromTo(bgLayer,
        { y: '-20%' },
        { 
          y: '20%', 
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          }
        }
      );
    }
    
    return () => {
      // Clean up
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.vars.trigger === section) {
          trigger.kill();
        }
      });
    };
  }, [type, background, isInView]);
  
  return (
    <section 
      id={id} 
      ref={sectionRef} 
      className={`relative overflow-hidden gpu-accelerated ${className}`} 
      style={{ willChange: "transform, opacity", ...style }}
      {...props}
    >
      {/* Overlay for reveal transition */}
      {type === 'reveal' && (
        <div 
          ref={overlayRef}
          className="absolute inset-0 bg-white dark:bg-gray-900 z-10"
        />
      )}
      {/* Wrapper for the section content */}
      <div className="relative z-1">
        {children}
      </div>
    </section>
  );
};

export default SectionTransition;