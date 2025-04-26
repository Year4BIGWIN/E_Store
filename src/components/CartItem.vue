<template>
  <div class="w-full flex items-center justify-between">
    <div class="w-2/5 flex items-center gap-4">
      <div class="w-20 h-20 bg-slate-300 rounded-xl">
        <img
          :src="cart.phone.firstImageUrl"
          alt="..."
          class="w-full h-full object-cover rounded-xl" />
      </div>
      <h1>{{ cart.phone.model }}</h1>
    </div>

    <div class="w-3/5 justify-between flex">
      <h1>${{ cart.phone.price }}</h1> <!-- Dynamic price -->
      <div class="flex items-center gap-4 bg-[#d9d9d9] rounded-xl px-4">
        <button @click="clearProductOneByeOne(cart.phone.id)" class="text-2xl">&minus;</button>
        <h1 class="text-xl">{{ cart.quantity }}</h1>
        <button @click="addProductOneByeOne(cart.phone.id)" class="text-2xl">&plus;</button>
      </div>
      <div class="flex items-center gap-4 mr-10">
        <h1>${{ cart.phone.price * cart.quantity }}</h1> <!-- Dynamic subtotal -->
        <button @click="removeProduct(cart.phone.id)" class="flex items-center hover:text-red-500">
          <hr class="w-[15px] border-gray-400 rotate-90" />
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
import Cookies from 'universal-cookie';

const apiUrl = import.meta.env.VITE_APP_API_URL;
const cookies = new Cookies();
const props = defineProps({
  cart: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['update-cart']);

const clearProductOneByeOne = async (id) => {
  try {
    const token = cookies.get("auth_token");
    if (!token) {
      alert("Token not found");
      return;
    }

    const response = await fetch(`${apiUrl}/cart/removeOne/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      emit('update-cart'); // Emit event to update cart
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

    const response = await fetch(`${apiUrl}/cart/addOne/${id}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      emit('update-cart'); // Emit event to update cart
    } else {
      console.error("Error adding product to cart:", response.statusText);
    }
  } catch (error) {
    console.error("Error adding product to cart:", error);
  }
};

const removeProduct = async (id) => {
  try {
    const token = cookies.get("auth_token");
    if (!token) {
      alert("Token not found");
      return;
    }

    const response = await fetch(`${apiUrl}/cart/remove/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      emit('update-cart'); // Emit event to update cart
    } else {
      console.error("Error removing product from cart:", response.statusText);
    }
  } catch (error) {
    console.error("Error removing product from cart:", error);
  }
};


</script>
