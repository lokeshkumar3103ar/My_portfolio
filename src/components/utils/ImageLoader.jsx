import React, { useState, useEffect } from 'react';
import useIntersectionObserver from '../../utils/useIntersectionObserver';

/**
 * Component for progressively loading images with blur effect
 * 
 * @param {Object} props
 * @param {string} props.src - Main image source
 * @param {string} props.alt - Image alt text
 * @param {string} props.placeholderSrc - Low quality placeholder image source
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.imgProps - Additional props for the img element
 */
const ImageLoader = ({ 
  src, 
  alt, 
  placeholderSrc, 
  className = '', 
  width, 
  height,
  priority = false,
  ...imgProps 
}) => {
  const [loaded, setLoaded] = useState(false);
  const [ref, isInView] = useIntersectionObserver();
  const [imageSrc, setImageSrc] = useState(placeholderSrc || '');
  
  // Load image when in viewport or immediately if priority
  useEffect(() => {
    if (isInView || priority) {
      const img = new Image();
      img.src = src;
      
      img.onload = () => {
        setImageSrc(src);
        setLoaded(true);
      };
      
      // Add error handling for failed image loads
      img.onerror = () => {
        // If main image fails to load, keep placeholder
        // Silently handle the error to maintain smooth UX
        setLoaded(true); // Still mark as "loaded" to remove blur
      };
      
      // Set loading attribute based on priority
      if (priority) {
        return () => {
          img.onload = null;
          img.onerror = null;
        };
      }
    }
  }, [src, isInView, priority]);
  
  return (
    <div 
      ref={!priority ? ref : undefined} 
      className={`overflow-hidden relative ${className}`} 
      style={{ width, height }}
    >
      <img
        src={imageSrc}
        alt={alt}
        className={`
          transition-all duration-500 ease-in-out
          ${loaded ? 'blur-0 scale-100' : 'blur-sm scale-105'}
        `}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        fetchpriority={priority ? 'high' : 'auto'}
        {...imgProps}
      />
    </div>
  );
};

export default ImageLoader;
