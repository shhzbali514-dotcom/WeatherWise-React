// ==========================================
// FORECAST PAGE - FULLY FUNCTIONAL
// UPGRADED: Charts + Hourly + World Cities + UV + Sunrise/Sunset
// ==========================================

import React, { useState, useMemo } from 'react';
import { useWeather } from '../context/WeatherContext';
import { useSettings } from '../context/SettingsContext';
import {
  formatTemp,
  getWeatherIcon,
  getWeatherCategory,
  formatTime,
} from '../utils/helpers';
import { getWeatherIconFromCode } from '../services/weatherApi';
import {
  isPakistaniCity,
  getCityCountry,
} from '../data/cities';

// Components
import WeatherBackground from '../components/WeatherBackground';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SearchOverlay from '../components/SearchOverlay';
import Loader from '../components/Loader';

// ==========================================
// MAIN COMPONENT
// ==========================================
const Forecast = () => {
  const { weatherData, loading, error, currentCity, retryFetch } =
    useWeather();
  const { unit, toggleUnit, theme } = useSettings();
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('7day');
  const [activeDay, setActiveDay] = useState(0);

  const condition = weatherData?.condition || 'Sunny';

  // ==========================================
  // LOCATION LABEL (Pakistan / World)
  // ==========================================
  const locationLabel = useMemo(() => {
    if (!currentCity) return 'Unknown';

    const isPak = isPakistaniCity(currentCity);
    const country = getCityCountry(currentCity);

    if (isPak) return `${currentCity}, Pakistan`;
    if (country && country !== 'Unknown')
      return `${currentCity}, ${country}`;
    return currentCity;
  }, [currentCity]);

  // ==========================================
  // FORECAST DATA
  // ==========================================
  const dailyData = weatherData?.dailyData;
  const hourlyData = weatherData?.hourlyData;

  const dates = dailyData?.time || [];
  const tempsMax = dailyData?.temperature_2m_max || [];
  const tempsMin = dailyData?.temperature_2m_min || [];
  const codes = dailyData?.weather_code || [];
  const precip = dailyData?.precipitation_sum || [];
  const windMax = dailyData?.wind_speed_10m_max || [];
  const uvMax = dailyData?.uv_index_max || [];
  const sunrises = dailyData?.sunrise || [];
  const sunsets = dailyData?.sunset || [];

  // ==========================================
  // THEME COLORS
  // ==========================================
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
  const itemBg =
    theme === 'dark'
      ? 'rgba(255,255,255,0.03)'
      : 'rgba(0,0,0,0.02)';
  const itemBgHover =
    theme === 'dark'
      ? 'rgba(255,255,255,0.06)'
      : 'rgba(0,0,0,0.04)';
  const dividerColor =
    theme === 'dark'
      ? 'rgba(255,255,255,0.04)'
      : 'rgba(0,0,0,0.04)';

  // ==========================================
  // HELPER: Date format
  // ==========================================
  const formatDayName = (dateStr, index) => {
    if (index === 0) return 'Today';
    if (index === 1) return 'Tomorrow';
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  // ==========================================
  // RENDER FORECAST DAYS
  // ==========================================
  const renderForecastDays = (count) => {
    const maxCount = Math.min(count, dates.length);
    const items = [];

    for (let i = 0; i < maxCount; i++) {
      const dayName = formatDayName(dates[i], i);
      const highTemp = tempsMax[i];
      const lowTemp = tempsMin[i];
      const code = codes[i] ?? 0;
      const cond = getWeatherCategory(code, '');
      const icon = getWeatherIconFromCode(code, true);
      const precipVal = precip[i] ?? 0;
      const windVal = windMax[i] ?? null;
      const uvVal = uvMax[i] ?? null;
      const isActive = i === activeDay;

      items.push(
        <div
          key={i}
          className="forecast-day"
          onClick={() => setActiveDay(i)}
          style={{
            padding: 'clamp(12px, 2.5vw, 16px)',
            borderRadius: '16px',
            background: isActive
              ? theme === 'dark'
                ? 'rgba(99,102,241,0.15)'
                : 'rgba(99,102,241,0.08)'
              : itemBg,
            border: isActive
              ? '1px solid rgba(99,102,241,0.3)'
              : '1px solid transparent',
            textAlign: 'center',
            transition: 'all 0.3s ease',
            cursor: 'pointer',
            position: 'relative',
          }}
          onMouseEnter={(e) => {
            if (!isActive)
              e.currentTarget.style.background = itemBgHover;
          }}
          onMouseLeave={(e) => {
            if (!isActive)
              e.currentTarget.style.background = itemBg;
          }}
        >
          {/* Day Name */}
          <div
            className="day-name"
            style={{
              fontWeight: 600,
              fontSize: 'clamp(11px, 2vw, 13px)',
              color: isActive ? '#a5b4fc' : textPrimary,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {dayName}
          </div>

          {/* Icon */}
          <div
            className="day-icon"
            style={{
              fontSize: 'clamp(24px, 5vw, 32px)',
              margin: '8px 0',
              lineHeight: 1,
            }}
          >
            {icon}
          </div>

          {/* High */}
          <div
            className="day-temp-high"
            style={{
              fontWeight: 700,
              fontSize: 'clamp(15px, 3vw, 18px)',
              color: isActive
                ? '#818cf8'
                : theme === 'dark'
                ? '#fcd34d'
                : '#d97706',
            }}
          >
            {formatTemp(highTemp, unit)}
          </div>

          {/* Low */}
          <div
            className="day-temp-low"
            style={{
              color: textFaint,
              fontSize: 'clamp(11px, 2vw, 13px)',
              fontWeight: 500,
            }}
          >
            {formatTemp(lowTemp, unit)}
          </div>

          {/* Precipitation */}
          {precipVal > 0 && (
            <div
              style={{
                fontSize: 'clamp(9px, 1.8vw, 11px)',
                color: '#60a5fa',
                marginTop: '4px',
                fontWeight: 600,
              }}
            >
              💧 {precipVal.toFixed(1)} mm
            </div>
          )}

          {/* UV badge */}
          {uvVal !== null && uvVal >= 8 && (
            <div
              style={{
                position: 'absolute',
                top: '6px',
                right: '6px',
                fontSize: '9px',
                fontWeight: 700,
                padding: '2px 6px',
                borderRadius: '9999px',
                background:
                  uvVal >= 11 ? '#ef4444' : '#f97316',
                color: '#fff',
                letterSpacing: '0.3px',
              }}
            >
              UV
            </div>
          )}
        </div>
      );
    }

    return items;
  };

  // ==========================================
  // TEMPERATURE CHART (SVG - No library)
  // ==========================================
  const TemperatureChart = () => {
    const data = tempsMax.slice(0, activeTab === '7day' ? 7 : 15);
    const minData = tempsMin.slice(0, activeTab === '7day' ? 7 : 15);

    if (data.length === 0) return null;

    const allTemps = [...data, ...minData].filter(
      (t) => t !== null && t !== undefined
    );
    const maxTemp = Math.max(...allTemps);
    const minTemp = Math.min(...allTemps);
    const range = maxTemp - minTemp || 1;

    const width = 600;
    const height = 180;
    const padding = { top: 20, right: 20, bottom: 30, left: 40 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    // Generate paths
    const maxPoints = data.map((temp, i) => {
      const x =
        padding.left + (i / Math.max(data.length - 1, 1)) * chartW;
      const y =
        padding.top +
        chartH -
        ((temp - minTemp) / range) * chartH;
      return { x, y, temp };
    });

    const minPoints = minData.map((temp, i) => {
      const x =
        padding.left + (i / Math.max(minData.length - 1, 1)) * chartW;
      const y =
        padding.top +
        chartH -
        ((temp - minTemp) / range) * chartH;
      return { x, y, temp };
    });

    const maxPath = maxPoints
      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
      .join(' ');

    const minPath = minPoints
      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
      .join(' ');

    const areaPath =
      maxPath +
      ' ' +
      minPoints
        .slice()
        .reverse()
        .map((p) => `L ${p.x} ${p.y}`)
        .join(' ') +
      ' Z';

    return (
      <div
        className="temperature-chart"
        style={{
          padding: 'clamp(16px, 3vw, 20px)',
          borderRadius: '16px',
          background: itemBg,
          marginBottom: '24px',
          overflowX: 'auto',
        }}
      >
        <h3
          style={{
            fontSize: 'clamp(13px, 2vw, 15px)',
            fontWeight: 600,
            margin: '0 0 16px 0',
            color: textPrimary,
          }}
        >
          📈 Temperature Trend
        </h3>

        <svg
          viewBox={`0 0 ${width} ${height}`}
          style={{
            width: '100%',
            height: 'auto',
            maxHeight: '200px',
            display: 'block',
          }}
        >
          {/* Gradient */}
          <defs>
            <linearGradient
              id="tempGradient"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop
                offset="0%"
                stopColor="#6366f1"
                stopOpacity="0.4"
              />
              <stop
                offset="100%"
                stopColor="#6366f1"
                stopOpacity="0"
              />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((p, i) => (
            <line
              key={i}
              x1={padding.left}
              y1={padding.top + chartH * p}
              x2={width - padding.right}
              y2={padding.top + chartH * p}
              stroke={
                theme === 'dark'
                  ? 'rgba(255,255,255,0.05)'
                  : 'rgba(0,0,0,0.05)'
              }
              strokeWidth="1"
            />
          ))}

          {/* Area */}
          <path
            d={areaPath}
            fill="url(#tempGradient)"
          />

          {/* Max line */}
          <path
            d={maxPath}
            fill="none"
            stroke="#f59e0b"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Min line */}
          <path
            d={minPath}
            fill="none"
            stroke="#60a5fa"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Points (max) */}
          {maxPoints.map((p, i) => (
            <g key={`max-${i}`}>
              <circle
                cx={p.x}
                cy={p.y}
                r="4"
                fill="#f59e0b"
                stroke={
                  theme === 'dark' ? '#1a1a2e' : '#ffffff'
                }
                strokeWidth="2"
              />
              <text
                x={p.x}
                y={p.y - 10}
                textAnchor="middle"
                fontSize="10"
                fontWeight="700"
                fill="#f59e0b"
              >
                {Math.round(p.temp)}°
              </text>
            </g>
          ))}

          {/* Points (min) */}
          {minPoints.map((p, i) => (
            <g key={`min-${i}`}>
              <circle
                cx={p.x}
                cy={p.y}
                r="3"
                fill="#60a5fa"
                stroke={
                  theme === 'dark' ? '#1a1a2e' : '#ffffff'
                }
                strokeWidth="2"
              />
            </g>
          ))}
        </svg>

        {/* Legend */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '20px',
            marginTop: '12px',
            fontSize: '11px',
            color: textMuted,
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span
              style={{
                width: '12px',
                height: '3px',
                background: '#f59e0b',
                borderRadius: '9999px',
                display: 'inline-block',
              }}
            />
            High
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span
              style={{
                width: '12px',
                height: '3px',
                background: '#60a5fa',
                borderRadius: '9999px',
                display: 'inline-block',
              }}
            />
            Low
          </span>
        </div>
      </div>
    );
  };

  // ==========================================
  // HOURLY FORECAST (Next 24 hours)
  // ==========================================
  const HourlyForecast = () => {
    if (!hourlyData || !hourlyData.time) return null;

    const now = new Date();
    const currentHour = now.getHours();

    const items = hourlyData.time
      .map((time, i) => ({
        time,
        hour: new Date(time).getHours(),
        date: new Date(time),
        temp: hourlyData.temperature_2m?.[i],
        code: hourlyData.weather_code?.[i],
        precip: hourlyData.precipitation?.[i],
        wind: hourlyData.wind_speed_10m?.[i],
      }))
      .filter((h) => h.hour >= currentHour)
      .slice(0, 24);

    if (items.length === 0) return null;

    return (
      <div
        className="hourly-forecast"
        style={{
          padding: 'clamp(16px, 3vw, 20px)',
          borderRadius: '16px',
          background: itemBg,
          marginBottom: '24px',
        }}
      >
        <h3
          style={{
            fontSize: 'clamp(13px, 2vw, 15px)',
            fontWeight: 600,
            margin: '0 0 16px 0',
            color: textPrimary,
          }}
        >
          🕐 Next 24 Hours
        </h3>

        <div
          style={{
            display: 'flex',
            gap: '12px',
            overflowX: 'auto',
            paddingBottom: '8px',
          }}
        >
          {items.map((item, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px',
                minWidth: '60px',
                padding: '10px 8px',
                borderRadius: '12px',
                background:
                  theme === 'dark'
                    ? 'rgba(255,255,255,0.03)'
                    : 'rgba(0,0,0,0.02)',
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  fontSize: '10px',
                  color: textFaint,
                  fontWeight: 600,
                }}
              >
                {item.hour === currentHour
                  ? 'Now'
                  : `${item.hour}:00`}
              </span>
              <span style={{ fontSize: '20px', lineHeight: 1 }}>
                {getWeatherIconFromCode(item.code, true)}
              </span>
              <span
                style={{
                  fontSize: '13px',
                  fontWeight: 700,
                  color: textPrimary,
                }}
              >
                {formatTemp(item.temp, unit)}
              </span>
              {item.precip > 0 && (
                <span
                  style={{
                    fontSize: '9px',
                    color: '#60a5fa',
                    fontWeight: 600,
                  }}
                >
                  {item.precip.toFixed(1)}mm
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ==========================================
  // ACTIVE DAY DETAILS
  // ==========================================
  const ActiveDayDetails = () => {
    if (!dates[activeDay]) return null;

    const code = codes[activeDay] ?? 0;
    const uvVal = uvMax[activeDay];
    const windVal = windMax[activeDay];
    const precipVal = precip[activeDay];
    const sunrise = sunrises[activeDay];
    const sunset = sunsets[activeDay];

    const uvLabel = (uv) => {
      if (uv === null || uv === undefined) return '--';
      if (uv <= 2) return 'Low';
      if (uv <= 5) return 'Moderate';
      if (uv <= 7) return 'High';
      if (uv <= 10) return 'Very High';
      return 'Extreme';
    };

    return (
      <div
        className="active-day-details"
        style={{
          padding: 'clamp(16px, 3vw, 20px)',
          borderRadius: '16px',
          background: itemBg,
          marginBottom: '24px',
          border: `1px solid ${dividerColor}`,
        }}
      >
        <h3
          style={{
            fontSize: 'clamp(13px, 2vw, 15px)',
            fontWeight: 600,
            margin: '0 0 16px 0',
            color: textPrimary,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span>{getWeatherIconFromCode(code, true)}</span>
          <span>
            {activeDay === 0
              ? 'Today'
              : activeDay === 1
              ? 'Tomorrow'
              : new Date(dates[activeDay]).toLocaleDateString(
                  'en-US',
                  {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                  }
                )}
          </span>
        </h3>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fill, minmax(120px, 1fr))',
            gap: '12px',
          }}
        >
          {/* Temp Range */}
          <div
            style={{
              padding: '12px',
              borderRadius: '12px',
              background:
                theme === 'dark'
                  ? 'rgba(255,255,255,0.03)'
                  : 'rgba(0,0,0,0.02)',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontSize: '10px',
                color: textFaint,
                textTransform: 'uppercase',
                letterSpacing: '0.4px',
                fontWeight: 600,
              }}
            >
              🌡️ Temp Range
            </div>
            <div
              style={{
                fontSize: '15px',
                fontWeight: 700,
                color: textPrimary,
                marginTop: '4px',
              }}
            >
              {formatTemp(tempsMin[activeDay], unit)} –{' '}
              {formatTemp(tempsMax[activeDay], unit)}
            </div>
          </div>

          {/* Precipitation */}
          <div
            style={{
              padding: '12px',
              borderRadius: '12px',
              background:
                theme === 'dark'
                  ? 'rgba(255,255,255,0.03)'
                  : 'rgba(0,0,0,0.02)',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontSize: '10px',
                color: textFaint,
                textTransform: 'uppercase',
                letterSpacing: '0.4px',
                fontWeight: 600,
              }}
            >
              💧 Rain
            </div>
            <div
              style={{
                fontSize: '15px',
                fontWeight: 700,
                color: '#60a5fa',
                marginTop: '4px',
              }}
            >
              {precipVal !== null && precipVal !== undefined
                ? `${precipVal.toFixed(1)} mm`
                : '--'}
            </div>
          </div>

          {/* Wind */}
          <div
            style={{
              padding: '12px',
              borderRadius: '12px',
              background:
                theme === 'dark'
                  ? 'rgba(255,255,255,0.03)'
                  : 'rgba(0,0,0,0.02)',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontSize: '10px',
                color: textFaint,
                textTransform: 'uppercase',
                letterSpacing: '0.4px',
                fontWeight: 600,
              }}
            >
              💨 Wind
            </div>
            <div
              style={{
                fontSize: '15px',
                fontWeight: 700,
                color: '#60a5fa',
                marginTop: '4px',
              }}
            >
              {windVal !== null && windVal !== undefined
                ? `${Math.round(windVal)} km/h`
                : '--'}
            </div>
          </div>

          {/* UV */}
          <div
            style={{
              padding: '12px',
              borderRadius: '12px',
              background:
                theme === 'dark'
                  ? 'rgba(255,255,255,0.03)'
                  : 'rgba(0,0,0,0.02)',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontSize: '10px',
                color: textFaint,
                textTransform: 'uppercase',
                letterSpacing: '0.4px',
                fontWeight: 600,
              }}
            >
              ☀️ UV
            </div>
            <div
              style={{
                fontSize: '15px',
                fontWeight: 700,
                color:
                  uvVal >= 8
                    ? '#ef4444'
                    : uvVal >= 5
                    ? '#f59e0b'
                    : textPrimary,
                marginTop: '4px',
              }}
            >
              {uvLabel(uvVal)}
            </div>
          </div>

          {/* Sunrise */}
          <div
            style={{
              padding: '12px',
              borderRadius: '12px',
              background:
                theme === 'dark'
                  ? 'rgba(255,255,255,0.03)'
                  : 'rgba(0,0,0,0.02)',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontSize: '10px',
                color: textFaint,
                textTransform: 'uppercase',
                letterSpacing: '0.4px',
                fontWeight: 600,
              }}
            >
              🌅 Sunrise
            </div>
            <div
              style={{
                fontSize: '15px',
                fontWeight: 700,
                color: '#fbbf24',
                marginTop: '4px',
              }}
            >
              {sunrise ? formatTime(sunrise) : '--'}
            </div>
          </div>

          {/* Sunset */}
          <div
            style={{
              padding: '12px',
              borderRadius: '12px',
              background:
                theme === 'dark'
                  ? 'rgba(255,255,255,0.03)'
                  : 'rgba(0,0,0,0.02)',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontSize: '10px',
                color: textFaint,
                textTransform: 'uppercase',
                letterSpacing: '0.4px',
                fontWeight: 600,
              }}
            >
              🌇 Sunset
            </div>
            <div
              style={{
                fontSize: '15px',
                fontWeight: 700,
                color: '#f97316',
                marginTop: '4px',
              }}
            >
              {sunset ? formatTime(sunset) : '--'}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ==========================================
  // RENDER
  // ==========================================
  return (
    <>
      <WeatherBackground condition={condition} />
      <SearchOverlay
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
      />

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

        <main
          className="page-content"
          style={{ padding: 'clamp(10px, 2vw, 20px) 0' }}
        >
          {/* ==========================================
              PAGE HEADER
          ========================================== */}
          <div
            className="page-header"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 'clamp(16px, 3vw, 30px)',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div style={{ minWidth: 0 }}>
              <h1
                style={{
                  fontSize: 'clamp(20px, 4vw, 28px)',
                  fontWeight: 700,
                  letterSpacing: '-0.5px',
                  margin: 0,
                  color: textPrimary,
                }}
              >
                📊 Extended Forecast
              </h1>
              <p
                style={{
                  color: textMuted,
                  fontSize: 'clamp(12px, 2vw, 14px)',
                  marginTop: '4px',
                  marginBottom: 0,
                }}
              >
                📍 {locationLabel}
              </p>
            </div>

            <button
              className="btn-outline"
              onClick={toggleUnit}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding:
                  'clamp(8px, 2vw, 10px) clamp(16px, 3vw, 24px)',
                borderRadius: '9999px',
                background: 'transparent',
                border: `1px solid ${
                  theme === 'dark'
                    ? 'rgba(255,255,255,0.1)'
                    : 'rgba(0,0,0,0.1)'
                }`,
                color: textMuted,
                fontWeight: 500,
                fontSize: 'clamp(12px, 2vw, 14px)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            >
              Switch to {unit === 'celsius' ? '°F' : '°C'}
            </button>
          </div>

          {/* ==========================================
              TABS
          ========================================== */}
          <div
            className="forecast-tabs"
            style={{
              display: 'flex',
              gap: '8px',
              marginBottom: 'clamp(16px, 3vw, 24px)',
              flexWrap: 'wrap',
            }}
          >
            {['7day', '15day', 'hourly'].map((tab) => (
              <button
                key={tab}
                className={`tab-btn ${
                  activeTab === tab ? 'active' : ''
                }`}
                onClick={() => {
                  setActiveTab(tab);
                  setActiveDay(0);
                }}
                style={{
                  flex: '1 1 auto',
                  minWidth: '80px',
                  padding:
                    'clamp(8px, 2vw, 10px) clamp(12px, 2.5vw, 24px)',
                  borderRadius: '9999px',
                  background:
                    activeTab === tab
                      ? '#6366f1'
                      : theme === 'dark'
                      ? 'rgba(255,255,255,0.04)'
                      : 'rgba(0,0,0,0.04)',
                  border:
                    activeTab === tab
                      ? '1px solid #6366f1'
                      : `1px solid ${
                          theme === 'dark'
                            ? 'rgba(255,255,255,0.06)'
                            : 'rgba(0,0,0,0.06)'
                        }`,
                  color:
                    activeTab === tab ? '#fff' : textMuted,
                  fontWeight: 500,
                  fontSize: 'clamp(12px, 2vw, 14px)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  textAlign: 'center',
                }}
              >
                {tab === '7day'
                  ? '7-Day'
                  : tab === '15day'
                  ? '15-Day'
                  : 'Hourly'}
              </button>
            ))}
          </div>

          {/* ==========================================
              CONTENT
          ========================================== */}
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
              {/* ==========================================
                  TEMPERATURE CHART (Only 7/15 day)
              ========================================== */}
              {activeTab !== 'hourly' && <TemperatureChart />}

              {/* ==========================================
                  ACTIVE DAY DETAILS (Only 7/15 day)
              ========================================== */}
              {activeTab !== 'hourly' && <ActiveDayDetails />}

              {/* ==========================================
                  FORECAST GRID (7/15 day)
              ========================================== */}
              {activeTab !== 'hourly' && (
                <div
                  className="forecast-grid"
                  style={{
                    display: 'grid',
                    gridTemplateColumns:
                      'repeat(auto-fill, minmax(min(100%, 120px), 1fr))',
                    gap: 'clamp(8px, 2vw, 12px)',
                    marginBottom: '24px',
                  }}
                >
                  {activeTab === '7day' && renderForecastDays(7)}
                  {activeTab === '15day' && renderForecastDays(15)}
                </div>
              )}

              {/* ==========================================
                  HOURLY FORECAST
              ========================================== */}
              {activeTab === 'hourly' && <HourlyForecast />}

              {/* ==========================================
                  HIGHLIGHTS (Only 7/15 day)
              ========================================== */}
              {activeTab !== 'hourly' && (
                <div
                  className="highlights-grid"
                  style={{
                    display: 'grid',
                    gridTemplateColumns:
                      'repeat(auto-fill, minmax(min(100%, 140px), 1fr))',
                    gap: 'clamp(8px, 2vw, 12px)',
                  }}
                >
                  {[
                    {
                      label: '🌡️ High',
                      value: formatTemp(
                        weatherData?.high,
                        unit
                      ),
                      color: '#fcd34d',
                    },
                    {
                      label: '🌡️ Low',
                      value: formatTemp(
                        weatherData?.low,
                        unit
                      ),
                      color: '#60a5fa',
                    },
                    {
                      label: '💧 Humidity',
                      value:
                        weatherData?.humidity !== null &&
                        weatherData?.humidity !== undefined
                          ? `${Math.round(weatherData.humidity)}%`
                          : '--',
                      color: '#60a5fa',
                    },
                    {
                      label: '💨 Wind',
                      value:
                        weatherData?.windSpeed !== null &&
                        weatherData?.windSpeed !== undefined
                          ? `${Math.round(
                              weatherData.windSpeed
                            )} km/h`
                          : '--',
                      color: '#60a5fa',
                    },
                  ].map((hl, i) => (
                    <div
                      key={i}
                      className="highlight-item"
                      style={{
                        padding: 'clamp(12px, 2.5vw, 16px)',
                        borderRadius: '12px',
                        background: itemBg,
                        textAlign: 'center',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <span
                        className="highlight-label"
                        style={{
                          fontSize: 'clamp(10px, 1.8vw, 12px)',
                          color: textFaint,
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: '0.3px',
                        }}
                      >
                        {hl.label}
                      </span>
                      <span
                        className="highlight-value"
                        style={{
                          fontSize: 'clamp(16px, 3vw, 20px)',
                          fontWeight: 700,
                          display: 'block',
                          marginTop: '4px',
                          color: hl.color,
                        }}
                      >
                        {hl.value}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Forecast;