<script setup>
import Carousel from "./Carousel.vue";
import Search from "./Search.vue";
</script>

<template>
  <div class="flex w-full h-[250px] md:h-[500px] justify-center items-center">
    <Carousel />
    <div
      class="absolute w-[90%] sm:w-[95%] md:w-[90%] lg:w-[1152px] flex sm:flex-row justify-between items-center top-[200px] md:top-[400px] rounded-xl bg-white p-3 sm:p-5 mx-auto"
    >
      <h1 class="text-sm sm:text-xl sm:font-semibold sm:mb-0">NEW ARRIVAL</h1>
      <div class="w-[250px] md:w-[400px]">
        <Search placeholder="Search..." buttonText="Search" />
      </div>
    </div>
  </div>
</template>