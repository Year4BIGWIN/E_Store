<script setup>
import { RouterView } from "vue-router";
import { useRoute } from "vue-router";
import { computed, ref, watch } from "vue";
import NavBar from "./layout/NavBar.vue";
import Footer from "./layout/Footer.vue";
import AdminSideBar from "./layout/AdminSideBar.vue";

const route = useRoute();
const isAdminRoute = computed(() => {
  return [
    "/dashboard",
    "/product",
    "/user",
    "/order",
    "/other",
    "/Other",
  ].includes(route.path);
});

// Transition control
const transitionName = ref("fade-slide");
</script>

<template>
  <div class="w-full flex flex-col">
    <!-- Check if the current route is an admin route -->
    <div v-if="isAdminRoute" class="flex w-full min-h-screen">
      <!-- Admin Sidebar -->
      <AdminSideBar class="w-60 h-full" />

      <!-- Main Content Area -->
      <div class="w-full flex flex-col items-center pl-2">
        <transition name="fade-slide" mode="out-in">
          <RouterView v-slot="{ Component }">
            <component :is="Component" :key="route.path" />
          </RouterView>
        </transition>
      </div>
    </div>

    <!-- Layout for Non-Admin Routes -->
    <div v-else class="flex flex-col justify-center items-center w-full">
      <!-- NavBar -->
      <NavBar />

      <!-- Main Content -->
      <div>
        <transition name="fade-slide" mode="out-in">
          <RouterView v-slot="{ Component }">
            <component :is="Component" :key="route.path" />
          </RouterView>
        </transition>
      </div>

      <!-- Footer -->
      <Footer />
    </div>
  </div>
</template>

<style>
/* Page Transitions */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.35s ease, transform 0.35s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* Alternative slide transition */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.4s ease;
}

.slide-enter-from {
  transform: translateX(100%);
}

.slide-leave-to {
  transform: translateX(-100%);
}
</style>
