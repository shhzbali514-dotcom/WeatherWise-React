// ==========================================
// DISTANCE CALCULATOR UTILITY
// Haversine, Vincenty, Bearing, and more
// ==========================================

// ==========================================
// HAVERSINE DISTANCE (Most Common)
// Returns distance in kilometers
// ==========================================
export const haversineDistance = (lat1, lng1, lat2, lng2, unit = 'km') => {
  const R = 6371; // Earth's radius in km

  const toRad = (deg) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return convertDistance(distance, unit);
};

// ==========================================
// VINCENTY FORMULA (More Accurate)
// Returns distance in kilometers
// ==========================================
export const vincentyDistance = (lat1, lng1, lat2, lng2, unit = 'km') => {
  const a = 6378137; // WGS-84 semi-major axis
  const b = 6356752.314245; // WGS-84 semi-minor axis
  const f = 1 / 298.257223563; // WGS-84 flattening

  const toRad = (deg) => (deg * Math.PI) / 180;

  const L = toRad(lng2 - lng1);
  const U1 = Math.atan((1 - f) * Math.tan(toRad(lat1)));
  const U2 = Math.atan((1 - f) * Math.tan(toRad(lat2)));

  const sinU1 = Math.sin(U1);
  const cosU1 = Math.cos(U1);
  const sinU2 = Math.sin(U2);
  const cosU2 = Math.cos(U2);

  let lambda = L;
  let lambdaP;
  let iterLimit = 100;
  let cosSqAlpha;
  let sinSigma;
  let cos2SigmaM;
  let cosSigma;
  let sigma;

  do {
    const sinLambda = Math.sin(lambda);
    const cosLambda = Math.cos(lambda);

    sinSigma = Math.sqrt(
      cosU2 * sinLambda * (cosU2 * sinLambda) +
        (cosU1 * sinU2 - sinU1 * cosU2 * cosLambda) *
          (cosU1 * sinU2 - sinU1 * cosU2 * cosLambda)
    );

    if (sinSigma === 0) return 0;

    cosSigma = sinU1 * sinU2 + cosU1 * cosU2 * cosLambda;
    sigma = Math.atan2(sinSigma, cosSigma);

    const sinAlpha = (cosU1 * cosU2 * sinLambda) / sinSigma;
    cosSqAlpha = 1 - sinAlpha * sinAlpha;
    cos2SigmaM =
      cosSqAlpha !== 0
        ? cosSigma - (2 * sinU1 * sinU2) / cosSqAlpha
        : 0;

    const C = (f / 16) * cosSqAlpha * (4 + f * (4 - 3 * cosSqAlpha));
    lambdaP = lambda;
    lambda =
      L +
      (1 - C) *
        f *
        sinAlpha *
        (sigma +
          C *
            sinSigma *
            (cos2SigmaM +
              C * cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM)));
  } while (Math.abs(lambda - lambdaP) > 1e-12 && --iterLimit > 0);

  if (iterLimit === 0) return null;

  const uSq = (cosSqAlpha * (a * a - b * b)) / (b * b);
  const A = 1 + (uSq / 16384) * (4096 + uSq * (-768 + uSq * (320 - 175 * uSq)));
  const B = (uSq / 1024) * (256 + uSq * (-128 + uSq * (74 - 47 * uSq)));

  const deltaSigma =
    B *
    sinSigma *
    (cos2SigmaM +
      (B / 4) *
        (cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM) -
          (B / 6) *
            cos2SigmaM *
            (-3 + 4 * sinSigma * sinSigma) *
            (-3 + 4 * cos2SigmaM * cos2SigmaM)));

  const s = b * A * (sigma - deltaSigma);

  return convertDistance(s / 1000, unit);
};

// ==========================================
// CONVERT DISTANCE UNITS
// ==========================================
export const convertDistance = (km, unit = 'km') => {
  const conversions = {
    km: 1,
    m: 1000,
    mi: 0.621371,
    yd: 1093.61,
    ft: 3280.84,
    nmi: 0.539957
  };

  return km * (conversions[unit] || 1);
};

// ==========================================
// CALCULATE BEARING
// ==========================================
export const calculateBearing = (lat1, lng1, lat2, lng2) => {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const toDeg = (rad) => (rad * 180) / Math.PI;

  const dLng = toRad(lng2 - lng1);

  const y = Math.sin(dLng) * Math.cos(toRad(lat2));
  const x =
    Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
    Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(dLng);

  const bearing = (toDeg(Math.atan2(y, x)) + 360) % 360;
  return bearing;
};

// ==========================================
// GET BEARING DIRECTION TEXT
// ==========================================
export const getBearingText = (bearing) => {
  const directions = [
    'N', 'NNE', 'NE', 'ENE',
    'E', 'ESE', 'SE', 'SSE',
    'S', 'SSW', 'SW', 'WSW',
    'W', 'WNW', 'NW', 'NNW'
  ];
  const index = Math.round(bearing / 22.5) % 16;
  return directions[index];
};

// ==========================================
// CALCULATE MIDPOINT
// ==========================================
export const getMidpoint = (lat1, lng1, lat2, lng2) => {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const toDeg = (rad) => (rad * 180) / Math.PI;

  const dLng = toRad(lng2 - lng1);
  const lat1Rad = toRad(lat1);
  const lat2Rad = toRad(lat2);
  const lng1Rad = toRad(lng1);

  const Bx = Math.cos(lat2Rad) * Math.cos(dLng);
  const By = Math.cos(lat2Rad) * Math.sin(dLng);

  const lat3 = Math.atan2(
    Math.sin(lat1Rad) + Math.sin(lat2Rad),
    Math.sqrt(
      (Math.cos(lat1Rad) + Bx) * (Math.cos(lat1Rad) + Bx) + By * By
    )
  );

  const lng3 = lng1Rad + Math.atan2(By, Math.cos(lat1Rad) + Bx);

  return {
    lat: toDeg(lat3),
    lng: toDeg(lng3)
  };
};

// ==========================================
// DESTINATION POINT (Given bearing & distance)
// ==========================================
export const getDestinationPoint = (lat, lng, bearing, distanceKm) => {
  const R = 6371;
  const toRad = (deg) => (deg * Math.PI) / 180;
  const toDeg = (rad) => (rad * 180) / Math.PI;

  const angularDistance = distanceKm / R;

  const latRad = toRad(lat);
  const lngRad = toRad(lng);
  const bearingRad = toRad(bearing);

  const lat2 = Math.asin(
    Math.sin(latRad) * Math.cos(angularDistance) +
      Math.cos(latRad) * Math.sin(angularDistance) * Math.cos(bearingRad)
  );

  const lng2 =
    lngRad +
    Math.atan2(
      Math.sin(bearingRad) * Math.sin(angularDistance) * Math.cos(latRad),
      Math.cos(angularDistance) - Math.sin(latRad) * Math.sin(lat2)
    );

  return {
    lat: toDeg(lat2),
    lng: toDeg(lng2)
  };
};

// ==========================================
// CHECK IF POINT IS WITHIN BOUNDS
// ==========================================
export const isPointInBounds = (lat, lng, bounds) => {
  if (!bounds) return false;
  const { north, south, east, west } = bounds;
  return lat <= north && lat >= south && lng <= east && lng >= west;
};

// ==========================================
// GET BOUNDS FROM POINTS
// ==========================================
export const getBoundsFromPoints = (points) => {
  if (!points || points.length === 0) return null;

  let north = -90;
  let south = 90;
  let east = -180;
  let west = 180;

  points.forEach((p) => {
    if (p.lat > north) north = p.lat;
    if (p.lat < south) south = p.lat;
    if (p.lng > east) east = p.lng;
    if (p.lng < west) west = p.lng;
  });

  return { north, south, east, west };
};

// ==========================================
// EXPAND BOUNDS BY KM
// ==========================================
export const expandBounds = (bounds, km) => {
  const latDelta = km / 111;
  const lngDelta = km / (111 * Math.cos(((bounds.north + bounds.south) / 2) * Math.PI / 180));

  return {
    north: bounds.north + latDelta,
    south: bounds.south - latDelta,
    east: bounds.east + lngDelta,
    west: bounds.west - lngDelta
  };
};

// ==========================================
// FORMAT DISTANCE
// ==========================================
export const formatDistance = (km, unit = 'km') => {
  if (km < 1) {
    const meters = km * 1000;
    return `${Math.round(meters)} m`;
  }

  if (unit === 'mi') {
    const miles = km * 0.621371;
    return `${miles.toFixed(2)} mi`;
  }

  return `${km.toFixed(2)} km`;
};

// ==========================================
// FORMAT DURATION
// ==========================================
export const formatDuration = (seconds) => {
  if (!seconds || seconds < 0) return '0 min';

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 24) {
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    return `${days} d ${remainingHours} hr`;
  }

  if (hours > 0) {
    return `${hours} hr ${minutes} min`;
  }

  return `${minutes} min`;
};

// ==========================================
// CALCULATE SPEED
// ==========================================
export const calculateSpeed = (distanceKm, durationSeconds) => {
  if (!durationSeconds || durationSeconds === 0) return 0;
  const hours = durationSeconds / 3600;
  return distanceKm / hours;
};

// ==========================================
// FORMAT SPEED
// ==========================================
export const formatSpeed = (kmh, unit = 'kmh') => {
  if (unit === 'mph') {
    return `${(kmh * 0.621371).toFixed(1)} mph`;
  }
  return `${kmh.toFixed(1)} km/h`;
};

// ==========================================
// CALCULATE TRAVEL TIME
// ==========================================
export const calculateTravelTime = (distanceKm, mode = 'driving') => {
  const speeds = {
    driving: 50,      // km/h average
    walking: 5,       // km/h
    cycling: 15,      // km/h
    transit: 30,      // km/h
    running: 10,      // km/h
    flying: 800       // km/h
  };

  const speed = speeds[mode] || 50;
  const hours = distanceKm / speed;
  const seconds = hours * 3600;

  return {
    seconds,
    formatted: formatDuration(seconds),
    mode
  };
};

// ==========================================
// CALCULATE AREA (for polygons)
// ==========================================
export const calculatePolygonArea = (coordinates) => {
  if (!coordinates || coordinates.length < 3) return 0;

  const R = 6371; // Earth radius km
  const toRad = (deg) => (deg * Math.PI) / 180;

  let area = 0;

  for (let i = 0; i < coordinates.length; i++) {
    const j = (i + 1) % coordinates.length;
    const lat1 = toRad(coordinates[i].lat);
    const lat2 = toRad(coordinates[j].lat);
    const lng1 = toRad(coordinates[i].lng);
    const lng2 = toRad(coordinates[j].lng);

    area += (lng2 - lng1) * (2 + Math.sin(lat1) + Math.sin(lat2));
  }

  area = (area * R * R) / 2;
  return Math.abs(area);
};

// ==========================================
// FORMAT AREA
// ==========================================
export const formatArea = (sqKm) => {
  if (sqKm < 0.01) {
    return `${(sqKm * 1000000).toFixed(0)} m²`;
  }
  if (sqKm < 1) {
    return `${(sqKm * 100).toFixed(2)} ha`;
  }
  if (sqKm > 1000000) {
    return `${(sqKm / 1000000).toFixed(2)} million km²`;
  }
  return `${sqKm.toFixed(2)} km²`;
};

// ==========================================
// CALCULATE PERIMETER
// ==========================================
export const calculatePolygonPerimeter = (coordinates, closePolygon = true) => {
  if (!coordinates || coordinates.length < 2) return 0;

  let perimeter = 0;

  for (let i = 0; i < coordinates.length - 1; i++) {
    perimeter += haversineDistance(
      coordinates[i].lat,
      coordinates[i].lng,
      coordinates[i + 1].lat,
      coordinates[i + 1].lng
    );
  }

  if (closePolygon && coordinates.length > 2) {
    const last = coordinates[coordinates.length - 1];
    const first = coordinates[0];
    perimeter += haversineDistance(last.lat, last.lng, first.lat, first.lng);
  }

  return perimeter;
};

// ==========================================
// FIND NEAREST POINT
// ==========================================
export const findNearestPoint = (target, points, unit = 'km') => {
  if (!points || points.length === 0) return null;

  let nearest = null;
  let minDistance = Infinity;

  points.forEach((point) => {
    const distance = haversineDistance(
      target.lat,
      target.lng,
      point.lat,
      point.lng,
      unit
    );

    if (distance < minDistance) {
      minDistance = distance;
      nearest = { ...point, distance };
    }
  });

  return nearest;
};

// ==========================================
// SORT POINTS BY DISTANCE
// ==========================================
export const sortByDistance = (target, points, unit = 'km') => {
  if (!points || points.length === 0) return [];

  return points
    .map((point) => ({
      ...point,
      distance: haversineDistance(
        target.lat,
        target.lng,
        point.lat,
        point.lng,
        unit
      )
    }))
    .sort((a, b) => a.distance - b.distance);
};

// ==========================================
// FILTER POINTS BY RADIUS
// ==========================================
export const filterByRadius = (target, points, radiusKm) => {
  if (!points || points.length === 0) return [];

  return points.filter((point) => {
    const distance = haversineDistance(
      target.lat,
      target.lng,
      point.lat,
      point.lng
    );
    return distance <= radiusKm;
  });
};