import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import SelectLocationModal from '../components/SelectLocationModal';
import AddStopModal from '../components/AddStopModal';
import './EditYourRide.css';

function EditYourRide() {
  const navigate = useNavigate();
  const location = useLocation();
  const { pickup, dropoff, stops = [], distance, duration } = location.state || {};
  
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isAddStopModalOpen, setIsAddStopModalOpen] = useState(false);
  const [addStopAtIndex, setAddStopAtIndex] = useState(null);
  const [editingPickup, setEditingPickup] = useState(pickup);
  const [editingDropoff, setEditingDropoff] = useState(dropoff);
  const [editingStops, setEditingStops] = useState(stops);

  const handleSwap = (index) => {
    if (index === -1) {
      // Swap pickup with first stop
      if (editingStops.length > 0) {
        const newPickup = editingStops[0];
        const newStops = [editingPickup, ...editingStops.slice(1)];
        setEditingPickup(newPickup);
        setEditingStops(newStops);
      }
    } else if (index < editingStops.length - 1) {
      // Swap two adjacent stops
      const newStops = [...editingStops];
      [newStops[index], newStops[index + 1]] = [newStops[index + 1], newStops[index]];
      setEditingStops(newStops);
    } else if (index === editingStops.length - 1) {
      // Swap last stop with dropoff
      const newDropoff = editingStops[editingStops.length - 1];
      const newStops = [...editingStops.slice(0, -1), editingDropoff];
      setEditingDropoff(newDropoff);
      setEditingStops(newStops);
    }
  };

  const handleAddStopAtPosition = (index) => {
    setAddStopAtIndex(index);
    setIsAddStopModalOpen(true);
  };

  const handleStopAdded = (newStop) => {
    const newStops = [...editingStops];
    newStops.splice(addStopAtIndex, 0, newStop);
    setEditingStops(newStops);
    setIsAddStopModalOpen(false);
  };

  const handleDeleteStop = (index) => {
    const newStops = editingStops.filter((_, i) => i !== index);
    setEditingStops(newStops);
  };

  const handleDone = () => {
    // Navigate back to review trip with updated stops
    navigate('/review-trip', {
      state: { pickup: editingPickup, dropoff: editingDropoff, stops: editingStops, distance, duration }
    });
  };

  const handleBack = () => {
    navigate('/review-trip', { 
      state: { pickup, dropoff, stops, distance, duration } 
    });
  };

  return (
    <div className="edit-your-ride-container">
      {/* Header */}
      <div className="edit-ride-header">
        <button className="back-button" onClick={handleBack}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 className="edit-ride-title">Edit Your Ride</h1>
      </div>

      {/* Instructions */}
      <div className="edit-instructions">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
          <path d="M12 16v-4M12 8h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        <p>Manage your stops: Add, delete, or reorder them</p>
      </div>

      {/* Stops Management List */}
      <div className="stops-management-list">
        {/* Pickup */}
        <div className="stop-item-manage">
          <div className="stop-icon pickup">
            <div className="pickup-dot"></div>
          </div>
          <div className="stop-details">
            <span className="stop-label">Pickup</span>
            <span className="stop-name">{editingPickup?.name}</span>
          </div>
        </div>

        {/* Actions between Pickup and first Stop/Dropoff */}
        <div className="actions-between-stops">
          <button 
            className="add-stop-btn-inline"
            onClick={() => handleAddStopAtPosition(0)}
            aria-label="Add stop"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span>Add Stop</span>
          </button>
          {editingStops.length > 0 && (
            <button 
              className="swap-icon-btn"
              onClick={() => handleSwap(-1)}
              aria-label="Swap with next"
              title="Swap pickup with first stop"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M7 16V4M7 4L3 8M7 4L11 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M17 8V20M17 20L21 16M17 20L13 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          )}
        </div>

        {/* Stops with actions between each */}
        {editingStops.map((stop, index) => (
          <React.Fragment key={index}>
            {/* Stop */}
            <div className="stop-item-manage">
              <div className="stop-icon stop">
                <span className="stop-number">{index + 1}</span>
              </div>
              <div className="stop-details">
                <span className="stop-label">Stop {index + 1}</span>
                <span className="stop-name">{stop.name}</span>
              </div>
              <button 
                className="delete-stop-btn"
                onClick={() => handleDeleteStop(index)}
                aria-label="Delete stop"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            {/* Actions between this stop and next */}
            <div className="actions-between-stops">
              <button 
                className="add-stop-btn-inline"
                onClick={() => handleAddStopAtPosition(index + 1)}
                aria-label={`Add stop after stop ${index + 1}`}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <span>Add Stop</span>
              </button>
              <button 
                className="swap-icon-btn"
                onClick={() => handleSwap(index)}
                aria-label="Swap with next"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M7 16V4M7 4L3 8M7 4L11 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M17 8V20M17 20L21 16M17 20L13 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </React.Fragment>
        ))}

        {/* Dropoff */}
        <div className="stop-item-manage">
          <div className="stop-icon dropoff">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="currentColor"/>
            </svg>
          </div>
          <div className="stop-details">
            <span className="stop-label">Dropoff</span>
            <span className="stop-name">{editingDropoff?.name}</span>
          </div>
        </div>
      </div>

      {/* Done Button */}
      <div className="edit-footer">
        <button className="done-btn" onClick={handleDone}>
          Done
        </button>
      </div>

      {/* Add Stop Modal */}
      {isAddStopModalOpen && (
        <AddStopModal
          isOpen={isAddStopModalOpen}
          onClose={() => setIsAddStopModalOpen(false)}
          onStopAdded={handleStopAdded}
        />
      )}
    </div>
  );
}

export default EditYourRide;
