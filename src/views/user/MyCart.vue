<script setup>
import { onMounted } from "vue";
import { useCartStore } from "@/store/cartStore";
import CartItem from "@/components/CartItem.vue";
import Checkout from "@/components/CheckOut/Checkout.vue";

const cartStore = useCartStore();

onMounted(() => {
  cartStore.fetchCart();
});

const handleUpdateCart = () => {
  cartStore.fetchCart();
};
</script>

<template>
  <div class="w-[1152px] mx-auto border border-gray-200 rounded-xl my-10 shadow-sm overflow-hidden">
    <!-- Cart Header -->
    <div class="bg-gray-50 p-5 border-b border-gray-200">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl md:text-3xl font-bold text-gray-800">My Cart</h1>
        <span class="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">
          {{ cartStore.cartItems.length }} {{ cartStore.cartItems.length === 1 ? 'Item' : 'Items' }}
        </span>
      </div>
    </div>

    <!-- Empty Cart State -->
    <div v-if="cartStore.cartItems.length === 0" class="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div class="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        <i class="fa-solid fa-shopping-cart text-gray-400 text-2xl"></i>
      </div>
      <h2 class="text-xl font-medium text-gray-800 mb-2">Your cart is empty</h2>
      <p class="text-gray-500 max-w-md mb-6">Looks like you haven't added any items to your cart yet.</p>
      <router-link to="/" class="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
        Continue Shopping
      </router-link>
    </div>

    <!-- Cart Content -->
    <div v-else>
      <!-- Column Headers (Desktop only) -->
      <div class="hidden md:flex justify-between items-center px-6 py-3 bg-gray-50 text-sm font-medium text-gray-500 border-b border-gray-200">
        <div class="w-2/5">Product</div>
        <div class="w-3/5 flex justify-between">
          <div class="w-1/6 text-right">Price</div>
          <div class="w-1/3 text-center">Quantity</div>
          <div class="w-1/6 text-center">Subtotal</div>
        </div>
      </div>

      <!-- Cart Items -->
      <div class="max-h-[60vh] overflow-y-auto">
        <div v-for="item in cartStore.cartItems" :key="item.id" class="border-b border-gray-100 last:border-b-0">
          <CartItem :cart="item" @update-cart="handleUpdateCart" />
        </div>
      </div>

      <!-- Cart Summary -->
      <div class="p-5 bg-gray-50 border-t border-gray-200">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-500">Need help? Contact our support team</span>
            <a href="#" class="text-blue-600 text-sm hover:underline">Support</a>
          </div>
          
          <div class="flex flex-col items-end gap-3">
              <div class="text-xl font-bold mt-2 border-gray-200 pt-2">
                Total: ${{ cartStore.totalPrice }}
            </div>
            
            <Checkout
              ref="checkoutRef"
              :cartItems="cartStore.cartItems"
              :totalPrice="cartStore.totalPrice"
              :showButton="true"
              @payment-successful="handleUpdateCart"
              @update-cart="handleUpdateCart"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
