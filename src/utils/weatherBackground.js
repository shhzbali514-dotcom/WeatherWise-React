// ==========================================
// WEATHER BACKGROUND SYSTEM - 24 IMAGES
// FULLY FIXED: Timezone-aware + Country-accurate
// ==========================================

// ==========================================
// IMPORT ALL 24 IMAGES FROM ASSETS FOLDER
// ==========================================

// Morning (6 images)
import morningSunny from '../assets/backgrounds/Morning Sunny.png';
import morningCloudy from '../assets/backgrounds/Morning Cloudy.png';
import morningRainy from '../assets/backgrounds/Morning Rainy.png';
import morningSnowy from '../assets/backgrounds/Morning Snowy.png';
import morningFoggy from '../assets/backgrounds/Morning Foggy.png';
import morningThunderstorm from '../assets/backgrounds/Morning Thunderstorm.png';

// Afternoon (6 images)
import afternoonSunny from '../assets/backgrounds/Afternoon Sunny.png';
import afternoonCloudy from '../assets/backgrounds/Afternoon Cloudy.png';
import afternoonRainy from '../assets/backgrounds/Afternoon Rainy.png';
import afternoonSnowy from '../assets/backgrounds/Afternoon Snowy.png';
import afternoonFoggy from '../assets/backgrounds/Afternoon Foggy.png';
import afternoonThunderstorm from '../assets/backgrounds/Afternoon Thunderstorm.png';

// Evening (6 images)
import eveningSunny from '../assets/backgrounds/Evening Sunny.png';
import eveningCloudy from '../assets/backgrounds/Evening Cloudy.png';
import eveningRainy from '../assets/backgrounds/Evening Rainy.png';
import eveningSnowy from '../assets/backgrounds/Evening Snowy.png';
import eveningFoggy from '../assets/backgrounds/Evening Foggy.png';
import eveningThunderstorm from '../assets/backgrounds/Evening Thunderstorm.png';

// Night (6 images)
import nightSunny from '../assets/backgrounds/Night Sunny.png';
import nightCloudy from '../assets/backgrounds/Night Cloudy.png';
import nightRainy from '../assets/backgrounds/Night Rainy.png';
import nightSnowy from '../assets/backgrounds/Night Snowy.png';
import nightFoggy from '../assets/backgrounds/Night Foggy.png';
import nightThunderstorm from '../assets/backgrounds/Night Thunderstorm.png';

// ==========================================
// IMAGE MAP (24 images - Vite imports)
// ==========================================
export const WEATHER_IMAGES = {
  Morning: {
    Sunny: morningSunny,
    Cloudy: morningCloudy,
    Rainy: morningRainy,
    Snowy: morningSnowy,
    Foggy: morningFoggy,
    Thunderstorm: morningThunderstorm,
  },
  Afternoon: {
    Sunny: afternoonSunny,
    Cloudy: afternoonCloudy,
    Rainy: afternoonRainy,
    Snowy: afternoonSnowy,
    Foggy: afternoonFoggy,
    Thunderstorm: afternoonThunderstorm,
  },
  Evening: {
    Sunny: eveningSunny,
    Cloudy: eveningCloudy,
    Rainy: eveningRainy,
    Snowy: eveningSnowy,
    Foggy: eveningFoggy,
    Thunderstorm: eveningThunderstorm,
  },
  Night: {
    Sunny: nightSunny,
    Cloudy: nightCloudy,
    Rainy: nightRainy,
    Snowy: nightSnowy,
    Foggy: nightFoggy,
    Thunderstorm: nightThunderstorm,
  },
};

// ==========================================
// WEATHER EMOJIS
// ==========================================
export const WEATHER_EMOJIS = {
  Sunny: '☀️',
  Cloudy: '☁️',
  Rainy: '🌧️',
  Snowy: '❄️',
  Foggy: '🌫️',
  Thunderstorm: '⛈️',
};

// ==========================================
// WEATHER GRADIENTS (Fallback colors)
// ==========================================
export const WEATHER_GRADIENTS = {
  Sunny: 'linear-gradient(135deg, #0f172a, #1e3a5f, #f59e0b)',
  Cloudy: 'linear-gradient(135deg, #1a1a2e, #2d2d44, #4a4a6a)',
  Rainy: 'linear-gradient(135deg, #0f172a, #1a2a3a, #3b6e8f)',
  Snowy: 'linear-gradient(135deg, #1a1a3e, #3a3a6a, #8a8aaa)',
  Foggy: 'linear-gradient(135deg, #2a2a3e, #4a4a5e, #6a6a7e)',
  Thunderstorm: 'linear-gradient(135deg, #0a0a1a, #1a0a2a, #4a1a3a)',
};

// ==========================================
// NORMALIZE CONDITION (Case-insensitive)
// ==========================================
const normalizeCondition = (condition) => {
  if (!condition) return 'Sunny';

  const cond = String(condition).trim();
  const keys = [
    'Sunny',
    'Cloudy',
    'Rainy',
    'Snowy',
    'Foggy',
    'Thunderstorm',
  ];

  // Exact match
  if (keys.includes(cond)) return cond;

  // Case-insensitive match
  const lower = cond.toLowerCase();
  const match = keys.find((k) => k.toLowerCase() === lower);
  if (match) return match;

  return 'Sunny';
};

// ==========================================
// GET HOUR IN A SPECIFIC TIMEZONE
// If timezone provided → use it
// If not → use browser time
// ==========================================
const getHourInTimezone = (timezone = null) => {
  try {
    if (timezone && typeof timezone === 'string') {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        hour12: false,
        timeZone: timezone,
      });

      const hour = parseInt(timeStr, 10);
      if (!isNaN(hour)) return hour;
    }
  } catch (err) {
    console.warn('Invalid timezone for background:', timezone);
  }

  // Fallback: browser time
  return new Date().getHours();
};

// ==========================================
// GET TIME CATEGORY
// Priority:
//   1. hourOverride (manual — hourly page)
//   2. timezone (city's timezone)
//   3. browser time
// ==========================================
export const getTimeCategory = (
  hourOverride = null,
  timezone = null
) => {
  let hour;

  // Priority 1: Manual hour override
  if (
    hourOverride !== null &&
    hourOverride !== undefined &&
    hourOverride >= 0 &&
    hourOverride <= 23
  ) {
    hour = hourOverride;
  }
  // Priority 2: City's timezone
  else if (timezone) {
    hour = getHourInTimezone(timezone);
  }
  // Priority 3: Browser time
  else {
    hour = new Date().getHours();
  }

  if (hour >= 5 && hour < 12) return 'Morning';
  if (hour >= 12 && hour < 17) return 'Afternoon';
  if (hour >= 17 && hour < 21) return 'Evening';
  return 'Night';
};

// ==========================================
// GET BACKGROUND IMAGE URL
// FULLY FIXED: timezone + hourOverride support
// ==========================================
export const getWeatherBackground = (
  condition = 'Sunny',
  hourOverride = null,
  timezone = null
) => {
  const timePeriod = getTimeCategory(hourOverride, timezone);
  const normalizedCondition = normalizeCondition(condition);

  let imageUrl = null;

  // Debug log
  console.log(
    `🎨 Background: ${timePeriod} + ${normalizedCondition}` +
      ` | hour: ${hourOverride ?? 'auto'}` +
      ` | tz: ${timezone ?? 'browser'}`
  );

  try {
    if (
      WEATHER_IMAGES[timePeriod] &&
      WEATHER_IMAGES[timePeriod][normalizedCondition]
    ) {
      imageUrl = WEATHER_IMAGES[timePeriod][normalizedCondition];
    } else {
      // Fallback: find weather type in any time period
      for (const period of Object.keys(WEATHER_IMAGES)) {
        if (WEATHER_IMAGES[period][normalizedCondition]) {
          imageUrl = WEATHER_IMAGES[period][normalizedCondition];
          break;
        }
      }
    }
  } catch (e) {
    console.error('Error accessing WEATHER_IMAGES:', e);
  }

  if (!imageUrl) {
    console.warn(
      `No image for: ${timePeriod} + ${normalizedCondition}, using fallback`
    );
    imageUrl = WEATHER_IMAGES.Morning.Sunny;
  }

  return imageUrl;
};

// ==========================================
// GET GRADIENT FALLBACK
// ==========================================
export const getWeatherGradient = (condition = 'Sunny') => {
  const normalized = normalizeCondition(condition);
  return (
    WEATHER_GRADIENTS[normalized] || WEATHER_GRADIENTS.Sunny
  );
};

// ==========================================
// GET WEATHER EMOJI
// ==========================================
export const getWeatherEmoji = (condition = 'Sunny') => {
  const normalized = normalizeCondition(condition);
  return WEATHER_EMOJIS[normalized] || '🌤️';
};

// ==========================================
// PRELOAD ALL 24 IMAGES
// ==========================================
export const preloadWeatherImages = () => {
  const images = [];
  for (const timePeriod of Object.keys(WEATHER_IMAGES)) {
    for (const weatherType of Object.keys(
      WEATHER_IMAGES[timePeriod]
    )) {
      const img = new Image();
      img.src = WEATHER_IMAGES[timePeriod][weatherType];
      images.push(img);
    }
  }
  return images;
};

// ==========================================
// PRELOAD CURRENT + NEXT + PREVIOUS
// ==========================================
export const preloadCurrentAndNext = (timezone = null) => {
  const timePeriod = getTimeCategory(null, timezone);
  const timePeriods = ['Morning', 'Afternoon', 'Evening', 'Night'];
  const currentIndex = timePeriods.indexOf(timePeriod);
  const nextIndex = (currentIndex + 1) % timePeriods.length;
  const prevIndex =
    (currentIndex - 1 + timePeriods.length) % timePeriods.length;

  const periodsToLoad = [
    timePeriods[currentIndex],
    timePeriods[nextIndex],
    timePeriods[prevIndex],
  ];

  const images = [];
  for (const period of periodsToLoad) {
    for (const weatherType of Object.keys(WEATHER_IMAGES[period])) {
      const img = new Image();
      img.src = WEATHER_IMAGES[period][weatherType];
      images.push(img);
    }
  }

  return images;
};

// ==========================================
// GET ALL 24 IMAGE URLS
// ==========================================
export const getAllImageUrls = () => {
  const urls = [];
  for (const timePeriod of Object.keys(WEATHER_IMAGES)) {
    for (const weatherType of Object.keys(
      WEATHER_IMAGES[timePeriod]
    )) {
      urls.push({
        time: timePeriod,
        weather: weatherType,
        url: WEATHER_IMAGES[timePeriod][weatherType],
      });
    }
  }
  return urls;
};

// ==========================================
// EXPORT DEFAULT
// ==========================================
export default {
  WEATHER_IMAGES,
  WEATHER_EMOJIS,
  WEATHER_GRADIENTS,
  getTimeCategory,
  getWeatherBackground,
  getWeatherGradient,
  getWeatherEmoji,
  preloadWeatherImages,
  preloadCurrentAndNext,
  getAllImageUrls,
};