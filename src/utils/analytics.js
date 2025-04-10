/**
 * Simple analytics helper with basic performance tracking
 * Can be connected to any analytics service
 */

// Track page views
export const trackPageView = (url) => {
  try {
    // Report page view
    console.log(`Page view: ${url}`);
    
    // Here you would add actual analytics service code
    // Example: gtag('config', 'GA_MEASUREMENT_ID', { 'page_path': url });
  } catch (e) {
    console.error('Analytics error:', e);
  }
};

// Track user interactions
export const trackEvent = (category, action, label, value) => {
  try {
    console.log(`Event: ${category} - ${action} - ${label} - ${value}`);
    // Example: gtag('event', action, { event_category: category, event_label: label, value: value });
  } catch (e) {
    console.error('Analytics error:', e);
  }
};

// Track performance metrics manually instead of using web-vitals
export const trackPerformance = () => {
  // Using Performance API which is widely supported
  if (window.performance) {
    // Get navigation timing data
    let perfEntries = performance.getEntriesByType('navigation');
    
    if (perfEntries.length > 0) {
      const timing = perfEntries[0];
      
      // Calculate key metrics
      const loadTime = timing.loadEventEnd - timing.navigationStart;
      const domComplete = timing.domComplete - timing.domInteractive;
      const firstPaint = performance.getEntriesByName('first-paint');
      const firstContentfulPaint = performance.getEntriesByName('first-contentful-paint');
      
      // Log metrics
      console.log(`Load Time: ${Math.round(loadTime)}ms`);
      if (firstPaint.length > 0) {
        console.log(`First Paint: ${Math.round(firstPaint[0].startTime)}ms`);
      }
      if (firstContentfulPaint.length > 0) {
        console.log(`First Contentful Paint: ${Math.round(firstContentfulPaint[0].startTime)}ms`);
      }
      console.log(`DOM Complete: ${Math.round(domComplete)}ms`);
      
      // Send metrics to analytics
      trackEvent('Performance', 'load_time', 'value', Math.round(loadTime));
      if (firstPaint.length > 0) {
        trackEvent('Performance', 'first_paint', 'value', Math.round(firstPaint[0].startTime));
      }
      if (firstContentfulPaint.length > 0) {
        trackEvent('Performance', 'first_contentful_paint', 'value', Math.round(firstContentfulPaint[0].startTime));
      }
    }
    
    // Resource timing
    const resources = performance.getEntriesByType('resource');
    let slowResources = resources
      .filter(resource => resource.duration > 1000) // Filter slow resources
      .slice(0, 5); // Get top 5 slow resources
    
    if (slowResources.length > 0) {
      console.log('Slow resources:');
      slowResources.forEach(resource => {
        console.log(`${resource.name}: ${Math.round(resource.duration)}ms`);
      });
    }
  }
  
  // Set up observer for largest contentful paint if supported
  if ('PerformanceObserver' in window) {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.log(`Largest Contentful Paint: ${Math.round(lastEntry.startTime)}ms`);
        trackEvent('Performance', 'largest_contentful_paint', 'value', Math.round(lastEntry.startTime));
      });
      
      observer.observe({ type: 'largest-contentful-paint', buffered: true });
      
      // Observe layout shifts if supported
      const clsObserver = new PerformanceObserver((list) => {
        let cumulativeScore = 0;
        list.getEntries().forEach(entry => {
          cumulativeScore += entry.value;
        });
        console.log(`Cumulative Layout Shift: ${cumulativeScore.toFixed(3)}`);
        trackEvent('Performance', 'cumulative_layout_shift', 'value', cumulativeScore.toFixed(3));
      });
      
      clsObserver.observe({ type: 'layout-shift', buffered: true });
    } catch (e) {
      console.error('Performance observer error:', e);
    }
  }
};

// Initialize analytics 
export const initAnalytics = () => {
  // Track initial page view
  trackPageView(window.location.pathname);
  
  // Track performance metrics after load
  window.addEventListener('load', () => {
    // Small delay to ensure all metrics are available
    setTimeout(() => {
      trackPerformance();
    }, 1000);
  });
  
  // Track performance metrics
  if (window.performance) {
    const perfData = window.performance.timing;
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
    
    if (pageLoadTime > 0) {
      console.log(`Page load time: ${pageLoadTime}ms`);
      trackEvent('Performance', 'page_load', 'time', pageLoadTime);
    }
  }
};
