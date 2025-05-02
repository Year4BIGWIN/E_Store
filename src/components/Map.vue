<template>
  <div class="location-component">
    <!-- Choose Location Button -->
    <button 
      v-if="!isLocationPickerVisible && (!profileLocation || profileLocation === 'undefined')" 
      @click="showLocationPicker" 
      class="location-button flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-4 rounded-lg transition-all duration-200 shadow-sm"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
      </svg>
      Choose your location
    </button>
    
    <!-- Current Location Card -->
    <div v-if="profileLocation && profileLocation !== 'undefined'" 
         class="mt-4 p-5 border border-gray-200 rounded-lg shadow-sm bg-white">
      <div class="flex items-start gap-3">
        <div class="text-indigo-500 mt-1">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <div class="flex-1">
          <h3 class="text-lg font-semibold text-gray-800 mb-2">Your Delivery Address</h3>
          <div class="bg-gray-50 p-3 rounded-md border border-gray-200 text-gray-700">
            {{ profileLocation }}
          </div>
          <button 
            @click="showLocationPicker" 
            class="mt-3 text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center gap-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
            Change address
          </button>
        </div>
      </div>
    </div>

    <!-- Location Picker Modal -->
    <transition name="fade">
      <div v-if="isLocationPickerVisible" class="location-picker-container">
        <div class="location-picker-backdrop" @click="hideLocationPicker"></div>
        <div class="location-picker-content max-w-4xl w-full bg-white rounded-xl shadow-2xl overflow-hidden">
          <!-- Modal Header -->
          <div class="p-5 border-b border-gray-200 flex justify-between items-center bg-gray-50">
            <h3 class="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
              </svg>
              Select Your Delivery Location
            </h3>
            <button @click="hideLocationPicker" class="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <!-- Search Bar -->
          <div class="p-5 bg-white border-b border-gray-200">
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search for an address or place..."
                ref="autocompleteInput"
                class="pl-10 pr-4 py-2.5 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              />
            </div>
          </div>
          
          <!-- Map Container -->
          <div class="relative">
            <div class="w-full h-[400px]" ref="mapContainer"></div>
            
            <!-- Map Loading Overlay -->
            <div v-if="isMapLoading" class="absolute inset-0 bg-gray-100 bg-opacity-75 flex items-center justify-center">
              <div class="text-center">
                <svg class="animate-spin h-10 w-10 text-indigo-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p class="mt-2 text-sm text-gray-600">Loading map...</p>
              </div>
            </div>
          </div>
          
          <!-- Selected Location Details -->
          <div class="p-5 border-t border-gray-200">
            <div v-if="selectedAddress" class="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
              <div class="flex items-start gap-3">
                <div class="text-indigo-500 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 class="font-medium text-gray-900 mb-1">Selected Location</h4>
                  <p class="text-gray-700">{{ selectedAddress }}</p>
                  <div class="mt-2 text-xs text-gray-500">
                    Coordinates: {{ selectedLat?.toFixed(6) }}, {{ selectedLng?.toFixed(6) }}
                  </div>
                </div>
              </div>
            </div>
            
            <div v-else class="text-center py-4 text-gray-500">
              <p>Drag the marker or search for a location to select your address</p>
            </div>
            
            <!-- Action Buttons -->
            <div class="flex justify-end gap-3 mt-2">
              <button 
                @click="hideLocationPicker" 
                class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                @click="confirmLocation" 
                class="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                :disabled="!selectedAddress"
              >
                <svg v-if="isUpdating" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ isUpdating ? 'Saving...' : 'Confirm Location' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import Cookies from 'universal-cookie';
import { useAuthStore } from '@/store/authStore'
import { toast } from 'vue3-toastify' // Import toast if you have it

const authStore = useAuthStore()
const cookies = new Cookies();
const token = cookies.get('auth_token');
const mapContainer = ref(null)
const autocompleteInput = ref(null)
const selectedLat = ref(null)
const selectedLng = ref(null)
const selectedAddress = ref('')
const isLocationPickerVisible = ref(false)
const isMapLoading = ref(false)
const isUpdating = ref(false)
const apiUrl = import.meta.env.VITE_APP_API_URL;

const profileLocation = computed(() => {
  return authStore.profile?.location?.locationAddress || '';
});

let map
let marker

const showLocationPicker = () => {
  isLocationPickerVisible.value = true
  isMapLoading.value = true
  // Initialize map after component is visible to ensure proper rendering
  setTimeout(initializeMap, 100)
}

const hideLocationPicker = () => {
  isLocationPickerVisible.value = false
}

const confirmLocation = async () => {
  if (!selectedLat.value || !selectedLng.value || !selectedAddress.value) {
    // Use toast notification if available
    if (typeof toast !== 'undefined') {
      toast.error("Please select a valid location first.")
    } else {
      alert("Please select a valid location first.")
    }
    return
  }

  // Check if we have a token before making the request
  if (!token) {
    if (typeof toast !== 'undefined') {
      toast.error("You are not authenticated. Please log in first.")
    } else {
      alert("You are not authenticated. Please log in first.")
    }
    return
  }

  isUpdating.value = true
  
  try {
    const response = await fetch(`${apiUrl}/update-location?latitude=${selectedLat.value}&longitude=${selectedLng.value}&address=${encodeURIComponent(selectedAddress.value)}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('API error:', errorData)
      if (typeof toast !== 'undefined') {
        toast.error('Failed to update location')
      } else {
        alert('Failed to update location')
      }
    } else {
      const data = await response.json()
      console.log('Location updated successfully:', data)
      // Update the auth store profile to reflect changes
      authStore.fetchProfile()
      
      if (typeof toast !== 'undefined') {
        toast.success('Location updated successfully')
      } else {
        alert('Location updated successfully')
      }
    }
  } catch (err) {
    console.error('Request failed:', err)
    if (typeof toast !== 'undefined') {
      toast.error('An error occurred while updating the location')
    } else {
      alert('An error occurred while updating the location')
    }
  } finally {
    isUpdating.value = false
    hideLocationPicker()
  }
}

const initializeMap = () => {
  if (!mapContainer.value) return
  
  // Initialize map
  map = new window.google.maps.Map(mapContainer.value, {
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

  // Initialize draggable marker with custom icon
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
      } else {
        selectedAddress.value = 'Address not found'
      }
    })
  })

  // Autocomplete input search with bias to map bounds
  const autocomplete = new window.google.maps.places.Autocomplete(autocompleteInput.value, {
    types: ['geocode', 'establishment']
  })
  
  // Bind autocomplete to map bounds
  autocomplete.bindTo('bounds', map)
  
  autocomplete.addListener('place_changed', () => {
    const place = autocomplete.getPlace()
    if (!place.geometry) return

    const location = place.geometry.location
    map.setCenter(location)
    map.setZoom(16) // Zoom in when place is selected
    marker.setPosition(location)

    selectedLat.value = location.lat()
    selectedLng.value = location.lng()
    selectedAddress.value = place.formatted_address || place.name
  })
  
  // Map loaded
  isMapLoading.value = false
  
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
          }
        })
      },
      () => {
        console.log('Error getting current position')
      }
    )
  }
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
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.location-picker-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(2px);
}

.location-picker-content {
  position: relative;
  max-height: 90vh;
  overflow: auto;
  z-index: 1001;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>