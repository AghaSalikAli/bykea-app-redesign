import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Circle } from 'react-leaflet';
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

const Home = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('ride');
  const [userLocation] = useState([24.8607, 67.0011]); // Karachi coordinates

  const handleSearchClick = () => {
    navigate('/select-location');
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // Just toggle the tab, don't navigate away
  };

  return (
    <div className="home-page">
      {/* Map Section */}
      <div className="map-container">
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
          <Marker position={userLocation} />
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
        </MapContainer>
        
        {/* Center Location Button */}
        <button className="center-location-btn" aria-label="Center on my location">
          <span>⊕</span>
        </button>
      </div>

      {/* Bottom Panel */}
      <div className="bottom-panel">
        {/* Search Input */}
        <div className="search-container" onClick={handleSearchClick}>
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder={activeTab === 'ride' ? 'Where would you like to go?' : 'Where do you want to deliver?'}
            className="search-input"
            readOnly
            aria-label={activeTab === 'ride' ? 'Where would you like to go?' : 'Where do you want to deliver?'}
          />
        </div>

        {/* Tab Buttons */}
        <div className="tab-buttons">
          <button
            className={`tab-button ${activeTab === 'ride' ? 'active' : ''}`}
            onClick={() => handleTabChange('ride')}
            aria-pressed={activeTab === 'ride'}
          >
            Ride
          </button>
          <button
            className={`tab-button ${activeTab === 'courier' ? 'active' : ''}`}
            onClick={() => handleTabChange('courier')}
            aria-pressed={activeTab === 'courier'}
          >
            Courier
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;


