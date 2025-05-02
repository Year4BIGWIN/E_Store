<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  item: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['update-quantity', 'remove-item']);

const updateQuantity = (delta) => {
  emit('update-quantity', props.item.id, props.item.quantity + delta);
};

const removeItem = () => {
  emit('remove-item', props.item.id);
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
  </div>
</template>