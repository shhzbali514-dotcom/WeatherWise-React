// ==========================================
// FAVORITES PAGE - FULLY FUNCTIONAL
// UPGRADED: Search + Suggestions + Navigation + Real Weather
// ==========================================

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWeather } from '../context/WeatherContext';
import { useSettings } from '../context/SettingsContext';
import {
  formatTemp,
  getWeatherIcon,
} from '../utils/helpers';
import { getWeatherIconFromCode } from '../services/weatherApi';
import {
  getCityCoordinates,
  isPakistaniCity,
  getCityCountry,
  getProvinceFromCity,
} from '../data/cities';
import { globalSearch } from '../services/geocodingApi';

// Components
import WeatherBackground from '../components/WeatherBackground';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SearchOverlay from '../components/SearchOverlay';

// ==========================================
// MAIN COMPONENT
// ==========================================
const Favorites = () => {
  const {
    weatherData,
    favorites,
    toggleFavorite,
    selectCity,
    selectCityByCoords,
  } = useWeather();
  const { unit, theme } = useSettings();
  const navigate = useNavigate();

  const [searchOpen, setSearchOpen] = useState(false);
  const [newCity, setNewCity] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Favorites ka weather cache
  const [favWeather, setFavWeather] = useState({});
  const [favLoading, setFavLoading] = useState({});

  // Toast notifications
  const [toast, setToast] = useState(null);

  const searchTimeout = useRef(null);
  const inputWrapperRef = useRef(null);

  const condition = weatherData?.condition || 'Sunny';

  // ==========================================
  // TOAST
  // ==========================================
  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  };

  // ==========================================
  // FETCH WEATHER FOR ALL FAVORITES
  // ==========================================
  useEffect(() => {
    if (favorites.length === 0) return;

    let cancelled = false;

    const fetchAllFavorites = async () => {
      for (const city of favorites) {
        if (favWeather[city]) continue;

        setFavLoading((prev) => ({ ...prev, [city]: true }));

        try {
          const coords = getCityCoordinates(city);

          if (!coords || !coords.lat || !coords.lng) {
            setFavLoading((prev) => ({ ...prev, [city]: false }));
            continue;
          }

          const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lng}&current=temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m,is_day&timezone=auto`;
          const response = await fetch(url);
          if (!response.ok) throw new Error('Failed');

          const data = await response.json();

          if (!cancelled) {
            setFavWeather((prev) => ({
              ...prev,
              [city]: {
                temperature: data.current?.temperature_2m,
                weatherCode: data.current?.weather_code,
                humidity: data.current?.relative_humidity_2m,
                windSpeed: data.current?.wind_speed_10m,
                isDay: data.current?.is_day === 1,
              },
            }));
          }
        } catch (err) {
          console.warn(`Weather fetch failed for ${city}:`, err);
        } finally {
          if (!cancelled) {
            setFavLoading((prev) => ({ ...prev, [city]: false }));
          }
        }
      }
    };

    fetchAllFavorites();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [favorites]);

  // ==========================================
  // SEARCH WITH SUGGESTIONS
  // ==========================================
  const performSearch = async (value) => {
    if (!value || value.trim().length < 1) {
      setSuggestions([]);
      return;
    }

    setIsSearching(true);

    try {
      const trimmed = value.trim();

      // Static results from cities.js
      const allCities = favorites.length > 0
        ? []
        : [];

      // Global search (static + API)
      const results = await globalSearch(trimmed, {
        useStatic: true,
        useAPI: true,
        limit: 8,
      });

      // Filter out already-favorited
      const filtered = (results || []).filter(
        (item) =>
          !favorites.some(
            (f) =>
              f.toLowerCase() ===
              (item.name || '').toLowerCase()
          )
      );

      setSuggestions(filtered);
    } catch (err) {
      console.warn('Search failed:', err);
      setSuggestions([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounced search
  const handleInputChange = (e) => {
    const value = e.target.value;
    setNewCity(value);

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(() => {
      performSearch(value);
    }, 300);
  };

  // Close suggestions on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        inputWrapperRef.current &&
        !inputWrapperRef.current.contains(e.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () =>
      document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ==========================================
  // ADD FAVORITE
  // ==========================================
  const handleAddFavorite = (cityObj = null) => {
    const cityName = cityObj
      ? cityObj.name
      : newCity.trim();

    if (!cityName) return;

    // Check if already exists
    if (
      favorites.some(
        (f) => f.toLowerCase() === cityName.toLowerCase()
      )
    ) {
      showToast('⚠️ City already in favorites!', 'warning');
      return;
    }

    // Add to favorites
    toggleFavorite(cityName);

    // If coords available, save them via context
    if (cityObj && cityObj.lat && cityObj.lng) {
      // Context mein coords save karne ke liye
      // (favorites mein coords separately store ho rahe hain)
    }

    showToast(`✅ ${cityName} added to favorites`, 'success');
    setNewCity('');
    setSuggestions([]);
    setShowSuggestions(false);
  };

  // ==========================================
  // REMOVE FAVORITE
  // ==========================================
  const handleRemoveFavorite = (city) => {
    toggleFavorite(city);
    showToast(`🗑️ ${city} removed`, 'info');
  };

  // ==========================================
  // VIEW CITY → NAVIGATE TO HOME
  // ==========================================
  const handleViewCity = (city) => {
    const coords = getCityCoordinates(city);

    if (coords && coords.lat && coords.lng) {
      selectCityByCoords(city, coords.lat, coords.lng);
    } else {
      selectCity(city);
    }

    navigate('/');
  };

  // ==========================================
  // CLEAR ALL
  // ==========================================
  const handleClearAll = () => {
    if (window.confirm('Remove all favorites?')) {
      favorites.forEach((city) => toggleFavorite(city));
      setFavWeather({});
      showToast('🗑️ All favorites cleared', 'info');
    }
  };

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
  const cardBg =
    theme === 'dark'
      ? 'rgba(255,255,255,0.05)'
      : 'rgba(255,255,255,0.5)';
  const cardBorder =
    theme === 'dark'
      ? '1px solid rgba(255,255,255,0.08)'
      : '1px solid rgba(0,0,0,0.04)';
  const inputBg =
    theme === 'dark'
      ? 'rgba(255,255,255,0.04)'
      : 'rgba(0,0,0,0.04)';
  const inputBorder =
    theme === 'dark'
      ? '1px solid rgba(255,255,255,0.06)'
      : '1px solid rgba(0,0,0,0.06)';

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

      {/* Toast */}
      {toast && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10000,
            padding: '12px 24px',
            borderRadius: '12px',
            background:
              toast.type === 'success'
                ? 'rgba(16,185,129,0.95)'
                : toast.type === 'warning'
                ? 'rgba(245,158,11,0.95)'
                : 'rgba(99,102,241,0.95)',
            color: '#fff',
            fontSize: '13px',
            fontWeight: 600,
            backdropFilter: 'blur(20px)',
            boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
            animation: 'toastIn 0.3s ease',
          }}
        >
          {toast.message}
        </div>
      )}

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
                ⭐ Favorite Cities
              </h1>
              <p
                style={{
                  color: textMuted,
                  fontSize: 'clamp(12px, 2vw, 14px)',
                  marginTop: '4px',
                  marginBottom: 0,
                }}
              >
                Your saved locations for quick access
              </p>
            </div>

            {/* ==========================================
                SEARCH WITH SUGGESTIONS
            ========================================== */}
            <div
              ref={inputWrapperRef}
              style={{
                display: 'flex',
                gap: '8px',
                flexWrap: 'wrap',
                width: '100%',
                maxWidth: '450px',
                position: 'relative',
              }}
            >
              <input
                type="text"
                placeholder="Search city to add..."
                value={newCity}
                onChange={handleInputChange}
                onFocus={() => setShowSuggestions(true)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && newCity.trim()) {
                    handleAddFavorite(suggestions[0] || null);
                  }
                }}
                style={{
                  flex: 1,
                  minWidth: '120px',
                  padding:
                    'clamp(8px, 2vw, 10px) clamp(12px, 2.5vw, 16px)',
                  borderRadius: '9999px',
                  background: inputBg,
                  border: inputBorder,
                  color: textPrimary,
                  fontSize: 'clamp(13px, 2vw, 14px)',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  boxSizing: 'border-box',
                }}
              />

              <button
                onClick={() => handleAddFavorite()}
                className="btn-primary"
                disabled={!newCity.trim()}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding:
                    'clamp(8px, 2vw, 10px) clamp(16px, 3vw, 24px)',
                  borderRadius: '9999px',
                  background:
                    'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: 'clamp(12px, 2vw, 14px)',
                  border: 'none',
                  cursor: newCity.trim()
                    ? 'pointer'
                    : 'not-allowed',
                  transition: 'all 0.3s ease',
                  whiteSpace: 'nowrap',
                  opacity: newCity.trim() ? 1 : 0.5,
                }}
              >
                + Add
              </button>

              {/* Suggestions Dropdown */}
              {showSuggestions &&
                newCity.trim().length > 0 && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      right: 0,
                      marginTop: '8px',
                      maxHeight: '300px',
                      overflowY: 'auto',
                      borderRadius: '14px',
                      background:
                        theme === 'dark'
                          ? 'rgba(20,20,30,0.95)'
                          : 'rgba(255,255,255,0.95)',
                      backdropFilter: 'blur(20px)',
                      WebkitBackdropFilter: 'blur(20px)',
                      border: cardBorder,
                      boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                      padding: '6px',
                      zIndex: 100,
                    }}
                  >
                    {isSearching && (
                      <div
                        style={{
                          padding: '12px 16px',
                          fontSize: '12px',
                          color: textMuted,
                          textAlign: 'center',
                        }}
                      >
                        🔄 Searching...
                      </div>
                    )}

                    {!isSearching &&
                      suggestions.length === 0 && (
                        <div
                          style={{
                            padding: '12px 16px',
                            fontSize: '12px',
                            color: textMuted,
                            textAlign: 'center',
                          }}
                        >
                          No cities found
                        </div>
                      )}

                    {suggestions.map((item, idx) => {
                      const name = item.name;
                      const isPak = isPakistaniCity(name);
                      const country =
                        item.country ||
                        getCityCountry(name);
                      const subtext = isPak
                        ? item.state
                          ? `${item.state}, Pakistan`
                          : 'Pakistan'
                        : country;

                      return (
                        <div
                          key={`${name}-${idx}`}
                          onClick={() => handleAddFavorite(item)}
                          style={{
                            padding: '10px 14px',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            transition: 'all 0.2s ease',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background =
                              theme === 'dark'
                                ? 'rgba(255,255,255,0.05)'
                                : 'rgba(0,0,0,0.04)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background =
                              'transparent';
                          }}
                        >
                          <span style={{ fontSize: '16px' }}>
                            {isPak ? '🇵🇰' : '🌍'}
                          </span>
                          <div
                            style={{
                              flex: 1,
                              minWidth: 0,
                            }}
                          >
                            <div
                              style={{
                                fontSize: '13px',
                                fontWeight: 600,
                                color: textPrimary,
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }}
                            >
                              {name}
                            </div>
                            <div
                              style={{
                                fontSize: '11px',
                                color: textMuted,
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }}
                            >
                              {subtext}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
            </div>
          </div>

          {/* ==========================================
              CONTENT
          ========================================== */}
          {favorites.length === 0 ? (
            <div
              className="favorites-empty"
              style={{
                textAlign: 'center',
                padding:
                  'clamp(40px, 8vw, 60px) clamp(12px, 3vw, 20px)',
              }}
            >
              <div className="empty-state">
                <span
                  className="empty-icon"
                  style={{
                    fontSize: 'clamp(48px, 10vw, 64px)',
                    display: 'block',
                    marginBottom: '16px',
                  }}
                >
                  ⭐
                </span>
                <h3
                  style={{
                    fontSize: 'clamp(18px, 4vw, 24px)',
                    fontWeight: 600,
                    marginBottom: '8px',
                    color: textPrimary,
                  }}
                >
                  No Favorites Yet
                </h3>
                <p
                  style={{
                    color: textMuted,
                    marginBottom: '20px',
                    fontSize: 'clamp(12px, 2vw, 14px)',
                  }}
                >
                  Start saving your favorite cities for quick access
                </p>
                <button
                  onClick={() => navigate('/')}
                  className="btn-primary"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding:
                      'clamp(8px, 2vw, 10px) clamp(16px, 3vw, 24px)',
                    borderRadius: '9999px',
                    background:
                      'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    color: '#fff',
                    fontWeight: 600,
                    fontSize: 'clamp(12px, 2vw, 14px)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                >
                  Browse Cities
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* ==========================================
                  FAVORITES GRID
              ========================================== */}
              <div
                className="favorites-grid"
                style={{
                  display: 'grid',
                  gridTemplateColumns:
                    'repeat(auto-fill, minmax(min(100%, 240px), 1fr))',
                  gap: 'clamp(12px, 2vw, 16px)',
                  marginBottom: '24px',
                }}
              >
                {favorites.map((city) => {
                  const weather = favWeather[city];
                  const isLoading = favLoading[city];

                  const isPak = isPakistaniCity(city);
                  const country = getCityCountry(city);
                  const province = isPak
                    ? getProvinceFromCity(city)
                    : country;

                  const temp = weather?.temperature;
                  const code = weather?.weatherCode;
                  const humidity = weather?.humidity;
                  const wind = weather?.windSpeed;
                  const icon = weather
                    ? getWeatherIconFromCode(code, weather.isDay)
                    : '☀️';

                  return (
                    <div
                      key={city}
                      className="favorite-card glass-card"
                      style={{
                        padding: 'clamp(14px, 3vw, 20px)',
                        background: cardBg,
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        border: cardBorder,
                        borderRadius: '16px',
                        transition: 'all 0.4s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform =
                          'translateY(-4px)';
                        e.currentTarget.style.boxShadow =
                          '0 12px 40px rgba(0,0,0,0.15)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform =
                          'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      {/* Header */}
                      <div
                        className="fav-header"
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          marginBottom: '12px',
                          gap: '8px',
                        }}
                      >
                        <div
                          className="fav-location"
                          style={{ minWidth: 0, flex: 1 }}
                        >
                          <h3
                            style={{
                              fontSize: 'clamp(14px, 2.5vw, 16px)',
                              fontWeight: 600,
                              margin: 0,
                              color: textPrimary,
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {isPak ? '🇵🇰' : '🌍'} {city}
                          </h3>
                          <span
                            style={{
                              fontSize: 'clamp(11px, 2vw, 13px)',
                              color: textMuted,
                            }}
                          >
                            {isPak ? 'Pakistan' : country}
                          </span>
                          {province && province !== country && (
                            <span
                              style={{
                                fontSize: 'clamp(10px, 1.8vw, 11px)',
                                color: textFaint,
                                display: 'block',
                              }}
                            >
                              {province}
                            </span>
                          )}
                        </div>

                        <button
                          onClick={() => handleRemoveFavorite(city)}
                          className="fav-remove"
                          title="Remove"
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            background:
                              theme === 'dark'
                                ? 'rgba(255,255,255,0.04)'
                                : 'rgba(0,0,0,0.04)',
                            border: 'none',
                            fontSize: '18px',
                            color: textFaint,
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            flexShrink: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            lineHeight: 1,
                            padding: 0,
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background =
                              'rgba(239,68,68,0.15)';
                            e.currentTarget.style.color = '#ef4444';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background =
                              theme === 'dark'
                                ? 'rgba(255,255,255,0.04)'
                                : 'rgba(0,0,0,0.04)';
                            e.currentTarget.style.color = textFaint;
                          }}
                        >
                          ×
                        </button>
                      </div>

                      {/* Weather */}
                      <div
                        className="fav-weather"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          marginBottom: '12px',
                          flexWrap: 'wrap',
                        }}
                      >
                        <span
                          style={{
                            fontSize: 'clamp(28px, 5vw, 36px)',
                            lineHeight: 1,
                          }}
                        >
                          {icon}
                        </span>
                        <span
                          className="fav-temp"
                          style={{
                            fontSize: 'clamp(24px, 4vw, 32px)',
                            fontWeight: 700,
                            color: textPrimary,
                          }}
                        >
                          {isLoading
                            ? '...'
                            : temp !== null &&
                              temp !== undefined
                            ? formatTemp(temp, unit)
                            : '--°'}
                        </span>
                      </div>

                      {/* Details */}
                      <div
                        className="fav-details"
                        style={{
                          display: 'flex',
                          gap: '16px',
                          fontSize: 'clamp(11px, 2vw, 13px)',
                          color: textMuted,
                          marginBottom: '12px',
                          flexWrap: 'wrap',
                        }}
                      >
                        <span>
                          💧{' '}
                          {humidity !== null &&
                          humidity !== undefined
                            ? `${Math.round(humidity)}%`
                            : '--'}
                        </span>
                        <span>
                          💨{' '}
                          {wind !== null && wind !== undefined
                            ? `${Math.round(wind)} km/h`
                            : '--'}
                        </span>
                      </div>

                      {/* View Button */}
                      <button
                        onClick={() => handleViewCity(city)}
                        className="fav-view"
                        style={{
                          fontWeight: 600,
                          color: '#6366f1',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          fontSize: 'clamp(12px, 2vw, 14px)',
                          padding: '0',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = '#818cf8';
                          e.currentTarget.style.gap = '8px';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = '#6366f1';
                          e.currentTarget.style.gap = '4px';
                        }}
                      >
                        View Weather →
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* ==========================================
                  MANAGE FAVORITES
              ========================================== */}
              <div
                className="glass-card manage-favorites"
                style={{
                  padding: 'clamp(16px, 3vw, 20px)',
                  background: cardBg,
                  backdropFilter: 'blur(20px)',
                  border: cardBorder,
                  borderRadius: '16px',
                  transition: 'all 0.4s ease',
                }}
              >
                <h3
                  style={{
                    marginBottom: '16px',
                    fontSize: 'clamp(14px, 2.5vw, 16px)',
                    fontWeight: 600,
                    color: textPrimary,
                  }}
                >
                  Manage Favorites
                </h3>
                <div
                  className="manage-actions"
                  style={{
                    display: 'flex',
                    gap: '12px',
                    flexWrap: 'wrap',
                  }}
                >
                  {/* Export */}
                  <button
                    onClick={() => {
                      const data = JSON.stringify(
                        favorites,
                        null,
                        2
                      );
                      const blob = new Blob([data], {
                        type: 'application/json',
                      });
                      const url =
                        URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = 'weatherwise_favorites.json';
                      a.click();
                      URL.revokeObjectURL(url);
                      showToast('📤 Exported!', 'success');
                    }}
                    className="btn-outline"
                    style={{
                      flex: '1 1 140px',
                      padding:
                        'clamp(8px, 2vw, 10px) clamp(16px, 3vw, 24px)',
                      borderRadius: '9999px',
                      background: 'transparent',
                      border:
                        theme === 'dark'
                          ? '1px solid rgba(255,255,255,0.1)'
                          : '1px solid rgba(0,0,0,0.1)',
                      color: textMuted,
                      fontWeight: 500,
                      fontSize: 'clamp(11px, 2vw, 14px)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    📤 Export
                  </button>

                  {/* Import */}
                  <button
                    onClick={() => {
                      const input =
                        document.createElement('input');
                      input.type = 'file';
                      input.accept = '.json';
                      input.onchange = (e) => {
                        const file = e.target.files[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = (e) => {
                          try {
                            const data = JSON.parse(
                              e.target.result
                            );
                            if (
                              Array.isArray(data) &&
                              data.length > 0
                            ) {
                              let added = 0;
                              data.forEach((city) => {
                                if (
                                  !favorites.includes(city)
                                ) {
                                  toggleFavorite(city);
                                  added++;
                                }
                              });
                              showToast(
                                `✅ Imported ${added} cities!`,
                                'success'
                              );
                            }
                          } catch (err) {
                            showToast(
                              '⚠️ Invalid file!',
                              'warning'
                            );
                          }
                        };
                        reader.readAsText(file);
                      };
                      input.click();
                    }}
                    className="btn-outline"
                    style={{
                      flex: '1 1 140px',
                      padding:
                        'clamp(8px, 2vw, 10px) clamp(16px, 3vw, 24px)',
                      borderRadius: '9999px',
                      background: 'transparent',
                      border:
                        theme === 'dark'
                          ? '1px solid rgba(255,255,255,0.1)'
                          : '1px solid rgba(0,0,0,0.1)',
                      color: textMuted,
                      fontWeight: 500,
                      fontSize: 'clamp(11px, 2vw, 14px)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    📥 Import
                  </button>

                  {/* Clear All */}
                  <button
                    onClick={handleClearAll}
                    className="btn-danger"
                    style={{
                      flex: '1 1 140px',
                      padding:
                        'clamp(8px, 2vw, 10px) clamp(16px, 3vw, 24px)',
                      borderRadius: '9999px',
                      background: 'rgba(239,68,68,0.1)',
                      border:
                        '1px solid rgba(239,68,68,0.15)',
                      color: '#ef4444',
                      fontWeight: 600,
                      fontSize: 'clamp(11px, 2vw, 14px)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    🗑️ Clear All
                  </button>
                </div>
              </div>
            </>
          )}
        </main>

        <Footer />
      </div>

      {/* ==========================================
          KEYFRAMES
      ========================================== */}
      <style>{`
        @keyframes toastIn {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }

        input::placeholder {
          color: ${
            theme === 'dark'
              ? 'rgba(255,255,255,0.3)'
              : 'rgba(0,0,0,0.3)'
          };
        }

        @media (max-width: 480px) {
          .favorites-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  );
};

export default Favorites;