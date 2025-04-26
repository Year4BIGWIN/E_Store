<template>
  <tr class="border-t border-gray-200 hover:bg-gray-50 transition-colors">
    <!-- Product Image -->
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
    
    <!-- Product Details -->
    <td class="p-4">
      <h3 class="font-semibold text-gray-800">{{ name }}</h3>
      <p class="text-xs text-gray-500">ID: #{{ id }}</p>
    </td>

    <td class="p-4">
      <span class="text-gray-800 font-medium">$ {{ productData.price }}</span>
    </td>

    <td class="p-4">
      <span class="text-gray-800 font-medium">{{ productData.productType.name }}</span>
    </td>
    
    <!-- Inventory with dynamic styling -->
    <td class="p-4">
      <span 
        class="px-2.5 py-1 text-xs font-medium rounded-full"
        :class="getInventoryStatusClasses(quantity)"
      >
        {{ quantity }} in stock
      </span>
    </td>
    
    <!-- Actions -->
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
          <svg v-if="!isDeleting" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="animate-spin h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ isDeleting ? 'Deleting' : 'Delete' }}
        </button>
      </div>
    </td>
  </tr>
  
  <!-- Product Edit Dialog -->
  <DialogPhone 
    v-model:showDialog="showEditDialog" 
    :isEditMode="true" 
    :currentProduct="productData"
    @updatesuccess="handleUpdateSuccess" 
  />
</template>

<script setup>
import { defineProps, defineEmits, ref } from "vue";
import defaultImage from "../assets/image/Logo.png";
import { useProductStore } from '@/store/productStore';
import DialogPhone from '@/components/DialogPhone.vue';

const productStore = useProductStore();
const isDeleting = ref(false);
const showEditDialog = ref(false);
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

// Add the getInventoryStatusClasses function
const getInventoryStatusClasses = (stock) => {
  if (stock === 0) {
    return 'bg-gray-100 text-gray-800'; // Out of stock
  } else if (stock <= 3) {
    return 'bg-red-100 text-red-800'; // Very low stock
  } else if (stock <= 10) {
    return 'bg-yellow-100 text-yellow-800'; // Low stock
  } else {
    return 'bg-green-100 text-green-800'; // Plenty of stock
  }
};

const openEditDialog = () => {
  showEditDialog.value = true;
};

const handleUpdateSuccess = () => {
  emit('updated', props.id);
};

const confirmDelete = () => {
  if (confirm(`Are you sure you want to delete ${props.name}?`)) {
    handleDelete();
  }
};

const handleDelete = async () => {
  isDeleting.value = true;
  try {
    const success = await productStore.deleteProduct(props.id);
    if (success) {
      console.log("Product deleted");
      emit('deleted', props.id);
    } else {
      console.log("Failed to delete product");
      alert("Failed to delete the product. Please try again.");
    }
  } catch (error) {
    console.error("Error deleting product:", error);
    alert("An error occurred while deleting the product.");
  } finally {
    isDeleting.value = false;
  }
};

const handleImageError = () => {
  hasImageError.value = true;
};
</script>