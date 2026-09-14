// ==========================================
// MARKER CLUSTERING UTILITY
// Grid-based clustering for thousands of markers
// ==========================================

import { haversineDistance } from './distanceCalculator';

// ==========================================
// CLUSTER MARKERS BY GRID
// ==========================================
export const clusterMarkers = (markers, options = {}) => {
  if (!markers || markers.length === 0) return [];

  const {
    zoom = 10,
    gridSize = null,
    minClusterSize = 2,
    maxClusterRadius = 80
  } = options;

  // Auto grid size based on zoom
  const cellSize = gridSize || getGridSizeForZoom(zoom);

  // Group markers by grid cell
  const grid = {};

  markers.forEach((marker) => {
    if (!marker.lat || !marker.lng) return;

    const cellX = Math.floor(marker.lng / cellSize);
    const cellY = Math.floor(marker.lat / cellSize);
    const cellKey = `${cellX}_${cellY}`;

    if (!grid[cellKey]) {
      grid[cellKey] = [];
    }
    grid[cellKey].push(marker);
  });

  // Build clusters
  const clusters = [];

  Object.entries(grid).forEach(([key, cellMarkers]) => {
    if (cellMarkers.length === 1) {
      // Single marker - no cluster
      clusters.push({
        type: 'marker',
        marker: cellMarkers[0],
        lat: cellMarkers[0].lat,
        lng: cellMarkers[0].lng,
        count: 1
      });
    } else if (cellMarkers.length >= minClusterSize) {
      // Cluster
      const avgLat = cellMarkers.reduce((sum, m) => sum + m.lat, 0) / cellMarkers.length;
      const avgLng = cellMarkers.reduce((sum, m) => sum + m.lng, 0) / cellMarkers.length;

      clusters.push({
        type: 'cluster',
        markers: cellMarkers,
        lat: avgLat,
        lng: avgLng,
        count: cellMarkers.length,
        bounds: getBounds(cellMarkers),
        cellKey: key
      });
    } else {
      // Below min cluster size - show individually
      cellMarkers.forEach((marker) => {
        clusters.push({
          type: 'marker',
          marker: marker,
          lat: marker.lat,
          lng: marker.lng,
          count: 1
        });
      });
    }
  });

  return clusters;
};

// ==========================================
// GET GRID SIZE FOR ZOOM LEVEL
// ==========================================
export const getGridSizeForZoom = (zoom) => {
  // Grid size in degrees
  const zoomGrids = {
    1: 40,     // World
    2: 20,     // Continent
    3: 10,     // Sub-continent
    4: 5,      // Country
    5: 2.5,    // Country detail
    6: 1,      // Region
    7: 0.5,    // State
    8: 0.25,   // Province
    9: 0.1,    // District
    10: 0.05,  // City
    11: 0.025, // City detail
    12: 0.01,  // Neighborhood
    13: 0.005, // Sub-neighborhood
    14: 0.002, // Street
    15: 0.001, // Street detail
    16: 0.0005, // Building
    17: 0.00025, // Building detail
    18: 0.0001, // Exact location
    19: 0.00005,
    20: 0.000025,
    21: 0.00001,
    22: 0.000005
  };

  return zoomGrids[zoom] || 0.00001;
};

// ==========================================
// GET BOUNDS FROM MARKERS
// ==========================================
const getBounds = (markers) => {
  let north = -90;
  let south = 90;
  let east = -180;
  let west = 180;

  markers.forEach((m) => {
    if (m.lat > north) north = m.lat;
    if (m.lat < south) south = m.lat;
    if (m.lng > east) east = m.lng;
    if (m.lng < west) west = m.lng;
  });

  return { north, south, east, west };
};

// ==========================================
// CLUSTER BY DISTANCE (Alternative)
// ==========================================
export const clusterByDistance = (markers, options = {}) => {
  if (!markers || markers.length === 0) return [];

  const { radiusKm = 5, minClusterSize = 2 } = options;

  const clusters = [];
  const processed = new Set();

  markers.forEach((marker, i) => {
    if (processed.has(i)) return;

    const cluster = [marker];
    processed.add(i);

    markers.forEach((other, j) => {
      if (i === j || processed.has(j)) return;

      const distance = haversineDistance(
        marker.lat,
        marker.lng,
        other.lat,
        other.lng
      );

      if (distance <= radiusKm) {
        cluster.push(other);
        processed.add(j);
      }
    });

    if (cluster.length >= minClusterSize) {
      const avgLat = cluster.reduce((sum, m) => sum + m.lat, 0) / cluster.length;
      const avgLng = cluster.reduce((sum, m) => sum + m.lng, 0) / cluster.length;

      clusters.push({
        type: 'cluster',
        markers: cluster,
        lat: avgLat,
        lng: avgLng,
        count: cluster.length,
        bounds: getBounds(cluster)
      });
    } else {
      cluster.forEach((m) => {
        clusters.push({
          type: 'marker',
          marker: m,
          lat: m.lat,
          lng: m.lng,
          count: 1
        });
      });
    }
  });

  return clusters;
};

// ==========================================
// GET CLUSTER COLOR BY COUNT
// ==========================================
export const getClusterColor = (count) => {
  if (count < 10) return '#10b981';        // Green
  if (count < 50) return '#f59e0b';        // Orange
  if (count < 100) return '#f97316';       // Dark Orange
  if (count < 500) return '#ef4444';       // Red
  if (count < 1000) return '#dc2626';      // Dark Red
  return '#7c2d12';                         // Brown
};

// ==========================================
// GET CLUSTER SIZE BY COUNT
// ==========================================
export const getClusterSize = (count) => {
  if (count < 10) return 36;
  if (count < 50) return 42;
  if (count < 100) return 48;
  if (count < 500) return 54;
  if (count < 1000) return 60;
  return 66;
};

// ==========================================
// GET CLUSTER ICON HTML
// ==========================================
export const getClusterIconHTML = (count, options = {}) => {
  const {
    color = getClusterColor(count),
    size = getClusterSize(count),
    textColor = '#ffffff'
  } = options;

  const displayCount = count > 999 ? '999+' : count;

  return `
    <div style="
      background: ${color};
      border: 3px solid #ffffff;
      border-radius: 50%;
      width: ${size}px;
      height: ${size}px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: ${size / 3}px;
      font-weight: 700;
      color: ${textColor};
      box-shadow: 0 4px 20px ${color}80;
      cursor: pointer;
      transition: all 0.3s ease;
      font-family: Inter, sans-serif;
    ">
      ${displayCount}
    </div>
  `;
};

// ==========================================
// ANIMATE CLUSTER EXPANSION
// ==========================================
export const animateClusterExpansion = (cluster, targetZoom, map) => {
  if (!map || !cluster || cluster.type !== 'cluster') return;

  const bounds = cluster.bounds;
  if (bounds) {
    map.fitBounds(
      [
        [bounds.south, bounds.west],
        [bounds.north, bounds.east]
      ],
      {
        padding: [50, 50],
        maxZoom: targetZoom,
        animate: true,
        duration: 1
      }
    );
  } else {
    map.flyTo([cluster.lat, cluster.lng], targetZoom, {
      duration: 1
    });
  }
};

// ==========================================
// GET CLUSTER STATS
// ==========================================
export const getClusterStats = (clusters) => {
  if (!clusters || clusters.length === 0) {
    return {
      total: 0,
      clusters: 0,
      markers: 0,
      avgClusterSize: 0,
      largestCluster: 0
    };
  }

  const clusterItems = clusters.filter((c) => c.type === 'cluster');
  const markerItems = clusters.filter((c) => c.type === 'marker');

  const totalMarkers = clusters.reduce((sum, c) => sum + c.count, 0);

  return {
    total: totalMarkers,
    clusters: clusterItems.length,
    markers: markerItems.length,
    avgClusterSize: clusterItems.length > 0
      ? Math.round(totalMarkers / clusterItems.length)
      : 0,
    largestCluster: clusterItems.length > 0
      ? Math.max(...clusterItems.map((c) => c.count))
      : 0
  };
};

// ==========================================
// FILTER CLUSTERS BY VIEWPORT
// ==========================================
export const filterClustersByViewport = (clusters, viewport) => {
  if (!clusters || !viewport) return clusters;

  const { north, south, east, west } = viewport;

  return clusters.filter((cluster) => {
    return (
      cluster.lat <= north &&
      cluster.lat >= south &&
      cluster.lng <= east &&
      cluster.lng >= west
    );
  });
};

// ==========================================
// MERGE NEARBY CLUSTERS
// ==========================================
export const mergeNearbyClusters = (clusters, maxDistance = 0.01) => {
  if (!clusters || clusters.length < 2) return clusters;

  const merged = [];
  const processed = new Set();

  clusters.forEach((cluster, i) => {
    if (processed.has(i)) return;

    const group = [cluster];
    processed.add(i);

    clusters.forEach((other, j) => {
      if (i === j || processed.has(j)) return;

      const dist = Math.sqrt(
        Math.pow(cluster.lat - other.lat, 2) +
        Math.pow(cluster.lng - other.lng, 2)
      );

      if (dist <= maxDistance) {
        group.push(other);
        processed.add(j);
      }
    });

    if (group.length > 1) {
      const allMarkers = group.flatMap((g) =>
        g.type === 'cluster' ? g.markers : [g.marker]
      );
      const avgLat = allMarkers.reduce((sum, m) => sum + m.lat, 0) / allMarkers.length;
      const avgLng = allMarkers.reduce((sum, m) => sum + m.lng, 0) / allMarkers.length;

      merged.push({
        type: 'cluster',
        markers: allMarkers,
        lat: avgLat,
        lng: avgLng,
        count: allMarkers.length,
        bounds: getBounds(allMarkers)
      });
    } else {
      merged.push(cluster);
    }
  });

  return merged;
};

// ==========================================
// SPIDERFY (Spread overlapping markers)
// ==========================================
export const spiderfyMarkers = (cluster, options = {}) => {
  if (!cluster || cluster.type !== 'cluster') return [];

  const { circleRadius = 0.0003, spiral = false } = options;

  const count = cluster.markers.length;
  const result = [];

  cluster.markers.forEach((marker, i) => {
    const angle = (i / count) * 2 * Math.PI;
    const radius = spiral ? circleRadius * (i + 1) / count : circleRadius;

    result.push({
      ...marker,
      spiderLat: cluster.lat + radius * Math.cos(angle),
      spiderLng: cluster.lng + radius * Math.sin(angle),
      spiderIndex: i,
      isSpiderfied: true
    });
  });

  return result;
};

// ==========================================
// FORMAT CLUSTER COUNT
// ==========================================
export const formatClusterCount = (count) => {
  if (count < 1000) return count.toString();
  if (count < 1000000) return `${(count / 1000).toFixed(1)}k`;
  return `${(count / 1000000).toFixed(1)}M`;
};