<script setup>
import { ref } from 'vue';
import { useCartStore } from '@/store/cartStore';
import RemoveConfirmDialog from './RemoveConfirmDialog.vue';
import { toast } from 'vue3-toastify';

const props = defineProps({
  item: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['update-quantity', 'remove-item']);
const cartStore = useCartStore();
const showRemoveDialog = ref(false);

const updateQuantity = async (delta) => {
  const newQuantity = props.item.quantity + delta;
  
  // If trying to decrease below 1, show confirmation dialog
  if (newQuantity < 1) {
    showRemoveDialog.value = true;
    return;
  }
  
  let result;
  if (delta > 0) {
    // Increasing quantity - use phone.id instead of item.id
    result = await cartStore.increaseQuantity(props.item.phone.id);
  } else {
    // Decreasing quantity - use phone.id instead of item.id
    result = await cartStore.decreaseQuantity(props.item.phone.id);
  }
  
  if (result.success) {
    // Still emit for any parent components that might need to know
    emit('update-quantity', props.item.phone.id, newQuantity);
  }
};

const removeItem = () => {
  showRemoveDialog.value = true;
};

const confirmRemove = async () => {
  try {
    // Use phone.id instead of item.id
    await cartStore.removeItemFromCart(props.item.phone.id);
    showRemoveDialog.value = false;
    // Still emit for any parent components that might need to know
    emit('remove-item', props.item.phone.id);
    toast.success('Item removed from cart successfully!');
  } catch (error) {
    console.error("Error removing item:", error);
  }
};

const cancelRemove = () => {
  showRemoveDialog.value = false;
};
</script>

<template>
  <div class="flex justify-between py-2 px-3 border-b last:border-b-0">
    <div class="flex items-center gap-3">
      <img :src="item.phone.firstImageUrl" class="w-14 h-14 object-cover rounded-md shadow-sm" alt="Product image" />
      <div>
        <p class="font-medium">{{ item.phone.model }}</p>
        <p class="text-sm text-gray-500">${{ item.phone.price }}</p>
        <div class="flex items-center gap-2 mt-1">
          <button 
            @click="updateQuantity(-1)" 
            class="h-6 w-6 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
            :disabled="item.quantity <= 1">
            <span>-</span>
          </button>
          <span class="text-sm font-medium">{{ item.quantity }}</span>
          <button 
            @click="updateQuantity(1)" 
            class="h-6 w-6 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300">
            <span>+</span>
          </button>
          <button 
            @click="removeItem" 
            class="ml-2 text-xs text-red-600 hover:text-red-800">
            Remove
          </button>
        </div>
      </div>
    </div>
    <p class="font-medium">${{ (item.phone.price * item.quantity).toFixed(2) }}</p>
    
    <RemoveConfirmDialog 
      :show="showRemoveDialog" 
      :itemName="item.phone.model"
      @confirm="confirmRemove"
      @cancel="cancelRemove" 
    />
  </div>
</template>