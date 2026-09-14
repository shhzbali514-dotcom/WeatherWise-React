// ==========================================
// WEATHER ALERT COMPONENT
// Fully Upgraded — Multiple Alerts + AQI + UV + Fog
// ==========================================

import React, { useState, useEffect } from 'react';
import { useWeather } from '../context/WeatherContext';
import { useSettings } from '../context/SettingsContext';

// ==========================================
// GET ALERT COLORS BASED ON TYPE
// ==========================================
const getAlertColors = (type) => {
  const colors = {
    danger: {
      bgDark: 'rgba(239, 68, 68, 0.12)',
      bgLight: 'rgba(239, 68, 68, 0.06)',
      borderDark: 'rgba(239, 68, 68, 0.25)',
      borderLight: 'rgba(239, 68, 68, 0.15)',
      text: '#ef4444',
      textLight: '#dc2626',
      icon: '⚠️',
    },
    warning: {
      bgDark: 'rgba(245, 158, 11, 0.12)',
      bgLight: 'rgba(245, 158, 11, 0.06)',
      borderDark: 'rgba(245, 158, 11, 0.25)',
      borderLight: 'rgba(245, 158, 11, 0.15)',
      text: '#f59e0b',
      textLight: '#d97706',
      icon: '⚡',
    },
    info: {
      bgDark: 'rgba(59, 130, 246, 0.12)',
      bgLight: 'rgba(59, 130, 246, 0.06)',
      borderDark: 'rgba(59, 130, 246, 0.25)',
      borderLight: 'rgba(59, 130, 246, 0.15)',
      text: '#3b82f6',
      textLight: '#2563eb',
      icon: 'ℹ️',
    },
  };

  return colors[type] || colors.info;
};

// ==========================================
// GENERATE ALERTS FROM WEATHER DATA
// ==========================================
const generateAlerts = (weatherData, aqiData) => {
  if (!weatherData) return [];

  const alerts = [];
  const temp = weatherData.temperature;
  const wind = weatherData.windSpeed;
  const condition = weatherData.condition;
  const precip = weatherData.precipitation || 0;
  const uvIndex = weatherData.uvIndex;
  const visibility = weatherData.visibility;
  const humidity = weatherData.humidity;
  const weatherCode = weatherData.weatherCode;

  // 1. THUNDERSTORM
  if (
    condition === 'Thunderstorm' ||
    (weatherCode >= 95 && weatherCode <= 99)
  ) {
    alerts.push({
      id: 'thunderstorm',
      type: 'danger',
      icon: '⛈️',
      text: 'Thunderstorm Warning!',
      detail: 'Seek shelter immediately. Avoid open spaces.',
      priority: 1,
    });
  }

  // 2. EXTREME HEAT
  if (temp !== null && temp >= 40) {
    alerts.push({
      id: 'extreme-heat',
      type: 'danger',
      icon: '🔥',
      text: 'Extreme Heat Warning!',
      detail: 'Stay hydrated and avoid sun exposure.',
      priority: 1,
    });
  } else if (temp !== null && temp >= 35) {
    alerts.push({
      id: 'heat',
      type: 'warning',
      icon: '🌡️',
      text: 'Heat Advisory',
      detail: 'High temperature. Drink water regularly.',
      priority: 2,
    });
  }

  // 3. FREEZING
  if (temp !== null && temp <= 0) {
    alerts.push({
      id: 'freezing',
      type: 'danger',
      icon: '🥶',
      text: 'Freezing Temperature!',
      detail: 'Risk of frostbite. Dress warmly.',
      priority: 1,
    });
  } else if (temp !== null && temp <= 5) {
    alerts.push({
      id: 'cold',
      type: 'warning',
      icon: '❄️',
      text: 'Cold Weather Advisory',
      detail: 'Low temperature. Limit outdoor time.',
      priority: 2,
    });
  }

  // 4. STRONG WIND
  if (wind !== null && wind >= 60) {
    alerts.push({
      id: 'storm-wind',
      type: 'danger',
      icon: '🌪️',
      text: 'Storm Wind Warning!',
      detail: 'Secure outdoor items. Avoid travel.',
      priority: 1,
    });
  } else if (wind !== null && wind >= 40) {
    alerts.push({
      id: 'strong-wind',
      type: 'warning',
      icon: '💨',
      text: 'Strong Wind Advisory',
      detail: 'Strong winds expected. Drive carefully.',
      priority: 2,
    });
  }

  // 5. HEAVY RAIN
  if (
    condition === 'Rainy' &&
    (precip > 20 || (weatherCode >= 63 && weatherCode <= 67))
  ) {
    alerts.push({
      id: 'heavy-rain',
      type: 'warning',
      icon: '🌧️',
      text: 'Heavy Rain Alert!',
      detail: 'Be cautious of flooding in low areas.',
      priority: 2,
    });
  }

  // 6. SNOW
  if (
    condition === 'Snowy' &&
    temp !== null &&
    temp < 0
  ) {
    alerts.push({
      id: 'snow',
      type: 'warning',
      icon: '❄️',
      text: 'Snow Alert!',
      detail: 'Drive carefully. Roads may be slippery.',
      priority: 2,
    });
  }

  // 7. FOG
  if (
    condition === 'Foggy' ||
    weatherCode === 45 ||
    weatherCode === 48
  ) {
    alerts.push({
      id: 'fog',
      type: 'warning',
      icon: '🌫️',
      text: 'Fog Warning',
      detail: 'Drive slowly. Use fog lights.',
      priority: 3,
    });
  }

  // 8. LOW VISIBILITY
  if (visibility !== null && visibility !== undefined) {
    if (visibility < 1000) {
      alerts.push({
        id: 'low-visibility',
        type: 'danger',
        icon: '👁️',
        text: 'Very Low Visibility!',
        detail: 'Visibility below 1 km. Avoid travel.',
        priority: 2,
      });
    } else if (visibility < 3000) {
      alerts.push({
        id: 'reduced-visibility',
        type: 'warning',
        icon: '👁️',
        text: 'Reduced Visibility',
        detail: 'Visibility below 3 km. Drive carefully.',
        priority: 3,
      });
    }
  }

  // 9. HIGH UV
  if (uvIndex !== null && uvIndex !== undefined) {
    if (uvIndex >= 11) {
      alerts.push({
        id: 'extreme-uv',
        type: 'danger',
        icon: '☀️',
        text: 'Extreme UV Radiation!',
        detail: 'Avoid sun between 10am–4pm.',
        priority: 2,
      });
    } else if (uvIndex >= 8) {
      alerts.push({
        id: 'high-uv',
        type: 'warning',
        icon: '🕶️',
        text: 'High UV Radiation',
        detail: 'Wear sunscreen and sunglasses.',
        priority: 3,
      });
    }
  }

  // 10. HIGH HUMIDITY
  if (
    humidity !== null &&
    humidity >= 90 &&
    temp !== null &&
    temp >= 30
  ) {
    alerts.push({
      id: 'high-humidity',
      type: 'warning',
      icon: '💧',
      text: 'High Humidity',
      detail: 'Risk of heat exhaustion. Stay cool.',
      priority: 3,
    });
  }

  // 11. AQI ALERT
  if (aqiData && aqiData.current) {
    const aqi = aqiData.current.us_aqi;

    if (aqi >= 301) {
      alerts.push({
        id: 'hazardous-aqi',
        type: 'danger',
        icon: '☠️',
        text: 'Hazardous Air Quality!',
        detail: 'AQI above 300. Stay indoors.',
        priority: 1,
      });
    } else if (aqi >= 201) {
      alerts.push({
        id: 'very-unhealthy-aqi',
        type: 'danger',
        icon: '😷',
        text: 'Very Unhealthy Air!',
        detail: 'AQI above 200. Avoid outdoor activities.',
        priority: 2,
      });
    } else if (aqi >= 151) {
      alerts.push({
        id: 'unhealthy-aqi',
        type: 'warning',
        icon: '😷',
        text: 'Unhealthy Air Quality',
        detail: 'AQI above 150. Wear a mask outdoors.',
        priority: 3,
      });
    } else if (aqi >= 101) {
      alerts.push({
        id: 'moderate-aqi',
        type: 'info',
        icon: '😐',
        text: 'Moderate Air Quality',
        detail: 'Sensitive groups should limit outdoor time.',
        priority: 4,
      });
    }
  }

  // Sort by priority (1 = highest)
  return alerts.sort((a, b) => a.priority - b.priority);
};

// ==========================================
// MAIN COMPONENT
// ==========================================
const WeatherAlert = () => {
  const { weatherData, aqiData, loading } = useWeather();
  const { theme } = useSettings();

  const [alerts, setAlerts] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [dismissed, setDismissed] = useState([]);

  // Generate alerts whenever weather changes
  useEffect(() => {
    if (weatherData) {
      const generated = generateAlerts(weatherData, aqiData);
      setAlerts(generated);
    } else {
      setAlerts([]);
    }
  }, [weatherData, aqiData]);

  // Filter out dismissed alerts
  const activeAlerts = alerts.filter(
    (a) => !dismissed.includes(a.id)
  );

  // Don't render if no alerts
  if (!weatherData || loading || activeAlerts.length === 0) {
    return null;
  }

  // Show only first 2 unless expanded
  const visibleAlerts = expanded
    ? activeAlerts
    : activeAlerts.slice(0, 2);
  const hasMore = activeAlerts.length > 2;

  // ==========================================
  // DISMISS SINGLE ALERT
  // ==========================================
  const handleDismiss = (alertId) => {
    setDismissed((prev) => [...prev, alertId]);
  };

  // ==========================================
  // RENDER
  // ==========================================
  return (
    <div
      className="weather-alerts-container"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        width: '100%',
        marginTop: '16px',
      }}
    >
      {visibleAlerts.map((alert, index) => {
        const colors = getAlertColors(alert.type);

        return (
          <div
            key={alert.id}
            className={`weather-alert weather-alert-${alert.type}`}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              padding: 'clamp(12px, 2vw, 16px)',
              borderRadius: '14px',
              background:
                theme === 'dark' ? colors.bgDark : colors.bgLight,
              border: `1px solid ${
                theme === 'dark'
                  ? colors.borderDark
                  : colors.borderLight
              }`,
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              animation: `alertSlideIn 0.4s ease ${
                index * 0.05
              }s both`,
              transition: 'all 0.3s ease',
              boxShadow:
                theme === 'dark'
                  ? '0 4px 20px rgba(0,0,0,0.15)'
                  : '0 4px 20px rgba(0,0,0,0.05)',
              position: 'relative',
            }}
          >
            {/* Icon */}
            <div
              className="alert-icon"
              style={{
                fontSize: 'clamp(20px, 3vw, 26px)',
                lineHeight: 1,
                flexShrink: 0,
                marginTop: '2px',
                animation:
                  alert.type === 'danger'
                    ? 'alertPulse 2s ease-in-out infinite'
                    : 'none',
              }}
            >
              {alert.icon}
            </div>

            {/* Content */}
            <div
              style={{
                flex: 1,
                minWidth: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                paddingRight: '24px',
              }}
            >
              <div
                className="alert-title"
                style={{
                  fontSize: 'clamp(12px, 2vw, 14px)',
                  fontWeight: 700,
                  color:
                    theme === 'dark'
                      ? colors.text
                      : colors.textLight,
                  letterSpacing: '0.2px',
                }}
              >
                {alert.text}
              </div>
              <div
                className="alert-message"
                style={{
                  fontSize: 'clamp(11px, 1.8vw, 12.5px)',
                  lineHeight: 1.5,
                  color:
                    theme === 'dark'
                      ? 'rgba(255,255,255,0.7)'
                      : 'rgba(0,0,0,0.6)',
                }}
              >
                {alert.detail}
              </div>
            </div>

            {/* Dismiss Button */}
            <button
              onClick={() => handleDismiss(alert.id)}
              className="alert-dismiss-btn"
              title="Dismiss"
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                background:
                  theme === 'dark'
                    ? 'rgba(255,255,255,0.05)'
                    : 'rgba(0,0,0,0.04)',
                border: 'none',
                color:
                  theme === 'dark'
                    ? 'rgba(255,255,255,0.4)'
                    : 'rgba(0,0,0,0.4)',
                fontSize: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease',
                padding: 0,
                lineHeight: 1,
              }}
            >
              ✕
            </button>
          </div>
        );
      })}

      {/* Show More/Less Button */}
      {hasMore && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="alert-toggle-btn"
          style={{
            alignSelf: 'center',
            padding: '8px 20px',
            borderRadius: '9999px',
            background:
              theme === 'dark'
                ? 'rgba(255,255,255,0.05)'
                : 'rgba(0,0,0,0.03)',
            border:
              theme === 'dark'
                ? '1px solid rgba(255,255,255,0.08)'
                : '1px solid rgba(0,0,0,0.06)',
            color:
              theme === 'dark'
                ? 'rgba(255,255,255,0.7)'
                : 'rgba(0,0,0,0.6)',
            fontSize: '11px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          {expanded ? (
            <>
              <span>▲</span>
              <span>Show Less</span>
            </>
          ) : (
            <>
              <span>▼</span>
              <span>
                Show {activeAlerts.length - 2} More Alert
                {activeAlerts.length - 2 > 1 ? 's' : ''}
              </span>
            </>
          )}
        </button>
      )}

      <style>{`
        @keyframes alertSlideIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes alertPulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.15);
          }
        }

        .weather-alert:hover {
          transform: translateY(-2px);
        }

        .alert-dismiss-btn:hover {
          background: rgba(239, 68, 68, 0.2) !important;
          color: #ef4444 !important;
        }

        .alert-toggle-btn:hover {
          background: rgba(99, 102, 241, 0.1) !important;
          border-color: rgba(99, 102, 241, 0.3) !important;
          color: #6366f1 !important;
        }

        @media (max-width: 480px) {
          .weather-alert {
            padding: 10px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default WeatherAlert;