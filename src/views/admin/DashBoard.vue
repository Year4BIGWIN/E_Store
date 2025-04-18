<template>
  <div class="w-full border border-gray-300 rounded-xl my-10 p-5 bg-gray-50">
    <h1 class="text-2xl font-bold text-center mb-5">Add Product to Cart</h1>

    <!-- list product -->
    <div
      v-for="item in product"
      :key="item.id"
      class="w-full grid grid-cols-4 gap-4 p-4 border border-gray-200 rounded-lg bg-white mb-4 items-center"
    >
      <!-- make for add to cart -->
      <h2 class="text-lg font-semibold">{{ item.model }}</h2>
      <img
        :src="item.image_url"
        alt=""
        class="w-24 h-24 object-cover rounded-md"
      />
      <p class="text-gray-600">Stock: {{ item.stock }}</p>
      <input
        type="number"
        v-model.number="item.quantity"
        min="1"
        :max="item.stock"
        placeholder="Quantity"
        class="w-20 p-2 border border-gray-300 rounded-md"
      />
      <button
        @click="addToCart(item.id, item.quantity)"
        class="col-span-4 py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        Add to Cart
      </button>
    </div>

    <!-- list cart items -->
    <h1 class="text-2xl font-bold text-center mb-5">Cart Items</h1>
    <!-- clear all item -->
    <button @click="clearCart" class="border rounded-md bg-red-500 text-white">
      Clear Cart
    </button>
    <div
      v-for="cartItem in cart.cartItems"
      :key="cartItem.id"
      class="w-full grid grid-cols-4 gap-4 p-4 border border-gray-200 rounded-lg bg-white mb-4 items-center"
    >
      <button
        @click="clearProductInCart(cartItem.phone.id)"
        class="border rounded-md bg-red-500 text-white"
      >
        Remove Product {{ cartItem.phone.id }}
      </button>
      <button
        @click="clearProductOneByeOne(cartItem.phone.id)"
        class="border rounded-md bg-blue-500 text-white"
      >
        -
      </button>
      <button
        @click="addProductOneByeOne(cartItem.phone.id)"
        class="border rounded-md bg-blue-500 text-white"
      >
        +
      </button>
      <h2 class="text-lg font-semibold">{{ cartItem.phone.model }}</h2>
      <img
        :src="cartItem.phone.image_url"
        alt=""
        class="w-24 h-24 object-cover rounded-md"
      />
      <p class="text-gray-600">Quantity: {{ cartItem.quantity }}</p>
      <p class="text-gray-600">Price: ${{ cartItem.phone.price }}</p>
    </div>

    <!-- display total price -->
    <div class="text-right text-xl font-bold mt-5">
      Total Price: ${{ cart.totalPrice }}
    </div>
    <div>
      <button class="border rounded-md bg-red-500 text-white">Checkout</button>
    </div>
    <Checkout />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import Cookies from "universal-cookie";
import Checkout from "../../components/Checkout.vue";

const apiUrl = import.meta.env.VITE_APP_API_URL;
const product = ref([]);
const cart = ref({ cartItems: [], totalPrice: 0 });
const cookies = new Cookies();

const fetchProduct = async () => {
  try {
    const response = await fetch(`${apiUrl}/product?page=0&size=10`);
    const data = await response.json();
    product.value = data.data.map((item) => ({ ...item, quantity: 1 }));
  } catch (error) {
    console.error("Error fetching products:", error);
  }
};

const fetchCart = async () => {
  try {
    const response = await fetch(`${apiUrl}/cart`, {
      headers: {
        Authorization: `Bearer ${cookies.get("auth_token")}`,
      },
    });
    const data = await response.json();
    cart.value = data.data;
  } catch (error) {
    console.error("Error fetching cart:", error);
  }
};

const addToCart = async (phoneId, quantity) => {
  try {
    const token = cookies.get("auth_token");
    if (!token) {
      alert("Token not found");
      return;
    }

    if (token.split(".").length !== 3) {
      alert("Invalid JWT token");
      return;
    }

    const requestBody = { phoneId, quantity };
    const response = await fetch(`${apiUrl}/cart/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(requestBody),
    });
    console.log("Add to cart response:", await response.json());
    fetchCart();
  } catch (error) {
    console.error("Error adding to cart:", error);
  }
};

const clearCart = async () => {
  try {
    const token = cookies.get("auth_token");
    if (!token) {
      alert("Token not found");
      return;
    }

    if (token.split(".").length !== 3) {
      alert("Invalid JWT token");
      return;
    }

    const response = await fetch(`${apiUrl}/cart/clear`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Clear cart response:", await response.json());
    fetchCart();
  } catch (error) {
    console.error("Error clearing cart:", error);
  }
};

const clearProductInCart = async (id) => {
  try {
    const token = cookies.get("auth_token");
    if (!token) {
      alert("Token not found");
      return;
    }

    if (token.split(".").length !== 3) {
      alert("Invalid JWT token");
      return;
    }

    const response = await fetch(`${apiUrl}/cart/remove/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      console.log("Remove product response: No content");
      fetchCart();
    } else {
      console.error("Error removing product from cart:", response.statusText);
    }
  } catch (error) {
    console.error("Error removing product from cart:", error);
  }
};

const clearProductOneByeOne = async (id) => {
  try {
    const token = cookies.get("auth_token");
    if (!token) {
      alert("Token not found");
      return;
    }

    if (token.split(".").length !== 3) {
      alert("Invalid JWT token");
      return;
    }

    const response = await fetch(`${apiUrl}/cart/removeOne/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      console.log("Remove product response: No content");
      fetchCart();
    } else {
      console.error("Error removing product from cart:", response.statusText);
    }
  } catch (error) {
    console.error("Error removing product from cart:", error);
  }
};

const addProductOneByeOne = async (id) => {
  try {
    const token = cookies.get("auth_token");
    if (!token) {
      alert("Token not found");
      return;
    }

    if (token.split(".").length !== 3) {
      alert("Invalid JWT token");
      return;
    }

    const response = await fetch(`${apiUrl}/cart/addOne/${id}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      console.log("Remove product response: No content");
      fetchCart();
    } else {
      console.error("Error removing product from cart:", response.statusText);
    }
  } catch (error) {
    console.error("Error removing product from cart:", error);
  }
};

console.log("cart", cart.value.cartItems);

onMounted(() => {
  fetchProduct();
  fetchCart();
});
</script>
