<script setup>
import { ref, watch, onMounted, computed } from "vue";

const props = defineProps({
  moreStyle: {
    type: String,
    default: "",
  },
  uploadedImages: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(["update:uploadedImages"]);
// Initialize as an empty array, not with a reference to props
const localImages = ref([]);
// Track the selected image index
const selectedImageIndex = ref(0);

// Compute the currently selected image URL
const selectedImageUrl = computed(() => {
  if (localImages.value.length > 0 && selectedImageIndex.value < localImages.value.length) {
    return localImages.value[selectedImageIndex.value];
  }
  return null;
});

// Reset selected index when images change
watch(() => localImages.value.length, (newLength) => {
  if (selectedImageIndex.value >= newLength && newLength > 0) {
    selectedImageIndex.value = newLength - 1;
  } else if (newLength === 0) {
    selectedImageIndex.value = 0;
  }
});

let widget = null;

// Set up cloudinary in onMounted to ensure browser environment
onMounted(() => {
  if (typeof window.cloudinary !== 'undefined') {
    widget = window.cloudinary.createUploadWidget(
      { 
        cloudName: "dpq5cxfaa", 
        uploadPreset: "bontub",
        multiple: true
      },
      (error, result) => {
        if (!error && result && result.event === "success") {
          const newImages = [...localImages.value, result.info.secure_url];
          localImages.value = newImages;
          emit("update:uploadedImages", newImages);
          
          // Select the newly added image if it's the first one
          if (localImages.value.length === 1) {
            selectedImageIndex.value = 0;
          }
        }
      }
    );
  }
  
  // Initial synchronization
  if (props.uploadedImages && props.uploadedImages.length) {
    localImages.value = [...props.uploadedImages];
    console.log("Initial images loaded:", localImages.value);
  }
});

// Enhanced watch with better logging and timing
watch(() => props.uploadedImages, (newVal, oldVal) => {
  console.log("Watch in Uploads triggered");
  console.log("Old uploadedImages:", oldVal);
  console.log("New uploadedImages:", newVal);
  
  // Force a delay to ensure parent component has updated
  setTimeout(() => {
    if (newVal && Array.isArray(newVal)) {
      localImages.value = [...newVal]; // Create new array to ensure reactivity
    } else if (newVal) {
      localImages.value = [newVal];
    } else {
      localImages.value = [];
    }
    console.log("localImages updated to:", localImages.value);
  }, 20);
}, { immediate: true, deep: true });

function openUploadWidget(event) {
  event.preventDefault();
  if (widget) {
    widget.open();
  }
}

function removeImage(index) {
  console.log("Removing image at index:", index);
  console.log("Before removal:", localImages.value);
  
  const newImages = [...localImages.value];
  newImages.splice(index, 1);
  
  // Update local state first
  localImages.value = newImages;
  
  // Then emit to parent with a small delay to ensure local state is updated
  setTimeout(() => {
    emit("update:uploadedImages", newImages);
    console.log("After removal - emitted:", newImages);
  }, 10);
}

function selectImage(index) {
  selectedImageIndex.value = index;
}
</script>

<template>
  <div class="w-full flex flex-col items-center justify-center">
    <!-- Main image display -->
    <div v-if="selectedImageUrl" class="w-full mb-4 relative group">
      <img 
        :src="selectedImageUrl" 
        alt="Selected Image"
        class="w-full h-64 md:h-80 object-contain bg-gray-100 rounded-lg shadow-sm"
      />
      <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          type="button"
          class="text-white text-xs px-3 py-1.5 rounded-full bg-red-500 hover:bg-red-600 shadow-sm flex items-center gap-1.5"
          @click.stop="removeImage(selectedImageIndex)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Remove
        </button>
      </div>
    </div>
    
    <!-- Empty state when no images -->
    <div v-if="!localImages || localImages.length === 0" class="w-full h-64 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center mb-4">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      <p class="text-gray-500">No images uploaded yet</p>
    </div>
    
    <!-- Thumbnails row -->
    <div v-if="localImages && localImages.length > 0" class="flex gap-2 w-full overflow-x-auto pb-2 mb-3">
      <div 
        v-for="(imageUrl, index) in localImages" 
        :key="`thumb-${index}-${imageUrl}`" 
        class="relative shrink-0 cursor-pointer transition-all duration-200"
        :class="[selectedImageIndex === index ? 'ring-2 ring-[#00c424]' : 'opacity-80 hover:opacity-100']"
        @click="selectImage(index)"
      >
        <img 
          :src="imageUrl" 
          alt="Thumbnail"
          class="w-16 h-16 md:w-20 md:h-20 object-cover rounded-md"
        />
      </div>
    </div>
    
    <!-- Upload button -->
    <button
      type="button"
      class="px-4 py-2 my-3 bg-[#00c424] rounded-md text-white hover:bg-[#00a31d] transition-colors flex items-center gap-2"
      @click="openUploadWidget"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
      </svg>
      {{ localImages && localImages.length > 0 ? 'Add More Images' : 'Upload Images' }}
    </button>
    
    <!-- Image count indicator -->
    <p v-if="localImages && localImages.length > 0" class="text-sm text-gray-500">
      {{ localImages.length }} {{ localImages.length === 1 ? 'image' : 'images' }} uploaded
    </p>
  </div>
</template>