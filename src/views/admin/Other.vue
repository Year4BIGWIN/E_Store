<template>
  <div class="w-full min-h-screen bg-gray-50 p-6">
    <!-- Page header -->
    <div class="mb-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-800">Brand Management</h1>
        <button 
          @click="showDialog = true" 
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
          </svg>
          Add Brand
        </button>
      </div>
      
      <!-- Content card -->
      <div class="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
        <!-- Table header -->
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

        <!-- Loading State -->
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

        <!-- Brands list -->
        <div v-else class="divide-y divide-gray-200">
          <div v-if="brands.length === 0" class="py-12 text-center text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <p>No brands found. Add your first brand to get started.</p>
          </div>
          
          <div v-else v-for="brand in brands" :key="brand.id" class="px-2 py-1">
            <BrandItem :brand="brand" @refresh="GetBrands" />
          </div>
        </div>
      </div>
    </div>

    <!-- Brand dialog -->
    <DialogBrand 
      v-model:showDialog="showDialog" 
      @updatesuccess="GetBrands"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Buttom from "@/components/Buttom.vue";
import DialogBrand from "@/components/DialogBrand.vue";
import axios from "axios";
import BrandItem from "@/components/BrandItem.vue";

const apiUrl = import.meta.env.VITE_APP_API_URL;
const brands = ref([]);
const showDialog = ref(false);
const isLoading = ref(true); // Add loading state

async function GetBrands() {
  isLoading.value = true; // Set loading to true
  try {
    const response = await axios.get(`${apiUrl}/brand`);
    brands.value = response.data.data;
    console.log(brands.value);
  } catch (error) {
    console.error("Error fetching brands:", error);
  } finally {
    // Add small delay for smoother transition
    setTimeout(() => {
      isLoading.value = false;
    }, 300);
  }
}

onMounted(() => {
  GetBrands();
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