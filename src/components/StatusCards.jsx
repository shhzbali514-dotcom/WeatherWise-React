// ==========================================
// STATUS CARDS COMPONENT
// UPGRADED: Real data (no fake/random)
// 6 cards: Sunrise, Sunset, Wind, Humidity, Pressure, UV
// ==========================================

import React from 'react';
import { useWeather } from '../context/WeatherContext';
import { useSettings } from '../context/SettingsContext';
import { formatTime } from '../utils/helpers';

const StatusCards = () => {
  const { weatherData } = useWeather();
  const { theme } = useSettings();

  // ==========================================
  // THEME COLORS
  // ==========================================
  const cardBg =
    theme === 'dark'
      ? 'rgba(255,255,255,0.05)'
      : 'rgba(255,255,255,0.5)';

  const cardBorder =
    theme === 'dark'
      ? '1px solid rgba(255,255,255,0.08)'
      : '1px solid rgba(0,0,0,0.04)';

  const itemBg =
    theme === 'dark'
      ? 'rgba(255,255,255,0.02)'
      : 'rgba(0,0,0,0.02)';

  const textPrimary =
    theme === 'dark' ? '#ffffff' : '#1a1a2e';

  const textMuted =
    theme === 'dark'
      ? 'rgba(255,255,255,0.4)'
      : 'rgba(0,0,0,0.45)';

  const textFaint =
    theme === 'dark'
      ? 'rgba(255,255,255,0.3)'
      : 'rgba(0,0,0,0.3)';

  // ==========================================
  // LOADING STATE
  // ==========================================
  if (!weatherData) {
    return (
      <div
        className="glass-card"
        style={{
          background: cardBg,
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: cardBorder,
          borderRadius: '16px',
          padding: '24px',
          transition: 'all 0.4s ease',
        }}
      >
        <p
          style={{
            color: textFaint,
            textAlign: 'center',
            margin: 0,
            fontSize: '13px',
          }}
        >
          Loading status...
        </p>
      </div>
    );
  }

  // ==========================================
  // HELPERS
  // ==========================================
  const formatVisibility = (v) => {
    if (v === null || v === undefined) return '--';
    if (v >= 1000) return `${(v / 1000).toFixed(1)} km`;
    return `${Math.round(v)} m`;
  };

  const getUVLabel = (uv) => {
    if (uv === null || uv === undefined) return '--';
    if (uv <= 2) return 'Low';
    if (uv <= 5) return 'Moderate';
    if (uv <= 7) return 'High';
    if (uv <= 10) return 'Very High';
    return 'Extreme';
  };

  const getUVColor = (uv) => {
    if (uv === null || uv === undefined) return textPrimary;
    if (uv <= 2) return '#10b981';
    if (uv <= 5) return '#f59e0b';
    if (uv <= 7) return '#f97316';
    if (uv <= 10) return '#ef4444';
    return '#7c3aed';
  };

  // ==========================================
  // REAL STATUS CARDS DATA
  // ==========================================
  const cards = [
    {
      id: 'sunrise',
      icon: '🌅',
      label: 'Sunrise',
      value: weatherData.sunrise
        ? formatTime(weatherData.sunrise)
        : '--',
      color: '#fbbf24',
    },
    {
      id: 'sunset',
      icon: '🌇',
      label: 'Sunset',
      value: weatherData.sunset
        ? formatTime(weatherData.sunset)
        : '--',
      color: '#f97316',
    },
    {
      id: 'wind',
      icon: '💨',
      label: 'Wind',
      value:
        weatherData.windSpeed !== null &&
        weatherData.windSpeed !== undefined
          ? `${Math.round(weatherData.windSpeed)} km/h`
          : '--',
      color: '#60a5fa',
    },
    {
      id: 'humidity',
      icon: '💧',
      label: 'Humidity',
      value:
        weatherData.humidity !== null &&
        weatherData.humidity !== undefined
          ? `${Math.round(weatherData.humidity)}%`
          : '--',
      color: '#38bdf8',
    },
    {
      id: 'pressure',
      icon: '📊',
      label: 'Pressure',
      value:
        weatherData.pressure !== null &&
        weatherData.pressure !== undefined
          ? `${Math.round(weatherData.pressure)} mb`
          : '--',
      color: '#a78bfa',
    },
    {
      id: 'uv',
      icon: '☀️',
      label: 'UV Index',
      value: getUVLabel(weatherData.uvIndex),
      subValue:
        weatherData.uvIndex !== null &&
        weatherData.uvIndex !== undefined
          ? `${Math.round(weatherData.uvIndex)}`
          : '',
      color: getUVColor(weatherData.uvIndex),
    },
  ];

  // ==========================================
  // RENDER
  // ==========================================
  return (
    <div
      className="glass-card"
      style={{
        background: cardBg,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: cardBorder,
        borderRadius: '16px',
        padding: '20px',
        transition: 'all 0.4s ease',
      }}
    >
      {/* Header */}
      <div
        className="card-header"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
        }}
      >
        <h3
          style={{
            fontSize: '16px',
            fontWeight: 600,
            margin: 0,
            color: textPrimary,
          }}
        >
          📊 Conditions
        </h3>
      </div>

      {/* Grid: 3 columns x 2 rows */}
      <div
        className="status-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '10px',
        }}
      >
        {cards.map((card) => (
          <div
            key={card.id}
            className="status-item"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '14px 6px',
              background: itemBg,
              borderRadius: '12px',
              textAlign: 'center',
              transition: 'all 0.3s ease',
              minWidth: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.background =
                theme === 'dark'
                  ? 'rgba(255,255,255,0.05)'
                  : 'rgba(0,0,0,0.04)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.background = itemBg;
            }}
          >
            {/* Icon */}
            <span
              className="status-icon"
              style={{
                fontSize: '24px',
                marginBottom: '6px',
                lineHeight: 1,
                animation: 'floatIcon 3s ease-in-out infinite',
              }}
            >
              {card.icon}
            </span>

            {/* Label */}
            <span
              className="status-label"
              style={{
                fontSize: '10px',
                color: textMuted,
                textTransform: 'uppercase',
                letterSpacing: '0.4px',
                fontWeight: 600,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '100%',
              }}
            >
              {card.label}
            </span>

            {/* Value */}
            <span
              className="status-value"
              style={{
                fontSize: 'clamp(12px, 2vw, 14px)',
                fontWeight: 700,
                marginTop: '4px',
                color: card.color || textPrimary,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '100%',
                transition: 'color 0.3s ease',
              }}
            >
              {card.value}
            </span>

            {/* Sub value (UV number) */}
            {card.subValue && (
              <span
                style={{
                  fontSize: '10px',
                  color: textFaint,
                  fontWeight: 500,
                }}
              >
                {card.subValue}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* ==========================================
          ANIMATIONS + MOBILE RESPONSIVE
      ========================================== */}
      <style>{`
        @keyframes floatIcon {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }

        @media (max-width: 480px) {
          .status-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 8px !important;
          }
          .status-item {
            padding: 12px 4px !important;
          }
          .status-icon {
            font-size: 20px !important;
          }
          .status-label {
            font-size: 9px !important;
          }
          .status-value {
            font-size: 12px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default StatusCards;