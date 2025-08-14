import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register the ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

/**
 * Parallax component that creates scroll-based movement effects
 * 
 * @param {Object} props
 * @param {string} props.type - Type of parallax effect: 'background' or 'element'
 * @param {string} props.direction - Direction of movement: 'up', 'down', 'left', 'right'
 * @param {number} props.speed - Speed factor for the parallax effect (0.1 to 1.0)
 * @param {React.ReactNode} props.children - Children elements
 * @param {string} props.className - Additional CSS classes
 */
const Parallax = ({
  type = 'background',
  direction = 'up',
  speed = 0.2,
  children,
  className = '',
  style = {},
  ...props
}) => {
  const ref = useRef(null);
  
  useEffect(() => {
    if (!ref.current) return;
    
    const element = ref.current;
    
    // Define movement directions
    let xTo = '0';
    let yTo = '0';
    
    switch (direction) {
      case 'up':
        yTo = `${speed * 100}%`;
        break;
      case 'down':
        yTo = `-${speed * 100}%`;
        break;
      case 'left':
        xTo = `${speed * 100}%`;
        break;
      case 'right':
        xTo = `-${speed * 100}%`;
        break;
    }
    
    // Calculate offsets for foreground elements
    const hasMovingChildren = type === 'background';
    const target = hasMovingChildren ? element.querySelector('.parallax-inner') : element;
    
    if (!target) return;
    
    // Create the parallax animation
    gsap.fromTo(
      target,
      {
        y: type === 'background' ? -yTo : 0,
        x: type === 'background' ? -xTo : 0
      },
      {
        y: type === 'background' ? 0 : yTo,
        x: type === 'background' ? 0 : xTo,
        ease: 'none',
        scrollTrigger: {
          trigger: element,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        }
      }
    );
    
    // Clean up on component unmount
    return () => {
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.vars.trigger === element) {
          trigger.kill();
        }
      });
    };
  }, [type, direction, speed]);
  
  // Apply different structures based on parallax type
  return type === 'background' ? (
    <div 
      ref={ref} 
      className={`relative overflow-hidden ${className}`} 
      style={{ ...style, willChange: 'transform' }}
      {...props}
    >
      <div className="parallax-inner absolute inset-0" style={{ height: '110%', width: '110%', top: '-5%', left: '-5%' }}>
        {children}
      </div>
    </div>
  ) : (
    <div 
      ref={ref} 
      className={`parallax-element ${className}`} 
      style={{ ...style, willChange: 'transform' }}
      {...props}
    >
      {children}
    </div>
  );
};

export default Parallax;