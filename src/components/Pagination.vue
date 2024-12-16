<template>
    <div class="p-2">
      <!-- Table or Items Display -->
      <!-- <div class="grid grid-col-4 gap-2 mb-4">
        <div v-for="item in paginatedItems" :key="item.id" class="p-2 bg-gray-100 rounded">
          {{ item.name }}
        </div>
      </div> -->
  
      <!-- Pagination Controls -->
      <div class="flex justify-center items-center space-x-2">
        <button
          class="px-4 py-2 text-sm font-medium bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          @click="changePage(currentPage - 1)"
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
          @click="changePage(page)"
        >
          {{ page }}
        </button>
  
        <button
          class="px-4 py-2 text-sm font-medium bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          @click="changePage(currentPage + 1)"
          :disabled="currentPage === totalPages"
        >
          Next
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from "vue";
  
  // Mock data (could be fetched from an API)
  const items = ref(
    Array.from({ length: 15 }, (_, i) => ({ id: i + 1, name: `Item ${i + 1}` }))
  );
  
  // Pagination State
  const currentPage = ref(1);
  const itemsPerPage = 5;
  
  // Total pages
  const totalPages = computed(() => Math.ceil(items.value.length / itemsPerPage));
  
  // Calculate the items for the current page
  const paginatedItems = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return items.value.slice(start, end);
  });
  
  // Change page
  const changePage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page;
    }
  };
  </script>
  
  <style scoped>
  /* Optional: Add custom styles if needed */
  </style>
  