<template>
  <div class="w-[270px] px-4 py-4 bg-white flex flex-col items-center rounded-xl">
      <img :src="image || defaultImage" alt="Product Image" class="w-full h-[120px] object-cover rounded-xl" />
      <div class="w-full flex flex-col items-center justify-between gap-2">
          <h1 class="text-lg">{{ name }}</h1>
          <h1 class="text sm">{{ quantity }}</h1>
          <div class="w-full flex justify-between">
              <button @click="openEditDialog" class="w-full border px-4 py-2 hover:bg-black rounded-full text-white bg-blue-500">Edit</button>
              <button 
                @click="confirmDelete" 
                class="w-full border px-4 py-2 hover:bg-black rounded-full text-white bg-red-500"
                :disabled="isDeleting"
              >
                {{ isDeleting ? 'Deleting...' : 'Delete' }}
              </button>
          </div>
      </div>
  </div>
  
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
</script>