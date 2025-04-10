import React, { createContext, useState, useEffect } from 'react';

// Enhanced color themes with more properties for comprehensive styling
export const colorThemes = {
  blue: {
    primary: '#1D4ED8',
    secondary: '#9333EA',
    accent: '#F59E0B',
    name: 'Blue-Purple',
    gradient: 'linear-gradient(135deg, #1D4ED8, #9333EA)'
  },
  green: {
    primary: '#059669',
    secondary: '#0891B2',
    accent: '#FBBF24',
    name: 'Green-Teal',
    gradient: 'linear-gradient(135deg, #059669, #0891B2)'
  },
  red: {
    primary: '#DC2626',
    secondary: '#DB2777',
    accent: '#F59E0B',
    name: 'Red-Pink',
    gradient: 'linear-gradient(135deg, #DC2626, #DB2777)'
  },
  orange: {
    primary: '#D97706',
    secondary: '#7C2D12',
    accent: '#10B981',
    name: 'Orange-Brown',
    gradient: 'linear-gradient(135deg, #D97706, #7C2D12)'
  },
  indigo: {
    primary: '#4F46E5',
    secondary: '#7E22CE',
    accent: '#F59E0B',
    name: 'Indigo-Purple',
    gradient: 'linear-gradient(135deg, #4F46E5, #7E22CE)'
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
