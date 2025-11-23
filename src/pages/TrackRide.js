import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './TrackRide.css';

const TrackRide = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { pickup, dropoff, stops = [], distance, duration, vehicle, estimatedPrice, driver } = location.state || {};

  const [route, setRoute] = useState([]);
  const [driverPosition, setDriverPosition] = useState(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [eta, setEta] = useState(duration * 60); // Convert minutes to seconds

  // Fetch route on mount
  useEffect(() => {
    if (!pickup || !dropoff) return;

    const fetchRoute = async () => {
      try {
        const waypoints = [
          pickup,
          ...stops.map(stop => stop),
          dropoff
        ];

        const coordinates = waypoints
          .map(point => `${point.lng},${point.lat}`)
          .join(';');

        const response = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${coordinates}?overview=full&geometries=geojson`
        );
        const data = await response.json();

        if (data.routes && data.routes[0]) {
          const routeCoordinates = data.routes[0].geometry.coordinates.map(
            coord => [coord[1], coord[0]]
          );
          setRoute(routeCoordinates);
          setDriverPosition(routeCoordinates[0]); // Start driver at beginning of route
        }
      } catch (error) {
        console.error('Error fetching route:', error);
      }
    };

    fetchRoute();
  }, [pickup, dropoff, stops]);

  // Animate driver movement along route
  useEffect(() => {
    if (route.length === 0) return;

    const totalSteps = route.length;
    const stepDuration = (duration * 60 * 1000) / totalSteps; // milliseconds per step

    const interval = setInterval(() => {
      setCurrentStepIndex(prevIndex => {
        const nextIndex = prevIndex + 1;
        if (nextIndex >= totalSteps) {
          clearInterval(interval);
          // Ride completed
          setTimeout(() => {
            navigate('/', { replace: true });
          }, 2000);
          return prevIndex;
        }
        setDriverPosition(route[nextIndex]);
        return nextIndex;
      });
    }, stepDuration);

    return () => clearInterval(interval);
  }, [route, duration, navigate]);

  // Countdown ETA timer
  useEffect(() => {
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
  }, []);

  const formatETA = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCall = () => {
    alert(`Calling ${driver.name}...`);
  };

  const handleMessage = () => {
    alert(`Messaging ${driver.name}...`);
  };

  const handleBack = () => {
    navigate('/');
  };

  if (!pickup || !dropoff || !driver) {
    navigate('/');
    return null;
  }

  // Custom icons
  const driverIcon = L.divIcon({
    html: `
      <div style="
        width: 40px;
        height: 40px;
        background: white;
        border: 3px solid var(--primary-green);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      ">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="var(--primary-green)">
          <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
        </svg>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    className: 'driver-marker'
  });

  const pickupIcon = L.divIcon({
    html: `
      <div style="
        width: 24px;
        height: 24px;
        background: var(--primary-green);
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      "></div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    className: 'pickup-icon-marker'
  });

  const dropoffIcon = L.divIcon({
    html: `
      <svg width="32" height="40" viewBox="0 0 32 40" fill="none">
        <path d="M16 0C7.163 0 0 7.163 0 16c0 12 16 24 16 24s16-12 16-24c0-8.837-7.163-16-16-16z" 
          fill="var(--primary-red)" 
          stroke="white" 
          stroke-width="2"/>
        <circle cx="16" cy="16" r="6" fill="white"/>
      </svg>
    `,
    iconSize: [32, 40],
    iconAnchor: [16, 40],
    className: 'dropoff-icon-marker'
  });

  const MapUpdater = () => {
    const map = useMap();
    useEffect(() => {
      if (route.length > 0) {
        const bounds = L.latLngBounds(route);
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }, [route, map]);
    return null;
  };

  return (
    <div className="track-ride-container">
      {/* Map */}
      <div className="track-ride-map">
        {pickup && (
          <MapContainer
            center={[pickup.lat, pickup.lng]}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
            zoomControl={false}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap contributors'
            />
            <MapUpdater />

            {/* Route Polyline */}
            {route.length > 0 && (
              <Polyline
                positions={route}
                color="var(--primary-green)"
                weight={4}
                opacity={0.7}
              />
            )}

            {/* Pickup Marker */}
            <Marker position={[pickup.lat, pickup.lng]} icon={pickupIcon} />

            {/* Dropoff Marker */}
            <Marker position={[dropoff.lat, dropoff.lng]} icon={dropoffIcon} />

            {/* Driver Marker */}
            {driverPosition && (
              <Marker position={driverPosition} icon={driverIcon} />
            )}
          </MapContainer>
        )}
      </div>

      {/* Back Button */}
      <button className="track-ride-back-btn" onClick={handleBack}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* Bottom Sheet */}
      <div className="track-ride-sheet">
        <div className="sheet-handle"></div>

        {/* ETA */}
        <div className="track-eta-section">
          <div className="track-eta-time">{formatETA(eta)}</div>
          <div className="track-eta-label">Your driver is coming</div>
        </div>

        {/* Driver Info */}
        <div className="track-driver-info">
          <div className="track-driver-avatar-container">
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
          <div className="track-driver-details">
            <div className="track-driver-name">{driver.name}</div>
            <div className="track-driver-vehicle">{driver.vehicle}</div>
            <div className="track-driver-rating">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#FFB800">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              <span>{driver.rating}</span>
            </div>
          </div>
          <div className="track-price">Rs. {estimatedPrice}</div>
        </div>

        {/* Locations */}
        <div className="track-locations">
          <div className="track-location-row">
            <div className="track-location-icon pickup-icon"></div>
            <div className="track-location-text">{pickup.address}</div>
          </div>
          {stops.length > 0 && stops.map((stop, index) => (
            <div key={index} className="track-location-row">
              <div className="track-location-icon stop-icon"></div>
              <div className="track-location-text">{stop.address}</div>
            </div>
          ))}
          <div className="track-location-row">
            <div className="track-location-icon dropoff-icon"></div>
            <div className="track-location-text">{dropoff.address}</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="track-actions">
          <button className="track-action-btn" onClick={handleCall}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Call</span>
          </button>
          <button className="track-action-btn" onClick={handleMessage}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Message</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrackRide;
