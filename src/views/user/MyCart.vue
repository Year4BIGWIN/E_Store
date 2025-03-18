<template>
  <div class="w-[1152px] border rounded-xl my-10 flex flex-col gap-1 p-5">
    <div class="flex justify-between">
      <h1 class="text-3xl font-bold">My Cart</h1>
      <h1>{{ cart.cartItems.length }} Items</h1>
    </div>
    <div class="w-full flex justify-between">
      <h1 class="w-2/5">Product</h1>
      <div class="w-3/5 justify-between flex">
        <h1>Price</h1>
        <h1>Quantity</h1>
        <h1 class="mr-24">Sub Total</h1>
      </div>
    </div>
    <hr class="w-full" />
    <div v-for="item in cart.cartItems" :key="item.id" class="w-full flex gap-4 flex-col h-[400px] overflow-y-scroll">
      <!-- Listen for update-cart event -->
      <CartItem :cart="item" @update-cart="fetchCart" />
    </div>
    <hr class="w-full" />
    <div class="w-full flex justify-end">
      <div class="w-fit flex flex-col gap-4">
        <h1 class="text-xl font-bold">Total: ${{ cart.totalPrice }}</h1>
        <button class="hover:brightness-90 text-white bg-black py-1 px-3 border-2 rounded-xl">
          CheckOut
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Cookies from "universal-cookie";
import CartItem from "@/components/CartItem.vue";

const apiUrl = import.meta.env.VITE_APP_API_URL;
const cart = ref({ cartItems: [], totalPrice: 0 });
const cookies = new Cookies();

const fetchCart = async () => {
  try {
    const response = await fetch(`${apiUrl}/cart`, {
      headers: {
        Authorization: `Bearer ${cookies.get("auth_token")}`,
      },
    });
    const data = await response.json();
    cart.value = data.data; // Update cart state
  } catch (error) {
    console.error("Error fetching cart:", error);
  }
};

onMounted(() => {
  fetchCart();
});
</script>
