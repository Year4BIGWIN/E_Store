<template>
  <div class="w-full justify-center items-center flex flex-col gap-6 py-4 md:py-10 px-4 md:px-0">
    <!-- Breadcrumb Navigation -->
    <div class="w-full max-w-[1152px] flex gap-4 font-semibold text-lg">
      <router-link to="/">
        <span class="hover:text-blue-500">Home</span>
      </router-link>
      <router-link to="/products">
        &#x2022; &nbsp;&nbsp;<span class="hover:text-blue-500">Product</span>
      </router-link>
    </div>

    <!-- Product Categories Section -->
    <div class="w-full max-w-[1152px] flex flex-col gap-4">
      <h1 class="text-xl md:text-2xl">PRODUCT CATEGORIES</h1>
      
      <!-- Mobile Category Dropdown (shows on small screens) -->
      <div class="block md:hidden w-full mb-4">
        <select 
          class="w-full p-2 border rounded-md"
          @change="handleCategorySelect($event)"
        >
          <option value="">All Categories</option>
          <option 
            v-for="category in categories" 
            :key="category.title"
            :value="category.title.toLowerCase()"
            :selected="selectedProductType === category.title.toLowerCase()"
          >
            {{ category.title }}
          </option>
        </select>
      </div>

      <!-- Desktop Category Cards (hides on small screens) -->
      <div class="hidden md:flex w-full gap-6">
        <CategoryCard
          v-for="category in categories"
          :key="category.title"
          :title="category.title"
          :icon="category.icon"
          :svg="category.svg"
          :isSelected="selectedProductType === category.title.toLowerCase()"
          @select="handleCategoryClick"
        />
      </div>
    </div>

     <!-- Mobile Brand Dropdown (shows on small screens) -->
     <div  class="block lg:hidden w-full">
            <select 
              class="w-full p-2 border rounded-md"
              @change="handleBrandSelect($event)"
            >
              <option value="">All Brands</option>
              <option 
                v-for="item in brands" 
                :key="item.id"
                :value="item.name"
                :selected="selectedBrand === item.name"
              >
                {{ item.name }}
              </option>
            </select>
          </div>
    <!-- Main Content Section -->
    <div class="flex w-full ">
      <div class="w-full max-w-[1152px] flex flex-col md:flex-row gap-4">
        <!-- Brand Section -->
        <div class="hidden lg:block w-[270px] border p-4 md:p-6">
          <h1 class="text-xl md:text-2xl font-bold mb-4">BRAND</h1>
          
          <!-- Desktop Brand Grid (hides on small screens) -->
          <div class="w-full grid grid-cols-2 gap-2">
            <div
              v-for="item in brands"
              :key="item.id"
              @click="handleBrandClick(item.name)"
              class="w-[110px] rounded-md border-2 border-[#a9a9a9] hover:shadow-lg hover:cursor-pointer"
              :class="{
                'border-blue-500 shadow-lg': selectedBrand === item.name,
              }"
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
        <div class="flex-1 w-full border p-4 md:p-6">
          <div class="flex justify-between items-center mb-4">
            <h1 class="text-xl md:text-2xl font-bold">PRODUCT</h1>
            <button
              v-if="selectedProductType || selectedBrand"
              @click="resetFilters"
              class="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm"
            >
              Clear Filters
            </button>
          </div>

          <div
            v-if="productStore.loading"
            class="w-full flex justify-center items-center h-[400px]"
          >
            <Loader />
          </div>
          <div v-else-if="productsError" class="text-red-500">
            {{ productsError }}
          </div>
          <div v-else>
            <div>
              <Transition-group name="product-list" tag="div" class="gap-3 md:gap-4 w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 mt-2">
                <SmallProductCard
                  v-for="product in products"
                  :key="product.id"
                  :product="product"
                />
              </Transition-group>
            </div>
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
</template>

<script setup>
import BrandCard from "@/components/BrandCard.vue";
import CategoryCard from "@/components/CategoryCard.vue";
import { onMounted, ref, computed, watch } from "vue";
import { useProductStore } from "@/store/productStore";
import SmallProductCard from "@/components/SmallProductCard.vue";
import Pagination from "@/components/Pagination.vue";
import Loader from "@/components/Loader.vue";
import { useRoute } from "vue-router";

const route = useRoute();
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
const activeFilter = ref("all"); // 'all', 'type', 'brand', or 'both'

// Page change handler with server-side pagination
const changePage = async (page) => {
  // Validate page number
  if (page < 1) page = 1;
  if (totalPages.value > 0 && page > totalPages.value) page = totalPages.value;

  currentPage.value = page;
  const apiPage = page - 1; // Convert to 0-indexed for API

  console.log(
    `Changing to page ${page} (API page: ${apiPage}), filter: ${activeFilter.value}`
  );

  // Handle pagination based on active filter
  switch (activeFilter.value) {
    case "type":
      await filterByProductType(selectedProductType.value, apiPage);
      break;
    case "brand":
      await filterByBrand(selectedBrand.value, apiPage);
      break;
    case "both":
      await filterByTypeAndBrand(
        selectedProductType.value,
        selectedBrand.value,
        apiPage
      );
      break;
    default:
      await productStore.fetchProduct(apiPage, itemsPerPage.value);
  }
};

// Update totalPages when API response changes
watch(
  () => productStore.totalPages,
  (newValue) => {
    if (newValue) {
      totalPages.value = newValue;
    }
  }
);

watch(
  () => productStore.totalElements,
  (newValue) => {
    if (newValue) {
      totalItems.value = newValue;
    }
  }
);

// Categories data with SVG for Smart Watch
const categories = [
  {
    title: "Phone",
    icon: "fa-solid fa-mobile-screen-button fa-2x",
    svg: null,
  },
  {
    title: "Tablet",
    icon: "fa-solid fa-tablet-screen-button fa-2x",
    svg: null,
  },
  {
    title: "Watch",
    icon: null,
    svg: `<svg width="42px" height="42px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#3662e3"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12 9.5V12L14 13.5M7.93191 6.20428C8.54129 6 9.36367 6 10.8 6H13.2C14.6363 6 15.4587 6 16.0681 6.20429M7.93191 6.20428C7.82847 6.23896 7.73116 6.27953 7.63803 6.32698C7.07354 6.6146 6.6146 7.07354 6.32698 7.63803C6 8.27976 6 9.11984 6 10.8V13.2C6 14.8802 6 15.7202 6.32698 16.362C6.6146 16.9265 7.07354 17.3854 7.63803 17.673C7.73112 17.7205 7.82838 17.761 7.93178 17.7957M7.93191 6.20428L9.00003 3H15L16.0681 6.20429M16.0681 6.20429C16.1715 6.23897 16.2688 6.27953 16.362 6.32698C16.9265 6.6146 17.3854 7.07354 17.673 7.63803C18 8.27976 18 9.11984 18 10.8V13.2C18 14.8802 18 15.7202 17.673 16.362C17.3854 16.9265 16.9265 17.3854 16.362 17.673C16.2688 17.7205 16.1715 17.7611 16.068 17.7958M7.93178 17.7957C8.54116 18 9.36356 18 10.8 18H13.2C14.6362 18 15.4586 18 16.068 17.7958M7.93178 17.7957L8.9996 21H14.9996L16.068 17.7958" stroke="#3662e3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>`,
  },
  {
    title: "Accessory",
    icon: "fa-solid fa-headphones-simple fa-2x",
    svg: null,
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
  productStore.loading = true;
  try {
    const response = await fetch(
      `${apiUrl}/product/type/${typeName}?page=${page}&size=${itemsPerPage.value}`
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    productStore.products = data.data.content.map(mapProductData);
    updatePagination(data.data);
    activeFilter.value = "type";
  } catch (err) {
    console.error("Error filtering by product type:", err);
    productStore.error = err.message;
  } finally {
    productStore.loading = false;
  }
};

// Filter by product type and brand
const filterByTypeAndBrand = async (typeName, brandName, page = 0) => {
  productStore.loading = true;
  try {
    const response = await fetch(
      `${apiUrl}/brand/${typeName}/${brandName}?page=${page}&size=${itemsPerPage.value}`
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    productStore.products = data.data.content.map(mapProductData);
    updatePagination(data.data);
    activeFilter.value = "both";
  } catch (err) {
    console.error("Error filtering by type and brand:", err);
    productStore.error = err.message;
  } finally {
    productStore.loading = false;
  }
};

// Filter by brand only
const filterByBrand = async (brandName, page = 0) => {
  productStore.loading = true;
  try {
    const response = await fetch(
      `${apiUrl}/brand/product-by-brand/${brandName}?page=${page}&size=${itemsPerPage.value}`
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    productStore.products = data.data.content.map(mapProductData);
    updatePagination(data.data);
    activeFilter.value = "brand";
  } catch (err) {
    console.error("Error filtering by brand:", err);
    productStore.error = err.message;
  } finally {
    productStore.loading = false;
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
  const apiPageNumber =
    data.pageable?.pageNumber !== undefined ? data.pageable.pageNumber : 0;

  // Only handle empty page case if not already on first page
  if (
    data.content?.length === 0 &&
    data.totalElements > 0 &&
    apiPageNumber > 0
  ) {
    console.log(
      "Empty page detected with results available, resetting to page 1"
    );
    currentPage.value = 1;
    // Re-fetch based on current filter
    switch (activeFilter.value) {
      case "type":
        filterByProductType(selectedProductType.value, 0);
        break;
      case "brand":
        filterByBrand(selectedBrand.value, 0);
        break;
      case "both":
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
  ...item,
  quantity: 1 // Only add quantity if it's not already in the item
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
      activeFilter.value = "all";
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
      activeFilter.value = "all";
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
  activeFilter.value = "all";
};

// New handlers for select dropdowns
const handleCategorySelect = async (event) => {
  const value = event.target.value;
  if (value === "") {
    // No category selected (All Categories)
    selectedProductType.value = null;
    
    if (selectedBrand.value) {
      // If brand is still selected, filter by brand only
      await filterByBrand(selectedBrand.value, 0);
    } else {
      // Reset to all products
      await productStore.fetchProduct(0, itemsPerPage.value);
      activeFilter.value = "all";
    }
  } else {
    // Handle category selection
    await handleCategoryClick(value);
  }
};

const handleBrandSelect = async (event) => {
  const value = event.target.value;
  if (value === "") {
    // No brand selected (All Brands)
    selectedBrand.value = null;
    
    if (selectedProductType.value) {
      // If category is still selected, filter by category only
      await filterByProductType(selectedProductType.value, 0);
    } else {
      // Reset to all products
      await productStore.fetchProduct(0, itemsPerPage.value);
      activeFilter.value = "all";
    }
  } else {
    // Handle brand selection
    await handleBrandClick(value);
  }
};

onMounted(async () => {
  fetchBrands();
  
  // Check if we have a category query parameter
  const categoryParam = route.query.category;
  if (categoryParam) {
    // Map URL category parameter to product type name
    const categoryMapping = {
      'mobile-phone': 'phone',
      'smart-watch': 'watch',
      'tablet': 'tablet',
      'accessories': 'accessory'
    };
    
    // Get the mapped category name
    const productType = categoryMapping[categoryParam];
    if (productType) {
      // Set the selected product type and filter products
      selectedProductType.value = productType;
      await filterByProductType(productType, 0);
    } else {
      // If no mapping found, fetch all products
      await productStore.fetchProduct(currentPage.value - 1, itemsPerPage.value);
    }
  } else {
    // No category parameter, fetch all products
    await productStore.fetchProduct(currentPage.value - 1, itemsPerPage.value);
  }
});
</script>

<style scoped>
/* Product list animations */
.product-list-enter-active,
.product-list-leave-active {
  transition: all 0.4s ease;
}

.product-list-enter-from,
.product-list-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

/* Staggered list effect */
.product-list-enter-active {
  transition-delay: calc(0.1s * var(--i));
}
</style>
