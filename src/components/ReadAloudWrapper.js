import React from 'react';
import { useReadAloud } from '../hooks/useReadAloud';

const ReadAloudWrapper = ({ 
  children, 
  text, 
  onHover = true, 
  readOnClick = false,
  className = '',
  as = 'div',
  onClick,
  onTouchStart,
  ...props 
}) => {
  const { readText } = useReadAloud();
  const Component = as;

  const handleMouseEnter = () => {
    if (onHover && text) {
      readText(text);
    }
  };

  const handleClick = (e) => {
    // Read text on click if enabled
    if (readOnClick && text) {
      readText(text);
    }
    // Always call the original onClick handler if it exists
    if (onClick) {
      onClick(e);
    }
  };

  // For touch devices, read on touch start
  const handleTouchStart = (e) => {
    if (onHover && text) {
      readText(text);
    }
    // Call original onTouchStart if provided
    if (onTouchStart) {
      onTouchStart(e);
    }
  };

  return (
    <Component
      {...props}
      className={className}
      onMouseEnter={handleMouseEnter}
      onClick={handleClick}
      onTouchStart={handleTouchStart}
    >
      {children}
    </Component>
  );
};

export default ReadAloudWrapper;
