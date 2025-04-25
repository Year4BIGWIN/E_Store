<template>
    <div class="w-full h-[400px]" ref="mapContainer"></div>
    <input
      type="text"
      placeholder="Search location..."
      ref="autocompleteInput"
      class="mt-2 border p-2 w-full"
    />
    <div class="mt-4">
      <p><strong>Latitude:</strong> {{ selectedLat }}</p>
      <p><strong>Longitude:</strong> {{ selectedLng }}</p>
      <p><strong>Address:</strong> {{ selectedAddress }}</p>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  
  const mapContainer = ref(null)
  const autocompleteInput = ref(null)
  
  const selectedLat = ref(null)
  const selectedLng = ref(null)
  const selectedAddress = ref('')
  
  let map
  let marker
  
  onMounted(() => {
    // Initialize map
    map = new window.google.maps.Map(mapContainer.value, {
      center: { lat: 11.5564, lng: 104.9282 }, // Phnom Penh
      zoom: 13,
    })
  
    // Initialize draggable marker
    marker = new window.google.maps.Marker({
      position: { lat: 11.5564, lng: 104.9282 },
      map,
      draggable: true,
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
        } else {
          selectedAddress.value = 'Address not found'
        }
      })
    })
  
    // Autocomplete input search
    const autocomplete = new window.google.maps.places.Autocomplete(autocompleteInput.value)
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace()
      if (!place.geometry) return
  
      const location = place.geometry.location
      map.setCenter(location)
      marker.setPosition(location)
  
      selectedLat.value = location.lat()
      selectedLng.value = location.lng()
      selectedAddress.value = place.formatted_address || place.name
    })
  })
  </script>
  