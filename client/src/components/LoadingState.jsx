import React from 'react';
import './LoadingState.css';

/**
 * Reusable loading state component with different variants
 * @param {string} variant - 'spinner' | 'skeleton' | 'pulse' | 'minimal'
 * @param {string} message - Optional loading message to display
 * @param {string} size - 'small' | 'medium' | 'large'
 */
const LoadingState = ({ 
  variant = 'spinner', 
  message = 'Loading...', 
  size = 'medium',
  fullScreen = false 
}) => {
  const containerClass = `loading-container ${fullScreen ? 'fullscreen' : ''} loading-${size}`;

  const renderSpinner = () => (
    <div className={containerClass}>
      <div className="spinner"></div>
      {message && <p className="loading-message">{message}</p>}
    </div>
  );

  const renderSkeleton = () => (
    <div className={`skeleton-container ${containerClass}`}>
      <div className="skeleton-item skeleton-avatar"></div>
      <div className="skeleton-content">
        <div className="skeleton-item skeleton-line skeleton-line-long"></div>
        <div className="skeleton-item skeleton-line skeleton-line-medium"></div>
        <div className="skeleton-item skeleton-line skeleton-line-short"></div>
      </div>
    </div>
  );

  const renderPulse = () => (
    <div className={containerClass}>
      <div className="pulse-dots">
        <div className="pulse-dot"></div>
        <div className="pulse-dot"></div>
        <div className="pulse-dot"></div>
      </div>
      {message && <p className="loading-message">{message}</p>}
    </div>
  );

  const renderMinimal = () => (
    <div className={`${containerClass} minimal`}>
      <span className="minimal-loader"></span>
      {message && <span className="loading-message-inline">{message}</span>}
    </div>
  );

  switch (variant) {
    case 'skeleton':
      return renderSkeleton();
    case 'pulse':
      return renderPulse();
    case 'minimal':
      return renderMinimal();
    case 'spinner':
    default:
      return renderSpinner();
  }
};

export default LoadingState;
