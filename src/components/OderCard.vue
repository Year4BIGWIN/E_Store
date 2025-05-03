<template>
  <div class="order-card bg-white p-3 sm:p-5 rounded-lg shadow-sm mb-4 hover:shadow-md transition-all border border-gray-100">
    <!-- Header with Order ID and Date -->
    <div class="flex justify-between items-center mb-3 border-b pb-2">
      <div class="flex items-center gap-2">
        <i class="fas fa-shopping-bag text-gray-500"></i>
        <span class="font-bold text-gray-800 text-sm sm:text-base">Order #{{ order.id }}</span>
      </div>
      <div class="text-xs sm:text-sm text-gray-500">
        {{ formatDate(order.createdAt || new Date()) }}
      </div>
    </div>
    
    <!-- Status Badge -->
    <div class="mb-4 flex items-center gap-2 flex-wrap">
      <span 
        :class="{
          'bg-green-100 text-green-800': order.status === 'COMPLETED' || order.status === 'PAID',
          'bg-yellow-100 text-yellow-800': order.status === 'PENDING',
          'bg-blue-100 text-blue-800': order.status === 'PROCESSING' || order.processStatus === 'PROCESSING',
          'bg-red-100 text-red-800': order.status === 'CANCELLED'
        }"
        class="px-2 sm:px-3 py-1 rounded-full text-xs font-medium inline-block"
      >
        {{ order.status }}
      </span>
      
      <!-- Delivery Status Badge - Show Only when Paid -->
      <span v-if="order.status === 'PAID'" 
        :class="{
          'bg-purple-100 text-purple-800': order.processStatus === 'PROCESSING',
          'bg-blue-100 text-blue-800': order.processStatus === 'DELIVER',
          'bg-green-100 text-green-800': order.processStatus === 'DELIVERED',
          'bg-gray-100 text-gray-800': !order.processStatus
        }"
        class="px-2 sm:px-3 py-1 rounded-full text-xs font-medium inline-block"
      >
        <i class="fas fa-truck mr-1"></i>
        {{ order.processStatus || 'Preparing' }}
      </span>
    </div>
    
    <!-- Order Items List with Overflow -->
    <div class="flex flex-col space-y-2 max-h-60 overflow-y-auto pr-1">
      <!-- Display all items -->
      <div 
        v-for="(item, index) in order.orderItems" 
        :key="index"
        class="flex items-center space-x-2 bg-gray-50 p-2 sm:p-3 rounded-md"
      >
        <div class="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded-md flex-shrink-0">
          <img v-if="item.firstImageUrl" :src="item.firstImageUrl" class="w-full h-full object-cover rounded-md" alt="" />
        </div>
        <div class="flex-grow overflow-hidden">
          <p class="font-medium text-gray-800 text-sm sm:text-base truncate">{{ item.productName || 'N/A' }}</p>
          <div class="flex justify-between mt-1">
            <span class="text-xs sm:text-sm text-gray-600">${{ item.price?.toFixed(2) || '0.00' }} × {{ item.quantity || 0 }}</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Footer with Total -->
    <div class="mt-4 pt-3 border-t flex justify-between items-center">
      <span class="font-medium text-gray-700">Order Total</span>
      <span class="text-base sm:text-lg font-bold text-gray-900">${{ order.totalAmount?.toFixed(2) || '0.00' }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  order: {
    type: Object,
    required: true,
    default: () => ({
      id: '',
      status: '',
      processStatus: '',
      totalAmount: 0,
      orderItems: [],
      createdAt: new Date()
    })
  }
});

const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};
</script>