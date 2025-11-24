import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MapContainer, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import { useTranslation } from '../contexts/LanguageContext';
import 'leaflet/dist/leaflet.css';
import './AddStopModal.css';

// Component to handle map movement and get center coordinates
function MapController({ onLocationChange, initialCenter }) {
  const map = useMap();
  const [isMoving, setIsMoving] = useState(false);

  useMapEvents({
    movestart: () => {
      setIsMoving(true);
    },
    moveend: () => {
      setIsMoving(false);
      const center = map.getCenter();
      onLocationChange(center.lat, center.lng);
    },
  });

  useEffect(() => {
    if (initialCenter) {
      map.setView(initialCenter, map.getZoom());
    }
  }, [initialCenter, map]);

  return null;
}

function AddStopModal({ isOpen, onClose, onStopAdded }) {
  const { t } = useTranslation();

  const [mapCenter, setMapCenter] = useState([24.8607, 67.0011]); // Karachi
  const [currentStop, setCurrentStop] = useState({
    coordinates: [24.8607, 67.0011],
    address: 'Loading...',
    name: ''
  });

  // Recent places for stops
  const recentPlaces = [
    {
      id: 1,
      name: 'IBA Main Campus',
      address: 'Main Campus, University Road, Gulshan-e-Iqbal, Karachi',
      distance: '2.7km',
      coordinates: [24.9456, 67.1133]
    },
    {
      id: 2,
      name: 'Dolmen Mall Clifton',
      address: 'HC-3, Block 4 Clifton, Karachi',
      distance: '4.5km',
      coordinates: [24.8138, 67.0282]
    },
    {
      id: 3,
      name: 'Jinnah International Airport',
      address: 'Airport Road, Karachi',
      distance: '8.2km',
      coordinates: [24.9065, 67.1608]
    },
    {
      id: 4,
      name: 'Saddar Empress Market',
      address: 'M. A. Jinnah Road, Saddar, Karachi',
      distance: '6.5km',
      coordinates: [24.8643, 67.0281]
    }
  ];

  // Reverse geocoding
  const getAddressFromCoordinates = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      const data = await response.json();
      
      if (data.display_name) {
        return data.display_name;
      } else {
        return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
      }
    } catch (error) {
      console.error('Error fetching address:', error);
      return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    }
  };

  const handleLocationChange = async (lat, lng) => {
    const address = await getAddressFromCoordinates(lat, lng);
    setCurrentStop({
      coordinates: [lat, lng],
      address: address,
      name: address.split(',')[0]
    });
  };

  const handlePlaceSelect = (place) => {
    setMapCenter(place.coordinates);
    setCurrentStop({
      coordinates: place.coordinates,
      address: place.address,
      name: place.name
    });
  };

  const handleAddStop = () => {
    // Call the callback with the new stop
    if (onStopAdded) {
      onStopAdded(currentStop);
    }
  };

  const handleBack = () => {
    if (onClose) {
      onClose();
    }
  };

  // Initialize location name on mount
  useEffect(() => {
    getAddressFromCoordinates(mapCenter[0], mapCenter[1]).then(address => {
      setCurrentStop({
        coordinates: mapCenter,
        address: address,
        name: address.split(',')[0]
      });
    });
  }, []);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="add-stop-overlay" onClick={handleBack} />
      
      {/* Modal */}
      <div className="add-stop-modal">
        {/* Handle bar */}
        <div className="add-stop-handle-bar"></div>
        
        {/* Close button */}
        <button className="add-stop-close-btn" onClick={handleBack} aria-label="Close">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Header */}
        <h2 className="add-stop-modal-title">{t('addStop.title')}</h2>

        {/* Map Section */}
        <div className="add-stop-map-container">
          <MapContainer
            center={mapCenter}
            zoom={14}
            zoomControl={false}
            style={{ height: '100%', width: '100%' }}
            attributionControl={false}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <MapController onLocationChange={handleLocationChange} initialCenter={mapCenter} />
          </MapContainer>
          
          {/* Center Pin */}
          <div className="add-stop-center-pin">
            <svg width="40" height="48" viewBox="0 0 40 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 0C9.85 0 1.6 8.25 1.6 18.4C1.6 32.2 20 48 20 48C20 48 38.4 32.2 38.4 18.4C38.4 8.25 30.15 0 20 0ZM20 25.2C16.25 25.2 13.2 22.15 13.2 18.4C13.2 14.65 16.25 11.6 20 11.6C23.75 11.6 26.8 14.65 26.8 18.4C26.8 22.15 23.75 25.2 20 25.2Z" fill="#00a859"/>
            </svg>
          </div>
        </div>

        {/* Location Input Field */}
        <div className="add-stop-inputs">
          <div className="add-stop-input-field">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <input
              type="text"
              placeholder={t('addStop.stopLocation')}
              value={currentStop.name || currentStop.address}
              readOnly
              className="add-stop-location-input"
            />
          </div>
        </div>

        {/* Recent Places */}
        <div className="add-stop-recent-places-section">
          <h3 className="add-stop-recent-places-title">{t('location.recentPlaces')}</h3>
          <div className="add-stop-recent-places-list">
            {recentPlaces.map((place) => (
              <button
                key={place.id}
                className="add-stop-recent-place-item"
                onClick={() => handlePlaceSelect(place)}
              >
                <div className="add-stop-place-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
                <div className="add-stop-place-info">
                  <p className="add-stop-place-name">{place.name}</p>
                  <p className="add-stop-place-address">{place.address}</p>
                </div>
                <span className="add-stop-place-distance">{place.distance}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Add Stop Button */}
        <button className="add-stop-confirm-button" onClick={handleAddStop}>
          {t('editRide.addStop')}
        </button>
      </div>
    </>
  );
}

export default AddStopModal;
