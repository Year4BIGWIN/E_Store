import Cookies from 'universal-cookie';

export default function useAdminApi() {
  const cookies = new Cookies();
  const apiUrl = import.meta.env.VITE_APP_API_URL;
  
  const getToken = () => {
    const token = cookies.get("auth_token");
    return token && token.split(".").length === 3 ? token : null;
  };

  const getAuthHeaders = () => {
    const token = getToken();
    return token
      ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
      : null;
  };

  const fetchTotalOrders = async () => {
    try {
      const response = await fetch(`${apiUrl}/order/total-order`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching total orders:', error);
      return { data: null };
    }
  };

  const fetchTotalRevenue = async () => {
    try {
      const response = await fetch(`${apiUrl}/order/total-revenue`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching total revenue:', error);
      return { data: null };
    }
  };

  const fetchAverageOrder = async () => {
    try {
      const response = await fetch(`${apiUrl}/order/average-order-value`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching average order value:', error);
      return { data: null };
    }
  };

  const fetchTopProducts = async () => {
    try {
      const response = await fetch(`${apiUrl}/product/top-products`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching top products:', error);
      return { data: [] };
    }
  };

  const fetchRecentOrders = async () => {
    try {
      const response = await fetch(`${apiUrl}/order/recent`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching recent orders:', error);
      return { data: [] };
    }
  };

  const fetchInventory = async () => {
    try {
      const response = await fetch(`${apiUrl}/product/inventory`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching inventory status:', error);
      return { data: [] };
    }
  };

  const fetchTotalCustomers = async () => {
    try {
      const response = await fetch(`${apiUrl}/order/total-user`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching total customers:', error);
      return { data: null };
    }
  };

  const fetchSalesPerformance = async () => {
    try {
      const response = await fetch(`${apiUrl}/order/sales-performance`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching sales performance:', error);
      return { data: { daily: 0, weekly: 0, monthly: 0 } };
    }
  };

  return {
    fetchTotalOrders,
    fetchTotalRevenue,
    fetchAverageOrder,
    fetchTopProducts,
    fetchRecentOrders,
    fetchInventory,
    fetchTotalCustomers,
    fetchSalesPerformance
  };
}