<template>
    <div class="bg-white shadow rounded-lg">
      <div class="px-4 py-5 border-b border-gray-200 sm:px-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900">
          Low Stock Items (5)
        </h3>
      </div>
      <div class="p-4 sm:p-6">
        <ul class="divide-y divide-gray-200">
          <li v-for="product in lowestStockProducts" :key="product.id" class="py-3 flex justify-between items-center">
            <div class="flex items-center">
              <div class="flex-shrink-0 h-10 w-10 rounded-md bg-gray-200 flex items-center justify-center">
                <svg v-if="!product.firstImageUrl" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <img v-else :src="product.firstImageUrl" alt="Product Image" class="h-10 w-10 rounded-md object-cover">
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-gray-900">{{ product.model }}</p>
                <p class="text-sm text-gray-500">Type: {{ product.productTypeName }}</p>
              </div>
            </div>
            <div class="flex items-center">
              <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" :class="getInventoryStatusClasses(product.stock)">
                {{ product.stock }} in stock
              </span>
              <button class="ml-4 px-3 py-1 text-xs text-white bg-indigo-600 hover:bg-indigo-700 rounded-md focus:outline-none">
                Restock
              </button>
            </div>
          </li>
        </ul>
      </div>
      <div class="bg-gray-50 px-4 py-4 sm:px-6 rounded-b-lg">
        <a href="#" class="text-sm font-medium text-indigo-600 hover:text-indigo-500">View inventory<span aria-hidden="true"> &rarr;</span></a>
      </div>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue';
  
  const props = defineProps({
    products: {
      type: Array,
      default: () => []
    }
  });
  
  const lowestStockProducts = computed(() => {
    return [...props.products]
      .sort((a, b) => a.stock - b.stock)
      .slice(0, 5);
  });
  
  const getInventoryStatusClasses = (stock) => {
    return {
      'bg-green-100 text-green-800': stock > 10,
      'bg-yellow-100 text-yellow-800': stock <= 10 && stock > 0,
      'bg-red-100 text-red-800': stock <= 5
    };
  };
  </script>