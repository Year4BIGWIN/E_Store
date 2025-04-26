<template>
  <div class="w-screen justify-center items-center flex flex-col gap-10 py-10">
    <div class="w-[1152px] flex gap-4 font-semibold text-lg">
      <router-link to="/"
        ><span class="hover:text-blue-500">Home</span></router-link
      >
      <router-link to="/products"
        >&#x2022; &nbsp;&nbsp;<span class="hover:text-blue-500"
          >Product</span
        ></router-link
      >
    </div>

    <div class="w-[1152px] flex flex-col gap-4">
      <h1 class="text-2xl">PRODUCT CATEGORIES</h1>

      <div class="w-full flex gap-6">
        <CategoryCard
          v-for="category in categories"
          :key="category.id"
          :title="category.title"
          :icon="category.icon"
          :isSelected="selectedProductType === category.title.toLowerCase()"
          @select="handleCategoryClick"
        />
      </div>
    </div>

    <div class="flex">
      <div class="w-[1152px] flex gap-4">
        <!-- Brand Section -->
        <div class="w-[270px] border p-6">
          <h1 class="text-2xl font-bold mb-4">BRAND</h1>
          <div
            v-if="brandsLoading"
            class="flex justify-center items-center h-40"
          >
            <p>Loading brands...</p>
          </div>
          <div v-else-if="brandsError" class="text-red-500">
            {{ brandsError }}
          </div>
          <div v-else class="w-full grid grid-cols-2 gap-2">
            <div
              v-for="item in brands"
              :key="item.id"
              @click="handleBrandClick(item.name)"
              class="w-[110px] rounded-md border-2 border-[#a9a9a9] hover:shadow-lg hover:cursor-pointer"
              :class="{'border-blue-500 shadow-lg': selectedBrand === item.name}"
            >
              <img
                :src="item.image_url"
                alt="Brand"
                class="w-full h-10 rounded-[5px] object-cover"
              />
            </div>
          </div>
        </div>

        <!-- Product Section -->
        <div class="flex-1 border p-6">
          <div class="flex justify-between items-center mb-4">
            <h1 class="text-2xl font-bold">PRODUCT</h1>
            <button 
              v-if="selectedProductType || selectedBrand" 
              @click="resetFilters" 
              class="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm"
            >
              Clear Filters
            </button>
          </div>
          
          <div v-if="productsLoading" class="flex justify-center items-center h-40">
            <p>Loading products...</p>
          </div>
          <div v-else-if="productsError" class="text-red-500">
            {{ productsError }}
          </div>
          <div v-else>
            <div class="gap-4 w-full grid grid-cols-4 mt-2">
              <SmallProductCard
                v-for="product in products"
                :key="product.id"
                :product="product"
              />
            </div>
            
            <!-- Pagination -->
            <div class="mt-6">
              <Pagination 
                :currentPage="currentPage" 
                :totalPages="totalPages" 
                @page-change="changePage" 
              />
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import BrandCard from "@/components/BrandCard.vue";
import CategoryCard from "@/components/CategoryCard.vue";
import { onMounted, ref, computed, watch } from "vue";
import { useProductStore } from "@/store/productStore";
import SmallProductCard from "@/components/SmallProductCard.vue";
import Pagination from "@/components/Pagination.vue";

const productStore = useProductStore();
const apiUrl = import.meta.env.VITE_APP_API_URL;
const brands = ref([]);
const products = computed(() => productStore.products);

// Loading and error states
const brandsLoading = ref(false);
const productsLoading = computed(() => productStore.loading);
const brandsError = ref(null);
const productsError = computed(() => productStore.error);

// Pagination state
const currentPage = ref(1); // Page is 1-indexed in UI but 0-indexed in API
const itemsPerPage = ref(8);
const totalPages = ref(1);
const totalItems = ref(0);

// Add these below your existing ref declarations
const selectedProductType = ref(null);
const selectedBrand = ref(null);
const activeFilter = ref('all'); // 'all', 'type', 'brand', or 'both'

// Page change handler with server-side pagination
const changePage = async (page) => {
  // Validate page number
  if (page < 1) page = 1;
  if (totalPages.value > 0 && page > totalPages.value) page = totalPages.value;
  
  currentPage.value = page;
  const apiPage = page - 1; // Convert to 0-indexed for API
  
  console.log(`Changing to page ${page} (API page: ${apiPage}), filter: ${activeFilter.value}`);
  
  // Handle pagination based on active filter
  switch (activeFilter.value) {
    case 'type':
      await filterByProductType(selectedProductType.value, apiPage);
      break;
    case 'brand':
      await filterByBrand(selectedBrand.value, apiPage);
      break;
    case 'both':
      await filterByTypeAndBrand(selectedProductType.value, selectedBrand.value, apiPage);
      break;
    default:
      await productStore.fetchProduct(apiPage, itemsPerPage.value);
  }
};

// Update totalPages when API response changes
watch(() => productStore.totalPages, (newValue) => {
  if (newValue) {
    totalPages.value = newValue;
  }
});

watch(() => productStore.totalElements, (newValue) => {
  if (newValue) {
    totalItems.value = newValue;
  }
});

// Categories data...
const categories = [
  {
    title: "Phone",
    icon: "fa-solid fa-mobile-screen-button fa-2x",
  },
  {
    title: "Tablet",
    icon: "fa-solid fa-tablet-screen-button fa-2x",
  },
  {
    title: "Smart Watch",
    icon: "fa-solid fa-watch fa-2x",
  },
  {
    title: "Accessories",
    icon: "fa-solid fa-headphones-simple fa-2x",
  },
];

// Fetch brands function...
const fetchBrands = async () => {
  brandsLoading.value = true;
  brandsError.value = null;

  if (!apiUrl) {
    brandsError.value = "API URL is not configured";
    brandsLoading.value = false;
    return;
  }

  try {
    const response = await fetch(`${apiUrl}/brand`);

    if (!response.ok) {
      throw new Error(
        `Brands API error: ${response.status} - ${response.statusText}`
      );
    }

    const data = await response.json();
    brands.value = data.data || data;
    console.log("Brands response:", data);
  } catch (err) {
    brandsError.value = `Error loading brands: ${err.message}`;
    console.error("Brands fetch error:", err);
  } finally {
    brandsLoading.value = false;
  }
};

// Add these methods to handle the different API calls

// Filter by product type only
const filterByProductType = async (typeName, page = 0) => {
  productsLoading.value = true;
  try {
    console.log(`Fetching products by type: ${typeName}, page: ${page}, items per page: ${itemsPerPage.value}`);
    const response = await fetch(`${apiUrl}/product/type/${typeName}?page=${page}&size=${itemsPerPage.value}`);
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`Got ${data.data.content.length} products, total: ${data.data.totalElements}, pages: ${data.data.totalPages}`);
    productStore.products = data.data.content.map(mapProductData);
    updatePagination(data.data);
    activeFilter.value = 'type';
  } catch (err) {
    console.error("Error filtering by product type:", err);
    productStore.error = err.message;
  } finally {
    productsLoading.value = false;
  }
};

// Filter by product type and brand
const filterByTypeAndBrand = async (typeName, brandName, page = 0) => {
  productsLoading.value = true;
  try {
    const response = await fetch(`${apiUrl}/brand/${typeName}/${brandName}?page=${page}&size=${itemsPerPage.value}`);
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
    
    const data = await response.json();
    productStore.products = data.data.content.map(mapProductData);
    updatePagination(data.data);
    activeFilter.value = 'both';
  } catch (err) {
    console.error("Error filtering by type and brand:", err);
    productStore.error = err.message;
  } finally {
    productsLoading.value = false;
  }
};

// Filter by brand only
const filterByBrand = async (brandName, page = 0) => {
  productsLoading.value = true;
  try {
    const response = await fetch(`${apiUrl}/brand/product-by-brand/${brandName}?page=${page}&size=${itemsPerPage.value}`);
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
    
    const data = await response.json();
    productStore.products = data.data.content.map(mapProductData);
    updatePagination(data.data);
    activeFilter.value = 'brand';
  } catch (err) {
    console.error("Error filtering by brand:", err);
    productStore.error = err.message;
  } finally {
    productsLoading.value = false;
  }
};

// Helper function to update pagination state
const updatePagination = (data) => {
  // Set totalPages, ensuring minimum 1 page if we have any results
  totalPages.value = data.totalElements > 0 ? Math.max(1, data.totalPages) : 0;
  totalItems.value = data.totalElements;
  productStore.totalPages = totalPages.value;
  productStore.totalElements = data.totalElements;
  
  // Update current page value based on API response
  // Add +1 because UI is 1-indexed while API is 0-indexed
  const apiPageNumber = data.pageable?.pageNumber !== undefined ? data.pageable.pageNumber : 0;
  
  // Only handle empty page case if not already on first page
  if (data.content?.length === 0 && data.totalElements > 0 && apiPageNumber > 0) {
    console.log("Empty page detected with results available, resetting to page 1");
    currentPage.value = 1;
    // Re-fetch based on current filter
    switch (activeFilter.value) {
      case 'type':
        filterByProductType(selectedProductType.value, 0);
        break;
      case 'brand':
        filterByBrand(selectedBrand.value, 0);
        break;
      case 'both':
        filterByTypeAndBrand(selectedProductType.value, selectedBrand.value, 0);
        break;
      default:
        productStore.fetchProduct(0, itemsPerPage.value);
    }
  } else {
    // Normal case - update current page
    currentPage.value = apiPageNumber + 1;
  }
};

// Helper function to map product data
const mapProductData = (item) => ({
  id: item.id,
  model: item.model,
  description: item.description,
  stock_price: item.stock_price,
  price: item.price,
  stock: item.stock,
  releaseDate: item.releaseDate,
  brand: item.brand,
  productType: item.productType,
  brandId: item.brandId,
  productTypeId: item.productTypeId,
  display: item.display,
  performance: item.performance,
  camera: item.camera,
  battery: item.battery,
  connectivity: item.connectivity,
  buildAndDesign: item.buildAndDesign,
  otherFeatures: item.otherFeatures,
  softwareFeatures: item.softwareFeatures,
  imageUrls: item.imageUrls,
  firstImageUrl: item.firstImageUrl,
  additionalInfo: item.additionalInfo,
  quantity: 1,
});

// Add these handler methods in your script section
const handleBrandClick = async (brandName) => {
  // Toggle brand selection
  if (selectedBrand.value === brandName) {
    selectedBrand.value = null;
    
    // If product type is still selected, only filter by type
    if (selectedProductType.value) {
      currentPage.value = 1; // Reset page first
      await filterByProductType(selectedProductType.value, 0);
    } else {
      // Reset to all products
      currentPage.value = 1; // Reset page first
      await productStore.fetchProduct(0, itemsPerPage.value);
      activeFilter.value = 'all';
    }
  } else {
    selectedBrand.value = brandName;
    currentPage.value = 1; // Reset page first
    
    // If product type is selected, filter by both
    if (selectedProductType.value) {
      await filterByTypeAndBrand(selectedProductType.value, brandName, 0);
    } else {
      // Filter just by brand
      await filterByBrand(brandName, 0);
    }
  }
};

const handleCategoryClick = async (typeName) => {
  // Reset to page 1 whenever filters change
  currentPage.value = 1;
  
  // Toggle category selection
  if (selectedProductType.value === typeName) {
    selectedProductType.value = null;
    
    // If brand is still selected, only filter by brand
    if (selectedBrand.value) {
      await filterByBrand(selectedBrand.value, 0);
    } else {
      // Reset to all products
      await productStore.fetchProduct(0, itemsPerPage.value);
      activeFilter.value = 'all';
    }
  } else {
    selectedProductType.value = typeName;
    
    // If brand is selected, filter by both
    if (selectedBrand.value) {
      await filterByTypeAndBrand(typeName, selectedBrand.value, 0);
    } else {
      // Filter just by product type
      await filterByProductType(typeName, 0);
    }
  }
};

const resetFilters = async () => {
  selectedBrand.value = null;
  selectedProductType.value = null;
  currentPage.value = 1;
  await productStore.fetchProduct(0, itemsPerPage.value);
  activeFilter.value = 'all';
};

onMounted(async () => {
  fetchBrands();
  // Initial product fetch with pagination
  await productStore.fetchProduct(currentPage.value - 1, itemsPerPage.value);
});
</script>
