<script setup lang="ts">
import { ref } from "vue";

declare global {
  interface Window {
    cloudinary: any;
  }
}

let uploadedImageUrl = ref("");

let widget = window.cloudinary.createUploadWidget(
  { cloud_name: "dpq5cxfaa", upload_preset: "bontub" },
  (error: any, result: any) => {
    if (!error && result && result.event === "success") {
      uploadedImageUrl.value = result.info.secure_url;
      emit("update:uploadedImageUrl", uploadedImageUrl.value);
    }
  }
);

function openUploadWidget() {
  widget.open();
}
const emit = defineEmits(["update:uploadedImageUrl"]);
defineProps({
  moreStyle: {
    type: String,
    default: "",
  },
});
</script>
<template>
  <div class="flex flex-col items-center justify-center">
    <img :class="`${moreStyle}`" :src="uploadedImageUrl" alt="Uploaded Image" />
    <button
      class="px-3 py-2 my-3 bg-[#00C2C4] rounded-md text-white"
      @click="openUploadWidget"
    >
      Upload
    </button>
  </div>
</template>