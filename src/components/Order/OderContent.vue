<template>
  <div class="p-5 max-w-7xl mx-auto">
    <h1 class="text-2xl font-bold mb-5 text-gray-800">Order Management</h1>
    
    <!-- Filters -->
    <div class="flex flex-wrap gap-4 mb-5">
      <div class="flex items-center gap-2">
        <label>Status:</label>
        <select v-model="statusFilter" class="p-2 border border-gray-300 rounded">
          <option value="">All</option>
          <option value="PENDING">Pending</option>
          <option value="PAID">Paid</option>
        </select>
      </div>
      <div class="flex items-center gap-2">
        <label>Process Status:</label>
        <select v-model="processFilter" class="p-2 border border-gray-300 rounded">
          <option value="">All</option>
          <option value="PROCESSING">Processing</option>
          <option value="null">Not Started</option>
        </select>
      </div>
      <div class="flex items-center gap-2">
        <input type="text" v-model="searchTerm" placeholder="Search order ID or hash..." class="p-2 border border-gray-300 rounded" />
      </div>
    </div>

    <!-- Orders Table -->
    <div class="overflow-x-auto h-[570px]">
      <table class="w-full border-collapse mt-4">
        <thead>
          <tr>
            <th @click="sortBy('id')" class="p-3 bg-gray-200 border-b border-gray-300 text-left cursor-pointer hover:bg-gray-300">ID</th>
            <th @click="sortBy('status')" class="p-3 bg-gray-200 border-b border-gray-300 text-left cursor-pointer hover:bg-gray-300">Status</th>
            <th @click="sortBy('processStatus')" class="p-3 bg-gray-200 border-b border-gray-300 text-left cursor-pointer hover:bg-gray-300">Process Status</th>
            <th @click="sortBy('totalAmount')" class="p-3 bg-gray-200 border-b border-gray-300 text-left cursor-pointer hover:bg-gray-300">Amount</th>
            <th @click="sortBy('createdAt')" class="p-3 bg-gray-200 border-b border-gray-300 text-left cursor-pointer hover:bg-gray-300">Date</th>
            <th @click="sortBy('invoiceSent')" class="p-3 bg-gray-200 border-b border-gray-300 text-left cursor-pointer hover:bg-gray-300">Invoice</th>
            <th class="p-3 bg-gray-200 border-b border-gray-300 text-left">Location</th>
            <th class="p-3 bg-gray-200 border-b border-gray-300 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in filteredOrders" :key="order.id" :class="{'bg-green-50': order.status === 'PAID'}" class="hover:bg-gray-50">
            <td class="p-3 border-b border-gray-300">{{ order.id }}</td>
            <td class="p-3 border-b border-gray-300">
              <span class="px-2 py-1 rounded text-sm font-medium" :class="order.status.toLowerCase()">
                {{ order.status }}
              </span>
            </td>
            <td class="p-3 border-b border-gray-300">
              <span v-if="order.processStatus" class="px-2 py-1 rounded text-sm font-medium bg-blue-100 text-blue-800">
                {{ order.processStatus }}
              </span>
              <span v-else class="px-2 py-1 rounded text-sm font-medium bg-gray-100 text-gray-600">Not Started</span>
            </td>
            <td class="p-3 border-b border-gray-300">${{ order.totalAmount.toFixed(2) }}</td>
            <td class="p-3 border-b border-gray-300">{{ formatDate(order.createdAt) }}</td>
            <td class="p-3 border-b border-gray-300">
              <span :class="order.invoiceSent ? 'text-green-600' : 'text-gray-600'">
                {{ order.invoiceSent ? 'Sent' : 'Not Sent' }}
              </span>
            </td>
            <td class="p-3 border-b border-gray-300">
              <span v-if="order.location" class="text-blue-600 cursor-pointer underline" @click="showLocationDetails(order)">
                View Location
              </span>
              <span v-else>No Location</span>
            </td>
            <td class="p-3 border-b border-gray-300">
              <button @click="viewOrderDetails(order)" class="px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">View & Edit</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <Pagination 
      :current-page="currentPage" 
      :total-pages="totalPages" 
      @page-change="handlePageChange" 
    />

    <!-- Order Details Modal -->
    <div v-if="selectedOrder" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
        <!-- Modal Header -->
        <div class="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center sticky top-0">
          <h2 class="text-xl font-bold text-gray-800">Order #{{ selectedOrder.id }}</h2>
          <button 
            @click="selectedOrder = null" 
            class="rounded-full h-8 w-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300 transition-colors duration-200"
            aria-label="Close modal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
        
        <!-- Modal Content -->
        <div class="p-6 space-y-6">
          <!-- Order Summary -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div>
              <p class="text-sm text-gray-500">Hash</p>
              <p class="font-medium text-gray-800">{{ selectedOrder.md5Hash }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Status</p>
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium" 
                :class="selectedOrder.status === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'">
                {{ selectedOrder.status }}
              </span>
            </div>
            <div>
              <p class="text-sm text-gray-500">Total Amount</p>
              <p class="font-medium text-gray-800">${{ selectedOrder.totalAmount.toFixed(2) }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Created At</p>
              <p class="font-medium text-gray-800">{{ formatDate(selectedOrder.createdAt) }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Invoice</p>
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                :class="selectedOrder.invoiceSent ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'">
                {{ selectedOrder.invoiceSent ? 'Sent' : 'Not Sent' }}
              </span>
            </div>
            <div>
              <p class="text-sm text-gray-500">Process Status</p>
              <div class="flex items-center gap-2 mt-1">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="{
                    'bg-blue-100 text-blue-800': selectedOrder.processStatus === 'PROCESSING',
                    'bg-purple-100 text-purple-800': selectedOrder.processStatus === 'DELIVERY',
                    'bg-green-100 text-green-800': selectedOrder.processStatus === 'DELIVERED',
                    'bg-gray-100 text-gray-800': !selectedOrder.processStatus
                  }">
                  {{ selectedOrder.processStatus || 'Not Started' }}
                </span>
                <select 
                  v-if="selectedOrder.status === 'PAID'" 
                  v-model="selectedProcessStatus" 
                  @change="handleProcessStatusChange" 
                  class="p-1.5 text-sm border border-gray-300 rounded"
                >
                  <option value="">Update status</option>
                  <option v-for="status in validProcessStatuses" :key="status" :value="status">
                    {{ status }}
                  </option>
                </select>
              </div>
            </div>
          </div>
          
          <!-- Delivery Location -->
          <div v-if="selectedOrder.location" class="border border-gray-200 rounded-lg p-4">
            <h3 class="text-lg font-medium text-gray-800 mb-3">Delivery Location</h3>
            <div class="space-y-2">
              <p><span class="text-gray-500">Address:</span> {{ selectedOrder.location.locationAddress }}</p>
              <p><span class="text-gray-500">Coordinates:</span> {{ selectedOrder.location.latitude }}, {{ selectedOrder.location.longitude }}</p>
              <a 
                :href="`https://www.google.com/maps?q=${selectedOrder.location.latitude},${selectedOrder.location.longitude}`" 
                target="_blank"
                class="inline-flex items-center mt-2 text-blue-600 hover:text-blue-800"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                View on Google Maps
              </a>
            </div>
          </div>
          
          <!-- Order Items -->
          <div class="border border-gray-200 rounded-lg overflow-hidden">
            <div class="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <h3 class="text-lg font-medium text-gray-800">Order Items</h3>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full border-collapse">
                <thead>
                  <tr class="bg-gray-50">
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subtotal</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="item in selectedOrder.orderItems" :key="item.id" class="hover:bg-gray-50">
                    <td class="px-4 py-3 whitespace-nowrap">{{ item.id }}</td>
                    <td class="px-4 py-3 whitespace-nowrap">{{ item.quantity }}</td>
                    <td class="px-4 py-3 whitespace-nowrap">${{ item.price.toFixed(2) }}</td>
                    <td class="px-4 py-3 whitespace-nowrap font-medium">${{ (item.quantity * item.price).toFixed(2) }}</td>
                  </tr>
                </tbody>
                <tfoot class="bg-gray-50">
                  <tr>
                    <td colspan="3" class="px-4 py-3 text-right font-medium">Total:</td>
                    <td class="px-4 py-3 font-bold">${{ selectedOrder.totalAmount.toFixed(2) }}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Location Modal -->
    <div 
      v-if="selectedLocation" 
      class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      @click="selectedLocation = null"
    >
      <div 
        class="bg-white p-6 rounded-lg max-w-lg w-full"
        @click.stop
      >
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold">Delivery Location</h2>
          <button 
            @click="selectedLocation = null" 
            class="text-gray-500 hover:text-gray-700 rounded-full p-1 hover:bg-gray-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
        
        <div class="space-y-3">
          <p><strong>Address:</strong> {{ selectedLocation.locationAddress }}</p>
          <p><strong>Coordinates:</strong> {{ selectedLocation.latitude }}, {{ selectedLocation.longitude }}</p>
          <div class="mt-4">
            <a 
              :href="`https://www.google.com/maps?q=${selectedLocation.latitude},${selectedLocation.longitude}`" 
              target="_blank"
              class="inline-flex items-center text-blue-600 hover:text-blue-800"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              View on Google Maps
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted, computed} from 'vue';
import Cookies from 'universal-cookie';
import Pagination from '../Pagination.vue';

const apiUrl = import.meta.env.VITE_APP_API_URL;
const cookies = new Cookies();
const token = cookies.get("auth_token");

const orders = ref([]);
const selectedOrder = ref(null);
const selectedLocation = ref(null);
const statusFilter = ref('');
const processFilter = ref('');
const searchTerm = ref('');
const sortKey = ref('id');
const sortDirection = ref('desc');
const validProcessStatuses = ['PROCESSING', 'DELIVERY', 'DELIVERED'];
const selectedProcessStatus = ref('');

// Add pagination state
const currentPage = ref(1);
const totalPages = ref(1);
const pageSize = ref(9);
const totalItems = ref(0);

const fetchOrder = async (page = 0, size = 8) => {
    if (!token || token.split(".").length !== 3) {
        console.error('Invalid token');
        return;
    }

    try {
        const response = await fetch(`${apiUrl}/order?page=${page}&size=${size}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const result = await response.json();
        console.log('Order data:', result);   
        
        // Extract orders from the correct location in the response
        orders.value = result.data.content || [];
        
        // Update pagination information from the correct fields
        if (result.data) {
            totalItems.value = result.data.totalElements || 0;
            totalPages.value = result.data.totalPages || 1;
            currentPage.value = result.data.number + 1; // Converting from 0-based to 1-based
        }
        
        return result;
    } catch (error) {
        console.error('Error fetching order:', error);
    }
}

// Handle page change events from pagination component
const handlePageChange = (page) => {
    // Convert from 1-based (UI) to 0-based (API)
    fetchOrder(page - 1, pageSize.value);
}

const updateProcessStatus = async (orderId, newProcessStatus) => {
    try {
        const response = await fetch(`${apiUrl}/order/process-status/${orderId}?processStatus=${newProcessStatus}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            }
            // No body needed as the process status is now in the URL path
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Server responded with ${response.status}: ${errorText}`);
            throw new Error(`Failed to update process status: ${response.status}`);
        }
    } catch (error) {
        console.error('Error updating process status:', error);
        alert('Failed to update process status');
    }
}

const handleProcessStatusChange = async () => {
  if (!selectedProcessStatus.value || !selectedOrder.value) return;
  
  try {
    await updateProcessStatus(selectedOrder.value.id, selectedProcessStatus.value);
    
    // Update the selected order's process status in the UI
    selectedOrder.value.processStatus = selectedProcessStatus.value;
    
    // Reset the select dropdown
    selectedProcessStatus.value = '';
  } catch (error) {
    console.error('Failed to update process status:', error);
  }
};

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
}

const viewOrderDetails = (order) => {
    selectedOrder.value = order;
}

const showLocationDetails = (order) => {
    if (order.location) {
        selectedLocation.value = order.location;
    }
}

const sortBy = (key) => {
    if (sortKey.value === key) {
        sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
    } else {
        sortKey.value = key;
        sortDirection.value = 'asc';
    }
}

const filteredOrders = computed(() => {
    let result = [...orders.value];
    
    // Apply status filter
    if (statusFilter.value) {
        result = result.filter(order => order.status === statusFilter.value);
    }
    
    // Apply process status filter
    if (processFilter.value) {
        if (processFilter.value === 'null') {
            result = result.filter(order => !order.processStatus);
        } else {
            result = result.filter(order => order.processStatus === processFilter.value);
        }
    }
    
    // Apply search filter
    if (searchTerm.value) {
        const search = searchTerm.value.toLowerCase();
        result = result.filter(order => 
            order.id.toString().includes(search) || 
            order.md5Hash.toLowerCase().includes(search)
        );
    }
    
    // Apply sorting
    result.sort((a, b) => {
        let valueA = a[sortKey.value];
        let valueB = b[sortKey.value];
        
        // Handle null values
        if (valueA === null) return sortDirection.value === 'asc' ? -1 : 1;
        if (valueB === null) return sortDirection.value === 'asc' ? 1 : -1;
        
        // Convert date strings to Date objects for proper comparison
        if (sortKey.value === 'createdAt') {
            valueA = new Date(valueA);
            valueB = new Date(valueB);
        }
        
        if (valueA < valueB) return sortDirection.value === 'asc' ? -1 : 1;
        if (valueA > valueB) return sortDirection.value === 'asc' ? 1 : -1;
        return 0;
    });
    
    return result;
});

onMounted(() => {
    fetchOrder(0, pageSize.value);
});
</script>
