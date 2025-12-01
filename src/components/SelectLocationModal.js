import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import { useTranslation } from '../contexts/LanguageContext';
import 'leaflet/dist/leaflet.css';
import './SelectLocationModal.css';

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

const SelectLocationModal = ({ 
  isOpen, 
  onClose, 
  onSelectLocation, 
  initialLocation, 
  locationType,
  pickupLocation,
  dropoffLocation 
}) => {
  const { t } = useTranslation();
  const [activeField, setActiveField] = useState(locationType); // 'pickup' or 'dropoff'
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [currentPickup, setCurrentPickup] = useState(pickupLocation);
  const [currentDropoff, setCurrentDropoff] = useState(dropoffLocation);
  const [mapCenter, setMapCenter] = useState(initialLocation || [24.8607, 67.0011]);
  const [showError, setShowError] = useState(false);

  const recentPlaces = [
    {
      id: 1,
      name: 'Muhammad Ali Jinnah Road',
      address: 'Muhammad Ali Jinnah Road',
      distance: '22.7km',
      coordinates: [24.87553277982269, 67.04097209632712]
    },
    {
      id: 2,
      name: 'Bahria Underpass',
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
      name: 'Karachi Grammar School - Middle School',
      address: 'M. A. Jinnah Road, Saddar, Karachi',
      distance: '6.5km',
      coordinates: [24.8643, 67.0281]
    }
  ];

  // Reverse geocoding function to get address from coordinates
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

  // Handle map movement
  const handleLocationChange = async (lat, lng) => {
    setSelectedLocation({ lat, lng });
    const address = await getAddressFromCoordinates(lat, lng);
    
    const locationData = {
      coordinates: [lat, lng],
      address: address,
      name: address.split(',')[0]
    };
    
    if (activeField === 'pickup') {
      setCurrentPickup(locationData);
    } else {
      setCurrentDropoff(locationData);
    }
  };

  // Handle place selection from recent places
  const handlePlaceSelect = (place) => {
    setMapCenter(place.coordinates);
    setSelectedLocation({ lat: place.coordinates[0], lng: place.coordinates[1] });
    
    const locationData = {
      coordinates: place.coordinates,
      address: place.address,
      name: place.name
    };
    
    if (activeField === 'pickup') {
      setCurrentPickup(locationData);
    } else {
      setCurrentDropoff(locationData);
    }
  };

  // Handle confirm button
  const handleConfirm = () => {
    // Check if dropoff is selected
    if (!currentDropoff) {
      setShowError(true);
      setTimeout(() => setShowError(false), 3000); // Hide error after 3 seconds
      return;
    }
    
    // Always update both locations together to ensure state consistency
    if (currentPickup) {
      onSelectLocation(currentPickup, 'pickup');
    }
    if (currentDropoff) {
      onSelectLocation(currentDropoff, 'dropoff');
    }
    
    onClose();
  };

  // Initialize with current location
  useEffect(() => {
    if (isOpen) {
      setCurrentPickup(pickupLocation);
      setCurrentDropoff(dropoffLocation);
      setActiveField(locationType);
      
      // Set map to active field's location
      if (locationType === 'pickup' && pickupLocation) {
        setMapCenter(pickupLocation.coordinates);
        setSelectedLocation({ lat: pickupLocation.coordinates[0], lng: pickupLocation.coordinates[1] });
      } else if (locationType === 'dropoff' && dropoffLocation) {
        setMapCenter(dropoffLocation.coordinates);
        setSelectedLocation({ lat: dropoffLocation.coordinates[0], lng: dropoffLocation.coordinates[1] });
      } else if (locationType === 'dropoff' && !dropoffLocation && pickupLocation) {
        setMapCenter(pickupLocation.coordinates);
      }
    }
  }, [isOpen, pickupLocation, dropoffLocation, locationType]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="location-modal-overlay" onClick={onClose} />
      
      {/* Modal */}
      <div className="location-modal">
        {/* Handle bar */}
        <div className="modal-handle-bar"></div>
        
        {/* Close button */}
        <button className="modal-close-btn" onClick={onClose} aria-label="Close">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Header */}
        <h2 className="modal-title">{t('location.selectAddress')}</h2>

        {/* Map Section */}
        <div className="modal-map-container">
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
          <div className="center-pin">
            <svg width="40" height="48" viewBox="0 0 40 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 0C9.85 0 1.6 8.25 1.6 18.4C1.6 32.2 20 48 20 48C20 48 38.4 32.2 38.4 18.4C38.4 8.25 30.15 0 20 0ZM20 25.2C16.25 25.2 13.2 22.15 13.2 18.4C13.2 14.65 16.25 11.6 20 11.6C23.75 11.6 26.8 14.65 26.8 18.4C26.8 22.15 23.75 25.2 20 25.2Z" fill="#00a859"/>
            </svg>
          </div>
        </div>

        {/* Location Input Fields */}
        <div className="location-inputs">
          <div 
            className={`location-input-field ${activeField === 'pickup' ? 'active' : ''}`}
            onClick={() => {
              setActiveField('pickup');
              if (currentPickup) {
                setMapCenter(currentPickup.coordinates);
                setSelectedLocation({ lat: currentPickup.coordinates[0], lng: currentPickup.coordinates[1] });
              }
            }}
            style={{ cursor: 'pointer' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2"/>
              <circle cx="12" cy="12" r="3" fill="currentColor"/>
              <path d="M12 2V4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
              <path d="M12 20V22" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
              <path d="M2 12H4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
              <path d="M20 12H22" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
            <input
              type="text"
              placeholder={t('home.currentLocation')}
              value={currentPickup ? currentPickup.name || currentPickup.address : ''}
              readOnly
              className="location-input"
            />
          </div>

          <div 
            className={`location-input-field ${activeField === 'dropoff' ? 'active' : ''}`}
            onClick={() => {
              setActiveField('dropoff');
              if (currentDropoff) {
                setMapCenter(currentDropoff.coordinates);
                setSelectedLocation({ lat: currentDropoff.coordinates[0], lng: currentDropoff.coordinates[1] });
              }
            }}
            style={{ cursor: 'pointer' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <input
              type="text"
              placeholder={t('location.to')}
              value={currentDropoff ? currentDropoff.name || currentDropoff.address : ''}
              readOnly
              className="location-input"
            />
          </div>
        </div>

        {/* Recent Places */}
        <div className="recent-places-section">
          <h3 className="recent-places-title">{t('location.recentPlaces')}</h3>
          <div className="recent-places-list">
            {recentPlaces.map((place) => (
              <button
                key={place.id}
                className="recent-place-item"
                onClick={() => handlePlaceSelect(place)}
              >
                <div className="place-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
                <div className="place-info">
                  <p className="place-name">{place.name}</p>
                  <p className="place-address">{place.address}</p>
                </div>
                <span className="place-distance">{place.distance}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {showError && (
          <div className="location-error-message">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 8V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M12 16H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span>{t('location.selectDropoff')}</span>
          </div>
        )}

        {/* Confirm Button Container */}
        <div className="confirm-button-container">
          <button className="confirm-location-btn" onClick={handleConfirm}>
            {t('location.confirmLocation')}
          </button>
        </div>
      </div>
    </>
  );
};

export default SelectLocationModal;
