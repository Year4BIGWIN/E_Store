<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Main Content -->
    <main class="py-6 sm:py-10">
      <!-- Page header -->
      <div class="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        <h1 class="text-2xl font-semibold text-gray-900">Dashboard</h1>
      </div>

      <!-- Stats Overview -->
      <div class="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <!-- Skeleton or actual stat cards based on loading state -->
          <template v-if="isLoading">
            <div v-for="i in 4" :key="i" class="w-[1140px] bg-white shadow rounded-lg p-5 h-32 animate-pulse">
              <div class="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div class="h-8 bg-gray-200 rounded w-2/3 mb-2"></div>
              <div class="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
          </template>
          <template v-else>
            <!-- Revenue Stat Card -->
            <StatCard 
              title="Total Revenue"
              :changeDirection="statistics.revenueChangeDirection"
              :changePercentage="statistics.changePercentage"
            >
              <template #value>${{ formatCurrency(statistics.currentMonthRevenue) }}</template>
            </StatCard>

            <!-- Orders Stat Card -->
            <StatCard 
              title="Orders"
              :value="statistics.totalOrders"
              :changeDirection="statistics.ordersChangeDirection"
              :changePercentage="statistics.ordersChangePercentage"
            />

            <!-- Customers Stat Card -->
            <StatCard 
              title="Customers"
              :value="statistics.totalCustomers"
              :changeDirection="statistics.customersChangeDirection"
              :changePercentage="statistics.customersChangePercentage"
            />

            <!-- Average Order Value Stat Card -->
            <StatCard 
              title="Average Order Value"
              :changeDirection="statistics.aovChange >= 0 ? 'up' : 'down'"
              :changePercentage="statistics.aovChangePercentage"
            >
              <template #value>${{ formatCurrency(statistics.averageOrderValue) }}</template>
            </StatCard>
          </template>
        </div>
      </div>

      <!-- Recent Orders and Sales Performance -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div class="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <!-- Skeleton or actual components based on loading state -->
          <template v-if="isLoading">
            <div v-for="i in 2" :key="i" class="bg-white shadow rounded-lg p-4 min-h-[300px] animate-pulse">
              <div class="h-5 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div class="space-y-3">
                <div v-for="j in 4" :key="j" class="h-12 bg-gray-200 rounded"></div>
              </div>
            </div>
          </template>
          <template v-else>
            <!-- Recent Orders -->
            <RecentOrders :orders="recentOrders" />

            <!-- Sales Performance -->
            <SalesPerformance :salesData="salesPerformance" />
          </template>
        </div>
      </div>

      <!-- Top Products and Inventory Status -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div class="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <!-- Skeleton or actual components based on loading state -->
          <template v-if="isLoading">
            <div v-for="i in 2" :key="i" class="bg-white shadow rounded-lg p-4 min-h-[300px] animate-pulse">
              <div class="h-5 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div class="space-y-3">
                <div v-for="j in 5" :key="j" class="h-10 bg-gray-200 rounded"></div>
              </div>
            </div>
          </template>
          <template v-else>
            <!-- Top Products -->
            <TopProducts :products="topProducts" />

            <!-- Inventory Status -->
            <InventoryStatus :products="lowInventoryProducts" />
          </template>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import StatCard from '@/components/Dashboard/StatCard.vue';
import RecentOrders from '@/components/Dashboard/RecentOrders.vue';
import SalesPerformance from '@/components/Dashboard/SalesPerformance.vue';
import TopProducts from '@/components/Dashboard/TopProduct.vue';
import InventoryStatus from '@/components/Dashboard/InventoryStatus.vue';
import useAdminApi from '@/composable/dashboardApi.js';

const adminApi = useAdminApi();
const isLoading = ref(true); // Add loading state

const statistics = ref({
  currentMonthRevenue: 0,
  lastMonthRevenue: 0,
  revenueChange: 0,
  changePercentage: 0,
  revenueChangeDirection: '',
  totalOrders: 0,
  lastMonthOrders: 0,
  ordersChange: 0,
  ordersChangePercentage: 0,
  ordersChangeDirection: '',
  totalCustomers: 0,
  customersChange: 0,
  averageOrderValue: 0,
  aovChange: 0,
  customersChangePercentage: 0,
  customersChangeDirection: '',
  lastMonthAverageOrderValue: 0,
  aovChangePercentage: 0,
  aovChangeDirection: '',
});

const recentOrders = ref([]);
const topProducts = ref([]);
const lowInventoryProducts = ref([]);
// Add this missing ref declaration
const salesPerformance = ref({
  daily: 0,
  weekly: 0,
  monthly: 0,
  growthPercentage: 0,
  averageOrderValue: 0,
  numberOfOrders: 0,
  graphData: []
});

// Helper function to format currency
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

// Fetch all the data needed for the dashboard
const loadDashboardData = async () => {
  isLoading.value = true; // Start loading
  try {
    // Fetch all data in parallel for better performance
    const [
      ordersResult,
      revenueResult,
      aovResult,
      customersResult,
      productsResult,
      ordersData,
      inventoryResult,
      salesPerformanceResult
    ] = await Promise.all([
      adminApi.fetchTotalOrders(),
      adminApi.fetchTotalRevenue(),
      adminApi.fetchAverageOrder(),
      adminApi.fetchTotalCustomers(),
      adminApi.fetchTopProducts(),
      adminApi.fetchRecentOrders(),
      adminApi.fetchInventory(),
      adminApi.fetchSalesPerformance()
    ]);
    
    // Process orders data
    if (ordersResult.data) {
      statistics.value.totalOrders = ordersResult.data.currentMonthOrders;
      statistics.value.lastMonthOrders = ordersResult.data.lastMonthOrders;
      statistics.value.ordersChange = ordersResult.data.change;
      statistics.value.ordersChangePercentage = ordersResult.data.changePercentage;
      statistics.value.ordersChangeDirection = ordersResult.data.changeDirection;
    }

    // Process revenue data
    if (revenueResult.data) {
      statistics.value.currentMonthRevenue = revenueResult.data.currentMonthRevenue;
      statistics.value.lastMonthRevenue = revenueResult.data.lastMonthRevenue;
      statistics.value.revenueChange = revenueResult.data.change;
      statistics.value.changePercentage = revenueResult.data.changePercentage;
      statistics.value.revenueChangeDirection = revenueResult.data.changeDirection;
    }

    // Process AOV data
    if (aovResult.data) {
      statistics.value.averageOrderValue = aovResult.data.currentAvgOrderValue;
      statistics.value.lastMonthAverageOrderValue = aovResult.data.lastMonthAvgOrderValue;
      statistics.value.aovChangePercentage = aovResult.data.percentageChange;
      statistics.value.aovChangeDirection = aovResult.data.changeDirection;
    }

    // Process customers data
    if (customersResult.data) {
      statistics.value.totalCustomers = customersResult.data.currentMonth;
      statistics.value.customersChange = customersResult.data.change;
      statistics.value.customersChangePercentage = customersResult.data.changePercentage;
      statistics.value.customersChangeDirection = customersResult.data.changeDirection;
    }

    // Process remaining data
    if (productsResult.data) {
      topProducts.value = productsResult.data;
    }

    if (ordersData.data) {
      recentOrders.value = ordersData.data;
    }

    if (inventoryResult.data) {
      lowInventoryProducts.value = inventoryResult.data;
    }

    if (salesPerformanceResult.data) {
      salesPerformance.value = {
        daily: salesPerformanceResult.data.currentMonth.totalsaledaily, // Approximate daily average
        weekly: salesPerformanceResult.data.currentMonth.totalsaleweekly, // Approximate weekly average
        monthly: salesPerformanceResult.data.currentMonth.totalSales,
        growthPercentage: salesPerformanceResult.data.currentMonth.growthPercentageComparedToLastMonth,
        averageOrderValue: salesPerformanceResult.data.currentMonth.averageOrderValue,
        numberOfOrders: salesPerformanceResult.data.currentMonth.numberOfOrders,
        graphData: salesPerformanceResult.data.graphData || []

      };
    }
    
  } catch (error) {
    console.error('Error loading dashboard data:', error);
  } finally {
    // Only show content after a small delay to prevent flashing
    setTimeout(() => {
      isLoading.value = false; // End loading state
    }, 300);
  }
};

onMounted(() => {
  loadDashboardData();
});
</script>

<style scoped>
.animate-pulse {
  animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
}
</style>
