import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../contexts/LanguageContext';
import './HelpSupport.css';

const HelpSupport = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const helpOptions = [
    {
      id: 1,
      title: 'FAQs',
      description: 'Frequently asked questions',
      icon: 'faq'
    },
    {
      id: 2,
      title: 'Contact Us',
      description: '24/7 customer support',
      icon: 'contact'
    },
    {
      id: 3,
      title: 'Report Issue',
      description: 'Report a problem with your ride',
      icon: 'report'
    },
    {
      id: 4,
      title: 'Safety Center',
      description: 'Safety guidelines and tips',
      icon: 'safety'
    }
  ];

  const getIcon = (iconType) => {
    const icons = {
      faq: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
          <path d="M9.09 9C9.3251 8.33167 9.78915 7.76811 10.4 7.40913C11.0108 7.05016 11.7289 6.91894 12.4272 7.03871C13.1255 7.15848 13.7588 7.52152 14.2151 8.06353C14.6713 8.60553 14.9211 9.29152 14.92 10C14.92 12 11.92 13 11.92 13M12 17H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      contact: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      report: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M10.29 3.86L1.82 18C1.64537 18.3024 1.55295 18.6453 1.55201 18.9945C1.55107 19.3437 1.64164 19.6871 1.81458 19.9905C1.98753 20.2939 2.23666 20.5467 2.53776 20.7239C2.83886 20.9011 3.18064 20.9961 3.53 21H20.47C20.8194 20.9961 21.1611 20.9011 21.4622 20.7239C21.7633 20.5467 22.0125 20.2939 22.1854 19.9905C22.3584 19.6871 22.4489 19.3437 22.448 18.9945C22.4471 18.6453 22.3546 18.3024 22.18 18L13.71 3.86C13.5317 3.56611 13.2807 3.32312 12.9812 3.15448C12.6817 2.98585 12.3437 2.89725 12 2.89725C11.6563 2.89725 11.3183 2.98585 11.0188 3.15448C10.7193 3.32312 10.4683 3.56611 10.29 3.86V3.86Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 9V13M12 17H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      safety: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    };
    return icons[iconType] || null;
  };

  return (
    <div className="help-container">
      {/* Header */}
      <div className="help-header">
        <button className="help-back-btn" onClick={() => navigate('/')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 className="help-title">{t('help.title')}</h1>
      </div>

      {/* Help Options */}
      <div className="help-content">
        <div className="help-options">
          {helpOptions.map((option) => (
            <button key={option.id} className="help-option-card">
              <div className="help-option-icon">
                {getIcon(option.icon)}
              </div>
              <div className="help-option-text">
                <h3 className="help-option-title">{t(`help.${option.icon}`)}</h3>
                <p className="help-option-desc">{t(`help.${option.icon}Desc`)}</p>
              </div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          ))}
        </div>

        <div className="help-contact-info">
          <h3 className="contact-title">{t('help.emergencyContact')}</h3>
          <div className="contact-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M22 16.92V19.92C22.0011 20.1985 21.9441 20.4742 21.8325 20.7293C21.7209 20.9845 21.5573 21.2136 21.3521 21.4019C21.1468 21.5901 20.9046 21.7335 20.6407 21.8227C20.3769 21.9119 20.0974 21.9451 19.82 21.92C16.7428 21.5856 13.787 20.5341 11.19 18.85C8.77382 17.3147 6.72533 15.2662 5.19 12.85C3.49998 10.2412 2.44824 7.27099 2.12 4.18C2.09501 3.90347 2.12788 3.62476 2.2165 3.36162C2.30513 3.09849 2.44757 2.85669 2.63477 2.65162C2.82196 2.44655 3.04981 2.28271 3.30379 2.17052C3.55778 2.05833 3.83234 2.00026 4.11 2H7.11C7.59531 1.99522 8.06579 2.16708 8.43376 2.48353C8.80173 2.79999 9.04207 3.23945 9.11 3.72C9.23662 4.68007 9.47144 5.62273 9.81 6.53C9.94455 6.88792 9.97366 7.27691 9.89391 7.65088C9.81415 8.02485 9.62886 8.36811 9.36 8.64L8.09 9.91C9.51356 12.4135 11.5865 14.4864 14.09 15.91L15.36 14.64C15.6319 14.3711 15.9751 14.1859 16.3491 14.1061C16.7231 14.0263 17.1121 14.0555 17.47 14.19C18.3773 14.5286 19.3199 14.7634 20.28 14.89C20.7658 14.9585 21.2094 15.2032 21.5265 15.5775C21.8437 15.9518 22.0122 16.4296 22 16.92Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>+92 111 111 111</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpSupport;
