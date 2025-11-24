import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../contexts/LanguageContext';
import './About.css';

const About = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const appInfo = [
    { label: 'Version', value: '3.2.1' },
    { label: 'Build', value: '2025.11.24' },
    { label: 'Platform', value: 'React Web' }
  ];

  return (
    <div className="about-container">
      {/* Header */}
      <div className="about-header">
        <button className="about-back-btn" onClick={() => navigate('/')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 className="about-title">{t('about.title')}</h1>
      </div>

      {/* Content */}
      <div className="about-content">
        <div className="about-logo">
          <div className="logo-circle">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
              <path d="M5 17H19M5 17C3.89543 17 3 17.8954 3 19C3 20.1046 3.89543 21 5 21C6.10457 21 7 20.1046 7 19M5 17C5 17.5523 5.44772 18 6 18H18C18.5523 18 19 17.5523 19 17M19 17C19 17.5523 19.4477 18 20 18C20.5523 18 21 17.5523 21 17C21 16.4477 20.5523 16 20 16H19V17ZM7 19C7 17.8954 6.10457 17 5 17M7 19C7 20.1046 6.10457 21 5 21M16 8L18 3H6L8 8M16 8H8M16 8L18 10V15H6V10L8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2 className="app-name">Bykea</h2>
          <p className="app-tagline">{t('about.tagline')}</p>
        </div>

        <div className="app-info-section">
          {appInfo.map((info, index) => (
            <div key={index} className="app-info-item">
              <span className="info-label">{t(`about.${info.label.toLowerCase()}`)}</span>
              <span className="info-value">{info.value}</span>
            </div>
          ))}
        </div>

        <div className="about-links">
          <button className="about-link-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M14 2V8H20M16 13H8M16 17H8M10 9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {t('about.termsConditions')}
          </button>
          <button className="about-link-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {t('about.privacyPolicy')}
          </button>
          <button className="about-link-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 16V12M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            {t('about.licenses')}
          </button>
        </div>

        <div className="about-footer">
          <p>{t('about.copyright')}</p>
          <p>{t('about.madeWith')}</p>
        </div>
      </div>
    </div>
  );
};

export default About;
