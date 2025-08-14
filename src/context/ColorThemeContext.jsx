import React, { createContext, useState, useEffect } from 'react';

// Enhanced color themes with more properties for comprehensive styling
export const colorThemes = {
  blue: {
    primary: '#1D4ED8',
    secondary: '#9333EA',
    accent: '#F59E0B',
    name: 'Blue-Purple',
    gradient: 'linear-gradient(135deg, #1D4ED8, #9333EA)'
  }
};

export const ColorThemeContext = createContext();

export const ColorThemeProvider = ({ children }) => {
  // Get saved theme from localStorage or use default
  const [activeTheme, setActiveTheme] = useState(() => {
    const savedTheme = localStorage.getItem('colorTheme');
    return savedTheme && colorThemes[savedTheme] ? savedTheme : 'blue';
  });

  // Apply theme to CSS variables
  useEffect(() => {
    const theme = colorThemes[activeTheme];
    if (theme) {
      // Main theme colors
      document.documentElement.style.setProperty('--color-primary', theme.primary);
      document.documentElement.style.setProperty('--color-secondary', theme.secondary);
      document.documentElement.style.setProperty('--color-accent', theme.accent);
      
      // Generate and set additional color variants
      const primaryRgb = hexToRgb(theme.primary);
      const secondaryRgb = hexToRgb(theme.secondary);
      if (primaryRgb && secondaryRgb) {
        // Primary color with different opacities
        document.documentElement.style.setProperty('--color-primary-light', `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.1)`);
        document.documentElement.style.setProperty('--color-primary-medium', `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.5)`);
        
        // Secondary color with different opacities
        document.documentElement.style.setProperty('--color-secondary-light', `rgba(${secondaryRgb.r}, ${secondaryRgb.g}, ${secondaryRgb.b}, 0.1)`);
        document.documentElement.style.setProperty('--color-secondary-medium', `rgba(${secondaryRgb.r}, ${secondaryRgb.g}, ${secondaryRgb.b}, 0.5)`);
        
        // Gradient
        document.documentElement.style.setProperty('--gradient-primary', theme.gradient);
      }
      
      // Set background and text color variables for both modes
      document.documentElement.style.setProperty('--color-background', '#F9FAFB'); // Light background
      document.documentElement.style.setProperty('--color-background-dark', '#1F2937'); // Dark background
      document.documentElement.style.setProperty('--color-text', '#111827'); // Light text
      document.documentElement.style.setProperty('--color-text-dark', '#E5E7EB'); // Dark text
      
      // Save to localStorage
      localStorage.setItem('colorTheme', activeTheme);
      
      // Dispatch custom event for components that don't use the context
      window.dispatchEvent(new CustomEvent('themechange', { 
        detail: { theme: activeTheme, colors: theme } 
      }));
    }
  }, [activeTheme]);
  
  // Function to convert hex to RGB
  function hexToRgb(hex) {
    if (!hex) return null;
    
    // Remove # if present
    hex = hex.replace(/^#/, '');
    
    // Parse hex
    let bigint = parseInt(hex, 16);
    let r = (bigint >> 16) & 255;
    let g = (bigint >> 8) & 255;
    let b = bigint & 255;
    
    return { r, g, b };
  }

  return (
    <ColorThemeContext.Provider value={{ 
      activeTheme, 
      setActiveTheme, 
      colorThemes,
      currentColors: colorThemes[activeTheme]  // Direct access to current theme colors
    }}>
      {children}
    </ColorThemeContext.Provider>
  );
};
