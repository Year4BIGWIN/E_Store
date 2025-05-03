<template>
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
            <tr v-for="order in orders" :key="order.id">
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
</template>

<script setup>
defineProps({
  orders: {
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

const formatDate = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  
  if (isNaN(date.getTime())) return dateString;
  
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
};

const getStatusClasses = (status) => {
  return {
    'bg-green-100 text-green-800': status === 'PAID',
    'bg-yellow-100 text-yellow-800': status === 'PENDING',
    'bg-blue-100 text-blue-800': status === 'Shipped',
    'bg-red-100 text-red-800': status === 'Cancelled'
  };
};
</script>