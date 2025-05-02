<template>
    <div v-if="showDialog" class="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-semibold">{{ isEditMode ? 'Edit Slide' : 'Add New Slide' }}</h3>
          <button @click="closeDialog" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
  
        <form @submit.prevent="saveSlide">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              v-model="formData.title"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter slide title"
              required
            />
          </div>
  
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              v-model="formData.description"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter slide description"
              rows="3"
            ></textarea>
          </div>
  
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-1">Image</label>
            <div class="flex justify-center">
              <Upload v-model:uploadedImageUrl="formData.imageUrl" />
            </div>
          </div>
  
          <div class="flex justify-end gap-2">
            <button
              type="button"
              @click="closeDialog"
              class="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
              :disabled="loading"
            >
              <span v-if="loading">Saving...</span>
              <span v-else>{{ isEditMode ? 'Update' : 'Add' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, watch, defineProps, defineEmits } from 'vue';
  import axios from 'axios';
  import Cookies from 'universal-cookie';
  import Upload from '@/components/Upload.vue';
  
  const props = defineProps({
    showDialog: Boolean,
    isEditMode: {
      type: Boolean,
      default: false
    },
    currentSlide: {
      type: Object,
      default: () => ({})
    }
  });
  
  const emit = defineEmits(['update:showDialog', 'updatesuccess', 'postsuccess']);
  
  const apiUrl = import.meta.env.VITE_APP_API_URL;
  const token = new Cookies().get("auth_token");
  
  const formData = ref({
    title: '',
    description: '',
    imageUrl: ''
  });
  
  const loading = ref(false);
  
  watch(() => props.currentSlide, (newValue) => {
    if (props.isEditMode && newValue) {
      formData.value = {
        title: newValue.title || '',
        description: newValue.description || '',
        imageUrl: newValue.imageUrl || ''
      };
    } else {
      resetForm();
    }
  }, { immediate: true });
  
  async function saveSlide() {
    loading.value = true;
    
    try {
      // Create data object for API request
      const slideData = {
        title: formData.value.title,
        description: formData.value.description || '',
        imageUrl: formData.value.imageUrl || ''
      };
  
      if (props.isEditMode) {
        await axios.put(`${apiUrl}/slide/${props.currentSlide.id}`, slideData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        emit('updatesuccess');
      } else {
        await axios.post(`${apiUrl}/slide`, slideData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        emit('postsuccess');
      }
      
      closeDialog();
    } catch (error) {
      console.error('Error saving slide:', error);
      alert('Failed to save slide. ' + (error.response?.data?.message || 'Please try again.'));
    } finally {
      loading.value = false;
    }
  }
  
  function closeDialog() {
    resetForm();
    emit('update:showDialog', false);
  }
  
  function resetForm() {
    formData.value = {
      title: '',
      description: '',
      imageUrl: ''
    };
  }
  </script>