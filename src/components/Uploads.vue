<script setup>
import { ref, watch } from "vue";

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
const localImages = ref(props.uploadedImages || []);

let widget = null;

// Initialize Cloudinary widget
if (typeof window.cloudinary !== 'undefined') {
  widget = window.cloudinary.createUploadWidget(
    { 
      cloudName: "dpq5cxfaa", 
      uploadPreset: "bontub",
      multiple: true // Allow multiple file selection
    },
    (error, result) => {
      if (!error && result && result.event === "success") {
        // Add new image URL to the array
        const newImages = [...localImages.value, result.info.secure_url];
        localImages.value = newImages;
        emit("update:uploadedImages", newImages);
      }
    }
  );
}

// Sync with parent prop changes
watch(() => props.uploadedImages, (newVal) => {
  localImages.value = newVal || [];
}, { deep: true });

function openUploadWidget(event) {
  event.preventDefault();
  if (widget) {
    widget.open();
  }
}

function removeImage(index) {
  const newImages = [...localImages.value];
  newImages.splice(index, 1);
  localImages.value = newImages;
  emit("update:uploadedImages", newImages);
}
</script>

<template>
  <div class="w-full flex flex-col items-center justify-center">
    <!-- Display images grid -->
    <div v-if="localImages && localImages.length > 0" class="grid grid-cols-2 md:grid-cols-3 gap-3 w-full mb-4">
      <div v-for="(imageUrl, index) in localImages" :key="index" class="relative group">
        <img 
          :src="imageUrl" 
          alt="Uploaded Image"
          class="w-full h-32 object-cover rounded-md"
        />
        <div class="absolute inset-0 bg-black bg-opacity-50 hidden group-hover:flex items-center justify-center gap-2">
          <button
            class="text-white text-xs px-2 py-1 rounded bg-red-500 hover:bg-red-600"
            @click="removeImage(index)"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
    
    <!-- Upload button -->
    <button
      class="px-3 py-2 my-3 bg-[#00c424] rounded-md text-white hover:bg-[#00a31d] transition-colors"
      @click="openUploadWidget"
    >
      {{ localImages && localImages.length > 0 ? 'Add More Images' : 'Upload Images' }}
    </button>
  </div>
</template>