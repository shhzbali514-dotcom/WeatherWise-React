// ==========================================
// ROUTING API SERVICE
// OSRM (Open Source Routing Machine)
// Real routing: Driving, Walking, Cycling
// ==========================================

// ==========================================
// GET ROUTE BETWEEN TWO POINTS
// ==========================================
export const getRoute = async (startLat, startLng, endLat, endLng, options = {}) => {
  if (!startLat || !startLng || !endLat || !endLng) {
    return null;
  }

  const {
    profile = 'driving', // 'driving' | 'walking' | 'cycling'
    alternatives = true,
    steps = true,
    geometries = 'geojson',
    overview = 'full',
    annotations = true
  } = options;

  try {
    // OSRM API URL
    const url = `https://router.project-osrm.org/route/v1/${profile}/` +
      `${startLng},${startLat};${endLng},${endLat}` +
      `?alternatives=${alternatives ? 'true' : 'false'}` +
      `&steps=${steps ? 'true' : 'false'}` +
      `&geometries=${geometries}` +
      `&overview=${overview}` +
      `&annotations=${annotations ? 'true' : 'false'}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`OSRM error: ${response.status}`);
    }

    const data = await response.json();

    if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
      throw new Error('No route found');
    }

    // Process routes
    const routes = data.routes.map((route, index) => ({
      index: index,
      distance: route.distance,           // meters
      distanceKm: (route.distance / 1000).toFixed(2),
      duration: route.duration,           // seconds
      durationMin: Math.round(route.duration / 60),
      durationText: formatDuration(route.duration),
      geometry: route.geometry,
      legs: route.legs?.map((leg) => ({
        distance: leg.distance,
        duration: leg.duration,
        summary: leg.summary,
        steps: leg.steps?.map((step) => ({
          distance: step.distance,
          duration: step.duration,
          instruction: buildInstruction(step),
          name: step.name,
          mode: step.mode,
          maneuver: {
            type: step.maneuver?.type,
            modifier: step.maneuver?.modifier,
            bearing_before: step.maneuver?.bearing_before,
            bearing_after: step.maneuver?.bearing_after,
            location: step.maneuver?.location
          }
        })) || []
      })) || []
    }));

    return {
      routes: routes,
      waypoints: data.waypoints,
      profile: profile
    };
  } catch (error) {
    console.error('Routing error:', error);
    return null;
  }
};

// ==========================================
// GET ROUTE BY COORDINATES ARRAY
// ==========================================
export const getRouteMultiPoint = async (coordinates, options = {}) => {
  if (!coordinates || coordinates.length < 2) {
    return null;
  }

  const { profile = 'driving', steps = true, geometries = 'geojson' } = options;

  try {
    // Build coordinate string: lng,lat;lng,lat;...
    const coordString = coordinates
      .map((c) => `${c.lng},${c.lat}`)
      .join(';');

    const url = `https://router.project-osrm.org/route/v1/${profile}/${coordString}` +
      `?steps=${steps ? 'true' : 'false'}` +
      `&geometries=${geometries}` +
      `&overview=full`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`OSRM error: ${response.status}`);
    }

    const data = await response.json();

    if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
      throw new Error('No route found');
    }

    const route = data.routes[0];

    return {
      distance: route.distance,
      distanceKm: (route.distance / 1000).toFixed(2),
      duration: route.duration,
      durationMin: Math.round(route.duration / 60),
      durationText: formatDuration(route.duration),
      geometry: route.geometry,
      legs: route.legs?.map((leg) => ({
        distance: leg.distance,
        duration: leg.duration,
        summary: leg.summary,
        steps: leg.steps?.map((step) => ({
          distance: step.distance,
          duration: step.duration,
          instruction: buildInstruction(step),
          name: step.name,
          mode: step.mode,
          maneuver: step.maneuver
        })) || []
      })) || []
    };
  } catch (error) {
    console.error('Multi-point routing error:', error);
    return null;
  }
};

// ==========================================
// BUILD TURN-BY-TURN INSTRUCTION
// ==========================================
const buildInstruction = (step) => {
  if (!step.maneuver) return 'Continue';

  const type = step.maneuver.type;
  const modifier = step.maneuver.modifier;
  const name = step.name || 'the road';

  const modifierMap = {
    'uturn': 'Make a U-turn',
    'sharp right': 'Turn sharp right',
    'right': 'Turn right',
    'slight right': 'Turn slight right',
    'straight': 'Continue straight',
    'slight left': 'Turn slight left',
    'left': 'Turn left',
    'sharp left': 'Turn sharp left'
  };

  const typeMap = {
    'turn': modifierMap[modifier] || 'Turn',
    'new name': 'Continue',
    'depart': 'Start',
    'arrive': 'Arrive at destination',
    'merge': `Merge ${modifier || ''}`,
    'on ramp': 'Take the ramp',
    'off ramp': 'Take the exit',
    'fork': `Keep ${modifier || 'straight'}`,
    'end of road': `Turn ${modifier || ''} at the end of the road`,
    'continue': 'Continue',
    'roundabout': 'Enter the roundabout',
    'rotary': 'Enter the rotary',
    'roundabout turn': 'At the roundabout, turn',
    'notification': 'Note',
    'exit roundabout': 'Exit the roundabout',
    'exit rotary': 'Exit the rotary'
  };

  const baseInstruction = typeMap[type] || 'Continue';

  if (type === 'arrive') {
    return 'Arrive at your destination';
  }

  if (type === 'depart') {
    return `Start on ${name}`;
  }

  if (type === 'roundabout' || type === 'rotary') {
    const exit = step.maneuver.exit;
    return `Enter the roundabout and take exit ${exit || ''} onto ${name}`.trim();
  }

  return `${baseInstruction} onto ${name}`.trim();
};

// ==========================================
// FORMAT DURATION
// ==========================================
const formatDuration = (seconds) => {
  if (!seconds) return '0 min';

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours} hr ${minutes} min`;
  }
  return `${minutes} min`;
};

// ==========================================
// GET NEAREST ROAD / SNAP TO ROAD
// ==========================================
export const getNearestRoad = async (lat, lng, options = {}) => {
  const { profile = 'driving' } = options;

  try {
    const url = `https://router.project-osrm.org/nearest/v1/${profile}/${lng},${lat}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`OSRM nearest error: ${response.status}`);
    }

    const data = await response.json();

    if (data.code !== 'Ok' || !data.waypoints || data.waypoints.length === 0) {
      return null;
    }

    return {
      lat: data.waypoints[0].location[1],
      lng: data.waypoints[0].location[0],
      name: data.waypoints[0].name,
      distance: data.waypoints[0].distance
    };
  } catch (error) {
    console.error('Nearest road error:', error);
    return null;
  }
};

// ==========================================
// GET DISTANCE MATRIX
// ==========================================
export const getDistanceMatrix = async (sources, destinations, options = {}) => {
  const { profile = 'driving' } = options;

  try {
    const sourceStr = sources.map((c) => `${c.lng},${c.lat}`).join(';');
    const destStr = destinations.map((c) => `${c.lng},${c.lat}`).join(';');

    const url = `https://router.project-osrm.org/table/v1/${profile}/${sourceStr};${destStr}?annotations=distance,duration`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`OSRM table error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Distance matrix error:', error);
    return null;
  }
};

// ==========================================
// GET ALTERNATIVE ROUTES
// ==========================================
export const getAlternativeRoutes = async (startLat, startLng, endLat, endLng, options = {}) => {
  const { profile = 'driving' } = options;

  try {
    const url = `https://router.project-osrm.org/route/v1/${profile}/` +
      `${startLng},${startLat};${endLng},${endLat}` +
      `?alternatives=true` +
      `&steps=true` +
      `&geometries=geojson` +
      `&overview=full`;

    const response = await fetch(url);
    if (!response.ok) throw new Error(`OSRM error: ${response.status}`);

    const data = await response.json();
    if (data.code !== 'Ok') throw new Error('No routes');

    return data.routes.map((route, i) => ({
      index: i,
      distance: route.distance,
      distanceKm: (route.distance / 1000).toFixed(2),
      duration: route.duration,
      durationMin: Math.round(route.duration / 60),
      durationText: formatDuration(route.duration),
      geometry: route.geometry,
      summary: route.legs?.[0]?.summary || 'Route'
    }));
  } catch (error) {
    console.error('Alternative routes error:', error);
    return [];
  }
};

// ==========================================
// GET ELEVATION PROFILE
// ==========================================
export const getElevationProfile = async (coordinates) => {
  if (!coordinates || coordinates.length === 0) return null;

  try {
    const locations = coordinates.map((c) => `${c.lat},${c.lng}`).join('|');
    const url = `https://api.open-elevation.com/api/v1/lookup?locations=${locations}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error(`Elevation error: ${response.status}`);

    const data = await response.json();

    return (data.results || []).map((r, i) => ({
      lat: coordinates[i].lat,
      lng: coordinates[i].lng,
      elevation: r.elevation
    }));
  } catch (error) {
    console.error('Elevation error:', error);
    return null;
  }
};

// ==========================================
// CALCULATE BEARING BETWEEN TWO POINTS
// ==========================================
export const calculateBearing = (lat1, lng1, lat2, lng2) => {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const toDeg = (rad) => (rad * 180) / Math.PI;

  const dLng = toRad(lng2 - lng1);
  const y = Math.sin(dLng) * Math.cos(toRad(lat2));
  const x = Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
    Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(dLng);

  const bearing = (toDeg(Math.atan2(y, x)) + 360) % 360;
  return bearing;
};

// ==========================================
// GET BEARING TEXT
// ==========================================
export const getBearingText = (bearing) => {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(bearing / 45) % 8;
  return directions[index];
};