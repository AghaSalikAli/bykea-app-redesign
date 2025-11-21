import React, { createContext, useContext, useState, useEffect } from 'react';

const AccessibilityContext = createContext();

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider');
  }
  return context;
};

export const AccessibilityProvider = ({ children }) => {
  const [fontSize, setFontSize] = useState(() => {
    return localStorage.getItem('bykea-font-size') || 'medium';
  });
  
  const [colorBlindMode, setColorBlindMode] = useState(() => {
    return localStorage.getItem('bykea-colorblind-mode') || 'normal';
  });

  useEffect(() => {
    document.documentElement.setAttribute('lang', 'en');
    document.documentElement.setAttribute('dir', 'ltr');
  }, []);

  useEffect(() => {
    localStorage.setItem('bykea-font-size', fontSize);
    document.documentElement.setAttribute('data-font-size', fontSize);
  }, [fontSize]);

  useEffect(() => {
    localStorage.setItem('bykea-colorblind-mode', colorBlindMode);
    document.documentElement.setAttribute('data-colorblind-mode', colorBlindMode);
  }, [colorBlindMode]);

  const increaseFontSize = () => {
    setFontSize(prev => {
      if (prev === 'small') return 'medium';
      if (prev === 'medium') return 'large';
      if (prev === 'large') return 'xlarge';
      return 'xlarge';
    });
  };

  const decreaseFontSize = () => {
    setFontSize(prev => {
      if (prev === 'xlarge') return 'large';
      if (prev === 'large') return 'medium';
      if (prev === 'medium') return 'small';
      return 'small';
    });
  };

  const setColorBlindModeValue = (mode) => {
    setColorBlindMode(mode);
  };

  const value = {
    fontSize,
    increaseFontSize,
    decreaseFontSize,
    colorBlindMode,
    setColorBlindModeValue
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
};
