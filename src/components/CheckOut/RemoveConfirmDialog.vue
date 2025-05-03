<script setup>
import DialogInfo from "@/components/DialogInfo.vue";

defineProps({
  show: Boolean,
  itemName: String
});

const emit = defineEmits(['confirm', 'cancel']);
</script>

<template>
  <Teleport to="body">
    <DialogInfo
      title="Remove Item"
      :show="show"
      @close="emit('cancel')"
      class="remove-dialog"
    >
      <div class="p-3 text-center">
        <p class="text-gray-700 mb-4">
          Are you sure you want to remove {{ itemName || 'this item' }} from your cart?
        </p>
        
        <div class="flex justify-center gap-3">
          <button 
            @click="emit('cancel')" 
            class="px-4 py-1.5 border rounded-lg hover:bg-gray-100"
          >
            Cancel
          </button>
          <button 
            @click="emit('confirm')" 
            class="px-4 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Remove
          </button>
        </div>
      </div>
    </DialogInfo>
  </Teleport>
</template>

<style scoped>
.remove-dialog :deep(.bg-white) {
  max-width: 300px;
}
</style>