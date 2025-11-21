import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AccessibilityProvider } from './contexts/AccessibilityContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Settings from './pages/Settings';
import PlaceholderPage from './pages/PlaceholderPage';
import './App.css';

function AppContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="app-container">
      <Header onMenuClick={toggleSidebar} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
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

      {/* Bottom Navigation */}
      <nav className="bottom-nav" aria-label="Main navigation">
        <button 
          className="nav-item active"
          onClick={() => window.location.pathname = '/'}
          aria-label="Home"
        >
          <span className="nav-icon">🏠</span>
          <span className="nav-label">Home</span>
        </button>
        <button 
          className="nav-item"
          onClick={() => window.location.pathname = '/offers'}
          aria-label="Offers"
        >
          <span className="nav-icon">🎁</span>
          <span className="nav-label">Offers</span>
        </button>
        <button 
          className="nav-item"
          onClick={() => window.location.pathname = '/wallet'}
          aria-label="Wallet"
        >
          <span className="nav-icon">💰</span>
          <span className="nav-label">Wallet</span>
        </button>
        <button 
          className="nav-item"
          onClick={() => window.location.pathname = '/shops'}
          aria-label="Shops"
        >
          <span className="nav-icon">🏪</span>
          <span className="nav-label">Shops</span>
        </button>
      </nav>
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

