/**
 * Simple Google Maps Initialization Script
 * This can be used as a fallback if dynamic loading fails
 */

// Global initialization function for Google Maps API
window.initGoogleMaps = function() {
  console.log('Google Maps API initialized successfully');
  
  // Dispatch a custom event to notify components that Google Maps is ready
  window.dispatchEvent(new CustomEvent('googleMapsReady', {
    detail: { 
      loaded: true,
      timestamp: new Date().toISOString()
    }
  }));
};

// Check if Google Maps API is already loaded
if (window.google && window.google.maps) {
  window.initGoogleMaps();
}
