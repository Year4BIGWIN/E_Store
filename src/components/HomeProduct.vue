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
    <div class="w-[1152px] grid grid-cols-3 gap-10 mt-5">
      <ProductCard
        v-for="product in sortedProducts"
        :key="product.id"
        :product="product"
      />
    </div>

    <div class="w-[1152px] shadow-lg rounded-xl p-1">
      <div class="w-full flex justify-between">
        <h1 class="text-2xl font-semibold">Phone</h1>
        <h1 class="hover:text-blue-700 cursor-pointer">see all</h1>
      </div>
      <div class="w-full grid grid-cols-6 gap-4 mt-2">
        <SmallProductCard
          v-for="product in phoneProducts"
          :key="product.id"
          :product="product"
        />
      </div>
    </div>

    <div class="w-[1152px]">
      <div class="w-full flex justify-between">
        <div class="w-[570px] shadow-lg rounded-xl p-1">
          <div class="w-full flex justify-between">
            <h1 class="text-2xl font-semibold">Smart Watch</h1>
            <h1 class="hover:text-blue-700 cursor-pointer">see all</h1>
          </div>
          <div class="w-full grid grid-cols-3 gap-4 mt-2">
            <SmallProductCard
              v-for="product in watchProducts"
              :key="product.id"
              :product="product"
            />
          </div>
        </div>

          <div class="w-[570px] shadow-lg rounded-xl p-1">
            <div class="w-full flex justify-between">
              <h1 class="text-2xl font-semibold">Accesories</h1>
              <h1 class="hover:text-blue-700 cursor-pointer">see all</h1>
            </div>
            <div class="w-full grid grid-cols-3 gap-4 mt-2">
              <SmallProductCard
                v-for="product in accessoriesProducts"
                :key="product.id"
                :product="product"
              />
            </div>
          </div>
        </div>

        <div class="w-[1152px] shadow-lg rounded-xl p-1 mt-10">
      <div class="w-full flex justify-between">
        <h1 class="text-2xl font-semibold">Tablet</h1>
        <h1 class="hover:text-blue-700 cursor-pointer">see all</h1>
      </div>
      <div class="w-full grid grid-cols-6 gap-4 mt-2">
        <SmallProductCard
          v-for="product in tabletProducts"
          :key="product.id"
          :product="product"
        />
      </div>
    </div>


    </div>

    <!-- Rest of your template remains unchanged -->
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
  "smart-watch": "SmartWatch",
  accessories: "Accessories",
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
  productStore.fetchProduct();
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
    .slice(0, 6);
});

const phoneProducts = computed(() => {
  return productStore.products
    .filter(product => product.productType.name === 'Phone')
    .sort((a, b) => b.id - a.id)
    .slice(0, 6);
});

const watchProducts = computed(() => {
  return products.value
    .filter(product => product.productType.name === 'SmartWatch')
    .sort((a, b) => b.id - a.id)
    .slice(0, 3);
});

const accessoriesProducts = computed(() => {
  return products.value
    .filter(product => product.productType.name === 'Accessories')
    .sort((a, b) => b.id - a.id)
    .slice(0, 3);
});

const tabletProducts = computed(() => {
  return products.value
    .filter(product => product.productType.name === 'Tablet')
    .sort((a, b) => b.id - a.id)
    .slice(0, 6);
});
</script>
