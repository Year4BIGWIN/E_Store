<template>
  <div class="w-full h-full flex flex-col gap-2">
    <!-- Mobile Phone Products -->
    <div class="w-full h-full bg-[#d9d9d9] rounded-xl flex flex-col gap-2 p-5">
      <div class="w-full flex justify-between">
        <h1 class="text-xl font-bold">Mobile Phone</h1>
        <button
          @click="showDialog = true"
          class="border px-4 py-2 hover:bg-white hover:text-black rounded-full text-white bg-blue-500"
        >
          Add Product
        </button>
      </div>

      <!-- Product List -->
      <div class="w-full grid grid-cols-4 gap-4">
        <ProductCartEdit
          v-for="product in products"
          :key="product.id"
          :name="product.model"
          :quantity="product.stock"
          :image="product.image_url"
          :id="product.id"
        />
      </div>
      <!-- <Pagination /> -->
    </div>

    <!-- Dialog Component -->

    <DialogPhone v-model:showDialog="showDialog" />
  </div>
</template>

<script setup>
import ProductCartEdit from "@/components/ProductCartEdit.vue";
import Pagination from "@/components/Pagination.vue";
import DialogPhone from "@/components/DialogPhone.vue";
import { onMounted, ref, computed } from "vue";
import { useProductStore } from "@/store/productStore";
const productStore = useProductStore();
const products = computed(() => productStore.products);

onMounted(() => {
  productStore.fetchProduct();
});

const showDialog = ref(false);
</script>
