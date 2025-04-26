<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Main Content -->
    <main class="py-6 sm:py-10">
      <!-- Page header -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 class="text-2xl font-semibold text-gray-900">Dashboard</h1>
      </div>

      <!-- Stats Overview -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="px-4 py-5 sm:p-6">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
                <dd class="mt-1 text-3xl font-semibold text-gray-900">${{ formatCurrency(statistics.totalRevenue) }}</dd>
                <dd class="mt-2 flex items-center text-sm font-medium" :class="statistics.revenueChange >= 0 ? 'text-green-600' : 'text-red-600'">
                  <span v-if="statistics.revenueChange >= 0">
                    <svg class="self-center flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clip-rule="evenodd" />
                    </svg>
                  </span>
                  <span v-else>
                    <svg class="self-center flex-shrink-0 h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1V9a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586 3.707 5.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" clip-rule="evenodd" />
                    </svg>
                  </span>
                  <span class="ml-1">{{ Math.abs(statistics.revenueChange) }}% from last month</span>
                </dd>
              </dl>
            </div>
          </div>

          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="px-4 py-5 sm:p-6">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Orders</dt>
                <dd class="mt-1 text-3xl font-semibold text-gray-900">{{ statistics.totalOrders }}</dd>
                <dd class="mt-2 flex items-center text-sm font-medium" :class="statistics.ordersChange >= 0 ? 'text-green-600' : 'text-red-600'">
                  <span v-if="statistics.ordersChange >= 0">
                    <svg class="self-center flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clip-rule="evenodd" />
                    </svg>
                  </span>
                  <span v-else>
                    <svg class="self-center flex-shrink-0 h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1V9a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586 3.707 5.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" clip-rule="evenodd" />
                    </svg>
                  </span>
                  <span class="ml-1">{{ Math.abs(statistics.ordersChange) }}% from last month</span>
                </dd>
              </dl>
            </div>
          </div>

          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="px-4 py-5 sm:p-6">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Customers</dt>
                <dd class="mt-1 text-3xl font-semibold text-gray-900">{{ statistics.totalCustomers }}</dd>
                <dd class="mt-2 flex items-center text-sm font-medium" :class="statistics.customersChange >= 0 ? 'text-green-600' : 'text-red-600'">
                  <span v-if="statistics.customersChange >= 0">
                    <svg class="self-center flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clip-rule="evenodd" />
                    </svg>
                  </span>
                  <span v-else>
                    <svg class="self-center flex-shrink-0 h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1V9a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586 3.707 5.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" clip-rule="evenodd" />
                    </svg>
                  </span>
                  <span class="ml-1">{{ Math.abs(statistics.customersChange) }}% from last month</span>
                </dd>
              </dl>
            </div>
          </div>

          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="px-4 py-5 sm:p-6">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Average Order Value</dt>
                <dd class="mt-1 text-3xl font-semibold text-gray-900">${{ formatCurrency(statistics.averageOrderValue) }}</dd>
                <dd class="mt-2 flex items-center text-sm font-medium" :class="statistics.aovChange >= 0 ? 'text-green-600' : 'text-red-600'">
                  <span v-if="statistics.aovChange >= 0">
                    <svg class="self-center flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clip-rule="evenodd" />
                    </svg>
                  </span>
                  <span v-else>
                    <svg class="self-center flex-shrink-0 h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1V9a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586 3.707 5.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" clip-rule="evenodd" />
                    </svg>
                  </span>
                  <span class="ml-1">{{ Math.abs(statistics.aovChange) }}% from last month</span>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Orders and Sales Performance -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div class="grid grid-cols-1 gap-5 lg:grid-cols-2">
          
          <!-- Recent Orders -->
          <div class="bg-white shadow rounded-lg">
            <div class="px-4 py-5 border-b border-gray-200 sm:px-6">
              <h3 class="text-lg leading-6 font-medium text-gray-900">
                Recent Orders
              </h3>
            </div>
            <div class="px-4 sm:px-6 py-3">
              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                    <tr>
                      <th scope="col" class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order ID
                      </th>
                      <th scope="col" class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th scope="col" class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th scope="col" class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="order in recentOrders" :key="order.id">
                      <td class="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{{ order.orderId }}
                      </td>
                      <td class="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                        {{ order.customerName }}
                      </td>
                      <td class="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                        {{ formatDate(order.createdAt) }}
                      </td>
                      <td class="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${{ formatCurrency(order.totalAmount) }}
                      </td>
                      <td class="px-3 py-4 whitespace-nowrap">
                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" :class="getStatusClasses(order.status)">
                          {{ order.status }}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div class="bg-gray-50 px-4 py-4 sm:px-6 rounded-b-lg">
              <a href="#" class="text-sm font-medium text-indigo-600 hover:text-indigo-500">View all orders<span aria-hidden="true"> &rarr;</span></a>
            </div>
          </div>

          <!-- Sales Performance -->
          <div class="bg-white shadow rounded-lg">
            <div class="px-4 py-5 border-b border-gray-200 sm:px-6">
              <h3 class="text-lg leading-6 font-medium text-gray-900">
                Sales Performance
              </h3>
            </div>
            <div class="p-4 sm:p-6 h-72">
              <!-- This is a placeholder for a chart component -->
              <div class="w-full h-full flex items-center justify-center bg-gray-50 rounded-lg">
                <div class="text-center">
                  <p class="text-gray-500">Sales Chart Visualization</p>
                  <p class="text-sm text-gray-400 mt-1">Data visualization would render here</p>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-4 py-4 sm:px-6 rounded-b-lg">
              <div class="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p class="text-xs text-gray-500">DAILY SALES</p>
                  <p class="text-lg font-semibold">${{ formatCurrency(salesPerformance.daily) }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500">WEEKLY SALES</p>
                  <p class="text-lg font-semibold">${{ formatCurrency(salesPerformance.weekly) }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500">MONTHLY SALES</p>
                  <p class="text-lg font-semibold">${{ formatCurrency(salesPerformance.monthly) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Top Products and Inventory Status -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div class="grid grid-cols-1 gap-5 lg:grid-cols-2">
          
          <!-- Top Products -->
          <div class="bg-white shadow rounded-lg">
            <div class="px-4 py-5 border-b border-gray-200 sm:px-6">
              <h3 class="text-lg leading-6 font-medium text-gray-900">
                Top Products
              </h3>
            </div>
            <div class="p-4 sm:p-6">
              <ul class="divide-y divide-gray-200">
                <li v-for="product in topProducts" :key="product.id" class="py-3 flex justify-between items-center">
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
              <a href="#" class="text-sm font-medium text-indigo-600 hover:text-indigo-500">View all products<span aria-hidden="true"> &rarr;</span></a>
            </div>
          </div>

          <!-- Inventory Status -->
          <div class="bg-white shadow rounded-lg">
            <div class="px-4 py-5 border-b border-gray-200 sm:px-6">
              <h3 class="text-lg leading-6 font-medium text-gray-900">
                Inventory Status
              </h3>
            </div>
            <div class="p-4 sm:p-6">
              <ul class="divide-y divide-gray-200">
                <li v-for="product in lowInventoryProducts" :key="product.id" class="py-3 flex justify-between items-center">
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
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const apiUrl = import.meta.env.VITE_APP_API_URL;

// Dashboard data
const statistics = ref({
  totalRevenue: 0,
  revenueChange: 8.2,
  totalOrders: 0,
  ordersChange: 12.5,
  totalCustomers: 0,
  customersChange: 5.8,
  averageOrderValue: 0,
  aovChange: -2.3
});

const recentOrders = ref([]);

const salesPerformance = ref({
  daily: 3245.87,
  weekly: 24563.21,
  monthly: 78945.23
});

const topProducts = ref([]);
const lowInventoryProducts = ref([]);

// Helper function to format currency
const formatCurrency = (value) => {
  return value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  
  // Check if date is valid
  if (isNaN(date.getTime())) return dateString;
  
  // Format the date as MM/DD/YYYY
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
};
// Helper function to get status classes
const getStatusClasses = (status) => {
  return {
    'bg-green-100 text-green-800': status === 'PAID',
    'bg-yellow-100 text-yellow-800': status === 'PENDING',
    'bg-blue-100 text-blue-800': status === 'Shipped',
    'bg-red-100 text-red-800': status === 'Cancelled'
  };
};

const getInventoryStatusClasses = (stock) => {
  return {
    'bg-green-100 text-green-800': stock > 10,
    'bg-yellow-100 text-yellow-800': stock <= 10 && stock > 0,
    'bg-red-100 text-red-800': stock > 3
  };
};


// Fetch total orders from API
const fetchTotalOrders = async () => {
  try {
    const response = await fetch(`${apiUrl}/order/total-order`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const total = await response.json();
    
    // Update the statistics with the data from API
    if (total && total.data) {
      statistics.value.totalOrders = total.data;
    }
    
    return total;
  } catch (error) {
    console.error('Error fetching total orders:', error);
    // Set a fallback value in case of error
    statistics.value.totalOrders = 0;
  }
};

const FetchTotalRevenue = async () => {
  try {
    const response = await fetch(`${apiUrl}/order/total-revenue`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const total = await response.json();
    
    // Update the statistics with the data from API
    if (total && total.data) {
      statistics.value.totalRevenue = total.data;
    }
    
    return total;
  } catch (error) {
    console.error('Error fetching total revenue:', error);
    // Set a fallback value in case of error
    statistics.value.totalRevenue = 0;
  }
};

const FetchAverageOrder = async () => {
  try {
    const response = await fetch(`${apiUrl}/order/average-order-value`)

    const total = await response.json();
  if (total && total.data) {
      statistics.value.averageOrderValue = total.data.currentAvgOrderValue;
    }
  return total;
  } catch (error){
    console.error('error fetching average', error);
    statistics.value.averageOrderValue = 0;
  }
}

const fetchTopProducts = async () => {
  try {
    const response = await fetch(`${apiUrl}/product/top-products`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const products = await response.json();
    
    // Update the top products with the data from API
    if (products && products.data) {
      topProducts.value = products.data;
    }
    
    return products;
  } catch (error) {
    console.error('Error fetching top products:', error);
  }
}

const FetchRecentOrders = async () => {
  try {
    const response = await fetch(`${apiUrl}/order/recent`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const orders = await response.json();
    
    // Update the recent orders with the data from API
    if (orders && orders.data) {
      recentOrders.value = orders.data;
    }
    return orders;
  } catch (error) {
    console.error('Error fetching recent orders:', error);
  }
}

const FetchInventory = async () => {
  try {
    const response = await fetch(`${apiUrl}/product/inventory`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const inventory = await response.json();
    
    // Update the low inventory products with the data from API
    if (inventory && inventory.data) {
      lowInventoryProducts.value = inventory.data;
    }
    
    return inventory;
  } catch (error) {
    console.error('Error fetching inventory status:', error);
  }
}

onMounted(async () => {
  fetchTotalOrders();
  FetchAverageOrder();
  FetchTotalRevenue();
  fetchTopProducts();
  FetchRecentOrders();
  FetchInventory();
});
</script>
