import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import { useTranslation } from '../contexts/LanguageContext';
import ReadAloudWrapper from '../components/ReadAloudWrapper';
import L from 'leaflet';
import './ReviewTrip.css';

// Custom icons for pickup and dropoff
const pickupIcon = new L.DivIcon({
  className: 'custom-pickup-icon',
  html: `
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill="#00a859" stroke="white" stroke-width="2"/>
      <circle cx="12" cy="12" r="5" fill="white"/>
    </svg>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

const dropoffIcon = new L.DivIcon({
  className: 'custom-dropoff-icon',
  html: `
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#FF4444" stroke="white" stroke-width="1"/>
    </svg>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

// Custom icon for intermediate stops
const stopIcon = new L.DivIcon({
  className: 'custom-stop-icon',
  html: `
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill="#FF9800" stroke="white" stroke-width="2"/>
      <circle cx="12" cy="12" r="4" fill="white"/>
    </svg>
  `,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

// Component to fit bounds to show all markers
function MapBoundsController({ allCoordinates }) {
  const map = useMap();

  useEffect(() => {
    if (allCoordinates && allCoordinates.length > 0) {
      const bounds = L.latLngBounds(allCoordinates);
      map.fitBounds(bounds, { padding: [80, 80] });
    }
  }, [allCoordinates, map]);

  return null;
}

function ReviewTrip() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { pickup, dropoff, stops = [] } = location.state || {};

  const [routeCoords, setRouteCoords] = useState([]);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // If no pickup or dropoff, redirect back to home
    if (!pickup || !dropoff) {
      navigate('/');
      return;
    }

    // Calculate route using OSRM (Open Source Routing Machine)
    const fetchRoute = async () => {
      try {
        setIsLoading(true);
        
        // Build coordinate string: pickup, all stops, then dropoff
        const allCoordinates = [
          pickup.coordinates,
          ...stops.map(stop => stop.coordinates),
          dropoff.coordinates
        ];
        const coordString = allCoordinates.map(coord => `${coord[1]},${coord[0]}`).join(';');
        
        const response = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${coordString}?overview=full&geometries=geojson`
        );
        const data = await response.json();

        if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
          const route = data.routes[0];
          
          // Convert coordinates from [lng, lat] to [lat, lng] for Leaflet
          const coords = route.geometry.coordinates.map(coord => [coord[1], coord[0]]);
          setRouteCoords(coords);

          // Set distance (convert meters to km)
          const distanceInKm = (route.distance / 1000).toFixed(1);
          setDistance(distanceInKm);

          // Set duration (convert seconds to minutes)
          const durationInMinutes = Math.ceil(route.duration / 60);
          setDuration(durationInMinutes);
        }
      } catch (error) {
        console.error('Error fetching route:', error);
        // Fallback: create straight line between points
        setRouteCoords([[pickup.coordinates[0], pickup.coordinates[1]], [dropoff.coordinates[0], dropoff.coordinates[1]]]);
        // Calculate approximate distance using Haversine formula
        const dist = calculateDistance(pickup.coordinates, dropoff.coordinates);
        setDistance(dist.toFixed(1));
        setDuration(Math.ceil(dist * 3)); // Rough estimate: 3 min per km
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoute();
  }, [pickup, dropoff, navigate]);

  // Haversine formula for distance calculation (fallback)
  const calculateDistance = (coords1, coords2) => {
    const R = 6371; // Earth's radius in km
    const dLat = toRad(coords2[0] - coords1[0]);
    const dLon = toRad(coords2[1] - coords1[1]);
    const lat1 = toRad(coords1[0]);
    const lat2 = toRad(coords2[0]);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const toRad = (value) => {
    return (value * Math.PI) / 180;
  };

  const handleEdit = () => {
    // Navigate to Edit Your Ride screen (combined with reorder functionality)
    navigate('/edit-your-ride', { state: { pickup, dropoff, stops, distance, duration } });
  };

  const handleConfirm = () => {
    // Navigate to vehicle selection (Phase 4)
    navigate('/select-vehicle', { state: { pickup, dropoff, stops, distance, duration } });
  };

  if (!pickup || !dropoff) {
    return null;
  }

  return (
    <div className="review-trip-container">
      <div className="review-map-container">
        <MapContainer
          center={pickup.coordinates}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Pickup marker */}
          <Marker position={pickup.coordinates} icon={pickupIcon} />

          {/* Intermediate stop markers */}
          {stops.map((stop, index) => (
            <Marker 
              key={index} 
              position={stop.coordinates} 
              icon={stopIcon}
            />
          ))}

          {/* Dropoff marker */}
          <Marker position={dropoff.coordinates} icon={dropoffIcon} />

          {/* Route line */}
          {routeCoords.length > 0 && (
            <Polyline
              positions={routeCoords}
              color="#00a859"
              weight={4}
              opacity={0.8}
            />
          )}

          {/* Fit bounds to show all markers */}
          <MapBoundsController
            allCoordinates={[
              pickup.coordinates,
              ...stops.map(stop => stop.coordinates),
              dropoff.coordinates
            ]}
          />
        </MapContainer>

        {/* Back button */}
        <ReadAloudWrapper
          as="button"
          text={t('common.back')}
          className="back-button"
          onClick={() => navigate(-1)}
          onHover={true}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </ReadAloudWrapper>
      </div>

      <div className="review-details-panel">
        <div className="review-header">
          <h2 className="review-title">{t('reviewTrip.title')}</h2>
          <ReadAloudWrapper
            as="button"
            text={t('editRide.title')}
            className="edit-button-icon"
            onClick={handleEdit}
            onHover={true}
            readOnClick={true}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </ReadAloudWrapper>
        </div>

        {/* Scrollable Content */}
        <div className="review-content">
          {/* Trip info */}
          <div className="trip-info-card">
          <div className="location-info">
            <div className="location-row">
              <div className="location-dot pickup-dot"></div>
              <div className="location-text">
                <span className="location-label">{t('reviewTrip.pickup')}</span>
                <span className="location-name">{pickup.name}</span>
              </div>
            </div>

            <div className="location-divider"></div>

            {/* Intermediate Stops */}
            {stops.map((stop, index) => (
              <React.Fragment key={index}>
                <div className="location-row">
                  <div className="location-dot stop-dot"></div>
                  <div className="location-text">
                    <span className="location-label">{t('reviewTrip.stop')} {index + 1}</span>
                    <span className="location-name">{stop.name}</span>
                  </div>
                </div>
                <div className="location-divider"></div>
              </React.Fragment>
            ))}

            <div className="location-row">
              <div className="location-dot dropoff-dot"></div>
              <div className="location-text">
                <span className="location-label">{t('reviewTrip.dropoff')}</span>
                <span className="location-name">{dropoff.name}</span>
              </div>
            </div>
          </div>

          {/* Distance and duration */}
          {!isLoading && distance && duration && (
            <div className="trip-stats">
              <div className="stat-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M9 11l3 3 8-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>{distance} {t('reviewTrip.distance')}</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <span>{duration} {t('reviewTrip.duration')}</span>
              </div>
            </div>
          )}
        </div>
        </div>

        {/* Confirm button - Fixed at bottom */}
        <ReadAloudWrapper
          as="button"
          text={t('reviewTrip.confirmRide')}
          className="confirm-button"
          onClick={handleConfirm}
          onHover={true}
        >
          {t('reviewTrip.confirmRide')}
        </ReadAloudWrapper>
      </div>
    </div>
  );
}

export default ReviewTrip;
