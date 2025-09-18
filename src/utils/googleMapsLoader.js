/**
 * Google Maps API Loader Utility
 * Dynamically loads Google Maps API with environment variable
 */

let isGoogleMapsLoaded = false;
let isGoogleMapsLoading = false;
let loadPromise = null;

// Global callback function for Google Maps API
window.initializeGoogleMaps = function() {
  isGoogleMapsLoaded = true;
  isGoogleMapsLoading = false;
  console.log('Google Maps API loaded successfully via callback');
}

export function loadGoogleMaps() {
  // Return existing promise if already loading
  if (loadPromise) {
    return loadPromise;
  }

  // Return resolved promise if already loaded
  if (isGoogleMapsLoaded) {
    return Promise.resolve();
  }

  // Start loading if not already in progress
  if (!isGoogleMapsLoading) {
    isGoogleMapsLoading = true;
    
    loadPromise = new Promise((resolve, reject) => {
      // Check if Google Maps is already available (loaded externally)
      if (window.google && window.google.maps) {
        isGoogleMapsLoaded = true;
        isGoogleMapsLoading = false;
        resolve();
        return;
      }

      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
      const devApiKey = import.meta.env.VITE_GOOGLE_MAPS_DEV_API_KEY;
      
      // Use dev API key for localhost, production key for production
      const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      const selectedApiKey = isLocalhost && devApiKey ? devApiKey : apiKey;
      
      if (!selectedApiKey) {
        console.error('Google Maps API key is not defined in environment variables');
        reject(new Error('Google Maps API key is missing'));
        return;
      }
      
      console.log(`Using ${isLocalhost ? 'development' : 'production'} Google Maps API key for ${window.location.hostname}`);

      // Set up callback resolution
      const originalCallback = window.initializeGoogleMaps;
      window.initializeGoogleMaps = function() {
        originalCallback();
        resolve();
      }

      // Create script element with callback
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${selectedApiKey}&libraries=places&callback=initializeGoogleMaps`;
      script.async = true;
      script.defer = true;

      // Handle load error only
      script.onerror = (error) => {
        isGoogleMapsLoading = false;
        console.error('Failed to load Google Maps API script:', error);
        reject(new Error('Failed to load Google Maps API script'));
      };

      // Add script to document head
      document.head.appendChild(script);
    });
  }

  return loadPromise;
}

export function isGoogleMapsReady() {
  return isGoogleMapsLoaded && window.google && window.google.maps;
}

export function waitForGoogleMaps() {
  return new Promise((resolve) => {
    if (isGoogleMapsReady()) {
      resolve();
      return;
    }

    // Poll until Google Maps is ready
    const checkInterval = setInterval(() => {
      if (isGoogleMapsReady()) {
        clearInterval(checkInterval);
        resolve();
      }
    }, 100);

    // Timeout after 10 seconds
    setTimeout(() => {
      clearInterval(checkInterval);
      if (!isGoogleMapsReady()) {
        console.warn('Google Maps API took too long to load');
      }
      resolve();
    }, 10000);
  });
}
