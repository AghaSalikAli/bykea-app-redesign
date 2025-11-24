import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from '../contexts/LanguageContext';
import './VehicleSelection.css';

const VehicleSelection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { pickup, dropoff, stops = [], distance, duration } = location.state || {};
  
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  // Vehicle options with pricing based on distance
  const vehicles = [
    {
      id: 'bike',
      name: t('vehicle.bike'),
      imagePath: '/images/bike-icon.png', // Replace with your own image
      basePrice: 50,
      pricePerKm: 15
    },
    {
      id: 'car',
      name: t('vehicle.car'),
      imagePath: '/images/car-icon.png', // Replace with your own image
      basePrice: 150,
      pricePerKm: 35
    },
    {
      id: 'car-ac',
      name: t('vehicle.carAC'),
      imagePath: '/images/car-ac-icon.png', // Replace with your own image
      basePrice: 200,
      pricePerKm: 45
    },
    {
      id: 'rickshaw',
      name: t('vehicle.rickshaw'),
      imagePath: '/images/rickshaw-icon.png', // Replace with your own image
      basePrice: 80,
      pricePerKm: 20
    }
  ];

  // Calculate estimated price for each vehicle
  const calculatePrice = (vehicle) => {
    if (!distance) return vehicle.basePrice;
    const distanceNum = parseFloat(distance);
    return Math.round(vehicle.basePrice + (vehicle.pricePerKm * distanceNum));
  };

  const handleVehicleSelect = (vehicle) => {
    setSelectedVehicle(vehicle);
  };

  const handleConfirm = () => {
    if (!selectedVehicle) return;
    
    // Navigate to ride booking phase (Phase 5)
    navigate('/ride-booking', {
      state: {
        pickup,
        dropoff,
        stops,
        distance,
        duration,
        vehicle: selectedVehicle,
        estimatedPrice: calculatePrice(selectedVehicle)
      }
    });
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (!pickup || !dropoff) {
    navigate('/');
    return null;
  }

  return (
    <div className="vehicle-selection-container">
      {/* Header */}
      <div className="vehicle-header">
        <button className="vehicle-back-button" onClick={handleBack}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 className="vehicle-header-title">{t('vehicle.title')}</h1>
      </div>

      {/* Main Content */}
      <div className="vehicle-content">
        <h2 className="vehicle-main-title">{t('vehicle.chooseVehicle')}</h2>

        {/* Vehicle Grid */}
        <div className="vehicle-grid">
          {vehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className={`vehicle-card ${selectedVehicle?.id === vehicle.id ? 'selected' : ''}`}
              onClick={() => handleVehicleSelect(vehicle)}
            >
              <div className="vehicle-icon-wrapper">
                <img 
                  src={vehicle.imagePath} 
                  alt={vehicle.name}
                  className="vehicle-icon-image"
                  onError={(e) => {
                    // Fallback placeholder if image not found
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="vehicle-icon-placeholder">
                  <span>{vehicle.name.charAt(0)}</span>
                </div>
              </div>
              <span className="vehicle-name">{vehicle.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Confirm Button */}
      <button 
        className="vehicle-confirm-button" 
        onClick={handleConfirm}
        disabled={!selectedVehicle}
      >
        {t('vehicle.confirm')}
      </button>
    </div>
  );
};

export default VehicleSelection;
