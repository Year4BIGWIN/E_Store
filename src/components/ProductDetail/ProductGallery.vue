<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  images: {
    type: Array,
    default: () => []
  }
});

const currentImageIndex = ref(0);
const selectedImage = ref(null);

watch(() => props.images, (newImages) => {
  if (newImages && newImages.length > 0) {
    selectedImage.value = newImages[0];
    currentImageIndex.value = 0;
  }
}, { immediate: true });

const selectImage = (index) => {
  currentImageIndex.value = index;
  selectedImage.value = props.images[index];
};

const navigateImage = (direction) => {
  const imagesLength = props.images.length;
  if (direction === 'next') {
    currentImageIndex.value = (currentImageIndex.value + 1) % imagesLength;
  } else {
    currentImageIndex.value = currentImageIndex.value === 0 ? imagesLength - 1 : currentImageIndex.value - 1;
  }
  selectedImage.value = props.images[currentImageIndex.value];
};

const openLightbox = (imageUrl) => {
  if (!imageUrl) return;
  window.open(imageUrl, '_blank');
};
</script>

<template>
  <div class="w-full flex flex-col gap-4">
    <!-- Main image display -->
    <div class="w-full relative group overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 bg-white">
      <img 
        :src="selectedImage || (images && images[0])" 
        alt="Selected Image"
        class="md:w-[800px] w-[350px] h-[350px] md:h-[500px] object-cover object-center p-4 bg-gray-100"
        @error="(e) => (e.target.src = '/placeholder-image.jpg')"
      />
      
      <!-- Image magnification overlay -->
      <div @click="openLightbox(selectedImage)" class="absolute top-3 right-3 bg-white/80 p-2 rounded-full shadow cursor-pointer hover:bg-white transition-colors">
        <i class="fa-solid fa-expand"></i>
      </div>
      
      <!-- Navigation arrows -->
      <div v-if="images && images.length > 1" class="absolute inset-y-0 left-0 flex items-center">
        <button 
          class="bg-white/60 hover:bg-white text-gray-800 h-8 w-8 md:h-10 md:w-10 rounded-r-lg flex items-center justify-center shadow-sm -ml-2 transition-all group-hover:ml-2"
          @click="navigateImage('prev')"
        >
          <i class="fa-solid fa-chevron-left"></i>
        </button>
      </div>
      
      <div v-if="images && images.length > 1" class="absolute inset-y-0 right-0 flex items-center">
        <button 
          class="bg-white/60 hover:bg-white text-gray-800 h-8 w-8 md:h-10 md:w-10 rounded-l-lg flex items-center justify-center shadow-sm -mr-2 transition-all group-hover:mr-2"
          @click="navigateImage('next')"
        >
          <i class="fa-solid fa-chevron-right"></i>
        </button>
      </div>
      
      <!-- Image counter pill -->
      <div v-if="images && images.length > 1" class="absolute bottom-3 left-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
        {{ currentImageIndex + 1 }} / {{ images.length }}
      </div>
    </div>
    
    <!-- Empty state when no images -->
    <div v-if="!images || images.length === 0" class="w-full h-48 md:h-64 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center">
      <i class="fa-regular fa-image text-3xl md:text-4xl text-gray-400 mb-2"></i>
      <p class="text-gray-500">No images available</p>
    </div>
    
    <!-- Thumbnails row -->
    <div v-if="images && images.length > 0" class="flex gap-2 w-full overflow-x-auto pb-2">
      <div 
        v-for="(img, index) in images" 
        :key="`thumb-${index}`" 
        class="relative shrink-0 cursor-pointer transition-all duration-200"
        :class="[currentImageIndex === index ? 'ring-2 ring-blue-500' : 'opacity-80 hover:opacity-100']"
        @click="selectImage(index)"
      >
        <img 
          :src="img" 
          alt="Thumbnail"
          class="w-14 h-14 md:w-16 md:h-16 object-cover rounded-md bg-white"
        />
      </div>
    </div>
    
    <!-- Image count indicator -->
    <p v-if="images && images.length > 0" class="text-xs md:text-sm text-gray-500 text-center">
      {{ images.length }} {{ images.length === 1 ? 'image' : 'images' }} available
    </p>
  </div>
</template>