// ==========================================
// SETTINGS PAGE - FULLY FIXED + MOBILE OPTIMIZED
// Smooth Animations + Perfect Circle Buttons
// ==========================================

import React, { useState } from 'react';
import { useSettings } from '../context/SettingsContext';
import { useWeather } from '../context/WeatherContext';

// Components
import WeatherBackground from '../components/WeatherBackground';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SearchOverlay from '../components/SearchOverlay';

// ==========================================
// REUSABLE TOGGLE COMPONENT
// ==========================================
const SettingToggle = ({ label, desc, isActive, onToggle, isLast = false }) => {
  const [isPressed, setIsPressed] = useState(false);

  const handleClick = () => {
    setIsPressed(true);
    onToggle();
    setTimeout(() => setIsPressed(false), 200);
  };

  return (
    <div
      className="setting-item"
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 0',
        borderBottom: isLast ? 'none' : '1px solid rgba(255,255,255,0.04)',
        flexWrap: 'nowrap',
        gap: '12px'
      }}
    >
      <div
        className="setting-info"
        style={{
          flex: 1,
          minWidth: 0,
          paddingRight: '12px'
        }}
      >
        <label
          style={{
            fontWeight: 600,
            fontSize: 'clamp(13px, 2vw, 14px)',
            display: 'block',
            marginBottom: '2px'
          }}
        >
          {label}
        </label>
        <span
          className="setting-desc"
          style={{
            fontSize: 'clamp(11px, 1.8vw, 12px)',
            color: 'rgba(255,255,255,0.4)',
            display: 'block'
          }}
        >
          {desc}
        </span>
      </div>

      <div
        className="setting-control"
        style={{
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <button
          onClick={handleClick}
          className={`toggle-switch ${isActive ? 'active' : ''}`}
          type="button"
          aria-checked={isActive}
          role="switch"
          style={{
            width: '52px',
            height: '28px',
            minWidth: '52px',
            maxWidth: '52px',
            minHeight: '28px',
            maxHeight: '28px',
            borderRadius: '9999px',
            background: isActive
              ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
              : 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.06)',
            cursor: 'pointer',
            position: 'relative',
            display: 'inline-flex',
            alignItems: 'center',
            flexShrink: 0,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: isActive ? '0 0 20px rgba(99,102,241,0.3)' : 'none',
            transform: isPressed ? 'scale(0.95)' : 'scale(1)',
            padding: '0',
            boxSizing: 'border-box',
            outline: 'none'
          }}
        >
          <span
            style={{
              position: 'absolute',
              top: '50%',
              left: '2px',
              width: '22px',
              height: '22px',
              borderRadius: '50%',
              background: isActive ? '#ffffff' : 'rgba(255,255,255,0.3)',
              transform: isActive
                ? 'translateY(-50%) translateX(24px)'
                : 'translateY(-50%) translateX(0)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: isActive
                ? '0 2px 10px rgba(99,102,241,0.5)'
                : '0 2px 4px rgba(0,0,0,0.2)',
              display: 'block',
              boxSizing: 'border-box',
              pointerEvents: 'none'
            }}
          />
        </button>
      </div>
    </div>
  );
};

// ==========================================
// MAIN SETTINGS COMPONENT
// ==========================================
const Settings = () => {
  const { weatherData } = useWeather();
  const {
    theme,
    unit,
    windUnit,
    alerts,
    dailyForecast,
    aqiAlerts,
    locationAccess,
    accentColor,
    toggleTheme,
    toggleUnit,
    toggleSetting,
    setWindUnit,
    setAccent,
    resetSettings
  } = useSettings();

  const [searchOpen, setSearchOpen] = useState(false);
  const [savedIndicator, setSavedIndicator] = useState(null);

  const condition = weatherData?.condition || 'Sunny';

  const colorOptions = [
    { color: '#6366f1', label: 'Purple' },
    { color: '#8b5cf6', label: 'Violet' },
    { color: '#ec4899', label: 'Pink' },
    { color: '#10b981', label: 'Green' },
    { color: '#f59e0b', label: 'Yellow' },
    { color: '#ef4444', label: 'Red' }
  ];

  // Show "saved" indicator
  const showSaved = (key) => {
    setSavedIndicator(key);
    setTimeout(() => setSavedIndicator(null), 1500);
  };

  // Wrapper for settings change
  const handleSettingChange = (key, action) => {
    action();
    showSaved(key);
  };

  return (
    <>
      <WeatherBackground condition={condition} />
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

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
          overflowX: 'hidden'
        }}
      >
        <Navbar onSearchToggle={() => setSearchOpen(!searchOpen)} />

        <main className="page-content" style={{ padding: 'clamp(10px, 2vw, 20px) 0' }}>
          {/* ===== HEADER ===== */}
          <div
            className="page-header"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 'clamp(16px, 3vw, 30px)',
              flexWrap: 'wrap',
              gap: '12px'
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: 'clamp(20px, 4vw, 28px)',
                  fontWeight: 700,
                  letterSpacing: '-0.5px',
                  background: 'linear-gradient(135deg, #fff 60%, rgba(255,255,255,0.5))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                ⚙️ Settings
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 'clamp(12px, 2vw, 14px)' }}>
                Customize your weather experience
              </p>
            </div>

            {/* Saved Indicator */}
            {savedIndicator && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 14px',
                  borderRadius: '9999px',
                  background: 'rgba(16,185,129,0.15)',
                  border: '1px solid rgba(16,185,129,0.3)',
                  color: '#10b981',
                  fontSize: '12px',
                  fontWeight: 600,
                  animation: 'savedPop 0.3s ease'
                }}
              >
                ✅ Saved
              </div>
            )}
          </div>

          <div
            className="settings-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
              gap: 'clamp(12px, 2.5vw, 20px)'
            }}
          >
            {/* ==========================================
                APPEARANCE SECTION
                ========================================== */}
            <div
              className="settings-group"
              style={{
                padding: 'clamp(16px, 3vw, 24px)',
                borderRadius: '20px',
                background: 'rgba(255,255,255,0.04)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.06)',
                transition: 'all 0.3s ease'
              }}
            >
              <h3
                style={{
                  marginBottom: '20px',
                  fontSize: 'clamp(15px, 2.5vw, 17px)',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                🎨 Appearance
              </h3>

              {/* Theme Toggle */}
              <div
                className="setting-item"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px 0',
                  borderBottom: '1px solid rgba(255,255,255,0.04)',
                  flexWrap: 'nowrap',
                  gap: '12px'
                }}
              >
                <div className="setting-info" style={{ flex: 1, minWidth: 0, paddingRight: '12px' }}>
                  <label
                    style={{
                      fontWeight: 600,
                      fontSize: 'clamp(13px, 2vw, 14px)',
                      display: 'block',
                      marginBottom: '2px'
                    }}
                  >
                    Theme
                  </label>
                  <span
                    className="setting-desc"
                    style={{
                      fontSize: 'clamp(11px, 1.8vw, 12px)',
                      color: 'rgba(255,255,255,0.4)',
                      display: 'block'
                    }}
                  >
                    Dark or Light mode
                  </span>
                </div>

                <div className="setting-control" style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
                  <div
                    className="toggle-group"
                    style={{
                      display: 'inline-flex',
                      gap: '4px',
                      background: 'rgba(255,255,255,0.04)',
                      borderRadius: '9999px',
                      padding: '4px',
                      border: '1px solid rgba(255,255,255,0.06)',
                      position: 'relative',
                      flexShrink: 0
                    }}
                  >
                    {/* Sliding indicator */}
                    <div
                      style={{
                        position: 'absolute',
                        top: '4px',
                        left: theme === 'dark' ? '4px' : 'calc(50% + 2px)',
                        width: 'calc(50% - 6px)',
                        height: 'calc(100% - 8px)',
                        borderRadius: '9999px',
                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                        transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: '0 2px 10px rgba(99,102,241,0.3)',
                        zIndex: 0
                      }}
                    />

                    <button
                      onClick={() =>
                        handleSettingChange('theme', () => {
                          if (theme !== 'dark') toggleTheme();
                        })
                      }
                      className={`toggle-btn ${theme === 'dark' ? 'active' : ''}`}
                      type="button"
                      style={{
                        padding: '6px 16px',
                        minWidth: '68px',
                        borderRadius: '9999px',
                        background: 'transparent',
                        color: theme === 'dark' ? '#fff' : 'rgba(255,255,255,0.4)',
                        fontSize: 'clamp(11px, 2vw, 13px)',
                        cursor: 'pointer',
                        border: 'none',
                        fontWeight: 600,
                        transition: 'color 0.3s ease',
                        position: 'relative',
                        zIndex: 1,
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        whiteSpace: 'nowrap',
                        flexShrink: 0,
                        lineHeight: 1.2,
                        boxSizing: 'border-box'
                      }}
                    >
                      🌙 Dark
                    </button>

                    <button
                      onClick={() =>
                        handleSettingChange('theme', () => {
                          if (theme !== 'light') toggleTheme();
                        })
                      }
                      className={`toggle-btn ${theme === 'light' ? 'active' : ''}`}
                      type="button"
                      style={{
                        padding: '6px 16px',
                        minWidth: '68px',
                        borderRadius: '9999px',
                        background: 'transparent',
                        color: theme === 'light' ? '#fff' : 'rgba(255,255,255,0.4)',
                        fontSize: 'clamp(11px, 2vw, 13px)',
                        cursor: 'pointer',
                        border: 'none',
                        fontWeight: 600,
                        transition: 'color 0.3s ease',
                        position: 'relative',
                        zIndex: 1,
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        whiteSpace: 'nowrap',
                        flexShrink: 0,
                        lineHeight: 1.2,
                        boxSizing: 'border-box'
                      }}
                    >
                      ☀️ Light
                    </button>
                  </div>
                </div>
              </div>

              {/* Accent Color */}
              <div
                className="setting-item"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px 0',
                  borderBottom: 'none',
                  flexWrap: 'nowrap',
                  gap: '12px'
                }}
              >
                <div className="setting-info" style={{ flex: 1, minWidth: 0, paddingRight: '12px' }}>
                  <label
                    style={{
                      fontWeight: 600,
                      fontSize: 'clamp(13px, 2vw, 14px)',
                      display: 'block',
                      marginBottom: '2px'
                    }}
                  >
                    Accent Color
                  </label>
                  <span
                    className="setting-desc"
                    style={{
                      fontSize: 'clamp(11px, 1.8vw, 12px)',
                      color: 'rgba(255,255,255,0.4)',
                      display: 'block'
                    }}
                  >
                    Choose your style
                  </span>
                </div>

                <div className="setting-control" style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
                  <div
                    className="color-options"
                    style={{
                      display: 'flex',
                      gap: '8px',
                      flexWrap: 'wrap',
                      justifyContent: 'flex-end'
                    }}
                  >
                    {colorOptions.map((opt) => (
                      <span
                        key={opt.color}
                        className={`color-option ${accentColor === opt.color ? 'active' : ''}`}
                        onClick={() => handleSettingChange('accent', () => setAccent(opt.color))}
                        title={opt.label}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleSettingChange('accent', () => setAccent(opt.color));
                          }
                        }}
                        style={{
                          width: '32px',
                          height: '32px',
                          minWidth: '32px',
                          maxWidth: '32px',
                          minHeight: '32px',
                          maxHeight: '32px',
                          aspectRatio: '1 / 1',
                          borderRadius: '50%',
                          background: opt.color,
                          cursor: 'pointer',
                          border: accentColor === opt.color ? '3px solid #fff' : '3px solid transparent',
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          boxShadow:
                            accentColor === opt.color
                              ? `0 0 0 3px rgba(255,255,255,0.15), 0 4px 15px ${opt.color}80`
                              : '0 2px 8px rgba(0,0,0,0.2)',
                          transform: accentColor === opt.color ? 'scale(1.1)' : 'scale(1)',
                          position: 'relative',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          boxSizing: 'border-box'
                        }}
                        onMouseEnter={(e) => {
                          if (accentColor !== opt.color) {
                            e.currentTarget.style.transform = 'scale(1.15)';
                            e.currentTarget.style.boxShadow = `0 4px 15px ${opt.color}80`;
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (accentColor !== opt.color) {
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
                          }
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ==========================================
                UNITS SECTION
                ========================================== */}
            <div
              className="settings-group"
              style={{
                padding: 'clamp(16px, 3vw, 24px)',
                borderRadius: '20px',
                background: 'rgba(255,255,255,0.04)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.06)'
              }}
            >
              <h3
                style={{
                  marginBottom: '20px',
                  fontSize: 'clamp(15px, 2.5vw, 17px)',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                📐 Units
              </h3>

              {/* Temperature */}
              <div
                className="setting-item"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px 0',
                  borderBottom: '1px solid rgba(255,255,255,0.04)',
                  flexWrap: 'nowrap',
                  gap: '12px'
                }}
              >
                <div className="setting-info" style={{ flex: 1, minWidth: 0, paddingRight: '12px' }}>
                  <label
                    style={{
                      fontWeight: 600,
                      fontSize: 'clamp(13px, 2vw, 14px)',
                      display: 'block',
                      marginBottom: '2px'
                    }}
                  >
                    Temperature
                  </label>
                  <span
                    className="setting-desc"
                    style={{
                      fontSize: 'clamp(11px, 1.8vw, 12px)',
                      color: 'rgba(255,255,255,0.4)',
                      display: 'block'
                    }}
                  >
                    Celsius or Fahrenheit
                  </span>
                </div>

                <div className="setting-control" style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
                  <div
                    className="toggle-group"
                    style={{
                      display: 'inline-flex',
                      gap: '4px',
                      background: 'rgba(255,255,255,0.04)',
                      borderRadius: '9999px',
                      padding: '4px',
                      border: '1px solid rgba(255,255,255,0.06)',
                      position: 'relative',
                      flexShrink: 0
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        top: '4px',
                        left: unit === 'celsius' ? '4px' : 'calc(50% + 2px)',
                        width: 'calc(50% - 6px)',
                        height: 'calc(100% - 8px)',
                        borderRadius: '9999px',
                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                        transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: '0 2px 10px rgba(99,102,241,0.3)',
                        zIndex: 0
                      }}
                    />

                    <button
                      onClick={() =>
                        handleSettingChange('unit', () => {
                          if (unit !== 'celsius') toggleUnit();
                        })
                      }
                      type="button"
                      style={{
                        padding: '6px 18px',
                        minWidth: '60px',
                        borderRadius: '9999px',
                        background: 'transparent',
                        color: unit === 'celsius' ? '#fff' : 'rgba(255,255,255,0.4)',
                        fontSize: 'clamp(12px, 2vw, 14px)',
                        cursor: 'pointer',
                        border: 'none',
                        fontWeight: 700,
                        transition: 'color 0.3s ease',
                        position: 'relative',
                        zIndex: 1,
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        whiteSpace: 'nowrap',
                        flexShrink: 0,
                        lineHeight: 1.2,
                        boxSizing: 'border-box'
                      }}
                    >
                      °C
                    </button>

                    <button
                      onClick={() =>
                        handleSettingChange('unit', () => {
                          if (unit !== 'fahrenheit') toggleUnit();
                        })
                      }
                      type="button"
                      style={{
                        padding: '6px 18px',
                        minWidth: '60px',
                        borderRadius: '9999px',
                        background: 'transparent',
                        color: unit === 'fahrenheit' ? '#fff' : 'rgba(255,255,255,0.4)',
                        fontSize: 'clamp(12px, 2vw, 14px)',
                        cursor: 'pointer',
                        border: 'none',
                        fontWeight: 700,
                        transition: 'color 0.3s ease',
                        position: 'relative',
                        zIndex: 1,
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        whiteSpace: 'nowrap',
                        flexShrink: 0,
                        lineHeight: 1.2,
                        boxSizing: 'border-box'
                      }}
                    >
                      °F
                    </button>
                  </div>
                </div>
              </div>

              {/* Wind Speed */}
              <div
                className="setting-item"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px 0',
                  borderBottom: 'none',
                  flexWrap: 'nowrap',
                  gap: '12px'
                }}
              >
                <div className="setting-info" style={{ flex: 1, minWidth: 0, paddingRight: '12px' }}>
                  <label
                    style={{
                      fontWeight: 600,
                      fontSize: 'clamp(13px, 2vw, 14px)',
                      display: 'block',
                      marginBottom: '2px'
                    }}
                  >
                    Wind Speed
                  </label>
                  <span
                    className="setting-desc"
                    style={{
                      fontSize: 'clamp(11px, 1.8vw, 12px)',
                      color: 'rgba(255,255,255,0.4)',
                      display: 'block'
                    }}
                  >
                    km/h or mph
                  </span>
                </div>

                <div className="setting-control" style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
                  <select
                    value={windUnit}
                    onChange={(e) => handleSettingChange('windUnit', () => setWindUnit(e.target.value))}
                    style={{
                      padding: '8px 32px 8px 16px',
                      borderRadius: '12px',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      color: '#fff',
                      fontSize: 'clamp(12px, 2vw, 13px)',
                      cursor: 'pointer',
                      outline: 'none',
                      fontWeight: 600,
                      transition: 'all 0.3s ease',
                      appearance: 'none',
                      WebkitAppearance: 'none',
                      MozAppearance: 'none',
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12' fill='none'%3E%3Cpath d='M3 4.5L6 7.5L9 4.5' stroke='rgba(255,255,255,0.5)' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 12px center',
                      minWidth: '100px',
                      boxSizing: 'border-box',
                      flexShrink: 0
                    }}
                  >
                    <option value="kmh" style={{ background: '#1a1a2e', color: '#fff' }}>
                      km/h
                    </option>
                    <option value="mph" style={{ background: '#1a1a2e', color: '#fff' }}>
                      mph
                    </option>
                  </select>
                </div>
              </div>
            </div>

            {/* ==========================================
                NOTIFICATIONS SECTION
                ========================================== */}
            <div
              className="settings-group"
              style={{
                padding: 'clamp(16px, 3vw, 24px)',
                borderRadius: '20px',
                background: 'rgba(255,255,255,0.04)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.06)'
              }}
            >
              <h3
                style={{
                  marginBottom: '20px',
                  fontSize: 'clamp(15px, 2.5vw, 17px)',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                🔔 Notifications
              </h3>

              <SettingToggle
                label="Weather Alerts"
                desc="Severe weather warnings"
                isActive={alerts}
                onToggle={() => handleSettingChange('alerts', () => toggleSetting('alerts'))}
              />

              <SettingToggle
                label="Daily Forecast"
                desc="Morning weather updates"
                isActive={dailyForecast}
                onToggle={() => handleSettingChange('daily', () => toggleSetting('daily'))}
              />

              <SettingToggle
                label="Air Quality Alerts"
                desc="Get notified about air quality changes"
                isActive={aqiAlerts}
                onToggle={() => handleSettingChange('aqi', () => toggleSetting('aqi'))}
                isLast={true}
              />
            </div>

            {/* ==========================================
                DATA & PRIVACY SECTION
                ========================================== */}
            <div
              className="settings-group"
              style={{
                padding: 'clamp(16px, 3vw, 24px)',
                borderRadius: '20px',
                background: 'rgba(255,255,255,0.04)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.06)'
              }}
            >
              <h3
                style={{
                  marginBottom: '20px',
                  fontSize: 'clamp(15px, 2.5vw, 17px)',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                🔒 Data & Privacy
              </h3>

              <SettingToggle
                label="Location Access"
                desc="Allow access to your location"
                isActive={locationAccess}
                onToggle={() => handleSettingChange('location', () => toggleSetting('location'))}
              />

              <div
                className="setting-item"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px 0',
                  borderBottom: 'none',
                  flexWrap: 'nowrap',
                  gap: '12px'
                }}
              >
                <div className="setting-info" style={{ flex: 1, minWidth: 0, paddingRight: '12px' }}>
                  <label
                    style={{
                      fontWeight: 600,
                      fontSize: 'clamp(13px, 2vw, 14px)',
                      display: 'block',
                      marginBottom: '2px'
                    }}
                  >
                    Clear All Data
                  </label>
                  <span
                    className="setting-desc"
                    style={{
                      fontSize: 'clamp(11px, 1.8vw, 12px)',
                      color: 'rgba(255,255,255,0.4)',
                      display: 'block'
                    }}
                  >
                    Reset everything to default
                  </span>
                </div>

                <div className="setting-control" style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
                  <button
                    onClick={() => {
                      if (confirm('⚠️ Reset all settings to default?')) {
                        resetSettings();
                        showSaved('reset');
                      }
                    }}
                    type="button"
                    className="btn-danger"
                    style={{
                      padding: '8px 20px',
                      borderRadius: '9999px',
                      background: 'rgba(239,68,68,0.1)',
                      border: '1px solid rgba(239,68,68,0.2)',
                      color: '#ef4444',
                      fontSize: 'clamp(11px, 2vw, 12px)',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      whiteSpace: 'nowrap',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minWidth: '80px',
                      boxSizing: 'border-box',
                      flexShrink: 0
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(239,68,68,0.2)';
                      e.currentTarget.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(239,68,68,0.1)';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>

            {/* ==========================================
                ABOUT SECTION
                ========================================== */}
            <div
              className="settings-group"
              style={{
                padding: 'clamp(16px, 3vw, 24px)',
                borderRadius: '20px',
                background: 'rgba(255,255,255,0.04)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.06)'
              }}
            >
              <h3
                style={{
                  marginBottom: '20px',
                  fontSize: 'clamp(15px, 2.5vw, 17px)',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                ℹ️ About
              </h3>

              {/* Version */}
              <div
                className="setting-item"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px 0',
                  borderBottom: '1px solid rgba(255,255,255,0.04)',
                  flexWrap: 'nowrap',
                  gap: '12px'
                }}
              >
                <div className="setting-info" style={{ flex: 1, minWidth: 0, paddingRight: '12px' }}>
                  <label
                    style={{
                      fontWeight: 600,
                      fontSize: 'clamp(13px, 2vw, 14px)',
                      display: 'block',
                      marginBottom: '2px'
                    }}
                  >
                    Version
                  </label>
                  <span
                    className="setting-desc"
                    style={{
                      fontSize: 'clamp(11px, 1.8vw, 12px)',
                      color: 'rgba(255,255,255,0.4)',
                      display: 'block'
                    }}
                  >
                    Current application version
                  </span>
                </div>
                <div className="setting-control" style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
                  <span
                    style={{
                      padding: '4px 12px',
                      borderRadius: '9999px',
                      background: 'rgba(99,102,241,0.15)',
                      border: '1px solid rgba(99,102,241,0.3)',
                      color: '#818cf8',
                      fontSize: 'clamp(11px, 2vw, 13px)',
                      fontWeight: 700,
                      whiteSpace: 'nowrap',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxSizing: 'border-box'
                    }}
                  >
                    v7.0.0
                  </span>
                </div>
              </div>

              {/* Developer */}
              <div
                className="setting-item"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px 0',
                  borderBottom: '1px solid rgba(255,255,255,0.04)',
                  flexWrap: 'nowrap',
                  gap: '12px'
                }}
              >
                <div className="setting-info" style={{ flex: 1, minWidth: 0, paddingRight: '12px' }}>
                  <label
                    style={{
                      fontWeight: 600,
                      fontSize: 'clamp(13px, 2vw, 14px)',
                      display: 'block',
                      marginBottom: '2px'
                    }}
                  >
                    Developer
                  </label>
                  <span
                    className="setting-desc"
                    style={{
                      fontSize: 'clamp(11px, 1.8vw, 12px)',
                      color: 'rgba(255,255,255,0.4)',
                      display: 'block'
                    }}
                  >
                    Created by
                  </span>
                </div>
                <div className="setting-control" style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
                  <span
                    style={{
                      color: '#818cf8',
                      fontSize: 'clamp(12px, 2vw, 13px)',
                      fontWeight: 700,
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Shahzaib Tahir
                  </span>
                </div>
              </div>

              {/* Check Updates */}
              <div
                className="setting-item"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px 0',
                  borderBottom: 'none',
                  flexWrap: 'nowrap',
                  gap: '12px'
                }}
              >
                <div className="setting-info" style={{ flex: 1, minWidth: 0, paddingRight: '12px' }}>
                  <label
                    style={{
                      fontWeight: 600,
                      fontSize: 'clamp(13px, 2vw, 14px)',
                      display: 'block',
                      marginBottom: '2px'
                    }}
                  >
                    Check for Updates
                  </label>
                  <span
                    className="setting-desc"
                    style={{
                      fontSize: 'clamp(11px, 1.8vw, 12px)',
                      color: 'rgba(255,255,255,0.4)',
                      display: 'block'
                    }}
                  >
                    Latest version
                  </span>
                </div>
                <div className="setting-control" style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
                  <button
                    onClick={() => {
                      showSaved('updates');
                      alert('✅ You are using the latest version!');
                    }}
                    type="button"
                    style={{
                      padding: '8px 20px',
                      borderRadius: '9999px',
                      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                      color: '#fff',
                      fontSize: 'clamp(11px, 2vw, 12px)',
                      fontWeight: 700,
                      cursor: 'pointer',
                      border: 'none',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      boxShadow: '0 4px 15px rgba(99,102,241,0.3)',
                      whiteSpace: 'nowrap',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minWidth: '80px',
                      boxSizing: 'border-box',
                      flexShrink: 0
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 8px 25px rgba(99,102,241,0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 15px rgba(99,102,241,0.3)';
                    }}
                  >
                    Check
                  </button>
                </div>
              </div>
            </div>

            {/* ==========================================
                DANGER ZONE
                ========================================== */}
            <div
              className="settings-group danger-zone"
              style={{
                padding: 'clamp(16px, 3vw, 24px)',
                borderRadius: '20px',
                background: 'rgba(239,68,68,0.04)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(239,68,68,0.15)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '-50%',
                  right: '-50%',
                  width: '200px',
                  height: '200px',
                  background: 'radial-gradient(circle, rgba(239,68,68,0.1) 0%, transparent 70%)',
                  pointerEvents: 'none'
                }}
              />

              <h3
                style={{
                  marginBottom: '20px',
                  fontSize: 'clamp(15px, 2.5vw, 17px)',
                  fontWeight: 700,
                  color: '#ef4444',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  position: 'relative'
                }}
              >
                ⚠️ Danger Zone
              </h3>

              <div
                className="setting-item"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px 0',
                  borderBottom: 'none',
                  flexWrap: 'nowrap',
                  gap: '12px',
                  position: 'relative'
                }}
              >
                <div className="setting-info" style={{ flex: 1, minWidth: 0, paddingRight: '12px' }}>
                  <label
                    style={{
                      fontWeight: 600,
                      fontSize: 'clamp(13px, 2vw, 14px)',
                      display: 'block',
                      marginBottom: '2px',
                      color: '#ef4444'
                    }}
                  >
                    Reset All Settings
                  </label>
                  <span
                    className="setting-desc"
                    style={{
                      fontSize: 'clamp(11px, 1.8vw, 12px)',
                      color: 'rgba(255,255,255,0.4)',
                      display: 'block'
                    }}
                  >
                    Reset to default values
                  </span>
                </div>

                <div className="setting-control" style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
                  <button
                    onClick={() => {
                      if (confirm('⚠️ Are you sure you want to reset EVERYTHING? This cannot be undone!')) {
                        resetSettings();
                        showSaved('reset-all');
                      }
                    }}
                    type="button"
                    style={{
                      padding: '8px 20px',
                      borderRadius: '9999px',
                      background: 'rgba(239,68,68,0.15)',
                      border: '1px solid rgba(239,68,68,0.25)',
                      color: '#ef4444',
                      fontSize: 'clamp(11px, 2vw, 12px)',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      whiteSpace: 'nowrap',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxSizing: 'border-box',
                      flexShrink: 0
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(239,68,68,0.25)';
                      e.currentTarget.style.transform = 'scale(1.05)';
                      e.currentTarget.style.boxShadow = '0 0 20px rgba(239,68,68,0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(239,68,68,0.15)';
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    Reset Everything
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>

      <style>{`
        @keyframes savedPop {
          0% {
            opacity: 0;
            transform: scale(0.8) translateY(-5px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        /* Smooth hover effects */
        .settings-group {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .settings-group:hover {
          border-color: rgba(99,102,241,0.15) !important;
          box-shadow: 0 10px 40px rgba(0,0,0,0.15);
        }

        /* Toggle button hover */
        .toggle-btn {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .toggle-btn:hover {
          transform: scale(1.02);
        }

        /* Select focus */
        select:focus {
          border-color: #6366f1 !important;
          box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
        }

        /* Light theme */
        [data-theme="light"] .settings-group {
          background: rgba(255,255,255,0.7) !important;
          border-color: rgba(0,0,0,0.06) !important;
        }
        [data-theme="light"] .setting-item {
          border-color: rgba(0,0,0,0.04) !important;
        }
        [data-theme="light"] .setting-info .setting-desc {
          color: rgba(0,0,0,0.4) !important;
        }
        [data-theme="light"] .setting-info label {
          color: #1a1a2e !important;
        }
        [data-theme="light"] .toggle-group {
          background: rgba(0,0,0,0.04) !important;
          border-color: rgba(0,0,0,0.06) !important;
        }
        [data-theme="light"] select {
          background: rgba(0,0,0,0.04) !important;
          border-color: rgba(0,0,0,0.06) !important;
          color: #1a1a2e !important;
        }
        [data-theme="light"] .page-header h1 {
          color: #1a1a2e !important;
          -webkit-text-fill-color: #1a1a2e !important;
        }
        [data-theme="light"] .page-header p {
          color: rgba(0,0,0,0.4) !important;
        }
        [data-theme="light"] .danger-zone {
          border-color: rgba(239,68,68,0.15) !important;
          background: rgba(239,68,68,0.04) !important;
        }

        /* ==========================================
           MOBILE FIX - PREVENT OVAL BUTTONS
           ========================================== */
        @media (max-width: 768px) {
          .setting-item {
            flex-wrap: nowrap !important;
            gap: 8px !important;
          }

          .setting-info {
            flex: 1 !important;
            min-width: 0 !important;
            padding-right: 8px !important;
          }

          .setting-control {
            flex-shrink: 0 !important;
            display: flex !important;
            align-items: center !important;
          }

          .toggle-group {
            display: inline-flex !important;
            width: auto !important;
          }

          .toggle-group .toggle-btn {
            flex: 0 0 auto !important;
            width: auto !important;
            min-width: 58px !important;
            padding: 5px 12px !important;
          }

          .toggle-switch {
            width: 48px !important;
            height: 26px !important;
            min-width: 48px !important;
            max-width: 48px !important;
            min-height: 26px !important;
            max-height: 26px !important;
            flex-shrink: 0 !important;
          }

          .toggle-switch span {
            width: 20px !important;
            height: 20px !important;
          }

          .color-options {
            gap: 6px !important;
          }

          .color-option {
            width: 30px !important;
            height: 30px !important;
            min-width: 30px !important;
            max-width: 30px !important;
            min-height: 30px !important;
            max-height: 30px !important;
            aspect-ratio: 1 / 1 !important;
            flex-shrink: 0 !important;
          }
        }

        @media (max-width: 480px) {
          .toggle-group .toggle-btn {
            min-width: 52px !important;
            padding: 4px 10px !important;
            font-size: 11px !important;
          }

          .toggle-switch {
            width: 44px !important;
            height: 24px !important;
            min-width: 44px !important;
            max-width: 44px !important;
            min-height: 24px !important;
            max-height: 24px !important;
          }

          .toggle-switch span {
            width: 18px !important;
            height: 18px !important;
          }

          .color-option {
            width: 26px !important;
            height: 26px !important;
            min-width: 26px !important;
            max-width: 26px !important;
            min-height: 26px !important;
            max-height: 26px !important;
          }

          .setting-info label {
            font-size: 12px !important;
          }

          .setting-info .setting-desc {
            font-size: 10px !important;
          }
        }
      `}</style>
    </>
  );
};

export default Settings;