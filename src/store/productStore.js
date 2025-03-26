import { defineStore } from 'pinia';
import Cookies from 'universal-cookie';


const cookies = new Cookies();
const apiUrl = import.meta.env.VITE_APP_API_URL;
export const useProductStore = defineStore('products', {
  state: () => ({
    products: [],
    loading: false,
    error: null
  }),
  
  actions: {
    async fetchProduct(page = 0, size = 10) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await fetch(`${apiUrl}/product?page=${page}&size=${size}`, {
          headers: {
            Authorization: `Bearer ${cookies.get("auth_token")}`,
          },
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error("Error response from server:", errorData);
          throw new Error("Network response was not ok");
        }
        
        const data = await response.json();
        this.products = data.data.content.map((item) => ({
          id: item.id,
          model: item.model,
          image_url: item.image_url,
          stock: item.stock,
          price: item.price,
          quantity: 1, // Default quantity
          productType: item.productType,
        }));
        
        console.log("Product:", this.products);
      } catch (error) {
        console.error("Error fetching products:", error);
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
    async deleteProduct(productId) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await fetch(`${apiUrl}/product/${productId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${cookies.get("auth_token")}`,
            'Content-Type': 'application/json'
          },
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error("Error response from server:", errorData);
          throw new Error("Failed to delete product");
        }
        
        // Remove the deleted product from the local state
        this.products = this.products.filter(product => product.id !== productId);
        
        console.log("Product deleted successfully");
        return true;
      } catch (error) {
        console.error("Error deleting product:", error);
        this.error = error.message;
        return false;
      } finally {
        this.loading = false;
      }
    }
  },
  
  getters: {
    getProductById: (state) => (id) => {
      return state.products.find(product => product.id === id);
    }
  }
});