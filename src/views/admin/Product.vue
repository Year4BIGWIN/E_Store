<template>
  <div class="w-full flex flex-col gap-4 px-4 bg-gray-100">
    <div class="w-full bg-white rounded-xl flex flex-col gap-2 p-6 shadow-sm">
      <!-- Header -->
      <div class="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-800">Products</h1>
          <p class="text-gray-500 text-sm">Manage your inventory</p>
        </div>
        <div class="flex flex-wrap items-center gap-3">
          <!-- Search box -->
          <div class="relative w-full sm:w-auto">
            <input
              v-model="searchTerm"
              type="text" 
              placeholder="Search products..." 
              class="pl-10 pr-4 py-2 rounded-lg border border-gray-300 w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 absolute left-3 top-2.5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
            </svg>
          </div>
          
          <!-- Add product button -->
          <button
            @click="showDialog = true"
            class="px-5 py-2.5 rounded-lg bg-blue-600 text-white font-medium 
                   hover:bg-blue-700 transition-all duration-200 flex items-center gap-2 
                   shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
            </svg>
            Add Product
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="productStore.isLoading" class="w-full flex justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredProducts.length === 0" class="w-full py-8 flex flex-col items-center justify-center bg-gray-50 rounded-xl">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
        <h3 class="mt-4 text-lg font-medium text-gray-700">No products found</h3>
        <p class="text-gray-500">
          {{ searchTerm ? 'Try a different search term' : 'Add your first product to get started' }}
        </p>
      </div>

      <!-- Table View -->
      <div v-else class="w-full h-[600px]">
        <table class="w-full border-collapse">
          <thead>
            <tr class="bg-gray-50 border-b border-t">
              <th class="p-4 text-left font-medium text-gray-600 text-sm">Image</th>
              <th class="p-4 text-left font-medium text-gray-600 text-sm">Product Name</th>
              <th class="p-4 text-left font-medium text-gray-600 text-sm">Price</th>
              <th class="p-4 text-left font-medium text-gray-600 text-sm">Category</th>
              <th class="p-4 text-left font-medium text-gray-600 text-sm">Stock</th>
              <th class="p-4 text-right font-medium text-gray-600 text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            <ProductCartEdit
              v-for="product in filteredProducts"
              :key="product.id"
              :name="product.model"
              :quantity="product.stock"
              :image="product.firstImageUrl"
              :id="product.id"
              :productData="product"
              @deleted="handleProductDeleted"
              @updated="handleProductUpdated"
            />
          </tbody>
        </table>
      </div>
      
      <Pagination 
        v-if="filteredProducts.length > 0"
        :current-page="currentPage" 
        :total-pages="totalPages" 
        @page-change="handlePageChange" 
        class="mt-6"
      />
    </div>

    <!-- Dialog Component -->
    <DialogPhone v-model:showDialog="showDialog" @productsaved="handleProductSaved" />
  </div>
</template>

<script setup>
import ProductCartEdit from "@/components/ProductCartEdit.vue";
import Pagination from "@/components/Pagination.vue";
import DialogPhone from "@/components/DialogPhone.vue";
import { onMounted, ref, computed } from "vue";
import { useProductStore } from "@/store/productStore";

const productStore = useProductStore();
const products = computed(() => productStore.products);
const currentPage = computed(() => productStore.currentPage + 1); // API uses 0-based indexing, UI uses 1-based
const totalPages = computed(() => productStore.totalPages);

// Search
const searchTerm = ref('');

// Filter products based on search term
const filteredProducts = computed(() => {
  if (!searchTerm.value) return products.value;
  
  return products.value.filter(product => 
    product.model.toLowerCase().includes(searchTerm.value.toLowerCase())
  );
});

onMounted(() => {
  productStore.fetchProduct(0, 8); // Changed from 6 to 8 products per page
});

const handlePageChange = (page) => {
  // Convert from 1-based UI page to 0-based API page
  productStore.fetchProduct(page - 1);
  window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top for better UX
};

const showDialog = ref(false);

// Handle product events
const handleProductDeleted = () => {
  // Refresh the product list if needed
  productStore.fetchProduct(currentPage.value - 1);
};

const handleProductUpdated = () => {
  // Refresh the product list when a product is updated
  productStore.fetchProduct(currentPage.value - 1);
};

const handleProductSaved = () => {
  // Refresh the product list when a new product is added
  productStore.fetchProduct(currentPage.value - 1);
  showDialog.value = false;
};
</script>
