<template>
  <div class="bg-white rounded-lg shadow-md p-4 mb-3 hover:shadow-lg transition-shadow duration-300">
    <div class="flex justify-between items-center">
      <div class="flex gap-12 items-center">
        <div class="w-[120px] h-12 bg-gray-100 rounded-lg overflow-hidden shadow-sm border border-gray-200">
          <img
            :src="brand.image_url"
            :alt="brand.name"
            class="w-full h-full object-contain rounded-lg"
          />
        </div>
        <h1 class="text-lg font-medium text-gray-800">{{ brand.name }}</h1>
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
          @click="confirmDeleteBrand(brand.id)" 
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

  <!-- Use DialogBrand component for editing -->
  <DialogBrand 
    v-model:showDialog="showEditDialog" 
    :isEditMode="true" 
    :currentBrand="brand"
    @updatesuccess="handleUpdateSuccess" 
  />

  <!-- Delete confirmation dialog -->
  <DialogInfo 
    :show="showDeleteConfirm" 
    title="Confirm Delete" 
    @close="showDeleteConfirm = false"
  >
    <div class="p-4">
      <p class="text-gray-700 mb-6">Are you sure you want to delete this brand? This action cannot be undone.</p>
      
      <div class="flex justify-end gap-3 mt-4">
        <button 
          @click="showDeleteConfirm = false" 
          class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Cancel
        </button>
        <button 
          @click="confirmDelete()" 
          class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  </DialogInfo>
</template>

<script setup>
import { defineProps, ref, defineEmits } from "vue";
import Cookies from 'universal-cookie';
import axios from "axios"; 
import DialogBrand from '@/components/Other/DialogBrand.vue';
import DialogInfo from '@/components/DialogInfo.vue';
import { toast } from "vue3-toastify";

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
const showDeleteConfirm = ref(false);
const brandIdToDelete = ref(null);

const openEditDialog = () => {
  showEditDialog.value = true;
};

const handleUpdateSuccess = () => {
  // Emit an event to the parent to refresh the brands list
  emit('refresh');
};

const confirmDeleteBrand = (id) => {
  brandIdToDelete.value = id;
  showDeleteConfirm.value = true;
};

async function confirmDelete() {
  try {
    await axios.delete(`${apiUrl}/brand/${brandIdToDelete.value}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    emit('refresh');
    toast.success("Brand deleted successfully!");
    showDeleteConfirm.value = false;
  } catch (error) {
    console.error("Error deleting brand:", error);
  }
}
</script>