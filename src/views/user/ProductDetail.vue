<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';


const route = useRoute();
const product = ref(null);
const error = ref(null);

// Replace with your actual API call
const fetchProduct = async (id) => {
  try {
    // Example API call:
    const response = await fetch(`https://api.example.com/products/${id}`);
    if (!response.ok) throw new Error('Product not found');
    product.value = await response.json();
  } catch (err) {
    error.value = err.message;
  }
};

onMounted(() => {
  if (route.params.id) fetchProduct(route.params.id);
});
</script>

<template>
  <div class="w-[1152px] justify-start flex flex-col gap-10 py-10">
    <!-- Breadcrumbs -->
    <div class="w-full flex gap-4 font-semibold text-lg">
      <router-link to="/"><span class="hover:text-blue-500">Home</span></router-link>
      <router-link to="/products">&#x2022; <span class="hover:text-blue-500">Product</span></router-link>
    </div>

    <!-- Product Details -->
    <div v-if="product" class="w-full flex gap-4">
      <!-- Product Image -->
      <div class="w-1/2 flex flex-col gap-4">
        <div class="w-full h-[500px] bg-[#d9d9d9] rounded-xl">
          <img 
            :src="product.image_url" 
            class="w-full h-full object-cover rounded-xl" 
            :alt="product.model"
          >
        </div>
      </div>

      <!-- Product Info -->
      <div class="w-1/2 flex flex-col gap-4">
        <h1 class="text-4xl font-bold">{{ product.model }}</h1>
        <div class="flex items-center gap-2">
          <i class="fa-solid fa-dollar-sign text-gray-600"></i>
          <span class="text-3xl font-semibold">{{ product.price }}</span>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-else class="text-center py-20">
      <p class="text-gray-500">Loading product details...</p>
    </div>
  </div>
</template>