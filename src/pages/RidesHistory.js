import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../contexts/LanguageContext';
import './RidesHistory.css';

const RidesHistory = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('completed');

  const rides = [
    {
      id: 1,
      from: 'Gulshan-e-Iqbal',
      to: 'Clifton Beach',
      driver: 'Asif Mahmood',
      fare: 450,
      date: 'Nov 24, 2025',
      time: '3:45 PM',
      status: 'completed',
      rating: 5
    },
    {
      id: 2,
      from: 'Saddar',
      to: 'DHA Phase 5',
      driver: 'Bilal Ahmed',
      fare: 380,
      date: 'Nov 22, 2025',
      time: '2:30 PM',
      status: 'completed',
      rating: 4
    },
    {
      id: 3,
      from: 'Bahadurabad',
      to: 'Tariq Road',
      driver: 'Hassan Ali',
      fare: 220,
      date: 'Nov 21, 2025',
      time: '11:15 AM',
      status: 'completed',
      rating: 5
    },
    {
      id: 4,
      from: 'North Nazimabad',
      to: 'Boat Basin',
      driver: 'Kamran Siddiqui',
      fare: 520,
      date: 'Nov 20, 2025',
      time: '6:00 PM',
      status: 'cancelled',
      rating: 0
    },
    {
      id: 5,
      from: 'Malir',
      to: 'Airport',
      driver: 'Fahad Khan',
      fare: 680,
      date: 'Nov 18, 2025',
      time: '8:30 AM',
      status: 'completed',
      rating: 4
    }
  ];

  const completedRides = rides.filter(ride => ride.status === 'completed');
  const cancelledRides = rides.filter(ride => ride.status === 'cancelled');
  const displayRides = activeTab === 'completed' ? completedRides : cancelledRides;

  return (
    <div className="rides-history-container">
      {/* Header */}
      <div className="rides-history-header">
        <button className="rides-history-back-btn" onClick={() => navigate('/')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 className="rides-history-title">{t('ridesHistory.title')}</h1>
      </div>

      {/* Tabs */}
      <div className="rides-history-tabs">
        <button 
          className={`history-tab ${activeTab === 'completed' ? 'active' : ''}`}
          onClick={() => setActiveTab('completed')}
        >
          {t('ridesHistory.completed')} ({completedRides.length})
        </button>
        <button 
          className={`history-tab ${activeTab === 'cancelled' ? 'active' : ''}`}
          onClick={() => setActiveTab('cancelled')}
        >
          {t('ridesHistory.cancelled')} ({cancelledRides.length})
        </button>
      </div>

      {/* Rides List */}
      <div className="rides-history-list">
        {displayRides.map((ride) => (
          <div key={ride.id} className={`ride-history-card ${ride.status}`}>
            <div className="ride-route">
              <div className="route-point pickup">
                <div className="route-dot"></div>
                <div className="route-info">
                  <span className="route-label">From</span>
                  <span className="route-location">{ride.from}</span>
                </div>
              </div>
              <div className="route-line"></div>
              <div className="route-point dropoff">
                <div className="route-dot"></div>
                <div className="route-info">
                  <span className="route-label">To</span>
                  <span className="route-location">{ride.to}</span>
                </div>
              </div>
            </div>

            <div className="ride-details-section">
              <div className="ride-detail-row">
                <span className="detail-label">{t('ridesHistory.driver')}:</span>
                <span className="detail-value">{ride.driver}</span>
              </div>
              <div className="ride-detail-row">
                <span className="detail-label">{t('ridesHistory.fare')}:</span>
                <span className="detail-value fare">Rs. {ride.fare}</span>
              </div>
              <div className="ride-detail-row">
                <span className="detail-label">{t('ridesHistory.date')}:</span>
                <span className="detail-value">{ride.date} • {ride.time}</span>
              </div>
            </div>

            {ride.status === 'completed' && (
              <div className="ride-actions">
                <div className="ride-rating">
                  {[...Array(5)].map((_, index) => (
                    <svg 
                      key={index} 
                      width="18" 
                      height="18" 
                      viewBox="0 0 24 24" 
                      fill={index < ride.rating ? "#FFB800" : "#E0E0E0"}
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  ))}
                </div>
                <button className="book-again-btn">
                  {t('ridesHistory.bookAgain')}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RidesHistory;
