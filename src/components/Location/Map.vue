<template>
    <div class="location-component">
      <!-- Choose Location Button -->
      <location-button
        v-if="!isLocationPickerVisible && (!profileLocation || profileLocation === 'undefined')"
        @click="showLocationPicker" 
      />
      
      <!-- Current Location Card -->
      <location-display
        v-if="profileLocation && profileLocation !== 'undefined'"
        :address="profileLocation"
        @change="showLocationPicker"
      />
  
      <!-- Location Picker Modal -->
      <location-picker-modal
        :visible="isLocationPickerVisible"
        :token="token"
        :apiUrl="apiUrl"
        @close="hideLocationPicker"
        @update="authStore.fetchProfile()"
      />
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  import Cookies from 'universal-cookie'
  import { useAuthStore } from '@/store/authStore'
  import LocationButton from '@/components/Location/LocationButton.vue'
  import LocationDisplay from '@/components/Location/LocationDisplay.vue'
  import LocationPickerModal from '@/components/Location/LocationPickerModal.vue'
  
  const authStore = useAuthStore()
  const cookies = new Cookies()
  const token = cookies.get('auth_token')
  const isLocationPickerVisible = ref(false)
  const apiUrl = import.meta.env.VITE_APP_API_URL
  
  const profileLocation = computed(() => {
    return authStore.profile?.location?.locationAddress || ''
  })
  
  const showLocationPicker = () => {
    isLocationPickerVisible.value = true
  }
  
  const hideLocationPicker = () => {
    isLocationPickerVisible.value = false
  }
  
  // Ensure profile is loaded
  authStore.fetchProfile()
  </script>