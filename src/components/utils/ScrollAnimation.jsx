import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

/**
 * ScrollAnimation component that creates scroll-based animations
 * 
 * @param {Object} props
 * @param {string} props.animation - Predefined animation type: 'fade', 'slideUp', 'slideDown', 'slideLeft', 'slideRight', 'scale', 'custom'
 * @param {Object} props.from - Custom starting properties for the animation (for 'custom' animation)
 * @param {Object} props.to - Custom ending properties for the animation (for 'custom' animation)
 * @param {number} props.delay - Delay before the animation starts (in seconds)
 * @param {number} props.duration - Duration of the animation (in seconds)
 * @param {string} props.ease - Easing function for the animation
 * @param {string} props.start - ScrollTrigger start position
 * @param {string} props.end - ScrollTrigger end position
 * @param {boolean} props.scrub - Whether the animation should scrub with scroll
 * @param {React.ReactNode} props.children - Children elements
 * @param {string} props.className - Additional CSS classes
 */
const ScrollAnimation = ({
  animation = 'fade',
  from = {},
  to = {},
  delay = 0,
  duration = 0.8,
  ease = 'power2.out',
  start = 'top 80%',
  end = 'bottom 20%',
  scrub = false,
  children,
  className = '',
  ...props
}) => {
  const ref = useRef(null);
  
  useEffect(() => {
    if (!ref.current) return;
    
    const element = ref.current;
    let fromProps = {};
    let toProps = {};
    
    // Define preset animations
    switch (animation) {
      case 'fade':
        fromProps = { opacity: 0 };
        toProps = { opacity: 1 };
        break;
      case 'slideUp':
        fromProps = { opacity: 0, y: 50 };
        toProps = { opacity: 1, y: 0 };
        break;
      case 'slideDown':
        fromProps = { opacity: 0, y: -50 };
        toProps = { opacity: 1, y: 0 };
        break;
      case 'slideLeft':
        fromProps = { opacity: 0, x: 50 };
        toProps = { opacity: 1, x: 0 };
        break;
      case 'slideRight':
        fromProps = { opacity: 0, x: -50 };
        toProps = { opacity: 1, x: 0 };
        break;
      case 'scale':
        fromProps = { opacity: 0, scale: 0.8 };
        toProps = { opacity: 1, scale: 1 };
        break;
      case 'custom':
        fromProps = from;
        toProps = to;
        break;
      default:
        fromProps = { opacity: 0 };
        toProps = { opacity: 1 };
    }
    
    // Configure scrollTrigger options
    const scrollTriggerOptions = {
      trigger: element,
      start,
      end: scrub ? end : 'bottom 20%',
      scrub: scrub ? 0.5 : false,
      // Uncomment to debug:
      // markers: true,
    };
    
    // Set initial state
    gsap.set(element, fromProps);
    
    // Create animation
    const tl = gsap.timeline({
      scrollTrigger: scrollTriggerOptions,
      delay: scrub ? 0 : delay,
    });
    
    // Add animation to timeline
    tl.to(element, {
      ...toProps,
      duration: scrub ? 1 : duration,
      ease: ease,
    });
    
    // Clean up on component unmount
    return () => {
      if (tl) tl.kill();
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.vars.trigger === element) {
          trigger.kill();
        }
      });
    };
  }, [animation, from, to, delay, duration, ease, start, end, scrub]);
  
  return (
    <div 
      ref={ref} 
      className={className} 
      style={{ willChange: 'transform, opacity' }}
      {...props}
    >
      {children}
    </div>
  );
};

export default ScrollAnimation;