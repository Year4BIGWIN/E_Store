<template>
  <tr class="border-t border-gray-200 hover:bg-gray-50 transition-colors">
    <td class="px-2">
      <div class="w-14 h-14 rounded-lg overflow-hidden bg-gray-100">
        <img 
          :src="image || defaultImage" 
          alt="Product Image" 
          class="w-full h-full object-cover"
          @error="handleImageError"
        />
      </div>
    </td>
    
    <td class="p-4">
      <h3 class="w-[200px] font-semibold text-gray-800 line-clamp-1">{{ name }}</h3>
      <p class="text-xs text-gray-500">ID: #{{ id }}</p>
    </td>

    <td class="p-4">
      <span class="text-gray-800 font-medium">$ {{ productData.price }}</span>
    </td>

    <td class="p-4">
      <span class="text-gray-800 font-medium">{{ productData.productType.name }}</span>
    </td>
    
    <td class="p-4">
      <span 
        class="px-2.5 py-1 text-xs font-medium rounded-full"
        :class="getInventoryStatusClasses(quantity)"
      >
        {{ quantity }} in stock
      </span>
    </td>
    
    <td class="p-4 text-right">
      <div class="flex justify-end space-x-2">
        <button 
          @click="openEditDialog" 
          class="px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-md transition-colors inline-flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
          Edit
        </button>
        <button 
          @click="confirmDelete" 
          class="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-md transition-colors inline-flex items-center"
          :disabled="isDeleting"
        >
          <template v-if="!isDeleting">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
            Delete
          </template>
          <template v-else>
            <Loader size="small" class="mr-1" />
            Deleting
          </template>
        </button>
      </div>
    </td>
  </tr>
  <DialogPhone 
    v-model:showDialog="showEditDialog" 
    :isEditMode="true" 
    :currentProduct="productData"
    @updatesuccess="handleUpdateSuccess" 
  />
  
  <div v-if="showDeleteConfirm" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
      <h3 class="text-lg font-medium text-gray-900 mb-3">Confirm Delete</h3>
      <p class="text-gray-600 mb-5">
        Are you sure you want to delete <span class="font-semibold">{{ props.name }}</span>? This action cannot be undone.
      </p>
      <div class="flex justify-end space-x-3">
        <button 
          @click="cancelDelete" 
          class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md transition-colors"
        >
          Cancel
        </button>
        <button 
          @click="handleDelete" 
          class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
          :disabled="isDeleting"
        >
          <span v-if="!isDeleting">Delete</span>
          <span v-else class="flex items-center">
            Deleting...
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref } from "vue";
import defaultImage from "../assets/image/Logo.png";
import { useProductStore } from '@/store/productStore';
import DialogPhone from '@/components/DialogPhone.vue';
import { toast } from 'vue3-toastify';
import Loader from "./Loader.vue";

const productStore = useProductStore();
const isDeleting = ref(false);
const showEditDialog = ref(false);
const showDeleteConfirm = ref(false);
const hasImageError = ref(false);
const emit = defineEmits(['deleted', 'updated']);

const props = defineProps({
  name: {
      type: String,
      default: "Product Name"
  },
  quantity: {
      type: Number,
      default: 0
  },
  image: {
      type: String,
      default: null
  },
  id: {
      type: Number,
      required: true
  },
  productData: {
      type: Object,
      required: true
  }
});

const getInventoryStatusClasses = (stock) => {
  if (stock === 0) {
    return 'bg-gray-100 text-gray-800';
  } else if (stock <= 3) {
    return 'bg-red-100 text-red-800';
  } else if (stock <= 10) {
    return 'bg-yellow-100 text-yellow-800';
  } else {
    return 'bg-green-100 text-green-800';
  }
};

const openEditDialog = () => {
  showEditDialog.value = true;
};

const handleUpdateSuccess = () => {
  emit('updated', props.id);
};

const confirmDelete = () => {
  showDeleteConfirm.value = true;
};

const cancelDelete = () => {
  showDeleteConfirm.value = false;
};

const handleDelete = async () => {
  isDeleting.value = true;
  try {
    const success = await productStore.deleteProduct(props.id);
    if (success) {
      toast.success(`${props.name} has been successfully deleted`);
      emit('deleted', props.id);
    } else {
      toast.error("Failed to delete the product. Please try again.");
    }
  } catch (error) {
    if (error.message && error.message.includes('constraint')) {
      toast.error(
        "This product cannot be deleted because it's currently in use (it may be in orders or cart items).",
        { autoClose: 5000 }
      );
    } else {
      toast.error("An error occurred while deleting the product.");
    }
  } finally {
    isDeleting.value = false;
    showDeleteConfirm.value = false;
  }
};

const handleImageError = () => {
  hasImageError.value = true;
};
</script>
