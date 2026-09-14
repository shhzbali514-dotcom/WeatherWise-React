// ==========================================
// SEARCH OVERLAY COMPONENT
// UPGRADED: Global Search (Pakistan + World)
// Uses geocodingApi (Nominatim + Photon + Static)
// ==========================================

import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
} from 'react';
import { useWeather } from '../context/WeatherContext';
import { useSettings } from '../context/SettingsContext';
import { getAllCities, getProvinceFromCity } from '../data/cities';
import { globalSearch } from '../services/geocodingApi';
import { debounce } from '../utils/helpers';

const SearchOverlay = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);

  const { selectCity, selectCityByCoords, recentSearches } =
    useWeather();
  const { theme } = useSettings();
  const inputRef = useRef(null);

  const allCities = getAllCities();

  const majorCities = [
    'Karachi',
    'Lahore',
    'Islamabad',
    'Rawalpindi',
    'Peshawar',
    'Quetta',
    'Multan',
    'Hyderabad',
    'Faisalabad',
    'Gilgit',
    'Muzaffarabad',
  ];

  const worldCities = [
    'London',
    'New York',
    'Dubai',
    'Tokyo',
    'Paris',
    'Istanbul',
    'Beijing',
    'Sydney',
  ];

  // ==========================================
  // DEDUPLICATE RECENT SEARCHES
  // Fixes "==" issue
  // ==========================================
  const uniqueRecentSearches = useMemo(() => {
    if (!Array.isArray(recentSearches)) return [];

    const seen = new Set();
    const result = [];

    recentSearches.forEach((item) => {
      const cityName =
        typeof item === 'string'
          ? item
          : item?.name || item?.city;

      if (!cityName) return;

      const key = cityName.toLowerCase().trim();
      if (seen.has(key)) return;

      seen.add(key);
      result.push(cityName);
    });

    return result;
  }, [recentSearches]);

  // ==========================================
  // FOCUS INPUT WHEN OPENED
  // ==========================================
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      // Reset when closed
      setQuery('');
      setResults([]);
      setSearchError(null);
    }
  }, [isOpen]);

  // ==========================================
  // ESCAPE KEY TO CLOSE
  // ==========================================
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () =>
      document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // ==========================================
  // PREVENT BODY SCROLL WHEN OPEN
  // ==========================================
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // ==========================================
  // SEARCH — STATIC + API (GLOBAL)
  // ==========================================
  const performSearch = async (value) => {
    if (!value || value.trim().length < 1) {
      setResults([]);
      setSearchError(null);
      return;
    }

    setIsSearching(true);
    setSearchError(null);

    try {
      const trimmed = value.trim();

      // Step 1: Static search (fast)
      const staticMatches = allCities
        .filter((city) =>
          city.toLowerCase().includes(trimmed.toLowerCase())
        )
        .slice(0, 6)
        .map((city) => ({
          name: city,
          displayName: `${city}, Pakistan`,
          country: 'Pakistan',
          countryCode: 'PK',
          state: getProvinceFromCity(city),
          lat: null,
          lng: null,
          source: 'static',
        }));

      // Step 2: If static results found, show them immediately
      if (staticMatches.length > 0) {
        setResults(staticMatches);
      }

      // Step 3: Try API for more results (global)
      try {
        const apiResults = await globalSearch(trimmed, {
          useStatic: false,
          useAPI: true,
          limit: 10,
        });

        if (apiResults && apiResults.length > 0) {
          // Merge: static + API (deduplicate)
          const seen = new Set();
          const merged = [];

          [...staticMatches, ...apiResults].forEach((item) => {
            const key = `${item.name}-${item.country}`.toLowerCase();
            if (seen.has(key)) return;
            seen.add(key);
            merged.push(item);
          });

          setResults(merged.slice(0, 12));
        } else if (staticMatches.length === 0) {
          setResults([]);
        }
      } catch (apiErr) {
        console.warn('API search failed:', apiErr);
        // Static results already shown
      }
    } catch (err) {
      console.error('Search error:', err);
      setSearchError('Search failed. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  // ==========================================
  // DEBOUNCED SEARCH
  // ==========================================
  const debouncedSearch = useRef(
    debounce((value) => {
      performSearch(value);
    }, 300)
  ).current;

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value);
  };

  // ==========================================
  // HANDLE CITY SELECT
  // ==========================================
  const handleSelectCity = (city) => {
    // If object with coords → use selectCityByCoords
    if (typeof city === 'object' && city.lat && city.lng) {
      selectCityByCoords(city.name, city.lat, city.lng);
    } else {
      // String or object without coords
      const cityName = typeof city === 'string' ? city : city.name;
      selectCity(cityName);
    }

    setQuery('');
    setResults([]);
    onClose();
  };

  // ==========================================
  // RENDER
  // ==========================================
  if (!isOpen) return null;

  return (
    <div
      className="search-overlay"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: 'clamp(80px, 12vh, 120px)',
        paddingBottom: '40px',
        overflowY: 'auto',
        opacity: 1,
        visibility: 'visible',
        transition: 'all 0.4s ease',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="search-container"
        style={{
          width: '100%',
          maxWidth: '600px',
          padding: '0 20px',
        }}
      >
        {/* ==========================================
            SEARCH HEADER
        ========================================== */}
        <div
          className="search-header"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background:
              theme === 'dark'
                ? 'rgba(255,255,255,0.05)'
                : 'rgba(255,255,255,0.8)',
            border: `1px solid ${
              theme === 'dark'
                ? 'rgba(255,255,255,0.06)'
                : 'rgba(0,0,0,0.06)'
            }`,
            borderRadius: '16px',
            padding: '4px 16px',
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          }}
        >
          {/* Search Icon */}
          <span
            style={{
              fontSize: '18px',
              color:
                theme === 'dark'
                  ? 'rgba(255,255,255,0.4)'
                  : 'rgba(0,0,0,0.4)',
              flexShrink: 0,
            }}
          >
            🔍
          </span>

          {/* Input */}
          <input
            ref={inputRef}
            type="text"
            className="search-input"
            placeholder="Search any city in Pakistan or worldwide..."
            value={query}
            onChange={handleInputChange}
            style={{
              flex: 1,
              padding: '16px 0',
              fontSize: '16px',
              color: theme === 'dark' ? '#fff' : '#1a1a2e',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              minWidth: 0,
            }}
          />

          {/* Loading Indicator */}
          {isSearching && (
            <span
              style={{
                fontSize: '14px',
                color:
                  theme === 'dark'
                    ? 'rgba(255,255,255,0.4)'
                    : 'rgba(0,0,0,0.4)',
                animation: 'spin 1s linear infinite',
                flexShrink: 0,
              }}
            >
              🔄
            </span>
          )}

          {/* Close Button */}
          <button
            onClick={onClose}
            className="search-close"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background:
                theme === 'dark'
                  ? 'rgba(255,255,255,0.05)'
                  : 'rgba(0,0,0,0.04)',
              border: 'none',
              fontSize: '20px',
              color:
                theme === 'dark'
                  ? 'rgba(255,255,255,0.5)'
                  : 'rgba(0,0,0,0.5)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0,
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(239,68,68,0.15)';
              e.currentTarget.style.color = '#ef4444';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background =
                theme === 'dark'
                  ? 'rgba(255,255,255,0.05)'
                  : 'rgba(0,0,0,0.04)';
              e.currentTarget.style.color =
                theme === 'dark'
                  ? 'rgba(255,255,255,0.5)'
                  : 'rgba(0,0,0,0.5)';
            }}
          >
            ×
          </button>
        </div>

        {/* ==========================================
            SEARCH RESULTS
        ========================================== */}
        {results.length > 0 && (
          <div
            className="search-results"
            style={{
              marginTop: '16px',
              maxHeight: '360px',
              overflowY: 'auto',
              borderRadius: '16px',
              background:
                theme === 'dark'
                  ? 'rgba(20,20,30,0.6)'
                  : 'rgba(255,255,255,0.7)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: `1px solid ${
                theme === 'dark'
                  ? 'rgba(255,255,255,0.06)'
                  : 'rgba(0,0,0,0.06)'
              }`,
              padding: '8px',
            }}
          >
            {results.map((city, index) => {
              const cityName =
                typeof city === 'string' ? city : city.name;
              const isPakistani =
                (typeof city === 'object' &&
                  city.country?.toLowerCase() === 'pakistan') ||
                allCities.includes(cityName);

              const province =
                typeof city === 'object' && city.state
                  ? city.state
                  : isPakistani
                  ? getProvinceFromCity(cityName)
                  : typeof city === 'object'
                  ? city.country
                  : '';

              return (
                <div
                  key={`${cityName}-${index}`}
                  className="search-result-item"
                  onClick={() => handleSelectCity(city)}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '12px',
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background =
                      theme === 'dark'
                        ? 'rgba(255,255,255,0.05)'
                        : 'rgba(0,0,0,0.04)')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = 'transparent')
                  }
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      minWidth: 0,
                      flex: 1,
                    }}
                  >
                    <span style={{ fontSize: '18px', flexShrink: 0 }}>
                      {isPakistani ? '🇵🇰' : '🌍'}
                    </span>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div
                        className="result-name"
                        style={{
                          fontWeight: 500,
                          color:
                            theme === 'dark' ? '#fff' : '#1a1a2e',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {cityName}
                      </div>
                      <div
                        className="result-country"
                        style={{
                          fontSize: '13px',
                          color:
                            theme === 'dark'
                              ? 'rgba(255,255,255,0.3)'
                              : 'rgba(0,0,0,0.3)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {typeof city === 'object' && city.displayName
                          ? city.displayName
                          : isPakistani
                          ? `Pakistan`
                          : typeof city === 'object'
                          ? city.country
                          : ''}
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: '11px',
                      color:
                        theme === 'dark'
                          ? 'rgba(255,255,255,0.4)'
                          : 'rgba(0,0,0,0.4)',
                      flexShrink: 0,
                      maxWidth: '100px',
                      textAlign: 'right',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {province}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ==========================================
            NO RESULTS
        ========================================== */}
        {query.trim().length > 0 &&
          results.length === 0 &&
          !isSearching && (
            <div
              style={{
                marginTop: '24px',
                padding: '24px',
                textAlign: 'center',
                color:
                  theme === 'dark'
                    ? 'rgba(255,255,255,0.4)'
                    : 'rgba(0,0,0,0.4)',
                fontSize: '14px',
                background:
                  theme === 'dark'
                    ? 'rgba(255,255,255,0.03)'
                    : 'rgba(0,0,0,0.02)',
                borderRadius: '12px',
              }}
            >
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>
                🔍
              </div>
              No results found for {query.trim()}. Try another city or check your spelling.
            </div>
          )}

        {/* ==========================================
            SUGGESTIONS (Only when no query)
        ========================================== */}
        {query.trim().length === 0 && (
          <div
            className="search-suggestions"
            style={{ marginTop: '24px' }}
          >
            {/* Major Cities */}
            <div
              className="suggestion-group"
              style={{ marginBottom: '20px' }}
            >
              <h4
                style={{
                  fontSize: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color:
                    theme === 'dark'
                      ? 'rgba(255,255,255,0.3)'
                      : 'rgba(0,0,0,0.3)',
                  marginBottom: '10px',
                  fontWeight: 600,
                }}
              >
                🇵🇰 Major Cities
              </h4>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '8px',
                }}
              >
                {majorCities.map((city) => (
                  <span
                    key={city}
                    className="city-tag"
                    onClick={() => handleSelectCity(city)}
                    style={{
                      padding: '6px 16px',
                      borderRadius: '9999px',
                      background:
                        theme === 'dark'
                          ? 'rgba(255,255,255,0.05)'
                          : 'rgba(0,0,0,0.04)',
                      border: `1px solid ${
                        theme === 'dark'
                          ? 'rgba(255,255,255,0.06)'
                          : 'rgba(0,0,0,0.06)'
                      }`,
                      fontSize: '13px',
                      color:
                        theme === 'dark'
                          ? 'rgba(255,255,255,0.6)'
                          : 'rgba(0,0,0,0.6)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      userSelect: 'none',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background =
                        'rgba(99,102,241,0.15)';
                      e.currentTarget.style.color = '#a5b4fc';
                      e.currentTarget.style.borderColor =
                        'rgba(99,102,241,0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background =
                        theme === 'dark'
                          ? 'rgba(255,255,255,0.05)'
                          : 'rgba(0,0,0,0.04)';
                      e.currentTarget.style.color =
                        theme === 'dark'
                          ? 'rgba(255,255,255,0.6)'
                          : 'rgba(0,0,0,0.6)';
                      e.currentTarget.style.borderColor =
                        theme === 'dark'
                          ? 'rgba(255,255,255,0.06)'
                          : 'rgba(0,0,0,0.06)';
                    }}
                  >
                    {city}
                  </span>
                ))}
              </div>
            </div>

            {/* World Cities */}
            <div
              className="suggestion-group"
              style={{ marginBottom: '20px' }}
            >
              <h4
                style={{
                  fontSize: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color:
                    theme === 'dark'
                      ? 'rgba(255,255,255,0.3)'
                      : 'rgba(0,0,0,0.3)',
                  marginBottom: '10px',
                  fontWeight: 600,
                }}
              >
                🌍 World Cities
              </h4>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '8px',
                }}
              >
                {worldCities.map((city) => (
                  <span
                    key={city}
                    className="city-tag"
                    onClick={() => handleSelectCity(city)}
                    style={{
                      padding: '6px 16px',
                      borderRadius: '9999px',
                      background:
                        theme === 'dark'
                          ? 'rgba(255,255,255,0.05)'
                          : 'rgba(0,0,0,0.04)',
                      border: `1px solid ${
                        theme === 'dark'
                          ? 'rgba(255,255,255,0.06)'
                          : 'rgba(0,0,0,0.06)'
                      }`,
                      fontSize: '13px',
                      color:
                        theme === 'dark'
                          ? 'rgba(255,255,255,0.6)'
                          : 'rgba(0,0,0,0.6)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      userSelect: 'none',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background =
                        'rgba(99,102,241,0.15)';
                      e.currentTarget.style.color = '#a5b4fc';
                      e.currentTarget.style.borderColor =
                        'rgba(99,102,241,0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background =
                        theme === 'dark'
                          ? 'rgba(255,255,255,0.05)'
                          : 'rgba(0,0,0,0.04)';
                      e.currentTarget.style.color =
                        theme === 'dark'
                          ? 'rgba(255,255,255,0.6)'
                          : 'rgba(0,0,0,0.6)';
                      e.currentTarget.style.borderColor =
                        theme === 'dark'
                          ? 'rgba(255,255,255,0.06)'
                          : 'rgba(0,0,0,0.06)';
                    }}
                  >
                    {city}
                  </span>
                ))}
              </div>
            </div>

            {/* Recent Searches */}
            {uniqueRecentSearches.length > 0 && (
              <div className="suggestion-group">
                <h4
                  style={{
                    fontSize: '12px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color:
                      theme === 'dark'
                        ? 'rgba(255,255,255,0.3)'
                        : 'rgba(0,0,0,0.3)',
                    marginBottom: '10px',
                    fontWeight: 600,
                  }}
                >
                  🕐 Recent Searches
                </h4>
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '8px',
                  }}
                >
                  {uniqueRecentSearches.slice(0, 8).map((city) => (
                    <span
                      key={city}
                      className="city-tag"
                      onClick={() => handleSelectCity(city)}
                      style={{
                        padding: '6px 16px',
                        borderRadius: '9999px',
                        background:
                          theme === 'dark'
                            ? 'rgba(255,255,255,0.05)'
                            : 'rgba(0,0,0,0.04)',
                        border: `1px solid ${
                          theme === 'dark'
                            ? 'rgba(255,255,255,0.06)'
                            : 'rgba(0,0,0,0.06)'
                        }`,
                        fontSize: '13px',
                        color:
                          theme === 'dark'
                            ? 'rgba(255,255,255,0.6)'
                            : 'rgba(0,0,0,0.6)',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        userSelect: 'none',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background =
                          'rgba(99,102,241,0.15)';
                        e.currentTarget.style.color = '#a5b4fc';
                        e.currentTarget.style.borderColor =
                          'rgba(99,102,241,0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background =
                          theme === 'dark'
                            ? 'rgba(255,255,255,0.05)'
                            : 'rgba(0,0,0,0.04)';
                        e.currentTarget.style.color =
                          theme === 'dark'
                            ? 'rgba(255,255,255,0.6)'
                            : 'rgba(0,0,0,0.6)';
                        e.currentTarget.style.borderColor =
                          theme === 'dark'
                            ? 'rgba(255,255,255,0.06)'
                            : 'rgba(0,0,0,0.06)';
                      }}
                    >
                      {city}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Animation Keyframes */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .search-results::-webkit-scrollbar {
          width: 6px;
        }
        .search-results::-webkit-scrollbar-track {
          background: transparent;
        }
        .search-results::-webkit-scrollbar-thumb {
          background: ${
            theme === 'dark'
              ? 'rgba(255,255,255,0.1)'
              : 'rgba(0,0,0,0.1)'
          };
          border-radius: 9999px;
        }
        @media (max-width: 480px) {
          .search-overlay {
            padding-top: 60px !important;
          }
          .search-input {
            font-size: 15px !important;
            padding: 14px 0 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default SearchOverlay;