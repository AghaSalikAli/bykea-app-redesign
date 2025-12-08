import { useEffect, useCallback } from 'react';
import { useAccessibility } from '../contexts/AccessibilityContext';
import { useTranslation } from '../contexts/LanguageContext';

export const useReadAloud = () => {
  const { readAloudEnabled, speak, stopSpeaking } = useAccessibility();
  const { language } = useTranslation();

  const readText = useCallback((text) => {
    // Only read aloud for English
    if (readAloudEnabled && text && language === 'en') {
      const lang = 'en-US';
      speak(text, { lang });
    }
  }, [readAloudEnabled, speak, language]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, [stopSpeaking]);

  return { readText, stopSpeaking };
};
