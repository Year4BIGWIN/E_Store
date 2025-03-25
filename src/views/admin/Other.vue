<template>
  <div class="w-full flex flex-col h-screen bg-[#d9d9d9]">
    <div class="w-full text-xl flex justify-between p-5">
      <h1>Brand</h1>
      <Buttom @click="showDialog = true">Add Brand</Buttom>
    </div>
    <div class="w-full text-xl text-bold flex justify-between p-2">
      <div class="flex gap-12">
        <h1>Logo</h1>
        <h1>Name</h1>
      </div>
      <h1 class="mr-10">Action</h1>
    </div>
    <hr class="w-full" />
    <div class="w-full flex flex-col">
      <div v-for="brand in brands" :key="brand.id">
        <BrandItem :brand="brand" />
      </div>
    </div>

    <DialogBrand v-model:showDialog="showDialog" />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Buttom from "@/components/Buttom.vue";
import DialogBrand from "@/components/DialogBrand.vue";
import axios from "axios";
import BrandItem from "@/components/BrandItem.vue";

const apiUrl = import.meta.env.VITE_APP_API_URL;
const brands = ref([]);
const showDialog = ref(false);

async function GetBrands() {
  try {
    const response = await axios.get(`${apiUrl}/brand`);
    brands.value = response.data.data;
    console.log(brands.value);
  } catch (error) {
    console.error("Error fetching brands:", error);
  }
}

onMounted(() => {
  GetBrands();
});
</script>
