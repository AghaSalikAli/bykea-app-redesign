import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { AccessibilityProvider } from './contexts/AccessibilityContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Settings from './pages/Settings';
import PlaceholderPage from './pages/PlaceholderPage';
import ReviewTrip from './pages/ReviewTrip';
import EditYourRide from './pages/EditYourRide';
import ReorderStops from './pages/ReorderStops';
import AddStopModal from './components/AddStopModal';
import './App.css';

function AppContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="app-container">
      <Header onMenuClick={toggleSidebar} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/review-trip" element={<ReviewTrip />} />
          <Route path="/edit-your-ride" element={<EditYourRide />} />
          <Route path="/add-stop" element={<AddStopModal />} />
          <Route path="/reorder-stops" element={<ReorderStops />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={
            <PlaceholderPage 
              title="Profile" 
              description="View and edit your profile information"
              icon="👤"
            />
          } />
          <Route path="/rides" element={
            <PlaceholderPage 
              title="My Rides" 
              description="View your ride history and upcoming bookings"
              icon="🚗"
            />
          } />
          <Route path="/packages" element={
            <PlaceholderPage 
              title="My Packages" 
              description="Track your package deliveries"
              icon="📦"
            />
          } />
          <Route path="/wallet" element={
            <PlaceholderPage 
              title="Wallet" 
              description="Manage your balance and transactions"
              icon="💰"
            />
          } />
          <Route path="/payment" element={
            <PlaceholderPage 
              title="Payment Methods" 
              description="Manage your payment options"
              icon="💳"
            />
          } />
          <Route path="/history" element={
            <PlaceholderPage 
              title="Ride History" 
              description="View all your past rides"
              icon="📜"
            />
          } />
          <Route path="/notifications" element={
            <PlaceholderPage 
              title="Notifications" 
              description="View all your notifications"
              icon="🔔"
            />
          } />
          <Route path="/help" element={
            <PlaceholderPage 
              title="Help & Support" 
              description="Get help with your Bykea experience"
              icon="❓"
            />
          } />
          <Route path="/about" element={
            <PlaceholderPage 
              title="About Bykea" 
              description="Learn more about Bykea"
              icon="ℹ️"
            />
          } />
          <Route path="/book-ride" element={
            <PlaceholderPage 
              title="Book Ride" 
              description="Select your pickup and drop location"
              icon="🚗"
            />
          } />
          <Route path="/send-package" element={
            <PlaceholderPage 
              title="Send Package" 
              description="Enter package details and delivery address"
              icon="📦"
            />
          } />
          <Route path="/select-location" element={
            <PlaceholderPage 
              title="Select Location" 
              description="Choose your location on the map"
              icon="📍"
            />
          } />
        </Routes>
      </main>

      {/* Bottom Navigation - Only show on home and main pages */}
      {(location.pathname === '/' || location.pathname === '/offers' || location.pathname === '/wallet' || location.pathname === '/shops' || location.pathname === '/settings' || location.pathname === '/profile' || location.pathname === '/rides' || location.pathname === '/packages' || location.pathname === '/payment' || location.pathname === '/history' || location.pathname === '/notifications' || location.pathname === '/help' || location.pathname === '/about') && (
      <nav className="bottom-nav" aria-label="Main navigation">
        <button 
          className={`nav-item ${isActive('/') ? 'active' : ''}`}
          onClick={() => navigate('/')}
          aria-label="Home"
        >
          <span className="nav-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
          <span className="nav-label">Home</span>
        </button>
        <button 
          className={`nav-item ${isActive('/offers') ? 'active' : ''}`}
          onClick={() => navigate('/offers')}
          aria-label="Offers"
        >
          <span className="nav-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20.59 13.41L13.42 20.58C13.2343 20.766 13.0137 20.9135 12.7709 21.0141C12.5281 21.1148 12.2678 21.1666 12.005 21.1666C11.7422 21.1666 11.4819 21.1148 11.2391 21.0141C10.9963 20.9135 10.7757 20.766 10.59 20.58L2 12V2H12L20.59 10.59C20.9625 10.9647 21.1716 11.4716 21.1716 12C21.1716 12.5284 20.9625 13.0353 20.59 13.41Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M7 7H7.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
          <span className="nav-label">Offers</span>
        </button>
        <button 
          className={`nav-item ${isActive('/wallet') ? 'active' : ''}`}
          onClick={() => navigate('/wallet')}
          aria-label="Wallet"
        >
          <span className="nav-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 4H3C1.89543 4 1 4.89543 1 6V18C1 19.1046 1.89543 20 3 20H21C22.1046 20 23 19.1046 23 18V6C23 4.89543 22.1046 4 21 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M1 10H23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
          <span className="nav-label">Wallet</span>
        </button>
        <button 
          className={`nav-item ${isActive('/shops') ? 'active' : ''}`}
          onClick={() => navigate('/shops')}
          aria-label="Shops"
        >
          <span className="nav-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 2L3 6V20C3 20.5304 3.21071 21.0391 3.58579 21.4142C3.96086 21.7893 4.46957 22 5 22H19C19.5304 22 20.0391 21.7893 20.4142 21.4142C20.7893 21.0391 21 20.5304 21 20V6L18 2H6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3 6H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 10C16 11.0609 15.5786 12.0783 14.8284 12.8284C14.0783 13.5786 13.0609 14 12 14C10.9391 14 9.92172 13.5786 9.17157 12.8284C8.42143 12.0783 8 11.0609 8 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
          <span className="nav-label">Shops</span>
        </button>
      </nav>
      )}
    </div>
  );
}

function App() {
  return (
    <AccessibilityProvider>
      <Router>
        <AppContent />
      </Router>
    </AccessibilityProvider>
  );
}

export default App;

