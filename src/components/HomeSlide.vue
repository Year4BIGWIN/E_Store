<script setup>
import Carousel from "./Carousel.vue";
import Search from "./Search.vue";
</script>

<template>
  <div class="w-full flex justify-center h-[250px] md:h-[450px]">
    <Carousel />
    <div
      class="absolute w-[90%] md:w-[1152px] flex justify-between items-center top-[200px] md:top-[400px] rounded-xl bg-white p-3 sm:p-5 mx-auto"
    >
      <h1 class="text-sm sm:text-xl sm:font-semibold sm:mb-0">NEW ARRIVAL</h1>
      <div class="w-[250px] md:w-[400px]">
        <Search placeholder="Search..." buttonText="Search" />
      </div>
    </div>
  </div>
</template>