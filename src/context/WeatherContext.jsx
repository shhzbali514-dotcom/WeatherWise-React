// ==========================================
// WEATHER CONTEXT - GLOBAL WEATHER STATE
// FULLY UPGRADED WITH NOMINATIM API
// Real-time Location + Global Search
// Uses ALL cities from cities.js + API fallback
// ==========================================

import {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
  useRef,
} from 'react';

import {
  fetchWeatherForCity,
  fetchWeatherByCoords,
} from '../services/weatherApi';

import {
  getCityCoordinates,
  getProvinceFromCity,
} from '../data/cities';

import {
  globalSearch,
  reverseGeocode,
  findNearestCity,
} from '../services/geocodingApi';

import {
  loadFromLocalStorage,
  saveToLocalStorage,
} from '../utils/helpers';

const WeatherContext = createContext(null);

export const useWeather = () => {
  const context = useContext(WeatherContext);

  if (!context) {
    throw new Error(
      'useWeather must be used within a WeatherProvider'
    );
  }

  return context;
};

export const WeatherProvider = ({ children }) => {
  // ==========================================
  // STATE
  // ==========================================
  const [weatherData, setWeatherData] = useState(null);
  const [aqiData, setAqiData] = useState(null);

  const [currentCity, setCurrentCity] = useState(() => {
    return loadFromLocalStorage('city') || null;
  });

  const [currentCoords, setCurrentCoords] = useState(() => {
    return loadFromLocalStorage('coords') || null;
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [locationDetected, setLocationDetected] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isLocating, setIsLocating] = useState(false);

  const [recentSearches, setRecentSearches] = useState(() => {
    return loadFromLocalStorage('recent') || [];
  });

  const [favorites, setFavorites] = useState(() => {
    return loadFromLocalStorage('favorites') || [];
  });

  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const searchTimeout = useRef(null);

  // ==========================================
  // FETCH WEATHER BY COORDINATES
  // ==========================================
  const fetchWeatherByCoordsCallback = useCallback(
    async (lat, lng, cityName) => {
      if (!lat || !lng) {
        console.warn('Invalid coords:', lat, lng);
        return null;
      }

      setLoading(true);
      setError(null);

      try {
        const result = await fetchWeatherByCoords(
          lat,
          lng,
          cityName || 'Unknown'
        );

        if (!result || !result.weather) {
          throw new Error('Failed to fetch weather data');
        }

        setWeatherData(result.weather || null);
        setAqiData(result.aqi || null);
        setCurrentCoords({ lat, lng });
        setLastUpdated(new Date().toISOString());

        if (cityName) {
          setCurrentCity(cityName);
          saveToLocalStorage('city', cityName);
        }

        saveToLocalStorage('coords', { lat, lng });

        return result;
      } catch (err) {
        console.error('Weather fetch error:', err);
        setError(
          err?.message ||
            'An error occurred while fetching weather.'
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // ==========================================
  // FETCH WEATHER BY CITY
  // Uses cities.js (case-insensitive) + API fallback
  // ==========================================
  const fetchWeather = useCallback(async (city) => {
    if (!city) return null;

    setLoading(true);
    setError(null);

    try {
      // Step 1: Try static data first (case-insensitive)
      const coords = getCityCoordinates(city);

      if (coords && coords.lat && coords.lng) {
        // Static data mein mil gaya
        console.log(`✅ "${city}" found in static data`);
        const result = await fetchWeatherForCity(
          city,
          getCityCoordinates
        );

        if (result && result.weather) {
          setWeatherData(result.weather);
          setAqiData(result.aqi || null);
          setCurrentCoords(result.coords || coords);
          setLastUpdated(new Date().toISOString());
          saveToLocalStorage('city', city);
          saveToLocalStorage('coords', result.coords || coords);
          return result;
        }
      }

      // Step 2: Agar static data mein nahi mila, try API
      console.log(`🔍 "${city}" not in static, using API...`);

      const searchResults = await globalSearch(city, {
        useStatic: false,
        useAPI: true,
        limit: 1,
      });

      if (
        searchResults &&
        searchResults.length > 0 &&
        searchResults[0].lat &&
        searchResults[0].lng
      ) {
        const first = searchResults[0];
        const foundCity = first.name || city;

        console.log(`✅ "${city}" found via API:`, foundCity);

        const result = await fetchWeatherByCoords(
          first.lat,
          first.lng,
          foundCity
        );

        if (result && result.weather) {
          setWeatherData(result.weather);
          setAqiData(result.aqi || null);
          setCurrentCity(foundCity);
          setCurrentCoords({ lat: first.lat, lng: first.lng });
          setLastUpdated(new Date().toISOString());
          saveToLocalStorage('city', foundCity);
          saveToLocalStorage('coords', {
            lat: first.lat,
            lng: first.lng,
          });
          return result;
        }
      }

      // Step 3: Kuch bhi nahi mila
      throw new Error(
        `Weather data not available for "${city}". Please try another city.`
      );
    } catch (err) {
      console.error('Weather fetch error:', err);
      setError(
        err?.message ||
          'An error occurred while fetching weather.'
      );
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // ==========================================
  // SEARCH CITIES (uses geocodingApi globalSearch)
  // ==========================================
  const searchCities = useCallback(
    async (query, options = {}) => {
      if (!query || query.trim().length < 2) {
        setSearchResults([]);
        return [];
      }

      setIsSearching(true);

      try {
        const results = await globalSearch(query, {
          useStatic: true,
          useAPI: true,
          limit: 15,
          ...options,
        });

        setSearchResults(results);
        return results;
      } catch (err) {
        console.error('Search error:', err);
        setSearchResults([]);
        return [];
      } finally {
        setIsSearching(false);
      }
    },
    []
  );

  // ==========================================
  // DEBOUNCED SEARCH
  // ==========================================
  const debouncedSearch = useCallback(
    (query, delay = 300) => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }

      searchTimeout.current = setTimeout(() => {
        searchCities(query);
      }, delay);
    },
    [searchCities]
  );

  // ==========================================
  // DETECT USER LOCATION (REAL-TIME)
  // ==========================================
  const detectLocation = useCallback(() => {
    setIsLocating(true);

    // Geolocation support check
    if (!navigator.geolocation) {
      console.warn('⚠️ Geolocation not supported');
      setIsLocating(false);
      setLocationDetected(true);

      // Fallback to Islamabad
      if (!currentCity) {
        setCurrentCity('Islamabad');
        fetchWeather('Islamabad');
      }
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        console.log('📍 Location detected:', latitude, longitude);

        try {
          // Reverse geocode using geocodingApi (with local fallback)
          const locationData = await reverseGeocode(
            latitude,
            longitude
          );

          let detectedCity = 'My Location';
          let country = '';

          if (locationData) {
            detectedCity =
              locationData.address?.city ||
              locationData.address?.town ||
              locationData.address?.village ||
              locationData.name ||
              'My Location';

            country = locationData.address?.country || '';
          } else {
            // Fallback: find nearest city from static data
            const nearest = findNearestCity(latitude, longitude);
            if (nearest) {
              detectedCity = nearest.name;
              country = nearest.country || '';
            }
          }

          console.log(
            '📍 Detected city:',
            detectedCity,
            'Country:',
            country
          );

          await fetchWeatherByCoordsCallback(
            latitude,
            longitude,
            detectedCity
          );

          setLocationDetected(true);
        } catch (err) {
          console.error('❌ Reverse geocode error:', err);

          await fetchWeatherByCoordsCallback(
            latitude,
            longitude,
            `My Location (${latitude.toFixed(2)}, ${longitude.toFixed(
              2
            )})`
          );

          setLocationDetected(true);
        } finally {
          setIsLocating(false);
        }
      },
      (err) => {
        console.warn('⚠️ Location access denied:', err.message);
        setIsLocating(false);
        setLocationDetected(true);

        // Fallback to saved city or Islamabad
        if (currentCity) {
          fetchWeather(currentCity);
        } else {
          setCurrentCity('Islamabad');
          fetchWeather('Islamabad');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  }, [
    currentCity,
    fetchWeather,
    fetchWeatherByCoordsCallback,
  ]);

  // ==========================================
  // INITIAL LOAD - DETECT LOCATION
  // ==========================================
  useEffect(() => {
    const savedCoords = loadFromLocalStorage('coords');
    const savedCity = loadFromLocalStorage('city');

    if (savedCoords && savedCity) {
      // Use saved location
      console.log('📍 Using saved location:', savedCity);
      fetchWeather(savedCity);
      setLocationDetected(true);
    } else {
      // Detect location on first load
      console.log('📍 Detecting location...');
      detectLocation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ==========================================
  // SELECT CITY
  // ==========================================
  const selectCity = useCallback(
    (city) => {
      if (!city) return;

      setCurrentCity(city);

      // Add to recent searches
      const updated = [
        city,
        ...recentSearches.filter((item) => item !== city),
      ].slice(0, 10);

      setRecentSearches(updated);
      saveToLocalStorage('recent', updated);

      // Fetch weather
      fetchWeather(city);
    },
    [recentSearches, fetchWeather]
  );

  // ==========================================
  // SELECT CITY BY COORDINATES (Global Search)
  // ==========================================
  const selectCityByCoords = useCallback(
    (cityName, lat, lng) => {
      if (!cityName || !lat || !lng) return;

      setCurrentCity(cityName);
      setCurrentCoords({ lat, lng });

      fetchWeatherByCoordsCallback(lat, lng, cityName);

      const updated = [
        cityName,
        ...recentSearches.filter((item) => item !== cityName),
      ].slice(0, 10);

      setRecentSearches(updated);
      saveToLocalStorage('recent', updated);
      saveToLocalStorage('city', cityName);
      saveToLocalStorage('coords', { lat, lng });
    },
    [recentSearches, fetchWeatherByCoordsCallback]
  );

  // ==========================================
  // FAVORITES
  // ==========================================
  const toggleFavorite = useCallback(
    (city) => {
      if (!city) return;

      setFavorites((prev) => {
        let updated;

        if (prev.includes(city)) {
          updated = prev.filter((item) => item !== city);
        } else {
          updated = [...prev, city];
        }

        saveToLocalStorage('favorites', updated);
        return updated;
      });
    },
    []
  );

  const isFavorite = useCallback(
    (city) => {
      return favorites.includes(city);
    },
    [favorites]
  );

  // ==========================================
  // CLEAR RECENT SEARCHES
  // ==========================================
  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
    saveToLocalStorage('recent', []);
  }, []);

  // ==========================================
  // REMOVE SINGLE RECENT SEARCH
  // ==========================================
  const removeRecentSearch = useCallback((city) => {
    setRecentSearches((prev) => {
      const updated = prev.filter((item) => item !== city);
      saveToLocalStorage('recent', updated);
      return updated;
    });
  }, []);

  // ==========================================
  // CLEAR FAVORITES
  // ==========================================
  const clearFavorites = useCallback(() => {
    setFavorites([]);
    saveToLocalStorage('favorites', []);
  }, []);

  // ==========================================
  // REFRESH WEATHER
  // ==========================================
  const refreshWeather = useCallback(() => {
    if (currentCoords && currentCoords.lat && currentCoords.lng) {
      fetchWeatherByCoordsCallback(
        currentCoords.lat,
        currentCoords.lng,
        currentCity
      );
    } else if (currentCity) {
      fetchWeather(currentCity);
    }
  }, [
    currentCoords,
    currentCity,
    fetchWeatherByCoordsCallback,
    fetchWeather,
  ]);

  // ==========================================
  // RETRY FETCH (after error)
  // ==========================================
  const retryFetch = useCallback(() => {
    if (currentCity) {
      fetchWeather(currentCity);
    }
  }, [currentCity, fetchWeather]);

  // ==========================================
  // CONTEXT VALUE
  // ==========================================
  const value = {
    // Data
    weatherData,
    aqiData,
    currentCity,
    currentCoords,
    lastUpdated,

    // States
    loading,
    error,
    isLocating,
    isSearching,
    locationDetected,

    // Recent & Favorites
    recentSearches,
    favorites,
    searchResults,

    // Actions
    selectCity,
    selectCityByCoords,
    fetchWeather,
    fetchWeatherByCoords: fetchWeatherByCoordsCallback,
    refreshWeather,
    retryFetch,
    detectLocation,

    // Search
    searchCities,
    debouncedSearch,

    // Favorites
    toggleFavorite,
    isFavorite,
    clearFavorites,

    // Recent
    clearRecentSearches,
    removeRecentSearch,

    // Setters
    setCurrentCity,
    setCurrentCoords,
    setError,
  };

  return (
    <WeatherContext.Provider value={value}>
      {children}
    </WeatherContext.Provider>
  );
};