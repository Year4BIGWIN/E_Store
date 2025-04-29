<template>
  <div 
    @click="goToProductDetail" 
    class="group cursor-pointer bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 flex flex-col h-full"
  >
    <!-- Product Image with Overlay on Hover -->
    <div class="relative aspect-square overflow-hidden">
      <img
        :src="product.firstImageUrl || defaultImage"
        alt="Product image"
        class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        @error="handleImageError"
      />
      
      <!-- Category Badge -->
      <div class="absolute top-2 right-2">
        <span 
          class="text-xs font-medium py-1 px-2.5 rounded-full bg-white/90 backdrop-blur-sm shadow-sm"
        >
          {{ product.productType.name }}
        </span>
      </div>
      
      <!-- Quick action buttons on hover -->
      <div class="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <div class="transform translate-y-2 group-hover:translate-y-0 transition-transform">
          <button 
            @click.stop="addItemToCart" 
            class="bg-white text-gray-800 rounded-full w-9 h-9 flex items-center justify-center mx-1 shadow-md hover:bg-gray-100"
            :class="{'opacity-70': isAddingToCart}"
            :disabled="isAddingToCart"
            title="Add to cart"
          >
            <svg 
              v-if="!isAddingToCart" 
              xmlns="http://www.w3.org/2000/svg" 
              class="h-5 w-5 pointer-events-none" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 animate-spin pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>
      
      <!-- Success toast notification -->
      <div 
        v-if="showSuccessToast" 
        class="absolute top-2 left-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs shadow-md z-10 animate-fade-in-down"
      >
        Added to cart!
      </div>
      
      <!-- Out of Stock toast notification -->
      <div 
        v-if="showOutOfStockToast" 
        class="absolute top-2 left-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs shadow-md z-10 animate-fade-in-down"
      >
        Sorry, this product is out of stock!
      </div>
    </div>
    
    <!-- Product Details -->
    <div class="flex flex-col justify-between flex-grow p-3 pt-2">
      <h3 class="font-medium text-gray-800 mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
        {{ product.model }}
      </h3>
      
      <div class="mt-auto pt-2">
        <span class="text-base font-bold text-gray-900">
          ${{ product.price }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '@/store/cartStore';

const cartStore = useCartStore();
const router = useRouter();

// Use import.meta.url for more reliable asset paths
const defaultImage = new URL('/src/assets/image/Logo.png', import.meta.url).href;
const isAddingToCart = ref(false);
const showSuccessToast = ref(false);
const showOutOfStockToast = ref(false);

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
});

const goToProductDetail = () => {
  router.push({ 
    name: 'productDetail', 
    params: { id: props.product.id },
  });
};

const addItemToCart = async (event) => {
  // Prevent event propagation and multiple clicks
  if (event) {
    event.stopPropagation();
    event.preventDefault();
  }
  
  if (isAddingToCart.value) return;
  
  isAddingToCart.value = true;
  
  try {
    const result = await cartStore.addToCart(props.product.id, 1);
    
    if (result.success) {
      // Show success toast
      showSuccessToast.value = true;
      setTimeout(() => {
        showSuccessToast.value = false;
      }, 2000);
    } else {
      showOutOfStockToast.value = true;
      // Add timeout to hide the out-of-stock toast after 2 seconds
      setTimeout(() => {
        showOutOfStockToast.value = false;
      }, 2000);
    }
  } catch (error) {
    console.error("Error adding to cart:", error);
  } finally {
    isAddingToCart.value = false;
  }
};

const handleImageError = (e) => {
  e.target.src = defaultImage;
};
</script>

<style>
/* Add for line clamping (truncating text) */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Toast animation */
@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-down {
  animation: fadeInDown 0.3s ease-out forwards;
}
</style>