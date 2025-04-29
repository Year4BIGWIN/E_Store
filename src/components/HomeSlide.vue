<script setup>
import Carousel from "./Carousel.vue";

import Buttom from "@/components/Buttom.vue";
</script>


<template>
  <div class="flex w-screen h-[450px] justify-center items-center">
    <Carousel />
    <div
      class="absolute w-[1152px] flex justify-between items-center top-[400px]  rounded-xl bg-white p-5"
    >
      <h1 class="text-xl font-semibold">NEW ARRIVAL</h1>
      <form class="w-[400px]">
        <div class="relative">
          <div
            class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none"
          >
            <svg
              class="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="search"
            id="search"
            class="block w-full ps-10 text-sm py-2 focus:outline-none text-gray-900 border border-gray-300 rounded-full"
            placeholder="Search..."
            required
          />
          <Buttom
            variant="default"
            size="default"
            class="absolute right-0 top-0 mt-1 mr-1"
            >Search</Buttom
          >
        </div>
      </form>
    </div>
  </div>
</template>