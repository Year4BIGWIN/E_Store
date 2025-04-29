<template>
  <div class="w-full min-h-screen bg-gray-50 p-6">
    <!-- Page header -->
    <div class="mb-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-800">Brand Management</h1>
        <div class="flex gap-4">
          <button
            @click="showDialog = true"
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
          <button
            @click="openCategoryDialog"
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
            Add Category
          </button>
        </div>
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
          <div v-else v-for="brand in brands" :key="brand.id" class="px-2 py-1">
            <BrandItem :brand="brand" @refresh="GetBrands" />
          </div>
        </div>
      </div>

      <!-- Content card for Categories -->
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
        <!-- Categories Loading and Display Section -->
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
          <div v-if="categories.length === 0" class="py-12 text-center text-gray-500">
            <p>No categories found. Add your first category to get started.</p>
          </div>
          <div v-else v-for="category in categories" :key="category.id" class="px-2 py-1">
            <CategoryItem :product_type="category" @refresh="GetBrands" />
          </div>
        </div>
      </div>
    </div>

    <!-- Brand dialog -->
    <DialogBrand
      v-model:showDialog="showDialog"
      @updatesuccess="GetBrands"
      @postsuccess="GetBrands"
    />
    <!-- Category dialog -->
    <DialogCategory
      :showDialog="showDialogCategory"
      :isEditMode="false"
      @updatesuccess="GetBrands"
      @postsuccess="GetBrands"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import BrandItem from "@/components/BrandItem.vue";
import DialogBrand from "@/components/DialogBrand.vue";
import DialogCategory from "@/components/DialogCategory.vue";
import CategoryItem from "@/components/CategoryItem.vue";

const apiUrl = import.meta.env.VITE_APP_API_URL;
const brands = ref([]);
const categories = ref([]);
const showDialog = ref(false);
const showDialogCategory = ref(false);
const isLoading = ref(true);

async function GetBrands() {
  isLoading.value = true;
  try {
    const response1 = await axios.get(`${apiUrl}/brand`);
    const response2 = await axios.get(`${apiUrl}/productType`);
    brands.value = response1.data.data;
    categories.value = response2.data.data;
    showDialogCategory.value = false;
  } catch (error) {
    console.error("Error fetching brands:", error);
  } finally {
    setTimeout(() => {
      isLoading.value = false;
    }, 300);
  }
}

function openCategoryDialog() {
  showDialogCategory.value = true;
}

onMounted(() => {
  GetBrands();
});
</script>
