// ==========================================
// GEOCODING API SERVICE
// Nominatim (OpenStreetMap) + Photon
// Search + Reverse Geocoding + Static Fallback
// ==========================================

import { PAKISTAN_CITIES, CITY_COORDS } from '../data/cities';
import { WORLD_CITIES, WORLD_CITY_COORDS } from '../data/cities';

// ==========================================
// 1. SEARCH LOCATIONS (Forward Geocoding)
// ==========================================
export const searchLocations = async (query, options = {}) => {
  if (!query || query.trim().length < 2) {
    return [];
  }

  const {
    limit = 10,
    language = 'en',
    countryCode = null,
    viewbox = null,
    bounded = false
  } = options;

  try {
    let url = `https://nominatim.openstreetmap.org/search?`;
    url += `q=${encodeURIComponent(query)}`;
    url += `&format=json`;
    url += `&limit=${limit}`;
    url += `&addressdetails=1`;
    url += `&extratags=1`;
    url += `&namedetails=1`;
    url += `&accept-language=${language}`;

    if (countryCode) {
      url += `&countrycodes=${countryCode}`;
    }

    if (viewbox) {
      url += `&viewbox=${viewbox}`;
      url += `&bounded=${bounded ? 1 : 0}`;
    }

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'WeatherWise/7.0 (https://weatherwise.pk)'
      }
    });

    if (!response.ok) {
      throw new Error(`Nominatim error: ${response.status}`);
    }

    const data = await response.json();

    return data.map((item) => ({
      placeId: item.place_id,
      osmId: item.osm_id,
      osmType: item.osm_type,
      name: item.display_name?.split(',')[0] || item.name || 'Unknown',
      displayName: item.display_name,
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon),
      type: item.type,
      category: item.class,
      importance: item.importance,
      address: {
        country: item.address?.country || null,
        countryCode: item.address?.country_code || null,
        state: item.address?.state || null,
        region: item.address?.region || null,
        county: item.address?.county || null,
        city: item.address?.city || item.address?.town || item.address?.village || null,
        district: item.address?.city_district || item.address?.district || null,
        suburb: item.address?.suburb || item.address?.neighbourhood || null,
        street: item.address?.road || null,
        houseNumber: item.address?.house_number || null,
        postcode: item.address?.postcode || null,
        full: item.display_name
      },
      boundingBox: item.boundingbox ? {
        south: parseFloat(item.boundingbox[0]),
        north: parseFloat(item.boundingbox[1]),
        west: parseFloat(item.boundingbox[2]),
        east: parseFloat(item.boundingbox[3])
      } : null,
      extratags: item.extratags || null,
      namedetails: item.namedetails || null,
      source: 'nominatim'
    }));
  } catch (error) {
    console.error('Search error:', error);
    return [];
  }
};

// ==========================================
// 2. REVERSE GEOCODING (Coordinates → Address)
// ==========================================
export const reverseGeocode = async (lat, lng, options = {}) => {
  if (!lat || !lng) {
    return null;
  }

  const { language = 'en', zoom = 18 } = options;

  try {
    const url = `https://nominatim.openstreetmap.org/reverse?` +
      `lat=${lat}` +
      `&lon=${lng}` +
      `&format=json` +
      `&addressdetails=1` +
      `&extratags=1` +
      `&namedetails=1` +
      `&zoom=${zoom}` +
      `&accept-language=${language}`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'WeatherWise/7.0 (https://weatherwise.pk)'
      }
    });

    if (!response.ok) {
      throw new Error(`Reverse geocode error: ${response.status}`);
    }

    const data = await response.json();

    if (!data || data.error) {
      return null;
    }

    return {
      placeId: data.place_id,
      osmId: data.osm_id,
      osmType: data.osm_type,
      name: data.name || null,
      displayName: data.display_name,
      lat: parseFloat(data.lat),
      lng: parseFloat(data.lon),
      type: data.type,
      category: data.class,
      address: {
        country: data.address?.country || null,
        countryCode: data.address?.country_code || null,
        state: data.address?.state || null,
        region: data.address?.region || null,
        county: data.address?.county || null,
        city: data.address?.city || data.address?.town || data.address?.village || null,
        district: data.address?.city_district || data.address?.district || null,
        suburb: data.address?.suburb || data.address?.neighbourhood || null,
        street: data.address?.road || null,
        houseNumber: data.address?.house_number || null,
        postcode: data.address?.postcode || null,
        full: data.display_name
      },
      boundingBox: data.boundingbox ? {
        south: parseFloat(data.boundingbox[0]),
        north: parseFloat(data.boundingbox[1]),
        west: parseFloat(data.boundingbox[2]),
        east: parseFloat(data.boundingbox[3])
      } : null,
      extratags: data.extratags || null,
      namedetails: data.namedetails || null,
      source: 'nominatim'
    };
  } catch (error) {
    console.error('Reverse geocode error:', error);
    return null;
  }
};

// ==========================================
// 3. SEARCH BY PHOTON (Faster alternative)
// ==========================================
export const searchPhoton = async (query, options = {}) => {
  if (!query || query.trim().length < 2) {
    return [];
  }

  const { limit = 10, language = 'en', lat = null, lng = null } = options;

  try {
    let url = `https://photon.komoot.io/api/?`;
    url += `q=${encodeURIComponent(query)}`;
    url += `&limit=${limit}`;
    url += `&lang=${language}`;

    if (lat && lng) {
      url += `&lat=${lat}&lon=${lng}`;
    }

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Photon error: ${response.status}`);
    }

    const data = await response.json();

    return (data.features || []).map((feature) => ({
      placeId: feature.properties.osm_id,
      osmId: feature.properties.osm_id,
      osmType: feature.properties.osm_type,
      name: feature.properties.name || 'Unknown',
      displayName: [
        feature.properties.name,
        feature.properties.street,
        feature.properties.city,
        feature.properties.state,
        feature.properties.country
      ].filter(Boolean).join(', '),
      lat: feature.geometry.coordinates[1],
      lng: feature.geometry.coordinates[0],
      type: feature.properties.type,
      category: feature.properties.osm_value,
      address: {
        country: feature.properties.country || null,
        countryCode: feature.properties.countrycode || null,
        state: feature.properties.state || null,
        city: feature.properties.city || null,
        district: feature.properties.district || null,
        suburb: feature.properties.locality || null,
        street: feature.properties.street || null,
        houseNumber: feature.properties.housenumber || null,
        postcode: feature.properties.postcode || null,
        full: [
          feature.properties.name,
          feature.properties.street,
          feature.properties.city,
          feature.properties.state,
          feature.properties.country
        ].filter(Boolean).join(', ')
      },
      boundingBox: feature.properties.extent ? {
        west: feature.properties.extent[0],
        north: feature.properties.extent[1],
        east: feature.properties.extent[2],
        south: feature.properties.extent[3]
      } : null,
      extratags: null,
      namedetails: null,
      source: 'photon'
    }));
  } catch (error) {
    console.error('Photon search error:', error);
    return [];
  }
};

// ==========================================
// 4. STATIC SEARCH (Local Data Fallback)
// ==========================================
export const searchStatic = (query) => {
  if (!query || query.trim().length < 2) {
    return [];
  }

  const lowerQuery = query.toLowerCase().trim();
  const results = [];

  // Search Pakistan cities
  for (const [province, cities] of Object.entries(PAKISTAN_CITIES.provinces)) {
    for (const city of cities) {
      if (city.toLowerCase().includes(lowerQuery)) {
        const coords = CITY_COORDS[city];
        results.push({
          name: city,
          displayName: `${city}, ${province}, Pakistan`,
          lat: coords?.lat || null,
          lng: coords?.lng || null,
          type: 'city',
          category: 'place',
          address: {
            country: 'Pakistan',
            countryCode: 'pk',
            state: province,
            city: city,
            full: `${city}, ${province}, Pakistan`
          },
          source: 'static'
        });
      }
    }
  }

  // Search World cities
  for (const [country, cities] of Object.entries(WORLD_CITIES)) {
    for (const city of cities) {
      if (city.toLowerCase().includes(lowerQuery)) {
        const coords = WORLD_CITY_COORDS[city];
        results.push({
          name: city,
          displayName: `${city}, ${country}`,
          lat: coords?.lat || null,
          lng: coords?.lng || null,
          type: 'city',
          category: 'place',
          address: {
            country: country,
            countryCode: null,
            state: null,
            city: city,
            full: `${city}, ${country}`
          },
          source: 'static'
        });
      }
    }
  }

  // Deduplicate
  const seen = new Set();
  return results.filter((r) => {
    const key = `${r.name}-${r.address?.country}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

// ==========================================
// 5. COMBINED SEARCH (Static + Nominatim + Photon)
// ==========================================
export const globalSearch = async (query, options = {}) => {
  if (!query || query.trim().length < 2) {
    return [];
  }

  const { useStatic = true, useAPI = true, limit = 10 } = options;

  let results = [];

  // Step 1: Static data first (fast, no network)
  if (useStatic) {
    results = searchStatic(query);
  }

  // Step 2: If static results are enough, return early
  if (results.length >= limit) {
    return results.slice(0, limit);
  }

  // Step 3: Try Nominatim API
  if (useAPI && results.length < limit) {
    try {
      const nominatimResults = await searchLocations(query, {
        ...options,
        limit: limit - results.length
      });

      // Merge, avoiding duplicates
      const existingKeys = new Set(
        results.map((r) => `${r.name}-${r.lat}-${r.lng}`)
      );

      for (const item of nominatimResults) {
        const key = `${item.name}-${item.lat}-${item.lng}`;
        if (!existingKeys.has(key)) {
          results.push(item);
          existingKeys.add(key);
        }
      }
    } catch (error) {
      console.warn('Nominatim failed, trying Photon...');
    }
  }

  // Step 4: If still not enough, try Photon
  if (useAPI && results.length < limit) {
    try {
      const photonResults = await searchPhoton(query, {
        ...options,
        limit: limit - results.length
      });

      const existingKeys = new Set(
        results.map((r) => `${r.name}-${r.lat}-${r.lng}`)
      );

      for (const item of photonResults) {
        const key = `${item.name}-${item.lat}-${item.lng}`;
        if (!existingKeys.has(key)) {
          results.push(item);
          existingKeys.add(key);
        }
      }
    } catch (error) {
      console.warn('Photon failed too');
    }
  }

  return results.slice(0, limit);
};

// ==========================================
// 6. GET PLACE DETAILS BY OSM ID
// ==========================================
export const getPlaceDetails = async (osmType, osmId) => {
  if (!osmType || !osmId) return null;

  try {
    const url = `https://nominatim.openstreetmap.org/details?` +
      `osmtype=${osmType.charAt(0).toUpperCase()}` +
      `&osmid=${osmId}` +
      `&format=json` +
      `&addressdetails=1` +
      `&hierarchy=1` +
      `&extratags=1`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'WeatherWise/7.0 (https://weatherwise.pk)'
      }
    });

    if (!response.ok) {
      throw new Error(`Details error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Place details error:', error);
    return null;
  }
};

// ==========================================
// 7. GET NEARBY PLACES (Overpass API)
// ==========================================
export const getNearbyPlaces = async (lat, lng, category = null, radius = 1000) => {
  try {
    const overpassQuery = category
      ? `[out:json][timeout:25];(node[${category}](around:${radius},${lat},${lng});way[${category}](around:${radius},${lat},${lng}););out body 50;`
      : `[out:json][timeout:25];(node(around:${radius},${lat},${lng});way(around:${radius},${lat},${lng}););out body 50;`;

    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: overpassQuery
    });

    if (!response.ok) {
      throw new Error(`Overpass error: ${response.status}`);
    }

    const data = await response.json();

    return (data.elements || []).map((el) => ({
      id: el.id,
      name: el.tags?.name || 'Unknown',
      lat: el.lat || el.center?.lat,
      lng: el.lon || el.center?.lon,
      type: el.type,
      tags: el.tags
    })).filter((p) => p.lat && p.lng);
  } catch (error) {
    console.error('Nearby places error:', error);
    return [];
  }
};

// ==========================================
// 8. HELPER: Get City Name from Result
// ==========================================
export const getCityName = (result) => {
  if (!result) return 'Unknown';
  return (
    result.address?.city ||
    result.address?.town ||
    result.address?.village ||
    result.name ||
    result.address?.state ||
    'Unknown'
  );
};

// ==========================================
// 9. HELPER: Get Country from Result
// ==========================================
export const getCountryName = (result) => {
  if (!result) return 'Unknown';
  return result.address?.country || 'Unknown';
};

// ==========================================
// 10. HELPER: Get Province/State from Result
// ==========================================
export const getStateName = (result) => {
  if (!result) return 'Unknown';
  return result.address?.state || result.address?.region || 'Unknown';
};

// ==========================================
// 11. HELPER: Format for Weather API
// ==========================================
export const formatForWeatherAPI = (result) => {
  if (!result || !result.lat || !result.lng) return null;

  return {
    city: getCityName(result),
    country: getCountryName(result),
    state: getStateName(result),
    lat: result.lat,
    lng: result.lng,
    displayName: result.displayName || result.name,
    source: result.source || 'unknown'
  };
};

// ==========================================
// 12. HELPER: Filter Pakistan Results Only
// ==========================================
export const filterPakistanResults = (results) => {
  return results.filter(
    (r) =>
      r.address?.country?.toLowerCase() === 'pakistan' ||
      r.address?.countryCode?.toLowerCase() === 'pk'
  );
};

// ==========================================
// 13. HELPER: Find Nearest City from Coordinates
// ==========================================
export const findNearestCity = (lat, lng) => {
  let nearest = null;
  let minDist = Infinity;

  // Check Pakistan cities first
  for (const [city, coords] of Object.entries(CITY_COORDS)) {
    const dist = Math.sqrt(
      Math.pow(coords.lat - lat, 2) + Math.pow(coords.lng - lng, 2)
    );
    if (dist < minDist) {
      minDist = dist;
      nearest = {
        name: city,
        lat: coords.lat,
        lng: coords.lng,
        country: 'Pakistan',
        source: 'static'
      };
    }
  }

  // Check world cities
  for (const [city, coords] of Object.entries(WORLD_CITY_COORDS)) {
    const dist = Math.sqrt(
      Math.pow(coords.lat - lat, 2) + Math.pow(coords.lng - lng, 2)
    );
    if (dist < minDist) {
      minDist = dist;
      nearest = {
        name: city,
        lat: coords.lat,
        lng: coords.lng,
        country: coords.country,
        source: 'static'
      };
    }
  }

  return nearest;
};

// ==========================================
// 14. HELPER: Debounced Search
// ==========================================
export const debouncedSearch = (() => {
  let timeout;
  return (query, callback, delay = 300) => {
    clearTimeout(timeout);
    timeout = setTimeout(async () => {
      const results = await globalSearch(query);
      callback(results);
    }, delay);
  };
})();

// ==========================================
// 15. EXPORT DEFAULT
// ==========================================
export default {
  searchLocations,
  reverseGeocode,
  searchPhoton,
  searchStatic,
  globalSearch,
  getPlaceDetails,
  getNearbyPlaces,
  getCityName,
  getCountryName,
  getStateName,
  formatForWeatherAPI,
  filterPakistanResults,
  findNearestCity,
  debouncedSearch
};