/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary, #1D4ED8)', // Default with CSS variable
        secondary: 'var(--color-secondary, #9333EA)', // Default with CSS variable
        accent: 'var(--color-accent, #F472B6)', // Added accent color
        background: 'var(--color-background, #F9FAFB)',
        'background-dark': 'var(--color-background-dark, #1F2937)',
        text: 'var(--color-text, #111827)',
        'text-dark': 'var(--color-text-dark, #E5E7EB)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'morph': 'morph 8s ease-in-out infinite',
        'gradient': 'gradientAnimation 15s ease infinite',
        // Added new animations for smoother experience
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'slide-down': 'slideDown 0.6s ease-out forwards',
        'slide-left': 'slideLeft 0.6s ease-out forwards',
        'slide-right': 'slideRight 0.6s ease-out forwards',
        'scale': 'scale 0.5s ease-out forwards',
        'pulse-subtle': 'pulseSubtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'blur-in': 'blurIn 0.7s ease-out forwards',
        'blur-out': 'blurOut 0.5s ease-out forwards',
        'parallax-slow': 'parallaxSlow 1s linear infinite',
        'parallax-medium': 'parallaxMedium 1s linear infinite',
        'parallax-fast': 'parallaxFast 1s linear infinite',
        'spin-slow': 'spin 3s linear infinite',
        'bounce-subtle': 'bounceSubtle 1.5s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        morph: {
          '0%, 100%': { borderRadius: '60% 40% 30% 70%/60% 30% 70% 40%' },
          '50%': { borderRadius: '30% 60% 70% 40%/50% 60% 30% 60%' },
        },
        gradientAnimation: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideLeft: {
          '0%': { transform: 'translateX(20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideRight: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        scale: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.85' },
        },
        blurIn: {
          '0%': { filter: 'blur(8px)', opacity: '0' },
          '100%': { filter: 'blur(0)', opacity: '1' },
        },
        blurOut: {
          '0%': { filter: 'blur(0)', opacity: '1' },
          '100%': { filter: 'blur(8px)', opacity: '0' },
        },
        parallaxSlow: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-5%)' },
        },
        parallaxMedium: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-10%)' },
        },
        parallaxFast: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-15%)' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
        'width': 'width',
        'transform': 'transform',
        'opacity-transform': 'opacity, transform',
        'colors-transform': 'color, background-color, border-color, transform',
        'blur': 'filter, opacity',
      },
      transitionDuration: {
        '0': '0ms',
        '2000': '2000ms',
        '2500': '2500ms',
        '3000': '3000ms',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.25, 0.1, 0.25, 1)',
        'bounce': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'out-expo': 'cubic-bezier(0.19, 1, 0.22, 1)',
        'in-expo': 'cubic-bezier(0.95, 0.05, 0.795, 0.035)',
      },
      willChange: {
        'transform': 'transform',
        'opacity': 'opacity',
        'filter': 'filter',
        'auto': 'auto',
      },
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        DEFAULT: '8px',
        lg: '12px',
        xl: '16px',
        '2xl': '24px',
      },
    },
  },
  plugins: [
    function({ addUtilities }) {
      const newUtilities = {
        '.backface-hidden': {
          'backface-visibility': 'hidden',
          '-webkit-backface-visibility': 'hidden',
        },
        '.perspective': {
          'perspective': '1000px',
          'transform-style': 'preserve-3d',
        },
        '.gpu-accelerated': {
          'transform': 'translateZ(0)',
          'will-change': 'transform',
        },
        '.smooth-scrolling': {
          'scroll-behavior': 'smooth',
        },
        '.content-visibility-auto': {
          'content-visibility': 'auto',
        },
        '.parallax-container': {
          'overflow': 'hidden',
          'perspective': '8px',
          'perspective-origin': 'center top',
        },
        '.parallax-layer-back': {
          'transform': 'translateZ(0)',
          'transform-origin': 'center top',
          'z-index': '-1',
        },
        '.parallax-layer-base': {
          'transform': 'translateZ(2px) scale(0.75)',
          'transform-origin': 'center top',
          'z-index': '0',
        },
        '.parallax-layer-front': {
          'transform': 'translateZ(4px) scale(0.5)',
          'transform-origin': 'center top',
          'z-index': '1',
        },
        '.reduce-motion': {
          '@media (prefers-reduced-motion: reduce)': {
            'animation': 'none !important',
            'transition': 'none !important',
            'scroll-behavior': 'auto !important',
          },
        },
      };
      addUtilities(newUtilities);
    },
  ],
}