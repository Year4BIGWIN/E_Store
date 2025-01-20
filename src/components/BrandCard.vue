<template>
  <div
    class="w-[270px] rounded-xl flex flex-col gap-2 items-center justify-center"
  >
    <h1 class="w-full text-2xl">Brand</h1>
    <div class="w-full grid grid-cols-2 gap-2">
      <div class="w-[125px] rounded-md border-2 border-[#a9a9a9] hover:shadow-lg hover:cursor-pointer">
        <img
          src="/src/assets/image/Vivo.png"
          alt="Brand"
          @click="goToProductPage"
          class="h-10 rounded-[5px] w-full object-cover"
        />
      </div>
      <div class="w-[125px] rounded-md border-2 border-[#a9a9a9] hover:shadow-lg hover:cursor-pointer">
        <img
          src="/src/assets/image/Vivo.png"
          @click="goToProductPage"
          alt="Brand"
          class="h-10 rounded-[5px] w-full object-cover"
        />
      </div>

      <div class="w-[125px] rounded-md border-2 border-[#a9a9a9] hover:shadow-lg hover:cursor-pointer">
        <img
          src="/src/assets/image/Vivo.png"
          @click="goToProductPage"
          alt="Brand"
          class="h-10 rounded-[5px] w-full object-cover"
        />
      </div>

      <div class="w-[125px] rounded-md border-2 border-[#a9a9a9] hover:shadow-lg hover:cursor-pointer">
        <img
          src="/src/assets/image/Vivo.png"
          @click="goToProductPage"
          alt="Brand"
          class="h-10 rounded-[5px] w-full object-cover"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
const router = useRouter();

const goToProductPage = () => {
  console.log("go to product page");
};
</script>
