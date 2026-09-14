// ==========================================
// ELEVATION API SERVICE
// Open-Elevation + Open-Meteo Elevation
// ==========================================

// ==========================================
// GET ELEVATION FOR SINGLE POINT
// ==========================================
export const getElevation = async (lat, lng) => {
  if (!lat || !lng) return null;

  try {
    // Try Open-Meteo first (more reliable)
    const url = `https://api.open-meteo.com/v1/elevation?latitude=${lat}&longitude=${lng}`;
    const response = await fetch(url);

    if (response.ok) {
      const data = await response.json();
      if (data.elevation && data.elevation.length > 0) {
        return {
          lat: lat,
          lng: lng,
          elevation: data.elevation[0],
          unit: 'm'
        };
      }
    }

    // Fallback to Open-Elevation
    const fallbackUrl = `https://api.open-elevation.com/api/v1/lookup?locations=${lat},${lng}`;
    const fallbackResponse = await fetch(fallbackUrl);

    if (fallbackResponse.ok) {
      const data = await fallbackResponse.json();
      if (data.results && data.results.length > 0) {
        return {
          lat: lat,
          lng: lng,
          elevation: data.results[0].elevation,
          unit: 'm'
        };
      }
    }

    return null;
  } catch (error) {
    console.error('Elevation error:', error);
    return null;
  }
};

// ==========================================
// GET ELEVATION FOR MULTIPLE POINTS
// ==========================================
export const getElevationBatch = async (points) => {
  if (!points || points.length === 0) return [];

  try {
    // Open-Meteo batch
    const lats = points.map((p) => p.lat).join(',');
    const lngs = points.map((p) => p.lng).join(',');
    const url = `https://api.open-meteo.com/v1/elevation?latitude=${lats}&longitude=${lngs}`;

    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      if (data.elevation && data.elevation.length > 0) {
        return data.elevation.map((elev, i) => ({
          lat: points[i].lat,
          lng: points[i].lng,
          elevation: elev,
          unit: 'm'
        }));
      }
    }

    // Fallback to Open-Elevation
    const locations = points.map((p) => `${p.lat},${p.lng}`).join('|');
    const fallbackUrl = `https://api.open-elevation.com/api/v1/lookup?locations=${locations}`;
    const fallbackResponse = await fetch(fallbackUrl);

    if (fallbackResponse.ok) {
      const data = await fallbackResponse.json();
      if (data.results) {
        return data.results.map((r, i) => ({
          lat: points[i].lat,
          lng: points[i].lng,
          elevation: r.elevation,
          unit: 'm'
        }));
      }
    }

    return [];
  } catch (error) {
    console.error('Batch elevation error:', error);
    return [];
  }
};

// ==========================================
// GET ELEVATION ALONG A PATH
// ==========================================
export const getElevationProfile = async (coordinates, samples = 50) => {
  if (!coordinates || coordinates.length < 2) return null;

  try {
    // Resample coordinates to reduce API calls
    const sampled = resampleCoordinates(coordinates, samples);

    const lats = sampled.map((c) => c.lat).join(',');
    const lngs = sampled.map((c) => c.lng).join(',');
    const url = `https://api.open-meteo.com/v1/elevation?latitude=${lats}&longitude=${lngs}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error(`Elevation error: ${response.status}`);

    const data = await response.json();

    if (!data.elevation) return null;

    const profile = data.elevation.map((elev, i) => ({
      lat: sampled[i].lat,
      lng: sampled[i].lng,
      elevation: elev
    }));

    // Calculate stats
    const elevations = profile.map((p) => p.elevation);
    const minElev = Math.min(...elevations);
    const maxElev = Math.max(...elevations);
    const totalGain = calculateElevationGain(elevations);
    const totalLoss = calculateElevationLoss(elevations);

    return {
      profile: profile,
      stats: {
        min: minElev,
        max: maxElev,
        gain: totalGain,
        loss: totalLoss,
        range: maxElev - minElev
      },
      unit: 'm'
    };
  } catch (error) {
    console.error('Elevation profile error:', error);
    return null;
  }
};

// ==========================================
// RESAMPLE COORDINATES
// ==========================================
const resampleCoordinates = (coords, samples) => {
  if (coords.length <= samples) return coords;

  const result = [];
  const step = (coords.length - 1) / (samples - 1);

  for (let i = 0; i < samples; i++) {
    const index = Math.round(i * step);
    result.push(coords[index]);
  }

  return result;
};

// ==========================================
// CALCULATE ELEVATION GAIN
// ==========================================
const calculateElevationGain = (elevations) => {
  let gain = 0;
  for (let i = 1; i < elevations.length; i++) {
    const diff = elevations[i] - elevations[i - 1];
    if (diff > 0) gain += diff;
  }
  return Math.round(gain);
};

// ==========================================
// CALCULATE ELEVATION LOSS
// ==========================================
const calculateElevationLoss = (elevations) => {
  let loss = 0;
  for (let i = 1; i < elevations.length; i++) {
    const diff = elevations[i] - elevations[i - 1];
    if (diff < 0) loss += Math.abs(diff);
  }
  return Math.round(loss);
};

// ==========================================
// GET TERRAIN TYPE FROM ELEVATION
// ==========================================
export const getTerrainType = (elevation) => {
  if (elevation === null || elevation === undefined) return 'Unknown';
  if (elevation < 0) return 'Below Sea Level';
  if (elevation < 100) return 'Plains';
  if (elevation < 500) return 'Low Hills';
  if (elevation < 1000) return 'Hills';
  if (elevation < 2000) return 'Mountains';
  if (elevation < 4000) return 'High Mountains';
  return 'Very High Mountains';
};

// ==========================================
// GET ELEVATION COLOR
// ==========================================
export const getElevationColor = (elevation) => {
  if (elevation === null || elevation === undefined) return '#6b7280';
  if (elevation < 0) return '#1e3a8a';
  if (elevation < 100) return '#22c55e';
  if (elevation < 500) return '#84cc16';
  if (elevation < 1000) return '#eab308';
  if (elevation < 2000) return '#f97316';
  if (elevation < 4000) return '#dc2626';
  return '#7c2d12';
};