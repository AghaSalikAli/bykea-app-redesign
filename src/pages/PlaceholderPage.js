import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../contexts/LanguageContext';
import './PlaceholderPage.css';

const PlaceholderPage = ({ title, description, icon = '🚧' }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="placeholder-page">
      <div className="placeholder-content">
        <div className="placeholder-icon">{icon}</div>
        <h2>{title}</h2>
        <p>{description}</p>
        <button 
          className="primary-button"
          onClick={() => navigate(-1)}
        >
          {t('common.goBack')}
        </button>
        <button 
          className="secondary-button mt-2"
          onClick={() => navigate('/')}
        >
          {t('common.goHome')}
        </button>
      </div>
    </div>
  );
};

export default PlaceholderPage;
