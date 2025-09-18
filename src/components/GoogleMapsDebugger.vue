<!-- Google Maps API Key Tester -->
<template>
  <div class="p-6 max-w-2xl mx-auto">
    <div class="bg-white rounded-lg shadow-md p-6">
      <h2 class="text-2xl font-bold text-gray-800 mb-4">🗺️ Google Maps API Diagnostics</h2>
      
      <div class="space-y-4">
        <!-- Current Environment Info -->
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 class="font-semibold text-blue-800 mb-2">Environment Information</h3>
          <div class="text-sm space-y-1">
            <div><strong>Domain:</strong> {{ currentDomain }}</div>
            <div><strong>Full URL:</strong> {{ currentUrl }}</div>
            <div><strong>Environment:</strong> {{ isLocalhost ? 'Development (localhost)' : 'Production' }}</div>
          </div>
        </div>

        <!-- API Key Status -->
        <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h3 class="font-semibold text-gray-800 mb-2">API Key Configuration</h3>
          <div class="text-sm space-y-1">
            <div><strong>Production Key:</strong> {{ prodKey ? prodKey.substring(0, 15) + '...' : 'Not found' }}</div>
            <div><strong>Dev Key:</strong> {{ devKey ? devKey.substring(0, 15) + '...' : 'Not configured' }}</div>
            <div><strong>Selected Key:</strong> {{ selectedKey ? selectedKey.substring(0, 15) + '...' : 'None' }}</div>
          </div>
        </div>

        <!-- Google Maps API Status -->
        <div class="border rounded-lg p-4" :class="statusClass">
          <h3 class="font-semibold mb-2" :class="statusTextClass">Google Maps API Status</h3>
          <div class="text-sm">
            <div><strong>API Loaded:</strong> {{ apiLoaded ? '✅ Yes' : '❌ No' }}</div>
            <div><strong>Maps Available:</strong> {{ mapsAvailable ? '✅ Yes' : '❌ No' }}</div>
            <div v-if="error" class="mt-2 text-red-600"><strong>Error:</strong> {{ error }}</div>
          </div>
        </div>

        <!-- Instructions -->
        <div v-if="!apiLoaded || error" class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 class="font-semibold text-yellow-800 mb-2">🔧 Fix Instructions</h3>
          <div class="text-sm text-yellow-700 space-y-2">
            <p><strong>For RefererNotAllowedMapError:</strong></p>
            <ol class="list-decimal list-inside space-y-1 ml-4">
              <li>Go to <a href="https://console.cloud.google.com/apis/credentials" target="_blank" class="text-blue-600 underline">Google Cloud Console</a></li>
              <li>Find your API key and click Edit</li>
              <li>Under "Application restrictions" → "HTTP referrers", add:</li>
              <ul class="list-disc list-inside ml-4 mt-1">
                <li><code class="bg-gray-100 px-1 rounded">http://localhost:5173/*</code></li>
                <li><code class="bg-gray-100 px-1 rounded">http://127.0.0.1:5173/*</code></li>
                <li><code class="bg-gray-100 px-1 rounded">https://smartgear.sunneng.site/*</code></li>
              </ul>
              <li>Save the changes</li>
              <li>Wait 1-2 minutes for changes to propagate</li>
            </ol>
          </div>
        </div>

        <!-- Test Button -->
        <button 
          @click="testApiKey" 
          class="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          :disabled="testing"
        >
          {{ testing ? 'Testing...' : 'Test API Key' }}
        </button>

        <!-- Test Results -->
        <div v-if="testResult" class="border rounded-lg p-4" :class="testResultClass">
          <h3 class="font-semibold mb-2">Test Results</h3>
          <pre class="text-sm whitespace-pre-wrap">{{ testResult }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const currentDomain = ref(window.location.hostname)
const currentUrl = ref(window.location.href)
const isLocalhost = ref(['localhost', '127.0.0.1'].includes(window.location.hostname))
const prodKey = ref(import.meta.env.VITE_GOOGLE_MAPS_API_KEY)
const devKey = ref(import.meta.env.VITE_GOOGLE_MAPS_DEV_API_KEY)
const apiLoaded = ref(false)
const mapsAvailable = ref(false)
const error = ref('')
const testing = ref(false)
const testResult = ref('')

const selectedKey = computed(() => {
  return isLocalhost.value && devKey.value ? devKey.value : prodKey.value
})

const statusClass = computed(() => {
  if (apiLoaded.value && mapsAvailable.value) return 'bg-green-50 border-green-200'
  if (error.value) return 'bg-red-50 border-red-200'
  return 'bg-yellow-50 border-yellow-200'
})

const statusTextClass = computed(() => {
  if (apiLoaded.value && mapsAvailable.value) return 'text-green-800'
  if (error.value) return 'text-red-800'
  return 'text-yellow-800'
})

const testResultClass = computed(() => {
  if (testResult.value.includes('SUCCESS')) return 'bg-green-50 border-green-200'
  if (testResult.value.includes('ERROR')) return 'bg-red-50 border-red-200'
  return 'bg-gray-50 border-gray-200'
})

const checkGoogleMapsStatus = () => {
  apiLoaded.value = !!(window.google)
  mapsAvailable.value = !!(window.google && window.google.maps)
  
  if (!apiLoaded.value && window.gm_authFailure) {
    error.value = 'Authentication failed - check API key'
  }
}

const testApiKey = async () => {
  testing.value = true
  testResult.value = ''
  
  try {
    testResult.value = 'Testing API key configuration...\n\n'
    
    // Test 1: Check environment variables
    testResult.value += `Environment Variables:\n`
    testResult.value += `- VITE_GOOGLE_MAPS_API_KEY: ${prodKey.value ? 'Found' : 'Missing'}\n`
    testResult.value += `- VITE_GOOGLE_MAPS_DEV_API_KEY: ${devKey.value ? 'Found' : 'Missing'}\n`
    testResult.value += `- Selected key: ${selectedKey.value ? selectedKey.value.substring(0, 15) + '...' : 'None'}\n\n`
    
    // Test 2: Check current API status
    testResult.value += `Current API Status:\n`
    testResult.value += `- Google object exists: ${!!window.google}\n`
    testResult.value += `- Google Maps available: ${!!(window.google && window.google.maps)}\n\n`
    
    if (!selectedKey.value) {
      testResult.value += 'ERROR: No API key found in environment variables!\n'
      return
    }
    
    // Test 3: Try to load a new script to test the API key
    testResult.value += 'Testing API key validity...\n'
    
    const testScript = document.createElement('script')
    const testCallback = 'testGoogleMapsCallback_' + Date.now()
    
    window[testCallback] = () => {
      testResult.value += 'SUCCESS: API key is valid and maps loaded successfully!\n'
      testResult.value += 'The domain is properly configured for this API key.\n'
      delete window[testCallback]
    }
    
    testScript.onerror = () => {
      testResult.value += 'ERROR: Failed to load Google Maps API\n'
      testResult.value += 'This usually indicates:\n'
      testResult.value += '- Invalid API key\n'
      testResult.value += '- Domain not authorized (RefererNotAllowedMapError)\n'
      testResult.value += '- API not enabled in Google Cloud Console\n'
      testResult.value += '- Billing not set up\n\n'
      testResult.value += `Current domain: ${window.location.origin}\n`
      testResult.value += 'Make sure this domain is added to your API key restrictions.\n'
      delete window[testCallback]
    }
    
    testScript.src = `https://maps.googleapis.com/maps/api/js?key=${selectedKey.value}&libraries=places&callback=${testCallback}`
    document.head.appendChild(testScript)
    
    // Cleanup after 10 seconds
    setTimeout(() => {
      if (document.head.contains(testScript)) {
        document.head.removeChild(testScript)
      }
      if (window[testCallback]) {
        testResult.value += 'TIMEOUT: API key test timed out\n'
        delete window[testCallback]
      }
    }, 10000)
    
  } catch (error) {
    testResult.value += `UNEXPECTED ERROR: ${error.message}\n`
  } finally {
    testing.value = false
  }
}

onMounted(() => {
  checkGoogleMapsStatus()
  
  // Listen for Google Maps ready event
  window.addEventListener('googleMapsReady', () => {
    checkGoogleMapsStatus()
  })
  
  // Check for authentication failures
  window.addEventListener('error', (e) => {
    if (e.message && e.message.includes('Google Maps')) {
      error.value = e.message
    }
  })
})
</script>
