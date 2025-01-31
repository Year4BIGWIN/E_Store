<script setup>
import { ref, watch, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import Buttom from "@/components/Buttom.vue";
import ProductCard from "@/components/ProductCard.vue";

const apiUrl = import.meta.env.VITE_APP_API_URL;
const route = useRoute();
const product = ref({});
const error = ref(null);
const isLoading = ref(true);
const similarProducts = ref([]);
const quantity = ref(1);

const fetchProduct = async (id) => {
  isLoading.value = true;
  try {
    const response = await axios.get(`${apiUrl}/product/id/${id}`);
    product.value = response.data || {};
    
    console.log(product.value);
    
    // Set default values for missing properties
    product.value.images = product.value.images || [product.value.image_url];
    product.value.rating = product.value.rating || 0;
    
    
    error.value = null;
  } catch (err) {
    console.error("API Error:", err);
    error.value = err.response?.data?.message || err.message;
  } finally {
    isLoading.value = false;
  }
};

const updateQuantity = (operation) => {
  if (operation === 'increment') {
    quantity.value += 1;
  } else if (operation === 'decrement' && quantity.value > 1) {
    quantity.value -= 1;
  }
};

onMounted(() => {
  if (route.params.id) fetchProduct(route.params.id);
});

watch(
  () => route.params.id,
  (newId) => {
    if (newId) fetchProduct(newId);
  }
);
 console.log(product.value);

</script>

<template>
  <div class="w-[1152px] justify-start flex flex-col gap-10 py-10">
    <!-- Breadcrumbs -->
    <div class="w-full flex gap-4 font-semibold text-lg">
      <router-link to="/"><span class="hover:text-blue-500">Home</span></router-link>
      <router-link to="/products">&#x2022; <span class="hover:text-blue-500">Product</span></router-link>
      <router-link to="/categories">
        &#x2022; <span class="hover:text-blue-500"></span>
      </router-link>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="text-center py-20">
      <p class="text-gray-500">Loading product details...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-red-500 text-center py-20">
      {{ error }}
    </div>

    <!-- Product Details -->
    <div v-else class="w-full flex gap-4">
      <!-- Product Images -->
      <div class="w-1/2 flex flex-col gap-4">
        <div class="w-full h-[500px] bg-[#d9d9d9] rounded-xl">
          <img 
            :src="product.image_url" 
            class="w-full h-full object-cover rounded-xl" 
            :alt="product.model"
            @error="(e) => e.target.src = '/placeholder-image.jpg'"
          >
        </div>
        <div class="w-full flex gap-2">
          <div 
            v-for="(img, index) in product.data.images" 
            :key="index" 
            class="w-[150px] h-[150px] bg-[#d9d9d9] rounded-xl cursor-pointer"
            @click="product.image_url = img"
          >
            <img 
              :src="img" 
              class="w-full h-full object-cover rounded-xl"
              :alt="`Thumbnail ${index + 1}`"
            >
          </div>
        </div>
      </div>

      <!-- Product Info -->
      <div class="w-1/2 flex flex-col gap-4">
        <h1 class="text-4xl font-bold">{{ product.data.model || 'Product Title' }}</h1>
        <div class="flex items-center gap-2">
          <i 
            v-for="star in 5" 
            :key="star" 
            class="fa-solid fa-star" 
            :style="{ color: star <= product.rating ? '#FFD43B' : '#d9d9d9' }"
          ></i>
        </div>
        <hr class="w-full">

        <!-- Product Variations -->
        <div v-if="product.variants" class="flex flex-col gap-4">
          <div v-for="(variant, name) in product.variants" :key="name">
            <h3 class="text-lg font-semibold">Choose {{ name }}</h3>
            <div class="flex gap-2 mt-2">
              <button 
                v-for="option in variant" 
                :key="option"
                class="px-4 py-2 border rounded-lg hover:bg-gray-100"
              >
                {{ option }}
              </button>
            </div>
          </div>
        </div>

        <hr class="w-full">
        <div class="flex gap-10 items-center">
          <h1 class="text-4xl">${{ product.data.price?.toLocaleString() || '0.00' }}</h1>
          <div class="flex items-center gap-4 bg-gray-100 rounded-xl px-4 py-2">
            <button 
              class="text-2xl hover:text-blue-500"
              @click="updateQuantity('decrement')"
            >
              &minus;
            </button>
            <span class="text-xl w-8 text-center">{{ quantity }}</span>
            <button 
              class="text-2xl hover:text-blue-500"
              @click="updateQuantity('increment')"
            >
              &plus;
            </button>
          </div>
        </div>
        <hr class="w-full">
        
        <!-- Action Buttons -->
        <div class="w-full flex items-center justify-between gap-1">
          <Buttom class="w-full" variant="secondary" size="lg">Add to Cart</Buttom>
          <Buttom class="w-full" variant="primary" size="lg">Buy Now</Buttom>
        </div>
      </div>
    </div>

    <!-- Product Specifications -->
    <div  class="w-full flex flex-col gap-4">
      <h1 class="font-semibold text-2xl">Product Specifications</h1>
      <div class="grid grid-cols-2 gap-4">
        <div 
          class="p-2 bg-gray-50 gap-20 flex rounded-lg"
        >
            <h2 class="text-lg font-semibold">Display</h2>
            <p>{{ product.display || 'N/A' }}</p>
        </div>
      </div>
    </div>

    <!-- Similar Products -->
    <div v-if="similarProducts.length" class="w-full flex flex-col gap-2">
      <div class="w-full flex justify-between">
        <h1 class="text-2xl font-bold">Similar Products</h1>
        <router-link to="/products" class="hover:text-blue-500 text-lg font-semibold">
          View All <i class="fa-solid fa-angles-right"></i>
        </router-link>
      </div>
      <div class="w-full flex gap-8">
        <ProductCard 
        />
      </div>
    </div>
  </div>
</template>