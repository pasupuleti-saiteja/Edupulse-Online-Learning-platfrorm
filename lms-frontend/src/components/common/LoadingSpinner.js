import React from 'react';

const LoadingSpinner = ({ message = 'Loading content, please wait...' }) => {
  return (
    <div className="loading-screen text-center py-5">
      <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="text-secondary fw-medium mt-3">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
