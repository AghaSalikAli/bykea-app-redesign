import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { useTranslation } from '../contexts/LanguageContext';
import { useReadAloud } from '../hooks/useReadAloud';
import ReadAloudWrapper from '../components/ReadAloudWrapper';
import './RideBooking.css';

// Custom icons
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

const RideBooking = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { readText } = useReadAloud();
  const { pickup, dropoff, stops = [], distance, duration, vehicle, estimatedPrice } = location.state || {};

  const [searchingForRides, setSearchingForRides] = useState(true);
  const [availableRides, setAvailableRides] = useState([]);
  const [removedDrivers, setRemovedDrivers] = useState([]);
  const [routeCoords, setRouteCoords] = useState([]);

  // Mock drivers data
  // Announce "looking for rides" when component mounts
  useEffect(() => {
    if (searchingForRides) {
      readText(t('rideBooking.lookingForRides'));
    }
  }, []);

  const mockDrivers = [
    {
      id: 1,
      name: 'Agha Salik Ali',
      rating: 4.92,
      totalRides: 1231,
      vehicle: 'Grey Suzuki Alto',
      distance: '800m',
      timeAway: '5 mins away',
      price: estimatedPrice || 220,
      avatar: '/images/driver-1.png'
    },
    {
      id: 2,
      name: 'Simra Sheikh',
      rating: 4.95,
      totalRides: 978,
      vehicle: 'Grey Suzuki Alto',
      distance: '1.5km',
      timeAway: '9 mins away',
      price: (estimatedPrice || 220) + 50,
      avatar: '/images/driver-2.png'
    },
    {
      id: 3,
      name: 'Shaikh Sharjeel',
      rating: 4.96,
      totalRides: 540,
      vehicle: 'Grey Suzuki Alto',
      distance: '1km',
      timeAway: '7 mins away',
      price: (estimatedPrice || 220) + 100,
      avatar: '/images/driver-3.png'
    }
  ];

  // Fetch route on mount
  useEffect(() => {
    const fetchRoute = async () => {
      try {
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
        }
      } catch (error) {
        console.error('Error fetching route:', error);
      }
    };

    if (pickup && dropoff) {
      fetchRoute();
    }
  }, [pickup, dropoff, stops]);

  useEffect(() => {
    // Wait 5 seconds before showing available rides
    const searchTimer = setTimeout(() => {
      setSearchingForRides(false);
    }, 5000);

    return () => clearTimeout(searchTimer);
  }, []);

  useEffect(() => {
    if (!searchingForRides) {
      // Add drivers one by one with delays
      const addDriver = (index) => {
        if (index < mockDrivers.length) {
          setTimeout(() => {
            setAvailableRides(prev => [...prev, { ...mockDrivers[index], timer: 10, addedAt: Date.now() }]);
            addDriver(index + 1);
          }, 3000 * index); // Add each driver 3 seconds apart
        }
      };
      addDriver(0);
    }
  }, [searchingForRides]);

  // Timer countdown for each driver
  useEffect(() => {
    const interval = setInterval(() => {
      setAvailableRides(prev => {
        const expiredRides = prev.filter(ride => ride.timer <= 0.1);
        const updated = prev.map(ride => ({
          ...ride,
          timer: ride.timer - 0.1
        })).filter(ride => ride.timer > 0);

        // Track expired rides
        if (expiredRides.length > 0) {
          setRemovedDrivers(current => [...current, ...expiredRides.map(r => ({ ...r, removedAt: Date.now() }))]);
        }

        // If no rides left, show searching screen
        if (updated.length === 0 && expiredRides.length > 0) {
          setSearchingForRides(true);
        }

        return updated;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // Re-add removed drivers after 5 seconds
  useEffect(() => {
    if (removedDrivers.length === 0) return;

    const timeouts = removedDrivers.map((driver) => {
      const timeSinceRemoval = Date.now() - driver.removedAt;
      const delay = Math.max(0, 5000 - timeSinceRemoval);

      return setTimeout(() => {
        setAvailableRides(current => {
          const exists = current.find(r => r.id === driver.id);
          if (!exists) {
            return [...current, { ...mockDrivers.find(d => d.id === driver.id), timer: 10 }];
          }
          return current;
        });
        setRemovedDrivers(current => current.filter(d => d.id !== driver.id));
        setSearchingForRides(false);
      }, delay);
    });

    return () => timeouts.forEach(clearTimeout);
  }, [removedDrivers]);

  const handleAcceptRide = (driver) => {
    navigate('/review-driver', {
      state: { pickup, dropoff, stops, distance, duration, vehicle, estimatedPrice, driver }
    });
  };

  const handleCancel = () => {
    navigate('/', { replace: true });
  };

  const handleCancelRide = (rideId) => {
    setAvailableRides(prev => {
      const updated = prev.filter(ride => ride.id !== rideId);
      // If no rides left, show searching screen
      if (updated.length === 0) {
        setSearchingForRides(true);
      }
      return updated;
    });
  };

  if (!pickup || !dropoff || !pickup.coordinates || !dropoff.coordinates) {
    navigate('/');
    return null;
  }

  if (searchingForRides) {
    return (
      <div className="review-trip-container">
        {/* Map Section - Extended to hide attribution */}
        <div className="review-map-container">
          <MapContainer
            center={pickup.coordinates}
            zoom={13}
            style={{ height: 'calc(100% + 40px)', width: '100%', marginBottom: '-40px' }}
            zoomControl={false}
            attributionControl={false}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            
            {/* Route Polyline */}
            {routeCoords.length > 0 && (
              <Polyline 
                positions={routeCoords} 
                color="#00a859" 
                weight={4}
                opacity={0.7}
              />
            )}
            
            <Marker position={pickup.coordinates} icon={pickupIcon} />
            {stops.map((stop, index) => (
              <Marker key={index} position={stop.coordinates} />
            ))}
            <Marker position={dropoff.coordinates} icon={dropoffIcon} />
          </MapContainer>

          {/* Back button */}
          <ReadAloudWrapper
            as="button"
            text={t('common.back')}
            className="back-button"
            onClick={handleCancel}
            onHover={true}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </ReadAloudWrapper>
        </div>

        {/* Details Panel */}
        <div className="review-details-panel">
          <div className="review-header">
            <h2 className="review-title">{t('rideBooking.lookingForRides')}</h2>
          </div>

          {/* Scrollable Content */}
          <div className="review-content">
            <div className="trip-info-card">
              <div className="location-info">
                <div className="location-row">
                  <div className="location-dot pickup-dot"></div>
                  <div className="location-text">
                    <span className="location-label">Pickup</span>
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
                        <span className="location-label">Stop {index + 1}</span>
                        <span className="location-name">{stop.name}</span>
                      </div>
                    </div>
                    <div className="location-divider"></div>
                  </React.Fragment>
                ))}

                <div className="location-row">
                  <div className="location-dot dropoff-dot"></div>
                  <div className="location-text">
                    <span className="location-label">Dropoff</span>
                    <span className="location-name">{dropoff.name}</span>
                  </div>
                </div>
              </div>

              {/* Distance and duration */}
              {distance && duration && (
                <div className="trip-stats">
                  <div className="stat-item">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M9 11l3 3 8-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>{distance} km</span>
                  </div>
                  <div className="stat-divider"></div>
                  <div className="stat-item">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                      <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    <span>{duration} min</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Cancel button - Fixed at bottom */}
          <ReadAloudWrapper
            as="button"
            text={t('rideBooking.cancel')}
            className="cancel-button"
            onClick={handleCancel}
            onHover={true}
          >
            {t('rideBooking.cancel')}
          </ReadAloudWrapper>
        </div>
      </div>
    );
  }

  // Show available rides only if there are rides
  if (availableRides.length === 0 && !searchingForRides) {
    return null;
  }

  return (
    <div className="available-rides-container">
      <div className="available-rides-header">
        <h1 className="available-rides-title">{t('rideBooking.availableRides')}</h1>
        <p className="available-rides-count">{availableRides.length} {t('rideBooking.ridesFound')}</p>
      </div>

      <div className="rides-list">
        {availableRides.map((ride) => (
          <div key={ride.id} className="ride-card">
            <div className="ride-card-content">
              <div className="driver-info-section">
                <div className="driver-avatar-container">
                  <img 
                    src={ride.avatar} 
                    alt={ride.name}
                    className="driver-avatar"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="driver-avatar-placeholder">
                    <span>{ride.name.charAt(0)}</span>
                  </div>
                </div>

                <div className="driver-details">
                  <h3 className="driver-name">{ride.name}</h3>
                  <div className="driver-rating">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#FFB800">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    <span>{ride.rating} ({ride.totalRides} {t('rideBooking.rides')})</span>
                  </div>
                  <p className="driver-vehicle">{ride.vehicle}</p>
                  <p className="driver-distance">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#666"/>
                    </svg>
                    {ride.distance} ({ride.timeAway})
                  </p>
                </div>
              </div>

              <div className="ride-price-section">
                <span className="ride-price">Rs. {ride.price}</span>
              </div>
            </div>

            <div className="ride-actions">
              <ReadAloudWrapper
                as="button"
                text={t('rideBooking.cancel')}
                className="ride-cancel-btn"
                onClick={() => handleCancelRide(ride.id)}
                onHover={true}
              >
                {t('rideBooking.cancel')}
              </ReadAloudWrapper>
              <ReadAloudWrapper
                as="button"
                text={`${t('rideBooking.accept')} ride from ${ride.name} for Rs. ${ride.price}`}
                className="ride-accept-btn"
                onClick={() => handleAcceptRide(ride)}
                onHover={true}
              >
                {t('rideBooking.accept')}
              </ReadAloudWrapper>
            </div>

            {/* Timer bar */}
            <div className="ride-timer-bar">
              <div 
                className="ride-timer-fill" 
                style={{ width: `${(ride.timer / 10) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RideBooking;
