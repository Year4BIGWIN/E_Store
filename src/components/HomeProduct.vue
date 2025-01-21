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
            :class="{ 'bg-black text-white': selectedCategorySlug === 'mobile-phone' }"
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
            :class="{ 'bg-black text-white': selectedCategorySlug === 'smart-watch' }"
            >Smart Watch</router-link
          >
          <router-link
            :to="{ path: '/', query: { category: 'accessories' } }"
            class="text-sm px-4 py-2 border rounded-full hover:bg-black hover:text-white"
            :class="{ 'bg-black text-white': selectedCategorySlug === 'accessories' }"
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
  
      <!-- Rest of your template remains unchanged -->
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import ProductCard from '@/components/ProductCard.vue';
  import axios from 'axios';
  
  const apiUrl = import.meta.env.VITE_APP_API_URL;
  const products = ref([]);
  const route = useRoute();
  
  // Map URL slugs to category names
  const categoryMap = {
    'all': 'All',
    'mobile-phone': 'Phone',
    'tablet': 'Tablet',
    'smart-watch': 'Smart Watch',
    'accessories': 'Accessories'
  };
  
  // Get current category slug from URL
  const selectedCategorySlug = computed(() => {
    return route.query.category || 'all';
  });
  
  // Get actual category name from slug
  const selectedCategory = computed(() => {
    return categoryMap[selectedCategorySlug.value] || 'All';
  });
  
  onMounted(async () => {
    try {
      const response = await axios.get(`${apiUrl}/product`);
      products.value = response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      products.value = [];
    }
  });
  
  const sortedProducts = computed(() => {
    let filtered = products.value;
    
    if (selectedCategory.value !== 'All') {
      filtered = filtered.filter(product => 
        product.productType.name === selectedCategory.value
      );
    }
  
    return filtered
      .slice()
      .sort((a, b) => b.id - a.id)
      .slice(0, 6);
  });
  </script>