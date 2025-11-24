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
    setColorBlindModeValue
  } = useAccessibility();
  const { t } = useTranslation();

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
    </div>
  );
};

export default Settings;
