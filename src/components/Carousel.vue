<template>
    <div class="relative w-full h-full overflow-hidden">
      <!-- Carousel Container -->
      <div
        class="flex"
        :style="{
          transform: `translateX(-${currentIndex * 100}%)`,
          transition: 'transform 2s cubic-bezier(0.25, 1, 0.5, 1)',
        }"
      >
        <!-- Slides -->
        <div
          v-for="(image, index) in images"
          :key="index"
          class="min-w-full h-full"
        >
          <img
            :src="image"
            alt="carousel image"
            class="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import Background from "@/assets/image/background.png";
  import Slide1 from "@/assets/image/slide1.jpeg";
  import Wala from "@/assets/image/wala.jpg";
  import Slide2 from "@/assets/image/slide2.webp";
  
  import { ref, onMounted, onUnmounted } from "vue";
  
  // Image URLs for the carousel
  const images = [Background, Slide1, Wala, Slide2];
  
  // Current slide index
  const currentIndex = ref(0);
  
  // Auto slide function
  let interval = null;
  
  const startAutoSlide = () => {
    interval = setInterval(() => {
      currentIndex.value = (currentIndex.value + 1) % images.length;
    }, 4000); // Auto-slide every 4 seconds
  };
  
  const stopAutoSlide = () => {
    clearInterval(interval);
  };
  
  // Start auto-slide on mount and stop on unmount
  onMounted(() => {
    startAutoSlide();
  });
  
  onUnmounted(() => {
    stopAutoSlide();
  });
  </script>
  
  <style scoped>
  /* Custom smooth transition (if needed) */
  </style>
  