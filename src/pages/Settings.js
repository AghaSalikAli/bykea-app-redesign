import React from 'react';
import { useAccessibility } from '../contexts/AccessibilityContext';
import './Settings.css';

const Settings = () => {
  const { 
    fontSize, 
    increaseFontSize, 
    decreaseFontSize,
    colorBlindMode,
    setColorBlindModeValue
  } = useAccessibility();

  const fontSizes = [
    { value: 'small', label: 'Small' },
    { value: 'medium', label: 'Medium' },
    { value: 'large', label: 'Large' },
    { value: 'xlarge', label: 'Extra Large' },
  ];

  const colorBlindModes = [
    { value: 'normal', label: 'Normal' },
    { value: 'protanopia', label: 'Protanopia (Red-blind)' },
    { value: 'deuteranopia', label: 'Deuteranopia (Green-blind)' },
    { value: 'tritanopia', label: 'Tritanopia (Blue-blind)' },
  ];

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h2>Accessibility</h2>
        <p>Bykea is for everyone!</p>
      </div>

      <div className="settings-section">
        <h3>Font Size</h3>
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
        <h3>Color Blind Mode</h3>
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
