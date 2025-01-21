<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  moreStyle: {
    type: String,
    default: "",
  },
  uploadedImageUrl: String
});

const emit = defineEmits(["update:uploadedImageUrl"]);
const localImageUrl = ref(props.uploadedImageUrl);

let widget = null;

// Initialize Cloudinary widget
if (typeof window.cloudinary !== 'undefined') {
  widget = window.cloudinary.createUploadWidget(
    { 
      cloudName: "dpq5cxfaa", 
      uploadPreset: "bontub" 
    },
    (error, result) => {
      if (!error && result && result.event === "success") {
        localImageUrl.value = result.info.secure_url;
        emit("update:uploadedImageUrl", localImageUrl.value);
      }
    }
  );
}

// Sync with parent prop changes
watch(() => props.uploadedImageUrl, (newVal) => {
  localImageUrl.value = newVal;
});

function openUploadWidget(event) {
  event.preventDefault();
  if (widget) {
    widget.open();
  }
}
</script>

<template>
  <div class="w-[200px] h-[100px] flex flex-col items-center justify-center">
    <div v-if="localImageUrl" class="relative group">
      <img 
        :src="localImageUrl" 
        alt="Uploaded Image"
        class="max-h-32 object-cover rounded-md"
      />
      <div class="absolute inset-0 bg-black bg-opacity-50 hidden group-hover:flex items-center justify-center">
        <button
          class="text-white text-sm px-2 py-1 rounded bg-blue-500 hover:bg-blue-600"
          @click="openUploadWidget"
        >
          Change Image
        </button>
      </div>
    </div>
    <button
      v-else
      class="px-3 py-2 my-3 bg-[#00c424] rounded-md text-white hover:bg-[#00a31d] transition-colors"
      @click="openUploadWidget"
    >
      Upload Image
    </button>
  </div>
</template>