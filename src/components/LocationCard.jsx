// ==========================================
// LOCATION CARD COMPONENT
// FULLY FIXED: Pakistan = 1 time, Abroad = 2 times
// ==========================================

import React, { useState, useEffect, useMemo } from 'react';
import { useWeather } from '../context/WeatherContext';
import { useSettings } from '../context/SettingsContext';
import {
  formatTemp,
  formatDate,
  getProvinceFromCity,
  getWeatherIcon,
} from '../utils/helpers';
import { getCityCountry, isPakistaniCity } from '../data/cities';
import {
  getTimeInTimezone,
  getDateInTimezone,
} from '../services/weatherApi';

const LocationCard = () => {
  const { weatherData, currentCity, currentCoords, locationDetected } =
    useWeather();
  const { unit, theme } = useSettings();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Live clock — har second update
  useEffect(() => {
    const interval = setInterval(
      () => setCurrentTime(new Date()),
      1000
    );
    return () => clearInterval(interval);
  }, []);

  // ==========================================
  // LOCATION INFO — DIRECT CALL (No useMemo)
  // ==========================================
  const isPak = isPakistaniCity(currentCity);
  const countryRaw = getCityCountry(currentCity);
  const country =
    countryRaw && countryRaw !== 'Unknown' ? countryRaw : '';

  // ==========================================
  // DEBUG — Console mein check karo
  // ==========================================
  useEffect(() => {
    if (weatherData && currentCity) {
      console.log('🔍 LocationCard:');
      console.log('   City:', currentCity);
      console.log('   isPak:', isPak);
      console.log('   Country:', country);
      console.log('   Timezone:', weatherData?.timezone);
      console.log('   Timezone Abbr:', weatherData?.timezoneAbbr);
      console.log('   UTC Offset:', weatherData?.utcOffset);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weatherData, currentCity]);

  // ==========================================
  // TIMEZONE — Extract from weatherData
  // ==========================================
  const cityTimezone = weatherData?.timezone || null;
  const cityTimezoneAbbr = weatherData?.timezoneAbbr || null;
  const cityUtcOffset = weatherData?.utcOffset ?? null;

  // ==========================================
  // PAKISTAN TIME (Always Asia/Karachi)
  // ==========================================
  const pakistanTimeStr = useMemo(() => {
    return getTimeInTimezone('Asia/Karachi', currentTime);
  }, [currentTime]);

  const pakistanDateStr = useMemo(() => {
    return getDateInTimezone('Asia/Karachi', currentTime);
  }, [currentTime]);

  // ==========================================
  // LOCAL TIME (City's timezone)
  // Only used for ABROAD cities
  // ==========================================
  const localTimeStr = useMemo(() => {
    // Method 1: IANA timezone (BEST)
    if (
      cityTimezone &&
      typeof cityTimezone === 'string' &&
      cityTimezone !== '' &&
      cityTimezone !== 'UTC' &&
      cityTimezone !== 'Asia/Karachi'
    ) {
      try {
        return currentTime.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
          timeZone: cityTimezone,
        });
      } catch (err) {
        console.warn('❌ Invalid timezone:', cityTimezone);
      }
    }

    // Method 2: UTC offset fallback
    if (
      cityUtcOffset !== null &&
      cityUtcOffset !== undefined &&
      cityUtcOffset !== 0
    ) {
      const utcMs =
        currentTime.getTime() +
        currentTime.getTimezoneOffset() * 60000;
      const localMs = utcMs + cityUtcOffset * 1000;
      const localDate = new Date(localMs);

      return localDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      });
    }

    // Method 3: Browser time
    return currentTime.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  }, [currentTime, cityTimezone, cityUtcOffset]);

  const localDateStr = useMemo(() => {
    if (
      cityTimezone &&
      typeof cityTimezone === 'string' &&
      cityTimezone !== '' &&
      cityTimezone !== 'UTC' &&
      cityTimezone !== 'Asia/Karachi'
    ) {
      try {
        return currentTime.toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          timeZone: cityTimezone,
        });
      } catch (err) {
        // fallback
      }
    }

    return formatDate();
  }, [currentTime, cityTimezone]);

  // ==========================================
  // LOADING STATE
  // ==========================================
  if (!weatherData) {
    return (
      <div
        className="glass-card location-card"
        style={{
          background:
            theme === 'dark'
              ? 'rgba(255,255,255,0.05)'
              : 'rgba(255,255,255,0.5)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border:
            theme === 'dark'
              ? '1px solid rgba(255,255,255,0.08)'
              : '1px solid rgba(0,0,0,0.04)',
          borderRadius: '16px',
          padding: '24px',
          transition: 'all 0.4s ease',
        }}
      >
        <p
          style={{
            color:
              theme === 'dark'
                ? 'rgba(255,255,255,0.4)'
                : 'rgba(0,0,0,0.4)',
            textAlign: 'center',
            margin: 0,
          }}
        >
          Loading weather data...
        </p>
      </div>
    );
  }

  // ==========================================
  // DATA EXTRACTION
  // ==========================================
  const temp = weatherData.temperature;
  const high = weatherData.high;
  const low = weatherData.low;
  const condition = weatherData.condition || 'Clear';
  const feelsLike =
    weatherData.feelsLike !== null &&
    weatherData.feelsLike !== undefined
      ? weatherData.feelsLike
      : temp - 2;

  // ==========================================
  // LOCATION SUBTITLE
  // ==========================================
  let locationSubtitle = '';
  if (isPak) {
    const province = getProvinceFromCity(currentCity);
    locationSubtitle = `Pakistan - ${province}`;
  } else if (country) {
    locationSubtitle = country;
  } else {
    locationSubtitle = 'Worldwide';
  }

  // Weather icon
  const weatherIcon = getWeatherIcon(condition);

  // ==========================================
  // THEME COLORS
  // ==========================================
  const textPrimary = theme === 'dark' ? '#ffffff' : '#1a1a2e';
  const textSecondary =
    theme === 'dark'
      ? 'rgba(255,255,255,0.6)'
      : 'rgba(0,0,0,0.5)';
  const textMuted =
    theme === 'dark'
      ? 'rgba(255,255,255,0.4)'
      : 'rgba(0,0,0,0.4)';
  const textFaint =
    theme === 'dark'
      ? 'rgba(255,255,255,0.3)'
      : 'rgba(0,0,0,0.3)';

  const gradientPrimary =
    theme === 'dark'
      ? 'linear-gradient(135deg, #fff 60%, rgba(255,255,255,0.5))'
      : 'linear-gradient(135deg, #1a1a2e 60%, rgba(26,26,46,0.5))';

  const gradientTemp =
    theme === 'dark'
      ? 'linear-gradient(135deg, #fff 50%, rgba(255,255,255,0.5))'
      : 'linear-gradient(135deg, #1a1a2e 50%, rgba(26,26,46,0.5))';

  const cardBg =
    theme === 'dark'
      ? 'rgba(255,255,255,0.05)'
      : 'rgba(255,255,255,0.5)';

  const cardBorder =
    theme === 'dark'
      ? '1px solid rgba(255,255,255,0.08)'
      : '1px solid rgba(0,0,0,0.04)';

  const badgeBg =
    theme === 'dark'
      ? 'rgba(255,255,255,0.05)'
      : 'rgba(0,0,0,0.04)';

  // ==========================================
  // STATUS DOT COLOR
  // ==========================================
  let dotColor = '#10b981';
  if (temp !== null && temp !== undefined) {
    if (temp > 35) dotColor = '#ef4444';
    else if (temp > 30) dotColor = '#f59e0b';
    else if (temp < 0) dotColor = '#3b82f6';
  }

  // ==========================================
  // RENDER
  // ==========================================
  return (
    <div
      className="glass-card location-card"
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
      {/* LOCATION TOP */}
      <div
        className="location-top"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '24px',
          gap: '12px',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ minWidth: 0, flex: 1 }}>
          {/* City Name */}
          <h1
            style={{
              fontSize: 'clamp(24px, 4vw, 32px)',
              fontWeight: 700,
              letterSpacing: '-0.5px',
              background: gradientPrimary,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              transition: 'none',
              margin: 0,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {currentCity || 'Unknown'}
          </h1>

          {/* Country/Province */}
          <p
            className="location-sub"
            style={{
              color: textSecondary,
              fontSize: '14px',
              marginTop: '2px',
              margin: 0,
            }}
          >
            {locationSubtitle}
          </p>

          {/* ==========================================
              CLOCK — Pakistan vs Abroad
          ========================================== */}
          <div
            className="realtime-clock"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              fontSize: '13px',
              color: textMuted,
              marginTop: '6px',
            }}
          >
            {isPak ? (
              // ✅ PAKISTAN CITY — Sirf 1 time (PKT)
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  flexWrap: 'wrap',
                }}
              >
                <span>🕐</span>
                <span
                  className="clock-time"
                  style={{
                    fontWeight: 600,
                    color: textSecondary,
                  }}
                >
                  {pakistanTimeStr}
                </span>
                <span style={{ fontSize: '12px' }}>
                  {pakistanDateStr}
                </span>
                <span
                  style={{
                    fontSize: '10px',
                    color: textFaint,
                    padding: '2px 8px',
                    background: 'rgba(99,102,241,0.1)',
                    borderRadius: '9999px',
                    fontWeight: 600,
                  }}
                >
                  PKT
                </span>
              </div>
            ) : (
              // ✅ ABROAD CITY — 2 times (PKT + Local)
              <>
                {/* Pakistan Time (Reference) */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    flexWrap: 'wrap',
                  }}
                >
                  <span>🇵🇰</span>
                  <span
                    style={{
                      fontWeight: 600,
                      color: textSecondary,
                    }}
                  >
                    {pakistanTimeStr}
                  </span>
                  <span style={{ fontSize: '11px' }}>
                    Pakistan
                  </span>
                  <span
                    style={{
                      fontSize: '9px',
                      color: textFaint,
                      padding: '1px 6px',
                      background: 'rgba(99,102,241,0.1)',
                      borderRadius: '9999px',
                      fontWeight: 600,
                    }}
                  >
                    PKT
                  </span>
                </div>

                {/* Local Time (City's time) */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    flexWrap: 'wrap',
                  }}
                >
                  <span>🌍</span>
                  <span
                    style={{
                      fontWeight: 600,
                      color: textSecondary,
                    }}
                  >
                    {localTimeStr}
                  </span>
                  <span style={{ fontSize: '11px' }}>
                    {country || 'Local'}
                  </span>
                  {cityTimezoneAbbr && (
                    <span
                      style={{
                        fontSize: '9px',
                        color: textFaint,
                        padding: '1px 6px',
                        background: 'rgba(16,185,129,0.1)',
                        borderRadius: '9999px',
                        fontWeight: 600,
                      }}
                    >
                      {cityTimezoneAbbr}
                    </span>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Location Detected Badge */}
          {locationDetected && (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '11px',
                color: '#10b981',
                marginTop: '6px',
                padding: '2px 8px',
                background: 'rgba(16,185,129,0.1)',
                borderRadius: '9999px',
                fontWeight: 600,
              }}
            >
              <span>📍</span>
              <span>Auto-detected</span>
            </div>
          )}
        </div>

        {/* Status Badge */}
        <div
          className="status-badge"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            background: badgeBg,
            borderRadius: '9999px',
            fontSize: '12px',
            fontWeight: 500,
            color: textSecondary,
            flexShrink: 0,
            whiteSpace: 'nowrap',
          }}
        >
          <span
            className="status-dot"
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: dotColor,
              animation: 'pulse-dot 2s ease-in-out infinite',
              flexShrink: 0,
            }}
          />
          <span>{condition}</span>
        </div>
      </div>

      {/* TEMPERATURE SECTION */}
      <div className="temp-section" style={{ marginBottom: '24px' }}>
        <div
          className="temp-main"
          style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: '20px',
            marginBottom: '8px',
            flexWrap: 'wrap',
          }}
        >
          <span
            className="temp-value"
            style={{
              fontSize: 'clamp(48px, 9vw, 72px)',
              fontWeight: 800,
              letterSpacing: '-3px',
              background: gradientTemp,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              cursor: 'pointer',
              lineHeight: 1,
              transition: 'transform 0.3s ease',
            }}
            title="Double-click to toggle °C / °F"
          >
            {formatTemp(temp, unit)}
          </span>

          <div
            className="temp-range"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '2px',
            }}
          >
            <span
              className="temp-high"
              style={{
                color: '#fcd34d',
                fontSize: '16px',
                fontWeight: 600,
              }}
            >
              ↑ {formatTemp(high, unit)}
            </span>
            <span
              className="temp-low"
              style={{
                color: textFaint,
                fontSize: '14px',
              }}
            >
              ↓ {formatTemp(low, unit)}
            </span>
          </div>

          <span
            style={{
              fontSize: 'clamp(36px, 7vw, 56px)',
              lineHeight: 1,
              marginLeft: 'auto',
              animation: 'float-icon 4s ease-in-out infinite',
            }}
          >
            {weatherIcon}
          </span>
        </div>

        <div
          className="temp-desc"
          style={{
            color: textMuted,
            fontSize: '13px',
            lineHeight: 1.6,
          }}
        >
          <p style={{ margin: 0 }}>{condition} conditions</p>
          <p
            style={{
              color: textSecondary,
              fontWeight: 500,
              marginTop: '4px',
              margin: 0,
            }}
          >
            🌡️ Feels like {formatTemp(feelsLike, unit)} |{' '}
            {condition}
          </p>
        </div>
      </div>

      {/* ANIMATIONS */}
      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }
        @keyframes float-icon {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        .temp-value:hover { transform: scale(1.03); }
        @media (max-width: 480px) {
          .location-card { padding: 16px !important; }
          .location-top { margin-bottom: 16px !important; }
          .temp-section { margin-bottom: 16px !important; }
        }
      `}</style>
    </div>
  );
};

export default LocationCard;