<script setup>
import HomeSlide from '@/components/HomeSlide.vue';
import HomeProduct from '@/components/HomeProduct.vue';
</script>

<template>
  <main>
      <div class="w-full h-[250px] md:h-[450px] absolute inset-0 top-0 z-10">
      <HomeSlide />
     </div>

     <div class="pt-[180px] md:pt-[400px]">
      <HomeProduct />
     </div>
  </main>
</template>
