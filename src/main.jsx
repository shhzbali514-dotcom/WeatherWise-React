// ==========================================
// WEATHERWISE REACT - MAIN ENTRY
// PWA Support + Service Worker Registration
// FIXED: Local Dev (Service Worker only in production)
// ==========================================

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// ==========================================
// SERVICE WORKER REGISTRATION (PWA)
// ✅ Only in PRODUCTION — dev mein register nahi hoga
// ==========================================
if (
  'serviceWorker' in navigator &&
  import.meta.env.PROD
) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/WeatherWise-React/service-worker.js', {
              scope: '/WeatherWise-React/',
            })
      .then((registration) => {
        console.log('✅ Service Worker registered successfully');
        console.log('📦 Scope:', registration.scope);

        // Check for updates
        registration.onupdatefound = () => {
          const installingWorker = registration.installing;

          if (installingWorker) {
            installingWorker.onstatechange = () => {
              if (installingWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                  console.log(
                    '🔄 New update available! Refresh to apply.'
                  );
                } else {
                  console.log(
                    '✅ Service Worker installed for the first time'
                  );
                }
              }
            };
          }
        };
      })
      .catch((error) => {
        console.error(
          '❌ Service Worker registration failed:',
          error
        );
      });
  });

  // Listen for controller change (new SW activated)
  navigator.serviceWorker.addEventListener(
    'controllerchange',
    () => {
      console.log(
        '🔄 Service Worker activated - new version available'
      );
    }
  );
} else {
  console.log('ℹ️ Service Worker skipped (dev mode)');
}

// ==========================================
// RENDER APP
// ==========================================
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// ==========================================
// LOG INFO
// ==========================================
console.log('🌤️ WeatherWise Pakistan v7.0.0');
console.log('👨‍💻 Developed by Shahzaib Tahir');