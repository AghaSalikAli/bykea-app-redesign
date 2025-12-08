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

  const [readAloudEnabled, setReadAloudEnabled] = useState(() => {
    const saved = localStorage.getItem('bykea-read-aloud');
    return saved ? JSON.parse(saved) : false;
  });
  
  const [readAloudSpeed, setReadAloudSpeed] = useState(() => {
    const saved = localStorage.getItem('bykea-read-aloud-speed');
    return saved ? parseFloat(saved) : 1.0;
  });

  // Remove this useEffect as language context will handle lang and dir attributes

  useEffect(() => {
    localStorage.setItem('bykea-font-size', fontSize);
    document.documentElement.setAttribute('data-font-size', fontSize);
  }, [fontSize]);

  useEffect(() => {
    localStorage.setItem('bykea-colorblind-mode', colorBlindMode);
    document.documentElement.setAttribute('data-colorblind-mode', colorBlindMode);
  }, [colorBlindMode]);

  useEffect(() => {
    localStorage.setItem('bykea-read-aloud', JSON.stringify(readAloudEnabled));
  }, [readAloudEnabled]);

  useEffect(() => {
    localStorage.setItem('bykea-read-aloud-speed', readAloudSpeed.toString());
  }, [readAloudSpeed]);

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

  // Function to speak text
  const speak = (text, options = {}) => {
    if (!readAloudEnabled || !text) return;
    
    // Cancel any ongoing speech
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = options.rate || readAloudSpeed;
      utterance.pitch = options.pitch || 1;
      utterance.volume = options.volume || 1;
      utterance.lang = options.lang || 'en-US';
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  };

  const value = {
    fontSize,
    increaseFontSize,
    decreaseFontSize,
    colorBlindMode,
    setColorBlindModeValue,
    readAloudEnabled,
    setReadAloudEnabled,
    readAloudSpeed,
    setReadAloudSpeed,
    speak,
    stopSpeaking,
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
};
