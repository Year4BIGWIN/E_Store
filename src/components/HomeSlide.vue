<script setup>
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import Carousel from "./Carousel.vue";
import Buttom from "@/components/Buttom.vue";

const apiUrl = import.meta.env.VITE_APP_API_URL;
const router = useRouter();

// Search state
const searchQuery = ref('');
const searchResults = ref([]);
const isSearching = ref(false);
const showResults = ref(false);

// Track search input changes with debounce
let debounceTimeout = null;
watch(searchQuery, (newValue) => {
  clearTimeout(debounceTimeout);
  
  if (newValue.trim().length > 1) {
    isSearching.value = true;
    showResults.value = true;
    
    debounceTimeout = setTimeout(() => {
      performSearch(newValue);
    }, 300); // Wait 300ms after typing stops
  } else {
    showResults.value = false;
    searchResults.value = [];
  }
});

// Search function
const performSearch = async (keyword) => {
  if (!keyword || keyword.trim().length < 2) return;
  
  try {
    const data = await fetchSearch(keyword);
    searchResults.value = data.data?.slice(0, 3) || []; // Get top 3 results
  } catch (error) {
    console.error("Search failed:", error);
    searchResults.value = [];
  } finally {
    isSearching.value = false;
  }
};

const navigateToProduct = (productId) => {
  router.push(`/productdetail/${productId}`);
  searchQuery.value = '';
  showResults.value = false;
};

const handleSearchSubmit = (e) => {
  e.preventDefault();
  if (searchQuery.value.trim()) {
    router.push(`/search?q=${encodeURIComponent(searchQuery.value.trim())}`);
    showResults.value = false;
  }
};

// API call function
const fetchSearch = async (keyword) => {
  try {
    const response = await fetch(`${apiUrl}/product/search?keyword=${encodeURIComponent(keyword)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data;  
  } catch (error) {
    console.error("Error fetching search results:", error);
    throw error;
  }
}
</script>

<template>
  <div class="flex w-full h-[250px] md:h-[500px] justify-center items-center">
    <Carousel />
    <div
      class="absolute w-[90%] sm:w-[95%] md:w-[90%] lg:w-[1152px] flex sm:flex-row justify-between items-center top-[200px] md:top-[400px] rounded-xl bg-white p-3 sm:p-5 mx-auto"
    >
      <h1 class="text-sm sm:text-xl sm:font-semibold sm:mb-0">NEW ARRIVAL</h1>
      <form @submit="handleSearchSubmit" class="w-[250px] md:w-[400px] relative">
        <div class="relative">
          <div
            class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none"
          >
            <svg
              class="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            v-model="searchQuery"
            type="search"
            id="search"
            class="block w-full ps-10 text-sm py-2 focus:outline-none text-gray-900 border border-gray-300 rounded-full"
            placeholder="Search..."
            autocomplete="off"
          />
          <Buttom
            variant="default"
            size="default"
            class="absolute right-0 top-0 mt-1 mr-1 hidden sm:block"
            type="submit"
          >Search</Buttom>
          <Buttom
            variant="default"
            size="default"
            class="absolute right-0 top-0 mt-1 mr-1 sm:hidden px-3"
            type="submit"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
            </svg>
          </Buttom>
        </div>
        
        <!-- Search Results Dropdown -->
        <div v-if="showResults && searchResults.length > 0" 
             class="absolute mt-1 w-full bg-white rounded-md shadow-lg z-50 border border-gray-200">
          <ul class="py-1">
            <li v-for="result in searchResults" :key="result.id" 
                @click="navigateToProduct(result.id)"
                class="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center">
              <div class="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0 mr-3 bg-gray-200 rounded-md overflow-hidden">
                <img v-if="result.firstImageUrl" :src="result.firstImageUrl" 
                     alt="Product thumbnail" class="w-full h-full object-cover" />
                <div v-else class="w-full h-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 sm:h-6 sm:w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <div>
                <div class="font-medium text-xs sm:text-sm">{{ result.model }}</div>
                <div class="text-xs text-gray-500">${{ result.price }}</div>
              </div>
            </li>
          </ul>
          <div class="px-4 py-2 text-xs text-center border-t border-gray-100">
            <a href="#" @click.prevent="handleSearchSubmit" class="text-indigo-600 hover:text-indigo-800">
              View all results
            </a>
          </div>
        </div>
        
        <!-- Loading indicator -->
        <div v-else-if="isSearching" class="absolute mt-1 w-full bg-white rounded-md shadow-lg z-50 border border-gray-200 p-4 text-center">
          <svg class="animate-spin h-4 w-4 sm:h-5 sm:w-5 text-indigo-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p class="mt-2 text-xs sm:text-sm text-gray-500">Searching...</p>
        </div>
        
        <!-- No results found -->
        <div v-else-if="showResults && searchQuery.trim().length > 1 && !isSearching && searchResults.length === 0" 
             class="absolute mt-1 w-full bg-white rounded-md shadow-lg z-50 border border-gray-200 p-3 sm:p-4 text-center">
          <p class="text-xs sm:text-sm text-gray-500">No results found for "{{ searchQuery }}"</p>
        </div>
      </form>
    </div>
  </div>
</template>