// ==========================================
// WEEKLY FORECAST COMPONENT
// UPGRADED: World cities + Active day details + Light theme
// ==========================================

import React, { useState } from 'react';
import { useWeather } from '../context/WeatherContext';
import { useSettings } from '../context/SettingsContext';
import { formatTemp, getWeatherIcon } from '../utils/helpers';
import { getWeatherIconFromCode } from '../services/weatherApi';
import { isPakistaniCity, getCityCountry } from '../data/cities';

// ==========================================
// HELPER: Weather category from code
// ==========================================
const getWeatherCategoryFromCode = (code) => {
  const numCode = Number(code);
  if (numCode >= 95) return 'Thunderstorm';
  if (
    (numCode >= 71 && numCode <= 77) ||
    numCode === 85 ||
    numCode === 86
  )
    return 'Snowy';
  if (
    (numCode >= 51 && numCode <= 67) ||
    (numCode >= 80 && numCode <= 82)
  )
    return 'Rainy';
  if (numCode >= 45 && numCode <= 48) return 'Foggy';
  if (numCode === 1 || numCode === 2 || numCode === 3)
    return 'Cloudy';
  if (numCode === 0) return 'Sunny';
  return 'Sunny';
};

// ==========================================
// HELPER: Get day name from date string
// ==========================================
const getDayName = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { weekday: 'short' });
};

// ==========================================
// MAIN COMPONENT
// ==========================================
const WeeklyForecast = () => {
  const { weatherData, currentCity } = useWeather();
  const { unit, theme } = useSettings();
  const [activeDay, setActiveDay] = useState(0);

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

  const textPrimary = theme === 'dark' ? '#ffffff' : '#1a1a2e';
  const textMuted =
    theme === 'dark'
      ? 'rgba(255,255,255,0.4)'
      : 'rgba(0,0,0,0.4)';
  const textFaint =
    theme === 'dark'
      ? 'rgba(255,255,255,0.3)'
      : 'rgba(0,0,0,0.35)';

  const itemBg =
    theme === 'dark'
      ? 'rgba(255,255,255,0.02)'
      : 'rgba(0,0,0,0.02)';

  const activeBg =
    theme === 'dark'
      ? 'rgba(99,102,241,0.15)'
      : 'rgba(99,102,241,0.08)';

  const activeBorder =
    theme === 'dark'
      ? '1px solid rgba(99,102,241,0.3)'
      : '1px solid rgba(99,102,241,0.2)';

  const dividerColor =
    theme === 'dark'
      ? 'rgba(255,255,255,0.04)'
      : 'rgba(0,0,0,0.04)';

  // ==========================================
  // LOADING STATE
  // ==========================================
  if (!weatherData || !weatherData.dailyData) {
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
          No forecast data available
        </p>
      </div>
    );
  }

  // ==========================================
  // DATA EXTRACTION
  // ==========================================
  const dailyData = weatherData.dailyData;
  const dates = dailyData.time || [];
  const tempsMax = dailyData.temperature_2m_max || [];
  const tempsMin = dailyData.temperature_2m_min || [];
  const weatherCodes = dailyData.weather_code || [];
  const precipitations = dailyData.precipitation_sum || [];
  const windSpeeds = dailyData.wind_speed_10m_max || [];

  // ==========================================
  // LOCATION DISPLAY — Pakistan / World
  // ==========================================
  const isPak = isPakistaniCity(currentCity);
  const country = getCityCountry(currentCity);
  const locationLabel = isPak
    ? `${currentCity}, Pakistan`
    : country && country !== 'Unknown'
    ? `${currentCity}, ${country}`
    : currentCity || 'Unknown';

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
        padding: '24px',
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
          📅 7-Day Forecast
        </h3>
        <a
          href="/forecast"
          className="see-all"
          style={{
            color: textFaint,
            fontSize: '13px',
            transition: 'color 0.3s ease',
            textDecoration: 'none',
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.color = '#818cf8')
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = textFaint)
          }
        >
          See All →
        </a>
      </div>

      {/* 7-Day Grid */}
      <div
        className="weekly-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '8px',
          marginBottom: '16px',
        }}
      >
        {dates.slice(0, 7).map((dateStr, index) => {
          const high = tempsMax[index];
          const low = tempsMin[index];
          const code = weatherCodes[index];
          const precipitation = precipitations[index];
          const wind = windSpeeds[index];

          const condition = getWeatherCategoryFromCode(code);
          const icon = getWeatherIconFromCode(
            code,
            true // day icon
          );
          const isActive = index === activeDay;
          const isToday = index === 0;

          return (
            <div
              key={index}
              className={`week-item ${isActive ? 'active' : ''}`}
              onClick={() => setActiveDay(index)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '12px 6px',
                borderRadius: '12px',
                background: isActive ? activeBg : itemBg,
                border: isActive ? activeBorder : '1px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                position: 'relative',
              }}
            >
              {/* Today Badge */}
              {isToday && (
                <span
                  style={{
                    position: 'absolute',
                    top: '4px',
                    right: '6px',
                    fontSize: '8px',
                    fontWeight: 700,
                    color: '#818cf8',
                    letterSpacing: '0.3px',
                  }}
                >
                  TODAY
                </span>
              )}

              {/* Day Name */}
              <span
                className="week-day"
                style={{
                  fontSize: '11px',
                  color: isActive ? '#a5b4fc' : textMuted,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                {getDayName(dateStr)}
              </span>

              {/* Icon */}
              <span
                style={{
                  fontSize: '22px',
                  display: 'block',
                  margin: '6px 0',
                  lineHeight: 1,
                }}
              >
                {icon}
              </span>

              {/* High Temp */}
              <span
                className="week-temp"
                style={{
                  fontSize: 'clamp(14px, 2.2vw, 17px)',
                  fontWeight: 700,
                  marginTop: '2px',
                  color: isActive
                    ? '#818cf8'
                    : textPrimary,
                  transition: 'color 0.3s ease',
                }}
              >
                {formatTemp(high, unit)}
              </span>

              {/* Low Temp */}
              <span
                style={{
                  fontSize: '11px',
                  color: textFaint,
                  fontWeight: 500,
                }}
              >
                {formatTemp(low, unit)}
              </span>
            </div>
          );
        })}
      </div>

      {/* Active Day Details */}
      {dates[activeDay] && (
        <div
          className="active-day-details"
          style={{
            paddingTop: '12px',
            borderTop: `1px solid ${dividerColor}`,
            marginBottom: '12px',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '2px',
            }}
          >
            <span style={{ fontSize: '14px' }}>💧</span>
            <span
              style={{
                fontSize: '10px',
                color: textFaint,
                textTransform: 'uppercase',
                letterSpacing: '0.3px',
              }}
            >
              Rain
            </span>
            <span
              style={{
                fontSize: '13px',
                fontWeight: 600,
                color: textPrimary,
              }}
            >
              {precipitations[activeDay] !== null &&
              precipitations[activeDay] !== undefined
                ? `${precipitations[activeDay].toFixed(1)} mm`
                : '--'}
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '2px',
            }}
          >
            <span style={{ fontSize: '14px' }}>💨</span>
            <span
              style={{
                fontSize: '10px',
                color: textFaint,
                textTransform: 'uppercase',
                letterSpacing: '0.3px',
              }}
            >
              Wind
            </span>
            <span
              style={{
                fontSize: '13px',
                fontWeight: 600,
                color: textPrimary,
              }}
            >
              {windSpeeds[activeDay] !== null &&
              windSpeeds[activeDay] !== undefined
                ? `${Math.round(windSpeeds[activeDay])} km/h`
                : '--'}
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '2px',
            }}
          >
            <span style={{ fontSize: '14px' }}>🌡️</span>
            <span
              style={{
                fontSize: '10px',
                color: textFaint,
                textTransform: 'uppercase',
                letterSpacing: '0.3px',
              }}
            >
              Range
            </span>
            <span
              style={{
                fontSize: '13px',
                fontWeight: 600,
                color: textPrimary,
              }}
            >
              {tempsMin[activeDay] !== null &&
              tempsMax[activeDay] !== null
                ? `${Math.round(
                    tempsMin[activeDay]
                  )}° – ${Math.round(tempsMax[activeDay])}°`
                : '--'}
            </span>
          </div>
        </div>
      )}

      {/* Location */}
      <div
        className="week-location"
        style={{
          paddingTop: '12px',
          borderTop: `1px solid ${dividerColor}`,
          color: textFaint,
          fontSize: '12px',
          textAlign: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '4px',
        }}
      >
        <span>📍</span>
        <span>{locationLabel}</span>
      </div>

      {/* ==========================================
          MOBILE RESPONSIVE
      ========================================== */}
      <style>{`
        @media (max-width: 768px) {
          .weekly-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
        @media (max-width: 480px) {
          .weekly-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 6px !important;
          }
          .week-item {
            padding: 10px 4px !important;
          }
          .active-day-details {
            gap: 8px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default WeeklyForecast;