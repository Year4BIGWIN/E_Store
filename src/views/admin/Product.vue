<template>
  <div class="w-ful h-full flex flex-col gap-2">
    <div class="flex gap-6">
      <!-- Router links for products -->
      <router-link to="/products/phone">
        <div
          class="group bg-[#d9d9d9] hover:bg-blue-500 hover:text-white hover:fill-white w-[275px] px-4 py-4 flex items-center rounded-xl"
        >
          <i class="fa-solid fa-mobile-screen-button fa-2x"></i>
          <hr
            class="w-10 border border-black group-hover:border-white rotate-90"
          />
          <div>
            <h1 class="text-xl">Mobile Phone</h1>
            <router-link to="/products/phone"
              >view all <i class="fa-solid fa-angles-right"></i
            ></router-link>
          </div>
        </div>
      </router-link>

      <!-- Other Product Categories -->
      <!-- Tablet -->
      <router-link to="/products/tablet">
        <div
          class="group bg-[#d9d9d9] hover:bg-blue-500 hover:text-white hover:fill-white w-[275px] px-4 py-4 flex items-center rounded-xl"
        >
          <i class="fa-solid fa-tablet-screen-button fa-2x"></i>
          <hr
            class="w-10 border border-black group-hover:border-white rotate-90"
          />
          <div>
            <h1 class="text-xl">Tablet</h1>
            <router-link to="/products/tablet"
              >view all <i class="fa-solid fa-angles-right"></i
            ></router-link>
          </div>
        </div>
      </router-link>

      <!-- Watch -->
      <router-link to="/products/watch">
        <div
          class="group bg-[#d9d9d9] hover:bg-blue-500 hover:text-white hover:fill-white w-[275px] px-4 py-4 flex items-center rounded-xl"
        >
          <svg
            fill="black"
            height="50"
            viewBox="0 0 24 24"
            width="40"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.5 6.40135V4C7.5 2.89543 8.39543 2 9.5 2H14.5C15.6046 2 16.5 2.89543 16.5 4V6.40135C17.3967 6.92006 18 7.88958 18 9V10C18.5523 10 19 10.4477 19 11V12C19 12.5523 18.5523 13 18 13V15C18 16.1104 17.3967 17.0799 16.5 17.5987L16.5 20C16.5 21.1046 15.6046 22 14.5 22H9.5C8.39543 22 7.5 21.1046 7.5 20L7.5 17.5987C6.6033 17.0799 6 16.1104 6 15V9C6 7.88958 6.6033 6.92006 7.5 6.40135ZM9.5 3.5C9.22386 3.5 9 3.72386 9 4V6H15V4C15 3.72386 14.7761 3.5 14.5 3.5H9.5ZM16.5 15V9C16.5 8.17157 15.8284 7.5 15 7.5H9C8.17157 7.5 7.5 8.17157 7.5 9V15C7.5 15.8284 8.17157 16.5 9 16.5H15C15.8284 16.5 16.5 15.8284 16.5 15ZM9 20C9 20.2761 9.22386 20.5 9.5 20.5H14.5C14.7761 20.5 15 20.2761 15 20V18H9L9 20Z"
            />
          </svg>
          <hr
            class="w-10 border border-black group-hover:border-white rotate-90"
          />
          <div>
            <h1 class="text-xl">Smart Watch</h1>
            <router-link to="/products/watch"
              >view all <i class="fa-solid fa-angles-right"></i
            ></router-link>
          </div>
        </div>
      </router-link>

      <!-- Accessories -->
      <router-link to="/products/accessories">
        <div
          class="group bg-[#d9d9d9] hover:bg-blue-500 hover:text-white hover:fill-white w-[275px] px-4 py-4 flex items-center rounded-xl"
        >
          <i class="fa-solid fa-headphones-simple fa-2x"></i>
          <hr
            class="w-10 border border-black group-hover:border-white rotate-90"
          />
          <div>
            <h1 class="text-xl">Accessories</h1>
            <router-link to="/products/accessories"
              >view all <i class="fa-solid fa-angles-right"></i
            ></router-link>
          </div>
        </div>
      </router-link>
    </div>

    <!-- Mobile Phone Products -->
    <div class="w-full h-full bg-[#d9d9d9] rounded-xl flex flex-col gap-2 p-5">
      <div class="w-full flex justify-between">
        <h1 class="text-xl font-bold">Mobile Phone</h1>
        <button
          @click="showDialog = true"
          class="border px-4 py-2 hover:bg-white hover:text-black rounded-full text-white bg-blue-500"
        >
          Add Product
        </button>
      </div>

      <!-- Product List -->
      <div class="w-full grid grid-cols-4 gap-4">
    <ProductCartEdit
      v-for="product in products"
      :key="product.id"
      :name="product.model"
      :quantity="product.stock"
      :image="product.image_url"
      :id="product.id"
      @delete="deleteProduct"
    />
  </div>
      <!-- <Pagination /> -->
    </div>

    <!-- Dialog Component -->

    <DialogPhone v-model:showDialog="showDialog"  />
  </div>
</template>

<script setup>
import ProductCartEdit from "@/components/ProductCartEdit.vue";
import Pagination from "@/components/Pagination.vue";
import DialogPhone from "@/components/DialogPhone.vue";
import { onMounted, ref } from "vue";

const apiUrl = import.meta.env.VITE_APP_API_URL;
const products = ref();

const fetchProducts = async () => {
  try {
    const response = await fetch(`${apiUrl}/product`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    products.value = data.data;
    console.log('Fetched products:', products.value); // Log the fetched products
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
  }
};

const deleteProduct = async (id) => {
  try {
    const response = await fetch(`${apiUrl}/product/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    console.log('Deleted product:', data); // Log the deleted product
    fetchProducts();
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
  }
};


onMounted(() => {
  fetchProducts();
});

const showDialog = ref(false);
</script>
