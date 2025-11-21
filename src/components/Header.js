import React from 'react';
import './Header.css';

const Header = ({ onMenuClick, title }) => {
  return (
    <header className="header">
      <button 
        className="menu-button" 
        onClick={onMenuClick}
        aria-label="Menu"
      >
        <div className="hamburger-icon">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </button>
      
      <div className="header-logo">
        <h1>Bykea</h1>
      </div>
    </header>
  );
};

export default Header;
