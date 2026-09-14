// ==========================================
// 404 - NOT FOUND PAGE (FIXED + MOBILE RESPONSIVE)
// ==========================================

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import { useWeather } from '../context/WeatherContext';

// Components
import WeatherBackground from '../components/WeatherBackground';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SearchOverlay from '../components/SearchOverlay';

const NotFound = () => {
  const { theme } = useSettings();
  const { weatherData } = useWeather();
  const location = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [autoRedirect, setAutoRedirect] = useState(false);

  const condition = weatherData?.condition || 'Sunny';

  // Auto-redirect countdown
  useEffect(() => {
    if (!autoRedirect) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          window.location.href = '/';
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [autoRedirect]);

  // Suggested pages
  const suggestedPages = [
    { path: '/', icon: '🏠', label: 'Home', desc: 'Weather dashboard' },
    { path: '/forecast', icon: '📊', label: 'Forecast', desc: '7/15 day forecast' },
    { path: '/hourly', icon: '🕐', label: 'Hourly', desc: 'Hour-by-hour weather' },
    { path: '/map', icon: '🗺️', label: 'Map', desc: 'Interactive global map' },
    { path: '/favorites', icon: '⭐', label: 'Favorites', desc: 'Saved locations' },
    { path: '/settings', icon: '⚙️', label: 'Settings', desc: 'Customize your experience' }
  ];

  return (
    <>
      <WeatherBackground condition={condition} />
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      <div className="container" style={{
        position: 'relative',
        zIndex: 2,
        maxWidth: '1200px',
        width: '100%',
        margin: '0 auto',
        padding: 'clamp(8px, 3vw, 20px)',
        boxSizing: 'border-box',
        overflowX: 'hidden'
      }}>
        <Navbar onSearchToggle={() => setSearchOpen(!searchOpen)} />

        <main className="page-content" style={{ padding: 'clamp(10px, 2vw, 20px) 0' }}>
          <div className="error-page" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '70vh',
            gap: 'clamp(12px, 3vw, 20px)'
          }}>
            {/* Main Error Card */}
            <div className="glass-card error-content" style={{
              padding: 'clamp(20px, 4vw, 40px)',
              textAlign: 'center',
              maxWidth: '600px',
              width: '100%',
              margin: '0 auto',
              background: 'rgba(255,255,255,0.05)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '24px',
              position: 'relative',
              overflow: 'hidden',
              boxSizing: 'border-box'
            }}>
              {/* Animated Background Glow */}
              <div style={{
                position: 'absolute',
                top: '-50%',
                left: '-50%',
                width: '200%',
                height: '200%',
                background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)',
                animation: 'rotate 20s linear infinite',
                pointerEvents: 'none'
              }} />

              {/* Illustration */}
              <div className="error-illustration" style={{
                marginBottom: 'clamp(16px, 3vw, 24px)',
                position: 'relative',
                zIndex: 1
              }}>
                <svg
                  viewBox="0 0 220 220"
                  fill="none"
                  style={{
                    width: 'clamp(140px, 30vw, 220px)',
                    height: 'auto',
                    maxWidth: '100%'
                  }}
                >
                  <defs>
                    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                      <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>

                  <circle cx="110" cy="110" r="90" stroke="url(#grad1)" strokeWidth="1.5" opacity="0.15" strokeDasharray="5 5">
                    <animateTransform attributeName="transform" type="rotate" from="0 110 110" to="360 110 110" dur="20s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="110" cy="110" r="70" stroke="url(#grad1)" strokeWidth="1.5" opacity="0.25" strokeDasharray="3 3">
                    <animateTransform attributeName="transform" type="rotate" from="360 110 110" to="0 110 110" dur="15s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="110" cy="110" r="50" stroke="url(#grad1)" strokeWidth="2" opacity="0.4" />

                  <text
                    x="110"
                    y="115"
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize="72"
                    fontWeight="800"
                    fill="url(#grad1)"
                    filter="url(#glow)"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    404
                  </text>

                  <text
                    x="110"
                    y="165"
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize="24"
                    opacity="0.6"
                  >
                    ☁️
                  </text>
                </svg>
              </div>

              <h1 style={{
                fontSize: 'clamp(22px, 5vw, 32px)',
                fontWeight: 800,
                marginBottom: '12px',
                background: 'linear-gradient(135deg, #fff 60%, rgba(255,255,255,0.5))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                position: 'relative',
                zIndex: 1
              }}>
                Page Not Found
              </h1>

              <p style={{
                color: 'rgba(255,255,255,0.5)',
                marginBottom: '8px',
                fontSize: 'clamp(13px, 2.5vw, 15px)',
                position: 'relative',
                zIndex: 1
              }}>
                {"Oops! The page you're looking for has been blown away by the wind."}
              </p>

              {/* Show attempted path */}
              <p style={{
                color: 'rgba(255,255,255,0.3)',
                fontSize: 'clamp(10px, 2vw, 12px)',
                marginBottom: 'clamp(16px, 3vw, 24px)',
                fontFamily: 'monospace',
                padding: '6px 12px',
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '8px',
                display: 'inline-block',
                position: 'relative',
                zIndex: 1,
                wordBreak: 'break-all',
                maxWidth: '100%'
              }}>
                📁 {location.pathname}
              </p>

              {/* Action Buttons */}
              <div className="error-actions" style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'center',
                flexWrap: 'wrap',
                marginBottom: '20px',
                position: 'relative',
                zIndex: 1
              }}>
                <Link to="/" className="btn-primary" style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: 'clamp(10px, 2vw, 12px) clamp(20px, 4vw, 28px)',
                  borderRadius: '9999px',
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: 'clamp(12px, 2.5vw, 14px)',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 8px 25px rgba(99,102,241,0.3)'
                }}>
                  🏠 Go Home
                </Link>

                <button
                  onClick={() => window.history.back()}
                  className="btn-outline"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: 'clamp(10px, 2vw, 12px) clamp(20px, 4vw, 28px)',
                    borderRadius: '9999px',
                    background: 'transparent',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: 'rgba(255,255,255,0.7)',
                    fontWeight: 500,
                    fontSize: 'clamp(12px, 2.5vw, 14px)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  ← Go Back
                </button>
              </div>

              {/* Auto Redirect */}
              <div style={{
                paddingTop: '16px',
                borderTop: '1px solid rgba(255,255,255,0.06)',
                position: 'relative',
                zIndex: 1
              }}>
                {!autoRedirect ? (
                  <button
                    onClick={() => setAutoRedirect(true)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'rgba(255,255,255,0.4)',
                      fontSize: 'clamp(10px, 2vw, 12px)',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    ⏱️ Auto-redirect to home in 10s
                  </button>
                ) : (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    fontSize: 'clamp(10px, 2vw, 12px)',
                    color: 'rgba(255,255,255,0.5)',
                    flexWrap: 'wrap'
                  }}>
                    <span>Redirecting in</span>
                    <span style={{
                      fontSize: 'clamp(14px, 3vw, 18px)',
                      fontWeight: 700,
                      color: '#818cf8',
                      minWidth: '30px',
                      textAlign: 'center'
                    }}>
                      {countdown}
                    </span>
                    <span>seconds</span>
                    <button
                      onClick={() => {
                        setAutoRedirect(false);
                        setCountdown(10);
                      }}
                      style={{
                        background: 'rgba(239,68,68,0.1)',
                        border: '1px solid rgba(239,68,68,0.2)',
                        color: '#ef4444',
                        padding: '2px 10px',
                        borderRadius: '9999px',
                        fontSize: 'clamp(9px, 1.8vw, 11px)',
                        cursor: 'pointer'
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              <div className="error-credit" style={{
                marginTop: '20px',
                fontSize: 'clamp(10px, 2vw, 12px)',
                color: 'rgba(255,255,255,0.15)',
                position: 'relative',
                zIndex: 1
              }}>
                Developed by <strong style={{ color: '#818cf8' }}>Shahzaib Tahir</strong>
              </div>
            </div>

            {/* Suggested Pages */}
            <div className="glass-card" style={{
              padding: 'clamp(16px, 3vw, 24px)',
              maxWidth: '800px',
              width: '100%',
              background: 'rgba(255,255,255,0.05)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '24px',
              boxSizing: 'border-box'
            }}>
              <h3 style={{
                fontSize: 'clamp(14px, 2.5vw, 16px)',
                fontWeight: 600,
                marginBottom: '16px',
                textAlign: 'center',
                color: 'rgba(255,255,255,0.7)'
              }}>
                🧭 Try These Pages Instead
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 150px), 1fr))',
                gap: 'clamp(8px, 2vw, 12px)'
              }}>
                {suggestedPages.map((page) => (
                  <Link
                    key={page.path}
                    to={page.path}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      padding: 'clamp(12px, 2.5vw, 16px) clamp(8px, 2vw, 12px)',
                      borderRadius: '16px',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      textDecoration: 'none',
                      transition: 'all 0.3s ease',
                      textAlign: 'center'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(99,102,241,0.1)';
                      e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)';
                      e.currentTarget.style.transform = 'translateY(-4px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <span style={{ fontSize: 'clamp(24px, 5vw, 32px)', marginBottom: '8px' }}>
                      {page.icon}
                    </span>
                    <span style={{
                      fontSize: 'clamp(12px, 2vw, 14px)',
                      fontWeight: 600,
                      color: '#fff',
                      marginBottom: '2px'
                    }}>
                      {page.label}
                    </span>
                    <span style={{
                      fontSize: 'clamp(10px, 1.8vw, 11px)',
                      color: 'rgba(255,255,255,0.4)'
                    }}>
                      {page.desc}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>

      <style>{`
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        [data-theme="light"] .glass-card {
          background: rgba(255,255,255,0.5) !important;
          border: 1px solid rgba(0,0,0,0.04) !important;
        }
        [data-theme="light"] .error-content h1 {
          color: #1a1a2e !important;
          -webkit-text-fill-color: #1a1a2e !important;
        }
        [data-theme="light"] .error-content p {
          color: rgba(0,0,0,0.5) !important;
        }
        [data-theme="light"] .btn-outline {
          border-color: rgba(0,0,0,0.1) !important;
          color: rgba(0,0,0,0.5) !important;
        }
        [data-theme="light"] .btn-outline:hover {
          background: rgba(0,0,0,0.04) !important;
          color: #1a1a2e !important;
        }
        [data-theme="light"] .error-credit {
          color: rgba(0,0,0,0.15) !important;
        }
        [data-theme="light"] .error-credit strong {
          color: #6366f1 !important;
        }

        @media (max-width: 480px) {
          .error-actions {
            flex-direction: column !important;
          }
          .error-actions .btn-primary,
          .error-actions .btn-outline {
            width: 100% !important;
          }
        }
      `}</style>
    </>
  );
};

export default NotFound;