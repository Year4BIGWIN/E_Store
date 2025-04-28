<template>
    <div class="w-full h-full flex items-center justify-center">
        <div v-if="isLoading" class="animate-pulse flex flex-col items-center">
            <div class="w-60 h-60 bg-gray-200 rounded mb-4"></div>
            <div class="h-8 w-40 bg-gray-200 rounded"></div>
        </div>
        <Upload 
            v-else
            :uploadedImageUrl="uploadedImageUrl" 
            @update:uploadedImageUrl="uploadedImageUrl = $event" 
            @upload-start="isLoading = true"
            @upload-end="isLoading = false"
        />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Upload from '../../components/Upload.vue';

const uploadedImageUrl = ref('');
const isLoading = ref(true);

onMounted(() => {
    // Set initial loading to false after a brief delay
    setTimeout(() => {
        isLoading.value = false;
    }, 300);
});
</script>

<style scoped>
.animate-pulse {
  animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
}
</style>