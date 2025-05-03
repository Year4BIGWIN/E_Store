<template>
  <div class="mt-4 p-5 border border-gray-200 rounded-lg shadow-sm bg-white">
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
          {{ address }}
        </div>
        <button 
          @click="$emit('change')" 
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
</template>

<script setup>
defineProps({
  address: {
    type: String,
    required: true
  }
})

defineEmits(['change'])
</script>