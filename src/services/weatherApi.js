// ==========================================
// WEATHER API SERVICE
// Open-Meteo (Weather + AQI)
// FULLY FIXED: Timezone + Dual Time Support
// ==========================================

import { getWeatherCategory } from '../utils/helpers';

const BASE_URL = 'https://api.open-meteo.com/v1/forecast';
const AQI_URL = 'https://air-quality-api.open-meteo.com/v1/air-quality';

const FETCH_TIMEOUT = 12000; // 12 seconds

// ==========================================
// HELPER: Fetch with timeout
// ==========================================
const fetchWithTimeout = async (url, options = {}) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(
    () => controller.abort(),
    FETCH_TIMEOUT
  );

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

// ==========================================
// 1. FETCH WEATHER DATA (Raw)
// ==========================================
export const fetchWeatherData = async (lat, lng) => {
  try {
    if (!lat || !lng) {
      console.error('fetchWeatherData: Invalid coords', lat, lng);
      return null;
    }

    const url =
      `${BASE_URL}?latitude=${lat}&longitude=${lng}` +
      `&current=temperature_2m,relative_humidity_2m,apparent_temperature,` +
      `precipitation,weather_code,wind_speed_10m,pressure_msl,visibility,` +
      `uv_index,is_day` +
      `&daily=weather_code,temperature_2m_max,temperature_2m_min,` +
      `sunrise,sunset,precipitation_sum,wind_speed_10m_max,uv_index_max` +
      `&hourly=temperature_2m,weather_code,precipitation,wind_speed_10m,` +
      `relative_humidity_2m,apparent_temperature` +
      `&timezone=auto&forecast_days=16`;

    const response = await fetchWithTimeout(url);

    if (!response.ok) {
      throw new Error(`Weather API Error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('Weather API timeout');
    } else {
      console.error('Weather API Error:', error.message);
    }
    return null;
  }
};

// ==========================================
// 2. FETCH AIR QUALITY (Raw)
// ==========================================
export const fetchAirQuality = async (lat, lng) => {
  try {
    if (!lat || !lng) return null;

    const url =
      `${AQI_URL}?latitude=${lat}&longitude=${lng}` +
      `&current=us_aqi,pm10,pm2_5,ozone,nitrogen_dioxide,sulphur_dioxide,carbon_monoxide` +
      `&timezone=auto`;

    const response = await fetchWithTimeout(url);

    if (!response.ok) {
      throw new Error(`AQI API Error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.warn('AQI API not available:', error.message);
    return null;
  }
};

// ==========================================
// 3. PROCESS WEATHER DATA
// Timezone fields included
// ==========================================
export const processWeatherData = (apiData, cityName) => {
  if (!apiData || !apiData.current) {
    console.error('processWeatherData: Invalid API data');
    return null;
  }

  const current = apiData.current;
  const daily = apiData.daily;
  const hourly = apiData.hourly;

  const weatherCode = current.weather_code;
  const condition = getWeatherCategory(weatherCode, '');

  const processed = {
    city: cityName || 'Unknown',

    // Current
    temperature: current.temperature_2m,
    feelsLike: current.apparent_temperature,
    humidity: current.relative_humidity_2m,
    windSpeed: current.wind_speed_10m,
    pressure: current.pressure_msl,
    visibility: current.visibility,
    uvIndex: current.uv_index,
    isDay: current.is_day === 1,
    precipitation: current.precipitation,

    // Condition
    condition: condition,
    weatherCode: weatherCode,

    // Sun
    sunrise: daily?.sunrise?.[0] || null,
    sunset: daily?.sunset?.[0] || null,

    // Today's high/low
    high: daily?.temperature_2m_max?.[0] || null,
    low: daily?.temperature_2m_min?.[0] || null,

    // Raw data for components
    dailyData: daily,
    hourlyData: hourly,

    // ==========================================
    // META — TIMEZONE (Important for dual time)
    // ==========================================
    timezone: apiData.timezone || 'UTC', // "America/New_York"
    timezoneAbbr: apiData.timezone_abbreviation || 'UTC', // "EST"
    utcOffset:
      apiData.utc_offset_seconds !== undefined
        ? apiData.utc_offset_seconds
        : 0, // -18000

    // ==========================================
    // COORDINATES
    // ==========================================
    latitude: apiData.latitude,
    longitude: apiData.longitude,
    elevation: apiData.elevation,

    // ==========================================
    // TIMESTAMP
    // ==========================================
    timestamp: new Date().toISOString(),
  };

  return processed;
};

// ==========================================
// 4. FETCH WEATHER FOR A CITY
// ==========================================
export const fetchWeatherForCity = async (
  cityName,
  getCityCoordinates
) => {
  if (!cityName) {
    console.error('fetchWeatherForCity: No city name provided');
    return null;
  }

  const coords = getCityCoordinates(cityName);

  if (!coords || !coords.lat || !coords.lng) {
    console.error(`No coordinates found for: ${cityName}`);
    return null;
  }

  try {
    const [weatherData, aqiData] = await Promise.all([
      fetchWeatherData(coords.lat, coords.lng),
      fetchAirQuality(coords.lat, coords.lng).catch(() => null),
    ]);

    if (!weatherData) {
      console.error('Failed to fetch weather data');
      return null;
    }

    const processed = processWeatherData(weatherData, cityName);
    if (!processed) {
      return null;
    }

    return {
      weather: processed,
      aqi: aqiData,
      coords: coords,
    };
  } catch (error) {
    console.error('Weather fetch error:', error);
    return null;
  }
};

// ==========================================
// 5. FETCH WEATHER BY COORDINATES
// ==========================================
export const fetchWeatherByCoords = async (
  lat,
  lng,
  cityName = 'Unknown'
) => {
  if (!lat || !lng) {
    console.error(
      'fetchWeatherByCoords: Invalid coordinates',
      lat,
      lng
    );
    return null;
  }

  try {
    const [weatherData, aqiData] = await Promise.all([
      fetchWeatherData(lat, lng),
      fetchAirQuality(lat, lng).catch(() => null),
    ]);

    if (!weatherData) {
      console.error('Failed to fetch weather data');
      return null;
    }

    const processed = processWeatherData(weatherData, cityName);
    if (!processed) {
      return null;
    }

    return {
      weather: processed,
      aqi: aqiData,
      coords: { lat, lng },
    };
  } catch (error) {
    console.error('Weather fetch by coords error:', error);
    return null;
  }
};

// ==========================================
// 6. FETCH FULL WEATHER (City OR Coords)
// ==========================================
export const fetchFullWeather = async (options = {}) => {
  const { city, lat, lng, getCityCoordinates } = options;

  if (lat && lng) {
    return await fetchWeatherByCoords(
      lat,
      lng,
      city || 'Unknown'
    );
  }

  if (city && getCityCoordinates) {
    return await fetchWeatherForCity(city, getCityCoordinates);
  }

  console.error('fetchFullWeather: No city or coords provided');
  return null;
};

// ==========================================
// 7. GET WEATHER DESCRIPTION FROM CODE
// ==========================================
export const getWeatherDescription = (code) => {
  const descriptions = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Fog',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    56: 'Light freezing drizzle',
    57: 'Dense freezing drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    66: 'Light freezing rain',
    67: 'Heavy freezing rain',
    71: 'Slight snow',
    73: 'Moderate snow',
    75: 'Heavy snow',
    77: 'Snow grains',
    80: 'Slight rain showers',
    81: 'Moderate rain showers',
    82: 'Violent rain showers',
    85: 'Slight snow showers',
    86: 'Heavy snow showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with slight hail',
    99: 'Thunderstorm with heavy hail',
  };
  return descriptions[code] || 'Unknown';
};

// ==========================================
// 8. GET WEATHER ICON FROM CODE
// ==========================================
export const getWeatherIconFromCode = (code, isDay = true) => {
  if (code === 0) return isDay ? '☀️' : '🌙';
  if (code === 1 || code === 2) return isDay ? '🌤️' : '☁️';
  if (code === 3) return '☁️';
  if (code === 45 || code === 48) return '🌫️';
  if (code >= 51 && code <= 57) return '🌦️';
  if (code >= 61 && code <= 67) return '🌧️';
  if (code >= 71 && code <= 77) return '❄️';
  if (code >= 80 && code <= 82) return '🌧️';
  if (code >= 85 && code <= 86) return '🌨️';
  if (code >= 95 && code <= 99) return '⛈️';
  return '🌤️';
};

// ==========================================
// 9. FORMAT HOURLY DATA (For Hourly Page)
// ==========================================
export const formatHourlyData = (hourlyData, limit = 24) => {
  if (!hourlyData || !hourlyData.time) return [];

  const now = new Date();
  const currentHour = now.getHours();

  return hourlyData.time
    .map((time, index) => ({
      time: time,
      hour: new Date(time).getHours(),
      temperature: hourlyData.temperature_2m?.[index],
      weatherCode: hourlyData.weather_code?.[index],
      precipitation: hourlyData.precipitation?.[index],
      windSpeed: hourlyData.wind_speed_10m?.[index],
      humidity: hourlyData.relative_humidity_2m?.[index],
      feelsLike: hourlyData.apparent_temperature?.[index],
      condition: getWeatherCategory(
        hourlyData.weather_code?.[index],
        ''
      ),
    }))
    .filter((item) => item.hour >= currentHour)
    .slice(0, limit);
};

// ==========================================
// 10. FORMAT DAILY DATA (For Forecast Page)
// ==========================================
export const formatDailyData = (dailyData, limit = 7) => {
  if (!dailyData || !dailyData.time) return [];

  return dailyData.time.slice(0, limit).map((time, index) => ({
    date: time,
    day: new Date(time).toLocaleDateString('en-US', {
      weekday: 'short',
    }),
    fullDate: new Date(time).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    }),
    weatherCode: dailyData.weather_code?.[index],
    high: dailyData.temperature_2m_max?.[index],
    low: dailyData.temperature_2m_min?.[index],
    sunrise: dailyData.sunrise?.[index],
    sunset: dailyData.sunset?.[index],
    precipitation: dailyData.precipitation_sum?.[index],
    windSpeed: dailyData.wind_speed_10m_max?.[index],
    uvIndex: dailyData.uv_index_max?.[index],
    condition: getWeatherCategory(
      dailyData.weather_code?.[index],
      ''
    ),
  }));
};

// ==========================================
// 11. HELPER: Get Time in a Specific Timezone
// FIXED: Better fallback + validation
// ==========================================
export const getTimeInTimezone = (timezone, date = new Date()) => {
  // ⚠️ Validate timezone
  if (
    !timezone ||
    timezone === '' ||
    timezone === 'undefined' ||
    typeof timezone !== 'string'
  ) {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  }

  try {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
      timeZone: timezone,
    });
  } catch (err) {
    console.warn('❌ Invalid timezone:', timezone, err.message);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  }
};

// ==========================================
// 12. HELPER: Get Date in a Specific Timezone
// FIXED: Better fallback + validation
// ==========================================
export const getDateInTimezone = (timezone, date = new Date()) => {
  // ⚠️ Validate timezone
  if (
    !timezone ||
    timezone === '' ||
    timezone === 'undefined' ||
    typeof timezone !== 'string'
  ) {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  try {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: timezone,
    });
  } catch (err) {
    console.warn(
      '❌ Invalid timezone (date):',
      timezone,
      err.message
    );
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
};

// ==========================================
// 13. HELPER: Calculate Time Difference
// Returns: "+5 hours", "-9 hours" etc.
// ==========================================
export const getTimezoneOffsetLabel = (timezone) => {
  if (!timezone) return '';

  try {
    const now = new Date();
    const tzTime = new Date(
      now.toLocaleString('en-US', { timeZone: timezone })
    );
    const pktTime = new Date(
      now.toLocaleString('en-US', { timeZone: 'Asia/Karachi' })
    );

    const diffMs = tzTime.getTime() - pktTime.getTime();
    const diffHours = Math.round(diffMs / (1000 * 60 * 60));

    if (diffHours === 0) return 'Same as PKT';
    if (diffHours > 0) return `+${diffHours}h from PKT`;
    return `${diffHours}h from PKT`;
  } catch (err) {
    return '';
  }
};

// ==========================================
// 14. EXPORT DEFAULT
// ==========================================
export default {
  fetchWeatherData,
  fetchAirQuality,
  processWeatherData,
  fetchWeatherForCity,
  fetchWeatherByCoords,
  fetchFullWeather,
  getWeatherDescription,
  getWeatherIconFromCode,
  formatHourlyData,
  formatDailyData,
  getTimeInTimezone,
  getDateInTimezone,
  getTimezoneOffsetLabel,
};