import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../contexts/LanguageContext';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [profile, setProfile] = useState({
    name: 'Mr. Shakeel Khoja',
    phone: '+92 300 1234567',
    email: 's.khoja@iba.edu.pk',
    emergencyContact: '+92 321 9876543',
    memberSince: 'Jan 1992',
    totalRides: 142
  });

  return (
    <div className="profile-container">
      {/* Header */}
      <div className="profile-header">
        <button className="profile-back-btn" onClick={() => navigate('/')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 className="profile-title">{t('profile.title')}</h1>
      </div>

      {/* Profile Avatar */}
      <div className="profile-avatar-section">
        <div className="profile-avatar">
          <span className="avatar-text">{profile.name.charAt(0)}</span>
        </div>
        <h2 className="profile-name">{profile.name}</h2>
        <div className="profile-stats">
          <div className="stat-item">
            <span className="stat-value">{profile.totalRides}</span>
            <span className="stat-label">{t('profile.totalRides')}</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-value">{profile.memberSince}</span>
            <span className="stat-label">{t('profile.memberSince')}</span>
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <div className="profile-form">
        <div className="form-group">
          <label className="form-label">{t('profile.name')}</label>
          <input 
            type="text" 
            className="form-input" 
            value={profile.name}
            readOnly
          />
        </div>

        <div className="form-group">
          <label className="form-label">{t('profile.phone')}</label>
          <input 
            type="tel" 
            className="form-input" 
            value={profile.phone}
            readOnly
          />
        </div>

        <div className="form-group">
          <label className="form-label">{t('profile.email')}</label>
          <input 
            type="email" 
            className="form-input" 
            value={profile.email}
            readOnly
          />
        </div>

        <div className="form-group">
          <label className="form-label">{t('profile.emergencyContact')}</label>
          <input 
            type="tel" 
            className="form-input" 
            value={profile.emergencyContact}
            readOnly
          />
        </div>

        <button className="edit-profile-btn">
          {t('profile.editProfile')}
        </button>
      </div>
    </div>
  );
};

export default Profile;
