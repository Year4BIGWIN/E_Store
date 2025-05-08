<template>
    <div class="bg-white shadow rounded-lg">
      <div class="px-4 py-5 border-b border-gray-200 sm:px-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900">
          Low Stock Items
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
              <div class="mx-4 w-[225px]">
                <p class="text-sm font-medium line-clamp-1 text-gray-900">{{ product.model }}</p>
                <p class="text-sm text-gray-500">Type: {{ product.productTypeName }}</p>
              </div>
            </div>
            <div class="w-full flex justify-end items-center">
              <!-- Display editable input when restocking -->
              <div v-if="restockingProductId === product.id" class="flex items-center">
                <input 
                  type="number" 
                  v-model.number="newStockQuantity" 
                  min="1"
                  class="w-16 px-2 py-1 text-xs border rounded focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Qty"
                />
                <button 
                  @click="saveRestock(product.id)" 
                  class="ml-1 px-2 py-1 text-xs text-white bg-green-600 hover:bg-green-700 rounded-md focus:outline-none"
                  :disabled="isRestocking"
                >
                  {{ isRestocking ? 'Saving...' : 'Save' }}
                </button>
                <button 
                  @click="cancelRestock()" 
                  class="ml-1 px-2 py-1 text-xs text-gray-600 bg-gray-200 hover:bg-gray-300 rounded-md focus:outline-none"
                >
                  Cancel
                </button>
              </div>
              
              <!-- Display normal span when not restocking -->
              <div v-else class="flex items-center">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" :class="getInventoryStatusClasses(product.stock)">
                  {{ product.stock }} in stock (ID: {{ product.id }})
                </span>
                <button 
                  @click="showRestockInput(product.id, product.stock)" 
                  class="ml-4 px-3 py-1 text-xs text-white bg-indigo-600 hover:bg-indigo-700 rounded-md focus:outline-none"
                >
                  Restock
                </button>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div class="bg-gray-50 px-4 py-4 sm:px-6 rounded-b-lg">
        <a href="/product" class="text-sm font-medium text-indigo-600 hover:text-indigo-500">View inventory<span aria-hidden="true"> &rarr;</span></a>
      </div>
    </div>
  </template>
  
  <script setup>
  import { computed, ref } from 'vue';
  import Cookies from 'universal-cookie';
  import { toast } from 'vue3-toastify';
  import useAdminApi from '../../composable/dashboardApi';

  const adminApi = useAdminApi(); // Initialize admin API for inventory refresh
  const apiUrl = import.meta.env.VITE_APP_API_URL;
  const cookies = new Cookies();
  const token = cookies.get("auth_token");
  const props = defineProps({
    products: {
      type: Array,
      default: () => []
    }
  });

  // Added state for restocking functionality
  const restockingProductId = ref(null);
  const newStockQuantity = ref(0);
  const isRestocking = ref(false);

  // Show restock input for a specific product
  const showRestockInput = (productId, currentStock) => {
    restockingProductId.value = productId;
    newStockQuantity.value = currentStock;
  };

  // Cancel restocking
  const cancelRestock = () => {
    restockingProductId.value = null;
    newStockQuantity.value = 0;
  };

  // Save the new stock quantity
  const saveRestock = async (productId) => {
    if (newStockQuantity.value <= 0) {
      toast.error('Please enter a valid quantity');
      return;
    }
    
    isRestocking.value = true;
    
    try {
      await restockItem(productId, newStockQuantity.value);
      // Use toast notification instead of alert
      toast.success('Stock updated successfully');
      // Reset the restock state
      cancelRestock();
      // Refresh inventory data immediately
      await refreshInventory();
      // Emit an event to notify parent component to refresh data
      emit('inventory-updated');
    } catch (error) {
      toast.error('Failed to update stock: ' + (error.message || 'Unknown error'));
      console.error(error);
    } finally {
      isRestocking.value = false;
    }
  };

  // New function to refresh inventory data
  const refreshInventory = async () => {
    try {
      const response = await adminApi.fetchInventory();
      // Emit event with refreshed data
      if (response && response.data) {
        emit('inventory-refreshed', response.data);
        return response.data;
      }
    } catch (error) {
      console.error('Error refreshing inventory:', error);
      toast.error('Failed to refresh inventory data');
    }
    return null;
  };

  const restockItem = async (productId, newQuantity) => {
    try {
      await fetch(`${apiUrl}/product/restock/${productId}?quantity=${newQuantity}`, {
        method: 'put',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        }
      });
    } catch (error) {
      console.error('Error restocking item:', error);
      throw error; 
    }
  };

  const lowestStockProducts = computed(() => {
    return [...props.products]
      .sort((a, b) => a.stock - b.stock)
      .slice(0, 5);
  });
  
  const getInventoryStatusClasses = (stock) => {
    return {
      'bg-green-100 text-green-800': stock >= 10,
      'bg-yellow-100 text-yellow-800': stock <= 10 && stock > 5,
      'bg-red-100 text-red-800': stock <= 5
    };
  };

  const emit = defineEmits(['inventory-updated', 'inventory-refreshed']);
  </script>