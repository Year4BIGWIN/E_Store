<script setup>
import { RouterView } from "vue-router";
import { useRoute } from "vue-router";
import NavBar from "./layout/NavBar.vue";
import Footer from "./layout/Footer.vue";
import AdminSideBar from "./layout/AdminSideBar.vue";

const route = useRoute();
</script>

<template>
  <div class="w-full flex flex-col">
    <!-- Check if the current route is an admin route -->
    <div v-if="['dashboard', 'product', 'user', 'order'].includes(route.name)" class="flex w-full min-h-screen">
      <!-- Admin Sidebar -->
      <AdminSideBar class="w-full h-full" />

      <!-- Main Content Area -->
      <div class="w-full px-4 pt-4">
        <RouterView />
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
