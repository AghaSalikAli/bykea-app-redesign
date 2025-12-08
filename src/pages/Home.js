import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Circle, useMap } from 'react-leaflet';
import SelectLocationModal from '../components/SelectLocationModal';
import Sidebar from '../components/Sidebar';
import ReadAloudWrapper from '../components/ReadAloudWrapper';
import { useLanguage, useTranslation } from '../contexts/LanguageContext';
import { useReadAloud } from '../hooks/useReadAloud';
import 'leaflet/dist/leaflet.css';
import './Home.css';

// Fix for default marker icon in react-leaflet
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom icon for current location
const currentLocationIcon = new L.DivIcon({
  className: 'current-location-marker',
  html: `
    <div class="location-marker-outer">
      <div class="location-marker-inner"></div>
    </div>
  `,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

// Component to handle map movement and update pickup location
function HomeMapController({ onLocationChange }) {
  const map = useMap();
  const [isMoving, setIsMoving] = React.useState(false);

  React.useEffect(() => {
    const handleMoveStart = () => setIsMoving(true);
    const handleMoveEnd = () => {
      setIsMoving(false);
      const center = map.getCenter();
      onLocationChange(center.lat, center.lng);
    };

    map.on('movestart', handleMoveStart);
    map.on('moveend', handleMoveEnd);

    return () => {
      map.off('movestart', handleMoveStart);
      map.off('moveend', handleMoveEnd);
    };
  }, [map, onLocationChange]);

  return null;
}

// Component to handle map re-centering
function RecenterButton({ position, buttonText }) {
  const map = useMap();
  const { readText } = useReadAloud();
  
  const handleRecenter = () => {
    // Get current zoom or use default
    const currentZoom = map.getZoom();
    
    // Pan to the position and maintain the same zoom level as initial view
    map.flyTo(position, currentZoom, {
      duration: 0.5
    });
    
    // Read feedback
    if (buttonText) {
      readText(buttonText);
    }
  };
  
  return (
    <button 
      className="center-location-btn" 
      onClick={handleRecenter}
      onTouchStart={() => buttonText && readText(buttonText)}
      onMouseEnter={() => buttonText && readText(buttonText)}
      aria-label="Center on my location"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2"/>
        <circle cx="12" cy="12" r="3" fill="currentColor"/>
        <path d="M12 2V4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M12 20V22" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M2 12H4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M20 12H22" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
      </svg>
    </button>
  );
}

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { language, toggleLanguage } = useLanguage();
  const { t } = useTranslation();
  const { readText } = useReadAloud();
  const [activeTab, setActiveTab] = useState('ride');
  const [userLocation] = useState([24.9419, 67.1143]); // IBA Main Campus coordinates
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Check if returning from review trip with existing locations
  const existingPickup = location.state?.pickup;
  const existingDropoff = location.state?.dropoff;
  
  const [pickupLocation, setPickupLocation] = useState(
    existingPickup || {
      coordinates: [24.9419, 67.1143],
      address: 'Loading...',
      name: t('home.currentLocation')
    }
  );
  const [dropoffLocation, setDropoffLocation] = useState(existingDropoff || null);
  const [currentLocationType, setCurrentLocationType] = useState('pickup'); // 'pickup' or 'dropoff'

  // Reverse geocoding function
  const getAddressFromCoordinates = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      const data = await response.json();
      return data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    } catch (error) {
      console.error('Error fetching address:', error);
      return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    }
  };

  // Handle home map movement (for pickup location)
  const handleHomeMapMove = async (lat, lng) => {
    const address = await getAddressFromCoordinates(lat, lng);
    setPickupLocation({
      coordinates: [lat, lng],
      address: address,
      name: address.split(',')[0]
    });
  };

  // Initialize pickup location on mount
  React.useEffect(() => {
    getAddressFromCoordinates(userLocation[0], userLocation[1]).then(address => {
      setPickupLocation({
        coordinates: userLocation,
        address: address,
        name: address.split(',')[0]
      });
    });
  }, []);

  const handleSearchClick = () => {
    setCurrentLocationType('dropoff');
    setIsLocationModalOpen(true);
  };

  const handleLocationSelect = (location, fieldType) => {
    if (fieldType === 'pickup') {
      setPickupLocation(location);
    } else if (fieldType === 'dropoff') {
      setDropoffLocation(location);
    }
    
    console.log(`Selected ${fieldType} location:`, location);
  };

  // Effect to navigate when both locations are set
  useEffect(() => {
    if (pickupLocation && dropoffLocation && !isLocationModalOpen) {
      navigate('/review-trip', {
        state: {
          pickup: pickupLocation,
          dropoff: dropoffLocation
        }
      });
    }
  }, [pickupLocation, dropoffLocation, isLocationModalOpen, navigate]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // Read the selected tab
    readText(tab === 'ride' ? t('home.ride') : t('home.courier'));
    // Just toggle the tab, don't navigate away
  };

  const handleLanguageToggle = () => {
    toggleLanguage();
    const newLang = language === 'en' ? 'اردو' : 'English';
    readText(t('common.languageSwitched') || `Language switched to ${newLang}`);
  };

  return (
    <div className="home-page">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Map Section */}
      <div className="map-container">
        {/* Hamburger Menu Button */}
        <ReadAloudWrapper
          as="button"
          text={t('common.menu') || 'Menu'}
          className="home-hamburger-button"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open menu"
          onHover={true}
        >
          <div className="hamburger-icon">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </ReadAloudWrapper>

        {/* Language Toggle Button */}
        <ReadAloudWrapper
          as="button"
          text={`${t('common.changeLanguage') || 'Change language'}, ${language === 'en' ? 'English' : 'اردو'}`}
          className="language-toggle-button"
          onClick={handleLanguageToggle}
          aria-label="Toggle language"
          onHover={true}
        >
          <span className={`lang-option ${language === 'en' ? 'active' : ''}`}>EN</span>
          <span className="toggle-divider"></span>
          <span className={`lang-option ${language === 'ur' ? 'active' : ''}`}>اردو</span>
        </ReadAloudWrapper>
        
        <MapContainer 
          center={userLocation} 
          zoom={14} 
          zoomControl={false}
          style={{ height: '100%', width: '100%' }}
          attributionControl={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker 
            position={userLocation} 
            icon={currentLocationIcon}
          />
          <Circle 
            center={userLocation} 
            radius={500} 
            pathOptions={{ 
              fillColor: '#00a859', 
              fillOpacity: 0.1,
              color: '#00a859',
              weight: 1
            }} 
          />
          <Circle 
            center={userLocation} 
            radius={1000} 
            pathOptions={{ 
              fillColor: '#00a859', 
              fillOpacity: 0.05,
              color: '#00a859',
              weight: 1
            }} 
          />
          <HomeMapController onLocationChange={handleHomeMapMove} />
          <RecenterButton position={userLocation} buttonText={t('home.currentLocation') || 'Center on my location'} />
        </MapContainer>
        
        {/* Center Pin for Pickup Selection */}
        <ReadAloudWrapper
          text={`${t('home.pickupLocation')}, ${pickupLocation ? pickupLocation.name : t('home.currentLocation')}`}
          className="home-center-pin"
          onHover={true}
        >
          <svg width="40" height="48" viewBox="0 0 40 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 0C9.85 0 1.6 8.25 1.6 18.4C1.6 32.2 20 48 20 48C20 48 38.4 32.2 38.4 18.4C38.4 8.25 30.15 0 20 0ZM20 25.2C16.25 25.2 13.2 22.15 13.2 18.4C13.2 14.65 16.25 11.6 20 11.6C23.75 11.6 26.8 14.65 26.8 18.4C26.8 22.15 23.75 25.2 20 25.2Z" fill="#00a859"/>
          </svg>
        </ReadAloudWrapper>
      </div>

      {/* Bottom Panel */}
      <div className="bottom-panel">
        {/* From Location Display */}
        <ReadAloudWrapper
          text={`${t('home.from')}, ${pickupLocation ? pickupLocation.name : t('home.currentLocation')}`}
          className="from-location-display"
          onHover={true}
        >
          <span className="location-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2"/>
              <circle cx="12" cy="12" r="3" fill="currentColor"/>
              <path d="M12 2V4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
              <path d="M12 20V22" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
              <path d="M2 12H4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
              <path d="M20 12H22" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </span>
          <input
            type="text"
            value={pickupLocation ? pickupLocation.name : t('home.currentLocation')}
            className="location-input"
            readOnly
            onFocus={() => readText(`${t('home.from')}, ${pickupLocation ? pickupLocation.name : t('home.currentLocation')}`)}
          />
        </ReadAloudWrapper>

        {/* To/Search Input */}
        <ReadAloudWrapper
          text={dropoffLocation ? `${t('home.to')}, ${dropoffLocation.name}` : (activeTab === 'ride' ? t('home.whereGo') : t('home.whereDeliver'))}
          className="search-container"
          onClick={handleSearchClick}
          onHover={true}
        >
          <span className="search-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
          <input
            type="text"
            placeholder={activeTab === 'ride' ? t('home.whereGo') : t('home.whereDeliver')}
            value={dropoffLocation ? dropoffLocation.name : ''}
            className="search-input"
            readOnly
            aria-label={activeTab === 'ride' ? t('home.whereGo') : t('home.whereDeliver')}
          />
        </ReadAloudWrapper>

        {/* Tab Buttons */}
        <div className="tab-buttons">
          <div className={`tab-slider ${activeTab === 'courier' ? 'slider-right' : ''}`}></div>
          <ReadAloudWrapper
            as="button"
            text={`${t('home.ride')} ${activeTab === 'ride' ? t('common.selected') || 'selected' : ''}`}
            className={`tab-button ${activeTab === 'ride' ? 'active' : ''}`}
            onClick={() => handleTabChange('ride')}
            aria-pressed={activeTab === 'ride'}
            onHover={true}
          >
            {t('home.ride')}
          </ReadAloudWrapper>
          <ReadAloudWrapper
            as="button"
            text={`${t('home.courier')} ${activeTab === 'courier' ? t('common.selected') || 'selected' : ''}`}
            className={`tab-button ${activeTab === 'courier' ? 'active' : ''}`}
            onClick={() => handleTabChange('courier')}
            aria-pressed={activeTab === 'courier'}
            onHover={true}
          >
            {t('home.courier')}
          </ReadAloudWrapper>
        </div>
      </div>

      {/* Location Selection Modal */}
      <SelectLocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        onSelectLocation={handleLocationSelect}
        initialLocation={userLocation}
        locationType={currentLocationType}
        pickupLocation={pickupLocation}
        dropoffLocation={dropoffLocation}
      />
    </div>
  );
};

export default Home;


