import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../locales/translations';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('bykea-language') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('bykea-language', language);
    
    // Add smooth transition class before changing direction
    document.documentElement.style.transition = 'none';
    
    // Set document direction and language
    if (language === 'ur') {
      document.documentElement.setAttribute('dir', 'rtl');
      document.documentElement.setAttribute('lang', 'ur');
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
      document.documentElement.setAttribute('lang', 'en');
    }
    
    // Remove transition after a brief moment to allow smooth content changes
    requestAnimationFrame(() => {
      document.documentElement.style.transition = '';
    });
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ur' : 'en');
  };

  const value = {
    language,
    setLanguage,
    toggleLanguage,
    isUrdu: language === 'ur',
    isEnglish: language === 'en'
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// Translation hook
export const useTranslation = () => {
  const { language } = useLanguage();
  
  const t = (key) => {
    return translations[language]?.[key] || key;
  };
  
  return { t, language };
};
