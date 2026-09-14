// ==========================================
// LOADER COMPONENT
// ==========================================

import React from 'react';

const Loader = () => {
  return (
    <div className="loader-container" style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '40px',
      minHeight: '200px'
    }}>
      <div className="loader" style={{
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        border: '3px solid rgba(255,255,255,0.1)',
        borderTop: '3px solid #6366f1',
        animation: 'spin 1s linear infinite'
      }} />
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Loader;