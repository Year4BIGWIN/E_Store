<script setup>
import { defineProps, defineEmits } from 'vue';
import DialogInfo from "@/components/DialogInfo.vue";
import Map from "@/components/Location/Map.vue";
import CartItem from "./CartItem.vue";

const props = defineProps({
  show: Boolean,
  cartItems: {
    type: Array,
    required: true
  },
  totalPrice: {
    type: Number,
    required: true
  },
  userAddress: String
});

const emit = defineEmits(['close', 'proceed-payment', 'update-quantity', 'remove-item']);
</script>

<template>
  <Teleport to="body">
    <DialogInfo
      title="Checkout"
      :show="show"
      @close="emit('close')"
      class="checkout-dialog"
    >
      <div class="flex flex-col gap-3 max-h-[80vh]">
        <h2 class="text-lg font-medium">Order Summary</h2>
        
        <div class="max-h-[30vh] overflow-y-auto border rounded-lg">
          <CartItem 
            v-for="item in cartItems" 
            :key="item.id" 
            :item="item" 
            @update-quantity="(id, qty) => emit('update-quantity', id, qty)"
            @remove-item="(id) => emit('remove-item', id)"
          />
        </div>
        
        <div class="py-2 border-t border-b">
          <div class="flex justify-between text-lg font-bold">
            <span>Total:</span>
            <span>${{ totalPrice.toFixed(2) }}</span>
          </div>
        </div>
        
        <div class="flex flex-col gap-2">
          <details class="bg-white rounded-lg shadow-sm border" open>
            <summary class="p-4 font-medium flex items-center cursor-pointer hover:bg-gray-50">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 10-16 0c0 3 2.7 7 8 11.7z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              Shipping Address
            </summary>
            <div class="p-3 pt-0">
              <div class="rounded-lg overflow-hidden border">
                <Map class="h-[180px]"></Map>
              </div>
              <div class="mt-3 p-2 bg-gray-50 rounded-md">
                <p class="text-sm text-gray-700">
                  Your order will be delivered to:
                </p>
                <p class="font-medium">{{ userAddress || 'Please confirm your shipping address' }}</p>
              </div>
            </div>
          </details>
          
          <div class="flex justify-end gap-3 mt-2 sticky bottom-0 bg-white py-2">
            <button 
              @click="emit('close')" 
              class="px-4 py-2 border rounded-lg hover:bg-gray-100">
              Cancel
            </button>
            <button 
              @click="emit('proceed-payment')"
              class="px-4 py-2 bg-black text-white rounded-lg hover:opacity-90">
              Proceed to Payment
            </button>
          </div>
        </div>
      </div>
    </DialogInfo>
  </Teleport>
</template>

<style scoped>
.checkout-dialog {
  max-height: 100vh;
  overflow: hidden;
}

details summary::-webkit-details-marker {
  display: none;
}

details summary::after {
  content: '▼';
  float: right;
  margin-left: 10px;
  font-size: 0.8em;
  color: #666;
  transform: rotate(0);
  transition: transform 0.2s;
}

details[open] summary::after {
  transform: rotate(180deg);
}
</style>