// ==========================================
// WEATHER STATS COMPONENT
// UPGRADED: UV Index + AQI + Wind Direction + Light Theme
// ==========================================

import React from 'react';
import { useWeather } from '../context/WeatherContext';
import { useSettings } from '../context/SettingsContext';
import { formatTime } from '../utils/helpers';

const WeatherStats = () => {
  const { weatherData, aqiData } = useWeather();
  const { unit, theme } = useSettings();

  // ==========================================
  // LOADING STATE
  // ==========================================
  if (!weatherData) {
    return (
      <div
        className="stats-row"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '12px',
          padding: '16px 0',
          borderTop:
            theme === 'dark'
              ? '1px solid rgba(255,255,255,0.04)'
              : '1px solid rgba(0,0,0,0.04)',
          borderBottom:
            theme === 'dark'
              ? '1px solid rgba(255,255,255,0.04)'
              : '1px solid rgba(0,0,0,0.04)',
          marginBottom: '16px',
        }}
      >
        <p
          style={{
            color:
              theme === 'dark'
                ? 'rgba(255,255,255,0.3)'
                : 'rgba(0,0,0,0.3)',
            textAlign: 'center',
            gridColumn: '1 / -1',
            margin: 0,
          }}
        >
          Loading stats...
        </p>
      </div>
    );
  }

  // ==========================================
  // HELPER: Format AQI
  // ==========================================
  const getAQIDisplay = () => {
    if (!aqiData?.current?.us_aqi) return '--';
    const aqi = Math.round(aqiData.current.us_aqi);
    return `${aqi}`;
  };

  const getAQIColor = () => {
    if (!aqiData?.current?.us_aqi) return null;
    const aqi = aqiData.current.us_aqi;
    if (aqi <= 50) return '#10b981';
    if (aqi <= 100) return '#f59e0b';
    if (aqi <= 150) return '#f97316';
    if (aqi <= 200) return '#ef4444';
    if (aqi <= 300) return '#7c3aed';
    return '#dc2626';
  };

  // ==========================================
  // HELPER: Format UV Index
  // ==========================================
  const getUVLabel = (uv) => {
    if (uv === null || uv === undefined) return '';
    if (uv <= 2) return 'Low';
    if (uv <= 5) return 'Moderate';
    if (uv <= 7) return 'High';
    if (uv <= 10) return 'Very High';
    return 'Extreme';
  };

  const getUVColor = (uv) => {
    if (uv === null || uv === undefined) return null;
    if (uv <= 2) return '#10b981';
    if (uv <= 5) return '#f59e0b';
    if (uv <= 7) return '#f97316';
    if (uv <= 10) return '#ef4444';
    return '#7c3aed';
  };

  // ==========================================
  // STATS ARRAY
  // ==========================================
  const stats = [
    {
      id: 'humidity',
      label: '💧 Humidity',
      value:
        weatherData.humidity !== null &&
        weatherData.humidity !== undefined
          ? `${Math.round(weatherData.humidity)}%`
          : '--',
    },
    {
      id: 'wind',
      label: '💨 Wind',
      value:
        weatherData.windSpeed !== null &&
        weatherData.windSpeed !== undefined
          ? `${Math.round(weatherData.windSpeed)} km/h`
          : '--',
    },
    {
      id: 'pressure',
      label: '📊 Pressure',
      value:
        weatherData.pressure !== null &&
        weatherData.pressure !== undefined
          ? `${Math.round(weatherData.pressure)} mb`
          : '--',
    },
    {
      id: 'visibility',
      label: '👁️ Visibility',
      value:
        weatherData.visibility !== null &&
        weatherData.visibility !== undefined
          ? `${(weatherData.visibility / 1000).toFixed(1)} km`
          : '--',
    },
    {
      id: 'uv',
      label: '☀️ UV Index',
      value:
        weatherData.uvIndex !== null &&
        weatherData.uvIndex !== undefined
          ? `${Math.round(weatherData.uvIndex)} ${getUVLabel(
              weatherData.uvIndex
            )}`
          : '--',
      color: getUVColor(weatherData.uvIndex),
    },
    {
      id: 'aqi',
      label: '🌫️ AQI',
      value: getAQIDisplay(),
      color: getAQIColor(),
    },
    {
      id: 'sunrise',
      label: '🌅 Sunrise',
      value: weatherData.sunrise
        ? formatTime(weatherData.sunrise)
        : '--',
    },
    {
      id: 'sunset',
      label: '🌇 Sunset',
      value: weatherData.sunset
        ? formatTime(weatherData.sunset)
        : '--',
    },
    {
      id: 'feelsLike',
      label: '🌡️ Feels Like',
      value:
        weatherData.feelsLike !== null &&
        weatherData.feelsLike !== undefined
          ? `${Math.round(weatherData.feelsLike)}°`
          : '--',
    },
  ];

  // ==========================================
  // THEME COLORS
  // ==========================================
  const borderColor =
    theme === 'dark'
      ? 'rgba(255,255,255,0.04)'
      : 'rgba(0,0,0,0.04)';

  const labelColor =
    theme === 'dark'
      ? 'rgba(255,255,255,0.3)'
      : 'rgba(0,0,0,0.4)';

  const valueColor =
    theme === 'dark' ? '#ffffff' : '#1a1a2e';

  // ==========================================
  // RENDER
  // ==========================================
  return (
    <div
      className="stats-row"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '12px',
        padding: '16px 0',
        borderTop: `1px solid ${borderColor}`,
        borderBottom: `1px solid ${borderColor}`,
        marginBottom: '16px',
      }}
    >
      {stats.map((stat) => (
        <div
          key={stat.id}
          className="stat-item"
          style={{
            display: 'flex',
            flexDirection: 'column',
            minWidth: 0,
          }}
        >
          <span
            className="stat-label"
            style={{
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              color: labelColor,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {stat.label}
          </span>
          <span
            className="stat-value"
            style={{
              fontSize: 'clamp(13px, 2vw, 16px)',
              fontWeight: 600,
              marginTop: '2px',
              color: stat.color || valueColor,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              transition: 'color 0.3s ease',
            }}
          >
            {stat.value}
          </span>
        </div>
      ))}

      {/* ==========================================
          MOBILE RESPONSIVE
      ========================================== */}
      <style>{`
        @media (max-width: 480px) {
          .stats-row {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 10px !important;
          }
          .stat-label {
            font-size: 10px !important;
          }
          .stat-value {
            font-size: 13px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default WeatherStats;