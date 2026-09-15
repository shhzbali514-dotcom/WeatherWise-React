// ==========================================
// NAVBAR COMPONENT - FULLY FIXED
// Install Button: Auto-Hide When Installed
// Menu Button: Native App OR Mobile Screen
// REMOVED: Theme toggle (moved to Settings)
// ==========================================

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useWeather } from '../context/WeatherContext';
import { usePWAInstall } from '../hooks/usePWAInstall';

const Navbar = () => {
  const location = useLocation();
  const { currentCity } = useWeather();
  const [menuOpen, setMenuOpen] = useState(false);

  // ==========================================
  // PWA INSTALL HOOK
  // ==========================================
  const {
    isInstalled,
    isInstallable,
    shouldShowInstallButton,
    triggerInstall,
  } = usePWAInstall();

  // ==========================================
  // DETECT: Native App OR Mobile Screen
  // ==========================================
  const [isMobileOrNative, setIsMobileOrNative] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      const capacitorNative =
        window.Capacitor?.isNativePlatform?.() === true;
      const platform = window.Capacitor?.getPlatform?.();
      const isNative =
        capacitorNative ||
        platform === 'android' ||
        platform === 'ios';

      const isMobileScreen = window.matchMedia(
        '(max-width: 992px)'
      ).matches;

      const isTouchDevice =
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0;

      const shouldShow = isNative || isMobileScreen;

      console.log('🔍 Navbar Device Check:');
      console.log('   Capacitor native:', capacitorNative);
      console.log('   Platform:', platform);
      console.log('   Is Native App:', isNative);
      console.log('   Is Mobile Screen:', isMobileScreen);
      console.log('   → Show Menu:', shouldShow);

      setIsMobileOrNative(shouldShow);
    };

    checkDevice();

    const handleResize = () => checkDevice();
    window.addEventListener('resize', handleResize);

    const timer = setTimeout(checkDevice, 500);

    const mediaQuery = window.matchMedia('(max-width: 992px)');
    const handleMediaChange = () => checkDevice();

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleMediaChange);
    } else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleMediaChange);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);

      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener(
          'change',
          handleMediaChange
        );
      } else if (mediaQuery.removeListener) {
        mediaQuery.removeListener(handleMediaChange);
      }
    };
  }, []);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/forecast', label: 'Forecast' },
    { path: '/hourly', label: 'Hourly' },
    { path: '/map', label: 'Map' },
    { path: '/favorites', label: 'Favorites' },
    { path: '/settings', label: 'Settings' },
  ];

  const toggleMenu = () => setMenuOpen(!menuOpen);

  // Check if current page is Settings
  const isSettingsPage = location.pathname === '/settings';

  return (
    <>
      <header
        className="navbar"
        style={{
          position: 'sticky',
          top: '10px',
          zIndex: 100,
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 'clamp(8px, 2vw, 10px) clamp(12px, 3vw, 20px)',
          background: 'rgba(255,255,255,0.6)',
          backdropFilter: 'blur(25px)',
          WebkitBackdropFilter: 'blur(25px)',
          borderRadius: '20px',
          border: '1px solid rgba(0,0,0,0.06)',
          marginBottom: '20px',
          gap: '10px',
          transition: 'all 0.4s ease',
          boxShadow: '0 4px 30px rgba(0,0,0,0.2)',
        }}
      >
        {/* ===== LOGO + INSTALL BUTTON ===== */}
        <div
          className="navbar-left"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <Link to="/" style={{ textDecoration: 'none' }}>
            <div
              className="logo"
              style={{
                fontSize: 'clamp(15px, 2.5vw, 18px)',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background:
                  'linear-gradient(135deg, #6366f1, #8b5cf6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 32 32"
                fill="none"
              >
                <circle
                  cx="16"
                  cy="16"
                  r="14"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M16 4V8M16 24V28M4 16H8M24 16H28M7 7L10 10M22 22L25 25M7 25L10 22M22 10L25 7"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <circle
                  cx="16"
                  cy="16"
                  r="4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
              <span
                style={{
                  WebkitTextFillColor: 'initial',
                  color: 'inherit',
                }}
              >
                WeatherWise
              </span>
            </div>
          </Link>

          {/* ===== INSTALL BUTTON — Auto-Hide When Installed ===== */}
          {shouldShowInstallButton && (
            <button
              onClick={triggerInstall}
              className="download-btn"
              type="button"
              style={{
                padding: '4px 14px',
                fontSize: '11px',
                background: isInstallable
                  ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                  : 'rgba(0,0,0,0.05)',
                border: '1px solid rgba(0,0,0,0.08)',
                borderRadius: '9999px',
                color: isInstallable
                  ? '#fff'
                  : 'rgba(0,0,0,0.5)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                boxShadow: isInstallable
                  ? '0 4px 15px rgba(99,102,241,0.3)'
                  : 'none',
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform =
                  'translateY(-2px)';
                e.currentTarget.style.boxShadow =
                  '0 6px 20px rgba(99,102,241,0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = isInstallable
                  ? '0 4px 15px rgba(99,102,241,0.3)'
                  : 'none';
              }}
            >
              📱 Install
            </button>
          )}
        </div>

        {/* ===== NAV LINKS ===== */}
        <nav
          className="nav-links"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '4px',
            alignItems: 'center',
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={
                location.pathname === link.path ? 'active' : ''
              }
              style={{
                padding: '8px 18px',
                fontSize: '13px',
                fontWeight: 500,
                color:
                  location.pathname === link.path
                    ? '#1a1a2e'
                    : 'rgba(0,0,0,0.4)',
                borderRadius: '9999px',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                background:
                  location.pathname === link.path
                    ? 'rgba(99,102,241,0.15)'
                    : 'transparent',
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* ===== RIGHT SECTION ===== */}
        <div
          className="navbar-right"
          style={{
            display: 'flex',
            gap: '6px',
            alignItems: 'center',
          }}
        >
          {/* ===== MENU BUTTON ===== */}
          {isMobileOrNative && (
            <button
              onClick={toggleMenu}
              className="menu-btn"
              type="button"
              aria-label="Toggle menu"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                padding: '0',
                width: '38px',
                height: '38px',
                minWidth: '38px',
                maxWidth: '38px',
                minHeight: '38px',
                maxHeight: '38px',
                background: 'rgba(0,0,0,0.03)',
                border: '1px solid rgba(0,0,0,0.06)',
                borderRadius: '50%',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                flexShrink: 0,
                aspectRatio: '1 / 1',
              }}
            >
              <span
                style={{
                  width: '20px',
                  height: '2px',
                  background: 'rgba(0,0,0,0.6)',
                  borderRadius: '9999px',
                  transition: 'all 0.3s ease',
                }}
              />
              <span
                style={{
                  width: '20px',
                  height: '2px',
                  background: 'rgba(0,0,0,0.6)',
                  borderRadius: '9999px',
                  transition: 'all 0.3s ease',
                }}
              />
              <span
                style={{
                  width: '20px',
                  height: '2px',
                  background: 'rgba(0,0,0,0.6)',
                  borderRadius: '9999px',
                  transition: 'all 0.3s ease',
                }}
              />
            </button>
          )}
        </div>
      </header>

      {/* ===== MOBILE MENU ===== */}
      {isMobileOrNative && menuOpen && (
        <div
          className="mobile-menu"
          style={{
            position: 'fixed',
            top: '80px',
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 99,
            background: 'rgba(245,243,255,0.95)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            padding: '30px',
            overflowY: 'auto',
            transform: 'translateX(0)',
            transition: 'transform 0.4s ease',
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMenuOpen(false)}
              style={{
                display: 'block',
                padding: '16px',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: 500,
                color:
                  location.pathname === link.path
                    ? '#1a1a2e'
                    : 'rgba(0,0,0,0.6)',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                background:
                  location.pathname === link.path
                    ? 'rgba(99,102,241,0.1)'
                    : 'transparent',
              }}
            >
              {link.label}
            </Link>
          ))}

          <hr
            style={{
              border: 'none',
              borderTop: '1px solid rgba(0,0,0,0.05)',
              margin: '12px 0',
            }}
          />

          <Link
            to="/about"
            onClick={() => setMenuOpen(false)}
            style={{
              display: 'block',
              padding: '16px',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: 500,
              color: 'rgba(0,0,0,0.6)',
              textDecoration: 'none',
            }}
          >
            About
          </Link>

          <Link
            to="/contact"
            onClick={() => setMenuOpen(false)}
            style={{
              display: 'block',
              padding: '16px',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: 500,
              color: 'rgba(0,0,0,0.6)',
              textDecoration: 'none',
            }}
          >
            Contact
          </Link>

          {/* Install Button in Mobile Menu */}
          {shouldShowInstallButton && (
            <button
              onClick={triggerInstall}
              type="button"
              style={{
                display: 'block',
                width: '100%',
                marginTop: '16px',
                padding: '16px',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: 600,
                background:
                  'linear-gradient(135deg, #6366f1, #8b5cf6)',
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'center',
              }}
            >
              📱 Install App
            </button>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 992px) {
          .nav-links { display: none !important; }
        }
        @media (max-width: 480px) {
          .navbar { padding: 8px 12px !important; }
          .download-btn { padding: 4px 10px !important; font-size: 10px !important; }
        }
      `}</style>
    </>
  );
};

export default Navbar;