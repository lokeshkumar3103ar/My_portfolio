import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook for Intersection Observer API
 * 
 * @param {Object} options - IntersectionObserver options
 * @param {Element} options.root - The element that is used as the viewport for checking visibility
 * @param {string} options.rootMargin - Margin around the root
 * @param {number|Array<number>} options.threshold - A single number or array of numbers between 0 and 1
 * @param {boolean} options.once - Whether to disconnect observer after element is intersected once
 * @returns {[React.RefObject, boolean]} - A tuple containing a ref and intersection state
 */
export default function useIntersectionObserver({
  root = null,
  rootMargin = '0px',
  threshold = 0.1,
  once = true
} = {}) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const targetRef = useRef(null);
  const observerRef = useRef(null);

  useEffect(() => {
    if (!targetRef.current) return;

    // Clean up previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Create new observer
    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        const isEntryIntersecting = entry.isIntersecting;
        setIsIntersecting(isEntryIntersecting);

        // Disconnect observer if once option is true and element is intersecting
        if (once && isEntryIntersecting && observerRef.current) {
          observerRef.current.disconnect();
        }
      },
      { root, rootMargin, threshold }
    );

    // Start observing
    observerRef.current.observe(targetRef.current);

    // Cleanup function
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [root, rootMargin, threshold, once]);

  return [targetRef, isIntersecting];
}
