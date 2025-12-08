import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from '../contexts/LanguageContext';
import ReadAloudWrapper from '../components/ReadAloudWrapper';
import './ThankYou.css';

const ThankYou = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { pickup, dropoff, stops = [], distance, duration, vehicle, estimatedPrice, driver } = location.state || {};

  useEffect(() => {
    // Auto-navigate to Track Ride after 4 seconds
    const timer = setTimeout(() => {
      handleTrackRide();
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  const handleTrackRide = () => {
    navigate('/track-ride', {
      state: { pickup, dropoff, stops, distance, duration, vehicle, estimatedPrice, driver }
    });
  };

  if (!driver) {
    navigate('/');
    return null;
  }

  return (
    <div className="thank-you-container">
      <div className="thank-you-content">
        {/* Success Icon */}
        <div className="success-icon">
          <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
            <circle cx="60" cy="60" r="58" stroke="var(--primary-green)" strokeWidth="4" fill="white"/>
            <circle cx="60" cy="60" r="50" fill="var(--primary-green)" fillOpacity="0.1"/>
            <path 
              d="M35 60 L52 77 L85 44" 
              stroke="var(--primary-green)" 
              strokeWidth="6" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        </div>

        {/* Thank You Text */}
        <h1 className="thank-you-title">{t('thankYou.title')}</h1>
        <p className="thank-you-message">{t('thankYou.message')}</p>

        {/* Ride Details */}
        <div className="booking-details">
          <div className="booking-detail-row">
            <span className="booking-detail-label">{t('thankYou.driver')}:</span>
            <span className="booking-detail-value">{driver.name}</span>
          </div>
          <div className="booking-detail-row">
            <span className="booking-detail-label">{t('thankYou.vehicle')}:</span>
            <span className="booking-detail-value">{driver.vehicle}</span>
          </div>
          <div className="booking-detail-row">
            <span className="booking-detail-label">{t('thankYou.estimatedPrice')}:</span>
            <span className="booking-detail-value booking-price">Rs. {estimatedPrice}</span>
          </div>
        </div>

        {/* Loading Animation */}
        <div className="loading-animation">
          <div className="loading-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <p className="loading-text">{t('thankYou.preparingRide')}</p>
        </div>
      </div>

      {/* Track Ride Button */}
      <ReadAloudWrapper
        as="button"
        text={t('thankYou.trackRide')}
        className="track-ride-btn"
        onClick={handleTrackRide}
        onHover={true}
      >
        {t('thankYou.trackRide')}
      </ReadAloudWrapper>
    </div>
  );
};

export default ThankYou;
