<template>
    <div class="border-b">
      <button 
        @click="toggleDropdown" 
        class="w-full flex justify-between items-center py-3 px-4 font-semibold text-blue-700">
        {{ title }}
        <span :class="isOpen ? 'rotate-180' : 'rotate-0'" class="transition-transform duration-300 ease-in-out">&#x25BE;</span>
      </button>
      <div v-if="isOpen" class="p-4 bg-gray-50 border-t">
        <slot></slot>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const props = defineProps({
    title: {
      type: String,
      required: true
    }
  });
  
  const isOpen = ref(false);
  
  const toggleDropdown = () => {
    isOpen.value = !isOpen.value;
  };
  </script>
  