import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const menuItems = [
    { id: 'profile', label: 'Profile', icon: '👤', route: '/profile' },
    { id: 'settings', label: 'Settings', icon: '⚙️', route: '/settings' },
    { id: 'myRides', label: 'Requests History', icon: '📜', route: '/rides' },
    { id: 'wallet', label: 'Wallet', icon: '💰', route: '/wallet' },
    { id: 'paymentMethods', label: 'Payment Methods', icon: '💳', route: '/payment' },
    { id: 'notifications', label: 'Notifications', icon: '🔔', route: '/notifications' },
    { id: 'help', label: 'Help & Support', icon: '❓', route: '/help' },
    { id: 'about', label: 'About', icon: 'ℹ️', route: '/about' },
  ];

  const handleItemClick = (route) => {
    navigate(route);
    onClose();
  };

  return (
    <>
      <div 
        className={`sidebar-overlay ${isOpen ? 'open' : ''}`} 
        onClick={onClose}
        aria-hidden="true"
      />
      <nav className={`sidebar ${isOpen ? 'open' : ''}`} aria-label="Main navigation">
        <div className="sidebar-header">
          <div className="user-profile">
            <div className="user-avatar">👤</div>
            <div className="user-info">
              <h3>Welcome to Bykea</h3>
              <p>user@example.com</p>
            </div>
          </div>
        </div>
        
        <div className="sidebar-menu">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className="menu-item"
              onClick={() => handleItemClick(item.route)}
              aria-label={item.label}
            >
              <span className="menu-icon" role="img" aria-hidden="true">
                {item.icon}
              </span>
              <span className="menu-label">{item.label}</span>
              <span className="menu-arrow" aria-hidden="true">›</span>
            </button>
          ))}
        </div>
        
        <div className="sidebar-footer">
          <button className="logout-button primary-button">
            Logout
          </button>
        </div>
      </nav>
    </>
  );
};

export default Sidebar;
