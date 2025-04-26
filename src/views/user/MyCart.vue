<script setup>
import { ref, onMounted } from "vue";
import { useCartStore } from "@/store/cartStore";
import CartItem from "@/components/CartItem.vue";
import DialogInfo from "@/components/DialogInfo.vue";
import Map from "@/components/Map.vue";

const cartStore = useCartStore();
const showCheckoutDialog = ref(false);

onMounted(() => {
  cartStore.fetchCart(); // Fetch cart data on mount
});
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
        <button 
          @click="showCheckoutDialog = true" 
          class="hover:brightness-90 text-white bg-black py-1 px-3 border-2 rounded-xl">
          CheckOut
        </button>
      </div>
    </div>
    
    <!-- Checkout Dialog -->
    <DialogInfo
      title="Checkout"
      :show="showCheckoutDialog"
      @close="showCheckoutDialog = false"
    >
      <div class="flex flex-col gap-4">
        <h2 class="text-lg font-medium">Order Summary</h2>
        
        <div class="max-h-60 overflow-y-auto">
          <div v-for="item in cartStore.cartItems" :key="item.id" class="flex justify-between py-2 border-b">
            <div class="flex items-center gap-2">
              <img :src="item.phone.firstImageUrl" class="w-12 h-12 object-cover rounded" alt="Product image" />
              <div>
                <p class="font-medium">{{ item.phone.model }}</p>
                <p class="text-sm text-gray-500">Qty: {{ item.quantity }}</p>
              </div>
            </div>
            <p class="font-medium">${{ item.phone.price }}</p>
          </div>
        </div>
        
        <div class="pt-2 border-t">
          <div class="flex justify-between text-lg font-bold">
            <span>Total:</span>
            <span>${{ cartStore.totalPrice }}</span>
          </div>
        </div>
        
        <div class="flex flex-col gap-3 mt-2">
          <h3 class="font-medium">Shipping Address</h3>
          <div class="h-[200px] bg-gray-100 rounded-lg p-3">
            <Map></Map>
          </div>
          
          <div class="flex justify-end gap-3 mt-2">
            <button 
              @click="showCheckoutDialog = false" 
              class="px-4 py-2 border rounded-lg hover:bg-gray-100">
              Cancel
            </button>
            <button 
              class="px-4 py-2 bg-black text-white rounded-lg hover:opacity-90">
              Proceed to Payment
            </button>
          </div>
        </div>
      </div>
    </DialogInfo>
  </div>
</template>