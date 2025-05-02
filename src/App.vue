<script setup>
import { RouterView } from "vue-router";
import { useRoute, onBeforeRouteUpdate } from "vue-router";
import { ref, computed } from "vue";
import NavBar from "./layout/NavBar.vue";
import Footer from "./layout/Footer.vue";
import AdminSideBar from "./layout/AdminSideBar.vue";

const route = useRoute();
const isAdminRoute = computed(() => {
  return ['/dashboard', '/product', '/user', '/order', '/other', '/Other'].includes(route.path);
});
</script>

<template>
  <div class="w-full flex flex-col">
    <!-- Check if the current route is an admin route -->
    <div v-if="isAdminRoute" class="flex w-full min-h-screen">
      <!-- Admin Sidebar -->
      <AdminSideBar class="w-60 h-full" />

      <!-- Main Content Area -->
      <div class="w-full flex flex-col items-center pl-2">
        <RouterView :key="route.path" />
      </div>
    </div>

    <!-- Layout for Non-Admin Routes -->
    <div v-else class="flex flex-col justify-center items-center w-full">
      <!-- NavBar -->
      <NavBar />

      <!-- Main Content -->
      <div>
        <RouterView />
      </div>

      <!-- Footer -->
      <Footer />
    </div>
  </div>
</template>
