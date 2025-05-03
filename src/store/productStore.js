import { defineStore } from 'pinia';
import Cookies from 'universal-cookie';

const cookies = new Cookies();
const apiUrl = import.meta.env.VITE_APP_API_URL;
export const useProductStore = defineStore('products', {
  state: () => ({
    products: [],
    loading: false,
    error: null,
    totalPages: 0,
    totalElements: 0,
    currentPage: 0
  }),
  
  actions: {
    async fetchProduct(page = 0, size = 8) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await fetch(`${apiUrl}/product?page=${page}&size=${size}`);
        if (!response.ok) {
          const errorData = await response.json();
          console.error("Error response from server:", errorData);
          throw new Error("Network response was not ok");
        }
        
        const data = await response.json();
        
        // Store pagination metadata
        this.totalPages = data.data.totalPages;
        this.totalElements = data.data.totalElements;
        this.currentPage = data.data.pageable.pageNumber;
        
        this.products = data.data.content.map((item) => ({
          id: item.id,
          model: item.model,
          description: item.description,
          stock_price: item.stock_price,
          price: item.price,
          stock: item.stock,
          averageRating: item.averageRating,
          releaseDate: item.releaseDate,
          brand: item.brand,
          productType: item.productType,
          brandId: item.brandId,
          productTypeId: item.productTypeId,
          display: item.display,
          performance: item.performance,
          camera: item.camera,
          battery: item.battery,
          connectivity: item.connectivity,
          buildAndDesign: item.buildAndDesign,
          otherFeatures: item.otherFeatures,
          softwareFeatures: item.softwareFeatures,
          imageUrls: item.imageUrls,
          firstImageUrl: item.firstImageUrl,
          additionalInfo: item.additionalInfo,
          quantity: 1, // Default quantity for cart functionality
        }));
        
        console.log("Product:", this.products);
        console.log("Pagination:", {
          currentPage: this.currentPage,
          totalPages: this.totalPages,
          totalElements: this.totalElements
        });
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