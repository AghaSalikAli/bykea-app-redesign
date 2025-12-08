import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../contexts/LanguageContext';
import ReadAloudWrapper from '../components/ReadAloudWrapper';
import './Offers.css';

const Offers = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('active');

  const offers = [
    {
      id: 1,
      code: 'FIRST50',
      discount: '50%',
      title: 'First Ride Special',
      description: 'Get 50% off on your first ride',
      validUntil: 'Dec 31, 2025',
      minRide: 'Rs. 200',
      maxDiscount: 'Rs. 150',
      isActive: true,
      isNewUser: true,
      color: '#00a859'
    },
    {
      id: 2,
      code: 'WEEKEND30',
      discount: '30%',
      title: 'Weekend Bonanza',
      description: 'Enjoy 30% off on weekend rides',
      validUntil: 'Dec 15, 2025',
      minRide: 'Rs. 300',
      maxDiscount: 'Rs. 200',
      isActive: true,
      isNewUser: false,
      color: '#FF6B35'
    },
    {
      id: 3,
      code: 'SAVE100',
      discount: 'Rs. 100',
      title: 'Flat Discount',
      description: 'Save Rs. 100 on rides above Rs. 500',
      validUntil: 'Nov 30, 2025',
      minRide: 'Rs. 500',
      maxDiscount: 'Rs. 100',
      isActive: true,
      isNewUser: false,
      color: '#4ECDC4'
    },
    {
      id: 4,
      code: 'SUMMER40',
      discount: '40%',
      title: 'Summer Sale',
      description: '40% off on all rides',
      validUntil: 'Nov 20, 2025',
      minRide: 'Rs. 250',
      maxDiscount: 'Rs. 180',
      isActive: false,
      isNewUser: false,
      color: '#95A5A6'
    }
  ];

  const activeOffers = offers.filter(offer => offer.isActive);
  const expiredOffers = offers.filter(offer => !offer.isActive);
  const displayOffers = activeTab === 'active' ? activeOffers : expiredOffers;

  return (
    <div className="offers-container">
      {/* Header */}
      <div className="offers-header">
        <ReadAloudWrapper
          as="button"
          text={t('common.back')}
          className="offers-back-btn"
          onClick={() => navigate('/')}
          onHover={true}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </ReadAloudWrapper>
        <h1 className="offers-title">{t('offers.title')}</h1>
      </div>

      {/* Tabs */}
      <div className="offers-tabs">
        <button 
          className={`offers-tab ${activeTab === 'active' ? 'active' : ''}`}
          onClick={() => setActiveTab('active')}
        >
          {t('offers.active')} ({activeOffers.length})
        </button>
        <button 
          className={`offers-tab ${activeTab === 'expired' ? 'active' : ''}`}
          onClick={() => setActiveTab('expired')}
        >
          {t('offers.expired')} ({expiredOffers.length})
        </button>
      </div>

      {/* Offers List */}
      <div className="offers-list">
        {displayOffers.map((offer) => (
          <div key={offer.id} className={`offer-card ${!offer.isActive ? 'expired' : ''}`}>
            <div className="offer-header-section">
              <div className="offer-discount-badge" style={{ backgroundColor: offer.color }}>
                <span className="offer-discount-value">{offer.discount}</span>
                <span className="offer-discount-label">{t('offers.discount')}</span>
              </div>
              <div className="offer-details">
                <h3 className="offer-title">{offer.title}</h3>
                <p className="offer-description">{offer.description}</p>
              </div>
            </div>

            <div className="offer-code-section">
              <div className="offer-code-box">
                <span className="offer-code-label">{t('offers.useCode')}</span>
                <span className="offer-code">{offer.code}</span>
              </div>
              {offer.isActive && (
                <button className="offer-apply-btn">
                  {t('offers.applied')}
                </button>
              )}
            </div>

            <div className="offer-info-section">
              <div className="offer-info-row">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <span>{t('offers.validUntil')} {offer.validUntil}</span>
              </div>
              <div className="offer-info-row">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="currentColor" strokeWidth="2"/>
                </svg>
                <span>{t('offers.minRide')} {offer.minRide}</span>
              </div>
              <div className="offer-info-row">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M4 6v12c0 1.1.9 2 2 2h14v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <span>{t('offers.maxDiscount')} {offer.maxDiscount}</span>
              </div>
            </div>

            {offer.isNewUser && (
              <div className="offer-badge-new">
                {t('offers.newUsers')}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Offers;
