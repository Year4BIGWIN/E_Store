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
  },
});
