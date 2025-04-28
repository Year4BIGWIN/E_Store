<template>
  <div class="bg-white overflow-hidden shadow rounded-lg">
    <div class="px-4 py-5 sm:p-6">
      <dl>
        <dt class="text-sm font-medium text-gray-500 truncate">{{ title }}</dt>
        <dd class="mt-1 text-3xl font-semibold text-gray-900">
          <slot name="value">{{ value }}</slot>
        </dd>
        <dd 
          v-if="showChange" 
          class="mt-2 flex items-center text-sm font-medium" 
          :class="changeDirection === 'up' ? 'text-green-600' : 'text-red-600'"
        >
          <span v-if="changeDirection === 'up'">
            <svg class="self-center flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clip-rule="evenodd" />
            </svg>
          </span>
          <span v-else>
            <svg class="self-center flex-shrink-0 h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1V9a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586 3.707 5.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" clip-rule="evenodd" />
            </svg>
          </span>
          <span class="ml-1">{{ changePercentage }}% from last month</span>
        </dd>
      </dl>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: [String, Number],
    default: ''
  },
  showChange: {
    type: Boolean,
    default: true
  },
  changeDirection: {
    type: String,
    default: 'up'
  },
  changePercentage: {
    type: [String, Number],
    default: 0
  }
});
</script>