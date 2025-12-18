<template>
  <div
    class="w-full rounded-xl flex flex-col gap-6 mt-10 items-center justify-center px-4"
  >
    <!-- Skeleton Loader - Reserves exact space to prevent CLS -->
    <div v-if="isLoading" class="w-full max-w-6xl">
      <!-- Category filters skeleton -->
      <div class="flex flex-wrap gap-1 overflow-x-auto pb-2 mb-5">
        <div
          v-for="i in 6"
          :key="i"
          class="h-10 w-24 bg-gray-200 rounded-full animate-pulse"
        ></div>
      </div>

      <!-- Top product grid skeleton (8 cards) -->
      <div class="mt-5 mb-8">
        <div
          class="hidden sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          <div
            v-for="i in 8"
            :key="i"
            class="bg-gray-200 rounded-xl h-80 animate-pulse"
          ></div>
        </div>
        <div class="grid grid-cols-2 gap-3 sm:hidden">
          <div
            v-for="i in 8"
            :key="i"
            class="bg-gray-200 rounded-xl h-64 animate-pulse"
          ></div>
        </div>
      </div>

      <!-- Phones section skeleton -->
      <div class="bg-white shadow-sm rounded-xl sm:p-6 mb-8">
        <div class="h-8 w-32 bg-gray-200 rounded mb-4 animate-pulse"></div>
        <div
          class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
        >
          <div
            v-for="i in 6"
            :key="i"
            class="bg-gray-200 rounded-xl h-48 animate-pulse"
          ></div>
        </div>
      </div>

      <!-- Watches + Accessories row skeleton -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <!-- Watches skeleton -->
        <div class="bg-white shadow-sm rounded-xl sm:p-6">
          <div class="h-8 w-32 bg-gray-200 rounded mb-4 animate-pulse"></div>
          <div
            class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            <div
              v-for="i in 3"
              :key="i"
              class="bg-gray-200 rounded-xl h-48 animate-pulse"
            ></div>
          </div>
        </div>
        <!-- Accessories skeleton -->
        <div class="bg-white shadow-sm rounded-xl sm:p-6">
          <div class="h-8 w-32 bg-gray-200 rounded mb-4 animate-pulse"></div>
          <div
            class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-3 gap-4"
          >
            <div
              v-for="i in 3"
              :key="i"
              class="bg-gray-200 rounded-xl h-48 animate-pulse"
            ></div>
          </div>
        </div>
      </div>

      <!-- Tablets section skeleton -->
      <div class="bg-white shadow-sm rounded-xl sm:p-6 mb-8">
        <div class="h-8 w-32 bg-gray-200 rounded mb-4 animate-pulse"></div>
        <div
          class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
        >
          <div
            v-for="i in 6"
            :key="i"
            class="bg-gray-200 rounded-xl h-48 animate-pulse"
          ></div>
        </div>
      </div>
    </div>

    <!-- Actual Content -->
    <template v-else>
      <div class="w-full max-w-6xl flex flex-wrap justify-between">
        <div class="flex flex-wrap gap-1 overflow-x-auto pb-2 scrollbar-hide">
          <button
            @click="selectedCategory = 'all'"
            class="text-xs sm:text-sm px-3 sm:px-4 py-2 border rounded-full hover:bg-black hover:text-white flex items-center"
            :class="{ 'bg-black text-white': selectedCategory === 'all' }"
          >
            <span class="sm:inline hidden">All</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 sm:hidden"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
              />
            </svg>
          </button>
          <button
            @click="selectedCategory = 'mobile-phone'"
            class="text-xs sm:text-sm px-3 sm:px-4 py-2 border rounded-full hover:bg-black hover:text-white flex items-center"
            :class="{
              'bg-black text-white': selectedCategory === 'mobile-phone',
            }"
          >
            <span class="sm:inline hidden">Mobile Phone</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 sm:hidden"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M7 2a2 2 0 00-2 2v12a2 2 0 002 2h6a2 2 0 002-2V4a2 2 0 00-2-2H7zm3 14a1 1 0 100-2 1 1 0 000 2z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
          <button
            @click="selectedCategory = 'tablet'"
            class="text-xs sm:text-sm px-3 sm:px-4 py-2 border rounded-full hover:bg-black hover:text-white flex items-center"
            :class="{ 'bg-black text-white': selectedCategory === 'tablet' }"
          >
            <span class="sm:inline hidden">Tablet</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 sm:hidden"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm4 14a1 1 0 100-2 1 1 0 000 2z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
          <button
            @click="selectedCategory = 'smart-watch'"
            class="text-xs sm:text-sm px-3 sm:px-4 py-2 border rounded-full hover:bg-black hover:text-white flex items-center"
            :class="{
              'bg-black text-white': selectedCategory === 'smart-watch',
            }"
          >
            <span class="sm:inline hidden">Smart Watch</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 sm:hidden"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
          <button
            @click="selectedCategory = 'accessories'"
            class="text-xs sm:text-sm px-3 sm:px-4 py-2 border rounded-full hover:bg-black hover:text-white flex items-center"
            :class="{
              'bg-black text-white': selectedCategory === 'accessories',
            }"
          >
            <span class="sm:inline hidden">Accessories</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 sm:hidden"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z"
              />
            </svg>
          </button>
        </div>
        <div class="mt-2 sm:mt-0">
          <button
            @click="navigateTo('/products')"
            class="text-xs sm:text-sm px-3 sm:px-4 py-2 border rounded-full hover:bg-black hover:text-white flex items-center"
          >
            <span class="sm:inline hidden">See All Products</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 sm:hidden"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z"
              />
            </svg>
          </button>
        </div>
      </div>

      <div class="w-full max-w-6xl mt-5">
        <div
          class="w-full hidden sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          <ProductCard
            v-for="(product, index) in sortedProducts"
            :key="product.id"
            :product="product"
            :fetchpriority="index === 0 ? 'high' : 'auto'"
            :loading="index < 4 ? 'eager' : 'lazy'"
          />
        </div>

        <div class="grid grid-cols-2 gap-3 sm:hidden">
          <SmallProductCard
            v-for="(product, index) in sortedProducts"
            :key="product.id"
            :product="product"
            :fetchpriority="index === 0 ? 'high' : 'auto'"
            :loading="index < 2 ? 'eager' : 'lazy'"
          />
        </div>
      </div>

      <div class="max-w-7xl w-full mx-auto sm:px-6 pb-8">
        <!-- Phone Section -->
        <div
          class="bg-white shadow-sm rounded-xl sm:p-6 mb-8 transition-all hover:shadow-md"
        >
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl sm:text-2xl font-bold text-gray-800">
              <span class="border-b-2 border-blue-500 pb-1">Phones</span>
            </h2>
            <button
              @click="navigateTo('/products', { category: 'mobile-phone' })"
              class="flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              See all
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4 ml-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </div>
          <div
            class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
          >
            <SmallProductCard
              v-for="product in phoneProducts"
              :key="product.id"
              :product="product"
            />
          </div>
        </div>

        <!-- Watch and Accessories Row -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <!-- Smart Watch Section -->
          <div
            class="bg-white shadow-sm rounded-xl sm:p-6 transition-all hover:shadow-md"
          >
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-xl sm:text-2xl font-bold text-gray-800">
                <span class="border-b-2 border-purple-500 pb-1"
                  >Smart Watches</span
                >
              </h2>
              <button
                @click="navigateTo('/products', { category: 'smart-watch' })"
                class="flex items-center text-purple-600 hover:text-purple-700 font-medium transition-colors"
              >
                See all
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 ml-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
            </div>
            <div
              class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              <SmallProductCard
                v-for="product in watchProducts"
                :key="product.id"
                :product="product"
              />
            </div>
          </div>

          <!-- Accessories Section -->
          <div
            class="bg-white shadow-sm rounded-xl sm:p-6 transition-all hover:shadow-md"
          >
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-xl sm:text-2xl font-bold text-gray-800">
                <span class="border-b-2 border-green-500 pb-1"
                  >Accessories</span
                >
              </h2>
              <button
                @click="navigateTo('/products', { category: 'accessories' })"
                class="flex items-center text-green-700 hover:text-green-800 font-medium transition-colors"
              >
                See all
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 ml-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
            </div>
            <div
              class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-3 gap-4"
            >
              <SmallProductCard
                v-for="product in accessoriesProducts"
                :key="product.id"
                :product="product"
              />
            </div>
          </div>
        </div>

        <!-- Tablet Section -->
        <div
          class="bg-white shadow-sm rounded-xl sm:p-6 transition-all hover:shadow-md"
        >
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl sm:text-2xl font-bold text-gray-800">
              <span class="border-b-2 border-amber-500 pb-1">Tablets</span>
            </h2>
            <button
              @click="navigateTo('/products', { category: 'tablet' })"
              class="flex items-center text-amber-700 hover:text-amber-800 font-medium transition-colors"
            >
              See all
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4 ml-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </div>
          <div
            class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
          >
            <SmallProductCard
              v-for="product in tabletProducts"
              :key="product.id"
              :product="product"
            />
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import ProductCard from "@/components/ProductCard.vue";
import SmallProductCard from "./SmallProductCard.vue";
import { useProductStore } from "@/store/productStore";

const productStore = useProductStore();
const router = useRouter();
const isLoading = ref(true);
const selectedCategory = ref("all"); // Local state for selected category

// Map category slugs to category names
const categoryMap = {
  all: "All",
  "mobile-phone": "Phone",
  tablet: "Tablet",
  "smart-watch": "Watch",
  accessories: "Accessory",
};

// Navigation function for other links only
const navigateTo = (path, query = {}) => {
  router.push({ path, query });
};

// Get actual category name from selected category
const currentCategoryName = computed(() => {
  return categoryMap[selectedCategory.value] || "All";
});

onMounted(async () => {
  isLoading.value = true;
  await productStore.fetchProduct(0, 100);
  isLoading.value = false;
});

const sortedProducts = computed(() => {
  let filtered = productStore.products;

  if (currentCategoryName.value !== "All") {
    filtered = filtered.filter(
      (product) => product.productType.name === currentCategoryName.value
    );
  }

  return filtered
    .slice()
    .sort((a, b) => b.id - a.id)
    .slice(0, 8);
});

const phoneProducts = computed(() => {
  return productStore.products
    .filter((product) => product.productType.name === "Phone")
    .sort((a, b) => b.id - a.id)
    .slice(0, 6);
});

const watchProducts = computed(() => {
  return productStore.products
    .filter((product) => product.productType.name === "Watch")
    .sort((a, b) => b.id - a.id)
    .slice(0, 3);
});

const accessoriesProducts = computed(() => {
  return productStore.products
    .filter((product) => product.productType.name === "Accessory")
    .sort((a, b) => b.id - a.id)
    .slice(0, 3);
});

const tabletProducts = computed(() => {
  return productStore.products
    .filter((product) => product.productType.name === "Tablet")
    .sort((a, b) => b.id - a.id)
    .slice(0, 6);
});
</script>

<style>
/* For horizontal scrolling on small screens without scrollbar */
.scrollbar-hide {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
.scrollbar-hide::-webkit-scrollbar {
  display: none; /* Chrome, Safari and Opera */
}
</style>
