<script setup>
import { onMounted } from "vue";
import { useCartStore } from "@/store/cartStore";
import CartItem from "@/components/CartItem.vue";
import Checkout from "@/components/Checkout.vue";

const cartStore = useCartStore();

onMounted(() => {
  cartStore.fetchCart();
});

const handleUpdateCart = () => {
  cartStore.fetchCart();
};
</script>

<template>
  <div class="w-[1152px] border rounded-xl my-10 flex flex-col gap-1 p-5">
    <div class="flex justify-between">
      <h1 class="text-3xl font-bold">My Cart</h1>
      <h1>{{ cartStore.cartItems.length }} Items</h1>
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
    <div class="w-full flex gap-4 flex-col h-[400px] overflow-y-scroll">
      <div v-for="item in cartStore.cartItems" :key="item.id">
        <CartItem :cart="item" @update-cart="cartStore.fetchCart" />
      </div>
    </div>
    <hr class="w-full" />
    <div class="w-full flex justify-end">
      <div class="w-fit flex flex-col gap-4">
        <h1 class="text-xl font-bold">Total: ${{ cartStore.totalPrice }}</h1>
        <Checkout
          ref="checkoutRef"
          :cartItems="cartStore.cartItems"
          :totalPrice="cartStore.totalPrice"
          :showButton="true"
          @payment-successful="handleUpdateCart"
          @update-cart="handleUpdateCart"
        />
      </div>
    </div>
  </div>
</template>
