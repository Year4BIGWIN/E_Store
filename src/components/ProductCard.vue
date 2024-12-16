<script setup>
import Buttom from "./Buttom.vue";
</script>

<template>
  <div class="w-[365px] flex flex-col justify-start gap-2">
    <div class="w-full h-[250px] rounded-xl bg-[#d9d9d9] relative">
      <h2
        class="absolute top-1 right-1 text-[12px] bg-white rounded-full px-3 text-black"
      >
        Type
      </h2>
    </div>
    <div class="flex flex-col justify-start p-2 gap-4">
      <div class="flex flex-col">
        <h1 class="text-lg font-semibold">Title</h1>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-1">
            <i class="fa-regular fa-star fa-xs" style="color: #bababa"></i>
            <h3 class="text-[12px] text-gray-400">4.5 (12 Review)</h3>
          </div>
          <div class="flex items-center">
            <i class="fa-solid fa-dollar-sign"></i>
            <h1 class="font-semibold text-lg">Price</h1>
          </div>
        </div>
      </div>

      <div class="w-full flex items-center justify-between gap-1">
        <Buttom class="w-full" variant="secondary" size="lg"
          >Add to Cart</Buttom
        >
        <Buttom class="w-full" variant="primary" size="lg">Buy Now</Buttom>
      </div>
    </div>
  </div>
</template>
