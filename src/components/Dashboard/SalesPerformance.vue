<template>
    <div class="bg-white shadow rounded-lg overflow-hidden">
      <div class="px-4 py-5 border-b border-gray-200 sm:px-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900">
          Sales Performance
        </h3>
        <div class="mt-1 flex items-center">
          <span class="text-sm text-gray-500">
            {{ salesData.numberOfOrders }} orders this month
          </span>
          <span v-if="salesData.growthPercentage !== 0" 
                class="ml-2 px-2 py-0.5 rounded-full text-xs font-medium" 
                :class="salesData.growthPercentage >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
            <span v-if="salesData.growthPercentage > 0">↑</span>
            <span v-else>↓</span>
            {{ formatPercentage(salesData.growthPercentage) }}%
          </span>
        </div>
      </div>
      
      <div class="p-4 sm:p-6 h-72">
        <!-- Enhanced graph visualization -->
        <div v-if="salesData.graphData && salesData.graphData.length > 0" class="w-full h-full">
          <div class="flex flex-col h-full">
            <!-- Grid lines -->
            <div class="flex-1 relative">
              <div class="absolute inset-0 grid grid-rows-4 w-full h-full">
                <div v-for="i in 4" :key="`grid-${i}`" class="border-t border-gray-100"></div>
              </div>
              
              <!-- Bars -->
              <div class="absolute inset-0 flex items-end justify-around px-4">
                <div v-for="(item, index) in salesData.graphData" :key="index" 
                     class="w-16 rounded-t-md chart-bar group relative"
                     :style="{ height: `${calculateBarHeight(item.sales)}%` }">
                  
                  <!-- Gradient bar -->
                  <div class="absolute inset-0 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-md"></div>
                  
                  <!-- Bar value -->
                  <div class="absolute inset-x-0 -top-8 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div class="bg-gray-800 text-white text-xs py-1 px-2 rounded shadow-lg">
                      ${{ formatCurrency(item.sales) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- X-axis dates with improved styling -->
            <div class="h-10 flex justify-around items-center text-xs text-gray-500 pt-2 border-t border-gray-200">
              <div v-for="(item, index) in salesData.graphData" :key="`date-${index}`" class="text-center font-medium">
                {{ formatDate(item.date) }}
              </div>
            </div>
          </div>
        </div>
        
        <!-- Improved fallback if no graph data -->
        <div v-else class="w-full h-full flex items-center justify-center bg-gray-50 rounded-lg">
          <div class="text-center">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" 
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p class="mt-2 text-gray-900 font-medium">No sales data available</p>
            <p class="text-sm text-gray-500 mt-1">Start making sales to see visualization</p>
          </div>
        </div>
      </div>
      
      <!-- Enhanced metrics section -->
      <div class="bg-gray-50 border-t border-gray-100 px-4 py-4 sm:px-6 rounded-b-lg">
        <div class="grid grid-cols-3 gap-4 text-center">
          <div class="p-3 rounded-lg hover:bg-gray-100 transition-colors">
            <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Daily</p>
            <p class="text-lg font-bold text-gray-900">${{ formatCurrency(salesData.daily) }}</p>
          </div>
          <div class="p-3 rounded-lg hover:bg-gray-100 transition-colors">
            <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Weekly</p>
            <p class="text-lg font-bold text-gray-900">${{ formatCurrency(salesData.weekly) }}</p>
          </div>
          <div class="p-3 rounded-lg hover:bg-gray-100 transition-colors">
            <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Monthly</p>
            <p class="text-lg font-bold text-gray-900">${{ formatCurrency(salesData.monthly) }}</p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  const props = defineProps({
    salesData: {
      type: Object,
      default: () => ({
        daily: 0,
        weekly: 0,
        monthly: 0,
        growthPercentage: 0,
        averageOrderValue: 0,
        numberOfOrders: 0,
        graphData: []
      })
    }
  });
  
  // Calculate the height percentage for the bar chart
  const calculateBarHeight = (value) => {
    const graphData = props.salesData.graphData || [];
    if (graphData.length === 0) return 0;
    
    const maxSales = Math.max(...graphData.map(item => item.sales));
    return maxSales > 0 ? (value / maxSales) * 85 : 0; // 85% max height for aesthetics
  };
  
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    } catch (e) {
      return dateString;
    }
  };

  const formatPercentage = (value) => {
  if (value === null || value === undefined) {
    return '0.00';
  }
  
  const numValue = typeof value === 'number' ? value : Number(value);
  
  if (isNaN(numValue)) {
    return '0.00';
  }
  
  return parseFloat(numValue).toFixed(2);
};
  
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
  
  <style scoped>
  .chart-bar {
    min-height: 4px;
    transition: height 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
    transform-origin: bottom;
  }
  
  .chart-bar:hover {
    filter: brightness(110%);
    animation: pulse 1.5s infinite;
  }
  
  @keyframes pulse {
    0%, 100% {
      transform: scaleY(1);
    }
    50% {
      transform: scaleY(1.02);
    }
  }
  </style>