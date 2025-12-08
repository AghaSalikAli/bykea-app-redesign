import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccessibility } from '../contexts/AccessibilityContext';
import { useTranslation } from '../contexts/LanguageContext';
import './Settings.css';

const Settings = () => {
  const navigate = useNavigate();
  const { 
    fontSize, 
    increaseFontSize, 
    decreaseFontSize,
    colorBlindMode,
    setColorBlindModeValue,
    readAloudEnabled,
    setReadAloudEnabled,
    readAloudSpeed,
    setReadAloudSpeed,
    speak
  } = useAccessibility();
  const { t, language } = useTranslation();

  const testReadAloud = () => {
    // Only works in English
    if (language === 'en') {
      speak(t('settings.readAloudTest'), { lang: 'en-US' });
    }
  };

  const fontSizes = [
    { value: 'small', label: t('settings.small') },
    { value: 'medium', label: t('settings.medium') },
    { value: 'large', label: t('settings.large') },
    { value: 'xlarge', label: t('settings.xlarge') },
  ];

  const colorBlindModes = [
    { value: 'normal', label: t('settings.normal') },
    { value: 'protanopia', label: t('settings.protanopia') },
    { value: 'deuteranopia', label: t('settings.deuteranopia') },
    { value: 'tritanopia', label: t('settings.tritanopia') },
  ];

  return (
    <div className="settings-page">
      <button className="settings-back-btn" onClick={() => navigate('/')}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      <div className="settings-header">
        <h2>{t('settings.title')}</h2>
        <p>{t('settings.subtitle')}</p>
      </div>

      <div className="settings-section">
        <h3>{t('settings.fontSize')}</h3>
        <div className="font-size-controls">
          <button 
            className="secondary-button"
            onClick={decreaseFontSize}
            aria-label="Decrease font size"
          >
            A-
          </button>
          <div className="font-size-display">
            {fontSizes.find(f => f.value === fontSize)?.label || 'Medium'}
          </div>
          <button 
            className="secondary-button"
            onClick={increaseFontSize}
            aria-label="Increase font size"
          >
            A+
          </button>
        </div>
      </div>

      <div className="settings-section">
        <h3>{t('settings.colorBlindMode')}</h3>
        <div className="color-blind-options">
          {colorBlindModes.map((mode) => (
            <button
              key={mode.value}
              className={`option-button ${colorBlindMode === mode.value ? 'active' : ''}`}
              onClick={() => setColorBlindModeValue(mode.value)}
              aria-pressed={colorBlindMode === mode.value}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      <div className="settings-section">
        <h3>{t('settings.readAloud')}</h3>
        <p className="settings-description">{t('settings.readAloudDesc')}</p>
        <div className="setting-item">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={readAloudEnabled}
              onChange={(e) => setReadAloudEnabled(e.target.checked)}
              aria-label={t('settings.enableReadAloud')}
            />
            <span>{t('settings.enableReadAloud')}</span>
          </label>
        </div>
        
        {readAloudEnabled && (
          <>
            {language === 'ur' && (
              <div className="read-aloud-note" style={{
                padding: '12px',
                backgroundColor: '#fff3cd',
                borderRadius: '8px',
                marginBottom: '16px',
                border: '1px solid #ffc107',
                fontSize: 'calc(var(--font-size-base) * 0.95)'
              }}>
                <p style={{ margin: 0, lineHeight: 1.5 }}>
                  ⚠️ {t('settings.readAloudEnglishOnly') || 'Read Aloud currently supports English only. Switch to English to use this feature.'}
                </p>
              </div>
            )}
            
            <div className="setting-item">
              <label className="speed-label">
                {t('settings.readAloudSpeed')}
                <span className="speed-value">{readAloudSpeed.toFixed(1)}x</span>
              </label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={readAloudSpeed}
                onChange={(e) => setReadAloudSpeed(parseFloat(e.target.value))}
                className="speed-slider"
                aria-label={t('settings.readAloudSpeed')}
                disabled={language === 'ur'}
                style={language === 'ur' ? { opacity: 0.5 } : {}}
              />
              <div className="speed-labels">
                <span>0.5x</span>
                <span>1.0x</span>
                <span>1.5x</span>
                <span>2.0x</span>
              </div>
            </div>
            
            <button 
              onClick={testReadAloud} 
              className="test-button secondary-button"
              disabled={language === 'ur'}
              style={language === 'ur' ? { opacity: 0.5, cursor: 'not-allowed' } : {}}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11 5L6 9H2V15H6L11 19V5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M15.54 8.46C16.4774 9.39764 17.0039 10.6692 17.0039 11.995C17.0039 13.3208 16.4774 14.5924 15.54 15.53" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {t('settings.testReadAloud')}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Settings;
