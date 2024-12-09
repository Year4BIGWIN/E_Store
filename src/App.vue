<script setup>
import { RouterLink, RouterView } from 'vue-router'
import NavBar from './layout/NavBar.vue';
import Footer from './layout/Footer.vue';

</script>

<template>
  <div class="max-w-7xl w-full flex flex-col items-center justify-center">
    <NavBar />
    <div class=" h-[90vh]">
      <RouterView />
    </div>
    <Footer />
  </div>
</template>

