import { defineStore } from "pinia";
import Cookies from "universal-cookie";

const cookies = new Cookies();
const apiUrl = import.meta.env.VITE_APP_API_URL;

export const useCartStore = defineStore("cart", {
  state: () => ({
    cartItems: [],
    totalPrice: 0,
  }),
  actions: {
    async fetchCart() {
      try {
        const response = await fetch(`${apiUrl}/cart`, {
          headers: {
            Authorization: `Bearer ${cookies.get("auth_token")}`,
          },
        });
        const data = await response.json();

        // Assign the entire array for reactivity
        this.cartItems = data.data.cartItems;
        this.totalPrice = data.data.totalPrice;
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    },

    async addToCart(phoneId, quantity = 1) {
      try {
        const cookies = new Cookies();
        const token = cookies.get("auth_token");

        // Validate token
        if (!token || token.split(".").length !== 3) {
          router.push({
            name: "login",
            query: { redirect: router.currentRoute.value.fullPath },
          });
          return;
        }

        const response = await fetch(`${apiUrl}/cart/add`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ phoneId, quantity }),
        });

        const responseData = await response.json();

        if (!response.ok) {
          return {
            success: false,
            message: responseData.message || "Product is out of stock",
            errorType: "general",
          };
        }

        console.log("Add to cart response:", responseData);

        // Use this.fetchCart() instead of cartStore.fetchCart()
        await this.fetchCart();

        // Return success for UI feedback
        return { success: true, message: "Item added to cart!" };
      } catch (error) {
        console.error("Error adding to cart:", error);
        return {
          success: false,
          message: "An error occurred while adding the item. Please try again.",
          errorType: "exception",
        };
      }
    },

    async removeItemFromCart(itemId) {
      try {
        await fetch(`${apiUrl}/cart/remove/${itemId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${cookies.get("auth_token")}`,
          },
        });

        await this.fetchCart(); // Refresh cart after removing
      } catch (error) {
        console.error("Error removing item:", error);
      }
    },

    // New functions for quantity management
    async decreaseQuantity(itemId) {
      try {
        // Find the cart item - but don't use it for validation here
        // Let the API handle validation instead
        
        const response = await fetch(`${apiUrl}/cart/removeOne/${itemId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${cookies.get("auth_token")}`,
          },
        });

        if (response.ok) {
          await this.fetchCart();
          return { success: true };
        } else {
          console.error(`Failed to decrease quantity: ${response.statusText}`);
          return { success: false };
        }
      } catch (error) {
        console.error("Error decreasing quantity:", error);
        return { success: false };
      }
    },

    async increaseQuantity(itemId) {
      try {
        const response = await fetch(`${apiUrl}/cart/addOne/${itemId}`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${cookies.get("auth_token")}`,
          },
        });

        if (response.ok) {
          await this.fetchCart();
          return { success: true };
        } else {
          console.error(`Failed to increase quantity: ${response.statusText}`);
          return { success: false };
        }
      } catch (error) {
        console.error("Error increasing quantity:", error);
        return { success: false };
      }
    },

    async updateItemQuantity(itemId, newQuantity) {
      try {
        if (newQuantity <= 0) {
          return this.removeItemFromCart(itemId);
        }
        
        const response = await fetch(`${apiUrl}/cart/update/${itemId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookies.get("auth_token")}`,
          },
          body: JSON.stringify({ quantity: newQuantity }),
        });

        if (response.ok) {
          await this.fetchCart();
          return { success: true };
        } else {
          console.error(`Failed to update quantity: ${response.statusText}`);
          return { success: false };
        }
      } catch (error) {
        console.error("Error updating quantity:", error);
        return { success: false };
      }
    },
  },
});
