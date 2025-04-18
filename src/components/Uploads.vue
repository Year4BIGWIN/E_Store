<script setup>
import { ref, watch, onMounted } from "vue";

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
</script>

<template>
  <div class="w-full flex flex-col items-center justify-center">
    <!-- Display images grid -->
    <div v-if="localImages && localImages.length > 0" class="grid grid-cols-2 md:grid-cols-3 gap-3 w-full mb-4">
      <div v-for="(imageUrl, index) in localImages" :key="`img-${index}-${imageUrl}`" class="relative group">
        <img 
          :src="imageUrl" 
          alt="Uploaded Image"
          class="w-full h-32 object-cover rounded-md"
        />
        <div class="absolute inset-0 bg-black bg-opacity-50 hidden group-hover:flex items-center justify-center gap-2">
          <button
            type="button"
            class="text-white text-xs px-2 py-1 rounded bg-red-500 hover:bg-red-600"
            @click.stop="removeImage(index)"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
    
    <!-- Upload button -->
    <button
      type="button"
      class="px-3 py-2 my-3 bg-[#00c424] rounded-md text-white hover:bg-[#00a31d] transition-colors"
      @click="openUploadWidget"
    >
      {{ localImages && localImages.length > 0 ? 'Add More Images' : 'Upload Images' }}
    </button>
  </div>
</template>