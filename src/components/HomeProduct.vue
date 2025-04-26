<template>
  <div
    class="w-screen rounded-xl flex flex-col mt-10 gap-6 items-center justify-center"
  >
    <div class="w-[1152px] flex justify-between">
      <div class="flex gap-1">
        <router-link
          :to="{ path: '/', query: { category: 'all' } }"
          class="text-sm px-4 py-2 border rounded-full hover:bg-black hover:text-white"
          :class="{ 'bg-black text-white': selectedCategorySlug === 'all' }"
          >All</router-link
        >
        <router-link
          :to="{ path: '/', query: { category: 'mobile-phone' } }"
          class="text-sm px-4 py-2 border rounded-full hover:bg-black hover:text-white"
          :class="{
            'bg-black text-white': selectedCategorySlug === 'mobile-phone',
          }"
          >Mobile Phone</router-link
        >
        <router-link
          :to="{ path: '/', query: { category: 'tablet' } }"
          class="text-sm px-4 py-2 border rounded-full hover:bg-black hover:text-white"
          :class="{ 'bg-black text-white': selectedCategorySlug === 'tablet' }"
          >Tablet</router-link
        >
        <router-link
          :to="{ path: '/', query: { category: 'smart-watch' } }"
          class="text-sm px-4 py-2 border rounded-full hover:bg-black hover:text-white"
          :class="{
            'bg-black text-white': selectedCategorySlug === 'smart-watch',
          }"
          >Smart Watch</router-link
        >
        <router-link
          :to="{ path: '/', query: { category: 'accessories' } }"
          class="text-sm px-4 py-2 border rounded-full hover:bg-black hover:text-white"
          :class="{
            'bg-black text-white': selectedCategorySlug === 'accessories',
          }"
          >Accesories</router-link
        >
      </div>
      <div>
        <router-link
          to="/products"
          class="text-sm px-4 py-2 border rounded-full hover:bg-black hover:text-white"
          >See All Product</router-link
        >
      </div>
    </div>
    <div class="w-[1152px] grid grid-cols-4 gap-10 mt-5">
      <ProductCard
        v-for="product in sortedProducts"
        :key="product.id"
        :product="product"
      />
    </div>

    <div class="max-w-7xl w-full mx-auto px-4 sm:px-6 pb-8">
      <!-- Phone Section -->
      <div class="bg-white shadow-sm rounded-xl p-6 mb-8 transition-all hover:shadow-md">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-2xl font-bold text-gray-800">
            <span class="border-b-2 border-blue-500 pb-1">Phones</span>
          </h2>
          <router-link to="/products?category=mobile-phone" class="flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors">
            See all
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
            </svg>
          </router-link>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
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
        <div class="bg-white shadow-sm rounded-xl p-6 transition-all hover:shadow-md">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-2xl font-bold text-gray-800">
              <span class="border-b-2 border-purple-500 pb-1">Smart Watches</span>
            </h2>
            <router-link to="/products?category=smart-watch" class="flex items-center text-purple-600 hover:text-purple-700 font-medium transition-colors">
              See all
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
              </svg>
            </router-link>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <SmallProductCard
              v-for="product in watchProducts"
              :key="product.id"
              :product="product"
            />
          </div>
        </div>

        <!-- Accessories Section -->
        <div class="bg-white shadow-sm rounded-xl p-6 transition-all hover:shadow-md">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-2xl font-bold text-gray-800">
              <span class="border-b-2 border-green-500 pb-1">Accessories</span>
            </h2>
            <router-link to="/products?category=accessories" class="flex items-center text-green-600 hover:text-green-700 font-medium transition-colors">
              See all
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
              </svg>
            </router-link>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-3 gap-4">
            <SmallProductCard
              v-for="product in accessoriesProducts"
              :key="product.id"
              :product="product"
            />
          </div>
        </div>
      </div>

      <!-- Tablet Section -->
      <div class="bg-white shadow-sm rounded-xl p-6 transition-all hover:shadow-md">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-2xl font-bold text-gray-800">
            <span class="border-b-2 border-amber-500 pb-1">Tablets</span>
          </h2>
          <router-link to="/products?category=tablet" class="flex items-center text-amber-600 hover:text-amber-700 font-medium transition-colors">
            See all
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
            </svg>
          </router-link>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <SmallProductCard
            v-for="product in tabletProducts"
            :key="product.id"
            :product="product"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import ProductCard from "@/components/ProductCard.vue";
import SmallProductCard from "./SmallProductCard.vue";
import { useProductStore } from "@/store/productStore";

const productStore = useProductStore();
const products = ref([]);
const route = useRoute();
// Map URL slugs to category names
const categoryMap = {
  all: "All",
  "mobile-phone": "Phone",
  tablet: "Tablet",
  "smart-watch": "Watch",
  accessories: "Accessory",
};

// Get current category slug from URL
const selectedCategorySlug = computed(() => {
  return route.query.category || "all";
});

// Get actual category name from slug
const selectedCategory = computed(() => {
  return categoryMap[selectedCategorySlug.value] || "All";
});

onMounted(() => {
  productStore.fetchProduct(0, 20);
});

const sortedProducts = computed(() => {
  let filtered = productStore.products;

  if (selectedCategory.value !== "All") {
    filtered = filtered.filter(
      (product) => product.productType.name === selectedCategory.value
    );
  }

  return filtered
    .slice()
    .sort((a, b) => b.id - a.id)
    .slice(0, 8);
});

const phoneProducts = computed(() => {
  return productStore.products
    .filter(product => product.productType.name === 'Phone')
    .sort((a, b) => b.id - a.id)
    .slice(0, 6);
});

const watchProducts = computed(() => {
  return productStore.products
    .filter(product => product.productType.name === 'Watch')
    .sort((a, b) => b.id - a.id)
    .slice(0, 3);
});

const accessoriesProducts = computed(() => {
  return productStore.products
    .filter(product => product.productType.name === 'Accessory')
    .sort((a, b) => b.id - a.id)
    .slice(0, 3);
});

const tabletProducts = computed(() => {
  return productStore.products
    .filter(product => product.productType.name === 'Tablet')
    .sort((a, b) => b.id - a.id)
    .slice(0, 6);
});
</script>
