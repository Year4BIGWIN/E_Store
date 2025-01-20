<template>
  <div class="sticky top-0 z-50 flex max-w-6xl w-full">
    <nav
      class="flex w-full items-center justify-between px-6 py-3 bg-white shadow-md rounded-b-xl"
    >
      <!-- Logo -->
      <router-link to="/">
        <div class="flex items-center space-x-2">
          <img :src="img" alt="Logo" class="h-6 w-6" />
          <span class="text-lg font-bold text-gray-800">SmartGear</span>
        </div>
      </router-link>

      <!-- Icons -->
      <div class="flex items-center space-x-4">
        <!-- Wait until isLoading is false to render ADMIN-specific content -->
        <router-link
          to="/dashboard"
          v-if="authStore.role === 'ADMIN'"
        >
          <button @click="handleSearch" class="flex items-center">
            <svg
              height="24"
              width="24"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              class="hover:fill-green-500 transition duration-200 ease-in-out transform hover:scale-110"
            >
              <path
                d="M4 13h6a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1zm-1 7a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v4zm10 0a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-7a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v7zm1-10h6a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1z"
              />
            </svg>
          </button>
        </router-link>

        <!-- Cart Icon with Badge -->
        <router-link to="/Cart">
          <button
            @click="handleCart"
            class="relative text-gray-500 hover:text-black"
          >
            <i class="fa-solid fa-cart-shopping fa-lg"></i>
            <span
              v-if="cartCount > 0"
              class="absolute -top-1 -right-2 bg-red-500 text-white text-xs font-bold rounded-full px-1"
            >
              {{ cartCount }}
            </span>
          </button>
        </router-link>

        <router-link to="/profile">
          <img
            :src="img"
            alt="Profile"
            class="h-6 w-6 rounded-full object-cover"
          />
        </router-link>
      </div>
    </nav>
  </div>
</template>


<script setup>
import { ref } from "vue";
import img from "../assets/image/Logo.png";
import { useAuthStore } from "@/store/authStore";

const authStore = useAuthStore();

// Event handlers
const handleSearch = () => {
  console.log("Search button clicked");
};

const handleCart = () => {
  console.log("Cart button clicked");
};
</script>
