<template>
  <div @click="goToProductDetail" class="cursor-pointer border shadow-lg rounded-xl w-[180px] flex flex-col justify-start">
    <div class="w-full h-[150px] rounded-xl bg-[#d9d9d9] relative">
      <img
        :src="product.firstImageUrl"
        alt="..."
        class="w-full h-full object-cover rounded-xl" />
      <h2
        class="absolute top-1 right-1 text-[12px] bg-white rounded-full px-3 text-black"
      >
        {{ product.productType.name }}
      </h2>
    </div>
    <div class="flex flex-col justify-start">
      <div class="flex flex-col justify-center items-center">
        <h1 class="text-lg font-semibold">{{ product.model }}</h1>
          <!-- <div class="flex items-center gap-1">
            <i class="fa-regular fa-star fa-xs" style="color: #bababa"></i>
            <h3 class="text-[12px] text-gray-400"> ( Review)</h3>
          </div> -->
      </div>
      <div class="flex justify-start items-center p-5">
            <i class="fa-solid fa-dollar-sign"></i>
            <h1 class="font-semibold text-lg">{{ product.price }}</h1>
          </div>

      <!-- <div class="w-full flex items-center justify-between gap-1">
        <Buttom @click.stop class="w-full" variant="secondary" size="lg">Add to Cart</Buttom>
        <Buttom @click.stop class="w-full" variant="primary" size="lg">Buy Now</Buttom>
      </div> -->
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';
import Buttom from "./Buttom.vue";
import { useRouter } from 'vue-router';

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
});

const router = useRouter();

const goToProductDetail = () => {
  router.push({ 
    name: 'productDetail', 
    params: { id: props.product.id },
  });
};
</script>