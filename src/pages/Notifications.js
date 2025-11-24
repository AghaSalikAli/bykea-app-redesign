import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../contexts/LanguageContext';
import './Notifications.css';

const Notifications = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const notifications = [
    {
      id: 1,
      type: 'ride',
      title: 'Ride Completed',
      message: 'Your ride to Gulshan-e-Iqbal has been completed',
      time: '5 min ago',
      read: false
    },
    {
      id: 2,
      type: 'offer',
      title: 'Special Offer',
      message: 'Get 50% off on your next ride this weekend',
      time: '2 hours ago',
      read: false
    },
    {
      id: 3,
      type: 'payment',
      title: 'Payment Successful',
      message: 'Rs. 285 has been debited from your wallet',
      time: '3 hours ago',
      read: true
    },
    {
      id: 4,
      type: 'ride',
      title: 'Driver Arrived',
      message: 'Your driver has arrived at the pickup location',
      time: 'Yesterday',
      read: true
    }
  ];

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'ride':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M5 17H19M5 17C3.89543 17 3 17.8954 3 19C3 20.1046 3.89543 21 5 21C6.10457 21 7 20.1046 7 19M5 17C5 17.5523 5.44772 18 6 18H18C18.5523 18 19 17.5523 19 17M19 17C19 17.5523 19.4477 18 20 18C20.5523 18 21 17.5523 21 17C21 16.4477 20.5523 16 20 16H19V17ZM7 19C7 17.8954 6.10457 17 5 17M7 19C7 20.1046 6.10457 21 5 21M16 8L18 3H6L8 8M16 8H8M16 8L18 10V15H6V10L8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'offer':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M20 12V22H4V12M2 7H22M12 2V7M8 12V17M16 12V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'payment':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <rect x="1" y="4" width="22" height="16" rx="2" stroke="currentColor" strokeWidth="2"/>
            <path d="M1 10H23" stroke="currentColor" strokeWidth="2"/>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="notifications-container">
      {/* Header */}
      <div className="notifications-header">
        <button className="notifications-back-btn" onClick={() => navigate('/')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 className="notifications-title">{t('notifications.title')}</h1>
      </div>

      {/* Notifications List */}
      <div className="notifications-content">
        {notifications.map((notification) => (
          <div key={notification.id} className={`notification-item ${notification.read ? 'read' : 'unread'}`}>
            <div className="notification-icon">
              {getNotificationIcon(notification.type)}
            </div>
            <div className="notification-details">
              <h3 className="notification-title">{notification.title}</h3>
              <p className="notification-message">{notification.message}</p>
              <span className="notification-time">{notification.time}</span>
            </div>
            {!notification.read && <div className="unread-dot"></div>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
