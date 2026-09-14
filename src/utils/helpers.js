// ==========================================
// WEATHERWISE REACT - HELPER UTILITIES
// ==========================================

// Format temperature based on unit
export const formatTemp = (temp, unit = 'celsius') => {
  if (temp === null || temp === undefined) return '--';
  if (unit === 'fahrenheit') {
    return `${Math.round((temp * 9) / 5 + 32)}°F`;
  }
  return `${Math.round(temp)}°`;
};

// Get weather category from weather code
export const getWeatherCategory = (weatherCode, conditionText = '') => {
  const code = Number(weatherCode);
  const text = (conditionText || '').toLowerCase();

  if (code >= 95 || text.includes('thunder') || text.includes('storm')) {
    return 'Thunderstorm';
  }
  if ((code >= 71 && code <= 77) || (code === 85 || code === 86) || text.includes('snow')) {
    return 'Snowy';
  }
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82) || text.includes('rain') || text.includes('drizzle') || text.includes('shower')) {
    return 'Rainy';
  }
  if ((code >= 45 && code <= 48) || text.includes('fog') || text.includes('mist') || text.includes('haze')) {
    return 'Foggy';
  }
  if (code === 1 || code === 2 || code === 3 || text.includes('cloud') || text.includes('overcast')) {
    return 'Cloudy';
  }
  if (code === 0 || text.includes('clear') || text.includes('sun')) {
    return 'Sunny';
  }

  if (text.includes('sun')) return 'Sunny';
  if (text.includes('cloud')) return 'Cloudy';
  if (text.includes('rain')) return 'Rainy';
  if (text.includes('snow')) return 'Snowy';
  if (text.includes('fog')) return 'Foggy';
  if (text.includes('thunder')) return 'Thunderstorm';

  return 'Sunny';
};

// Get weather icon
export const getWeatherIcon = (condition) => {
  const icons = {
    'Sunny': '☀️',
    'Cloudy': '☁️',
    'Foggy': '🌫️',
    'Rainy': '🌧️',
    'Snowy': '❄️',
    'Thunderstorm': '⛈️'
  };
  return icons[condition] || '🌤️';
};

// Get time category (Morning, Afternoon, Evening, Night)
export const getTimeCategory = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'Morning';
  if (hour >= 12 && hour < 17) return 'Afternoon';
  if (hour >= 17 && hour < 21) return 'Evening';
  return 'Night';
};

// Format date
export const formatDate = () => {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Format time
export const formatTime = (date) => {
  if (!date) return '--:--';
  return new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

/// Get province from city name
export const getProvinceFromCity = (city) => {
  const provinces = {
    'Punjab': ['Lahore', 'Faisalabad', 'Rawalpindi', 'Multan', 'Gujranwala', 'Sargodha', 'Sialkot', 'Bahawalpur', 'Okara', 'Sahiwal', 'Rahim Yar Khan', 'Dera Ghazi Khan', 'Sheikhupura', 'Kasur', 'Jhelum', 'Khanewal', 'Hafizabad', 'Muzaffargarh', 'Mianwali', 'Vehari', 'Jhang', 'Gojra', 'Chiniot', 'Kamoke', 'Mandi Bahauddin', 'Toba Tek Singh', 'Layyah', 'Bhakkar', 'Pakpattan', 'Nankana Sahib', 'Khushab', 'Chichawatni'],
    'Sindh': ['Karachi', 'Hyderabad', 'Sukkur', 'Larkana', 'Nawabshah', 'Mirpur Khas', 'Khairpur', 'Thatta', 'Badin', 'Dadu', 'Shikarpur', 'Jacobabad', 'Kashmore', 'Sanghar', 'Umerkot', 'Kandhkot', 'Ghotki', 'Tando Allahyar', 'Tando Muhammad Khan', 'Moro', 'Kamber', 'Shahdadkot', 'Sehwan'],
    'Khyber Pakhtunkhwa': ['Peshawar', 'Abbottabad', 'Mardan', 'Swat', 'Dera Ismail Khan', 'Mansehra', 'Kohat', 'Bannu', 'Charsadda', 'Nowshera', 'Mingora', 'Haripur', 'Swabi', 'Timergara', 'Batkhela', 'Chitral', 'Parachinar', 'Landi Kotal', 'Tank', 'Lakki Marwat', 'Hangu', 'Karak'],
    'Balochistan': ['Quetta', 'Gwadar', 'Turbat', 'Khuzdar', 'Chaman', 'Sibi', 'Loralai', 'Zhob', 'Pishin', 'Muslim Bagh', 'Mastung', 'Kalat', 'Kharan', 'Washuk', 'Awaran', 'Kech', 'Lasbela', 'Hub', 'Dalbandin', 'Noshki', 'Panjgur'],
    'Islamabad': ['Islamabad'],
    'Gilgit-Baltistan': ['Gilgit', 'Skardu', 'Hunza', 'Nagar', 'Ghanche', 'Shigar', 'Astore', 'Diamer', 'Ghizer', 'Kharmang', 'Rondu', 'Danyor', 'Karimabad', 'Aliabad'],
    'Azad Kashmir': ['Muzaffarabad', 'Mirpur', 'Kotli', 'Bhimber', 'Rawalakot', 'Neelum', 'Baghdadi', 'Poonch', 'Sudhanoti', 'Hattian', 'Haveli', 'Jhelum Valley']
  };
  
  for (const [province, cities] of Object.entries(provinces)) {
    if (cities.includes(city)) return province;
  }
  return 'Unknown';
};

// AQI level
export const getAQILevel = (aqi) => {
  if (aqi <= 50) return { label: 'Good', color: '#10b981' };
  if (aqi <= 100) return { label: 'Moderate', color: '#f59e0b' };
  if (aqi <= 150) return { label: 'Unhealthy for Sensitive', color: '#f97316' };
  if (aqi <= 200) return { label: 'Unhealthy', color: '#ef4444' };
  if (aqi <= 300) return { label: 'Very Unhealthy', color: '#7c3aed' };
  return { label: 'Hazardous', color: '#dc2626' };
};

// Save to localStorage
export const saveToLocalStorage = (key, data) => {
  try {
    localStorage.setItem(`weatherwise_${key}`, JSON.stringify(data));
  } catch (e) {
    console.warn('Save error:', e);
  }
};

// Load from localStorage
export const loadFromLocalStorage = (key) => {
  try {
    const data = localStorage.getItem(`weatherwise_${key}`);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
};

// Debounce
export const debounce = (func, wait) => {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};