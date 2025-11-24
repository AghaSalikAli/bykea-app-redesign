import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from '../contexts/LanguageContext';
import './ReorderStops.css';

function ReorderStops() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { pickup, dropoff, stops = [], distance, duration } = location.state || {};

  const [allStops, setAllStops] = useState([
    { ...pickup, type: 'pickup' },
    ...stops.map(stop => ({ ...stop, type: 'stop' })),
    { ...dropoff, type: 'dropoff' }
  ]);

  const handleSwap = (index) => {
    // Swap stop at index with the next stop
    if (index >= allStops.length - 1) return;
    
    const newStops = [...allStops];
    [newStops[index], newStops[index + 1]] = [newStops[index + 1], newStops[index]];
    setAllStops(newStops);
  };

  const handleRemoveStop = (index) => {
    if (allStops.length <= 2) {
      alert('You must have at least a pickup and dropoff location');
      return;
    }
    const newStops = allStops.filter((_, i) => i !== index);
    setAllStops(newStops);
  };

  const handleConfirm = () => {
    // First stop is pickup, last is dropoff, rest are intermediate stops
    const reorderedPickup = { ...allStops[0], type: 'pickup' };
    const reorderedDropoff = { ...allStops[allStops.length - 1], type: 'dropoff' };
    const reorderedStops = allStops.slice(1, -1).map(stop => ({ ...stop, type: 'stop' }));

    // Navigate to review trip with reordered stops
    navigate('/review-trip', {
      state: {
        pickup: reorderedPickup,
        dropoff: reorderedDropoff,
        stops: reorderedStops,
        distance,
        duration
      }
    });
  };

  const handleBack = () => {
    navigate('/edit-your-ride', { state: { pickup, dropoff, stops, distance, duration } });
  };

  return (
    <div className="reorder-stops-container">
      {/* Header */}
      <div className="reorder-header">
        <button className="back-button" onClick={handleBack}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 className="reorder-title">{t('reorderStops.title')}</h1>
      </div>

      {/* Instructions */}
      <div className="reorder-instructions">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
          <path d="M12 16v-4M12 8h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        <p>{t('reorderStops.instructions')}</p>
      </div>

      {/* Stops List */}
      <div className="stops-list">
        {allStops.map((stop, index) => {
          const isPickup = index === 0;
          const isDropoff = index === allStops.length - 1;

          return (
            <React.Fragment key={index}>
              <div className="stop-item">
                {/* Stop Icon */}
                <div className={`stop-icon ${isPickup ? 'pickup' : isDropoff ? 'dropoff' : 'stop'}`}>
                  {isPickup && <div className="pickup-dot"></div>}
                  {isDropoff && (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="currentColor"/>
                    </svg>
                  )}
                  {!isPickup && !isDropoff && (
                    <span className="stop-number">{index}</span>
                  )}
                </div>

                {/* Stop Details */}
                <div className="stop-details">
                  <span className="stop-label">
                    {isPickup ? t('reorderStops.pickup') : isDropoff ? t('reorderStops.dropoff') : `${t('reorderStops.stop')} ${index}`}
                  </span>
                  <span className="stop-name">{stop.name}</span>
                </div>

                {/* Connection Line */}
                <div className="connection-line"></div>
              </div>

              {/* Swap Icon Between Stops */}
              {index < allStops.length - 1 && (
                <div className="swap-icon-container">
                  <button 
                    className="swap-icon-btn"
                    onClick={() => handleSwap(index)}
                    aria-label="Swap stops"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M7 16V4M7 4L3 8M7 4L11 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M17 8V20M17 20L21 16M17 20L13 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Footer */}
      <div className="reorder-footer">
        <button className="done-btn" onClick={handleConfirm}>
          {t('reorderStops.done')}
        </button>
      </div>
    </div>
  );
}

export default ReorderStops;
