import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../contexts/LanguageContext';
import './PaymentMethods.css';

const PaymentMethods = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [cards, setCards] = useState([
    {
      id: 1,
      type: 'visa',
      last4: '4242',
      expiry: '12/25',
      isDefault: true
    },
    {
      id: 2,
      type: 'mastercard',
      last4: '8888',
      expiry: '08/26',
      isDefault: false
    }
  ]);

  return (
    <div className="payment-container">
      {/* Header */}
      <div className="payment-header">
        <button className="payment-back-btn" onClick={() => navigate('/')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 className="payment-title">{t('payment.title')}</h1>
      </div>

      {/* Cards List */}
      <div className="payment-content">
        <div className="cards-list">
          {cards.map((card) => (
            <div key={card.id} className="payment-card">
              <div className="card-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                  <rect x="1" y="4" width="22" height="16" rx="2" stroke="currentColor" strokeWidth="2"/>
                  <path d="M1 10H23" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <div className="card-details">
                <div className="card-type">{card.type.toUpperCase()}</div>
                <div className="card-number">•••• {card.last4}</div>
                <div className="card-expiry">{t('payment.expires')}: {card.expiry}</div>
              </div>
              {card.isDefault && (
                <div className="default-badge">{t('payment.default')}</div>
              )}
            </div>
          ))}
        </div>

        <button className="add-card-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          {t('payment.addCard')}
        </button>

        <div className="payment-info">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            <path d="M12 16V12M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <p>{t('payment.secureInfo')}</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethods;
