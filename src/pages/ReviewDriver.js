import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from '../contexts/LanguageContext';
import ReadAloudWrapper from '../components/ReadAloudWrapper';
import './ReviewDriver.css';

const ReviewDriver = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { pickup, dropoff, stops = [], distance, duration, vehicle, estimatedPrice, driver } = location.state || {};

  // Mock reviews
  const reviews = [
    {
      id: 1,
      name: 'Ahmad Murtaza',
      rating: 5,
      comment: 'Very polite and well-mannered.',
      avatar: '/images/reviewer-1.png'
    },
    {
      id: 2,
      name: 'Fawwaz Ahmed',
      rating: 4,
      comment: 'Music taste could be better, overall fine.',
      avatar: '/images/reviewer-2.png'
    },
    {
      id: 3,
      name: 'Sneha',
      rating: 3,
      comment: 'AC was not working.',
      avatar: '/images/reviewer-3.png'
    }
  ];

  const handleConfirmRide = () => {
    navigate('/ride-confirmed', {
      state: { pickup, dropoff, stops, distance, duration, vehicle, estimatedPrice, driver }
    });
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (!driver) {
    navigate('/');
    return null;
  }

  return (
    <div className="review-driver-container">
      {/* Header */}
      <div className="review-driver-header">
        <ReadAloudWrapper
          as="button"
          text={t('common.back')}
          className="review-driver-back-btn"
          onClick={handleBack}
          onHover={true}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </ReadAloudWrapper>
        <h1 className="review-driver-title">{t('reviewDriver.title')}</h1>
      </div>

      {/* Driver Info */}
      <div className="driver-profile-section">
        <h2 className="driver-profile-name">{driver.name}</h2>
        <div className="driver-profile-rating">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#FFB800">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          <span>{driver.rating} ({driver.totalRides} {t('reviewDriver.rides')})</span>
        </div>

        <div className="driver-profile-avatar-container">
          <img 
            src={driver.avatar} 
            alt={driver.name}
            className="driver-profile-avatar"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          <div className="driver-profile-avatar-placeholder">
            <span>{driver.name.charAt(0)}</span>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="reviews-section">
        <h3 className="reviews-title">{t('reviewDriver.reviews')}</h3>
        <div className="reviews-list">
          {reviews.map((review) => (
            <div key={review.id} className="review-card">
              <div className="review-header">
                <div className="review-user-info">
                  <div className="review-avatar-container">
                    <img 
                      src={review.avatar} 
                      alt={review.name}
                      className="review-avatar"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="review-avatar-placeholder">
                      <span>{review.name.charAt(0)}</span>
                    </div>
                  </div>
                  <span className="review-user-name">{review.name}</span>
                </div>
                <div className="review-stars">
                  {[...Array(5)].map((_, index) => (
                    <svg 
                      key={index} 
                      width="18" 
                      height="18" 
                      viewBox="0 0 24 24" 
                      fill={index < review.rating ? "#FFB800" : "#E0E0E0"}
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  ))}
                </div>
              </div>
              <p className="review-comment">{review.comment}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Confirm Button */}
      <ReadAloudWrapper
        as="button"
        text={t('reviewDriver.confirmRide')}
        className="confirm-ride-btn"
        onClick={handleConfirmRide}
        onHover={true}
      >
        {t('reviewDriver.confirmRide')}
      </ReadAloudWrapper>
    </div>
  );
};

export default ReviewDriver;
