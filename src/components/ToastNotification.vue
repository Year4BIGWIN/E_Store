<script setup>
import { defineProps } from 'vue';

defineProps({
  toast: {
    type: Object,
    required: true
  }
});
</script>

<template>
  <Teleport to="body">
    <transition name="toast">
      <div 
        v-if="toast.show" 
        class="fixed top-20 right-5 z-50 p-4 rounded-lg shadow-lg max-w-sm"
        :class="{
          'bg-green-100 text-green-800': toast.type === 'success',
          'bg-red-100 text-red-800': toast.type === 'error',
          'bg-yellow-100 text-yellow-800': toast.type === 'warning'
        }"
      >
        <div class="flex items-center">
          <div v-if="toast.type === 'success'" class="mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
          </div>
          <div v-else-if="toast.type === 'error'" class="mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <span>{{ toast.message }}</span>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>