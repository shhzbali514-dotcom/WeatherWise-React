// ==========================================
// HOURLY PAGE - FULLY FUNCTIONAL
// UPGRADED: Real data + Date Picker + All hourly details
// ==========================================

import React, { useState, useMemo } from 'react';
import { useWeather } from '../context/WeatherContext';
import { useSettings } from '../context/SettingsContext';
import {
  formatTemp,
  formatTime,
  getWeatherCategory,
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
const Hourly = () => {
  const { weatherData, loading, error, currentCity, retryFetch } =
    useWeather();
  const { unit, theme } = useSettings();
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeHour, setActiveHour] = useState(0);
  const [selectedDayOffset, setSelectedDayOffset] = useState(0);

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
  const cardBg =
    theme === 'dark'
      ? 'rgba(255,255,255,0.05)'
      : 'rgba(255,255,255,0.5)';
  const cardBorder =
    theme === 'dark'
      ? '1px solid rgba(255,255,255,0.08)'
      : '1px solid rgba(0,0,0,0.04)';
  const borderFaint =
    theme === 'dark'
      ? '1px solid rgba(255,255,255,0.06)'
      : '1px solid rgba(0,0,0,0.06)';

  // ==========================================
  // HOURLY DATA PROCESSING
  // ==========================================
  const hourlyData = weatherData?.hourlyData;

  const hourlyItems = useMemo(() => {
    if (!hourlyData || !hourlyData.time) return [];

    const now = new Date();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Selected date
    const selectedDate = new Date(today);
    selectedDate.setDate(selectedDate.getDate() + selectedDayOffset);

    const nextDay = new Date(selectedDate);
    nextDay.setDate(nextDay.getDate() + 1);

    const items = [];

    for (let i = 0; i < hourlyData.time.length; i++) {
      const timeStr = hourlyData.time[i];
      const date = new Date(timeStr);

      // Filter: selected day ke hours
      if (date >= selectedDate && date < nextDay) {
        const temp = hourlyData.temperature_2m?.[i];
        const code = hourlyData.weather_code?.[i];
        const precip = hourlyData.precipitation?.[i];
        const wind = hourlyData.wind_speed_10m?.[i];
        const humidity = hourlyData.relative_humidity_2m?.[i];
        const feelsLike = hourlyData.apparent_temperature?.[i];
        const cond = getWeatherCategory(code, '');
        const isNow =
          selectedDayOffset === 0 &&
          date.getHours() === now.getHours();

        items.push({
          index: i,
          time: date,
          hour: date.getHours(),
          temp,
          code,
          precip,
          wind,
          humidity,
          feelsLike,
          cond,
          isNow,
        });
      }
    }

    return items;
  }, [hourlyData, selectedDayOffset]);

  // ==========================================
  // STATS
  // ==========================================
  const stats = useMemo(() => {
    if (hourlyItems.length === 0) {
      return {
        maxTemp: null,
        minTemp: null,
        maxTime: null,
        minTime: null,
        maxWind: null,
        maxHumidity: null,
        totalPrecip: 0,
      };
    }

    let maxTemp = -Infinity;
    let minTemp = Infinity;
    let maxTime = null;
    let minTime = null;
    let maxWind = 0;
    let maxHumidity = 0;
    let totalPrecip = 0;

    hourlyItems.forEach((item) => {
      if (item.temp !== null && item.temp !== undefined) {
        if (item.temp > maxTemp) {
          maxTemp = item.temp;
          maxTime = item.time;
        }
        if (item.temp < minTemp) {
          minTemp = item.temp;
          minTime = item.time;
        }
      }
      if (item.wind !== null && item.wind > maxWind) {
        maxWind = item.wind;
      }
      if (
        item.humidity !== null &&
        item.humidity > maxHumidity
      ) {
        maxHumidity = item.humidity;
      }
      if (item.precip !== null && item.precip !== undefined) {
        totalPrecip += item.precip;
      }
    });

    return {
      maxTemp: maxTemp === -Infinity ? null : maxTemp,
      minTemp: minTemp === Infinity ? null : minTemp,
      maxTime,
      minTime,
      maxWind,
      maxHumidity,
      totalPrecip,
    };
  }, [hourlyItems]);

  // ==========================================
  // SELECTED DATE DISPLAY
  // ==========================================
  const selectedDateDisplay = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + selectedDayOffset);

    if (selectedDayOffset === 0) return 'Today';
    if (selectedDayOffset === 1) return 'Tomorrow';
    if (selectedDayOffset === -1) return 'Yesterday';

    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  }, [selectedDayOffset]);

  // ==========================================
  // HANDLERS
  // ==========================================
  const handleDayChange = (offset) => {
    setSelectedDayOffset(offset);
    setActiveHour(0);
  };

  const activeItem =
    hourlyItems[activeHour] || hourlyItems[0] || null;

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
                🕐 Hourly Forecast
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

            {/* Date Selector */}
            <div
              className="date-selector"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'clamp(6px, 1.5vw, 12px)',
              }}
            >
              <button
                onClick={() => handleDayChange(selectedDayOffset - 1)}
                className="date-nav-btn"
                style={{
                  width: 'clamp(32px, 6vw, 36px)',
                  height: 'clamp(32px, 6vw, 36px)',
                  borderRadius: '50%',
                  background: itemBg,
                  border: borderFaint,
                  fontSize: 'clamp(13px, 2.5vw, 16px)',
                  cursor: 'pointer',
                  color: textPrimary,
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = itemBgHover)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = itemBg)
                }
              >
                ←
              </button>
              <span
                style={{
                  fontWeight: 600,
                  fontSize: 'clamp(11px, 2vw, 14px)',
                  minWidth: 'clamp(80px, 12vw, 100px)',
                  textAlign: 'center',
                  color: textPrimary,
                }}
              >
                {selectedDateDisplay}
              </span>
              <button
                onClick={() => handleDayChange(selectedDayOffset + 1)}
                className="date-nav-btn"
                style={{
                  width: 'clamp(32px, 6vw, 36px)',
                  height: 'clamp(32px, 6vw, 36px)',
                  borderRadius: '50%',
                  background: itemBg,
                  border: borderFaint,
                  fontSize: 'clamp(13px, 2.5vw, 16px)',
                  cursor: 'pointer',
                  color: textPrimary,
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = itemBgHover)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = itemBg)
                }
              >
                →
              </button>
            </div>
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
                background: cardBg,
                backdropFilter: 'blur(20px)',
                border: cardBorder,
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
          ) : hourlyItems.length === 0 ? (
            <div
              className="glass-card"
              style={{
                background: cardBg,
                backdropFilter: 'blur(20px)',
                border: cardBorder,
                borderRadius: '16px',
                padding: 'clamp(24px, 4vw, 40px)',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>
                📅
              </div>
              <p
                style={{
                  color: textMuted,
                  fontSize: '14px',
                  margin: 0,
                }}
              >
                No hourly data available for {selectedDateDisplay}
              </p>
            </div>
          ) : (
            <>
              {/* ==========================================
                  HOURLY SCROLL
              ========================================== */}
              <div
                className="glass-card"
                style={{
                  background: cardBg,
                  backdropFilter: 'blur(20px)',
                  border: cardBorder,
                  borderRadius: '16px',
                  padding: 'clamp(12px, 3vw, 24px)',
                  marginBottom: '20px',
                  transition: 'all 0.4s ease',
                }}
              >
                <div
                  className="hourly-scroll-container"
                  style={{
                    overflowX: 'auto',
                    padding: '4px 0',
                    WebkitOverflowScrolling: 'touch',
                  }}
                >
                  <div
                    className="hourly-scroll"
                    style={{
                      display: 'flex',
                      gap: 'clamp(8px, 2vw, 12px)',
                      minWidth: 'max-content',
                      padding: '8px 4px',
                    }}
                  >
                    {hourlyItems.map((item, idx) => {
                      const isActive = idx === activeHour;
                      const icon = getWeatherIconFromCode(
                        item.code,
                        item.hour >= 6 && item.hour < 18
                      );

                      return (
                        <div
                          key={item.index}
                          className={`hourly-item-scroll ${
                            isActive ? 'active' : ''
                          }`}
                          onClick={() => setActiveHour(idx)}
                          style={{
                            flex: '0 0 clamp(64px, 14vw, 80px)',
                            textAlign: 'center',
                            padding:
                              'clamp(10px, 2vw, 14px) clamp(6px, 1.5vw, 10px)',
                            borderRadius: '12px',
                            background: isActive
                              ? 'rgba(99,102,241,0.15)'
                              : itemBg,
                            border: isActive
                              ? '1px solid #6366f1'
                              : borderFaint,
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            position: 'relative',
                          }}
                          onMouseEnter={(e) => {
                            if (!isActive)
                              e.currentTarget.style.background =
                                itemBgHover;
                          }}
                          onMouseLeave={(e) => {
                            if (!isActive)
                              e.currentTarget.style.background =
                                itemBg;
                          }}
                        >
                          {/* Now indicator */}
                          {item.isNow && (
                            <div
                              style={{
                                position: 'absolute',
                                top: '-6px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                fontSize: '8px',
                                fontWeight: 700,
                                padding: '2px 6px',
                                borderRadius: '9999px',
                                background: '#10b981',
                                color: '#fff',
                                letterSpacing: '0.3px',
                              }}
                            >
                              NOW
                            </div>
                          )}

                          <div
                            className="hour-time"
                            style={{
                              fontSize: 'clamp(10px, 1.8vw, 12px)',
                              color: isActive
                                ? '#a5b4fc'
                                : textFaint,
                              fontWeight: 600,
                            }}
                          >
                            {formatTime(item.time)}
                          </div>
                          <span
                            className="hour-icon"
                            style={{
                              fontSize: 'clamp(22px, 5vw, 28px)',
                              margin: '6px 0',
                              display: 'block',
                              lineHeight: 1,
                            }}
                          >
                            {icon}
                          </span>
                          <div
                            className="hour-temp"
                            style={{
                              fontWeight: 700,
                              fontSize: 'clamp(13px, 2.5vw, 16px)',
                              color: isActive
                                ? '#818cf8'
                                : textPrimary,
                            }}
                          >
                            {formatTemp(item.temp, unit)}
                          </div>
                          {/* Precipitation */}
                          {item.precip > 0 && (
                            <div
                              style={{
                                fontSize: '9px',
                                color: '#60a5fa',
                                fontWeight: 600,
                                marginTop: '2px',
                              }}
                            >
                              💧 {item.precip.toFixed(1)}mm
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* ==========================================
                  ACTIVE HOUR DETAILS
              ========================================== */}
              {activeItem && (
                <div
                  className="active-hour-card"
                  style={{
                    padding: 'clamp(16px, 3vw, 24px)',
                    borderRadius: '16px',
                    background: cardBg,
                    backdropFilter: 'blur(20px)',
                    border: cardBorder,
                    marginBottom: '20px',
                    transition: 'all 0.4s ease',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      marginBottom: '16px',
                      flexWrap: 'wrap',
                    }}
                  >
                    <span style={{ fontSize: '36px', lineHeight: 1 }}>
                      {getWeatherIconFromCode(
                        activeItem.code,
                        activeItem.hour >= 6 &&
                          activeItem.hour < 18
                      )}
                    </span>
                    <div>
                      <div
                        style={{
                          fontSize: 'clamp(14px, 2.5vw, 16px)',
                          fontWeight: 700,
                          color: textPrimary,
                        }}
                      >
                        {formatTime(activeItem.time)} —{' '}
                        {activeItem.cond}
                      </div>
                      <div
                        style={{
                          fontSize: 'clamp(11px, 2vw, 13px)',
                          color: textMuted,
                        }}
                      >
                        {activeItem.temp !== null
                          ? `Feels like ${formatTemp(
                              activeItem.feelsLike,
                              unit
                            )}`
                          : 'No data'}
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fill, minmax(110px, 1fr))',
                      gap: '10px',
                    }}
                  >
                    {/* Temp */}
                    <div
                      style={{
                        padding: '10px',
                        borderRadius: '10px',
                        background: itemBg,
                        textAlign: 'center',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '10px',
                          color: textFaint,
                          textTransform: 'uppercase',
                          fontWeight: 600,
                          letterSpacing: '0.3px',
                        }}
                      >
                        🌡️ Temp
                      </div>
                      <div
                        style={{
                          fontSize: '15px',
                          fontWeight: 700,
                          color: textPrimary,
                          marginTop: '2px',
                        }}
                      >
                        {formatTemp(activeItem.temp, unit)}
                      </div>
                    </div>

                    {/* Wind */}
                    <div
                      style={{
                        padding: '10px',
                        borderRadius: '10px',
                        background: itemBg,
                        textAlign: 'center',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '10px',
                          color: textFaint,
                          textTransform: 'uppercase',
                          fontWeight: 600,
                          letterSpacing: '0.3px',
                        }}
                      >
                        💨 Wind
                      </div>
                      <div
                        style={{
                          fontSize: '15px',
                          fontWeight: 700,
                          color: '#60a5fa',
                          marginTop: '2px',
                        }}
                      >
                        {activeItem.wind !== null
                          ? `${Math.round(activeItem.wind)} km/h`
                          : '--'}
                      </div>
                    </div>

                    {/* Humidity */}
                    <div
                      style={{
                        padding: '10px',
                        borderRadius: '10px',
                        background: itemBg,
                        textAlign: 'center',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '10px',
                          color: textFaint,
                          textTransform: 'uppercase',
                          fontWeight: 600,
                          letterSpacing: '0.3px',
                        }}
                      >
                        💧 Humidity
                      </div>
                      <div
                        style={{
                          fontSize: '15px',
                          fontWeight: 700,
                          color: '#38bdf8',
                          marginTop: '2px',
                        }}
                      >
                        {activeItem.humidity !== null
                          ? `${Math.round(activeItem.humidity)}%`
                          : '--'}
                      </div>
                    </div>

                    {/* Precipitation */}
                    <div
                      style={{
                        padding: '10px',
                        borderRadius: '10px',
                        background: itemBg,
                        textAlign: 'center',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '10px',
                          color: textFaint,
                          textTransform: 'uppercase',
                          fontWeight: 600,
                          letterSpacing: '0.3px',
                        }}
                      >
                        🌧️ Rain
                      </div>
                      <div
                        style={{
                          fontSize: '15px',
                          fontWeight: 700,
                          color: '#60a5fa',
                          marginTop: '2px',
                        }}
                      >
                        {activeItem.precip !== null &&
                        activeItem.precip !== undefined
                          ? `${activeItem.precip.toFixed(1)} mm`
                          : '0 mm'}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ==========================================
                  HOURLY DETAILS GRID (Next 8 hours)
              ========================================== */}
              <div
                className="hourly-details-grid"
                style={{
                  display: 'grid',
                  gridTemplateColumns:
                    'repeat(auto-fill, minmax(min(100%, 140px), 1fr))',
                  gap: 'clamp(8px, 2vw, 12px)',
                  marginBottom: '20px',
                }}
              >
                {hourlyItems.slice(0, 8).map((item, idx) => (
                  <div
                    key={item.index}
                    className="hourly-detail-card"
                    onClick={() => setActiveHour(idx)}
                    style={{
                      padding: 'clamp(12px, 2.5vw, 16px)',
                      borderRadius: '12px',
                      background: itemBg,
                      border: borderFaint,
                      textAlign: 'center',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = itemBgHover;
                      e.currentTarget.style.transform =
                        'translateY(-3px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = itemBg;
                      e.currentTarget.style.transform =
                        'translateY(0)';
                    }}
                  >
                    <span
                      className="detail-time"
                      style={{
                        fontSize: 'clamp(10px, 1.8vw, 12px)',
                        color: textFaint,
                        fontWeight: 600,
                      }}
                    >
                      {formatTime(item.time)}
                    </span>
                    <span
                      className="detail-icon"
                      style={{
                        fontSize: 'clamp(24px, 5vw, 32px)',
                        display: 'block',
                        marginBottom: '4px',
                        lineHeight: 1,
                      }}
                    >
                      {getWeatherIconFromCode(
                        item.code,
                        item.hour >= 6 && item.hour < 18
                      )}
                    </span>
                    <span
                      className="detail-temp"
                      style={{
                        fontSize: 'clamp(20px, 4vw, 26px)',
                        fontWeight: 700,
                        display: 'block',
                        margin: '4px 0',
                        color: textPrimary,
                      }}
                    >
                      {formatTemp(item.temp, unit)}
                    </span>
                    <div
                      className="detail-desc"
                      style={{
                        fontSize: 'clamp(11px, 2vw, 13px)',
                        color: textMuted,
                      }}
                    >
                      {item.cond}
                    </div>
                  </div>
                ))}
              </div>

              {/* ==========================================
                  STATS GRID
              ========================================== */}
              <div
                className="hourly-stats-grid"
                style={{
                  display: 'grid',
                  gridTemplateColumns:
                    'repeat(auto-fit, minmax(min(100%, 160px), 1fr))',
                  gap: 'clamp(8px, 2vw, 12px)',
                }}
              >
                {/* Hottest */}
                <div
                  className="glass-card stat-highlight"
                  style={{
                    padding: 'clamp(12px, 2.5vw, 16px)',
                    textAlign: 'center',
                    background: cardBg,
                    backdropFilter: 'blur(20px)',
                    border: cardBorder,
                    borderRadius: '16px',
                    transition: 'all 0.4s ease',
                  }}
                >
                  <span
                    className="stat-label"
                    style={{
                      fontSize: 'clamp(10px, 1.8vw, 12px)',
                      color: textFaint,
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.3px',
                    }}
                  >
                    🌡️ Hottest Hour
                  </span>
                  <span
                    className="stat-value"
                    style={{
                      fontSize: 'clamp(16px, 3vw, 22px)',
                      fontWeight: 700,
                      display: 'block',
                      margin: '4px 0',
                      color: '#fcd34d',
                    }}
                  >
                    {stats.maxTime
                      ? formatTime(stats.maxTime)
                      : '--'}
                  </span>
                  <span
                    className="stat-sub"
                    style={{
                      fontSize: 'clamp(11px, 2vw, 13px)',
                      color: textMuted,
                    }}
                  >
                    {stats.maxTemp !== null
                      ? formatTemp(stats.maxTemp, unit)
                      : '--'}
                  </span>
                </div>

                {/* Coldest */}
                <div
                  className="glass-card stat-highlight"
                  style={{
                    padding: 'clamp(12px, 2.5vw, 16px)',
                    textAlign: 'center',
                    background: cardBg,
                    backdropFilter: 'blur(20px)',
                    border: cardBorder,
                    borderRadius: '16px',
                    transition: 'all 0.4s ease',
                  }}
                >
                  <span
                    className="stat-label"
                    style={{
                      fontSize: 'clamp(10px, 1.8vw, 12px)',
                      color: textFaint,
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.3px',
                    }}
                  >
                    ❄️ Coldest Hour
                  </span>
                  <span
                    className="stat-value"
                    style={{
                      fontSize: 'clamp(16px, 3vw, 22px)',
                      fontWeight: 700,
                      display: 'block',
                      margin: '4px 0',
                      color: '#60a5fa',
                    }}
                  >
                    {stats.minTime
                      ? formatTime(stats.minTime)
                      : '--'}
                  </span>
                  <span
                    className="stat-sub"
                    style={{
                      fontSize: 'clamp(11px, 2vw, 13px)',
                      color: textMuted,
                    }}
                  >
                    {stats.minTemp !== null
                      ? formatTemp(stats.minTemp, unit)
                      : '--'}
                  </span>
                </div>

                {/* Highest Wind */}
                <div
                  className="glass-card stat-highlight"
                  style={{
                    padding: 'clamp(12px, 2.5vw, 16px)',
                    textAlign: 'center',
                    background: cardBg,
                    backdropFilter: 'blur(20px)',
                    border: cardBorder,
                    borderRadius: '16px',
                    transition: 'all 0.4s ease',
                  }}
                >
                  <span
                    className="stat-label"
                    style={{
                      fontSize: 'clamp(10px, 1.8vw, 12px)',
                      color: textFaint,
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.3px',
                    }}
                  >
                    💨 Max Wind
                  </span>
                  <span
                    className="stat-value"
                    style={{
                      fontSize: 'clamp(16px, 3vw, 22px)',
                      fontWeight: 700,
                      display: 'block',
                      margin: '4px 0',
                      color: '#60a5fa',
                    }}
                  >
                    {stats.maxWind !== null
                      ? `${Math.round(stats.maxWind)} km/h`
                      : '--'}
                  </span>
                  <span
                    className="stat-sub"
                    style={{
                      fontSize: 'clamp(11px, 2vw, 13px)',
                      color: textMuted,
                    }}
                  >
                    Peak
                  </span>
                </div>

                {/* Total Precipitation */}
                <div
                  className="glass-card stat-highlight"
                  style={{
                    padding: 'clamp(12px, 2.5vw, 16px)',
                    textAlign: 'center',
                    background: cardBg,
                    backdropFilter: 'blur(20px)',
                    border: cardBorder,
                    borderRadius: '16px',
                    transition: 'all 0.4s ease',
                  }}
                >
                  <span
                    className="stat-label"
                    style={{
                      fontSize: 'clamp(10px, 1.8vw, 12px)',
                      color: textFaint,
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.3px',
                    }}
                  >
                    🌧️ Total Rain
                  </span>
                  <span
                    className="stat-value"
                    style={{
                      fontSize: 'clamp(16px, 3vw, 22px)',
                      fontWeight: 700,
                      display: 'block',
                      margin: '4px 0',
                      color: '#38bdf8',
                    }}
                  >
                    {stats.totalPrecip > 0
                      ? `${stats.totalPrecip.toFixed(1)} mm`
                      : '0 mm'}
                  </span>
                  <span
                    className="stat-sub"
                    style={{
                      fontSize: 'clamp(11px, 2vw, 13px)',
                      color: textMuted,
                    }}
                  >
                    Day Total
                  </span>
                </div>
              </div>
            </>
          )}
        </main>

        <Footer />
      </div>

      {/* ==========================================
          SCROLLBAR STYLING
      ========================================== */}
      <style>{`
        .hourly-scroll-container::-webkit-scrollbar {
          height: 6px;
        }
        .hourly-scroll-container::-webkit-scrollbar-track {
          background: transparent;
        }
        .hourly-scroll-container::-webkit-scrollbar-thumb {
          background: ${
            theme === 'dark'
              ? 'rgba(255,255,255,0.1)'
              : 'rgba(0,0,0,0.1)'
          };
          border-radius: 9999px;
        }
        .hourly-scroll-container::-webkit-scrollbar-thumb:hover {
          background: ${
            theme === 'dark'
              ? 'rgba(255,255,255,0.2)'
              : 'rgba(0,0,0,0.2)'
          };
        }
      `}</style>
    </>
  );
};

export default Hourly;