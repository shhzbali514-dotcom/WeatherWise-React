// ==========================================
// WEATHER ALERTS SYSTEM
// Thunderstorm, Heavy Rain, Heatwave, etc.
// ==========================================

export const generateWeatherAlerts = (weatherData, aqiData) => {
  if (!weatherData) return [];

  const alerts = [];

  const {
    weatherCode,
    temperature,
    windSpeed,
    humidity,
    uvIndex,
    visibility,
  } = weatherData;

  // 1. THUNDERSTORM
  if (weatherCode >= 95 && weatherCode <= 99) {
    alerts.push({
      id: 'thunderstorm',
      type: 'danger',
      icon: '⛈️',
      title: 'Thunderstorm Warning',
      message:
        'Thunderstorm detected in your area. Stay indoors and avoid open spaces.',
      priority: 1,
    });
  }

  // 2. HEAVY RAIN
  if (weatherCode >= 63 && weatherCode <= 67) {
    alerts.push({
      id: 'heavy-rain',
      type: 'warning',
      icon: '🌧️',
      title: 'Heavy Rain Warning',
      message:
        'Heavy rain expected. Avoid low-lying areas and drive carefully.',
      priority: 2,
    });
  }

  if (weatherCode >= 80 && weatherCode <= 82) {
    alerts.push({
      id: 'rain-showers',
      type: 'warning',
      icon: '🌧️',
      title: 'Rain Showers',
      message:
        'Rain showers expected. Carry an umbrella and plan accordingly.',
      priority: 3,
    });
  }

  // 3. HEAVY SNOW
  if (weatherCode >= 73 && weatherCode <= 77) {
    alerts.push({
      id: 'heavy-snow',
      type: 'danger',
      icon: '❄️',
      title: 'Heavy Snow Warning',
      message: 'Heavy snow expected. Avoid travel and stay warm.',
      priority: 2,
    });
  }

  // 4. FOG
  if (weatherCode === 45 || weatherCode === 48) {
    alerts.push({
      id: 'fog',
      type: 'warning',
      icon: '🌫️',
      title: 'Fog Warning',
      message:
        'Dense fog detected. Drive slowly and use fog lights.',
      priority: 3,
    });
  }

  // 5. HEATWAVE
  if (temperature >= 40) {
    alerts.push({
      id: 'extreme-heat',
      type: 'danger',
      icon: '🔥',
      title: 'Extreme Heat Warning',
      message:
        'Temperature above 40°C. Stay hydrated and avoid sun exposure.',
      priority: 1,
    });
  } else if (temperature >= 35) {
    alerts.push({
      id: 'heat',
      type: 'warning',
      icon: '🌡️',
      title: 'Heat Advisory',
      message:
        'High temperature. Drink plenty of water and avoid outdoor activities.',
      priority: 2,
    });
  }

  // 6. COLD WAVE
  if (temperature <= 0) {
    alerts.push({
      id: 'freezing',
      type: 'danger',
      icon: '🥶',
      title: 'Freezing Temperature',
      message:
        'Temperature below 0°C. Risk of frostbite. Stay warm.',
      priority: 1,
    });
  } else if (temperature <= 5) {
    alerts.push({
      id: 'cold',
      type: 'warning',
      icon: '❄️',
      title: 'Cold Weather Advisory',
      message:
        'Low temperature. Wear warm clothes and limit outdoor time.',
      priority: 2,
    });
  }

  // 7. HIGH WIND
  if (windSpeed >= 60) {
    alerts.push({
      id: 'storm-wind',
      type: 'danger',
      icon: '🌪️',
      title: 'Storm Wind Warning',
      message:
        'Very strong winds. Secure loose objects and avoid travel.',
      priority: 1,
    });
  } else if (windSpeed >= 40) {
    alerts.push({
      id: 'strong-wind',
      type: 'warning',
      icon: '💨',
      title: 'Strong Wind Advisory',
      message: 'Strong winds expected. Be careful while driving.',
      priority: 2,
    });
  }

  // 8. LOW VISIBILITY
  if (visibility !== null && visibility !== undefined) {
    if (visibility < 1000) {
      alerts.push({
        id: 'low-visibility',
        type: 'danger',
        icon: '👁️',
        title: 'Very Low Visibility',
        message:
          'Visibility below 1 km. Avoid unnecessary travel.',
        priority: 2,
      });
    } else if (visibility < 3000) {
      alerts.push({
        id: 'reduced-visibility',
        type: 'warning',
        icon: '👁️',
        title: 'Reduced Visibility',
        message: 'Visibility below 3 km. Drive carefully.',
        priority: 3,
      });
    }
  }

  // 9. HIGH UV
  if (uvIndex >= 11) {
    alerts.push({
      id: 'extreme-uv',
      type: 'danger',
      icon: '☀️',
      title: 'Extreme UV Radiation',
      message:
        'UV index above 11. Avoid sun exposure between 10am–4pm.',
      priority: 2,
    });
  } else if (uvIndex >= 8) {
    alerts.push({
      id: 'high-uv',
      type: 'warning',
      icon: '🕶️',
      title: 'High UV Radiation',
      message:
        'UV index high. Wear sunscreen and sunglasses.',
      priority: 3,
    });
  }

  // 10. HIGH HUMIDITY
  if (humidity >= 90 && temperature >= 30) {
    alerts.push({
      id: 'high-humidity',
      type: 'warning',
      icon: '💧',
      title: 'High Humidity',
      message:
        'Very humid conditions. Risk of heat exhaustion.',
      priority: 3,
    });
  }

  // 11. AQI ALERT
  if (aqiData && aqiData.current) {
    const aqi = aqiData.current.us_aqi;

    if (aqi >= 301) {
      alerts.push({
        id: 'hazardous-aqi',
        type: 'danger',
        icon: '☠️',
        title: 'Hazardous Air Quality',
        message:
          'AQI above 300. Stay indoors and use air purifier.',
        priority: 1,
      });
    } else if (aqi >= 201) {
      alerts.push({
        id: 'very-unhealthy-aqi',
        type: 'danger',
        icon: '😷',
        title: 'Very Unhealthy Air',
        message: 'AQI above 200. Avoid outdoor activities.',
        priority: 2,
      });
    } else if (aqi >= 151) {
      alerts.push({
        id: 'unhealthy-aqi',
        type: 'warning',
        icon: '😷',
        title: 'Unhealthy Air Quality',
        message: 'AQI above 150. Wear a mask outdoors.',
        priority: 3,
      });
    } else if (aqi >= 101) {
      alerts.push({
        id: 'moderate-aqi',
        type: 'info',
        icon: '😐',
        title: 'Moderate Air Quality',
        message:
          'AQI above 100. Sensitive groups should limit outdoor time.',
        priority: 4,
      });
    }
  }

  // Sort by priority (1 = highest)
  return alerts.sort((a, b) => a.priority - b.priority);
};

// ==========================================
// GET ALERT COLORS
// ==========================================
export const getAlertColors = (type) => {
  const colors = {
    danger: {
      bg: 'rgba(239, 68, 68, 0.15)',
      border: 'rgba(239, 68, 68, 0.3)',
      text: '#ef4444',
      icon: '#dc2626',
    },
    warning: {
      bg: 'rgba(245, 158, 11, 0.15)',
      border: 'rgba(245, 158, 11, 0.3)',
      text: '#f59e0b',
      icon: '#d97706',
    },
    info: {
      bg: 'rgba(59, 130, 246, 0.15)',
      border: 'rgba(59, 130, 246, 0.3)',
      text: '#3b82f6',
      icon: '#2563eb',
    },
    success: {
      bg: 'rgba(16, 185, 129, 0.15)',
      border: 'rgba(16, 185, 129, 0.3)',
      text: '#10b981',
      icon: '#059669',
    },
  };

  return colors[type] || colors.info;
};

export const getHighestPriorityAlert = (alerts) => {
  if (!alerts || alerts.length === 0) return null;
  return alerts[0];
};

export default {
  generateWeatherAlerts,
  getAlertColors,
  getHighestPriorityAlert,
};