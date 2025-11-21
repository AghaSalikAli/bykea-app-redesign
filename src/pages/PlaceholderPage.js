import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PlaceholderPage.css';

const PlaceholderPage = ({ title, description, icon = '🚧' }) => {
  const navigate = useNavigate();

  return (
    <div className="placeholder-page">
      <div className="placeholder-content">
        <div className="placeholder-icon">{icon}</div>
        <h2>{title}</h2>
        <p>{description}</p>
        <button 
          className="primary-button"
          onClick={() => navigate(-1)}
        >
          Go Back
        </button>
        <button 
          className="secondary-button mt-2"
          onClick={() => navigate('/')}
        >
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default PlaceholderPage;
