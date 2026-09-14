// ==========================================
// WEATHER BACKGROUND COMPONENT
// FULLY FIXED: Timezone-aware + hourOverride
// ==========================================

import React, { useEffect, useState } from 'react';
import {
  getWeatherBackground,
  getWeatherGradient,
  getTimeCategory,
} from '../utils/weatherBackground';

const WeatherBackground = ({
  condition = 'Sunny',
  timeOverride = null,
  timezone = null,
}) => {
  const [imageUrl, setImageUrl] = useState('');
  const [prevImageUrl, setPrevImageUrl] = useState('');
  const [isTransitioning, setIsTransitioning] = useState(false);

  // ==========================================
  // UPDATE BACKGROUND
  // Triggered when:
  // - condition changes
  // - timeOverride changes (hourly page)
  // - timezone changes (city change)
  // ==========================================
  useEffect(() => {
    const url = getWeatherBackground(
      condition,
      timeOverride,
      timezone
    );

    if (url === imageUrl) return;

    // Smooth transition
    setPrevImageUrl(imageUrl);
    setIsTransitioning(true);

    // Preload new image
    const img = new Image();
    img.src = url;

    img.onload = () => {
      setImageUrl(url);

      setTimeout(() => {
        setIsTransitioning(false);
        setPrevImageUrl('');
      }, 800);
    };

    img.onerror = () => {
      console.warn(`Failed to load: ${url}`);
      setImageUrl(url);
    };
  }, [condition, timeOverride, timezone, imageUrl]);

  // ==========================================
  // FALLBACK GRADIENT
  // ==========================================
  if (!imageUrl) {
    return (
      <div
        className="weather-background"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: getWeatherGradient(condition),
          zIndex: 0,
          transition: 'background 0.8s ease-in-out',
          pointerEvents: 'none',
        }}
      />
    );
  }

  // ==========================================
  // RENDER
  // ==========================================
  return (
    <>
      {/* Previous image (fading out) */}
      {prevImageUrl && isTransitioning && (
        <div
          className="weather-background"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: `url("${prevImageUrl}")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            zIndex: 0,
            opacity: 1,
            transition: 'opacity 0.8s ease-in-out',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Current image (fading in) */}
      <div
        className="weather-background"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: `url("${imageUrl}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          zIndex: 1,
          opacity: imageUrl ? 1 : 0,
          transition: 'opacity 0.8s ease-in-out',
          pointerEvents: 'none',
        }}
      />
    </>
  );
};

export default WeatherBackground;