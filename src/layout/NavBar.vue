<script setup>
import { onMounted, computed, watch, ref } from "vue";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import avatar from "../assets/image/avatar.webp";
import img from "../assets/image/Logo.png";

const authStore = useAuthStore();
const cartStore = useCartStore();
const profileImageKey = ref(0); // Add a key to force re-render

const cartItemCount = computed(() => cartStore.cartItems.length);

const profileImage = computed(() => {
  return authStore.profile?.image_url ? authStore.profile.image_url : generateDefaultAvatar();
});

const generateDefaultAvatar = () => {
  const firstName = authStore.profile?.first_name || '';
  const lastName = authStore.profile?.last_name || '';
  const email = authStore.profile?.email || '';
  const displayName = (firstName || lastName) 
    ? `${firstName} ${lastName}`.trim() 
    : (email || "User");
  let colorHash = 0;
  for (let i = 0; i < displayName.length; i++) {
    colorHash = displayName.charCodeAt(i) + ((colorHash << 5) - colorHash);
  }
  let color = (colorHash & 0x00FFFFFF).toString(16).toUpperCase();
  while (color.length < 6) {
    color = "0" + color;
  }
  
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=${color}&color=fff&size=128&bold=true`;
};

// Watch for cart item changes (watching length instead of deep watching the array)
watch(
  () => cartStore.cartItems.length,
  () => {
    cartStore.fetchCart();
  }
);

watch(
  () => authStore.token,
  (newToken) => {
    if (newToken) {
      authStore.fetchProfile();
    }
  }
);

// Watch for profile changes (deep watch)
watch(
  () => authStore.profile,
  () => {
    // Force image re-render by updating the key
    profileImageKey.value++;
  },
  { deep: true }
);

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
              class="hover:fill-blue-500 transition duration-200 ease-in-out transform hover:scale-110">
              <path
                d="M4 13h6a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1zm-1 7a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v4zm10 0a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-7a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v7zm1-10h6a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1z" />
            </svg>
          </button>
        </router-link>

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
          <img :src="profileImage" :key="profileImageKey" alt="Profile" class="h-8 w-8 rounded-full object-cover border border-gray-300" />
        </router-link>
        <router-link to="/login" v-else>
          <img :src="avatar" alt="Profile" class="h-8 w-8 rounded-full object-cover border border-gray-300" />
        </router-link>
      </div>
    </nav>
  </div>
</template>
