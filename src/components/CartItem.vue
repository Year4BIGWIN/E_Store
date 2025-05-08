<template>
  <div class="w-full flex flex-col md:flex-row items-start md:items-center justify-between py-4 md:py-5 px-3 md:px-6 border-b border-gray-200 transition-all duration-200 hover:bg-gray-50 rounded-lg group relative">
    <!-- Product Information Section -->
    <div class="flex items-center gap-3 md:gap-5 w-full md:w-2/5">
      <!-- Image with hover effect and loading state -->
      <div class="relative w-24 h-24 md:w-24 md:h-24 bg-gray-100 rounded-lg overflow-hidden shadow-sm flex-shrink-0">
        <div v-if="isLoading" class="absolute inset-0 bg-gray-200 animate-pulse"></div>
        <img
          :src="cart.phone.firstImageUrl"
          :alt="cart.phone.model"
          class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" 
          :class="{'opacity-50': isLoading}"
        />
      </div>
      <!-- Product details with improved typography -->
      <div class="flex flex-col">
        <h3 class="text-base md:text-base font-semibold text-gray-800 line-clamp-2">{{ cart.phone.model }}</h3>
        <span class="text-sm md:text-sm text-blue-600 font-medium mt-1 md:hidden">${{ cart.phone.price }}</span>
      </div>
    </div>

    <!-- Price (Desktop only) -->
    <div class="hidden md:flex md:mr-16 items-center justify-center text-base text-gray-800 font-medium w-1/6">
      <span class="text-blue-600 font-semibold">${{ cart.phone.price }}</span>
    </div>

    <!-- Mobile layout for controls and subtotal - IMPROVED -->
    <div class="flex items-center justify-between w-full mt-5 md:hidden">
      <!-- Quantity Controls - Enhanced for touch -->
      <div class="flex items-center justify-start gap-2 bg-gray-100 rounded-full px-3 py-1.5 shadow-sm border border-gray-200">
        <button 
          @click="decreaseQuantity(cart.phone.id)" 
          :disabled="isLoading"
          aria-label="Decrease quantity"
          class="flex items-center justify-center w-9 h-9 rounded-full transition-colors text-lg text-gray-600 hover:bg-gray-200 active:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-300">
          <span class="leading-none text-xl">&minus;</span>
        </button>
        <span class="text-base font-semibold min-w-[28px] text-center">{{ cart.quantity }}</span>
        <button 
          @click="increaseQuantity(cart.phone.id)" 
          :disabled="isLoading"
          aria-label="Increase quantity"
          class="flex items-center justify-center w-9 h-9 rounded-full transition-colors text-lg text-gray-600 hover:bg-gray-200 active:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-300">
          <span class="leading-none text-xl">&plus;</span>
        </button>
      </div>
      
      <!-- Subtotal and Remove - Enhanced spacing -->
      <div class="flex items-center gap-4">
        <span class="font-semibold text-base text-gray-800">
          ${{ calculateSubtotal }}
        </span>
        <button 
          @click="confirmRemove" 
          :disabled="isLoading"
          aria-label="Remove item"
          class="flex items-center justify-center w-10 h-10 text-gray-500 rounded-full transition-all duration-200 hover:bg-red-50 hover:text-red-500 active:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-red-300">
          <i class="fa-solid fa-trash-can text-lg"></i>
        </button>
      </div>
    </div>

    <!-- Desktop Quantity Controls -->
    <div class="hidden md:flex items-center justify-center gap-1 bg-gray-100 rounded-full px-2 py-1 shadow-sm border border-gray-200">
      <button 
        @click="decreaseQuantity(cart.phone.id)" 
        :disabled="isLoading"
        aria-label="Decrease quantity"
        class="flex items-center justify-center w-8 h-8 rounded-full transition-colors text-lg text-gray-600 hover:bg-gray-200 active:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-300">
        <span class="leading-none">&minus;</span>
      </button>
      <span class="text-base font-semibold min-w-[30px] text-center">{{ cart.quantity }}</span>
      <button 
        @click="increaseQuantity(cart.phone.id)" 
        :disabled="isLoading"
        aria-label="Increase quantity"
        class="flex items-center justify-center w-8 h-8 rounded-full transition-colors text-lg text-gray-600 hover:bg-gray-200 active:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-300">
        <span class="leading-none">&plus;</span>
      </button>
    </div>

    <!-- Desktop Subtotal and Remove Button Section -->
    <div class="hidden md:flex items-center gap-6 md:w-1/5 justify-end">
      <span class="font-semibold text-base text-gray-800">
        ${{ calculateSubtotal }}
      </span>
      <button 
        @click="confirmRemove" 
        :disabled="isLoading"
        aria-label="Remove item"
        class="flex items-center justify-center w-9 h-9 text-gray-500 rounded-full transition-all duration-200 hover:bg-red-50 hover:text-red-500 active:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-red-300">
        <i class="fa-solid fa-trash-can"></i>
      </button>
    </div>

    <!-- Loading Overlay -->
    <div v-if="isLoading" class="absolute inset-0 bg-white bg-opacity-40 flex items-center justify-center rounded-lg z-10">
      <div class="w-7 h-7 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  </div>

  <!-- Improved Confirmation Dialog -->
  <Teleport to="body">
    <transition name="fade">
      <div 
        v-if="showConfirm" 
        @click.self="showConfirm = false" 
        class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 px-4 backdrop-blur-sm">
        <div class="bg-white rounded-xl shadow-xl p-5 md:p-6 max-w-xs w-full transition-transform duration-300 transform scale-100 opacity-100">
          <div class="mb-4 flex items-center justify-center">
            <div class="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-500">
              <i class="fa-solid fa-trash-can text-lg"></i>
            </div>
          </div>
          <p class="text-gray-800 font-medium mb-2 text-center">Remove this item from your cart?</p>
          <p class="text-sm text-gray-500 mb-4 text-center">This action cannot be undone.</p>
          <div class="flex gap-3 justify-center">
            <button 
              @click="showConfirm = false" 
              class="px-4 md:px-5 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-colors flex-1 focus:outline-none focus:ring-2 focus:ring-gray-300">
              Cancel
            </button>
            <button 
              @click="removeItemCompletely" 
              class="px-4 md:px-5 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors flex-1 focus:outline-none focus:ring-2 focus:ring-red-500">
              Remove
            </button>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup>
import { defineProps, defineEmits, ref, computed } from 'vue';
import Cookies from 'universal-cookie';
import { toast } from 'vue3-toastify';

const apiUrl = import.meta.env.VITE_APP_API_URL;
const cookies = new Cookies();

// Props and emits
const props = defineProps({
  cart: {
    type: Object,
    required: true
  }
});
const emit = defineEmits(['update-cart']);

// State variables
const isLoading = ref(false);
const showConfirm = ref(false);

// Computed properties
const calculateSubtotal = computed(() => {
  return (props.cart.phone.price * props.cart.quantity).toFixed(2);
});

// Helper functions
const getAuthToken = () => {
  const token = cookies.get("auth_token");
  if (!token) {
    throw new Error("Authentication token not found");
  }
  return token;
};

const makeCartRequest = async (endpoint, method) => {
  try {
    isLoading.value = true;
    const token = getAuthToken();
    
    const response = await fetch(`${apiUrl}${endpoint}`, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      emit('update-cart');
    } else {
      console.error(`Cart operation failed: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Cart operation error:", error.message);
  } finally {
    isLoading.value = false;
  }
};

// Action handlers
const decreaseQuantity = async (id) => {
  if (isLoading.value || props.cart.quantity <= 1) {
    confirmRemove();
    return;
  }
  
  await makeCartRequest(`/cart/removeOne/${id}`, "DELETE");
};

const increaseQuantity = async (id) => {
  await makeCartRequest(`/cart/addOne/${id}`, "POST");
};

const confirmRemove = () => {
  showConfirm.value = true;
};

const removeItemCompletely = async () => {
  await makeCartRequest(`/cart/remove/${props.cart.phone.id}`, "DELETE");
  toast.success("Item removed from cart");
  showConfirm.value = false;
};
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* Mobile enhancements */
@media (max-width: 768px) {
  .group {
    margin-bottom: 0.5rem;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  }
  
  .group:last-child {
    margin-bottom: 0;
  }
}
</style>
