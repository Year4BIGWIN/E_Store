<template>
    <div class="flex items-center justify-between p-4 hover:bg-gray-50 border-b border-gray-100">
      <div class="flex items-center gap-12">
        <div class="w-32 flex items-center justify-center">
          <div class="bg-blue-100 text-blue-800 w-10 h-10 rounded-full flex items-center justify-center font-bold">
            {{ product_type.name?.charAt(0)?.toUpperCase() }}
          </div>
        </div>
        <div class="flex flex-col">
          <span class="font-medium text-gray-800">{{ product_type.name }}</span>
          <span class="text-sm text-gray-500">{{ product_type.description || 'No description' }}</span>
        </div>
      </div>
      <div class="flex gap-2">
        <button 
          @click="editCategory" 
          class="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-md flex items-center gap-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Edit
        </button>
        <button 
          @click="showDeleteDialog" 
          class="px-3 py-1 text-red-600 hover:bg-red-50 rounded-md flex items-center gap-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Delete
        </button>
      </div>
    </div>
    
    <!-- Delete confirmation dialog -->
    <DialogInfo 
      :show="showDeleteConfirm" 
      title="Confirm Delete" 
      @close="showDeleteConfirm = false"
    >
      <div class="p-4">
        <p class="text-gray-700 mb-6">
          Are you sure you want to delete category "{{ product_type.name }}"? This action cannot be undone.
        </p>
        
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
  import { defineProps, defineEmits, ref } from 'vue';
  import axios from 'axios';
  import Cookies from 'universal-cookie';
  import DialogInfo from '@/components/DialogInfo.vue';
  import { toast } from "vue3-toastify";
  
  const props = defineProps({
    product_type: {
      type: Object,
      required: true
    }
  });
  
  const emit = defineEmits(['refresh', 'edit']);
  
  const token = new Cookies().get("auth_token");
  const apiUrl = import.meta.env.VITE_APP_API_URL;
  const showDeleteConfirm = ref(false);
  
  function editCategory() {
    emit('edit', props.product_type);
  }
  
  function showDeleteDialog() {
    showDeleteConfirm.value = true;
  }
  
  async function confirmDelete() {
    try {
      await axios.delete(`${apiUrl}/productType/${props.product_type.id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      toast.success(`Category "${props.product_type.name}" deleted successfully`);
      emit('refresh');
      showDeleteConfirm.value = false;
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Failed to delete category. ' + (error.response?.data?.message || 'Please try again.'));
    }
  }
  </script>