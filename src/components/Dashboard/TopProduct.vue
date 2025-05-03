<template>
  <div class="bg-white shadow rounded-lg">
    <div class="px-4 py-5 border-b border-gray-200 sm:px-6">
      <h3 class="text-lg leading-6 font-medium text-gray-900">
        Top Products
      </h3>
    </div>
    <div class="p-4 sm:p-6">
      <ul class="divide-y divide-gray-200">
        <li v-for="product in products" :key="product.id" class="py-3 flex justify-between items-center">
          <div class="flex items-center">
            <div class="flex-shrink-0 h-10 w-10 rounded-md bg-gray-200 flex items-center justify-center">
              <svg v-if="!product.image" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <img v-else :src="product.image" alt="Product Image" class="h-10 w-10 rounded-md object-cover">
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-gray-900">{{ product.model }}</p>
              <p class="text-sm text-gray-500">{{ product.type }}</p>
            </div>
          </div>
          <div class="flex flex-col items-end">
            <p class="text-sm font-medium text-gray-900">${{ formatCurrency(product.price) }}</p>
            <p class="text-sm text-gray-500">{{ product.quantitySold }} sold</p>
          </div>
        </li>
      </ul>
    </div>
    <div class="bg-gray-50 px-4 py-4 sm:px-6 rounded-b-lg">
      <a href="/product" class="text-sm font-medium text-indigo-600 hover:text-indigo-500">View all products<span aria-hidden="true"> &rarr;</span></a>
    </div>
  </div>
</template>

<script setup>
defineProps({
  products: {
    type: Array,
    default: () => []
  }
});

const formatCurrency = (value) => {
  if (value === null || value === undefined) {
    return '0.00';
  }
  
  const numValue = typeof value === 'number' ? value : Number(value);
  
  if (isNaN(numValue)) {
    return '0.00';
  }
  
  return numValue.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
};
</script>