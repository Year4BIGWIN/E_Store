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

    async addItemToCart(item) {
      try {
        await fetch(`${apiUrl}/cart/add`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${cookies.get("auth_token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ item }),
        });

        await this.fetchCart(); // Refresh cart after adding
      } catch (error) {
        console.error("Error adding item:", error);
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
