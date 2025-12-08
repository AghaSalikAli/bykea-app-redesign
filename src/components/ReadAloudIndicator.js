import React, { useEffect, useState } from 'react';
import { useAccessibility } from '../contexts/AccessibilityContext';
import './ReadAloudIndicator.css';

const ReadAloudIndicator = () => {
  const { readAloudEnabled } = useAccessibility();
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    if (!readAloudEnabled) {
      setIsSpeaking(false);
      return;
    }

    const checkSpeaking = () => {
      if (window.speechSynthesis) {
        setIsSpeaking(window.speechSynthesis.speaking);
      }
    };

    // Check speaking status periodically
    const interval = setInterval(checkSpeaking, 100);

    return () => clearInterval(interval);
  }, [readAloudEnabled]);

  if (!readAloudEnabled) return null;

  return (
    <div className={`read-aloud-indicator ${isSpeaking ? 'active' : ''}`}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path 
          d="M11 5L6 9H2V15H6L11 19V5Z" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        <path 
          d="M15.54 8.46C16.4774 9.39764 17.0039 10.6692 17.0039 11.995C17.0039 13.3208 16.4774 14.5924 15.54 15.53" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="wave wave-1"
        />
        <path 
          d="M19.07 4.93C20.9447 6.80528 21.9979 9.34836 21.9979 12C21.9979 14.6516 20.9447 17.1947 19.07 19.07" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="wave wave-2"
        />
      </svg>
    </div>
  );
};

export default ReadAloudIndicator;
