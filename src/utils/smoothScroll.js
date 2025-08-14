// Lenis + GSAP ScrollTrigger integration for buttery smooth scrolling
// Centralized helper so components can call smoothScrollTo without conflicting behaviors

import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let lenis = null;
let rafId = null;

export function initSmoothScroll() {
  // Respect reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    cleanupSmoothScroll();
    return null;
  }

  // Avoid double init
  if (lenis) return lenis;

  lenis = new Lenis({
    duration: 1.6, // balanced duration for buttery feel
    easing: (t) => 1 - Math.pow(1 - t, 3), // easeOutCubic
    smoothWheel: true,
    smoothTouch: false,
    touchMultiplier: 1.2,
    syncTouch: true,
    gestureOrientation: 'vertical'
  });

  // Bridge Lenis to ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update);

  const raf = (time) => {
    lenis?.raf(time);
    rafId = requestAnimationFrame(raf);
  };
  rafId = requestAnimationFrame(raf);

  // Let ScrollTrigger use proxy methods if needed (for future pinned sections)
  ScrollTrigger.scrollerProxy(document.documentElement, {
    scrollTop(value) {
      if (arguments.length) {
        lenis?.scrollTo(value, { immediate: false });
      }
      return window.scrollY || document.documentElement.scrollTop;
    },
    getBoundingClientRect() {
      return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
    },
  });

  // Update on resize
  const handleResize = () => {
    ScrollTrigger.refresh();
  };
  window.addEventListener('resize', handleResize, { passive: true });

  // Smooth keyboard scrolling (arrows, page up/down, home/end, space)
  const isEditable = (el) => {
    if (!el) return false;
    const tag = el.tagName;
    return (
      el.isContentEditable ||
      tag === 'INPUT' ||
      tag === 'TEXTAREA' ||
      tag === 'SELECT'
    );
  };

  const hasScrollableAncestor = (el) => {
    let node = el;
    let hops = 0;
    while (node && node !== document.body && hops < 5) {
      const style = window.getComputedStyle(node);
      const overflowY = style.overflowY;
      const canScroll = node.scrollHeight > node.clientHeight && (overflowY === 'auto' || overflowY === 'scroll');
      if (canScroll) return true;
      node = node.parentElement;
      hops++;
    }
    return false;
  };

  const onKeyDown = (e) => {
    if (!lenis) return;
    if (e.defaultPrevented) return;

    const target = e.target;
    if (isEditable(target) || hasScrollableAncestor(target)) return;

    const height = window.innerHeight;
    const arrowStep = Math.max(80, Math.min(160, Math.round(height * 0.12))); // adaptive step
    const pageStep = Math.round(height * 0.85);
    const maxY = Math.max(0, document.documentElement.scrollHeight - height);
    const currentY = window.scrollY || document.documentElement.scrollTop || 0;

    let handled = true;
    switch (e.key) {
      case 'ArrowDown':
        lenis.scrollTo(Math.min(currentY + arrowStep, maxY));
        break;
      case 'ArrowUp':
        lenis.scrollTo(Math.max(currentY - arrowStep, 0));
        break;
      case 'PageDown':
        lenis.scrollTo(Math.min(currentY + pageStep, maxY));
        break;
      case 'PageUp':
        lenis.scrollTo(Math.max(currentY - pageStep, 0));
        break;
      case 'Home':
        lenis.scrollTo(0);
        break;
      case 'End':
        lenis.scrollTo(maxY);
        break;
      case ' ': // Space
        if (e.shiftKey) {
          lenis.scrollTo(Math.max(currentY - pageStep, 0));
        } else {
          lenis.scrollTo(Math.min(currentY + pageStep, maxY));
        }
        break;
      default:
        handled = false;
    }

    if (handled) {
      e.preventDefault(); // prevent native jump for a unified smooth feel
    }
  };
  window.addEventListener('keydown', onKeyDown, { passive: false });

  // Store cleanup callback on instance
  lenis._cleanup = () => {
    window.removeEventListener('resize', handleResize);
    window.removeEventListener('keydown', onKeyDown);
  };

  // Add helper class for CSS if needed
  document.documentElement.classList.add('has-scroll-smooth');

  return lenis;
}

export function cleanupSmoothScroll() {
  document.documentElement.classList.remove('has-scroll-smooth');
  if (rafId) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
  if (lenis) {
    lenis._cleanup?.();
    lenis.destroy();
    lenis = null;
  }
}

export function smoothScrollTo(target, options = {}) {
  // Target can be selector, element, or number (y position)
  const defaultOpts = { offset: 0, immediate: false }; // Lenis options
  const opts = { ...defaultOpts, ...options };

  if (lenis) {
    lenis.scrollTo(target, opts);
  } else {
    // Fallback to native smooth
    if (typeof target === 'number') {
      window.scrollTo({ top: target - (opts.offset || 0), behavior: 'smooth' });
    } else {
      const el = typeof target === 'string' ? document.querySelector(target) : target;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const y = rect.top + window.pageYOffset - (opts.offset || 0);
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }
}

export function getLenisInstance() {
  return lenis;
}
