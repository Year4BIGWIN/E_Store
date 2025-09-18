<template>
  <div>
    <!-- Google Maps Debugger (temporary for testing) -->
    <GoogleMapsDebugger />
    
    <!-- Button to show location picker -->
    <button 
      v-if="!isLocationPickerVisible" 
      @click="showLocationPicker" 
      class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
    >
      Choose location
    </button>
    
    <!-- Display current location from profile -->
    <div v-if="profileLocation && profileLocation !== 'undefined'" class="mt-4 p-4 border border-gray-300 rounded">
      <h3 class="text-lg font-semibold mb-2">Your Current Location</h3>
      <input 
        type="text" 
        :value="profileLocation" 
        readonly
        class="w-full p-2 bg-gray-100 rounded border border-gray-300"
      />
    </div>

    <!-- Location picker modal -->
    <div v-if="isLocationPickerVisible" class="location-picker-container">
      <div class="location-picker-content">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold">Select Location</h3>
          <button @click="hideLocationPicker" class="text-gray-500 hover:text-gray-700">
            <span class="text-xl">&times;</span>
          </button>
        </div>
        
        <div class="w-[1152px] h-[400px]" ref="mapContainer"></div>
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
        
        <div class="mt-4 flex justify-end">
          <button 
            @click="confirmLocation" 
            class="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded"
          >
            Confirm Location
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import Cookies from 'universal-cookie';
import { useAuthStore } from '@/store/authStore'
import GoogleMapsDebugger from '@/components/GoogleMapsDebugger.vue'

const authStore = useAuthStore()
const cookies = new Cookies();
const token = cookies.get('auth_token');
const mapContainer = ref(null)
const autocompleteInput = ref(null)
const selectedLat = ref(null)
const selectedLng = ref(null)
const selectedAddress = ref('')
const isLocationPickerVisible = ref(false)
const apiUrl = import.meta.env.VITE_APP_API_URL;

const profileLocation = computed(() => {
  return authStore.profile?.location?.locationAddress || '';
});

let map
let marker

const showLocationPicker = () => {
  isLocationPickerVisible.value = true
  // Initialize map after component is visible to ensure proper rendering
  setTimeout(initializeMap, 100)
}

const hideLocationPicker = () => {
  isLocationPickerVisible.value = false
}

const confirmLocation = async () => {
  if (!selectedLat.value || !selectedLng.value || !selectedAddress.value) {
    alert("Please select a valid location first.")
    return
  }

  // Check if we have a token before making the request
  if (!token) {
    alert("You are not authenticated. Please log in first.")
    return
  }

  try {
    const response = await fetch(`${apiUrl}/update-location?latitude=${selectedLat.value}&longitude=${selectedLng.value}&address=${encodeURIComponent(selectedAddress.value)}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,  // Use the token from cookies
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('API error:', errorData)
      alert('Failed to update location')
    } else {
      const data = await response.json()
      console.log('Location updated successfully:', data)
      alert('Location updated successfully')
    }
  } catch (err) {
    console.error('Request failed:', err)
    alert('An error occurred while updating the location')
  }

  hideLocationPicker()
}

const initializeMap = () => {
  if (!mapContainer.value) return
  
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
}

onMounted(() => {
  authStore.fetchProfile() // Fetch user profile on mount
})
</script>

<style scoped>
.location-picker-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.location-picker-content {
  background-color: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  max-width: 95%;
  max-height: 95%;
  overflow: auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>