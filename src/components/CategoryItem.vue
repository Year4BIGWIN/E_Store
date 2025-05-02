<template>
  <div class="bg-white rounded-lg shadow-md p-4 mb-3 hover:shadow-lg transition-shadow duration-300">
    <div class="flex justify-between items-center">
      <div class="flex gap-12 items-center">
        <div class="w-[120px] h-12 bg-gray-100 rounded-lg overflow-hidden shadow-sm border border-gray-200">
          <!-- Optional: Uncomment if image support is added -->
          <!-- <img
            :src="product_type.image_url"
            :alt="product_type.name"
            class="w-full h-full object-contain rounded-lg"
          /> -->
        </div>
        <div>
          <h1 class="text-lg font-medium text-gray-800">{{ product_type.name }}</h1>
          <p class="text-sm text-gray-500">{{ product_type.description }}</p>
        </div>
      </div>
      <div class="flex gap-3 items-center">
        <button 
          @click="openEditDialog()" 
          class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
          Edit
        </button>
        <button 
          @click="DeleteBrand(product_type.id)" 
          class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Delete
        </button>
      </div>
    </div>
  </div>

  <!-- Use DialogCategory component for editing -->
  <DialogCategory 
    v-model:showDialog="showEditDialog" 
    :isEditMode="true" 
    :currentCategory="product_type" 
    @updatesuccess="handleUpdateSuccess" 
  />
</template>

<script setup>
import { defineProps, ref, defineEmits } from "vue";
import Cookies from 'universal-cookie';
import axios from "axios"; 
import DialogCategory from './Other/DialogCategory.vue';

const apiUrl = import.meta.env.VITE_APP_API_URL;
const token = new Cookies().get("auth_token");
const emit = defineEmits(['refresh']);

const props = defineProps({
  product_type: {
    type: Object,
    required: true,
  },
});

const showEditDialog = ref(false);

const openEditDialog = () => {
  showEditDialog.value = true;
};

const handleUpdateSuccess = () => {
  emit('refresh');
};

async function DeleteBrand(id) {
  if (confirm("Are you sure you want to delete this category?")) {
    try {
      const response = await axios.delete(`${apiUrl}/productType/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      console.log(response.data);
      emit('refresh');
    } catch (error) {
      console.error("Error deleting brand:", error);
    }
  }
}
</script>
