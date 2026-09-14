// ==========================================
// RECENT SEARCHES COMPONENT
// UPGRADED: Live weather for each city
// FIXED: Duplicate (==) issue
// ==========================================

import React, { useEffect, useState, useMemo } from 'react';
import { useWeather } from '../context/WeatherContext';
import { useSettings } from '../context/SettingsContext';
import { formatTemp, getWeatherIcon } from '../utils/helpers';
import { getCityCoordinates } from '../data/cities';
import { getWeatherIconFromCode } from '../services/weatherApi';

const RecentSearches = () => {
  const {
    recentSearches,
    weatherData,
    selectCity,
    selectCityByCoords,
    clearRecentSearches,
    removeRecentSearch,
  } = useWeather();

  const { unit, theme } = useSettings();

  const [cityWeather, setCityWeather] = useState({});
  const [loadingWeather, setLoadingWeather] = useState({});

  // ==========================================
  // DEDUPLICATE — FIXES "==" ISSUE
  // ==========================================
  const uniqueRecentSearches = useMemo(() => {
    if (!Array.isArray(recentSearches)) return [];

    const seen = new Set();
    const result = [];

    recentSearches.forEach((item) => {
      const cityName =
        typeof item === 'string' ? item : item?.name || item?.city;

      if (!cityName) return;

      const key = cityName.toLowerCase().trim();
      if (seen.has(key)) return;

      seen.add(key);
      result.push({
        name: cityName,
        coords:
          typeof item === 'object' && item?.coords
            ? item.coords
            : null,
      });
    });

    return result;
  }, [recentSearches]);

  // ==========================================
  // FETCH LIVE WEATHER FOR EACH CITY
  // ==========================================
  useEffect(() => {
    if (uniqueRecentSearches.length === 0) return;

    let cancelled = false;

    const fetchAll = async () => {
      for (const city of uniqueRecentSearches) {
        if (cityWeather[city.name]) continue;

        setLoadingWeather((prev) => ({
          ...prev,
          [city.name]: true,
        }));

        try {
          let lat = city.coords?.lat;
          let lng = city.coords?.lng;

          if (!lat || !lng) {
            const coords = getCityCoordinates(city.name);
            if (coords) {
              lat = coords.lat;
              lng = coords.lng;
            }
          }

          if (!lat || !lng) {
            setLoadingWeather((prev) => ({
              ...prev,
              [city.name]: false,
            }));
            continue;
          }

          const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,weather_code,is_day&timezone=auto`;
          const response = await fetch(url);
          if (!response.ok) throw new Error('Failed');

          const data = await response.json();

          if (!cancelled) {
            setCityWeather((prev) => ({
              ...prev,
              [city.name]: {
                temperature: data.current?.temperature_2m,
                weatherCode: data.current?.weather_code,
                isDay: data.current?.is_day === 1,
              },
            }));
          }
        } catch (err) {
          console.warn(`Weather failed for ${city.name}:`, err);
        } finally {
          if (!cancelled) {
            setLoadingWeather((prev) => ({
              ...prev,
              [city.name]: false,
            }));
          }
        }
      }
    };

    fetchAll();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uniqueRecentSearches]);

  // ==========================================
  // HANDLE CITY CLICK
  // ==========================================
  const handleCityClick = (city) => {
    if (city.coords?.lat && city.coords?.lng) {
      selectCityByCoords(city.name, city.coords.lat, city.coords.lng);
    } else {
      selectCity(city.name);
    }
  };

  // ==========================================
  // EMPTY STATE
  // ==========================================
  if (uniqueRecentSearches.length === 0) {
    return (
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
          padding: '24px',
          transition: 'all 0.4s ease',
        }}
      >
        <div
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
              color: theme === 'dark' ? '#ffffff' : '#1a1a2e',
            }}
          >
            🕐 Recently Searched
          </h3>
        </div>
        <p
          style={{
            color:
              theme === 'dark'
                ? 'rgba(255,255,255,0.3)'
                : 'rgba(0,0,0,0.3)',
            textAlign: 'center',
            margin: 0,
            fontSize: '13px',
          }}
        >
          No recent searches
        </p>
      </div>
    );
  }

  // ==========================================
  // RENDER
  // ==========================================
  const currentCityName = weatherData?.city || '';

  return (
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
        padding: '24px',
        transition: 'all 0.4s ease',
      }}
    >
      {/* Header */}
      <div
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
            color: theme === 'dark' ? '#ffffff' : '#1a1a2e',
          }}
        >
          🕐 Recently Searched
        </h3>

        <button
          onClick={clearRecentSearches}
          style={{
            background: 'transparent',
            border: 'none',
            color:
              theme === 'dark'
                ? 'rgba(255,255,255,0.3)'
                : 'rgba(0,0,0,0.4)',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
            padding: '4px 8px',
            borderRadius: '6px',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#ef4444';
            e.currentTarget.style.background =
              'rgba(239,68,68,0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color =
              theme === 'dark'
                ? 'rgba(255,255,255,0.3)'
                : 'rgba(0,0,0,0.4)';
            e.currentTarget.style.background = 'transparent';
          }}
        >
          Clear All
        </button>
      </div>

      {/* Cities List */}
      <div
        className="recent-list"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        {uniqueRecentSearches.slice(0, 5).map((city, index) => {
          const isCurrent =
            city.name.toLowerCase() ===
            currentCityName.toLowerCase();
          const weather = cityWeather[city.name];
          const isLoading = loadingWeather[city.name];

          // Temperature: current city se ya cached weather se
          let temp = null;
          let condition = 'Clear';
          let icon = '☀️';

          if (isCurrent && weatherData) {
            temp = weatherData.temperature;
            condition = weatherData.condition;
            icon = getWeatherIcon(condition);
          } else if (weather) {
            temp = weather.temperature;
            icon = getWeatherIconFromCode(
              weather.weatherCode,
              weather.isDay
            );
            condition = weather.weatherCode >= 95 ? 'Thunderstorm' : 'Clear';
          }

          const tempDisplay = isLoading
            ? '...'
            : temp !== null && temp !== undefined
            ? formatTemp(temp, unit)
            : '--°';

          return (
            <div
              key={`${city.name}-${index}`}
              className="recent-item"
              onClick={() => handleCityClick(city)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                background: isCurrent
                  ? theme === 'dark'
                    ? 'rgba(99,102,241,0.12)'
                    : 'rgba(99,102,241,0.08)'
                  : theme === 'dark'
                  ? 'rgba(255,255,255,0.02)'
                  : 'rgba(0,0,0,0.02)',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                border: isCurrent
                  ? '1px solid rgba(99,102,241,0.3)'
                  : '1px solid transparent',
                position: 'relative',
              }}
              onMouseEnter={(e) => {
                if (!isCurrent) {
                  e.currentTarget.style.background =
                    theme === 'dark'
                      ? 'rgba(255,255,255,0.04)'
                      : 'rgba(0,0,0,0.04)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isCurrent) {
                  e.currentTarget.style.background =
                    theme === 'dark'
                      ? 'rgba(255,255,255,0.02)'
                      : 'rgba(0,0,0,0.02)';
                }
              }}
            >
              {/* Icon */}
              <span
                style={{ fontSize: '24px', flexShrink: 0 }}
              >
                {icon}
              </span>

              {/* City + Temp */}
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  minWidth: 0,
                }}
              >
                <span
                  style={{
                    fontSize: '14px',
                    fontWeight: isCurrent ? 600 : 500,
                    color: isCurrent
                      ? theme === 'dark'
                        ? '#a5b4fc'
                        : '#6366f1'
                      : theme === 'dark'
                      ? '#ffffff'
                      : '#1a1a2e',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {city.name}
                </span>
                <span
                  style={{
                    fontSize: '18px',
                    fontWeight: 700,
                    color: theme === 'dark' ? '#ffffff' : '#1a1a2e',
                  }}
                >
                  {tempDisplay}
                </span>
              </div>

              {/* Condition */}
              <span
                style={{
                  fontSize: '12px',
                  color:
                    theme === 'dark'
                      ? 'rgba(255,255,255,0.3)'
                      : 'rgba(0,0,0,0.4)',
                  flexShrink: 0,
                  textAlign: 'right',
                  maxWidth: '80px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {isLoading ? '...' : condition}
              </span>

              {/* Remove Button */}
              {removeRecentSearch && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeRecentSearch(city.name);
                  }}
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    background: 'transparent',
                    border: 'none',
                    color:
                      theme === 'dark'
                        ? 'rgba(255,255,255,0.3)'
                        : 'rgba(0,0,0,0.3)',
                    fontSize: '11px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 0,
                    flexShrink: 0,
                    transition: 'all 0.2s ease',
                    lineHeight: 1,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#ef4444';
                    e.currentTarget.style.background =
                      'rgba(239,68,68,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color =
                      theme === 'dark'
                        ? 'rgba(255,255,255,0.3)'
                        : 'rgba(0,0,0,0.3)';
                    e.currentTarget.style.background = 'transparent';
                  }}
                  title="Remove"
                >
                  ✕
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentSearches;