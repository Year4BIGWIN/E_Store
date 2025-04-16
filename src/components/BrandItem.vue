<template>
  <div class="w-full flex justify-between p-2">
    <div class="flex gap-4 items-center">
      <div class="w-20 h-20 bg-slate-300 rounded-xl">
        <img
          :src="brand.image_url"
          alt="..."
          class="w-full h-full object-cover rounded-xl"
        />
      </div>
      <h1>{{ brand.name }}</h1>
    </div>
    <div class="flex gap-2 items-center">
      <button @click="openEditDialog()" class="bg-blue-500 text-white px-2 py-1 rounded-lg">Edit</button>
      <button @click="DeleteBrand(brand.id)" class="bg-red-500 text-white px-2 py-1 rounded-lg">Delete</button>
    </div>
  </div>

  <!-- Use DialogBrand component for editing -->
  <DialogBrand 
    v-model:showDialog="showEditDialog" 
    :isEditMode="true" 
    :currentBrand="brand"
    @updatesuccess="handleUpdateSuccess" 
  />
</template>

<script setup>
import { defineProps, ref, defineEmits } from "vue";
import Cookies from 'universal-cookie';
import axios from "axios"; 
import DialogBrand from '@/components/DialogBrand.vue';

const apiUrl = import.meta.env.VITE_APP_API_URL;
const token = new Cookies().get("auth_token");
const emit = defineEmits(['refresh']);
const props = defineProps({
  brand: {
    type: Object,
    required: true,
  },
});

// Replace modal with dialog
const showEditDialog = ref(false);

const openEditDialog = () => {
  showEditDialog.value = true;
};

const handleUpdateSuccess = () => {
  // Emit an event to the parent to refresh the brands list
  emit('refresh');
};

async function DeleteBrand(id) {
  if (confirm("Are you sure you want to delete this brand?")) {
    try {
      const response = await axios.delete(`${apiUrl}/brand/${id}`,{
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