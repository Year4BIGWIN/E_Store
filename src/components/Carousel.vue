<template>
  <div class="relative w-full h-full overflow-hidden">
    <!-- Loading state -->
    <div v-if="loading" class="w-full h-full flex items-center justify-center bg-gray-100">
      <div class="animate-spin rounded-full h-8 w-8 md:h-12 md:w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
    
    <!-- Error state -->
    <div v-else-if="error" class="w-full h-full flex items-center justify-center bg-gray-100">
      <div class="text-red-500 text-sm md:text-base">Failed to load slides</div>
    </div>
    
    <!-- Carousel Container -->
    <div
      v-else
      class="flex"
      :style="{
        transform: `translateX(-${currentIndex * 100}%)`,
        transition: 'transform 2s cubic-bezier(0.25, 1, 0.5, 1)',
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
          class="w-full h-[250px] sm:h-[350px] md:h-[450px] object-cover"
        />
      </div>
    </div>
    
    <!-- Navigation Dots (helps with mobile navigation) -->
    <div class="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
      <button 
        v-for="(_, index) in slides" 
        :key="index"
        @click="currentIndex = index"
        class="w-2 h-2 md:w-3 md:h-3 rounded-full transition-all"
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

const apiUrl = import.meta.env.VITE_APP_API_URL;

// State management
const slides = ref([]);
const loading = ref(true);
const error = ref(false);
const currentIndex = ref(0);

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
    
    // Assuming the API returns an array of slide objects with imageUrl property
    slides.value = data.data || [];
    
    // If no slides were returned, use fallback images
    if (slides.value.length === 0) {
      slides.value = fallbackImages;
    }
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
  await fetchSlides();
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