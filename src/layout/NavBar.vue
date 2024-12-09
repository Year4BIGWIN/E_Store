<template>
    <div class=" sticky top-0 z-50 flex max-w-6xl w-full ">
      <nav class=" flex w-full items-center justify-between px-6 py-3 bg-white shadow-md">
      <!-- Logo -->
      <div class="flex items-center space-x-2">
        <img :src="img" alt="Logo" class="h-6 w-6" />
        <span class="text-lg font-bold text-gray-800">HomeTech</span>
      </div>
  
      <!-- Icons -->
      <div class="flex items-center space-x-4">
        <!-- Search Icon -->
        <button @click="handleSearch" class="text-gray-600 hover:text-black">
          🔍
        </button>
  
        <!-- Cart Icon with Badge -->
        <button @click="handleCart" class="relative text-gray-600 hover:text-black">
          🛒
          <span
            v-if="cartCount > 0"
            class="absolute -top-1 -right-2 bg-red-500 text-white text-xs font-bold rounded-full px-1.5 py-0.5"
          >
            {{ cartCount }}
          </span>
        </button>
  
        <!-- Profile Picture -->
        <img
          :src="img"
          alt="Profile"
          class="h-8 w-8 rounded-full object-cover"
        />
      </div>
    </nav>
    </div>




  </template>
  
  <script setup>
  import { ref } from "vue";
  import img from "../assets/logo.svg";
  
  // Reactive state for cart count
  const cartCount = ref(2); // Example count
  
  // Event handlers
  const handleSearch = () => {
    console.log("Search button clicked");
  };
  
  const handleCart = () => {
    console.log("Cart button clicked");
  };
  </script>
  
  <style scoped>
  /* No additional styles needed, Tailwind CSS handles everything */
  </style>
  