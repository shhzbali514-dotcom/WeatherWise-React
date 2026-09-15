// ==========================================
// HOME PAGE - FULLY UPGRADED + GLOBAL SEARCH
// Fixed: Recent Searches + Location + Alerts
// UI & Syntax: SAME as before
// ==========================================

import React, { useState, useEffect } from 'react';
import { useWeather } from '../context/WeatherContext';
import { useSettings } from '../context/SettingsContext';

// Components
import WeatherBackground from '../components/WeatherBackground';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SearchOverlay from '../components/SearchOverlay';
import LocationCard from '../components/LocationCard';
import WeatherStats from '../components/WeatherStats';
import WeeklyForecast from '../components/WeeklyForecast';
import StatusCards from '../components/StatusCards';
import AQICard from '../components/AQICard';
import RecentSearches from '../components/RecentSearches';
import WeatherAlert from '../components/WeatherAlert';
import Loader from '../components/Loader';

const Home = () => {
  const {
    weatherData,
    loading,
    error,
    currentCity,
    currentCoords,
    lastUpdated,
    detectLocation,
    refreshWeather,
    retryFetch,
    isLocating,
    locationDetected,
  } = useWeather();

  const { theme } = useSettings();
  const [searchOpen, setSearchOpen] = useState(false);
  const [showLocationPrompt, setShowLocationPrompt] = useState(false);

  const condition = weatherData?.condition || 'Sunny';

  // ==========================================
  // FIRST LOAD: Check if location is detected
  // ==========================================
  useEffect(() => {
    const hasAskedLocation = localStorage.getItem(
      'weatherwise_location_asked'
    );

    // Agar pehle nahi poocha, aur location detected nahi
    if (!hasAskedLocation && !locationDetected) {
      setShowLocationPrompt(true);
    }
  }, [locationDetected]);

  // ==========================================
  // HANDLE LOCATION ALLOW
  // ==========================================
  const handleAllowLocation = async () => {
    setShowLocationPrompt(false);
    localStorage.setItem('weatherwise_location_asked', 'true');

    await detectLocation();
  };

  // ==========================================
  // HANDLE LOCATION DENY
  // ==========================================
  const handleDenyLocation = () => {
    setShowLocationPrompt(false);
    localStorage.setItem('weatherwise_location_asked', 'true');
  };

  // ==========================================
  // FORMAT LAST UPDATED
  // ==========================================
  const formatLastUpdated = () => {
    if (!lastUpdated) return '';
    const date = new Date(lastUpdated);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // ==========================================
  // RENDER
  // ==========================================
  return (
    <>
      {/* Background */}
      <WeatherBackground condition={condition} />

      {/* Search Overlay */}
      <SearchOverlay
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
      />

      {/* Location Permission Prompt */}
      {showLocationPrompt && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(10px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) handleDenyLocation();
          }}
        >
          <div
            style={{
              background:
                theme === 'dark'
                  ? 'rgba(20,20,30,0.95)'
                  : 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              padding: 'clamp(20px, 4vw, 32px)',
              maxWidth: '400px',
              width: '100%',
              textAlign: 'center',
              border:
                theme === 'dark'
                  ? '1px solid rgba(255,255,255,0.08)'
                  : '1px solid rgba(0,0,0,0.06)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            }}
          >
            <div
              style={{
                fontSize: '48px',
                marginBottom: '16px',
              }}
            >
              📍
            </div>
            <h2
              style={{
                fontSize: 'clamp(18px, 3vw, 22px)',
                fontWeight: 700,
                marginBottom: '12px',
                color: theme === 'dark' ? '#ffffff' : '#1a1a2e',
              }}
            >
              Enable Location?
            </h2>
            <p
              style={{
                fontSize: 'clamp(12px, 2vw, 14px)',
                color:
                  theme === 'dark'
                    ? 'rgba(255,255,255,0.6)'
                    : 'rgba(0,0,0,0.5)',
                marginBottom: '24px',
                lineHeight: 1.6,
              }}
            >
              WeatherWise uses your location to show accurate
              weather for your area. Your data stays on your
              device.
            </p>
            <div
              style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}
            >
              <button
                onClick={handleAllowLocation}
                style={{
                  padding: '12px 24px',
                  borderRadius: '12px',
                  background:
                    'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  color: '#ffffff',
                  border: 'none',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  flex: 1,
                  minWidth: '120px',
                }}
              >
                Allow
              </button>
              <button
                onClick={handleDenyLocation}
                style={{
                  padding: '12px 24px',
                  borderRadius: '12px',
                  background: 'rgba(255,255,255,0.05)',
                  color:
                    theme === 'dark'
                      ? 'rgba(255,255,255,0.7)'
                      : 'rgba(0,0,0,0.6)',
                  border:
                    theme === 'dark'
                      ? '1px solid rgba(255,255,255,0.1)'
                      : '1px solid rgba(0,0,0,0.08)',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  flex: 1,
                  minWidth: '120px',
                }}
              >
                Not Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div
        className="container"
        style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: '1200px',
          width: '100%',
          margin: '0 auto',
          padding: 'clamp(8px, 3vw, 20px)',
          boxSizing: 'border-box',
          overflowX: 'hidden',
        }}
      >
        <Navbar onSearchToggle={() => setSearchOpen(!searchOpen)} />

        {/* Location Status Bar */}
        {(isLocating || locationDetected || lastUpdated) && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '8px 16px',
              marginBottom: 'clamp(12px, 2vw, 16px)',
              borderRadius: '12px',
              background:
                theme === 'dark'
                  ? 'rgba(255,255,255,0.03)'
                  : 'rgba(0,0,0,0.02)',
              fontSize: 'clamp(10px, 1.8vw, 12px)',
              color:
                theme === 'dark'
                  ? 'rgba(255,255,255,0.5)'
                  : 'rgba(0,0,0,0.4)',
              flexWrap: 'wrap',
              gap: '8px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              {isLocating ? (
                <>
                  <span
                    style={{
                      display: 'inline-block',
                      animation: 'spin 1s linear infinite',
                    }}
                  >
                    🔄
                  </span>
                  <span>Detecting location...</span>
                </>
              ) : locationDetected ? (
                <>
                  <span>📍</span>
                  <span>Location detected</span>
                </>
              ) : (
                <>
                  <span>🌍</span>
                  <span>Using {currentCity || 'Islamabad'}</span>
                </>
              )}
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              {lastUpdated && (
                <span>Updated: {formatLastUpdated()}</span>
              )}
              <button
                onClick={refreshWeather}
                disabled={loading}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color:
                    theme === 'dark'
                      ? 'rgba(255,255,255,0.6)'
                      : 'rgba(0,0,0,0.5)',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: 'clamp(10px, 1.8vw, 12px)',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  transition: 'all 0.3s ease',
                  opacity: loading ? 0.5 : 1,
                }}
                title="Refresh weather"
              >
                🔄 Refresh
              </button>
            </div>
          </div>
        )}

        <main
          className="weather-main"
          style={{
            display: 'grid',
            gridTemplateColumns:
              'minmax(0, 1fr) minmax(0, 0.7fr)',
            gap: 'clamp(12px, 2.5vw, 24px)',
          }}
        >
          {/* Left Column */}
          <div
            className="left-column"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'clamp(12px, 2.5vw, 24px)',
              minWidth: 0,
            }}
          >
            {loading && !weatherData ? (
              <Loader />
            ) : error ? (
              <div
                className="glass-card"
                style={{
                  background:
                    theme === 'dark'
                      ? 'rgba(255,255,255,0.05)'
                      : 'rgba(255,255,255,0.5)',
                  backdropFilter: 'blur(20px)',
                  border:
                    theme === 'dark'
                      ? '1px solid rgba(255,255,255,0.08)'
                      : '1px solid rgba(0,0,0,0.04)',
                  borderRadius: '16px',
                  padding: 'clamp(16px, 3vw, 24px)',
                  textAlign: 'center',
                }}
              >
                <p
                  style={{
                    color: '#ef4444',
                    fontSize: 'clamp(12px, 2vw, 14px)',
                    marginBottom: '16px',
                  }}
                >
                  ⚠️ {error}
                </p>
                <button
                  onClick={retryFetch}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '10px',
                    background:
                      'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    color: '#ffffff',
                    border: 'none',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  🔄 Try Again
                </button>
              </div>
            ) : (
              <>
                <LocationCard />
                <WeatherStats />
                <WeatherAlert />
                <RecentSearches />
              </>
            )}
          </div>

          {/* Right Column */}
          <div
            className="right-column"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'clamp(12px, 2.5vw, 24px)',
              minWidth: 0,
            }}
          >
            <WeeklyForecast />
            <StatusCards />
            <AQICard />
          </div>
        </main>

        <Footer />
      </div>

      <style>{`
        [data-theme="light"] .glass-card {
          background: rgba(255,255,255,0.5) !important;
          border: 1px solid rgba(0,0,0,0.04) !important;
        }
        [data-theme="light"] .glass-card:hover {
          background: rgba(255,255,255,0.7) !important;
        }
        [data-theme="light"] .location-card h1 {
  background: none !important;
  color: #1a1a2e !important;
  -webkit-text-fill-color: #1a1a2e !important;
}
        }
        [data-theme="light"] .temp-value {
  background: none !important;
  color: #1a1a2e !important;
  -webkit-text-fill-color: #1a1a2e !important;
}
        }
        [data-theme="light"] .stat-value,
        [data-theme="light"] .week-temp {
          color: #1a1a2e !important;
        }
        [data-theme="light"] .stat-label,
        [data-theme="light"] .location-sub,
        [data-theme="light"] .temp-desc,
        [data-theme="light"] .week-location,
        [data-theme="light"] .week-day {
          color: rgba(0,0,0,0.4) !important;
        }
        [data-theme="light"] .week-item {
          background: rgba(0,0,0,0.02) !important;
        }
        [data-theme="light"] .week-item.active {
          background: rgba(99,102,241,0.08) !important;
          border-color: rgba(99,102,241,0.15) !important;
        }
        [data-theme="light"] .week-item.active .week-temp {
          color: #6366f1 !important;
        }
        [data-theme="light"] .status-item {
          background: rgba(0,0,0,0.02) !important;
        }
        [data-theme="light"] .recent-item {
          background: rgba(0,0,0,0.02) !important;
        }
        [data-theme="light"] .recent-item:hover {
          background: rgba(0,0,0,0.04) !important;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* ==========================================
           MOBILE RESPONSIVE
           ========================================== */
        @media (max-width: 992px) {
          .weather-main {
            grid-template-columns: 1fr !important;
          }
          .right-column {
            display: grid !important;
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }

        @media (max-width: 768px) {
          .right-column {
            grid-template-columns: 1fr !important;
          }
          .weekly-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }

        @media (max-width: 480px) {
          .weekly-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </>
  );
};

export default Home;