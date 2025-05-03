<template>
  <div class="p-2">
    <!-- Pagination Controls -->
    <div class="flex justify-center items-center space-x-2">
      <button
        class="px-4 py-2 text-sm font-medium bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
        @click="$emit('page-change', currentPage - 1)"
        :disabled="currentPage === 1"
      >
        Previous
      </button>

      <!-- Page Numbers -->
      <button
        v-for="page in totalPages"
        :key="page"
        class="px-4 py-2 text-sm font-medium rounded"
        :class="{
          'bg-blue-500 text-white': currentPage === page,
          'bg-gray-200 hover:bg-gray-300': currentPage !== page,
        }"
        @click="$emit('page-change', page)"
      >
        {{ page }}
      </button>

      <button
        class="px-4 py-2 text-sm font-medium bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
        @click="$emit('page-change', currentPage + 1)"
        :disabled="currentPage === totalPages"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  currentPage: {
    type: Number,
    required: true
  },
  totalPages: {
    type: Number,
    required: true
  }
});

defineEmits(['page-change']);
</script>