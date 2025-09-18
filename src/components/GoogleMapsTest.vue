<!-- Simple Google Maps Test Component -->
<template>
  <div class="p-4">
    <h3 class="text-lg font-semibold mb-4">Google Maps API Test</h3>
    
    <div class="mb-4">
      <button 
        @click="testGoogleMapsAPI" 
        class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        :disabled="loading"
      >
        {{ loading ? 'Testing...' : 'Test Google Maps API' }}
      </button>
    </div>
    
    <div v-if="result" class="p-3 rounded border" :class="resultClass">
      <pre>{{ result }}</pre>
    </div>
    
    <div v-if="!loading && isLoaded" class="mt-4">
      <div ref="testMap" class="w-full h-64 border rounded"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const loading = ref(false)
const result = ref('')
const isLoaded = ref(false)
const testMap = ref(null)

const resultClass = computed(() => {
  if (result.value.includes('Success')) {
    return 'bg-green-50 border-green-200 text-green-800'
  } else if (result.value.includes('Error')) {
    return 'bg-red-50 border-red-200 text-red-800'
  }
  return 'bg-gray-50 border-gray-200 text-gray-800'
})

const testGoogleMapsAPI = async () => {
  loading.value = true
  result.value = ''
  
  try {
    // Test 1: Check environment variable
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
    result.value += `Environment Variable: ${apiKey ? 'Found' : 'Missing'}\n`
    result.value += `API Key: ${apiKey ? apiKey.substring(0, 10) + '...' : 'N/A'}\n\n`
    
    if (!apiKey) {
      result.value += 'Error: VITE_GOOGLE_MAPS_API_KEY not found in environment variables'
      return
    }
    
    // Test 2: Check if Google Maps is already loaded
    if (window.google && window.google.maps) {
      result.value += 'Google Maps API: Already loaded ✓\n'
      isLoaded.value = true
      
      // Test creating a map
      setTimeout(() => {
        if (testMap.value) {
          try {
            const map = new window.google.maps.Map(testMap.value, {
              center: { lat: 11.5564, lng: 104.9282 },
              zoom: 13
            })
            result.value += 'Map Creation: Success ✓\n'
          } catch (error) {
            result.value += `Map Creation Error: ${error.message}\n`
          }
        }
      }, 100)
      
    } else {
      result.value += 'Google Maps API: Not loaded, attempting to load...\n'
      
      // Test 3: Load Google Maps API
      const script = document.createElement('script')
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=testGoogleMapsCallback`
      
      // Set up callback
      window.testGoogleMapsCallback = () => {
        result.value += 'Google Maps API: Loaded successfully ✓\n'
        isLoaded.value = true
        
        // Test creating a map
        setTimeout(() => {
          if (testMap.value) {
            try {
              const map = new window.google.maps.Map(testMap.value, {
                center: { lat: 11.5564, lng: 104.9282 },
                zoom: 13
              })
              result.value += 'Map Creation: Success ✓\n'
            } catch (error) {
              result.value += `Map Creation Error: ${error.message}\n`
            }
          }
        }, 100)
      }
      
      script.onerror = (error) => {
        result.value += `Script Load Error: ${error}\n`
        result.value += 'Possible issues:\n'
        result.value += '- Invalid API key\n'
        result.value += '- API key restrictions\n' 
        result.value += '- Network connectivity\n'
        result.value += '- Quota exceeded\n'
      }
      
      document.head.appendChild(script)
    }
    
  } catch (error) {
    result.value += `Unexpected Error: ${error.message}\n`
  } finally {
    loading.value = false
  }
}
</script>
