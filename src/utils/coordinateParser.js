// ==========================================
// COORDINATE PARSER UTILITY
// Parse coordinates from various formats
// ==========================================

// ==========================================
// PARSE COORDINATES FROM STRING
// Supported formats:
// - 33.6844, 73.0479
// - 33.6844 73.0479
// - 33.6844,73.0479
// - lat: 33.6844, lng: 73.0479
// - latitude: 33.6844, longitude: 73.0479
// - 33.6844°N, 73.0479°E
// - N 33.6844, E 73.0479
// - 33°41'4"N 73°2'52"E (DMS)
// ==========================================
export const parseCoordinates = (input) => {
  if (!input || typeof input !== 'string') return null;

  const trimmed = input.trim();

  // Format 1: Decimal with comma/space (33.6844, 73.0479)
  const decimalMatch = trimmed.match(
    /^([+-]?\d+\.?\d*)[,\s]+([+-]?\d+\.?\d*)$/
  );
  if (decimalMatch) {
    const lat = parseFloat(decimalMatch[1]);
    const lng = parseFloat(decimalMatch[2]);
    if (isValidCoordinate(lat, lng)) {
      return { lat, lng, format: 'decimal' };
    }
  }

  // Format 2: Lat/Lng labels
  const labelMatch = trimmed.match(
    /(?:lat|latitude)\s*[:=]?\s*([+-]?\d+\.?\d*)\s*[,\s]+\s*(?:lng|lon|long|longitude)\s*[:=]?\s*([+-]?\d+\.?\d*)/i
  );
  if (labelMatch) {
    const lat = parseFloat(labelMatch[1]);
    const lng = parseFloat(labelMatch[2]);
    if (isValidCoordinate(lat, lng)) {
      return { lat, lng, format: 'labeled' };
    }
  }

  // Format 3: Reversed label (lng first)
  const labelRevMatch = trimmed.match(
    /(?:lng|lon|long|longitude)\s*[:=]?\s*([+-]?\d+\.?\d*)\s*[,\s]+\s*(?:lat|latitude)\s*[:=]?\s*([+-]?\d+\.?\d*)/i
  );
  if (labelRevMatch) {
    const lng = parseFloat(labelRevMatch[1]);
    const lat = parseFloat(labelRevMatch[2]);
    if (isValidCoordinate(lat, lng)) {
      return { lat, lng, format: 'labeled-reversed' };
    }
  }

  // Format 4: With direction (33.6844°N, 73.0479°E)
  const directionMatch = trimmed.match(
    /([+-]?\d+\.?\d*)\s*°?\s*([NS])\s*[,\s]+([+-]?\d+\.?\d*)\s*°?\s*([EW])/i
  );
  if (directionMatch) {
    let lat = parseFloat(directionMatch[1]);
    let lng = parseFloat(directionMatch[3]);
    const latDir = directionMatch[2].toUpperCase();
    const lngDir = directionMatch[4].toUpperCase();

    if (latDir === 'S') lat = -lat;
    if (lngDir === 'W') lng = -lng;

    if (isValidCoordinate(lat, lng)) {
      return { lat, lng, format: 'direction' };
    }
  }

  // Format 5: Direction first (N 33.6844, E 73.0479)
  const directionFirstMatch = trimmed.match(
    /([NS])\s*([+-]?\d+\.?\d*)\s*°?\s*[,\s]+([EW])\s*([+-]?\d+\.?\d*)\s*°?/i
  );
  if (directionFirstMatch) {
    let lat = parseFloat(directionFirstMatch[2]);
    let lng = parseFloat(directionFirstMatch[4]);
    const latDir = directionFirstMatch[1].toUpperCase();
    const lngDir = directionFirstMatch[3].toUpperCase();

    if (latDir === 'S') lat = -lat;
    if (lngDir === 'W') lng = -lng;

    if (isValidCoordinate(lat, lng)) {
      return { lat, lng, format: 'direction-first' };
    }
  }

  // Format 6: DMS (33°41'4"N 73°2'52"E)
  const dmsMatch = trimmed.match(
    /(\d+)\s*°\s*(\d+)\s*['′]\s*(\d+\.?\d*)\s*["″]\s*([NS])\s*[,\s]+(\d+)\s*°\s*(\d+)\s*['′]\s*(\d+\.?\d*)\s*["″]\s*([EW])/i
  );
  if (dmsMatch) {
    const lat = dmsToDecimal(
      parseInt(dmsMatch[1]),
      parseInt(dmsMatch[2]),
      parseFloat(dmsMatch[3]),
      dmsMatch[4]
    );
    const lng = dmsToDecimal(
      parseInt(dmsMatch[5]),
      parseInt(dmsMatch[6]),
      parseFloat(dmsMatch[7]),
      dmsMatch[8]
    );

    if (isValidCoordinate(lat, lng)) {
      return { lat, lng, format: 'dms' };
    }
  }

  // Format 7: Simple DMS without seconds (33°41'N 73°2'E)
  const dmsSimpleMatch = trimmed.match(
    /(\d+)\s*°\s*(\d+\.?\d*)\s*['′]?\s*([NS])\s*[,\s]+(\d+)\s*°\s*(\d+\.?\d*)\s*['′]?\s*([EW])/i
  );
  if (dmsSimpleMatch) {
    const lat = dmsToDecimal(
      parseInt(dmsSimpleMatch[1]),
      parseFloat(dmsSimpleMatch[2]),
      0,
      dmsSimpleMatch[3]
    );
    const lng = dmsToDecimal(
      parseInt(dmsSimpleMatch[4]),
      parseFloat(dmsSimpleMatch[5]),
      0,
      dmsSimpleMatch[6]
    );

    if (isValidCoordinate(lat, lng)) {
      return { lat, lng, format: 'dms-simple' };
    }
  }

  return null;
};

// ==========================================
// CONVERT DMS TO DECIMAL
// ==========================================
const dmsToDecimal = (degrees, minutes, seconds, direction) => {
  let decimal = degrees + minutes / 60 + seconds / 3600;
  const dir = direction.toUpperCase();
  if (dir === 'S' || dir === 'W') {
    decimal = -decimal;
  }
  return decimal;
};

// ==========================================
// VALIDATE COORDINATES
// ==========================================
export const isValidCoordinate = (lat, lng) => {
  if (typeof lat !== 'number' || typeof lng !== 'number') return false;
  if (isNaN(lat) || isNaN(lng)) return false;
  if (lat < -90 || lat > 90) return false;
  if (lng < -180 || lng > 180) return false;
  return true;
};

// ==========================================
// FORMAT COORDINATES FOR DISPLAY
// ==========================================
export const formatCoordinates = (lat, lng, options = {}) => {
  const {
    precision = 6,
    format = 'decimal', // 'decimal' | 'dms' | 'labeled'
    includeDirection = true
  } = options;

  if (!isValidCoordinate(lat, lng)) return 'Invalid';

  if (format === 'decimal') {
    return `${lat.toFixed(precision)}°, ${lng.toFixed(precision)}°`;
  }

  if (format === 'labeled') {
    return `Lat: ${lat.toFixed(precision)}°, Lng: ${lng.toFixed(precision)}°`;
  }

  if (format === 'dms') {
    return `${decimalToDMS(lat, 'lat')} ${decimalToDMS(lng, 'lng')}`;
  }

  return `${lat.toFixed(precision)}°, ${lng.toFixed(precision)}°`;
};

// ==========================================
// DECIMAL TO DMS
// ==========================================
const decimalToDMS = (decimal, type) => {
  const absolute = Math.abs(decimal);
  const degrees = Math.floor(absolute);
  const minutesNotTruncated = (absolute - degrees) * 60;
  const minutes = Math.floor(minutesNotTruncated);
  const seconds = ((minutesNotTruncated - minutes) * 60).toFixed(2);

  let direction;
  if (type === 'lat') {
    direction = decimal >= 0 ? 'N' : 'S';
  } else {
    direction = decimal >= 0 ? 'E' : 'W';
  }

  return `${degrees}°${minutes}'${seconds}"${direction}`;
};

// ==========================================
// GET COORDINATE PRECISION
// ==========================================
export const getCoordinatePrecision = (input) => {
  if (!input || typeof input !== 'string') return 0;
  const match = input.match(/\.(\d+)/);
  return match ? match[1].length : 0;
};

// ==========================================
// ROUND COORDINATES
// ==========================================
export const roundCoordinates = (lat, lng, precision = 6) => {
  const factor = Math.pow(10, precision);
  return {
    lat: Math.round(lat * factor) / factor,
    lng: Math.round(lng * factor) / factor
  };
};

// ==========================================
// CHECK IF STRING IS COORDINATES
// ==========================================
export const isCoordinateString = (input) => {
  return parseCoordinates(input) !== null;
};

// ==========================================
// EXTRACT COORDINATES FROM TEXT
// ==========================================
export const extractCoordinates = (text) => {
  if (!text) return [];

  const results = [];

  // Find all decimal coordinate pairs in text
  const regex = /([+-]?\d+\.?\d*)[,\s]+([+-]?\d+\.?\d*)/g;
  let match;

  while ((match = regex.exec(text)) !== null) {
    const lat = parseFloat(match[1]);
    const lng = parseFloat(match[2]);
    if (isValidCoordinate(lat, lng)) {
      results.push({ lat, lng });
    }
  }

  return results;
};

// ==========================================
// GET BOUNDING BOX
// ==========================================
export const getBoundingBox = (lat, lng, radiusKm = 1) => {
  const latDelta = radiusKm / 111;
  const lngDelta = radiusKm / (111 * Math.cos(lat * Math.PI / 180));

  return {
    south: lat - latDelta,
    north: lat + latDelta,
    west: lng - lngDelta,
    east: lng + lngDelta,
    center: { lat, lng }
  };
};

// ==========================================
// GET MAP ZOOM FOR RADIUS
// ==========================================
export const getZoomForRadius = (radiusKm) => {
  if (radiusKm <= 0.05) return 20;
  if (radiusKm <= 0.1) return 19;
  if (radiusKm <= 0.25) return 18;
  if (radiusKm <= 0.5) return 17;
  if (radiusKm <= 1) return 16;
  if (radiusKm <= 2) return 15;
  if (radiusKm <= 5) return 14;
  if (radiusKm <= 10) return 13;
  if (radiusKm <= 25) return 12;
  if (radiusKm <= 50) return 11;
  if (radiusKm <= 100) return 10;
  if (radiusKm <= 250) return 9;
  if (radiusKm <= 500) return 8;
  if (radiusKm <= 1000) return 7;
  if (radiusKm <= 2500) return 6;
  if (radiusKm <= 5000) return 5;
  return 4;
};