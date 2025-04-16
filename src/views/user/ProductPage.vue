<template>

  <div class="w-screen justify-center items-center flex flex-col gap-10 py-10">
      <div class="w-[1152px] flex gap-4 font-semibold text-lg">
          <router-link to="/" ><span class="hover:text-blue-500">Home</span></router-link>
          <router-link to="/products" >&#x2022 &nbsp &nbsp <span class="hover:text-blue-500">Product</span></router-link>
      </div>

          <div class="w-[1152px] flex flex-col gap-4">
              <h1 class="text-2xl">PRODUCT CATEGORIES</h1>
          
          <div class="w-full flex gap-6 ">
              <router-link to="/products/phone">
              <div class="group bg-[#d9d9d9]  hover:bg-blue-500 hover:text-white hover:fill-white w-[270px] px-4 py-4 flex  items-center rounded-xl">
              <i class="fa-solid fa-mobile-screen-button fa-2x"></i>
              <hr class="w-10 border border-black group-hover:border-white rotate-90">
              <div>
                  <h1 class="text-xl">Mobile Phone</h1>
                  <router-link to="/products/phone">view all <i class="fa-solid fa-angles-right"></i></router-link>
              </div>
              </div>
              </router-link>

              <router-link to="/products/tablet">
              <div class="group bg-[#d9d9d9]  hover:bg-blue-500 hover:text-white hover:fill-white w-[270px] px-4 py-4 flex  items-center rounded-xl">
                  <i class="fa-solid fa-tablet-screen-button fa-2x"></i>
              <hr class="w-10 border border-black group-hover:border-white rotate-90">
              <div>
                  <h1 class="text-xl">Tablet</h1>
                  <router-link to="/products/tablet">view all <i class="fa-solid fa-angles-right"></i></router-link>
              </div>
              </div>
              </router-link>

              <router-link to="/products/watch">
              <div class="group bg-[#d9d9d9]  hover:bg-blue-500 hover:text-white hover:fill-white w-[270px] px-4 py-4 flex  items-center rounded-xl">
                  <svg :fill="black" height="50" viewBox="0 0 24 24" width="40" xmlns="http://www.w3.org/2000/svg"><path d="M7.5 6.40135V4C7.5 2.89543 8.39543 2 9.5 2H14.5C15.6046 2 16.5 2.89543 16.5 4V6.40135C17.3967 6.92006 18 7.88958 18 9V10C18.5523 10 19 10.4477 19 11V12C19 12.5523 18.5523 13 18 13V15C18 16.1104 17.3967 17.0799 16.5 17.5987L16.5 20C16.5 21.1046 15.6046 22 14.5 22H9.5C8.39543 22 7.5 21.1046 7.5 20L7.5 17.5987C6.6033 17.0799 6 16.1104 6 15V9C6 7.88958 6.6033 6.92006 7.5 6.40135ZM9.5 3.5C9.22386 3.5 9 3.72386 9 4V6H15V4C15 3.72386 14.7761 3.5 14.5 3.5H9.5ZM16.5 15V9C16.5 8.17157 15.8284 7.5 15 7.5H9C8.17157 7.5 7.5 8.17157 7.5 9V15C7.5 15.8284 8.17157 16.5 9 16.5H15C15.8284 16.5 16.5 15.8284 16.5 15ZM9 20C9 20.2761 9.22386 20.5 9.5 20.5H14.5C14.7761 20.5 15 20.2761 15 20V18H9L9 20Z"/></svg>
              <hr class="w-10 border border-black group-hover:border-white rotate-90">
              <div>
                  <h1 class="text-xl">Smart Watch</h1>
                  <router-link to="/products/watch">view all <i class="fa-solid fa-angles-right"></i></router-link>
              </div>
              </div>
              </router-link>

              <router-link to="/products/accessories">
              <div class="group bg-[#d9d9d9]  hover:bg-blue-500 hover:text-white hover:fill-white w-[270px] px-4 py-4 flex  items-center rounded-xl">
                  <i class="fa-solid fa-headphones-simple fa-2x"></i>
              <hr class="w-10 border border-black group-hover:border-white rotate-90">
              <div>
                  <h1 class="text-xl">Accesories</h1>
                  <router-link to="/products/accessories">view all <i class="fa-solid fa-angles-right"></i></router-link>
              </div>
              </div>
              </router-link>
          </div>
          
      </div>

      <div class="flex p-6 bg-gray-100 rounded-xl">
  <div class="w-[1100px]  flex gap-4">
    <!-- Brand Section -->
    <div class="w-[270px]">
      <h1 class="text-2xl font-bold mb-4">BRAND</h1>
      <div class="w-full grid grid-cols-2 gap-2">
        <BrandCard v-for="item in brand" :key="item.id" :name="item.name" :image="item.image_url" />
      </div>
    </div>
    <!-- Product Section -->
    <div class="  flex-1">
      <h1 class="text-2xl font-bold mb-4">PRODUCT</h1>
      <div class="flex flex-wrap gap-4">
        <div v-for="item in product" :key="item.id" class="border rounded-lg shadow-md bg-white p-4 w-64">
          <img :src="item.image_url" class="w-full h-40 object-cover rounded-md mb-2" alt="Product Image">
          <h2 class="text-lg font-semibold">{{ item.model }}</h2>
        </div>
      </div>
    </div>
  </div>
</div>
  
  </div>
  
  </template>
  
  <script setup>
  import router from "@/router";
  import Buttom from "@/components/Buttom.vue";
  import BrandCard from "@/components/BrandCard.vue";
  import { onMounted, ref } from "vue";
  import SmallCard from "@/components/SmallProductCard.vue";

  const apiUrl = import.meta.env.VITE_APP_API_URL;
  const brand = ref();
  const product = ref();

  const fetchBrand = async () => {
try {
  const response = await fetch(`${apiUrl}/brand`);
  const response2 = await fetch(`${apiUrl}/product`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const data = await response.json();
  const data2 = await response2.json();
  brand.value = data.data;
  product.value = data2.data;

  console.log(brand);
} catch (error) {
  console.error('There was a problem with the fetch operation:', error);
}
};

  onMounted(() => {
      fetchBrand();
  });
  </script>