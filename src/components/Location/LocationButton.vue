<template>
    <button 
      @click="$emit('click')" 
      class="location-button flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-4 rounded-lg transition-all duration-200 shadow-sm"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
      </svg>
      <slot>Choose your location</slot>
    </button>
  </template>
  
  <script setup>
  // Simple emitter component for the location button
  </script>