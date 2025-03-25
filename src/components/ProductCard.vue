<script setup>
import { defineProps } from 'vue';
import Buttom from "./Buttom.vue";
import { useRouter } from 'vue-router';
import Cookies from 'universal-cookie';
import { useCartStore } from '@/store/cartStore';

const router = useRouter();
const apiUrl = import.meta.env.VITE_APP_API_URL;

const addToCart = async (phoneId, quantity) => {
  try {
    const cartStore = useCartStore(); // Access Pinia cart store
    const cookies = new Cookies();
    const token = cookies.get("auth_token");

    // Validate token
    if (!token || token.split(".").length !== 3) {
      alert("Invalid or missing authentication token");
      return;
    }

    const response = await fetch(`${apiUrl}/cart/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ phoneId, quantity }),
    });

    const responseData = await response.json();

    if (!response.ok) {
      alert(responseData.message || "Failed to add item to cart");
      return;
    }

    console.log("Add to cart response:", responseData);

    // Fetch updated cart after adding an item
    await cartStore.fetchCart();
  } catch (error) {
    console.error("Error adding to cart:", error);
    alert("An error occurred while adding the item. Please try again.");
  }
};

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
});

console.log(props.product);

const goToProductDetail = () => {
  router.push({ 
    name: 'productDetail', 
    params: { id: props.product.id },
  });
};
</script>

<template>
  
  <div class="cursor-pointer w-[365px] flex flex-col justify-start gap-2">
    <div @click="goToProductDetail" class="w-full h-[250px] rounded-xl bg-[#d9d9d9] relative">
      <img
        :src="product.image_url"
        alt="..."
        class="w-full h-full object-cover rounded-xl" />
      <h2
        class="absolute top-1 right-1 text-[12px] bg-white rounded-full px-3 text-black"
      >
        {{ product.productType.name }}
      </h2>
    </div>
    <div class="flex flex-col justify-start p-2 gap-4">
      <div class="flex flex-col">
        <h1 class="text-lg font-semibold">{{ product.model }}</h1>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-1">
            <i class="fa-regular fa-star fa-xs" style="color: #bababa"></i>
            <h3 class="text-[12px] text-gray-400"> ( Review)</h3>
          </div>
          <div class="flex items-center">
            <i class="fa-solid fa-dollar-sign"></i>
            <h1 class="font-semibold text-lg">{{ product.price }}</h1>
          </div>
        </div>
      </div>
      <div class="w-full flex items-center justify-between gap-1">
        <Buttom @click="addToCart(product.id, product.quantity?null:1)" class="w-full" variant="secondary" size="lg">Add to Cart</Buttom>
        <Buttom @click.stop class="w-full" variant="primary" size="lg">Buy Now</Buttom>
      </div>
    </div>
  </div>
</template>