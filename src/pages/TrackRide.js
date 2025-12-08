import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useTranslation } from '../contexts/LanguageContext';
import ReadAloudWrapper from '../components/ReadAloudWrapper';
import 'leaflet/dist/leaflet.css';
import './TrackRide.css';

const TrackRide = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { pickup, dropoff, stops = [], distance, duration, vehicle, estimatedPrice, driver } = location.state || {};

  const [route, setRoute] = useState([]);
  const [driverPosition, setDriverPosition] = useState(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [eta, setEta] = useState(30); // 30 seconds until driver arrives
  const [rideStarted, setRideStarted] = useState(false);
  const [rideTime, setRideTime] = useState(0);
  const animationRef = useRef(null);
  const rideTimerRef = useRef(null);

  // Fetch route on mount
  useEffect(() => {
    if (!pickup || !pickup.coordinates || !dropoff || !dropoff.coordinates) return;

    const fetchRoute = async () => {
      try {
        const allCoordinates = [
          pickup.coordinates,
          ...stops.map(stop => stop.coordinates),
          dropoff.coordinates
        ];

        const coordString = allCoordinates
          .map(coord => `${coord[1]},${coord[0]}`)
          .join(';');

        const response = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${coordString}?overview=full&geometries=geojson`
        );
        const data = await response.json();

        if (data.routes && data.routes[0]) {
          const routeCoordinates = data.routes[0].geometry.coordinates.map(
            coord => [coord[1], coord[0]]
          );
          setRoute(routeCoordinates);
          
          // Start driver at a position along the route (30% from pickup)
          const startIndex = Math.floor(routeCoordinates.length * 0.3);
          setDriverPosition(routeCoordinates[startIndex]);
          setCurrentStepIndex(startIndex);
        }
      } catch (error) {
        console.error('Error fetching route:', error);
      }
    };

    fetchRoute();
  }, [pickup, dropoff, stops]);

  // Animate driver movement to pickup (30 seconds)
  useEffect(() => {
    if (route.length === 0 || currentStepIndex === 0) return;

    const pickupSteps = currentStepIndex; // Steps from current position to pickup
    const stepDuration = (30 * 1000) / pickupSteps; // Distribute 30 seconds across steps

    animationRef.current = setInterval(() => {
      setCurrentStepIndex(prevIndex => {
        const nextIndex = prevIndex - 1;
        if (nextIndex <= 0) {
          clearInterval(animationRef.current);
          // Driver reached pickup - start ride after brief pause
          setTimeout(() => {
            setRideStarted(true);
          }, 2000);
          setDriverPosition(route[0]);
          return 0;
        }
        setDriverPosition(route[nextIndex]);
        return nextIndex;
      });
    }, stepDuration);

    return () => {
      if (animationRef.current) clearInterval(animationRef.current);
    };
  }, [route]);

  // Animate ride (10 seconds from pickup to dropoff)
  useEffect(() => {
    if (route.length === 0 || !rideStarted) return;

    const totalSteps = route.length;
    const stepDuration = (10 * 1000) / totalSteps; // 10 seconds for entire ride

    animationRef.current = setInterval(() => {
      setCurrentStepIndex(prevIndex => {
        const nextIndex = prevIndex + 1;
        if (nextIndex >= totalSteps) {
          clearInterval(animationRef.current);
          // Ride completed - show rating screen
          setTimeout(() => {
            navigate('/rate-driver', { 
              state: { driver, estimatedPrice },
              replace: true 
            });
          }, 1000);
          return prevIndex;
        }
        setDriverPosition(route[nextIndex]);
        return nextIndex;
      });
    }, stepDuration);

    // Start ride timer
    rideTimerRef.current = setInterval(() => {
      setRideTime(prev => prev + 1);
    }, 1000);

    return () => {
      if (animationRef.current) clearInterval(animationRef.current);
      if (rideTimerRef.current) clearInterval(rideTimerRef.current);
    };
  }, [rideStarted, navigate, driver, estimatedPrice]);

  // Countdown ETA timer (only when ride hasn't started)
  useEffect(() => {
    if (rideStarted) return;

    const timer = setInterval(() => {
      setEta(prevEta => {
        if (prevEta <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prevEta - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [rideStarted]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCall = () => {
    alert(`Calling ${driver.name}...`);
  };

  const handleMessage = () => {
    alert(`Opening chat with ${driver.name}...`);
  };

  const handleReportProblem = () => {
    alert('Report a Problem feature coming soon!');
  };

  const handleCancelRide = () => {
    if (window.confirm(t('trackRide.confirmCancel'))) {
      // Clear all timers
      if (animationRef.current) clearInterval(animationRef.current);
      if (rideTimerRef.current) clearInterval(rideTimerRef.current);
      
      // Navigate to home
      navigate('/', { replace: true });
    }
  };

  if (!pickup || !dropoff || !driver) {
    navigate('/');
    return null;
  }

  // Custom icons
  const driverIcon = L.divIcon({
    html: `
      <div style="
        width: 44px;
        height: 44px;
        background: white;
        border: 3px solid #00a859;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 3px 10px rgba(0,0,0,0.3);
      ">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="#00a859">
          <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
        </svg>
      </div>
    `,
    iconSize: [44, 44],
    iconAnchor: [22, 22],
    className: 'driver-marker-icon'
  });

  const pickupIcon = L.divIcon({
    html: `
      <div style="
        width: 20px;
        height: 20px;
        background: #00a859;
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 6px rgba(0,0,0,0.2);
      "></div>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    className: 'pickup-marker-icon'
  });

  const dropoffIcon = L.divIcon({
    html: `
      <svg width="30" height="38" viewBox="0 0 30 38" fill="none">
        <path d="M15 0C6.716 0 0 6.716 0 15c0 11.25 15 23 15 23s15-11.75 15-23c0-8.284-6.716-15-15-15z" 
          fill="#FF4444" 
          stroke="white" 
          stroke-width="2"/>
        <circle cx="15" cy="15" r="5" fill="white"/>
      </svg>
    `,
    iconSize: [30, 38],
    iconAnchor: [15, 38],
    className: 'dropoff-marker-icon'
  });

  const MapUpdater = () => {
    const map = useMap();
    useEffect(() => {
      if (route.length > 0) {
        const bounds = L.latLngBounds(route);
        map.fitBounds(bounds, { padding: [80, 80] });
      }
    }, [route, map]);
    return null;
  };

  return (
    <div className="track-ride-container">
      {/* Map */}
      <div className="track-ride-map">
        <MapContainer
          center={pickup.coordinates}
          zoom={14}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
          attributionControl={false}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <MapUpdater />

          {/* Route Polyline */}
          {route.length > 0 && (
            <Polyline
              positions={route}
              color="#00a859"
              weight={5}
              opacity={0.8}
            />
          )}

          {/* Pickup Marker */}
          <Marker position={pickup.coordinates} icon={pickupIcon} />

          {/* Dropoff Marker */}
          <Marker position={dropoff.coordinates} icon={dropoffIcon} />

          {/* Driver Marker */}
          {driverPosition && (
            <Marker position={driverPosition} icon={driverIcon} />
          )}
        </MapContainer>
      </div>

      {/* Bottom Sheet */}
      <div className="track-ride-sheet">
        <div className="sheet-handle"></div>

        {/* Status Message */}
        <div className="track-status-message">
          {!rideStarted 
            ? `${t('trackRide.driverComing').replace('3:35', formatTime(eta))}`
            : `${t('trackRide.rideInProgress')} (${formatTime(rideTime)})`
          }
        </div>

        {/* Driver Info */}
        <div className="track-driver-card">
          <div className="track-driver-avatar-wrapper">
            <img 
              src={driver.avatar} 
              alt={driver.name}
              className="track-driver-avatar"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="track-driver-avatar-placeholder">
              <span>{driver.name.charAt(0)}</span>
            </div>
          </div>
          
          <div className="track-driver-info">
            <div className="track-driver-name">{driver.name}</div>
            <div className="track-driver-rating">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#FFB800">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              <span>{driver.rating} ({driver.totalRides} {t('trackRide.reviews')})</span>
            </div>
          </div>

          <div className="track-price">Rs. {estimatedPrice}</div>
        </div>

        {/* Locations */}
        <div className="track-locations">
          <div className="track-location-item">
            <div className="track-location-icon track-pickup-icon"></div>
            <div className="track-location-details">
              <div className="track-location-label">{t('trackRide.currentLocation')}</div>
              <div className="track-location-address">{pickup.address || pickup.name}</div>
            </div>
          </div>

          {stops.length > 0 && stops.map((stop, index) => (
            <div key={index} className="track-location-item">
              <div className="track-location-icon track-stop-icon"></div>
              <div className="track-location-details">
                <div className="track-location-label">{t('trackRide.stop')} {index + 1}</div>
                <div className="track-location-address">{stop.address || stop.name}</div>
              </div>
            </div>
          ))}

          <div className="track-location-item">
            <div className="track-location-icon track-dropoff-icon"></div>
            <div className="track-location-details">
              <div className="track-location-label">{dropoff.name.split(',')[0]}</div>
              <div className="track-location-address">{dropoff.address || dropoff.name}</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {!rideStarted ? (
          <>
            <div className="track-actions">
              <ReadAloudWrapper
                as="button"
                text={t('trackRide.call')}
                className="track-action-btn track-call-btn"
                onClick={handleCall}
                onHover={true}
              >
                {t('trackRide.call')}
              </ReadAloudWrapper>
              <ReadAloudWrapper
                as="button"
                text={t('trackRide.message')}
                className="track-action-btn track-message-btn"
                onClick={handleMessage}
                onHover={true}
              >
                {t('trackRide.message')}
              </ReadAloudWrapper>
            </div>
            <ReadAloudWrapper
              as="button"
              text={t('trackRide.cancelRide')}
              className="track-cancel-ride-btn"
              onClick={handleCancelRide}
              onHover={true}
            >
              {t('trackRide.cancelRide')}
            </ReadAloudWrapper>
          </>
        ) : (
          <ReadAloudWrapper
            as="button"
            text={t('trackRide.reportProblem')}
            className="track-report-btn"
            onClick={handleReportProblem}
            onHover={true}
          >
            {t('trackRide.reportProblem')}
          </ReadAloudWrapper>
        )}
      </div>
    </div>
  );
};

export default TrackRide;
