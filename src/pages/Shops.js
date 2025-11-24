import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../contexts/LanguageContext';
import './Shops.css';

const Shops = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState('all');

  const getCategoryIcon = (iconType) => {
    const icons = {
      all: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      food: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M18 8H19C20.1046 8 21 8.89543 21 10V20C21 21.1046 20.1046 22 19 22H5C3.89543 22 3 21.1046 3 20V10C3 8.89543 3.89543 8 5 8H6M18 8V6C18 4.89543 17.1046 4 16 4H8C6.89543 4 6 4.89543 6 6V8M18 8H6M8 12H16M8 16H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      grocery: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <circle cx="9" cy="21" r="1" stroke="currentColor" strokeWidth="2"/>
          <circle cx="20" cy="21" r="1" stroke="currentColor" strokeWidth="2"/>
          <path d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      pharmacy: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 22V12M12 12L2 7M12 12L22 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      electronics: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <rect x="5" y="2" width="14" height="20" rx="2" stroke="currentColor" strokeWidth="2"/>
          <path d="M12 18H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      )
    };
    return icons[iconType] || null;
  };

  const categories = [
    { id: 'all', label: 'All', icon: 'all' },
    { id: 'food', label: 'Food', icon: 'food' },
    { id: 'grocery', label: 'Grocery', icon: 'grocery' },
    { id: 'pharmacy', label: 'Pharmacy', icon: 'pharmacy' },
    { id: 'electronics', label: 'Electronics', icon: 'electronics' }
  ];

  const shops = [
    {
      id: 1,
      name: 'KFC',
      category: 'food',
      rating: 4.5,
      reviews: 1250,
      distance: '1.2 km',
      deliveryTime: '25-30 min',
      image: '/images/kfc.png',
      isOpen: true,
      freeDelivery: true,
      color: '#E4002B'
    },
    {
      id: 2,
      name: 'Carrefour Express',
      category: 'grocery',
      rating: 4.3,
      reviews: 890,
      distance: '800 m',
      deliveryTime: '20-25 min',
      image: '/images/carrefour.png',
      isOpen: true,
      freeDelivery: false,
      color: '#00529F'
    },
    {
      id: 3,
      name: 'McDonald\'s',
      category: 'food',
      rating: 4.6,
      reviews: 2340,
      distance: '2.1 km',
      deliveryTime: '30-35 min',
      image: '/images/mcd.png',
      isOpen: true,
      freeDelivery: true,
      color: '#FFC72C'
    },
    {
      id: 4,
      name: 'Dvago',
      category: 'pharmacy',
      rating: 4.7,
      reviews: 450,
      distance: '500 m',
      deliveryTime: '15-20 min',
      image: '/images/dvago.png',
      isOpen: true,
      freeDelivery: false,
      color: '#00A859'
    },
    {
      id: 5,
      name: 'Tech Hub',
      category: 'electronics',
      rating: 4.4,
      reviews: 680,
      distance: '3.5 km',
      deliveryTime: '40-45 min',
      image: '/images/czone.png',
      isOpen: false,
      freeDelivery: false,
      color: '#1E88E5'
    },
    {
      id: 6,
      name: 'Subway',
      category: 'food',
      rating: 4.2,
      reviews: 560,
      distance: '1.8 km',
      deliveryTime: '25-30 min',
      image: '/images/subway.png',
      isOpen: true,
      freeDelivery: false,
      color: '#00A859'
    }
  ];

  const filteredShops = activeCategory === 'all' 
    ? shops 
    : shops.filter(shop => shop.category === activeCategory);

  return (
    <div className="shops-container">
      {/* Header */}
      <div className="shops-header">
        <button className="shops-back-btn" onClick={() => navigate('/')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 className="shops-title">{t('shops.title')}</h1>
      </div>

      {/* Categories */}
      <div className="categories-section">
        <h3 className="categories-title">{t('shops.categories')}</h3>
        <div className="categories-list">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`category-btn ${activeCategory === category.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(category.id)}
            >
              <span className="category-icon">{getCategoryIcon(category.icon)}</span>
              <span className="category-label">{t(`shops.${category.id}`)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Shops List */}
      <div className="shops-list">
        {filteredShops.map((shop) => (
          <div key={shop.id} className="shop-card">
            <div className="shop-image" style={{ backgroundColor: '#FFFFFF' }}>
              <img src={shop.image} alt={shop.name} className="shop-logo" />
              {shop.freeDelivery && (
                <div className="free-delivery-badge">
                  {t('shops.freeDelivery')}
                </div>
              )}
            </div>

            <div className="shop-content">
              <div className="shop-header-info">
                <h3 className="shop-name">{shop.name}</h3>
                {shop.isOpen ? (
                  <span className="shop-status open">{t('shops.openNow')}</span>
                ) : (
                  <span className="shop-status closed">{t('shops.closed')}</span>
                )}
              </div>

              <div className="shop-rating">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#FFB800">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                <span className="rating-value">{shop.rating}</span>
                <span className="rating-reviews">({shop.reviews})</span>
              </div>

              <div className="shop-details-row">
                <div className="shop-detail">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  <span>{shop.distance} {t('shops.away')}</span>
                </div>
                <div className="shop-detail">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                    <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <span>{t('shops.deliveryTime')} {shop.deliveryTime}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Shops;
