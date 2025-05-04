<template>
  <div class="w-full max-w-4xl bg-white rounded-lg shadow-sm border border-gray-100 p-4 sm:p-2">
    <div class="grid grid-cols-4 gap-2 sm:gap-1">
      <div 
        v-for="(spec, index) in displaySpecs" 
        :key="index" 
        class="flex flex-col items-center p-2 sm:p-1"
        :class="{'border-r border-gray-200 sm:border-r-0 md:border-r': index < displaySpecs.length - 1}"
      >
        <div class="w-12 h-12 sm:w-8 sm:h-8 bg-gray-100 rounded-full flex items-center justify-center mb-4 sm:mb-2">
          <div class="sm:scale-75" v-html="spec.icon"></div>
        </div>
        <h3 class="text-xs sm:text-xs text-gray-800 text-center">{{ spec.title }}</h3>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

// Add props to accept product data
const props = defineProps({
  product: {
    type: Object,
    required: true
  }
});

// Store icons separately for cleaner code
const icons = {
  screenSize: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
            <circle cx="12" cy="18" r="1" />
          </svg>`,
  camera: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
            <circle cx="12" cy="13" r="3" />
          </svg>`,
  ram: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <rect x="4" y="4" width="16" height="16" rx="2" ry="2" />
            <rect x="9" y="9" width="6" height="6" />
            <line x1="9" y1="1" x2="9" y2="4" />
            <line x1="15" y1="1" x2="15" y2="4" />
            <line x1="9" y1="20" x2="9" y2="23" />
            <line x1="15" y1="20" x2="15" y2="23" />
            <line x1="20" y1="9" x2="23" y2="9" />
            <line x1="20" y1="14" x2="23" y2="14" />
            <line x1="1" y1="9" x2="4" y2="9" />
            <line x1="1" y1="14" x2="4" y2="14" />
          </svg>`,
  battery: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <rect x="1" y="6" width="18" height="12" rx="2" ry="2" />
            <line x1="23" y1="13" x2="23" y2="11" />
          </svg>`
};

// Create computed specs from product data
const displaySpecs = computed(() => {
  return [
    {
      icon: icons.screenSize,
      title: props.product?.display?.screenSize || 'N/A'
    },
    {
      icon: icons.camera,
      title: props.product?.camera?.mainCamera?.split(',')[0] || 'N/A' // Just take main MP value
    },
    {
      icon: icons.ram,
      title: props.product?.performance?.ram || 'N/A'
    },
    {
      icon: icons.battery,
      title: props.product?.battery?.batteryCapacity || 'N/A'
    }
  ];
});
</script>