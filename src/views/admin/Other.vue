<template>
  <div class="w-full min-h-screen bg-gray-50 p-6">
    <!-- Page header -->
    <div class="mb-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-800">Brand Management</h1>
          <button
            @click="openBrandDialog"
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clip-rule="evenodd"
              />
            </svg>
            Add Brand
          </button>
          
      </div>

      <!-- Content card for Brands -->
      <div class="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
        <div class="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div class="flex justify-between items-center">
            <div class="flex items-center text-center gap-12 text-sm font-medium text-gray-500 uppercase tracking-wider">
              <div class="w-32">Logo</div>
              <div>Name</div>
            </div>
            <div class="text-sm font-medium text-gray-500 uppercase tracking-wider pr-16">
              Actions
            </div>
          </div>
        </div>
        <!-- Brands Loading and Display Section -->
        <div v-if="isLoading" class="divide-y divide-gray-200">
          <div v-for="i in 5" :key="i" class="px-6 py-4 animate-pulse">
            <div class="flex justify-between items-center">
              <div class="flex items-center gap-12">
                <div class="w-24 h-12 bg-gray-200 rounded"></div>
                <div class="h-5 w-32 bg-gray-200 rounded"></div>
              </div>
              <div class="flex gap-2">
                <div class="w-16 h-8 bg-gray-200 rounded"></div>
                <div class="w-16 h-8 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>

        <div v-else>
          <div v-if="brands.length === 0" class="py-12 text-center text-gray-500">
            <p>No brands found. Add your first brand to get started.</p>
          </div>
          <div v-else>
            <!-- Use paginatedBrands instead of brands -->
            <div v-for="brand in paginatedBrands" :key="brand.id" class="px-2 py-1">
              <BrandItem :brand="brand" @refresh="fetchData" @edit="editBrand" />
            </div>
            
            <!-- Pagination UI -->
            <div v-if="totalBrandPages > 1" class="mt-4 mb-4 flex justify-center">
              <nav class="inline-flex rounded-md shadow">
                <!-- Previous Page Button -->
                <button 
                  @click="goToBrandPage(currentBrandPage - 1)" 
                  :disabled="currentBrandPage === 1"
                  :class="[
                    'relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium',
                    currentBrandPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                  ]"
                >
                  <span class="sr-only">Previous</span>
                  <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                </button>
                
                <!-- Page Numbers -->
                <template v-for="page in brandPaginationRange" :key="page">
                  <button 
                    @click="goToBrandPage(page)" 
                    :class="[
                      'relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium',
                      page === currentBrandPage 
                        ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                        : 'text-gray-500 hover:bg-gray-50'
                    ]"
                  >
                    {{ page }}
                  </button>
                </template>
                
                <!-- Next Page Button -->
                <button 
                  @click="goToBrandPage(currentBrandPage + 1)" 
                  :disabled="currentBrandPage === totalBrandPages"
                  :class="[
                    'relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium',
                    currentBrandPage === totalBrandPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
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
        </div>
      </div>

      <!-- Combined Categories and Slides section -->
      <div class="flex flex-col lg:flex-row gap-6 mt-6">
        <!-- Categories section -->
        <div class="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 w-full lg:w-1/2">
          <div class="bg-gray-50 px-6 py-4 flex justify-between border-b border-gray-200">
            <h2 class="text-lg font-semibold text-gray-800">Categories</h2>
            <button
            @click="openCategoryDialog"
            class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg transition-colors duration-200 flex items-center gap-1 text-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clip-rule="evenodd"
              />
            </svg>
            Add Category
          </button>
          </div>
          
          <!-- Categories Loading and Display Section -->
          <div v-if="isLoading" class="divide-y divide-gray-200">
            <div v-for="i in 5" :key="i" class="px-6 py-4 animate-pulse">
              <div class="flex justify-between items-center">
                <div class="flex items-center gap-12">
                  <div class="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div class="h-5 w-32 bg-gray-200 rounded"></div>
                </div>
                <div class="flex gap-2">
                  <div class="w-16 h-8 bg-gray-200 rounded"></div>
                  <div class="w-16 h-8 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="category-container">
            <div v-if="categories.length === 0" class="py-12 text-center text-gray-500">
              <p>No categories found. Add your first category to get started.</p>
            </div>
            <div v-else>
              <CategoryCard 
                v-for="category in categories" 
                :key="category.id" 
                :product_type="category" 
                @refresh="fetchData"
                @edit="editCategory" 
              />
            </div>
          </div>
        </div>

        <!-- Slides section -->
        <div class="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 w-full lg:w-1/2">
          <div class="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 class="text-lg font-semibold text-gray-800">Slides</h2>
            <button
              @click="openSlideDialog"
              class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg transition-colors duration-200 flex items-center gap-1 text-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
              </svg>
              Add Slide
            </button>
          </div>
          
          <!-- Slides Loading and Display Section -->
          <div v-if="isLoading" class="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div v-for="i in 4" :key="i" class="animate-pulse">
              <div class="w-full rounded overflow-hidden">
                <div class="h-40 bg-gray-200"></div>
                <div class="pt-3">
                  <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div class="flex gap-2">
                    <div class="w-16 h-8 bg-gray-200 rounded"></div>
                    <div class="w-16 h-8 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="p-4">
            <div v-if="slides.length === 0" class="py-12 text-center text-gray-500">
              <p>No slides found. Add your first slide to get started.</p>
            </div>
            <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <SlideCard 
                v-for="slide in slides" 
                :key="slide.id" 
                :id="slide.id"
                :imageUrl="slide.imageUrl"
                :title="slide.title" 
                @edit="editSlide" 
                @refresh="fetchData"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Brand dialog -->
    <Teleport to="body">
      <DialogBrand
        v-model:showDialog="showDialog"
        :isEditMode="isBrandEditMode"
        :currentBrand="currentBrand"
        @update:showDialog="handleBrandDialogClose"
        @updatesuccess="fetchData"
        @postsuccess="fetchData"
      />
    </Teleport>
    
    <!-- Category dialog -->
    <Teleport to="body">
      <DialogCategory
        v-model:showDialog="showDialogCategory"
        :isEditMode="isEditMode"
        :currentCategory="currentCategory"
        @update:showDialog="handleCategoryDialogClose"
        @updatesuccess="fetchData"
        @postsuccess="fetchData"
      />
    </Teleport>
    
    <!-- Slide dialog -->
    <Teleport to="body">
      <DialogSlide
        v-model:showDialog="showDialogSlide"
        :isEditMode="isSlideEditMode"
        :currentSlide="currentSlide"
        @update:showDialog="handleSlideDialogClose"
        @updatesuccess="fetchData"
        @postsuccess="fetchData"
      />
    </Teleport>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import BrandItem from "@/components/BrandItem.vue";
import DialogBrand from "@/components/Other/DialogBrand.vue";
import DialogCategory from "@/components/Other/DialogCategory.vue";
import CategoryCard from "@/components/Other/CategoryCard.vue";
import SlideCard from "@/components/Other/SlideCard.vue";
import DialogSlide from "@/components/Other/DialogSlide.vue";

const apiUrl = import.meta.env.VITE_APP_API_URL;
const brands = ref([]);
const categories = ref([]);
const slides = ref([]);
const showDialog = ref(false);
const showDialogCategory = ref(false);
const showDialogSlide = ref(false);
const isLoading = ref(true);
const currentCategory = ref({});
const currentSlide = ref({});
const isEditMode = ref(false);
const isSlideEditMode = ref(false);

// Pagination variables for brands
const currentBrandPage = ref(1);
const brandsPerPage = ref(5);

// Computed property to get paginated brands
const paginatedBrands = computed(() => {
  const startIndex = (currentBrandPage.value - 1) * brandsPerPage.value;
  return brands.value.slice(startIndex, startIndex + brandsPerPage.value);
});

// Calculate total pages for brands
const totalBrandPages = computed(() => {
  return Math.ceil(brands.value.length / brandsPerPage.value);
});

// Generate pagination range
const brandPaginationRange = computed(() => {
  const range = [];
  const displayPages = 5; // Show up to 5 page numbers
  
  let start = Math.max(1, currentBrandPage.value - Math.floor(displayPages / 2));
  let end = Math.min(totalBrandPages.value, start + displayPages - 1);
  
  // Adjust start if we're near the end
  if (end === totalBrandPages.value) {
    start = Math.max(1, end - displayPages + 1);
  }
  
  for (let i = start; i <= end; i++) {
    range.push(i);
  }
  
  return range;
});

// Function to navigate to specific page
const goToBrandPage = (page) => {
  currentBrandPage.value = page;
  window.scrollTo(0, 0);
};

async function fetchData() {
  isLoading.value = true;
  try {
    const [brandsResponse, categoriesResponse, slidesResponse] = await Promise.all([
      axios.get(`${apiUrl}/brand`),
      axios.get(`${apiUrl}/productType`),
      axios.get(`${apiUrl}/slide`)
    ]);
    
    brands.value = brandsResponse.data.data;
    categories.value = categoriesResponse.data.data;
    slides.value = slidesResponse.data.data;
    
    showDialogCategory.value = false;
    showDialogSlide.value = false;
  } catch (error) {
    console.error("Error fetching data:", error);
  } finally {
    setTimeout(() => {
      isLoading.value = false;
    }, 300);
  }
}

function openCategoryDialog() {
  isEditMode.value = false;  // Reset edit mode to ensure we're adding, not editing
  currentCategory.value = {}; // Clear any previous category data
  showDialogCategory.value = true;
}

function editCategory(category) {
  currentCategory.value = category;
  isEditMode.value = true;
  showDialogCategory.value = true;
}

function handleCategoryDialogClose(value) {
  showDialogCategory.value = value;
  if (!value) {
    // Reset edit mode when dialog closes
    isEditMode.value = false;
    currentCategory.value = {};
  }
}

function openSlideDialog() {
  showDialogSlide.value = true;
}

function editSlide(slideId) {
  const slideToEdit = slides.value.find(s => s.id === slideId);
  if (slideToEdit) {
    currentSlide.value = slideToEdit;
    isSlideEditMode.value = true;
    showDialogSlide.value = true;
  }
}

function handleSlideDialogClose(value) {
  showDialogSlide.value = value;
  if (!value) {
    isSlideEditMode.value = false;
    currentSlide.value = {};
  }
}

const isBrandEditMode = ref(false);
const currentBrand = ref({});

function openBrandDialog() {
  isBrandEditMode.value = false; 
  currentBrand.value = {};
  showDialog.value = true;
}

function editBrand(brand) {
  currentBrand.value = brand;
  isBrandEditMode.value = true;
  showDialog.value = true;
}

function handleBrandDialogClose(value) {
  showDialog.value = value;
  if (!value) {
    isBrandEditMode.value = false;
    currentBrand.value = {};
  }
}

onMounted(() => {
  fetchData();
});
</script>
