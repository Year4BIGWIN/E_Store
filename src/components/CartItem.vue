<template>
  <div class="w-full flex flex-wrap md:flex-nowrap items-center justify-between py-4 px-3 md:px-6 border-b border-gray-200 transition-all hover:bg-gray-50 rounded-lg">
    <!-- Product Information Section -->
    <div class="flex items-center gap-4 w-full md:w-2/5">
      <div class="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden shadow-sm flex-shrink-0">
        <img
          :src="cart.phone.firstImageUrl"
          :alt="cart.phone.model"
          class="w-full h-full object-cover transition-transform hover:scale-105" />
      </div>
      <div class="flex flex-col">
        <h3 class="text-base font-medium text-gray-800">{{ cart.phone.model }}</h3>
        <span class="text-sm text-gray-600 mt-1 md:hidden">${{ cart.phone.price }}</span>
      </div>
    </div>

    <!-- Price (Desktop only) -->
    <div class="hidden md:flex items-center justify-center text-base text-gray-800 font-medium w-1/6">
      <span class="mr-20">${{ cart.phone.price }}</span>
    </div>

    <!-- Quantity Controls Section -->
    <div class="flex items-center justify-center gap-2 bg-gray-100 rounded-lg px-3 py-1 my-3 md:my-0 mx-auto md:mx-0">
      <button 
        @click="decreaseQuantity(cart.phone.id)" 
        :disabled="isLoading"
        aria-label="Decrease quantity"
        class="flex items-center justify-center w-7 h-7 rounded-full transition-colors text-lg hover:bg-gray-200 active:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed">
        <span>&minus;</span>
      </button>
      <span class="text-base font-medium min-w-[24px] text-center">{{ cart.quantity }}</span>
      <button 
        @click="increaseQuantity(cart.phone.id)" 
        :disabled="isLoading"
        aria-label="Increase quantity"
        class="flex items-center justify-center w-7 h-7 rounded-full transition-colors text-lg hover:bg-gray-200 active:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed">
        <span>&plus;</span>
      </button>
    </div>

    <!-- Subtotal and Remove Button Section -->
    <div class="flex items-center gap-4 md:w-1/5 justify-end">
      <span class="font-semibold text-base">${{ calculateSubtotal }}</span>
      <button 
        @click="confirmRemove" 
        :disabled="isLoading"
        aria-label="Remove item"
        class="flex items-center justify-center w-8 h-8 text-gray-500 rounded-full transition-colors hover:bg-red-50 hover:text-red-500 active:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed">
        <i class="fa-solid fa-trash"></i>
      </button>
    </div>
  </div>

  <!-- Confirmation Dialog -->
  <Teleport to="body">
    <div 
      v-if="showConfirm" 
      @click.self="showConfirm = false" 
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div class="bg-white rounded-lg shadow-lg p-6 max-w-xs w-full text-center">
        <p class="text-gray-800 font-medium mb-2">Remove this item from your cart?</p>
        <div class="flex gap-3 mt-4 justify-center">
          <button 
            @click="showConfirm = false" 
            class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100">
            Cancel
          </button>
          <button 
            @click="removeItemCompletely" 
            class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
            Remove
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { defineProps, defineEmits, ref, computed } from 'vue';
import Cookies from 'universal-cookie';

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
  showConfirm.value = false;
};
</script>
