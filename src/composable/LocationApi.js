import { ref } from 'vue'

export function useLocationMap() {
  const selectedLat = ref(null)
  const selectedLng = ref(null)
  const selectedAddress = ref('')
  const isMapLoading = ref(false)
  
  let map = null
  let marker = null
  let autocomplete = null
  
  const initializeMap = (mapContainer, searchInput, onLocationSelected) => {
    if (!mapContainer) return
    
    isMapLoading.value = true
    
    // Initialize map
    map = new window.google.maps.Map(mapContainer, {
      center: { lat: 11.5564, lng: 104.9282 }, // Phnom Penh
      zoom: 13,
      mapTypeControl: true,
      streetViewControl: false,
      fullscreenControl: true,
      zoomControl: true,
      styles: [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "on" }]
        }
      ]
    })

    // Initialize draggable marker
    marker = new window.google.maps.Marker({
      position: { lat: 11.5564, lng: 104.9282 },
      map,
      draggable: true,
      animation: window.google.maps.Animation.DROP,
    })

    const geocoder = new window.google.maps.Geocoder()

    // Handle marker drag event to get updated address
    marker.addListener('dragend', () => {
      const pos = marker.getPosition()
      selectedLat.value = pos.lat()
      selectedLng.value = pos.lng()

      geocoder.geocode({ location: pos }, (results, status) => {
        if (status === 'OK' && results[0]) {
          selectedAddress.value = results[0].formatted_address
          if (onLocationSelected) {
            onLocationSelected(selectedLat.value, selectedLng.value, selectedAddress.value)
          }
        } else {
          selectedAddress.value = 'Address not found'
        }
      })
    })

    // Autocomplete setup if search input is provided
    if (searchInput) {
      autocomplete = new window.google.maps.places.Autocomplete(searchInput, {
        types: ['geocode', 'establishment']
      })
      
      autocomplete.bindTo('bounds', map)
      
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace()
        if (!place.geometry) return

        const location = place.geometry.location
        map.setCenter(location)
        map.setZoom(16)
        marker.setPosition(location)

        selectedLat.value = location.lat()
        selectedLng.value = location.lng()
        selectedAddress.value = place.formatted_address || place.name
        
        if (onLocationSelected) {
          onLocationSelected(selectedLat.value, selectedLng.value, selectedAddress.value)
        }
      })
    }
    
    // Try to center on user's location if available
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
          map.setCenter(userLocation)
          marker.setPosition(userLocation)
          
          // Get address for the location
          geocoder.geocode({ location: userLocation }, (results, status) => {
            if (status === 'OK' && results[0]) {
              selectedLat.value = userLocation.lat
              selectedLng.value = userLocation.lng
              selectedAddress.value = results[0].formatted_address
              
              if (onLocationSelected) {
                onLocationSelected(selectedLat.value, selectedLng.value, selectedAddress.value)
              }
            }
          })
        },
        () => {
          console.log('Error getting current position')
        }
      )
    }
    
    isMapLoading.value = false
  }
  
  return {
    selectedLat,
    selectedLng,
    selectedAddress,
    isMapLoading,
    initializeMap
  }
}