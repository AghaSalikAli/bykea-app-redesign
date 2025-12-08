import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from '../contexts/LanguageContext';
import ReadAloudWrapper from '../components/ReadAloudWrapper';
import './RateDriver.css';

const RateDriver = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { driver, estimatedPrice } = location.state || {};

  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comments, setComments] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRatingClick = (value) => {
    setRating(value);
  };

  const handleRatingHover = (value) => {
    setHoveredRating(value);
  };

  const handleRatingLeave = () => {
    setHoveredRating(0);
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Navigate to home
    navigate('/', { replace: true });
  };

  const handleSkip = () => {
    navigate('/', { replace: true });
  };

  if (!driver) {
    navigate('/');
    return null;
  }

  return (
    <div className="rate-driver-container">
      <div className="rate-driver-content">
        {/* Success Icon */}
        <div className="rate-success-icon">
          <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="50" r="48" stroke="var(--primary-green)" strokeWidth="3" fill="white"/>
            <circle cx="50" cy="50" r="42" fill="var(--primary-green)" fillOpacity="0.1"/>
            <path 
              d="M30 50 L43 63 L70 36" 
              stroke="var(--primary-green)" 
              strokeWidth="5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        </div>

        {/* Title */}
        <h1 className="rate-driver-title">{t('reviewDriver.title')}</h1>
        <p className="rate-driver-subtitle">{t('reviewDriver.subtitle')}</p>

        {/* Driver Card */}
        <div className="rate-driver-card">
          <div className="rate-driver-avatar-wrapper">
            <img 
              src={driver.avatar} 
              alt={driver.name}
              className="rate-driver-avatar"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="rate-driver-avatar-placeholder">
              <span>{driver.name.charAt(0)}</span>
            </div>
          </div>
          
          <div className="rate-driver-info">
            <div className="rate-driver-name">{driver.name}</div>
            <div className="rate-driver-vehicle">{driver.vehicle}</div>
          </div>

          <div className="rate-price">Rs. {estimatedPrice}</div>
        </div>

        {/* Star Rating */}
        <div className="rate-rating-section">
          <label className="rate-rating-label">{t('reviewDriver.rateDriver')}</label>
          <div className="rate-stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                className={`rate-star ${
                  star <= (hoveredRating || rating) ? 'rate-star-filled' : ''
                }`}
                onClick={() => handleRatingClick(star)}
                onMouseEnter={() => handleRatingHover(star)}
                onMouseLeave={handleRatingLeave}
                aria-label={`Rate ${star} stars`}
              >
                <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </button>
            ))}
          </div>
        </div>

        {/* Comments */}
        <div className="rate-comments-section">
          <label className="rate-comments-label">{t('reviewDriver.comments')}</label>
          <textarea
            className="rate-comments-textarea"
            placeholder={t('reviewDriver.commentsPlaceholder')}
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            rows={4}
            maxLength={500}
          />
          <div className="rate-comments-counter">{comments.length}/500</div>
        </div>

        {/* Action Buttons */}
        <div className="rate-actions">
          <ReadAloudWrapper
            as="button"
            text={t('reviewDriver.submit')}
            className="rate-submit-btn"
            onClick={handleSubmit}
            disabled={isSubmitting || rating === 0}
            onHover={true}
          >
            {isSubmitting ? t('reviewDriver.submitting') : t('reviewDriver.submit')}
          </ReadAloudWrapper>
          
          <ReadAloudWrapper
            as="button"
            text={t('reviewDriver.skip')}
            className="rate-skip-btn"
            onClick={handleSkip}
            disabled={isSubmitting}
            onHover={true}
          >
            {t('reviewDriver.skip')}
          </ReadAloudWrapper>
        </div>
      </div>
    </div>
  );
};

export default RateDriver;
