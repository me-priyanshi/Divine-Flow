/**
 * Utility functions for generating Google Maps URLs
 */

/**
 * Generate a Google Maps search URL for a location
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {string} placeName - Optional place name
 * @returns {string} Google Maps search URL
 */
export const getGoogleMapsSearchUrl = (lat, lng, placeName = '') => {
  if (placeName) {
    return `https://www.google.com/maps/search/${encodeURIComponent(placeName)}/@${lat},${lng},15z`;
  }
  return `https://www.google.com/maps/search/@${lat},${lng},15z`;
};

/**
 * Generate a Google Maps directions URL to a destination
 * @param {number} lat - Destination latitude
 * @param {number} lng - Destination longitude
 * @param {string} placeName - Optional place name
 * @param {string} travelMode - Travel mode (driving, walking, transit, bicycling)
 * @returns {string} Google Maps directions URL
 */
export const getGoogleMapsDirectionsUrl = (lat, lng, placeName = '', travelMode = 'driving') => {
  // Use the proper Google Maps URL format that actually works
  const destination = placeName ? encodeURIComponent(placeName) : `${lat},${lng}`;
  return `https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=${travelMode}`;
};

/**
 * Generate a Google Maps directions URL to a named location
 * @param {string} destination - Destination name and location
 * @param {string} travelMode - Travel mode (driving, walking, transit, bicycling)
 * @returns {string} Google Maps directions URL
 */
export const getGoogleMapsDirectionsByName = (destination, travelMode = 'driving') => {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}&travelmode=${travelMode}`;
};

/**
 * Generate multiple map service URLs for fallback options
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {string} placeName - Place name
 * @returns {object} Object containing URLs for different map services
 */
export const getMapServiceUrls = (lat, lng, placeName = '') => {
  return {
    googleMaps: getGoogleMapsSearchUrl(lat, lng, placeName),
    googleDirections: getGoogleMapsDirectionsUrl(lat, lng, placeName),
    appleMaps: `http://maps.apple.com/?q=${lat},${lng}`,
    bingMaps: `https://www.bing.com/maps?q=${lat},${lng}`,
    openStreetMap: `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}&zoom=15`
  };
};

/**
 * Open map with fallback options
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {string} placeName - Place name
 * @param {string} action - 'view' or 'directions'
 * @param {string} travelMode - Travel mode for directions
 */
export const openMap = (lat, lng, placeName = '', action = 'view', travelMode = 'driving') => {
  let url;
  
  if (action === 'directions') {
    url = getGoogleMapsDirectionsUrl(lat, lng, placeName, travelMode);
  } else {
    url = getGoogleMapsSearchUrl(lat, lng, placeName);
  }
  
  // Try to open the URL
  try {
    window.open(url, '_blank');
  } catch (error) {
    console.error('Error opening map:', error);
    // Fallback to basic Google Maps
    window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
  }
};
