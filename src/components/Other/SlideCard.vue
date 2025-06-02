<template>
  <div
    class="relative w-full rounded-lg overflow-hidden shadow-md my-2.5 transition-all duration-300 ease-in-out bg-white group hover:-translate-y-1 hover:shadow-lg"
    :class="{ 'border-2 border-green-500 ring-2 ring-green-500/30': active }"
  >
    <div class="relative h-[100px] overflow-hidden">
      <img
        :src="imageUrl"
        alt="Slide image"
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div
        class="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent px-2.5 py-4"
      >
        <div class="p-0 text-white">
          <p
            v-if="title"
            class="m-0 font-bold whitespace-nowrap overflow-hidden text-ellipsis text-lg"
          >
            {{ title }}
          </p>
        </div>
      </div>
    </div>
    <div class="flex justify-between p-3 bg-gray-50">
      <button
        class="px-3 py-2 border-0 rounded-md cursor-pointer text-sm flex items-center gap-1.5 transition-all duration-200 bg-blue-500 text-white hover:bg-blue-600"
        @click="handleEdit"
      >
        <i class="fas fa-edit"></i> Edit
      </button>
      <button
        class="px-3 py-2 border-0 rounded-md cursor-pointer text-sm flex items-center gap-1.5 transition-all duration-200 bg-red-500 text-white hover:bg-red-600"
        @click="showDeleteDialog"
      >
        <i class="fas fa-trash"></i> Delete
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
      <p class="text-gray-700 mb-6">Are you sure you want to delete this slide? This action cannot be undone.</p>
      
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
import { ref } from 'vue';
import DialogInfo from '@/components/DialogInfo.vue';
import useAuth from '@/composable/useAuth';
import { toast } from "vue3-toastify";  

const apiUrl = import.meta.env.VITE_APP_API_URL;
const authStore = useAuth();
const token = authStore.getToken();  
const props = defineProps({
  id: {
    type: [Number, String],
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["edit", "refresh"]);  // Changed emit to include refresh
const showDeleteConfirm = ref(false);

function handleEdit() {
  emit("edit", props.id);
}

function showDeleteDialog() {
  showDeleteConfirm.value = true;
}

async function confirmDelete() {
  try {
    // Using axios or fetch is fine - I'll keep your existing fetch approach
    const response = await fetch(`${apiUrl}/slide/${props.id}`, {  // Changed "slides" to "slide" to match API
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete slide');
    }

    toast.success('Slide deleted successfully');
    emit("refresh");  // Emit refresh event to update the parent's slide list
    showDeleteConfirm.value = false;
  } catch (error) {
    console.error('Error deleting slide:', error);
    toast.error('Failed to delete slide');
  }
}
</script>
