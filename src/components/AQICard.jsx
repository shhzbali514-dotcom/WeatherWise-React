// ==========================================
// AQI CARD COMPONENT
// UPGRADED: Progress Bar + Health Advice + More Pollutants
// ==========================================

import React from 'react';
import { useWeather } from '../context/WeatherContext';
import { useSettings } from '../context/SettingsContext';
import { getAQILevel } from '../utils/helpers';

const AQICard = () => {
  const { aqiData } = useWeather();
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

  const textPrimary = theme === 'dark' ? '#ffffff' : '#1a1a2e';
  const textMuted =
    theme === 'dark'
      ? 'rgba(255,255,255,0.4)'
      : 'rgba(0,0,0,0.4)';
  const textFaint =
    theme === 'dark'
      ? 'rgba(255,255,255,0.3)'
      : 'rgba(0,0,0,0.35)';

  const dividerColor =
    theme === 'dark'
      ? 'rgba(255,255,255,0.03)'
      : 'rgba(0,0,0,0.04)';

  // ==========================================
  // LOADING / UNAVAILABLE STATE
  // ==========================================
  if (!aqiData || !aqiData.current) {
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
            🌍 Air Quality
          </h3>
          <span
            className="badge"
            style={{
              padding: '4px 12px',
              borderRadius: '9999px',
              fontSize: '12px',
              fontWeight: 600,
              background: '#6b7280',
              color: '#fff',
            }}
          >
            Unavailable
          </span>
        </div>
        <p
          style={{
            color: textFaint,
            textAlign: 'center',
            margin: 0,
            fontSize: '13px',
          }}
        >
          AQI data not available for this location
        </p>
      </div>
    );
  }

  // ==========================================
  // DATA EXTRACTION
  // ==========================================
  const current = aqiData.current;
  const aqi = current.us_aqi ?? null;
  const pm25 = current.pm2_5 ?? null;
  const pm10 = current.pm10 ?? null;
  const o3 = current.ozone ?? null;
  const no2 = current.nitrogen_dioxide ?? null;
  const so2 = current.sulphur_dioxide ?? null;
  const co = current.carbon_monoxide ?? null;

  const level =
    aqi !== null
      ? getAQILevel(aqi)
      : { label: 'Unknown', color: '#6b7280' };

  // ==========================================
  // AQI PROGRESS (0-500 → 0-100%)
  // ==========================================
  const aqiPercent =
    aqi !== null ? Math.min((aqi / 500) * 100, 100) : 0;

  // ==========================================
  // HEALTH ADVICE
  // ==========================================
  const getHealthAdvice = (aqiValue) => {
    if (aqiValue === null) return 'No data available.';
    if (aqiValue <= 50)
      return 'Air quality is good. Perfect for outdoor activities.';
    if (aqiValue <= 100)
      return 'Air quality is acceptable. Sensitive individuals should be cautious.';
    if (aqiValue <= 150)
      return 'Sensitive groups should limit outdoor activities.';
    if (aqiValue <= 200)
      return 'Everyone should reduce outdoor activities. Wear a mask.';
    if (aqiValue <= 300)
      return 'Health alert! Avoid outdoor activities. Use air purifier.';
    return 'Hazardous! Stay indoors. Emergency conditions.';
  };

  // ==========================================
  // POLLUTANTS LIST
  // ==========================================
  const pollutants = [
    {
      label: 'PM2.5',
      value: pm25,
      unit: 'μg/m³',
    },
    {
      label: 'PM10',
      value: pm10,
      unit: 'μg/m³',
    },
    {
      label: 'O₃',
      value: o3,
      unit: 'μg/m³',
    },
    {
      label: 'NO₂',
      value: no2,
      unit: 'μg/m³',
    },
    {
      label: 'SO₂',
      value: so2,
      unit: 'μg/m³',
    },
    {
      label: 'CO',
      value: co,
      unit: 'μg/m³',
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
          🌍 Air Quality
        </h3>
        <span
          className="badge"
          style={{
            padding: '4px 12px',
            borderRadius: '9999px',
            fontSize: '12px',
            fontWeight: 600,
            background: level.color,
            color: '#fff',
            whiteSpace: 'nowrap',
          }}
        >
          {level.label}
        </span>
      </div>

      {/* AQI Main Display */}
      <div
        className="aqi-display"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          marginBottom: '16px',
          flexWrap: 'wrap',
        }}
      >
        <div
          className="aqi-value-display"
          style={{
            textAlign: 'center',
            flexShrink: 0,
          }}
        >
          <span
            className="aqi-number"
            style={{
              fontSize: 'clamp(28px, 5vw, 36px)',
              fontWeight: 700,
              display: 'block',
              color: level.color,
              lineHeight: 1,
              transition: 'color 0.3s ease',
            }}
          >
            {aqi !== null ? Math.round(aqi) : '--'}
          </span>
          <span
            className="aqi-label"
            style={{
              fontSize: '12px',
              color: textFaint,
              fontWeight: 600,
              letterSpacing: '0.5px',
            }}
          >
            AQI
          </span>
        </div>

        {/* Progress Bar */}
        <div style={{ flex: 1, minWidth: '150px' }}>
          <div
            style={{
              height: '8px',
              borderRadius: '9999px',
              background:
                theme === 'dark'
                  ? 'rgba(255,255,255,0.05)'
                  : 'rgba(0,0,0,0.05)',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <div
              style={{
                width: `${aqiPercent}%`,
                height: '100%',
                background: level.color,
                borderRadius: '9999px',
                transition: 'width 0.8s ease, background 0.3s ease',
              }}
            />
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '6px',
              fontSize: '10px',
              color: textFaint,
            }}
          >
            <span>0</span>
            <span>100</span>
            <span>200</span>
            <span>300</span>
            <span>500</span>
          </div>
        </div>
      </div>

      {/* Health Advice */}
      <div
        style={{
          padding: '10px 14px',
          borderRadius: '10px',
          background:
            theme === 'dark'
              ? 'rgba(255,255,255,0.03)'
              : 'rgba(0,0,0,0.02)',
          border: `1px solid ${dividerColor}`,
          marginBottom: '16px',
          fontSize: '12px',
          lineHeight: 1.5,
          color: textMuted,
        }}
      >
        <span style={{ marginRight: '6px' }}>💡</span>
        {getHealthAdvice(aqi)}
      </div>

      {/* Pollutants List */}
      <div
        className="aqi-details"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '4px 16px',
        }}
      >
        {pollutants.map((p) => (
          <div
            key={p.label}
            className="pollutant-item"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '13px',
              padding: '6px 0',
              borderBottom: `1px solid ${dividerColor}`,
            }}
          >
            <span style={{ color: textMuted }}>{p.label}</span>
            <span
              style={{
                fontWeight: 600,
                color: textPrimary,
              }}
            >
              {p.value !== null && p.value !== undefined
                ? `${Math.round(p.value)}`
                : '--'}
              {p.value !== null && p.value !== undefined && (
                <span
                  style={{
                    fontSize: '10px',
                    color: textFaint,
                    marginLeft: '2px',
                  }}
                >
                  {p.unit}
                </span>
              )}
            </span>
          </div>
        ))}
      </div>

      {/* ==========================================
          MOBILE RESPONSIVE
      ========================================== */}
      <style>{`
        @media (max-width: 480px) {
          .aqi-display {
            gap: 12px !important;
          }
          .aqi-details {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AQICard;