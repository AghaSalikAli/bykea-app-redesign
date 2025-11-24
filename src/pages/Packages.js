import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../contexts/LanguageContext';
import './Packages.css';

const Packages = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('active');

  const packages = [
    {
      id: 'PKG001234',
      from: 'Saddar, Karachi',
      to: 'DHA Phase 6',
      status: 'inTransit',
      pickupTime: 'Nov 24, 2:30 PM',
      deliveryTime: 'Nov 24, 4:00 PM',
      isActive: true,
      progress: 60
    },
    {
      id: 'PKG001198',
      from: 'Gulshan-e-Iqbal',
      to: 'Clifton',
      status: 'outForDelivery',
      pickupTime: 'Nov 24, 11:00 AM',
      deliveryTime: 'Nov 24, 12:30 PM',
      isActive: true,
      progress: 85
    },
    {
      id: 'PKG001156',
      from: 'North Nazimabad',
      to: 'Malir',
      status: 'delivered',
      pickupTime: 'Nov 22, 3:15 PM',
      deliveryTime: 'Nov 22, 5:45 PM',
      isActive: false,
      progress: 100
    },
    {
      id: 'PKG001089',
      from: 'Bahadurabad',
      to: 'Shah Faisal',
      status: 'delivered',
      pickupTime: 'Nov 20, 10:00 AM',
      deliveryTime: 'Nov 20, 11:30 AM',
      isActive: false,
      progress: 100
    }
  ];

  const activePackages = packages.filter(pkg => pkg.isActive);
  const deliveredPackages = packages.filter(pkg => !pkg.isActive);
  const displayPackages = activeTab === 'active' ? activePackages : deliveredPackages;

  const getStatusColor = (status) => {
    switch (status) {
      case 'inTransit': return '#3498db';
      case 'outForDelivery': return '#f39c12';
      case 'delivered': return '#00a859';
      default: return '#95a5a6';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'inTransit': return t('packages.inTransit');
      case 'outForDelivery': return t('packages.outForDelivery');
      case 'delivered': return t('packages.delivered');
      default: return status;
    }
  };

  return (
    <div className="packages-container">
      {/* Header */}
      <div className="packages-header">
        <button className="packages-back-btn" onClick={() => navigate('/')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 className="packages-title">{t('packages.title')}</h1>
      </div>

      {/* Tabs */}
      <div className="packages-tabs">
        <button 
          className={`package-tab ${activeTab === 'active' ? 'active' : ''}`}
          onClick={() => setActiveTab('active')}
        >
          {t('packages.active')} ({activePackages.length})
        </button>
        <button 
          className={`package-tab ${activeTab === 'delivered' ? 'active' : ''}`}
          onClick={() => setActiveTab('delivered')}
        >
          {t('packages.delivered')} ({deliveredPackages.length})
        </button>
      </div>

      {/* Packages List */}
      <div className="packages-list">
        {displayPackages.map((pkg) => (
          <div key={pkg.id} className="package-card">
            <div className="package-header-row">
              <div className="package-id-section">
                <span className="package-id-label">{t('packages.packageId')}</span>
                <span className="package-id">{pkg.id}</span>
              </div>
              <div className="package-status-badge" style={{ backgroundColor: getStatusColor(pkg.status) }}>
                {getStatusText(pkg.status)}
              </div>
            </div>

            <div className="package-route">
              <div className="package-route-point">
                <div className="route-icon from">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M21 16V8L13 2.27L11 2.27L4 6.27V8V16L11 21.73L13 21.73L20 17.73L21 16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M3.27 6.96L12 12.01L20.73 6.96M12 22.08V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="route-details">
                  <span className="route-label">From</span>
                  <span className="route-address">{pkg.from}</span>
                </div>
              </div>
              <div className="route-connector">
                <div className="connector-line"></div>
              </div>
              <div className="package-route-point">
                <div className="route-icon to">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M3 9L12 2L21 9V20L19 22H5L3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="route-details">
                  <span className="route-label">To</span>
                  <span className="route-address">{pkg.to}</span>
                </div>
              </div>
            </div>

            <div className="package-timeline">
              <div className="timeline-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--primary-green)">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round"/>
                </svg>
                <div className="timeline-info">
                  <span className="timeline-label">{t('packages.pickupTime')}</span>
                  <span className="timeline-value">{pkg.pickupTime}</span>
                </div>
              </div>
              <div className="timeline-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill={pkg.isActive ? '#ccc' : 'var(--primary-green)'}>
                  <circle cx="12" cy="12" r="10"/>
                  {!pkg.isActive && <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round"/>}
                </svg>
                <div className="timeline-info">
                  <span className="timeline-label">{t('packages.deliveryTime')}</span>
                  <span className="timeline-value">{pkg.deliveryTime}</span>
                </div>
              </div>
            </div>

            {pkg.isActive && (
              <>
                <div className="package-progress-bar">
                  <div className="progress-fill" style={{ width: `${pkg.progress}%` }}></div>
                </div>
                <button className="track-package-btn">
                  {t('packages.trackPackage')}
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Packages;
