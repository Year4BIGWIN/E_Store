<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import img from "../assets/image/Logo.png";

const authStore = useAuthStore();
const cartStore = useCartStore();

// Computed property for cart item count
const cartItemCount = computed(() => cartStore.cartItems.length);

// Create a computed property for profile image with fallback
const profileImage = computed(() => {
  return authStore.profile?.image_url || img;
});

// Watch for cart item changes (watching length instead of deep watching the array)
watch(
  () => cartStore.cartItems.length,
  () => {
    cartStore.fetchCart();
  }
);

// Watch for authentication state changes
watch(
  () => authStore.token,
  (newToken) => {
    if (newToken) {
      // Fetch profile when user logs in
      authStore.fetchProfile();
    }
  }
);

// Fetch cart data on mount
onMounted(() => {
  cartStore.fetchCart();
  if (authStore.token) {
    authStore.fetchProfile(); 
  }
});

</script>

<template>
  <div class="sticky top-0 z-20 flex max-w-6xl w-full">
    <nav class="flex w-full items-center justify-between px-6 py-3 bg-white shadow-md rounded-b-xl">
      <!-- Logo -->
      <router-link to="/">
        <div class="flex items-center space-x-2">
          <img :src="img" alt="Logo" class="h-6 w-6" />
          <span class="text-lg font-bold text-gray-800">SmartGear</span>
        </div>
      </router-link>

      <!-- Icons -->
      <div class="flex items-center space-x-4">
        <router-link to="/dashboard" v-if="authStore.role === 'ADMIN'">
          <button class="flex items-center">
            <svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
              class="hover:fill-green-500 transition duration-200 ease-in-out transform hover:scale-110">
              <path
                d="M4 13h6a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1zm-1 7a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v4zm10 0a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-7a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v7zm1-10h6a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1z" />
            </svg>
          </button>
        </router-link>

        <!-- Cart Icon with Badge -->
        <router-link to="/Cart">
          <button class="relative text-gray-500 hover:text-black">
            <i class="fa-solid fa-cart-shopping fa-lg"></i>
            <span v-if="cartItemCount > 0"
              class="absolute -top-1 -right-2 bg-red-500 text-white text-xs font-bold rounded-full px-1 transition-transform duration-300 ease-in-out">
              {{ cartItemCount }}
            </span>
          </button>
        </router-link>

        <!-- Profile or Sign In -->
        <router-link to="/profile" v-if="authStore.token">
          <img :src="profileImage" alt="Profile" class="h-8 w-8 rounded-full object-cover border border-gray-300" />
        </router-link>
        <router-link to="/login" v-else>
          <img :src="img" alt="Profile" class="h-8 w-8 rounded-full object-cover border border-gray-300" />
        </router-link>
      </div>
    </nav>
  </div>
</template>
