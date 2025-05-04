<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Loader from "@/components/Loader.vue";
import SmallProductCard from "@/components/SmallProductCard.vue";

const route = useRoute();
const router = useRouter();
const apiUrl = import.meta.env.VITE_APP_API_URL;

// Search state
const searchQuery = ref('');
const allSearchResults = ref([]); // Store all results
const isLoading = ref(true);
const currentPage = ref(1);
const resultsPerPage = 8;

// API call function - get all results at once
const fetchSearchResults = async () => {
  if (!searchQuery.value) return;
  
  isLoading.value = true;
  
  try {
    const response = await fetch(
      `${apiUrl}/product/search?keyword=${encodeURIComponent(searchQuery.value)}`, 
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    
    const data = await response.json();
    allSearchResults.value = data.data || [];
  } catch (error) {
    console.error("Error fetching search results:", error);
    allSearchResults.value = [];
  } finally {
    isLoading.value = false;
  }
};

// Calculate paginated results based on currentPage
const searchResults = computed(() => {
  const startIndex = (currentPage.value - 1) * resultsPerPage;
  return allSearchResults.value.slice(startIndex, startIndex + resultsPerPage);
});

// Calculate total results
const totalResults = computed(() => allSearchResults.value.length);

// Calculate total pages
const totalPages = computed(() => {
  return Math.ceil(totalResults.value / resultsPerPage);
});

// Define all the functions before setting up watchers and mounted hooks
const goToPage = (page) => {
  currentPage.value = page;
  window.scrollTo(0, 0);
  
  // Update URL with new page number
  router.push({ 
    query: { 
      ...route.query,
      page: page 
    }
  });
};

// Generate pagination range
const paginationRange = computed(() => {
  const range = [];
  const displayPages = 5; // Show up to 5 page numbers
  
  let start = Math.max(1, currentPage.value - Math.floor(displayPages / 2));
  let end = Math.min(totalPages.value, start + displayPages - 1);
  
  // Adjust start if we're near the end
  if (end === totalPages.value) {
    start = Math.max(1, end - displayPages + 1);
  }
  
  for (let i = start; i <= end; i++) {
    range.push(i);
  }
  
  return range;
});

// Only AFTER defining the functions above, now we can use them in watchers and mounted hooks
onMounted(() => {
  if (route.query.q) {
    searchQuery.value = route.query.q;
    currentPage.value = Number(route.query.page) || 1;
    fetchSearchResults();
  }
});

// Watch for changes in URL query parameters
watch(
  () => route.query,
  (newQuery) => {
    if (newQuery.q) {
      const newSearchQuery = newQuery.q;
      const newPage = Number(newQuery.page) || 1;
      
      // If search term changed, fetch new results and reset page
      if (searchQuery.value !== newSearchQuery) {
        searchQuery.value = newSearchQuery;
        fetchSearchResults();
      }
      
      // Update page if it changed
      currentPage.value = newPage;
    }
  },
  { immediate: true, deep: true }
);
</script>

<template>
  <div class="max-w-[1152px] w-[100vw] mx-auto px-4 py-8">
    <!-- Search Results Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800">
        Search Results for "{{ searchQuery }}"
      </h1>
      <p class="text-gray-600 mt-1" v-if="!isLoading">
        {{ totalResults }} product{{ totalResults !== 1 ? 's' : '' }} found
      </p>
    </div>
    
    <!-- Loading State -->
    <div v-if="isLoading" class="flex flex-col items-center justify-center py-20">
      <Loader class="w-12 h-12" />
      <p class="mt-4 text-gray-600">Loading search results...</p>
    </div>
    
    <!-- No Results State -->
    <div v-else-if="searchResults.length === 0" class="py-20 text-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <h3 class="mt-4 text-lg font-medium text-gray-900">No results found</h3>
      <p class="mt-2 text-gray-500">We couldn't find any products matching "{{ searchQuery }}".</p>
      <p class="mt-4 text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
    </div>
    
    <!-- Results Grid using SmallProductCard components -->
    <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
      <SmallProductCard
        v-for="product in searchResults"
        :key="product.id"
        :product="product"
      />
    </div>
    
    <!-- Pagination -->
    <div v-if="!isLoading && totalPages > 1" class="mt-12 flex justify-center">
      <nav class="inline-flex rounded-md shadow">
        <!-- Previous Page Button -->
        <button 
          @click="goToPage(currentPage - 1)" 
          :disabled="currentPage === 1"
          :class="[
            'relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium',
            currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
          ]"
        >
          <span class="sr-only">Previous</span>
          <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
        </button>
        
        <!-- Page Numbers -->
        <template v-for="page in paginationRange" :key="page">
          <button 
            @click="goToPage(page)" 
            :class="[
              'relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium',
              page === currentPage 
                ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                : 'text-gray-500 hover:bg-gray-50'
            ]"
          >
            {{ page }}
          </button>
        </template>
        
        <!-- Next Page Button -->
        <button 
          @click="goToPage(currentPage + 1)" 
          :disabled="currentPage === totalPages"
          :class="[
            'relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium',
            currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
          ]"
        >
          <span class="sr-only">Next</span>
          <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
          </svg>
        </button>
      </nav>
    </div>
  </div>
</template>