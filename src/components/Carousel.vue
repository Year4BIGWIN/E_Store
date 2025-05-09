<template>
  <!-- Mobile Skeleton (shown while loading) -->
  <div v-if="!isReady" class="relative w-full h-[250px] bg-gray-200 md:hidden">
    <!-- Center loader -->
    <div class="absolute inset-0 flex items-center justify-center">
      <Loader />
    </div>
    <div class="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
      <div v-for="i in 4" :key="i" class="w-2 h-2 rounded-full "></div>
    </div>
  </div>
        
  <!-- Desktop Skeleton (shown while loading) -->
  <div v-if="!isReady" class="relative w-screen h-[450px]  hidden md:block">
    <!-- Center loader -->
        <div class="absolute inset-0 flex items-center justify-center">
      <Loader />
    </div>
    <div class="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
      <div v-for="i in 4" :key="i" class="w-3 h-3 rounded-full bg-gray-300"></div>
    </div>
  </div>

  <!-- Mobile Carousel (hidden on md screens and up) -->
  <div class="relative w-full h-[250px] overflow-hidden md:hidden" v-show="isReady">
    <!-- Error state -->
    <div v-if="error" class="w-full h-full flex items-center justify-center bg-gray-100">
      <div class="text-red-500 text-sm">Failed to load slides</div>
        </div>
    
    <!-- Mobile Carousel Container -->
    <div
      v-else
      class="flex w-full h-full"
      :style="{
        transform: `translateX(-${currentIndex * 100}%)`,
        transition: isInitialized ? 'transform 2s cubic-bezier(0.25, 1, 0.5, 1)' : 'none',
      }"
    >
      <div
        v-for="(slide, index) in slides"
        :key="index"
        class="min-w-full h-full"
      >
        <img
          :src="slide.imageUrl"
          :alt="slide.title || 'carousel image'"
          class="w-full h-[250px] object-cover"
        />
      </div>
      <p class="mt-3 text-sm text-blue-600 font-medium animate-pulse">Loading...</p>
    </div>
    
    <!-- Mobile Navigation Dots -->
    <div class="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
      <button 
        v-for="(_, index) in slides" 
        :key="index"
        @click="currentIndex = index"
        class="w-2 h-2 rounded-full transition-all"
        :class="currentIndex === index ? 'bg-white scale-125' : 'bg-white/50'"
        aria-label="Go to slide"
      ></button>
    </div>
  </div>

  <!-- Desktop Carousel (hidden on smaller screens) -->
  <div class="relative w-screen h-[450px] overflow-hidden hidden md:block" v-show="isReady">
    <!-- Error state -->
    <div v-if="error" class="w-full h-full flex items-center justify-center bg-gray-100">
      <div class="text-red-500 text-base">Failed to load slides</div>
    </div>
    
    <!-- Desktop Carousel Container -->
    <div
      v-else
      class="flex w-full h-full"
      :style="{
        transform: `translateX(-${currentIndex * 100}%)`,
        transition: isInitialized ? 'transform 2s cubic-bezier(0.25, 1, 0.5, 1)' : 'none',
      }"
    >
      <!-- Slides -->
      <div
        v-for="(slide, index) in slides"
        :key="index"
        class="min-w-full h-full"
      >
        <img
          :src="slide.imageUrl"
          :alt="slide.title || 'carousel image'"
          class="w-full h-[450px] object-cover"
        />
      </div>
    </div>
    
    <!-- Desktop Navigation Dots -->
    <div class="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
      <button 
        v-for="(_, index) in slides" 
        :key="index"
        @click="currentIndex = index"
        class="w-3 h-3 rounded-full transition-all"
        :class="currentIndex === index ? 'bg-white scale-125' : 'bg-white/50'"
        aria-label="Go to slide"
      ></button>
    </div>
  </div>
</template>

<script setup>
// For fallback purposes only
import Background from "@/assets/image/image2.png";
import Slide1 from "@/assets/image/image.png";
import Wala from "@/assets/image/image copy.png";
import Slide2 from "@/assets/image/image copy 2.png";

import { ref, onMounted, onUnmounted } from "vue";
import Loader from "@/components/Loader.vue";

const apiUrl = import.meta.env.VITE_APP_API_URL;

// State management
const slides = ref([]);
const loading = ref(true);
const error = ref(false);
const currentIndex = ref(0);
const isInitialized = ref(false);
const isReady = ref(false);  // New ref to control visibility

// Fallback images in case API fails
const fallbackImages = [
  { imageUrl: Background, title: "Background" },
  { imageUrl: Slide1, title: "Slide 1" },
  { imageUrl: Wala, title: "Wala" },
  { imageUrl: Slide2, title: "Slide 2" }
];

// Auto slide function
let interval = null;

const startAutoSlide = () => {
  interval = setInterval(() => {
    if (slides.value.length > 0) {
      currentIndex.value = (currentIndex.value + 1) % slides.value.length;
    }
  }, 4000); // Auto-slide every 4 seconds
};

const fetchSlides = async () => {
  loading.value = true;
  error.value = false;
  
  try {
    const response = await fetch(`${apiUrl}/slide`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    
    // Use API data or fallback to default images
    slides.value = (data.data && data.data.length > 0) ? data.data : fallbackImages;
  } catch (err) {
    console.error("Error fetching slides:", err);
    error.value = true;
    slides.value = fallbackImages; // Use fallback images on error
  } finally {
    loading.value = false;
  }
};

const stopAutoSlide = () => {
  clearInterval(interval);
};

// Optional: Improved mobile interaction by adding touch support
const handleTouchStart = (event) => {
  touchStartX = event.touches[0].clientX;
};

const handleTouchEnd = (event) => {
  const touchEndX = event.changedTouches[0].clientX;
  const diff = touchStartX - touchEndX;
  
  // Detect swipe (with a threshold of 50px)
  if (Math.abs(diff) > 50) {
    if (diff > 0) {
      // Swipe left, go to next slide
      currentIndex.value = (currentIndex.value + 1) % slides.value.length;
    } else {
      // Swipe right, go to previous slide
      currentIndex.value = (currentIndex.value - 1 + slides.value.length) % slides.value.length;
    }
  }
};

let touchStartX = 0;

// Start auto-slide on mount and stop on unmount
onMounted(async () => {
  // Reset state for route changes
  currentIndex.value = 0;
  isInitialized.value = false;
  isReady.value = false;
  
  // Initialize with fallback images first for immediate display
  slides.value = fallbackImages;
  
  // Then fetch from API
  await fetchSlides();
  
  // Small delay before showing content to prevent flashing
  setTimeout(() => {
    isReady.value = true;
    
    // Then after a short delay, enable transitions
    setTimeout(() => {
      isInitialized.value = true;
    }, 100);
  }, 300);
  
  startAutoSlide();
  
  // Add touch event listeners
  const carouselElement = document.querySelector('.relative.w-full.h.full');
  if (carouselElement) {
    carouselElement.addEventListener('touchstart', handleTouchStart, { passive: true });
    carouselElement.addEventListener('touchend', handleTouchEnd, { passive: true });
  }
});

onUnmounted(() => {
  stopAutoSlide();
  
  // Remove touch event listeners
  const carouselElement = document.querySelector('.relative.w-full.h.full');
  if (carouselElement) {
    carouselElement.removeEventListener('touchstart', handleTouchStart);
    carouselElement.removeEventListener('touchend', handleTouchEnd);
  }
});
</script>

<style scoped>
@keyframes spin-slow {
  to {
    transform: rotate(-360deg);
  }
}

.animate-spin-slow {
  animation: spin-slow 3s linear infinite;
}
</style>